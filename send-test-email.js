#!/usr/bin/env node

/**
 * Quick Email Test - Run after setting up Gmail credentials
 */

const { sendNotification } = require('./src/services/notificationService');

async function sendTestEmail() {
  console.log("🚀 Sending test email to anupam@tarality.com...\n");

  const testGuest = {
    guestName: "Anupam",
    guestEmail: "anupam@tarality.com",
    checkOutDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    roomNumber: "TEST-101",
  };

  try {
    const result = await sendNotification(testGuest);


    console.log("📊 Result:>>>>>>>>>>>>" ,result);

    if (result.emailSent) {
      console.log("✅ SUCCESS: Email sent to anupam@tarality.com!");
      console.log("📧 Message ID:", result.emailInfo?.messageId);
    } else {
      console.log("❌ FAILED: Email not sent");
      console.log("🔍 Check your Gmail credentials in .env file");
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    console.log("🔧 Make sure your Gmail App Password is correct");
  }
}

sendTestEmail();