const express = require('express');
const cors = require ('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const ENV = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const app = express();
const adminRoutes = require('./routes/admin.routes');
const expoRoutes = require('./routes/expo.routes');
const userRoutes = require('./routes/user.routes');
const notificationRoutes = require('./routes/notification.routes');
app.disable('x-powered-by');

if (ENV.isProduction) {
    app.set('trust proxy', 1);
}

// security headers
app.use(helmet());

// rate limiter 

const limiter = rateLimit({
    windowMs : ENV.RATE_LIMIT_WINDOW_MS,
    max : ENV.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

if (ENV.ENABLE_REQUEST_LOGS) {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: ENV.CORS_ORIGINS,
    credentials: true
}));

app.use (express.json());
app.use(cookieParser());

app.get("/" , (req, res) => {
    res.status(200).json({message: "Welcome to the Expo Management API", success : true});
});
app.get("/api/health", (req, res)=> {
    res.status(200).json({message: "API is up and running", success : true});
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expos', expoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
module.exports = app;