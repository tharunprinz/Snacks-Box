# Quick Fix Guide - "Failed to send OTP"

## Step 1: Check if Server is Running

```bash
# Check if server is running
curl http://localhost:3000/api/health
```

If you get "connection refused", start the server:
```bash
npm run server
```

## Step 2: Verify Email Configuration

```bash
# Test email setup
npm run test:email
```

This should show: `✅ Email service verified successfully!`

If it fails, check your `.env` file has:
```env
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
```

## Step 3: Test API Endpoints

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
```

Expected: `{"status":"ok","emailConfigured":true,...}`

### Test 2: Email Service Test
```bash
curl http://localhost:3000/api/auth/test-email
```

Expected: `{"success":true,"message":"Email service is configured correctly"}`

### Test 3: Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

Expected: `{"success":true,"message":"OTP sent successfully..."}`

## Step 4: Check Browser Console

1. Open your app in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try to send OTP
5. Look for error messages

Common errors:
- `Failed to fetch` = Server not running
- `Cannot connect to server` = Server not running or wrong URL
- `Email authentication failed` = Wrong EMAIL_PASSWORD in .env

## Step 5: Check Server Logs

When you try to send OTP, check the server terminal for errors:
- `EAUTH` = Wrong Gmail App Password
- `ECONNECTION` = Network issue
- `Missing credentials` = EMAIL_PASSWORD not set

## Most Common Issues

### Issue: "Cannot connect to server"
**Fix:** Start the backend server:
```bash
npm run server
```

### Issue: "Email authentication failed"
**Fix:** 
1. Get a new Gmail App Password: https://myaccount.google.com/security → App passwords
2. Update `.env` file with the new password
3. Restart server

### Issue: "EMAIL_PASSWORD is not set"
**Fix:**
1. Create/update `.env` file in root directory
2. Add: `EMAIL_PASSWORD=your-app-password`
3. Restart server

## Still Not Working?

1. **Check .env file exists** in root directory
2. **Verify EMAIL_PASSWORD** is correct (16 characters, no spaces)
3. **Restart server** after any .env changes
4. **Check server logs** for detailed error messages
5. **Test email config**: `npm run test:email`

## Debug Commands

```bash
# Test email configuration
npm run test:email

# Test OTP API (if Node 18+)
npm run debug:otp your-email@example.com

# Or use curl
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

