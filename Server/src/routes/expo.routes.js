const express = require('express');
const router = express.Router();
const {protect, authorize} = require("../middleware/auth.middleware");
const {createExpo, getAllExpos, getExpoById, updateExpo, deleteExpo,publishExpo, attendExpo, getExpoBooths, bookBooth, getAttendedHistory} = require("../controllers/expo.controller");
const { submitApplication, payForApplication } = require('../controllers/boothApplication.controller');

// @route POST /api/expos
// @desc Create a new expo
// @access Private (admin only)
router.post('/', protect, authorize('admin'), createExpo);

// @route GET /api/expos
// @desc Get all expos
// @access Public
router.get('/', getAllExpos);

// @route GET /api/expos/me/attended-history
// @desc Get attended history
// @access Private
router.get('/me/attended-history', protect, getAttendedHistory);

// @route POST /api/expos/booth-applications/:applicationId/pay
// @desc Pay for a booth application (simulation)
// @access Private (exhibitor)
router.post('/booth-applications/:applicationId/pay', protect, authorize('exhibitor'), payForApplication);

// @route GET /api/expos/:id
// @desc Get expo by ID
// @access Public
router.get('/:id', getExpoById);

// @route PUT /api/expos/:id
// @desc Update expo by ID
// @access Private (admin only)
router.put('/:id', protect, authorize('admin'), updateExpo);

// @route DELETE /api/expos/:id
// @desc Delete expo by ID
// @access Private (admin only)
router.delete('/:id', protect, authorize('admin'), deleteExpo);

// @route PATCH /api/expos/:id/publish
// @desc Update expo by ID
// @access Private (admin only)
router.patch("/:id/publish", protect, authorize('admin'), publishExpo);

// @route POST /api/expos/:id/attend
// @desc Attend an expo
// @access Private (attendee, exhibitor)
router.post('/:id/attend', protect, authorize('attendee', 'exhibitor'), attendExpo);

// @route GET /api/expos/:id/booths
// @desc Get expo booths
// @access Private (exhibitor, attendee)
router.get('/:id/booths', protect, authorize('exhibitor', 'attendee'), getExpoBooths);

// @route POST /api/expos/:id/booths/:boothId/book
// @desc Book an expo booth
// @access Private (exhibitor)
router.post('/:id/booths/:boothId/book', protect, authorize('exhibitor'), bookBooth);

// @route POST /api/expos/:expoId/booths/:boothId/apply
// @desc Submit booth application
// @access Private (exhibitor)
router.post('/:expoId/booths/:boothId/apply', protect, authorize('exhibitor'), submitApplication);

module.exports = router;