# 🔑 GMAIL APP PASSWORD REQUIRED

## ❌ Current Issue:
Your `EMAIL_PASSWORD` is set to `Anupam@7210`, which appears to be a regular password. Gmail requires **App Passwords** for automated email sending.

## ✅ SOLUTION: Generate Gmail App Password

### Step 1: Enable 2-Factor Authentication (2FA)
1. Go to: https://myaccount.google.com/
2. Click "Security" → "2-Step Verification"
3. Enable 2FA if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: `anupamsingh16june@gmail.com`
3. Select **"Mail"** from first dropdown
4. Select **"Other (custom name)"** from second dropdown
5. Enter **"Hotel Management"** as the name
6. Click **"Generate"**
7. **COPY the 16-character password** (looks like: `abcd-efgh-ijkl-mnop`)

### Step 3: Update .env File
Replace your current password with the App Password:

```env
EMAIL_PASSWORD=abcd-efgh-ijkl-mnop  # Your 16-char App Password
```

### Step 4: Test Email
```bash
node send-test-email.js
```

---

## 📧 Expected App Password Format:
- **16 characters** (4 groups of 4 characters)
- **No spaces** (remove any spaces when copying)
- **Example:** `abcd-efgh-ijkl-mnop`
- **NOT your regular password**

---

## 🧪 Test Commands:
```bash
# Check current config
node check-email-setup.js

# Send test email
node send-test-email.js
```

---

## ⚠️ Important Notes:
- **App Passwords are different from your regular password**
- **Each app gets its own App Password**
- **You can revoke App Passwords anytime**
- **Keep App Passwords secure**

Once you generate and set the proper Gmail App Password, the email will send successfully! 🚀