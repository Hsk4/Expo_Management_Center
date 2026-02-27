const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

const sendWelcomeEmail = async (user) => {
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

    await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (user, resetToken) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${user.email}`;

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

    await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
