# Email Setup Guide for Gmail

## Step 1: Enable 2-Factor Authentication (2FA)

If you haven't already, enable 2FA on your Gmail account:
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "Signing in to Google"
3. Enable "2-Step Verification"

## Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in with your Gmail account
3. Select "Mail" as the app
4. Select "Other (custom name)" as the device
5. Enter "Hotel Management" as the custom name
6. Click "Generate"
7. **Copy the 16-character password** (ignore spaces)

## Step 3: Update .env File

Update your `.env` file with the app password:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # Your 16-character app password
EMAIL_FROM=your-gmail@gmail.com
```

## Step 4: Test Email

Run the email test:
```bash
node test-email.js
```

## Important Notes

- **Never use your regular Gmail password** - Always use App Passwords
- **App Passwords are specific to each app** - You can create multiple
- **Keep App Passwords secure** - Treat them like regular passwords
- **You can revoke App Passwords anytime** from your Google Account

## Troubleshooting

### "Authentication failed" Error
- Double-check your App Password (copy exactly, no spaces)
- Make sure 2FA is enabled on your account
- Try generating a new App Password

### "Less secure app access" Error
- Gmail requires App Passwords for automated sending
- Regular passwords won't work for security reasons

### Email not received
- Check your spam/junk folder
- Verify the recipient email address
- Check Gmail sending limits (500 emails/day for free accounts)

## Alternative Email Services

If you prefer not to use Gmail, you can also configure:

### Outlook/Hotmail
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Yahoo
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

### Custom SMTP
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

## Testing Checklist

- [ ] 2FA enabled on Gmail account
- [ ] App Password generated and copied
- [ ] .env file updated with correct credentials
- [ ] Server restarted after .env changes
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)