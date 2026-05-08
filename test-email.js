#!/usr/bin/env node

/**
 * Email Test Script
 * Tests email functionality with nodemailer
 */

const { sendNotification } = require('./src/services/notificationService');

async function testEmail() {
  console.log("🧪 Testing Email Notification Feature...\n");

  try {
    // Test guest data
    const testGuest = {
      guestName: "Anupam",
      guestEmail: "anupam@tarality.com",
      guestPhone: "+1-234-567-8900",
      checkOutDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      roomNumber: "TEST-101",
    };

    console.log("📧 Sending test email to:", testGuest.guestEmail);
    console.log("👤 Guest Name:", testGuest.guestName);
    console.log("🏠 Room Number:", testGuest.roomNumber);
    console.log("⏰ Checkout Time:", testGuest.checkOutDate.toLocaleString());
    console.log("");

    // Send notification
    const result = await sendNotification(testGuest);

    console.log("✅ Email notification sent successfully!");
    console.log("📊 Result Details:");
    console.log("   - Status:", result.status);
    console.log("   - Email Sent:", result.emailSent ? "✅ Yes" : "❌ No");
    console.log("   - Timestamp:", result.timestamp);

    if (result.emailSent) {
      console.log("   - Email Info:", result.emailInfo?.messageId || "Message ID available");
    }

    if (result.emailError) {
      console.log("   - Email Error:", result.emailError);
    }

    console.log("\n📧 Email Content Preview:");
    console.log("Subject:", result.subject);
    console.log("Body:");
    console.log(result.body);

  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check your .env file has correct EMAIL_USER and EMAIL_PASSWORD");
    console.log("2. For Gmail, use an App Password (not your regular password)");
    console.log("3. Enable 'Less secure app access' or use App Passwords");
    console.log("4. Check your internet connection");
    process.exit(1);
  }
}

// Run the email test
testEmail().then(() => {
  console.log("\n🎉 Email test completed!");
  process.exit(0);
});