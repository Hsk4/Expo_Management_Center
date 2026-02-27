# EventSphere - Expo Management Center
## Complete Project Documentation

**Generated:** February 28, 2026  
**Project Type:** Full-Stack MERN Application with TypeScript & React

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Technology Stack](#technology-stack)
4. [Server Code](#server-code)
5. [Client Code](#client-code)
6. [Environment Configuration](#environment-configuration)
7. [Setup Instructions](#setup-instructions)

---

## Project Overview

EventSphere is a modern multi-expo management platform designed to simplify the complex coordination between organizers, exhibitors, and attendees. The platform features:

- **Role-Based Access Control**: Admin, Exhibitor, and Attendee roles
- **Authentication System**: JWT-based auth with password reset via email
- **Real-Time Updates**: Modern, responsive UI with Three.js animations
- **Protected Routes**: Secure navigation based on user roles
- **Attendee Features**: 
  - Landing page with login/register
  - Profile dropdown with logout
  - Expos page for browsing events
  - Navigation between home sections from any page

---

## Folder Structure

```
Expo_Management_Center/
│
├── Client/                          # React + TypeScript Frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Auth.layout.tsx
│   │   │   │   └── Root.layout.tsx
│   │   │   ├── three/
│   │   │   │   └── BackgroundScene.tsx
│   │   │   └── ui/
│   │   │       ├── GlassCard.tsx
│   │   │       └── Reveal.tsx
│   │   ├── contexts/
│   │   │   └── Auth.context.tsx
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   │   └── pages/
│   │   │   │       └── Dashboard.page.tsx
│   │   │   ├── attendee/
│   │   │   │   └── pages/
│   │   │   │       ├── HomePage.tsx
│   │   │   │       └── ExposPage.tsx
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── RegisterForm.tsx
│   │   │   │   ├── pages/
│   │   │   │   │   ├── AdminLogin.page.tsx
│   │   │   │   │   ├── AdminRegister.page.tsx
│   │   │   │   │   ├── AttendeeLogin.page.tsx
│   │   │   │   │   ├── AttendeeRegister.page.tsx
│   │   │   │   │   ├── ExhabitorLogin.page.tsx
│   │   │   │   │   ├── ExhibitorRegister.page.tsx
│   │   │   │   │   ├── ForgotPassword.page.tsx
│   │   │   │   │   └── ResetPassword.page.tsx
│   │   │   │   ├── authService.ts
│   │   │   │   └── type.ts
│   │   │   ├── exhibitor/
│   │   │   │   └── pages/
│   │   │   │       └── Dashboard.page.tsx
│   │   │   └── landing/
│   │   │       ├── components/
│   │   │       │   ├── AboutSection.component.tsx
│   │   │       │   ├── FeatureHighlights.components.tsx
│   │   │       │   ├── GallerySection.component.tsx
│   │   │       │   ├── HeroSection.component.tsx
│   │   │       │   ├── ShowcaseSection.component.tsx
│   │   │       │   └── Support.component.tsx
│   │   │       └── pages/
│   │   │           └── Home.page.tsx
│   │   ├── routes/
│   │   │   ├── App.routes.tsx
│   │   │   └── protected.routes.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.service.ts
│   │   ├── utils/
│   │   │   └── nav.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── Readme.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── Server/                          # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   └── auth.routes.js
│   │   ├── services/
│   │   │   ├── auth.services.js
│   │   │   └── email.services.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   ├── Readme.md
│   └── server.js
│
└── ignore/                          # Documentation Files
    ├── CODE_CHANGES_REFERENCE.md
    ├── DOCUMENTATION_INDEX.md
    ├── ENV_SETUP.md
    ├── IMPLEMENTATION_CHECKLIST.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── QUICK_REFERENCE.md
    ├── README.md
    ├── RESET_PASSWORD_FEATURE.md
    └── UI_FLOW_GUIDE.md
```

---

## Technology Stack

### Frontend
- **React 19.2.0** with TypeScript
- **Vite 7.3.1** - Build tool
- **TailwindCSS 4.2.1** - Styling
- **React Router DOM 7.13.1** - Routing
- **Axios 1.13.5** - HTTP client
- **Framer Motion 12.34.3** - Animations
- **Three.js 0.183.1** - 3D background effects

### Backend
- **Node.js** with Express 5.2.1
- **MongoDB** with Mongoose 9.2.3
- **JWT** (jsonwebtoken 9.0.3) - Authentication
- **bcryptjs 3.0.3** - Password hashing
- **Nodemailer 8.0.1** - Email service
- **Helmet 8.1.0** - Security headers
- **CORS 2.8.6** - Cross-origin requests
- **Socket.io 4.8.3** - Real-time communication
- **Express Rate Limit 8.2.1** - API rate limiting

---

## Server Code

### 1. Server Entry Point

**File:** `Server/server.js`

```javascript
const http = require('http');
const app = require('./src/app');
const connectDb = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// connection to mongo db
connectDb();

// create HTTP server 
const server = http.createServer(app);

// listen for requests

server.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})
```

---

### 2. Express App Configuration

**File:** `Server/src/app.js`

```javascript
const express = require('express');
const cors = require ('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const app = express();
const adminRoutes = require('./routes/admin.routes');

// security headers
app.use(helmet());

// rate limiter 
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000, // 15 minutes
    max : 200 // limit each IP to 200 requests per windowMs
});

app.use(limiter);
app.use(morgan('dev'));

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/" , (req, res) => {
    res.status(200).json({message: "Welcome to the Expo Management API", success : true});
});

app.get("/api/health", (req, res)=> {
    res.status(200).json({message: "API is up and running", success : true});
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
```

---

### 3. Database Configuration

**File:** `Server/src/config/db.js`

```javascript
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    }
    catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
};

module.exports = connectDB;
```

---

### 4. User Model

**File:** `Server/src/models/user.model.js`

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// for attendee --> Track visited expos
const attendeeSchema = new mongoose.Schema({
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : true
    },
    visitedAt : {
        type : Date,
        default : Date.now
    },
}, {_id: false})

const exhibitorSchema = new mongoose.Schema({
    expoId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Expo",
        required : true
    },
    boothId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Booth",
        required : true
    },
    bookedAt:{
        type : Date,
        default : Date.now
    },
}, {_id: false})

// main schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true
    },
    email: {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase : true,
        trim : true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [6, "Password must be at least 6 characters long"],
        select : false ,
    },
    role : {
      type : String,
        enum : ["attendee", "admin", "exhibitor"],
        default : "attendee"
    },
    isActive:{
        type : Boolean,
        default : true
    },
    attendedExpos : {type :[attendeeSchema], default : []},
    bookedBooths : {type : [exhibitorSchema], default : []},
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
},{
    timestamps : true
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

---

### 5. Authentication Controller

**File:** `Server/src/controllers/auth.controller.js`

```javascript
const User = require('../models/user.model');
const {generateAccessToken} = require('../services/auth.services');
const crypto = require('crypto');
const {sendPasswordResetEmail} = require('../services/email.services');

// Register User
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

        // Generate token
        const token = generateAccessToken(user._id);

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
        console.error("Registration Error:", error);
        res.status(500).json({
            message: error.message || "Error registering user",
            success: false
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
                success: false
            });
        }

        // Find user and include password
        const user = await User.findOne({email}).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been deactivated. Please contact support.",
                success: false
            });
        }

        // Generate token
        const token = generateAccessToken(user._id);

        // Return user data
        res.status(200).json({
            message: "Login successful",
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
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Error logging in",
            success: false
        });
    }
};

// Logout User
exports.logout = async (req, res) => {
    try {
        res.status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging out",
            success: false
        });
    }
};

// Request Password Reset
exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide an email",
                success: false
            });
        }

        // Find user
        const user = await User.findOne({email}).select('+resetPasswordToken +resetPasswordExpiry');
        if (!user) {
            return res.status(404).json({
                message: "No user found with this email",
                success: false
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save token to user (expires in 15 minutes)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${email}`;

        // Send email
        try {
            await sendPasswordResetEmail(user.email, user.name, resetUrl);

            res.status(200).json({
                message: "Password reset email sent successfully",
                success: true
            });
        } catch (emailError) {
            // Clear token if email fails
            user.resetPasswordToken = null;
            user.resetPasswordExpiry = null;
            await user.save();

            console.error("Email Error:", emailError);
            return res.status(500).json({
                message: "Error sending reset email. Please try again.",
                success: false
            });
        }

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({
            message: "Error processing password reset request",
            success: false
        });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const {email, token, newPassword, confirmPassword} = req.body;

        // Validate input
        if (!email || !token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Please provide all required fields",
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false
            });
        }

        // Hash the token from URL
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: {$gt: Date.now()}
        }).select('+resetPasswordToken +resetPasswordExpiry +password');

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
                success: false
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully",
            success: true
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({
            message: "Error resetting password",
            success: false
        });
    }
};
```

---

### 6. Authentication Services

**File:** `Server/src/services/auth.services.js`

```javascript
const jwt = require('jsonwebtoken');

exports.generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d' }
    );
};

exports.generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d' }
    );
};

exports.verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

exports.verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
```

---

### 7. Email Services

**File:** `Server/src/services/email.services.js`

```javascript
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send Password Reset Email
exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `EventSphere <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - EventSphere',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>EventSphere</h1>
                            <p>Password Reset Request</p>
                        </div>
                        <div class="content">
                            <p>Hello ${name},</p>
                            <p>We received a request to reset your password for your EventSphere account.</p>
                            <p>Click the button below to reset your password:</p>
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
                            <p><strong>This link will expire in 15 minutes.</strong></p>
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            <p>Best regards,<br>The EventSphere Team</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 EventSphere. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return info;

    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

// Send Welcome Email
exports.sendWelcomeEmail = async (email, name, role) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `EventSphere <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to EventSphere!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to EventSphere!</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${name},</p>
                            <p>Thank you for registering as a <strong>${role}</strong> on EventSphere!</p>
                            <p>We're excited to have you on board. You can now access all the features available for your role.</p>
                            <p>If you have any questions, feel free to reach out to our support team.</p>
                            <p>Best regards,<br>The EventSphere Team</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 EventSphere. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return info;

    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};
```

---

### 8. Authentication Middleware

**File:** `Server/src/middleware/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // expect token in header
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({message : "Not authorized, no token", success : false});
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(401).json({message : "Not authorized, user not found", success : false});
        }
        // attach user to request
        req.user = user;
        next();

    }catch(error) {
        res.status(401).json({message : "Not authorized, token failed", success : false});
    }
}

exports.authorize = (...roles) => {
    return async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message : "Forbidden, you don't have permission to access this resource", success : false});
        }
        next();
    };
}
```

---

### 9. Authentication Routes

**File:** `Server/src/routes/auth.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
```

---

### 10. Admin Routes

**File:** `Server/src/routes/admin.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const {protect, authorize} = require("../middleware/auth.middleware");

router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
    res.json({
        message : "Welcome to the admin dashboard",
        success : true,
        user : req.user.name,
    })
})

module.exports = router;
```

---

### 11. Package Configuration

**File:** `Server/package.json`

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "colors": "^1.4.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "express-rate-limit": "^8.2.1",
    "google-auth-library": "^10.6.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.2.3",
    "morgan": "^1.10.1",
    "nodemailer": "^8.0.1",
    "socket.io": "^4.8.3"
  },
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## Client Code

### 1. Main Entry Point

**File:** `Client/src/main.tsx`

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import './index.css'
import App from './App.tsx'
import {AuthProvider} from "./contexts/Auth.context.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>
        <App />
          </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
```

---

### 2. App Component

**File:** `Client/src/App.tsx`

```typescript
import './App.css'
import AppRoutes from "./routes/App.routes.tsx";

function App() {
  return(
      <AppRoutes/>
    )
}

export default App
```

---

### 3. Authentication Context

**File:** `Client/src/contexts/Auth.context.tsx`

```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
    id: string
    email: string
    role: "admin" | "exhibitor" | "attendee"
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    // Restore auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
                setToken(storedToken)
            } catch (error) {
                console.error("Failed to parse stored user data", error)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        }
    }, [])

    const login = (user: User, token: string) => {
        setUser(user)
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
```

---

### 4. API Service

**File:** `Client/src/services/api.ts`

```typescript
import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
})

export default api;
```

---

### 5. Auth Service

**File:** `Client/src/services/auth.service.ts`

```typescript
import api from "./api"

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    name: string
    email: string
    password: string
    role: "admin" | "exhibitor" | "attendee"
}

interface ForgotPasswordData {
    email: string
}

interface ResetPasswordData {
    email: string
    token: string
    newPassword: string
    confirmPassword: string
}

export const loginUser = async (data: LoginData) => {
    const response = await api.post("/auth/login", data)
    return response.data
}

export const registerUser = async (data: RegisterData) => {
    const response = await api.post("/auth/register", data)
    return response.data
}

export const forgotPassword = async (data: ForgotPasswordData) => {
    const response = await api.post("/auth/forgot-password", data)
    return response.data
}

export const resetPassword = async (data: ResetPasswordData) => {
    const response = await api.post("/auth/reset-password", data)
    return response.data
}
```

---

### 6. Routes Configuration

**File:** `Client/src/routes/App.routes.tsx`

```typescript
import { Routes, Route } from "react-router-dom"
import AdminLoginPage from "../features/auth/pages/AdminLogin.page.tsx";
import ExhibitorLoginPage from "../features/auth/pages/ExhabitorLogin.page.tsx"
import AttendeeLoginPage from "../features/auth/pages/AttendeeLogin.page.tsx"
import AdminRegisterPage from "../features/auth/pages/AdminRegister.page.tsx"
import ExhibitorRegisterPage from "../features/auth/pages/ExhibitorRegister.page.tsx"
import AttendeeRegisterPage from "../features/auth/pages/AttendeeRegister.page.tsx"
import ForgotPasswordPage from "../features/auth/pages/ForgotPassword.page.tsx"
import ResetPasswordPage from "../features/auth/pages/ResetPassword.page.tsx"
import ProtectedRoute from "./protected.routes.tsx";
import RootLayout from "../components/layout/Root.layout.tsx";
import HomePage from "../features/landing/pages/Home.page.tsx";
import ExposPage from "../features/attendee/pages/ExposPage.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Home Routes */}
            <Route element={<RootLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route 
                    path="/expos" 
                    element={
                        <ProtectedRoute allowedRole="attendee">
                            <ExposPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute allowedRole="attendee">
                            <div className="min-h-screen flex items-center justify-center">
                                <h1 className="text-3xl text-white">Profile Settings - Coming Soon</h1>
                            </div>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/my-tickets" 
                    element={
                        <ProtectedRoute allowedRole="attendee">
                            <div className="min-h-screen flex items-center justify-center">
                                <h1 className="text-3xl text-white">My Tickets - Coming Soon</h1>
                            </div>
                        </ProtectedRoute>
                    } 
                />
            </Route>

            {/* Login Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/exhibitor/login" element={<ExhibitorLoginPage />} />
            <Route path="/attendee/login" element={<AttendeeLoginPage />} />

            {/* Register Routes */}
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/exhibitor/register" element={<ExhibitorRegisterPage />} />
            <Route path="/attendee/register" element={<AttendeeRegisterPage />} />

            {/* Password Reset Routes */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Future Dashboards */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <div>Admin Dashboard</div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes
```

---

### 7. Protected Routes

**File:** `Client/src/routes/protected.routes.tsx`

```typescript
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/Auth.context.tsx"
import type {JSX} from "react";

interface Props {
    children: JSX.Element
    allowedRole: "admin" | "exhibitor" | "attendee"
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
    const { user } = useAuth()

    if (!user) return <Navigate to="/" />

    if (user.role !== allowedRole)
        return <Navigate to={`/${user.role}/dashboard`} />

    return children
}

export default ProtectedRoute
```

---

### 8. Navbar Component

**File:** `Client/src/components/common/Navbar.tsx`

```typescript
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/Auth.context"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false)
            }
        }

        if (showProfileDropdown) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showProfileDropdown])

    const scrollToSection = (id: string) => {
        setIsOpen(false)
        
        // If not on home page, navigate to home first
        if (location.pathname !== "/") {
            navigate("/")
            // Wait for navigation to complete, then scroll
            setTimeout(() => {
                const section = document.getElementById(id)
                section?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        } else {
            // Already on home page, just scroll
            const section = document.getElementById(id)
            section?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleLogout = () => {
        logout()
        setShowProfileDropdown(false)
        navigate("/")
    }

    const isAttendee = user?.role === "attendee"

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <div
                    onClick={() => navigate("/")}
                    className="cursor-pointer text-xl font-bold tracking-wide"
                >
                    <span className="text-white">Event</span>
                    <span className="text-neutral-400">Sphere</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
                    <button onClick={() => scrollToSection("home")} className="hover:text-white transition">
                        Home
                    </button>
                    <button onClick={() => scrollToSection("about")} className="hover:text-white transition">
                        About
                    </button>
                    {isAttendee && (
                        <button onClick={() => navigate("/expos")} className="hover:text-white transition">
                            Expos
                        </button>
                    )}
                    <button onClick={() => scrollToSection("gallery")} className="hover:text-white transition">
                        Gallery
                    </button>
                    <button onClick={() => scrollToSection("support")} className="hover:text-white transition">
                        Support
                    </button>
                </div>

                {/* Desktop Auth Buttons / Profile */}
                <div className="hidden md:flex items-center gap-4">
                    {isAttendee ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold">
                                    {user?.email.charAt(0).toUpperCase()}
                                </div>
                                <svg 
                                    className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-white/10 shadow-xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-sm text-neutral-400">Signed in as</p>
                                        <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false)
                                                navigate("/profile")
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                        >
                                            Profile Settings
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowProfileDropdown(false)
                                                navigate("/my-tickets")
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 transition"
                                        >
                                            My Tickets
                                        </button>
                                    </div>
                                    <div className="border-t border-white/10">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/attendee/login"
                                className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
                            >
                                Login
                            </Link>

                            <Link
                                to="/attendee/register"
                                className="text-sm px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-6 pb-6 space-y-4 text-neutral-300 bg-neutral-950/95 backdrop-blur-md">
                    <button onClick={() => scrollToSection("home")} className="block w-full text-left">
                        Home
                    </button>
                    <button onClick={() => scrollToSection("about")} className="block w-full text-left">
                        About
                    </button>
                    {isAttendee && (
                        <button 
                            onClick={() => {
                                navigate("/expos")
                                setIsOpen(false)
                            }} 
                            className="block w-full text-left"
                        >
                            Expos
                        </button>
                    )}
                    <button onClick={() => scrollToSection("gallery")} className="block w-full text-left">
                        Gallery
                    </button>
                    <button onClick={() => scrollToSection("support")} className="block w-full text-left">
                        Support
                    </button>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                        {isAttendee ? (
                            <>
                                <div className="px-4 py-2 bg-white/5 rounded-lg">
                                    <p className="text-xs text-neutral-400">Signed in as</p>
                                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        navigate("/profile")
                                        setIsOpen(false)
                                    }}
                                    className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    Profile Settings
                                </button>
                                <button 
                                    onClick={() => {
                                        navigate("/my-tickets")
                                        setIsOpen(false)
                                    }}
                                    className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10"
                                >
                                    My Tickets
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/attendee/login" className="block">
                                    Login
                                </Link>
                                <Link
                                    to="/attendee/register"
                                    className="block px-4 py-2 rounded-lg bg-white text-black text-center"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
```

---

### 9. Login Form Component

**File:** `Client/src/features/auth/components/LoginForm.tsx`

```typescript
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"
import { loginUser } from "../../../services/auth.service"

interface Props {
    role: "admin" | "exhibitor" | "attendee"
    accent: string
}

const LoginForm = ({ role, accent }: Props) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const data = await loginUser({ email, password });

            login(data.user, data.token);
            
            // Redirect attendees to home page, others to their respective dashboards
            if (data.user.role === "attendee") {
                navigate("/");
            } else {
                navigate(`/${data.user.role}/dashboard`);
            }
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed";
            setError(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm text-neutral-300">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label className="text-sm text-neutral-300">Password</label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 ${accent} transition`}
                    placeholder="Enter your password"
                />
            </div>

            {/* Forgot password */}
            <div className="text-right">
                <a
                    href="/forgot-password"
                    className={`text-sm ${accent} hover:underline`}
                >
                    Forgot password?
                </a>
            </div>

            {/* Login button */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                    loading
                        ? "bg-neutral-600 cursor-not-allowed"
                        : "bg-white text-black hover:bg-neutral-200"
                }`}
            >
                {loading ? "Signing in..." : `Login as ${role}`}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-700" />
                <span className="text-xs text-neutral-400">OR</span>
                <div className="flex-1 h-px bg-neutral-700" />
            </div>

            {/* Google OAuth */}
            <button
                type="button"
                className="w-full py-3 rounded-xl border border-white/20 hover:bg-white/10 transition flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-neutral-400">
                Don't have an account?{" "}
                <a href={`/${role}/register`} className={`${accent} hover:underline`}>
                    Register here
                </a>
            </p>
        </form>
    )
}

export default LoginForm
```

---

### 10. Hero Section Component

**File:** `Client/src/features/landing/components/HeroSection.component.tsx`

```typescript
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/Auth.context"

const HeroSection = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleAttendExpo = () => {
        if (user?.role === "attendee") {
            navigate("/expos")
        } else {
            navigate("/attendee/login")
        }
    }

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center px-6">

            {/* Background Glow Effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl top-[-100px] left-[-100px]" />
                <div className="absolute w-[400px] h-[400px] bg-neutral-500/10 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />
            </div>

            {/* Content */}
            <div className="max-w-5xl text-center space-y-8">

                {/* Badge */}
                <div className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-neutral-300 backdrop-blur-md">
                    Multi-Expo Management Platform
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                    Experience Expos
                    <span className="block text-neutral-400">
            Like Never Before
          </span>
                </h1>

                {/* Subheading */}
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl">
                    EventSphere connects organizers, exhibitors, and attendees in one seamless
                    real-time platform. Manage booths, sessions, registrations, and analytics —
                    all in one place.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">

                    <button
                        onClick={handleAttendExpo}
                        className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition w-full md:w-auto text-center"
                    >
                        Attend an Expo
                    </button>

                    <Link
                        to="/exhibitor/login"
                        className="px-8 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 transition w-full md:w-auto text-center"
                    >
                        Become an Exhibitor
                    </Link>

                </div>

                {/* Secondary Link */}
                <div className="pt-4 text-sm text-neutral-500">
                    Are you an organizer?{" "}
                    <Link to="/admin/login" className="text-neutral-300 hover:text-white transition">
                        Admin Login
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default HeroSection
```

---

### 11. Expos Page

**File:** `Client/src/features/attendee/pages/ExposPage.tsx`

```typescript
import { useNavigate } from "react-router-dom"

const ExposPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back Navigation */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition mb-8 group"
                >
                    <svg 
                        className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Home</span>
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-white">Explore </span>
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Upcoming Expos
                        </span>
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Discover amazing exhibitions and events tailored for you
                    </p>
                </div>

                {/* Placeholder for expo listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 mb-4 flex items-center justify-center">
                                <span className="text-neutral-500 text-sm">Expo Image</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Expo Event {item}
                            </h3>
                            <p className="text-neutral-400 text-sm mb-4">
                                Join us for an amazing experience with cutting-edge technology and innovations.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-500">Dec 2026</span>
                                <button className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExposPage
```

---

### 12. Forgot Password Page

**File:** `Client/src/features/auth/pages/ForgotPassword.page.tsx`

```typescript
import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../../components/layout/Auth.layout.tsx"
import { forgotPassword } from "../../../services/auth.service"

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            await forgotPassword({ email })
            setSuccess(true)
            setEmail("")
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send reset email"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout title="Forgot Password" accent="text-blue-400">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="text-sm text-green-400 bg-green-500/10 p-4 rounded-lg border border-green-500/20 space-y-2">
                        <p className="font-semibold">Reset email sent!</p>
                        <p className="text-xs text-green-300">
                            Check your inbox for password reset instructions.
                        </p>
                    </div>
                )}

                {/* Instructions */}
                {!success && (
                    <p className="text-sm text-neutral-400">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                )}

                {/* Email Input */}
                <div>
                    <label className="text-sm text-neutral-300">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        placeholder="Enter your email"
                        disabled={loading || success}
                    />
                </div>

                {/* Submit Button */}
                {!success && (
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold transition ${
                            loading
                                ? "bg-neutral-600 cursor-not-allowed"
                                : "bg-white text-black hover:bg-neutral-200"
                        }`}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                )}

                {/* Back to Login */}
                <div className="text-center">
                    <Link
                        to="/attendee/login"
                        className="text-sm text-blue-400 hover:underline"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}

export default ForgotPasswordPage
```

---

### 13. Reset Password Page

**File:** `Client/src/features/auth/pages/ResetPassword.page.tsx`

```typescript
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import AuthLayout from "../../../components/layout/Auth.layout.tsx"
import { resetPassword } from "../../../services/auth.service"

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [tokenValid, setTokenValid] = useState(true)
    const navigate = useNavigate()

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    // Validate token and email on mount
    useEffect(() => {
        if (!token || !email) {
            setTokenValid(false)
            setError("Invalid reset link")
        }
    }, [token, email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Client-side validation
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            setLoading(false)
            return
        }

        try {
            if (!token || !email) {
                throw new Error("Missing token or email")
            }

            await resetPassword({
                email,
                token,
                newPassword,
                confirmPassword,
            })
            setSuccess(true)
            setNewPassword("")
            setConfirmPassword("")
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/attendee/login")
            }, 2000)
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reset password"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (!tokenValid) {
        return (
            <AuthLayout title="Invalid Link" accent="text-red-400">
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-red-400 mb-6">The reset link is invalid or has expired.</p>
                        <button
                            onClick={() => navigate("/attendee/login")}
                            className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-200 transition"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout title="Reset Password" accent="text-blue-400">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="text-sm text-green-400 bg-green-500/10 p-4 rounded-lg border border-green-500/20 space-y-2">
                        <p className="font-semibold">Password reset successfully!</p>
                        <p className="text-xs text-green-300">Redirecting to login...</p>
                    </div>
                )}

                {/* Email Display */}
                {!success && (
                    <>
                        <div>
                            <label className="text-sm text-neutral-300">Email</label>
                            <input
                                type="email"
                                value={email || ""}
                                disabled
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-neutral-400"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="text-sm text-neutral-300">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Enter new password"
                                disabled={loading}
                                minLength={6}
                            />
                            <p className="mt-1 text-xs text-neutral-400">
                                Minimum 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm text-neutral-300">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                placeholder="Confirm your password"
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-semibold transition ${
                                loading
                                    ? "bg-neutral-600 cursor-not-allowed"
                                    : "bg-white text-black hover:bg-neutral-200"
                            }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}
            </form>
        </AuthLayout>
    )
}

export default ResetPasswordPage
```

---

### 14. Package Configuration

**File:** `Client/package.json`

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.2.1",
    "axios": "^1.13.5",
    "clsx": "^2.1.1",
    "framer-motion": "^12.34.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.1",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.2.1",
    "three": "^0.183.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.183.1",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```

---

### 15. Vite Configuration

**File:** `Client/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

### 16. Styling Files

**File:** `Client/src/index.css`

```css
@import "tailwindcss";

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
```

**File:** `Client/src/App.css`

```css
/* Empty - styling handled by Tailwind */
```

---

## Environment Configuration

**File:** `Server/.env`

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/expo_management
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here
JWT_ACCESS_EXPIRY=7d
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here
JWT_REFRESH_EXPIRY=30d
CLIENT_URL=http://localhost:5173
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Gmail account (for email service)

### Server Setup

1. Navigate to Server directory:
```bash
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the configuration above

4. Start MongoDB (if local)

5. Run development server:
```bash
npm run dev
```

Server will run on http://localhost:3000

### Client Setup

1. Navigate to Client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Client will run on http://localhost:5173

---

## Key Features Implemented

### Authentication System
- ✅ User registration (Admin, Exhibitor, Attendee)
- ✅ User login with JWT tokens
- ✅ Password reset via email (Nodemailer)
- ✅ Protected routes based on user roles
- ✅ Persistent authentication with localStorage

### Attendee Features
- ✅ Redirect to home page after login/registration
- ✅ Profile dropdown with user info
- ✅ Logout functionality
- ✅ Expos page for browsing events
- ✅ "Expos" navigation option (visible only to attendees)
- ✅ Smart navigation: Can navigate back to home sections from expos page
- ✅ "Attend an Expo" button redirects to expos if logged in, otherwise to login

### UI/UX Features
- ✅ Three.js animated particle background
- ✅ Framer Motion animations
- ✅ Glassmorphism design
- ✅ Responsive mobile design
- ✅ Smooth scroll navigation
- ✅ Click-outside dropdown detection

### Security Features
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Rate limiting (200 requests per 15 min)
- ✅ Input validation

---

## Project Status

**Current Version:** 1.0.0  
**Last Updated:** February 28, 2026

### Completed
- Full authentication system
- Attendee landing page and navigation
- Password reset functionality
- Protected routes
- Profile dropdown for attendees
- Expos page

### In Progress / Future Features
- Admin dashboard
- Exhibitor dashboard
- Expo management (CRUD)
- Booth allocation system
- Session scheduling
- Analytics dashboard
- Real-time notifications (Socket.io)
- Profile settings page
- My Tickets page

---

**Documentation Generated by AI Assistant**  
**Project:** EventSphere - Expo Management Center  
**Date:** February 28, 2026

