# Reset Password Feature Implementation

## Overview

A complete password reset functionality has been implemented for the Expo Management Center application with secure token-based verification via email using nodemailer.

## Features

- ✅ **Secure Token Generation** - Using Node.js crypto module for cryptographically secure random tokens
- ✅ **Token Hashing** - Reset tokens are hashed with bcryptjs before storage (never store plain tokens)
- ✅ **Time-Limited Tokens** - 15-minute expiration for security
- ✅ **Email Delivery** - HTML-formatted emails with reset links via Gmail OAuth2
- ✅ **Password Validation** - Minimum 6 characters, confirmation matching
- ✅ **Security Best Practices** - Generic success messages to prevent email enumeration
- ✅ **TypeScript Support** - Full type safety on client-side
- ✅ **Responsive UI** - Matches existing design system with glass-morphism effects
- ✅ **Error Handling** - User-friendly error messages and validation
- ✅ **Token Cleanup** - Expired tokens are cleared from database

## File Structure

### Server-Side Files

#### Modified Files:
1. **`Server/src/models/user.model.js`**
   - Added `resetPasswordToken` field (hashed token storage)
   - Added `resetPasswordExpiry` field (expiration timestamp)
   - Both fields hidden by default with `select: false`

2. **`Server/src/services/auth.services.js`**
   - Added `generateResetToken()` - Generates 64-character random hex string
   - Added `hashResetToken()` - Hashes token with bcryptjs
   - Added `verifyResetToken()` - Compares provided token with stored hash

3. **`Server/src/services/email.services.js`**
   - Added `sendPasswordResetEmail()` - Sends HTML-formatted reset email with time-limited link

4. **`Server/src/controllers/auth.controller.js`**
   - Added `forgotPassword()` - Handles password reset requests
     - Validates email existence
     - Generates and stores hashed token
     - Sends reset email
     - Returns generic success message for security
   - Added `resetPassword()` - Handles token validation and password update
     - Validates token and expiration
     - Verifies new password matches confirmation
     - Updates user password (automatically hashed via pre-save hook)
     - Clears reset token and expiry

5. **`Server/src/routes/auth.routes.js`**
   - Added `POST /api/auth/forgot-password` endpoint
   - Added `POST /api/auth/reset-password` endpoint

### Client-Side Files

#### Created Files:
1. **`Client/src/features/auth/pages/ForgotPassword.page.tsx`**
   - Email input form for initiating password reset
   - Loading state management
   - Success notification with email confirmation
   - Auto-redirect to login after success
   - Responsive layout using existing AuthLayout component

2. **`Client/src/features/auth/pages/ResetPassword.page.tsx`**
   - Token and email validation from URL query parameters
   - New password and confirmation password inputs
   - Client-side validation before submission
   - Success notification
   - Invalid token error handling
   - Token expiration detection

#### Modified Files:
1. **`Client/src/services/auth.service.ts`**
   - Added `ForgotPasswordData` interface
   - Added `ResetPasswordData` interface
   - Added `forgotPassword()` API call function
   - Added `resetPassword()` API call function

2. **`Client/src/routes/App.routes.tsx`**
   - Added route for `/forgot-password` page
   - Added route for `/reset-password` page
   - Imported new page components

3. **`Client/src/features/auth/components/LoginForm.tsx`**
   - Updated "Forgot password?" link to navigate to `/forgot-password`

## API Endpoints

### POST /api/auth/forgot-password
Initiates password reset process by sending email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 200):**
```json
{
  "message": "If an account with that email exists, you will receive password reset instructions",
  "success": true
}
```

**Response (Error - 400/500):**
```json
{
  "message": "Error description",
  "success": false
}
```

### POST /api/auth/reset-password
Resets password after token verification

**Request:**
```json
{
  "email": "user@example.com",
  "token": "generated_reset_token",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Password has been reset successfully",
  "success": true
}
```

**Response (Error - 400/500):**
```json
{
  "message": "Passwords do not match|Password must be at least 6 characters|Invalid reset link|Reset link has expired",
  "success": false
}
```

## User Flow

### Step 1: Request Password Reset
1. User visits any login page (Admin/Exhibitor/Attendee)
2. Clicks "Forgot password?" link
3. Navigated to `/forgot-password` page
4. Enters email address
5. Clicks "Send Reset Link"

### Step 2: Email Received
1. Server generates secure reset token
2. Token is hashed and stored with 15-minute expiry
3. HTML email is sent with reset link containing token and email as query parameters
4. Email contains direct link and copy-paste fallback

### Step 3: Reset Password
1. User clicks link in email (or navigates to `/reset-password?token=XXX&email=XXX`)
2. Page validates token and email from URL
3. User enters new password (minimum 6 characters)
4. Confirms password
5. Clicks "Reset Password"
6. Server validates token, expiry, and password match
7. Password is updated and token cleared
8. Success message shown
9. Auto-redirect to login page

## Security Considerations

1. **Token Storage** - Tokens are hashed before storage, never stored in plain text
2. **Token Expiry** - 15-minute time limit prevents long-term token compromise
3. **Email Validation** - Generic success message prevents email enumeration attacks
4. **Password Hashing** - All passwords go through bcryptjs hashing via pre-save hook
5. **HTTPS Recommended** - Reset links should be sent over HTTPS in production
6. **Rate Limiting** - Consider implementing rate limiting on forgot-password endpoint (already implemented on app)
7. **Token Uniqueness** - Crypto module ensures cryptographically secure randomness

## Installation & Setup

### 1. Install Dependencies

Already installed:
- `nodemailer@^8.0.1` (server-side)
- `bcryptjs@^3.0.3` (server-side)
- `jsonwebtoken@^9.0.3` (server-side)
- `react-router-dom@^7.13.1` (client-side)

### 2. Environment Variables

Create `.env` files in both directories:

**Server/.env:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/expo_management
PORT=5000
JWT_ACCESS_SECRET=your_jwt_secret_key_here

# Email (Gmail OAuth2)
EMAIL_USER=your-email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

# Client URL (for reset links)
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

See `ENV_SETUP.md` for detailed OAuth2 setup instructions.

### 3. Start the Application

**Terminal 1 - Server:**
```bash
cd Server
npm install  # if dependencies not already installed
npm run dev
```

**Terminal 2 - Client:**
```bash
cd Client
npm install  # if dependencies not already installed
npm run dev
```

## Testing the Feature

1. **Start both server and client**
2. **Navigate to** `http://localhost:3000/attendee/login`
3. **Click** "Forgot password?"
4. **Enter** your email address (must be registered)
5. **Check email** for reset link (check spam folder)
6. **Click** reset link in email
7. **Enter** new password (min 6 chars)
8. **Confirm** password
9. **Click** "Reset Password"
10. **Verify** success message and redirect to login
11. **Login** with new password

## Email Template

The password reset email includes:
- Professional HTML formatting
- Brand colors (EventSphere blue: #4f46e5)
- Reset link button
- Fallback copy-paste link
- Token expiration notice
- Non-technical-friendly language
- Team signature

## Styling

Both new pages use:
- **AuthLayout** component wrapper (existing component)
- **Tailwind CSS** for responsive design
- **Glass-morphism** effects (white/10 backgrounds with borders)
- **Consistent color scheme** with accent colors passed via props
- **Loading states** with disabled buttons
- **Error messages** in red with background
- **Success messages** in green with background
- **Mobile-responsive** design

## Error Handling

The feature handles:
- Invalid/non-existent emails (generic message)
- Expired reset tokens (clear from DB, inform user)
- Invalid tokens (reject request)
- Password mismatch
- Short passwords (< 6 characters)
- Missing required fields
- Email delivery failures (rollback token)
- Server errors (generic message)

## Future Enhancements

1. Add rate limiting per email address on forgot-password endpoint
2. Allow SMS-based password reset as alternative
3. Add social login integration (Google, GitHub, etc.)
4. Implement password strength meter on reset form
5. Add recent activity email alerts
6. Implement "suspicious login" password reset triggers
7. Support multiple reset tokens (for logged-in users forgetting password mid-session)

## Troubleshooting

### Password reset email not received
- Check spam/junk folder
- Verify CLIENT_URL in .env matches your domain
- Ensure Gmail OAuth2 credentials are correct
- Check server logs for email service errors

### Invalid reset link error
- Token may have expired (15 minute limit)
- Token may have been used already
- Check email and token in URL match query parameters
- Ensure URL is not modified

### Password update fails
- Passwords must match exactly
- Password minimum 6 characters
- Try resetting and getting new token

## Code Quality

- ✅ TypeScript types for client components
- ✅ Consistent error handling patterns
- ✅ Security best practices throughout
- ✅ Code comments for complex logic
- ✅ Follows existing project patterns
- ✅ Pre-formatted with Tailwind CSS
- ✅ Responsive mobile-first design

---

**Implementation Date:** February 28, 2026
**Status:** ✅ Complete and Ready for Testing

