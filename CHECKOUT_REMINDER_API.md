# Checkout Reminder API Documentation

## Overview
The Checkout Reminder API automatically checks guest checkout times and sends notification messages 2 hours before checkout.

## Features
- ✅ Automatic checkout reminder detection
- ✅ Notification system for guests
- ✅ Optional scheduler service for background reminders
- ✅ Flexible notification service (can integrate with email, SMS, push notifications)

---

## API Endpoints

### 1. Get Checkout Reminders (Check-only)
**Endpoint:** `GET /api/bookings/checkout-reminders`

**Description:** Retrieves all bookings with checkout within the next 2 hours without sending notifications.

**Response:**
```json
{
  "message": "Bookings with checkout in next 2 hours",
  "count": 2,
  "checkTime": "2026-05-08T10:30:00.000Z",
  "reminderWindow": {
    "from": "2026-05-08T10:30:00.000Z",
    "to": "2026-05-08T12:30:00.000Z"
  },
  "data": [
    {
      "_id": "66378b5c...",
      "guestName": "John Doe",
      "guestEmail": "john@example.com",
      "checkOutDate": "2026-05-08T12:00:00.000Z",
      "status": "checked-in",
      "room": {
        "_id": "66378b4c...",
        "roomNumber": "101"
      }
    }
  ]
}
```

---

### 2. Send Checkout Reminders
**Endpoint:** `POST /api/bookings/send-checkout-reminders`

**Description:** Finds all guests checking out within 2 hours and sends them notification messages.

**Response:**
```json
{
  "message": "Checkout reminders sent successfully",
  "count": 1,
  "bookingsCount": 1,
  "notifications": [
    {
      "bookingId": "66378b5c...",
      "guestName": "John Doe",
      "notification": {
        "guestName": "John Doe",
        "guestEmail": "john@example.com",
        "checkOutDate": "2026-05-08T12:00:00.000Z",
        "roomNumber": "101",
        "subject": "Checkout Reminder - 2 Hours Before Checkout",
        "body": "Dear John Doe,\n\nThis is a reminder that your checkout time is at...",
        "timestamp": "2026-05-08T10:30:00.000Z",
        "status": "sent"
      }
    }
  ]
}
```

---

## How to Use

### Basic Usage (Manual API Calls)

**1. Check for upcoming checkouts:**
```bash
curl http://localhost:3000/api/bookings/checkout-reminders
```

**2. Send reminders to guests:**
```bash
curl -X POST http://localhost:3000/api/bookings/send-checkout-reminders
```

### Using JavaScript/Node.js

```javascript
// Check upcoming checkouts
const response = await fetch('http://localhost:3000/api/bookings/checkout-reminders');
const data = await response.json();
console.log(`${data.count} guests checking out soon`);

// Send reminders
const sendResponse = await fetch('http://localhost:3000/api/bookings/send-checkout-reminders', {
  method: 'POST'
});
const result = await sendResponse.json();
console.log(`Reminders sent to ${result.count} guests`);
```

---

## Automatic Scheduler (Optional)

The scheduler service automatically sends reminders at regular intervals.

### How to Enable (in server.js or app initialization)

```javascript
const { startCheckoutReminderScheduler } = require('./src/services/schedulerService');

// Start scheduler (runs every 30 minutes by default)
startCheckoutReminderScheduler(30);  // 30 minutes interval

// Or with custom interval (in minutes)
startCheckoutReminderScheduler(15);  // 15 minutes interval
```

### Stop the Scheduler

```javascript
const { stopCheckoutReminderScheduler } = require('./src/services/schedulerService');

stopCheckoutReminderScheduler();
```

---

## Booking Model Updates

The Booking model now includes:
```javascript
{
  room: ObjectId,              // Reference to Room
  guestName: String,           // Guest's name
  guestEmail: String,          // Guest's email for notifications
  guestPhone: String,          // Guest's phone (optional)
  checkInDate: Date,           // Check-in date/time
  checkOutDate: Date,          // Check-out date/time
  status: String,              // "checked-in" or "checked-out"
  reminderSent: Boolean,       // Track if reminder was sent
  createdAt: Date              // Booking creation timestamp
}
```

---

## Check-In API Update

When creating a booking, you can now include guest contact information:

```bash
POST /api/bookings/check-in
Content-Type: application/json

{
  "roomId": "66378b4c...",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1-234-567-8900",
  "checkInDate": "2026-05-07T15:00:00Z",
  "checkOutDate": "2026-05-08T12:00:00Z"
}
```

---

## Notification Service Customization

The notification service (`src/services/notificationService.js`) is a placeholder that can be customized to:

### Email Integration (Nodemailer)
```javascript
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({...});
await transporter.sendMail({
  to: guest.guestEmail,
  subject: 'Checkout Reminder',
  text: message.body
});
```

### SMS Integration (Twilio)
```javascript
const twilio = require('twilio');
const client = twilio(accountSid, authToken);
await client.messages.create({
  body: message.body,
  from: '+1234567890',
  to: guest.guestPhone
});
```

### Push Notifications (Firebase)
```javascript
const admin = require('firebase-admin');
await admin.messaging().send({
  notification: { title: message.subject, body: message.body },
  tokens: [userDeviceToken]
});
```

---

## Example Workflow

1. **Guest checks in** at 3:00 PM with checkout at 12:00 PM next day
2. **Scheduler runs** every 30 minutes
3. **At 10:00 AM** (2 hours before checkout), reminder is automatically sent
4. **Guest receives notification** with checkout reminder
5. **Booking record** is updated with `reminderSent: true` to avoid duplicate reminders

---

## Error Handling

The API handles various error scenarios:
- Missing required fields → HTTP 400
- Booking not found → HTTP 404
- Server errors → HTTP 500

---

## Future Enhancements

- [ ] Integrate with real email service (Nodemailer, SendGrid)
- [ ] Add SMS notifications (Twilio)
- [ ] Push notifications to mobile apps
- [ ] Customizable reminder time windows (1hr, 2hrs, 3hrs before checkout)
- [ ] Notification preferences per guest
- [ ] Notification history/log tracking
- [ ] Webhook notifications
- [ ] Template-based messages
