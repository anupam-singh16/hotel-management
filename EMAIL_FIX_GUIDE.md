# 🚨 EMAIL NOT RECEIVED - TROUBLESHOOTING GUIDE

## ❌ Problem: Email not sent because Gmail credentials are not configured

Your `.env` file still has placeholder values. Here's how to fix it:

---

## ✅ SOLUTION: Set up Gmail App Password (5 minutes)

### Step 1: Enable 2-Factor Authentication (2FA)
1. Go to https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2FA

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select **"Mail"** from the first dropdown
4. Select **"Other (custom name)"** from the second dropdown
5. Enter **"Hotel Management"** as the name
6. Click **"Generate"**
7. **COPY the 16-character password** (it looks like: `abcd-efgh-ijkl-mnop`)

### Step 3: Update .env File
Open your `.env` file and replace the placeholder values:

```env
# BEFORE (doesn't work):
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# AFTER (replace with your real info):
EMAIL_USER=myemail@gmail.com
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
EMAIL_FROM=myemail@gmail.com
```

### Step 4: Test Email
```bash
node send-test-email.js
```

---

## 🔍 Expected Success Output:
```
🚀 Sending test email to anupam@tarality.com...

✅ SUCCESS: Email sent to anupam@tarality.com!
📧 Message ID: 1234567890abcdef
```

---

## 🐛 Common Issues & Solutions:

### ❌ "Authentication failed"
**Cause:** Wrong App Password or 2FA not enabled
**Solution:**
- Double-check you copied the App Password correctly (16 characters, no spaces)
- Make sure 2FA is enabled on your Gmail account
- Generate a new App Password if needed

### ❌ "Email goes to spam"
**Cause:** Gmail's spam filter
**Solution:**
- Check your spam/junk folder
- Add the sender email to your contacts
- Gmail has daily sending limits (500 emails for free accounts)

### ❌ "Invalid login"
**Cause:** Using regular password instead of App Password
**Solution:**
- Gmail requires App Passwords for automated sending
- Regular passwords don't work for security reasons

---

## 📧 What the Email Contains:

**To:** anupam@tarality.com  
**From:** Your Gmail address  
**Subject:** Checkout Reminder - 2 Hours Before Checkout  

**Professional HTML Email:**
- Personalized greeting: "Dear Anupam"
- Checkout time and room details
- Hotel branding and thank you message
- Mobile-responsive design

---

## 🧪 Test Commands:

```bash
# Check configuration
node test-email-config.js

# Send test email
node send-test-email.js

# Test full notification system
node test-notifications.js
```

---

## ⚡ Quick Test (if you already have App Password):

1. Edit `.env` file with your real Gmail address and App Password
2. Save the file
3. Run: `node send-test-email.js`
4. Check anupam@tarality.com inbox

---

## 📞 Need Help?

If you're still having issues:

1. **Verify 2FA is enabled** on your Gmail account
2. **Double-check App Password** (copy exactly, no spaces)
3. **Restart your server** after updating `.env`
4. **Check Gmail sending limits** (500/day for free accounts)

Once you update the `.env` file with real credentials, the email will be sent successfully! 🚀