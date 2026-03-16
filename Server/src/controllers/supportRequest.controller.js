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

// @desc    Get all support requests (admin only)
// @route   GET /api/admin/support-requests
// @access  Private (admin)
exports.getAllSupportRequests = async (req, res) => {
    try {
        const { status, type, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (status && ['open', 'in-review', 'resolved'].includes(status)) filter.status = status;
        if (type && ['support', 'feedback'].includes(type)) filter.type = type;

        const requests = await SupportRequest.find(filter)
            .populate('userId', 'name email role')
            .populate('expoId', 'title location startDate endDate status')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await SupportRequest.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            data: requests,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update support request status (admin only)
// @route   PATCH /api/admin/support-requests/:id/status
// @access  Private (admin)
exports.updateSupportRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['open', 'in-review', 'resolved'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Valid status is required: open, in-review, or resolved' });
        }

        const request = await SupportRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate('userId', 'name email role')
            .populate('expoId', 'title location startDate endDate status');

        if (!request) {
            return res.status(404).json({ success: false, message: 'Support request not found' });
        }

        res.status(200).json({
            success: true,
            message: `Request marked as ${status}`,
            data: request,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

