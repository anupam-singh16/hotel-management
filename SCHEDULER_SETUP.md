# Scheduler Integration Guide

## Step 1: Update server.js to enable the scheduler

Replace your current `server.js` with:

```javascript
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { startCheckoutReminderScheduler } = require("./src/services/schedulerService");

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // ✅ Start the checkout reminder scheduler
  const REMINDER_CHECK_INTERVAL = process.env.REMINDER_CHECK_INTERVAL || 30;
  startCheckoutReminderScheduler(REMINDER_CHECK_INTERVAL);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  const { stopCheckoutReminderScheduler } = require("./src/services/schedulerService");
  stopCheckoutReminderScheduler();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
```

---

## Step 2: Update .env file

Add these configurations to your `.env` file:

```env
# Reminder Scheduler (in minutes)
REMINDER_CHECK_INTERVAL=30

# Notification Settings
NOTIFICATION_ENABLED=true
CHECKOUT_REMINDER_HOURS=2

# Email Configuration (optional - for future email integration)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@hotelmanagement.com

# SMS Configuration (optional - for future SMS integration with Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Step 3: API Endpoints to Use

### Test the API endpoints:

**Check upcoming checkouts (no notifications sent):**
```bash
curl http://localhost:3000/api/bookings/checkout-reminders
```

**Send reminders immediately:**
```bash
curl -X POST http://localhost:3000/api/bookings/send-checkout-reminders
```

---

## Step 4: Create a Booking with Guest Contact Info

```bash
curl -X POST http://localhost:3000/api/bookings/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "YOUR_ROOM_ID",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1-234-567-8900",
    "checkInDate": "2026-05-07T15:00:00Z",
    "checkOutDate": "2026-05-08T12:00:00Z"
  }'
```

---

## Features Enabled

✅ **Automatic Reminder Scheduler** - Runs every N minutes (configurable)  
✅ **2-Hour Checkout Window** - Finds guests checking out in next 2 hours  
✅ **Prevents Duplicate Reminders** - Tracks if reminder already sent  
✅ **Graceful Shutdown** - Stops scheduler on server shutdown  
✅ **Error Handling** - Continues despite individual notification failures  

---

## Testing

1. Create a booking with checkout time exactly 1.5 hours from now
2. Call the scheduler manually: `POST /api/bookings/send-checkout-reminders`
3. Check the logs - you should see "Notification sent" messages
4. Check the booking record - `reminderSent` should be `true`

---

## Troubleshooting

**Q: Scheduler doesn't seem to be running**
A: Check server logs for startup messages. Ensure database connection is successful before scheduler starts.

**Q: Reminders not being sent**
A: Verify the booking's `checkOutDate` is within the next 2 hours and `status` is `checked-in`.

**Q: Getting duplicate reminders**
A: The `reminderSent` flag prevents duplicates. Check if flag is properly set to `true` after first reminder.

**Q: Want to change reminder interval**
A: Update `REMINDER_CHECK_INTERVAL` in `.env` file (in minutes). Requires server restart.

---

## Production Considerations

For production deployment:

1. **Use a real notification service** - Integrate with SendGrid, Twilio, or Firebase
2. **Add retry logic** - In case notification fails
3. **Use message queue** - Consider Redis/Bull for queuing notifications
4. **Add monitoring** - Log all notifications to database
5. **Set timezone** - Ensure server timezone matches your hotel's timezone
6. **Database indexes** - Add index to `checkOutDate` and `status` fields for performance
