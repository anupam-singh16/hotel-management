#!/usr/bin/env node

/**
 * Gmail App Password Validator
 * Helps verify if the password format is correct
 */

require('dotenv').config();

const password = process.env.EMAIL_PASSWORD;

console.log("🔍 GMAIL APP PASSWORD VALIDATION:\n");

console.log("Current EMAIL_PASSWORD:", password ? "***HIDDEN***" : "NOT SET");

if (!password) {
  console.log("❌ No password set");
} else if (password === "Anupam@7210") {
  console.log("❌ This looks like a regular password, not a Gmail App Password");
  console.log("   Gmail App Passwords are 16 characters like: abcd-efgh-ijkl-mnop");
} else if (password.length === 16 && /^[a-zA-Z0-9-]+$/.test(password)) {
  console.log("✅ Password format looks correct (16 characters)");
  console.log("🚀 Ready to test email!");
} else {
  console.log("⚠️ Password format may be incorrect");
  console.log("   Gmail App Passwords should be 16 characters");
}

console.log("\n📖 To fix:");
console.log("1. Go to: https://myaccount.google.com/apppasswords");
console.log("2. Generate App Password for 'Hotel Management'");
console.log("3. Update EMAIL_PASSWORD in .env file");
console.log("4. Run: node send-test-email.js");

console.log("\n🧪 Test: node send-test-email.js");