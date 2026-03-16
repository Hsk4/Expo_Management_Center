const test = require('node:test');
const assert = require('node:assert/strict');

const ENV_MODULE_PATH = '../src/config/env';

const loadEnvModule = () => {
    const resolved = require.resolve(ENV_MODULE_PATH);
    delete require.cache[resolved];
    return require(ENV_MODULE_PATH);
};

test('env config builds expected defaults in development', () => {
    process.env.NODE_ENV = 'development';
    process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';
    process.env.JWT_ACCESS_SECRET = 'unit-test-secret';
    process.env.CLIENT_URL = 'http://localhost:5173';
    delete process.env.CORS_ORIGINS;

    const ENV = loadEnvModule();

    assert.equal(ENV.MONGO_URI, 'mongodb://localhost:27017/test_db');
    assert.equal(ENV.JWT_ACCESS_SECRET, 'unit-test-secret');
    assert.ok(Array.isArray(ENV.CORS_ORIGINS));
    assert.ok(ENV.CORS_ORIGINS.length >= 1);
});

test('env config parses explicit CORS origins from CSV', () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';
    process.env.JWT_ACCESS_SECRET = 'unit-test-secret';
    process.env.CORS_ORIGINS = 'https://app.example.com, https://admin.example.com';

    const ENV = loadEnvModule();

    assert.deepEqual(ENV.CORS_ORIGINS, ['https://app.example.com', 'https://admin.example.com']);
});

