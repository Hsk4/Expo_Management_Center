const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { getApplications, approveApplication, rejectApplication } = require('../controllers/boothApplication.controller');
const { getAllSupportRequests, updateSupportRequestStatus } = require('../controllers/supportRequest.controller');

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
    res.json({
        message: 'Welcome to the admin dashboard',
        success: true,
        user: req.user.name,
    });
});

// @route GET /api/admin/booth-applications
// @desc Get booth applications
// @access Private (admin)
router.get('/booth-applications', protect, authorize('admin'), getApplications);

// @route POST /api/admin/booth-applications/:applicationId/approve
// @desc Approve booth application
// @access Private (admin)
router.post('/booth-applications/:applicationId/approve', protect, authorize('admin'), approveApplication);

// @route POST /api/admin/booth-applications/:applicationId/reject
// @desc Reject booth application
// @access Private (admin)
router.post('/booth-applications/:applicationId/reject', protect, authorize('admin'), rejectApplication);

// @route GET /api/admin/support-requests
// @desc Get all support / feedback requests
// @access Private (admin)
router.get('/support-requests', protect, authorize('admin'), getAllSupportRequests);

// @route PATCH /api/admin/support-requests/:id/status
// @desc Update status of a support request
// @access Private (admin)
router.patch('/support-requests/:id/status', protect, authorize('admin'), updateSupportRequestStatus);

module.exports = router;