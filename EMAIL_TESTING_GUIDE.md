# Email Testing Guide

## Quick Start

### Step 1: Set up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other (custom name)"
   - Name it "Hotel Management"
   - Copy the 16-character password

### Step 2: Update .env File

Replace the placeholder values in your `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # Your 16-char app password
EMAIL_FROM=your-email@gmail.com
```

### Step 3: Test Email Configuration

```bash
node test-email-config.js
```

### Step 4: Send Test Email

```bash
node test-email.js
```

This will send a test email to `anupam@tarality.com` with checkout reminder content.

---

## Test Commands

### Check Configuration
```bash
node test-email-config.js
```

### Send Test Email
```bash
node test-email.js
```

### Test Full Notification System
```bash
node test-notifications.js
```

### Start Server with Email
```bash
npm start
```

---

## Expected Output

### Successful Email Test
```
🧪 Testing Email Notification Feature...

📧 Sending test email to: anupam@tarality.com
👤 Guest Name: Anupam
🏠 Room Number: TEST-101
⏰ Checkout Time: 5/8/2026, 2:18:51 PM

📧 Email sent successfully to anupam@tarality.com: [message-id]
✅ Email notification sent successfully!
📊 Result Details:
   - Status: sent
   - Email Sent: ✅ Yes
   - Timestamp: 2026-05-08T06:48:51.838Z
```

### Email Content

**Subject:** Checkout Reminder - 2 Hours Before Checkout

**HTML Email Body:**
- Professional styled email with hotel branding
- Guest name and personalized message
- Room number and checkout time prominently displayed
- Thank you message

---

## Troubleshooting

### "Authentication failed"
- ✅ Verify App Password is correct (16 characters, no spaces)
- ✅ Ensure 2FA is enabled
- ✅ Try generating a new App Password

### "Email not sent"
- ✅ Check .env file has correct EMAIL_USER and EMAIL_PASSWORD
- ✅ Restart server after .env changes
- ✅ Verify internet connection

### "Email goes to spam"
- ✅ Add the sender email to contacts
- ✅ Check Gmail sending limits (500/day for free accounts)

---

## Integration with Booking System

Once email is configured, the booking system will automatically send emails when:

1. **Manual API call**: `POST /api/bookings/send-checkout-reminders`
2. **Automatic scheduler**: Every 30 minutes (when enabled)
3. **Guest check-in**: Include `guestEmail` in booking data

### Example Booking with Email
```bash
curl -X POST http://localhost:5000/api/bookings/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "ROOM_ID",
    "guestName": "Anupam",
    "guestEmail": "anupam@tarality.com",
    "checkInDate": "2026-05-08T10:00:00Z",
    "checkOutDate": "2026-05-08T12:00:00Z"
  }'
```

---

## Email Features

✅ **HTML Email Templates** - Professional styling  
✅ **Fallback Text Version** - For email clients without HTML support  
✅ **Error Handling** - Continues with console logging if email fails  
✅ **Multiple Recipients** - Can send to multiple guests  
✅ **Customizable Content** - Easy to modify message templates  
✅ **SMTP Configuration** - Works with Gmail, Outlook, Yahoo, etc.  

---

## Next Steps

1. **Set up Gmail App Password** (required)
2. **Update .env file** with your credentials
3. **Test email functionality** with `node test-email.js`
4. **Enable scheduler** in server.js for automatic reminders
5. **Deploy to production** with real email credentials

---

## Security Notes

- **Never commit .env file** to version control
- **Use App Passwords** instead of regular passwords
- **Rotate passwords** periodically
- **Monitor email sending** for abuse
- **Use environment-specific** email accounts (dev/staging/prod)