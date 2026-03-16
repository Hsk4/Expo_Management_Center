const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test_db';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'unit-test-secret';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const { generateToken, generateResetToken, hashResetToken, verifyResetToken } = require('../src/services/auth.services');

test('generateToken signs user payload', () => {
    const token = generateToken({
        _id: '507f191e810c19729de860ea',
        email: 'user@example.com',
        role: 'attendee',
    });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    assert.equal(decoded.email, 'user@example.com');
    assert.equal(decoded.role, 'attendee');
});

test('reset token hashing and verification works', async () => {
    const token = generateResetToken();
    const hash = await hashResetToken(token);

    const valid = await verifyResetToken(token, hash);
    const invalid = await verifyResetToken('wrong-token', hash);

    assert.equal(valid, true);
    assert.equal(invalid, false);
});

