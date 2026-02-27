const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '7h' }

    );
};

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

module.exports = {
    generateToken,
    generateResetToken,
    hashResetToken,
    verifyResetToken
};
