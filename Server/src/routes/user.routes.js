const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getCurrentUser, updateCurrentUser, getMyRegistrations, getSessionBookmarks, addSessionBookmark, removeSessionBookmark } = require('../controllers/user.controller');
const { createSupportRequest, getMySupportRequests } = require('../controllers/supportRequest.controller');

router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);
router.get('/me/registrations', protect, getMyRegistrations);
router.get('/me/session-bookmarks', protect, getSessionBookmarks);
router.post('/me/session-bookmarks', protect, addSessionBookmark);
router.delete('/me/session-bookmarks/:sessionId', protect, removeSessionBookmark);
router.get('/me/support-requests', protect, getMySupportRequests);
router.post('/me/support-requests', protect, createSupportRequest);

module.exports = router;

