const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
    try {
        let token ;

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