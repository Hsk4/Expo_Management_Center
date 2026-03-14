const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getCurrentUser, updateCurrentUser, getMyRegistrations } = require('../controllers/user.controller');

router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);
router.get('/me/registrations', protect, getMyRegistrations);

module.exports = router;

