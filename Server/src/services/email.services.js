const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ENV = require('../config/env');

// Create transporter with error handling
let transporter;

const createTransporter = async () => {
    try {
        if (!ENV.EMAIL_ENABLED) {
            return null;
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            ENV.EMAIL_CONFIG.clientId,
            ENV.EMAIL_CONFIG.clientSecret,
            "https://developers.google.com/oauthplayground"
        );

        // Set the refresh token
        oauth2Client.setCredentials({
            refresh_token: ENV.EMAIL_CONFIG.refreshToken,
        });

        // Get access token
        const { credentials } = await oauth2Client.refreshAccessToken();
        const accessToken = credentials.access_token;

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: ENV.EMAIL_CONFIG.user,
                clientId: ENV.EMAIL_CONFIG.clientId,
                clientSecret: ENV.EMAIL_CONFIG.clientSecret,
                refreshToken: ENV.EMAIL_CONFIG.refreshToken,
                accessToken: accessToken,
            },
        });

        transport.verify((error) => {
            if (error) {
                console.log("Email transporter verification failed:", error.message);
            } else {
                console.log("Email service is ready.");
            }
        });

        return transport;
    } catch (error) {
        console.error("Failed to initialize email service:", error.message);
        return null;
    }
};

// Initialize transporter on startup
(async () => {
    transporter = await createTransporter();
})();

const sendWelcomeEmail = async (user) => {
    // Reinitialize if transporter is not available
    if (!transporter) {
        transporter = await createTransporter();
    }

    // Check if transporter is available
    if (!transporter) {
        console.log("Email service unavailable. Skipping welcome email.");
        return { success: false, message: "Email service not configured" };
    }

    try {
        const roleTitle =
            user.role.charAt(0).toUpperCase() + user.role.slice(1);

        const mailOptions = {
            from: `"EventSphere Team" <${ENV.EMAIL_CONFIG.user}>`,
            to: user.email,
            subject: "Welcome to EventSphere 🚀",
            html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#4f46e5;">Welcome to EventSphere!</h2>
        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          Your <strong>${roleTitle}</strong> account has been successfully created.
        </p>

        <hr style="margin:20px 0;" />

        <h3>Account Details:</h3>
        <ul>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Role:</strong> ${roleTitle}</li>
        </ul>

        <p>
          You can now log in and start exploring the platform.
        </p>

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>EventSphere Management Team</strong>
        </p>
      </div>
    `,
        };
        const info = await transporter.sendMail(mailOptions);

        console.log('Welcome email sent successfully.');

        return { success: true, message: "Email sent successfully", info };
    } catch (error) {
        console.error("Error sending welcome email:", error.message);
        throw error;
    }
};

const sendPasswordResetEmail = async (user, resetToken) => {
    // Reinitialize if transporter is not available
    if (!transporter) {
        transporter = await createTransporter();
    }

    // Check if transporter is available
    if (!transporter) {
        console.log("Email service unavailable. Cannot send password reset email.");
        throw new Error("Email service not configured");
    }

    try {
        const resetLink = `${ENV.CLIENT_URL}/reset-password?token=${resetToken}&email=${user.email}`;

        const mailOptions = {
            from: `"EventSphere Team" <${ENV.EMAIL_CONFIG.user}>`,
            to: user.email,
            subject: "Password Reset Request - EventSphere",
            html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#4f46e5;">Password Reset Request</h2>
        <p>Hello <strong>${user.name}</strong>,</p>

        <p>
          We received a request to reset your password. Click the button below to reset it.
        </p>

        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color:#4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="color: #666; font-size: 14px;">
          Or copy and paste this link in your browser:<br/>
          <code style="background: #f0f0f0; padding: 8px; border-radius: 4px;">${resetLink}</code>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 15 minutes.<br/>
          If you didn't request this, please ignore this email.
        </p>

        <hr style="margin:20px 0;" />

        <p style="margin-top:30px;">
          Regards,<br/>
          <strong>EventSphere Management Team</strong>
        </p>
      </div>
    `,
        };
        const info = await transporter.sendMail(mailOptions);

        console.log('Password reset email sent successfully.');

        return { success: true, message: "Reset email sent successfully", info };
    } catch (error) {
        console.error("Error sending password reset email:", error.message);
        throw error;
    }
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
