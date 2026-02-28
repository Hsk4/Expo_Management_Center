const express = require('express');
const cors = require ('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const app = express();
const adminRoutes = require('./routes/admin.routes');
const expoRoutes = require('./routes/expo.routes');
// security headers
app.use(helmet());

// rate limiter 

const limiter = rateLimit({
    windowMs : 15 * 60 * 1000, // 15 minutes
    max : 200 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(morgan('dev'));

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
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
module.exports = app;