require('dotenv').config();
const { google } = require("googleapis");

console.log("🔧 Testing OAuth2 Setup for Gmail...\n");

// Check environment variables
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 CLIENT_ID:", process.env.CLIENT_ID ? "✓ Set" : "✗ Missing");
console.log("🔑 CLIENT_SECRET:", process.env.CLIENT_SECRET ? "✓ Set" : "✗ Missing");
console.log("🔑 REFRESH_TOKEN:", process.env.REFRESH_TOKEN ? "✓ Set" : "✗ Missing");

// Test OAuth2
(async () => {
    try {
        console.log("\n🔐 Attempting to generate OAuth2 access token...\n");

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        console.log("✅ Access token generated successfully!");
        console.log("📋 Access Token:", credentials.access_token.substring(0, 50) + "...");
        console.log("⏰ Token expires in:", credentials.expiry_date);

        // Now test with nodemailer
        console.log("\n🔧 Testing Nodemailer configuration...\n");
        const nodemailer = require("nodemailer");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: credentials.access_token,
            },
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error("❌ Transporter verification failed:");
                console.error("   Error:", error.message);
                console.error("   Code:", error.code);
                if (error.response) {
                    console.error("   Response:", error.response);
                }
            } else {
                console.log("✅ Transporter verification successful!");
                console.log("📧 Email service is ready to send emails");
                console.log("\n✨ All OAuth2 and email configurations are correct!");
            }
        });
    } catch (error) {
        console.error("\n❌ Error during OAuth2 setup:");
        console.error("   Message:", error.message);
        console.error("   Code:", error.code);
        console.error("\n🔍 Troubleshooting tips:");
        console.error("   1. Verify all credentials in Server/.env are correct");
        console.error("   2. Check if the refresh token has expired");
        console.error("   3. Ensure Gmail API is enabled in Google Cloud Console");
        console.error("   4. Verify OAuth2 consent screen is configured");
        console.error("\nFull error:", error);
    }
})();

