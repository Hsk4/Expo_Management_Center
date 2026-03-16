const Notification = require('../models/notification.model');

exports.getMyNotifications = async (req, res) => {
    try {
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
        const page = Math.max(1, Number(req.query.page) || 1);

        const [items, total, unreadCount] = await Promise.all([
            Notification.find({ recipientId: req.user._id })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Notification.countDocuments({ recipientId: req.user._id }),
            Notification.countDocuments({ recipientId: req.user._id, isRead: false }),
        ]);

        res.status(200).json({
            success: true,
            data: items,
            page,
            limit,
            total,
            unreadCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUnreadNotificationCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({ recipientId: req.user._id, isRead: false });
        res.status(200).json({ success: true, data: { unreadCount } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipientId: req.user._id },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { recipientId: req.user._id, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            data: { modifiedCount: result.modifiedCount || 0 },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

