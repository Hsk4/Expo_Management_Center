# Password Reset Feature - UI Flow Guide

## 📱 User Interface Flow

### Screen 1: Login Page (Existing)
```
┌─────────────────────────────────────┐
│   [Portal Logo]                     │
│                                     │
│   Attendee Portal                   │
│   test-accent-emerald               │
│                                     │
│   ┌──────────────────────────────┐  │
│   │ Email                        │  │
│   │ [________________]           │  │
│   └──────────────────────────────┘  │
│                                     │
│   ┌──────────────────────────────┐  │
│   │ Password                     │  │
│   │ [________________]           │  │
│   └──────────────────────────────┘  │
│                                     │
│   [Forgot password?] ← NEW LINK     │
│                                     │
│   [Login as attendee]               │
│                                     │
│   ────────── OR ──────────         │
│   [Continue with Google]            │
│                                     │
│   Don't have an account?            │
│   [Register here]                   │
└─────────────────────────────────────┘
```

### Screen 2: Forgot Password Page (NEW)
```
┌─────────────────────────────────────┐
│   [Portal Logo]                     │
│                                     │
│   Reset Password                    │
│   test-accent-blue                  │
│                                     │
│   ┌──────────────────────────────┐  │
│   │ Email Address                │  │
│   │ [user@example.com___________]│  │
│   │ We'll send you a link to     │  │
│   │ reset your password          │  │
│   └──────────────────────────────┘  │
│                                     │
│   [Send Reset Link]                 │
│                                     │
│   ────────── OR ──────────         │
│   [Back to Login]                   │
└─────────────────────────────────────┘
```

### Screen 3: Success Message (Still on Forgot Password)
```
┌─────────────────────────────────────┐
│   [Portal Logo]                     │
│                                     │
│   Reset Password                    │
│   test-accent-blue                  │
│                                     │
│   ┌────────────────────────────────┐ │
│   │ ✓ Check your email!            │ │
│   │                                │ │
│   │ We've sent a password reset   │ │
│   │ link to user@example.com      │ │
│   │                                │ │
│   │ Redirecting to login...        │ │
│   └────────────────────────────────┘ │
│                                     │
│   [Auto-redirect in 3 seconds]      │
└─────────────────────────────────────┘
```

### Screen 4: Reset Password Page (NEW)
User clicks email link or navigates to:
`/reset-password?token=ABC123&email=user@example.com`

```
┌─────────────────────────────────────┐
│   [Portal Logo]                     │
│                                     │
│   Reset Password                    │
│   test-accent-blue                  │
│                                     │
│   ┌──────────────────────────────┐  │
│   │ Email                        │  │
│   │ [user@example.com] (disabled)│  │
│   └──────────────────────────────┘  │
│                                     │
│   ┌──────────────────────────────┐  │
│   │ New Password                 │  │
│   │ [________________]           │  │
│   │ Minimum 6 characters         │  │
│   └──────────────────────────────┘  │
│                                     │
│   ┌──────────────────────────────┐  │
│   │ Confirm Password             │  │
│   │ [________________]           │  │
│   └──────────────────────────────┘  │
│                                     │
│   [Reset Password]                  │
│                                     │
│   ────────── OR ──────────         │
│   [Back to Login]                   │
└─────────────────────────────────────┘
```

### Screen 5: Success Message (Still on Reset Password)
```
┌─────────────────────────────────────┐
│   [Portal Logo]                     │
│                                     │
│   Reset Password                    │
│   test-accent-blue                  │
│                                     │
│   ┌────────────────────────────────┐ │
│   │ ✓ Password reset successfully! │ │
│   │                                │ │
│   │ Redirecting to login...        │ │
│   └────────────────────────────────┘ │
│                                     │
│   [Auto-redirect in 2 seconds]      │
└─────────────────────────────────────┘
```

### Screen 6: Invalid Token Error
```
┌─────────────────────────────────────┐
│   [Portal Logo]                     │
│                                     │
│   Invalid Link                      │
│   test-accent-red                   │
│                                     │
│   ┌────────────────────────────────┐ │
│   │ The reset link is invalid or  │ │
│   │ has expired.                  │ │
│   └────────────────────────────────┘ │
│                                     │
│   [Return to Login]                 │
└─────────────────────────────────────┘
```

## 🔄 Complete User Journey

```
USER ACTION                          SYSTEM RESPONSE
─────────────────────────────────────────────────────────────

1. User on login page
   Clicks "Forgot password?"  ──→   Navigate to /forgot-password

2. Enters email & clicks "Send" ──→   Validate email exists
                                       Generate secure token
                                       Hash token
                                       Store hashed token (15min expiry)
                                       Send HTML email with reset link
                                       Show success message
                                       Auto-redirect to login (3s)

3. User receives email
   Clicks reset link           ──→   Extract token & email from URL
                                       Validate URL parameters
                                       Display reset password form

4. User enters new password
   Clicks "Reset Password"     ──→   Validate token exists
                                       Verify token not expired
                                       Verify token hash matches
                                       Validate password requirements
                                       Hash new password
                                       Update user record
                                       Clear reset token & expiry
                                       Show success message
                                       Auto-redirect to login (2s)

5. User on login page
   Enters credentials          ──→   Authenticate with NEW password
                                       Issue JWT token
                                       Redirect to dashboard
```

## 🎨 Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Primary | Indigo (#4f46e5) | Logo, accents, email brand |
| Success | Green (#22c55e) | Success messages, confirmations |
| Error | Red (#ef4444) | Error messages, warnings |
| Neutral | Gray (#737373) | Text, borders, backgrounds |
| Background | Black/Dark Gray | Page background |
| Glass Effect | White/10% opacity | Input backgrounds, cards |

## 📧 Email Preview

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   [EventSphere Logo - Blue]                                   ║
║                                                               ║
║   PASSWORD RESET REQUEST                                      ║
║                                                               ║
║   Hello John Doe,                                             ║
║                                                               ║
║   We received a request to reset your password. Click the     ║
║   button below to reset it.                                   ║
║                                                               ║
║                    [Reset Password]                           ║
║                                                               ║
║   Or copy and paste this link:                                ║
║   ─────────────────────────────                              ║
║   http://localhost:3000/reset-password?                       ║
║   token=abc123...&email=user@example.com                      ║
║                                                               ║
║   This link will expire in 15 minutes.                        ║
║   If you didn't request this, please ignore this email.       ║
║                                                               ║
║   ─────────────────────────────────────                       ║
║   Regards,                                                     ║
║   EventSphere Management Team                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

## 🔐 Error States & Messages

| Scenario | Message | User Action |
|----------|---------|------------|
| Email not found | "If account exists, reset instructions sent" | None (security) |
| Token expired | "Reset link has expired" | Request new token |
| Invalid token | "Invalid reset link" | Request new token |
| Passwords don't match | "Passwords do not match" | Re-enter passwords |
| Password too short | "Password must be 6+ characters" | Enter longer password |
| Missing fields | "All fields are required" | Complete form |
| Email send failed | "Error sending email. Try again." | Retry request |
| Server error | "Server error message" | Contact support |

## ✨ UI Features

### Responsive Design
- Mobile-first approach
- Touch-friendly buttons (min 44px height)
- Stacked layout on small screens
- Full-width inputs on mobile
- Readable text sizes (16px+ on mobile)

### Accessibility
- Semantic HTML (form, label, button)
- ARIA labels for screen readers
- Color not sole means of communication
- Keyboard navigation support
- Focus indicators on inputs
- Disabled state visual feedback

### Visual Feedback
- Loading spinners/text on buttons
- Disabled state during submission
- Error messages with icon
- Success messages with checkmark
- Smooth transitions
- Focus ring colors match accent

### Internationalization Ready
- All text in component (can be moved to i18n)
- Placeholder text is user-friendly
- Error messages are clear

---

**Status:** ✅ READY FOR IMPLEMENTATION

