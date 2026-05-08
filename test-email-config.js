#!/usr/bin/env node

/**
 * Email Configuration Test
 * Tests if email credentials are properly configured
 */

require('dotenv').config();

function testEmailConfig() {
  console.log("🔧 Testing Email Configuration...\n");

  const config = {
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '***configured***' : 'NOT SET',
    EMAIL_FROM: process.env.EMAIL_FROM,
  };

  console.log("📧 Current Email Configuration:");
  Object.entries(config).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });

  console.log("");

  // Check if required fields are set
  const requiredFields = ['EMAIL_USER', 'EMAIL_PASSWORD'];
  const missingFields = requiredFields.filter(field => !process.env[field]);

  if (missingFields.length > 0) {
    console.log("❌ Missing required email configuration:");
    missingFields.forEach(field => {
      console.log(`   - ${field} is not set`);
    });
    console.log("\n📖 Please follow EMAIL_SETUP.md to configure Gmail App Password");
    return false;
  }

  console.log("✅ Email configuration looks good!");
  console.log("🚀 You can now run: node test-email.js");
  return true;
}

// Run configuration test
if (testEmailConfig()) {
  console.log("\n🎯 Ready to send emails!");
} else {
  console.log("\n⚠️  Please configure email settings first");
}