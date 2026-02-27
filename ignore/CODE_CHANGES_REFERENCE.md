# Code Changes Reference

## Detailed File Modifications

### SERVER-SIDE CHANGES

---

## 1. `Server/src/models/user.model.js`

**Change Type:** Schema Update

**Added Fields:**
```javascript
resetPasswordToken : {
    type : String,
    select : false,
    default : null
},
resetPasswordExpiry : {
    type : Date,
    select : false,
    default : null
}
```

**Purpose:** Store hashed reset token and expiration time. Both fields are hidden by default with `select: false` to prevent leaking token info in normal queries.

---

## 2. `Server/src/services/auth.services.js`

**Change Type:** Service Enhancement

**Added Imports:**
```javascript
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
```

**New Functions Added:**

```javascript
// Generate a reset token (random string)
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash the reset token for storage
const hashResetToken = async (token) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(token, salt);
};

// Verify if the provided reset token matches the stored hash
const verifyResetToken = async (providedToken, storedHash) => {
    return await bcrypt.compare(providedToken, storedHash);
};
```

**Updated Exports:**
- Added `generateResetToken` to module.exports
- Added `hashResetToken` to module.exports
- Added `verifyResetToken` to module.exports

---

## 3. `Server/src/services/email.services.js`

**Change Type:** Email Service Extension

**New Function Added:**

```javascript
const sendPasswordResetEmail = async (user, resetToken) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${user.email}`;

    const mailOptions = {
        from: `"EventSphere Team" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request - EventSphere",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#4f46e5;">Password Reset Request</h2>
        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          We received a request to reset your password. Click the button below to reset it.
        </p>

        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color:#4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Or copy and paste this link in your browser:<br/>
          <code style="background: #f0f0f0; padding: 8px; border-radius: 4px;">${resetLink}</code>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 15 minutes.<br/>
          If you didn't request this, please ignore this email.
        </p>

        <hr style="margin:20px 0;" />

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>EventSphere Management Team</strong>
        </p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};
```

**Updated Exports:**
- Changed from `module.exports = { sendWelcomeEmail };`
- To `module.exports = { sendWelcomeEmail, sendPasswordResetEmail };`

---

## 4. `Server/src/controllers/auth.controller.js`

**Change Type:** Controller Enhancement

**Updated Imports:**
```javascript
const {generateToken, generateResetToken, hashResetToken, verifyResetToken} = require("../services/auth.services");
const {sendWelcomeEmail, sendPasswordResetEmail} = require("../services/email.services");
```

**New Handler 1: forgotPassword()**
```javascript
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
```

**New Handler 2: resetPassword()**
```javascript
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
```

---

## 5. `Server/src/routes/auth.routes.js`

**Change Type:** Route Configuration

**Before:**
```javascript
const express = require('express');
const router = express.Router();
const {register, login} = require("../controllers/auth.controller");

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

**After:**
```javascript
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
```

---

### CLIENT-SIDE CHANGES

---

## 6. `Client/src/services/auth.service.ts`

**Change Type:** Service Enhancement

**Added Interfaces:**
```typescript
interface ForgotPasswordData {
    email: string;
}

interface ResetPasswordData {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}
```

**Added Functions:**
```typescript
export const forgotPassword = async (data: ForgotPasswordData) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
};
```

---

## 7. `Client/src/routes/App.routes.tsx`

**Change Type:** Route Configuration

**Added Imports:**
```typescript
import ForgotPasswordPage from "../features/auth/pages/ForgotPassword.page.tsx"
import ResetPasswordPage from "../features/auth/pages/ResetPassword.page.tsx"
```

**Added Routes:**
```typescript
{/* Password Reset Routes */}
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

---

## 8. `Client/src/features/auth/components/LoginForm.tsx`

**Change Type:** Link Update

**Before:**
```typescript
<a
    href="#"
    className={`text-sm ${accent} hover:underline`}
>
    Forgot password?
</a>
```

**After:**
```typescript
<a
    href="/forgot-password"
    className={`text-sm ${accent} hover:underline`}
>
    Forgot password?
</a>
```

---

## 9. `Client/src/features/auth/pages/ForgotPassword.page.tsx` (NEW FILE)

**Type:** New React Component

**Key Features:**
- Email input form with validation
- Loading state management
- Success notification with email confirmation
- Auto-redirect to login (3 seconds)
- Error handling
- Uses existing AuthLayout component
- Responsive Tailwind CSS design
- ~108 lines of code

---

## 10. `Client/src/features/auth/pages/ResetPassword.page.tsx` (NEW FILE)

**Type:** New React Component

**Key Features:**
- Query parameter extraction (token, email)
- Token and email validation
- New password input
- Confirm password input
- Client-side password validation
- Server-side error handling
- Auto-redirect to login on success (2 seconds)
- Invalid token detection
- Uses existing AuthLayout component
- Responsive Tailwind CSS design
- ~147 lines of code

---

## Environment Variables Required

### Server/.env
```env
MONGODB_URI=mongodb://localhost:27017/expo_management
PORT=5000
JWT_ACCESS_SECRET=your_jwt_secret_key_here
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Server files modified | 5 |
| Server files created | 0 |
| Client files modified | 3 |
| Client files created | 2 |
| New API endpoints | 2 |
| New React components | 2 |
| New utility functions | 3 |
| Lines of code added | ~600 |
| Documentation files | 4 |

---

## Dependencies (Already Installed)

- ✅ `nodemailer@^8.0.1` - Email delivery
- ✅ `bcryptjs@^3.0.3` - Password hashing
- ✅ `jsonwebtoken@^9.0.3` - JWT tokens
- ✅ `react-router-dom@^7.13.1` - Client routing
- ✅ `axios@^1.13.5` - HTTP client
- ✅ Node.js built-in `crypto` - Token generation

No new dependencies need to be installed!

---

**Implementation Status:** ✅ COMPLETE
**All files have been modified or created successfully**
**Ready for testing and deployment**

