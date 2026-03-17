require('dotenv').config();

const toBoolean = (value, fallback = false) => {
	if (typeof value !== 'string') return fallback;
	return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const toNumber = (value, fallback) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCsv = (value) => {
	if (!value || typeof value !== 'string') return [];
	return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const requireEnv = (name) => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

const defaultDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = parseCsv(process.env.CORS_ORIGINS);
const fallbackClientUrl = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [];

const CORS_ORIGINS = configuredOrigins.length > 0
	? configuredOrigins
	: (isProduction ? fallbackClientUrl : [...defaultDevOrigins, ...fallbackClientUrl]);

if (CORS_ORIGINS.length === 0) {
	throw new Error('No CORS origins configured. Set CORS_ORIGINS or CLIENT_URL.');
}

const emailConfig = {
	user: process.env.EMAIL_USER || '',
	clientId: process.env.CLIENT_ID || '',
	clientSecret: process.env.CLIENT_SECRET || '',
	refreshToken: process.env.REFRESH_TOKEN || '',
};

const EMAIL_ENABLED = Boolean(
	emailConfig.user && emailConfig.clientId && emailConfig.clientSecret && emailConfig.refreshToken
);

const ENV = {
	NODE_ENV,
	isProduction,
	PORT: toNumber(process.env.PORT, 3000),
	MONGO_URI: process.env.MONGO_URI || 'mongodb://mongodb:27017/expo_management_center',
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-secret-changeme-in-product,
	CLIENT_URL: process.env.CLIENT_URL || '',
	CORS_ORIGINS,
	RATE_LIMIT_MAX: toNumber(process.env.RATE_LIMIT_MAX, 200),
	RATE_LIMIT_WINDOW_MS: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
	ENABLE_REQUEST_LOGS: toBoolean(process.env.ENABLE_REQUEST_LOGS, !isProduction),
	EMAIL_ENABLED,
	EMAIL_CONFIG: emailConfig,

	// commented for now should be used when the app reaches production phase.
	// MONGO_URI: requireEnv('MONGO_URI'),
	// JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
};

module.exports = ENV;

