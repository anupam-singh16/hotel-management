#!/usr/bin/env node

/**
 * Gmail Connection Debug Script
 * Tests the actual connection to Gmail SMTP
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailConnection() {
  console.log("🔍 Testing Gmail SMTP Connection...\n");

  console.log("📧 Configuration:");
  console.log("   Email User:", process.env.EMAIL_USER);
  console.log("   Email From:", process.env.EMAIL_FROM);
  console.log("   Service:", process.env.EMAIL_SERVICE);
  console.log("");

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Test SMTP connection
    console.log("🔗 Connecting to Gmail SMTP...");
    await transporter.verify();
    console.log("✅ SMTP Connection Successful!");

    // Send test email
    console.log("\n📨 Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: "anupam@tarality.com",
      subject: "🎉 Hotel Checkout Reminder - Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Hotel Checkout Reminder</h2>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Dear Anupam,</strong></p>
            <p>This is a test checkout reminder email from your hotel management system.</p>
            <p><strong>Room Number:</strong> TEST-101</p>
            <p><strong>Checkout Time:</strong> ${new Date().toLocaleString()}</p>
            <p>If you receive this email, the notification system is working correctly!</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p style="color: #666; font-size: 14px; text-align: center;">
            Hotel Management System | Test Email
          </p>
        </div>
      `,
      text: "Test checkout reminder email from hotel management system"
    });

    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Response:", info.response);
    console.log("\n📧 Check your inbox at: anupam@tarality.com");

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.log("\n🔧 Troubleshooting:");
    
    if (error.message.includes("Invalid login")) {
      console.log("   • Invalid Gmail credentials");
      console.log("   • Check EMAIL_USER and EMAIL_PASSWORD in .env");
    } else if (error.message.includes("Bad username")) {
      console.log("   • Gmail username/password incorrect");
      console.log("   • Ensure 2FA is enabled");
      console.log("   • Use Gmail App Password, not regular password");
    } else if (error.message.includes("SMTP")) {
      console.log("   • SMTP connection failed");
      console.log("   • Check internet connection");
      console.log("   • Gmail might be blocking access");
    }
    
    console.log("\n📖 Solution:");
    console.log("   1. Go to: https://myaccount.google.com/apppasswords");
    console.log("   2. Generate new App Password for 'Hotel Management'");
    console.log("   3. Update EMAIL_PASSWORD in .env file");
    console.log("   4. Run this script again");
  }
}

testGmailConnection();