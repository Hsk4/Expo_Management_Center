const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getMyNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require('../controllers/notification.controller');

router.get('/me', protect, getMyNotifications);
router.get('/me/unread-count', protect, getUnreadNotificationCount);
router.patch('/me/read-all', protect, markAllNotificationsAsRead);
router.patch('/me/:id/read', protect, markNotificationAsRead);

module.exports = router;

