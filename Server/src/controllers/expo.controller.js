const Expo = require('../models/expo.model');
const Booth = require('../models/booth.model');
const User = require('../models/user.model');
const { generateBoothGrid } = require('../modules/booths/booth.service');
const { notifyExpoPublished, notifyUser } = require('../services/notification.service');

const createPaymentReference = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

// CREATES EXPO //

exports.createExpo = async (req, res) => {
    try{
        const{title, description, theme, location, startDate, endDate, maxBooths,maxAttendees, gridRows, gridCols, layout, sessions, paymentAmount, coverImageUrl} = req.body;

        const expo = await Expo.create({
            title,
            description,
            theme,
            location,
            startDate,
            endDate,
            maxBooths,
            maxAttendees,
            gridRows,
            gridCols,
            layout: layout || undefined,
            sessions: Array.isArray(sessions) ? sessions : [],
            paymentAmount,
            coverImageUrl,
            totalBoothsGenerated : gridRows * gridCols,
            createdBy : req.user._id,
        });

        const createdExpo = await Expo.findById(expo._id).populate('createdBy', 'name email role');

        res.status(201).json({
            success:true,
            message : "Expo created successfully",
            data: createdExpo,
        });
    }catch (error) {
        console.error('Create expo error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// GETS ALL EXPOS

exports.getAllExpos = async (req, res) => {
    try {
        const expos = await Expo.find().populate('createdBy', 'name email role').sort({createdAt : -1});
        res.status(200).json({
            success: true,
            count : expos.length,
            data : expos,
        })
    }catch (error) {
        res.status (500).json({
            success: false,
            message : error.message,
        })

    }
};

// GETS SINGLE EXPO

exports.getExpoById = async (req, res) => {
    try {
        const expo= await Expo.findById(req.params.id).populate('createdBy', 'name email role');
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        res.status(200).json({
            success: true,
            data : expo,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}
// DELETE EXPO
exports.deleteExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        await expo.deleteOne();
        res.status(200).json({
            success: true,
            message : "Expo deleted successfully",
        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}

// UPDATE EXPO

exports.updateExpo = async (req, res) => {
    try{
        const expo = await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        // prevent editing if already published
        if(expo.status === "published"){
            return res.status(400).json({
                success: false,
                message : "Cannot edit a published expo",
            })
        }
        Object.assign(expo, req.body);
        if (req.body.layout) {
            expo.layout = req.body.layout;
        }
        if (Array.isArray(req.body.sessions)) {
            expo.sessions = req.body.sessions;
        }
        await expo.save();

        const updatedExpo = await Expo.findById(expo._id).populate('createdBy', 'name email role');

        res.status(200).json({
            success: true,
            message : "Expo updated successfully",
            data : updatedExpo,
        })
    }catch (error) {
        res.status(400).json({
            success: false,
            message : error.message,
        })
    }
};

// PUBLISH EXPO

exports.publishExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if(!expo){
            return res.status(404).json({
                success: false,
                message : "Expo not found",
            })
        }
        if(expo.status !== "draft"){
            return res.status(400).json({
                success: false,
                message : "Only draft expos can be published",
            })
        }
        expo.status = "published";
        await expo.save();

        // generate booth grid (supports sparse/custom layouts)
        await generateBoothGrid(expo._id, expo.layout?.booths || []);

        const publishedExpo = await Expo.findById(expo._id).populate('createdBy', 'name email role');

        await notifyExpoPublished(publishedExpo);

        res.status(200).json({
            success: true,
            message : "Expo published successfully",
            data : publishedExpo,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}

exports.attendExpo = async (req, res) => {
    try {
        const seatsRequested = Number(req.body?.seatsBooked || 1);
        if (!Number.isInteger(seatsRequested) || seatsRequested < 1) {
            return res.status(400).json({ success: false, message: 'seatsBooked must be a positive integer' });
        }

        const expo = await Expo.findById(req.params.id);
        if (!expo) {
            return res.status(404).json({ success: false, message: 'Expo not found' });
        }

        if (expo.status !== 'published' || !expo.isActive) {
            return res.status(400).json({ success: false, message: 'Expo is not open for attendance' });
        }

        const user = await User.findById(req.user._id);
        const alreadyAttending = user.attendedExpos.some((entry) => entry.expoId.toString() === expo._id.toString());

        if (alreadyAttending) {
            return res.status(400).json({ success: false, message: 'You have already registered for this expo' });
        }

        if (expo.attendeesRegisteredCount + seatsRequested > expo.maxAttendees) {
            return res.status(400).json({ success: false, message: 'Expo attendee capacity is full' });
        }

        user.attendedExpos.push({
            expoId: expo._id,
            seatsBooked: seatsRequested,
            paymentStatus: 'paid',
            paymentReference: createPaymentReference('ATTPAY'),
            paymentAmount: expo.paymentAmount || 499,
            paidAt: new Date(),
        });
        expo.attendeesRegisteredCount += seatsRequested;

        await user.save();
        await expo.save();

        await notifyUser({
            userId: req.user._id,
            type: 'attendee-payment-approved',
            title: 'Attendance payment approved',
            message: `Your payment for ${expo.title} is confirmed (${seatsRequested} seat${seatsRequested > 1 ? 's' : ''}).`,
            metadata: { expoId: expo._id },
        });

        res.status(200).json({
            success: true,
            message: `Payment successful. ${seatsRequested} seat(s) booked for this expo.`,
            data: {
                seatsBooked: seatsRequested,
                remainingSeats: Math.max(expo.maxAttendees - expo.attendeesRegisteredCount, 0),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getExpoBooths = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if (!expo) {
            return res.status(404).json({ success: false, message: 'Expo not found' });
        }

        const booths = await Booth.find({ expoId: expo._id }).sort({ row: 1, col: 1 });

        res.status(200).json({
            success: true,
            data: {
                expoId: expo._id,
                gridRows: expo.gridRows,
                gridCols: expo.gridCols,
                booths,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bookBooth = async (req, res) => {
    try {
        const { id: expoId, boothId } = req.params;

        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ success: false, message: 'Expo not found' });
        }

        if (expo.status !== 'published' || !expo.isActive) {
            return res.status(400).json({ success: false, message: 'Expo is not open for booth booking' });
        }

        const booth = await Booth.findOne({ _id: boothId, expoId });
        if (!booth) {
            return res.status(404).json({ success: false, message: 'Booth not found for this expo' });
        }

        if (booth.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Selected booth is not available' });
        }

        const user = await User.findById(req.user._id);
        const alreadyBooked = user.bookedBooths.some((entry) => entry.expoId.toString() === expoId.toString());
        if (alreadyBooked) {
            return res.status(400).json({ success: false, message: 'You have already booked a booth for this expo' });
        }

        booth.status = 'booked';
        booth.exhibitorId = user._id;

        user.bookedBooths.push({ expoId, boothId: booth._id });

        if (!user.attendedExpos.some((entry) => entry.expoId.toString() === expoId.toString())) {
            user.attendedExpos.push({ expoId });
            if (expo.attendeesRegisteredCount < expo.maxAttendees) {
                expo.attendeesRegisteredCount += 1;
            }
        }

        expo.boothsBookedCount += 1;

        await booth.save();
        await user.save();
        await expo.save();

        res.status(200).json({ success: true, message: `Booth ${booth.boothNumber} booked successfully` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAttendedHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'attendedExpos.expoId',
            select: 'title theme location startDate endDate status',
        });

        const history = user.attendedExpos
            .filter((entry) => entry.expoId)
            .sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));

        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
