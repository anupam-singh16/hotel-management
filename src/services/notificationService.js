// Notification Service
// This service handles sending notifications to guests via email, SMS, or other channels

const nodemailer = require("nodemailer");

// Create email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App password for Gmail
    },
  });
};

// Send email notification
const sendEmailNotification = async (guest, message) => {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: guest.guestEmail,
      subject: message.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${message.subject}</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              ${message.body.replace(/\n/g, "<br>")}
            </p>
          </div>
          <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; text-align: center;">
            <strong>Room: ${guest.roomNumber}</strong><br>
            <strong>Checkout Time: ${new Date(guest.checkOutDate).toLocaleString()}</strong>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Thank you for choosing our hotel. We hope to see you again soon!
          </p>
        </div>
      `,
      text: message.body, // Fallback for email clients that don't support HTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `📧 Email sent successfully to ${guest.guestEmail}: ${info.messageId}`,
    );
    return { ...message, emailInfo: info };
  } catch (error) {
    console.error(
      `❌ Email sending failed for ${guest.guestEmail}:`,
      error.message,
    );
    throw error;
  }
};

// Send SMS notification (placeholder for future Twilio integration)
const sendSMSNotification = async (guest, message) => {
  try {
    // Placeholder for Twilio SMS integration
    console.log(
      `📱 SMS would be sent to ${guest.guestPhone}: ${message.subject}`,
    );
    return { ...message, smsStatus: "simulated" };
  } catch (error) {
    console.error(
      `❌ SMS sending failed for ${guest.guestPhone}:`,
      error.message,
    );
    throw error;
  }
};

// Main notification function
const sendNotification = async (guest) => {
  try {
    const message = {
      guestName: guest.guestName,
      guestEmail: guest.guestEmail || "guest@example.com",
      checkOutDate: guest.checkOutDate,
      roomNumber: guest.roomNumber,
      subject: "Checkout Reminder - 2 Hours Before Checkout",
      body: `Dear ${guest.guestName},

This is a reminder that your checkout time is at ${new Date(guest.checkOutDate).toLocaleTimeString()}.

Please ensure all your belongings are packed and the room is ready for checkout.

Room Number: ${guest.roomNumber}
Checkout Time: ${new Date(guest.checkOutDate).toLocaleString()}

Thank you for staying with us!

Best regards,
Hotel Management Team`,
      timestamp: new Date(),
      status: "sent",
    };

    // Send email if email is configured and guest has email
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD &&
      guest.guestEmail
    ) {
      try {
        const emailResult = await sendEmailNotification(guest, message);
        message.emailSent = true;
        message.emailInfo = emailResult.emailInfo;
      } catch (emailError) {
        console.error(
          `Email failed, continuing with console notification: ${emailError.message}`,
        );
        message.emailSent = false;
        message.emailError = emailError.message;
      }
    }

    // Send SMS if phone is configured and guest has phone (future feature)
    if (process.env.TWILIO_ACCOUNT_SID && guest.guestPhone) {
      try {
        const smsResult = await sendSMSNotification(guest, message);
        message.smsSent = true;
        message.smsInfo = smsResult;
      } catch (smsError) {
        console.error(`SMS failed, continuing: ${smsError.message}`);
        message.smsSent = false;
        message.smsError = smsError.message;
      }
    }

    // Always log to console as fallback
    console.log("📧 Notification sent:", {
      guest: guest.guestName,
      email: guest.guestEmail,
      room: guest.roomNumber,
      checkout: guest.checkOutDate,
      emailSent: message.emailSent,
      smsSent: message.smsSent,
    });

    return message;
  } catch (error) {
    console.error("❌ Error sending notification:", error.message);
    throw error;
  }
};

module.exports = {
  sendNotification,
  sendEmailNotification,
  sendSMSNotification,
};
