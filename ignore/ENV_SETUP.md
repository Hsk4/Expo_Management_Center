# Environment Variables Setup

## Server Setup (.env file)

Create a `.env` file in the `Server` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/expo_management

# Server Port
PORT=5000

# JWT Secret
JWT_ACCESS_SECRET=your_jwt_secret_key_here

# Email Configuration (Gmail OAuth2)
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

# Client URL (for password reset links)
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Client Setup (.env file)

Create a `.env` file in the `Client` directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## Setup Google OAuth2 for Email

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Desktop application)
5. Generate refresh token using Google's OAuth2 playground
6. Add credentials to `.env` file

## Password Reset Flow

The password reset functionality includes:

1. **Forgot Password Page** - User enters email
   - Route: `/forgot-password`
   - Sends password reset email with time-limited token

2. **Reset Password Page** - User verifies token and sets new password
   - Route: `/reset-password?token=TOKEN&email=EMAIL`
   - Token expires after 15 minutes

## Features Implemented

✅ Secure token generation using crypto
✅ Token hashing with bcryptjs
✅ 15-minute token expiry
✅ Email notifications via nodemailer
✅ Protected password validation
✅ TypeScript client components
✅ Responsive UI matching existing design
✅ Error handling and user feedback

