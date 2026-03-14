const SupportRequest = require('../models/supportRequest.model');
const Expo = require('../models/expo.model');

// @desc    Create support or feedback request
// @route   POST /api/users/me/support-requests
// @access  Private
exports.createSupportRequest = async (req, res) => {
    try {
        const { type = 'support', subject, message, expoId } = req.body;

        if (!subject || subject.trim().length < 3) {
            return res.status(400).json({ success: false, message: 'Subject must be at least 3 characters long' });
        }

        if (!message || message.trim().length < 10) {
            return res.status(400).json({ success: false, message: 'Message must be at least 10 characters long' });
        }

        if (expoId) {
            const expo = await Expo.findById(expoId).select('_id');
            if (!expo) {
                return res.status(404).json({ success: false, message: 'Selected expo was not found' });
            }
        }

        const supportRequest = await SupportRequest.create({
            userId: req.user._id,
            role: req.user.role,
            type,
            subject: subject.trim(),
            message: message.trim(),
            expoId: expoId || null,
        });

        const createdRequest = await SupportRequest.findById(supportRequest._id)
            .populate('expoId', 'title location startDate endDate status');

        res.status(201).json({
            success: true,
            message: 'Your request has been submitted successfully',
            data: createdRequest,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get my support or feedback requests
// @route   GET /api/users/me/support-requests
// @access  Private
exports.getMySupportRequests = async (req, res) => {
    try {
        const requests = await SupportRequest.find({ userId: req.user._id })
            .populate('expoId', 'title location startDate endDate status')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: requests,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

