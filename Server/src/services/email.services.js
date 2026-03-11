const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Create transporter with error handling
let transporter;

const createTransporter = async () => {
    try {
        console.log("🔧 Initializing email transporter...");
        console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
        console.log("🔑 CLIENT_ID:", process.env.CLIENT_ID ? "✓ Set" : "✗ Missing");
        console.log("🔑 CLIENT_SECRET:", process.env.CLIENT_SECRET ? "✓ Set" : "✗ Missing");
        console.log("🔑 REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? "✓ Set" : "✗ Missing");

        // Check if all OAuth2 credentials are present
        if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REFRESH_TOKEN) {
            throw new Error("Missing OAuth2 credentials (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN)");
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        // Set the refresh token
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        // Get access token
        const { credentials } = await oauth2Client.refreshAccessToken();
        const accessToken = credentials.access_token;

        console.log("✅ Access token generated successfully");

        // Create transport with OAuth2
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // Verify connection
        transport.verify((error, success) => {
            if (error) {
                console.log("⚠️  Email transporter verification error:", error.message);
                console.log("📧 Full error details:", error);
            } else {
                console.log("✅ Email service is ready to send emails");
            }
        });

        return transport;
    } catch (error) {
        console.error("❌ Failed to create email transporter:", error.message);
        console.error("🔍 Error details:", error);
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
        console.log("⚠️  Transporter not initialized. Attempting to reinitialize...");
        transporter = await createTransporter();
    }

    // Check if transporter is available
    if (!transporter) {
        console.log("⚠️  Email service not available. Skipping welcome email.");
        console.log("📧 Make sure all OAuth2 credentials are set correctly in .env file");
        return { success: false, message: "Email service not configured" };
    }

    try {
        console.log("\n📨 Sending welcome email...");
        console.log("👤 User email:", user.email);
        console.log("👤 User name:", user.name);
        console.log("👤 User role:", user.role);

        const roleTitle =
            user.role.charAt(0).toUpperCase() + user.role.slice(1);

        const mailOptions = {
            from: `"EventSphere Team" <${process.env.EMAIL_USER}>`,
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

        console.log("📬 Mail options prepared:");
        console.log("   From:", mailOptions.from);
        console.log("   To:", mailOptions.to);
        console.log("   Subject:", mailOptions.subject);

        console.log("🚀 Attempting to send email...");
        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Welcome email sent successfully!`);
        console.log("📧 Response ID:", info.response);
        console.log("📧 Message ID:", info.messageId);

        return { success: true, message: "Email sent successfully", info };
    } catch (error) {
        console.error("❌ Error sending welcome email:", error.message);
        console.error("🔍 Full error stack:", error);
        console.error("🔍 Error code:", error.code);
        throw error;
    }
};

const sendPasswordResetEmail = async (user, resetToken) => {
    // Reinitialize if transporter is not available
    if (!transporter) {
        console.log("⚠️  Transporter not initialized. Attempting to reinitialize...");
        transporter = await createTransporter();
    }

    // Check if transporter is available
    if (!transporter) {
        console.log("⚠️  Email service not available. Cannot send password reset email.");
        console.log("📧 Make sure all OAuth2 credentials are set correctly in .env file");
        throw new Error("Email service not configured");
    }

    try {
        console.log("\n📨 Sending password reset email...");
        console.log("👤 User email:", user.email);
        console.log("👤 User name:", user.name);
        console.log("🔐 Reset token:", resetToken.substring(0, 20) + "...");

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${user.email}`;
        console.log("🔗 Reset link:", resetLink);

        const mailOptions = {
            from: `"EventSphere Team" <${process.env.EMAIL_USER}>`,
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

        console.log("📬 Mail options prepared:");
        console.log("   From:", mailOptions.from);
        console.log("   To:", mailOptions.to);
        console.log("   Subject:", mailOptions.subject);

        console.log("🚀 Attempting to send password reset email...");
        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Password reset email sent successfully!`);
        console.log("📧 Response ID:", info.response);
        console.log("📧 Message ID:", info.messageId);

        return { success: true, message: "Reset email sent successfully", info };
    } catch (error) {
        console.error("❌ Error sending password reset email:", error.message);
        console.error("🔍 Full error stack:", error);
        console.error("🔍 Error code:", error.code);
        throw error;
    }
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
