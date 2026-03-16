const BoothApplication = require('../models/boothApplication.model');
const Booth = require('../models/booth.model');
const Expo = require('../models/expo.model');
const User = require('../models/user.model');

const createPaymentReference = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

// @desc    Submit booth application
// @route   POST /api/expos/:expoId/booths/:boothId/apply
// @access  Private (exhibitor)
exports.submitApplication = async (req, res) => {
    try {
        const { expoId, boothId } = req.params;
        const { answers, companyProfile } = req.body;
        const exhibitorId = req.user._id;

        if (!companyProfile?.companyName) {
            return res.status(400).json({ success: false, message: 'Company name is required' });
        }

        // Check if expo exists
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ success: false, message: 'Expo not found' });
        }

        // Check if booth exists and is available
        const booth = await Booth.findById(boothId);
        if (!booth) {
            return res.status(404).json({ success: false, message: 'Booth not found' });
        }

        if (booth.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Booth is not available' });
        }

        // Check if exhibitor already has a booth or pending application in this expo
        const existingApplication = await BoothApplication.findOne({
            expoId,
            exhibitorId,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending or approved booth application for this expo'
            });
        }

        // Create application
        const application = await BoothApplication.create({
            expoId,
            boothId,
            exhibitorId,
            companyProfile,
            answers,
            paymentStatus: 'unpaid',
            paymentAmount: expo.paymentAmount || 499,
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully. Complete payment to confirm booth allotment.',
            data: application
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Pay for booth application and auto-allot booth
// @route   POST /api/expos/booth-applications/:applicationId/pay
// @access  Private (exhibitor)
exports.payForApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { paymentMethod = 'card', cardNumber = '' } = req.body || {};

        const application = await BoothApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.exhibitorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to pay for this application' });
        }

        if (application.status === 'rejected') {
            return res.status(400).json({ success: false, message: 'Rejected applications cannot be paid' });
        }

        if (application.paymentStatus === 'paid') {
            return res.status(200).json({ success: true, message: 'Application payment already completed', data: application });
        }

        const booth = await Booth.findById(application.boothId);
        if (!booth || booth.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Booth is no longer available' });
        }

        const exhibitorUser = await User.findById(application.exhibitorId).select('name email bookedBooths');
        if (!exhibitorUser) {
            return res.status(404).json({ success: false, message: 'Exhibitor not found' });
        }

        const alreadyBooked = exhibitorUser.bookedBooths.some(
            (entry) => entry.expoId.toString() === application.expoId.toString()
        );
        if (alreadyBooked) {
            return res.status(400).json({ success: false, message: 'You already have a booked booth for this expo' });
        }

        application.paymentStatus = 'paid';
        application.paymentReference = createPaymentReference('APPPAY');
        application.paidAt = new Date();
        application.status = 'approved';
        application.reviewedAt = new Date();
        application.reviewedBy = null;

        booth.status = 'booked';
        booth.exhibitorId = application.exhibitorId;
        booth.exhibitorDetails = {
            companyName: application.companyProfile?.companyName || exhibitorUser.name || '',
            contactName: exhibitorUser.name || '',
            contactEmail: exhibitorUser.email || '',
            bannerImage: application.companyProfile?.bannerImage || '',
            website: application.companyProfile?.website || '',
            linkedin: application.companyProfile?.linkedin || '',
            instagram: application.companyProfile?.instagram || '',
            description: application.companyProfile?.description || '',
        };

        exhibitorUser.bookedBooths.push({
            expoId: application.expoId,
            boothId: application.boothId,
        });

        await Promise.all([
            application.save(),
            booth.save(),
            exhibitorUser.save(),
            Expo.findByIdAndUpdate(application.expoId, { $inc: { boothsBookedCount: 1 } }),
        ]);

        res.json({
            success: true,
            message: 'Payment successful. Booth has been allotted.',
            data: {
                applicationId: application._id,
                status: application.status,
                paymentStatus: application.paymentStatus,
                paymentMethod,
                cardLast4: cardNumber ? String(cardNumber).replace(/\D/g, '').slice(-4) : '',
                paymentReference: application.paymentReference,
            },
        });
    } catch (error) {
        console.error('Pay application error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get booth applications
// @route   GET /api/admin/booth-applications
// @access  Private (admin)
exports.getApplications = async (req, res) => {
    try {
        const { expoId, status } = req.query;

        const query = {};
        if (expoId) query.expoId = expoId;
        if (status) query.status = status;

        const applications = await BoothApplication.find(query)
            .populate('exhibitorId', 'name email')
            .populate('boothId', 'boothNumber row col')
            .populate('expoId', 'title location startDate endDate')
            .populate('reviewedBy', 'name email')
            .sort({ submittedAt: -1 });

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Approve booth application
// @route   POST /api/admin/booth-applications/:applicationId/approve
// @access  Private (admin)
exports.approveApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await BoothApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Application has already been reviewed' });
        }

        if (application.paymentStatus !== 'paid') {
            return res.status(400).json({ success: false, message: 'Application payment is pending' });
        }

        // Check if booth is still available
        const booth = await Booth.findById(application.boothId);
        if (!booth || booth.status !== 'available') {
            return res.status(400).json({ success: false, message: 'Booth is no longer available' });
        }

        const exhibitorUser = await User.findById(application.exhibitorId).select('name email');

        // Update booth status with exhibitor public profile details
        booth.status = 'booked';
        booth.exhibitorId = application.exhibitorId;
        booth.exhibitorDetails = {
            companyName: application.companyProfile?.companyName || exhibitorUser?.name || '',
            contactName: exhibitorUser?.name || '',
            contactEmail: exhibitorUser?.email || '',
            bannerImage: application.companyProfile?.bannerImage || '',
            website: application.companyProfile?.website || '',
            linkedin: application.companyProfile?.linkedin || '',
            instagram: application.companyProfile?.instagram || '',
            description: application.companyProfile?.description || '',
        };
        await booth.save();

        // Update application
        application.status = 'approved';
        application.reviewedAt = Date.now();
        application.reviewedBy = req.user._id;
        await application.save();

        // Update expo booth count
        await Expo.findByIdAndUpdate(
            application.expoId,
            { $inc: { boothsBookedCount: 1 } }
        );

        res.json({
            success: true,
            message: 'Application approved successfully',
            data: application
        });
    } catch (error) {
        console.error('Approve application error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Reject booth application
// @route   POST /api/admin/booth-applications/:applicationId/reject
// @access  Private (admin)
exports.rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { reason } = req.body;

        const application = await BoothApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Application has already been reviewed' });
        }

        // Update application
        application.status = 'rejected';
        application.rejectionReason = reason || 'Application did not meet requirements';
        application.reviewedAt = Date.now();
        application.reviewedBy = req.user._id;
        await application.save();

        res.json({
            success: true,
            message: 'Application rejected',
            data: application
        });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
