const express = require('express');
const router = express.Router();
const {register, login, forgotPassword, resetPassword} = require("../controllers/auth.controller");


// @route POST /api/auth/register
// @desc Register a new user
// @access Public
router.post('/register', register);

// @route POST /api/auth/login
// @desc Login user
// @access Public
router.post('/login', login);

// @route POST /api/auth/forgot-password
// @desc Request password reset
// @access Public
router.post('/forgot-password', forgotPassword);

// @route POST /api/auth/reset-password
// @desc Reset password with token
// @access Public
router.post('/reset-password', resetPassword);

module.exports = router;