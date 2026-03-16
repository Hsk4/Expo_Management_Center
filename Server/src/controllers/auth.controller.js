const User = require("../models/user.model");
const {generateToken, generateResetToken, hashResetToken, verifyResetToken} = require("../services/auth.services");
const {sendWelcomeEmail, sendPasswordResetEmail} = require("../services/email.services");

// REGISTER USER
exports.register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide all required fields: name, email, password",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
                success: false
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role: role || "attendee"
        });

        // Send welcome email (non-blocking, don't fail registration if email fails)
        setImmediate(async () => {
            try {
                await sendWelcomeEmail(user);
            } catch (emailError) {
                console.error("Failed to send welcome email:", emailError.message);
            }
        });

        // Generate token
        const token = generateToken(user);

        // Return user data (without password)
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({
            message: error.message || "Error registering user",
            success: false
        });
    }
};

// LOGIN USER

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                message : "Invalid email or password",
                success: false,
            });
        }
        // check if password matches
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid email or password",
                success: false,
            });
        }
        // check if user is still active
        if(!user.isActive){
            return res.status(403).json({
                message : "Account is deactivated. Please contact support.",
                success: false,
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success : true,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message : error.message,
        })
    }
}

// FORGOT PASSWORD - Request password reset
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // Security: Don't reveal if email exists
            return res.status(200).json({
                message: "If an account with that email exists, you will receive password reset instructions",
                success: true,
            });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const hashedToken = await hashResetToken(resetToken);

        // Save token and expiry (15 minutes)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send email
        try {
            await sendPasswordResetEmail(user, resetToken);
        } catch (emailError) {
            // Rollback token if email fails
            user.resetPasswordToken = null;
            user.resetPasswordExpiry = null;
            await user.save();

            return res.status(500).json({
                message: "Error sending email. Please try again.",
                success: false,
            });
        }

        res.status(200).json({
            message: "If an account with that email exists, you will receive password reset instructions",
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// RESET PASSWORD - Verify token and update password
exports.resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword, confirmPassword } = req.body;

        if (!email || !token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false,
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false,
            });
        }

        // Find user and get reset token fields
        const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpiry");

        if (!user) {
            return res.status(400).json({
                message: "Invalid reset link",
                success: false,
            });
        }

        // Check if token exists and hasn't expired
        if (!user.resetPasswordToken || !user.resetPasswordExpiry) {
            return res.status(400).json({
                message: "Invalid or expired reset link",
                success: false,
            });
        }

        if (Date.now() > user.resetPasswordExpiry) {
            user.resetPasswordToken = null;
            user.resetPasswordExpiry = null;
            await user.save();

            return res.status(400).json({
                message: "Reset link has expired",
                success: false,
            });
        }

        // Verify token
        const isValidToken = await verifyResetToken(token, user.resetPasswordToken);
        if (!isValidToken) {
            return res.status(400).json({
                message: "Invalid reset link",
                success: false,
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        res.status(200).json({
            message: "Password has been reset successfully",
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}