const express = require('express');
const router = express.Router();
const {protect, authorize} = require("../middleware/auth.middleware");
const {createExpo, getAllExpos, getExpoById, updateExpo, deleteExpo,publishExpo} = require("../controllers/expo.controller");

// @route POST /api/expos
// @desc Create a new expo
// @access Private (admin only)
router.post('/', protect, authorize('admin'), createExpo);

// @route GET /api/expos
// @desc Get all expos
// @access Public
router.get('/', getAllExpos);

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



// @route Patch /api/expos/:id/publish
// @desc Update expo by ID
// @access Private (admin only)
router.patch("/:id/publish", protect, authorize('admin'), publishExpo);




module.exports = router;