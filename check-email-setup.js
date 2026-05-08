#!/usr/bin/env node

/**
 * Show Current Email Credentials
 * Helps user see what needs to be updated
 */

require('dotenv').config();

console.log("📧 CURRENT EMAIL CONFIGURATION:\n");

console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "***SET***" : "NOT SET");
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);

console.log("\n" + "=".repeat(50));

if (process.env.EMAIL_USER === "your-actual-gmail@gmail.com") {
  console.log("❌ EMAIL_USER is still a placeholder!");
  console.log("   Replace with your real Gmail address");
}

if (process.env.EMAIL_PASSWORD === "your-16-char-app-password") {
  console.log("❌ EMAIL_PASSWORD is still a placeholder!");
  console.log("   Replace with your Gmail App Password");
}

console.log("\n📖 SETUP INSTRUCTIONS:");
console.log("1. Go to: https://myaccount.google.com/apppasswords");
console.log("2. Generate App Password for 'Hotel Management'");
console.log("3. Update .env file with real credentials");
console.log("4. Run: node send-test-email.js");

console.log("\n🚀 READY TO TEST: node send-test-email.js");