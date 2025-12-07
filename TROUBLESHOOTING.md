# Troubleshooting "Failed to send OTP"

## Quick Diagnostic Steps

### 1. Check if Backend Server is Running

```bash
# Check if server is running
curl http://localhost:3000/api/health
```

If you get a connection error, start the server:
```bash
npm run server
```

### 2. Test Email Configuration

Run the email test script:
```bash
npm run test:email
```

This will verify:
- ✅ EMAIL_PASSWORD is set in .env
- ✅ Gmail App Password is correct
- ✅ Email service can connect

### 3. Check Server Logs

When you try to send an OTP, check the server console for error messages:
- `EAUTH` = Authentication error (wrong password)
- `ECONNECTION` = Network/connection issue
- `ETIMEDOUT` = Timeout connecting to Gmail

## Common Issues and Solutions

### Issue 1: "Cannot connect to server"

**Symptoms:**
- Error: "Cannot connect to server. Please make sure the backend server is running."

**Solution:**
1. Make sure the backend server is running:
   ```bash
   npm run server
   ```
2. Check that it's running on port 3000 (or your configured port)
3. Verify the frontend is trying to connect to the correct URL

### Issue 2: "Email authentication failed" (EAUTH)

**Symptoms:**
- Error: "Email authentication failed. Please check your Gmail App Password"
- Server log shows: `Error code: EAUTH`

**Solution:**
1. **Verify you're using an App Password, not your regular password:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification (if not already enabled)
   - Go to "App passwords"
   - Generate a new app password for "SNACK BOX API"
   - Copy the 16-character password (no spaces)

2. **Update your .env file:**
   ```env
   EMAIL_USER=snackbox2121@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password-here
   ```

3. **Restart the server** after updating .env

### Issue 3: "EMAIL_PASSWORD is not set"

**Symptoms:**
- Error: "Email service not configured"
- Server log shows: "WARNING: EMAIL_PASSWORD is not set"

**Solution:**
1. Create or update `.env` file in the root directory
2. Add:
   ```env
   EMAIL_PASSWORD=your-gmail-app-password
   ```
3. Restart the server

### Issue 4: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Requests are blocked

**Solution:**
1. Check `FRONTEND_URL` in `.env` matches your frontend URL:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```
2. If using a different port, update it
3. Restart the server

### Issue 5: Port Already in Use

**Symptoms:**
- Error: "Port 3000 is already in use"

**Solution:**
1. Change the port in `.env`:
   ```env
   PORT=3001
   ```
2. Update frontend `.env` (if using):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```
3. Restart the server

## Step-by-Step Debugging

### Step 1: Verify Environment Variables

Check your `.env` file has all required variables:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-app-password-here
JWT_SECRET=your-secret-key
```

### Step 2: Test Email Configuration

```bash
npm run test:email
```

Expected output:
```
✅ Email service verified successfully!
✅ Your email configuration is correct.
```

If it fails, follow the error message instructions.

### Step 3: Start Backend Server

```bash
npm run server
```

Expected output:
```
🚀 SNACK BOX API server running on http://localhost:3000
📧 Email service configured: snackbox2121@gmail.com
✅ Email service verified and ready
```

If you see warnings or errors, fix them before proceeding.

### Step 4: Test API Endpoint

In another terminal:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "SNACK BOX API is running",
  "emailConfigured": true,
  "emailUser": "snackbox2121@gmail.com"
}
```

### Step 5: Test Email Sending

```bash
curl -X POST http://localhost:3000/api/auth/test-email
```

Expected response:
```json
{
  "success": true,
  "message": "Email service is configured correctly"
}
```

### Step 6: Test from Frontend

1. Start frontend: `npm run dev`
2. Open browser console (F12)
3. Try to send OTP
4. Check for errors in:
   - Browser console
   - Server console

## Getting Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click "2-Step Verification" → Enable if not enabled
4. Scroll down and click "App passwords"
5. Select:
   - App: "Mail"
   - Device: "Other (Custom name)"
   - Name: "SNACK BOX API"
6. Click "Generate"
7. Copy the 16-character password (it looks like: `abcd efgh ijkl mnop`)
8. Remove spaces and add to `.env` as: `EMAIL_PASSWORD=abcdefghijklmnop`

## Still Having Issues?

1. **Check server logs** - Look for detailed error messages
2. **Check browser console** - Look for network errors
3. **Verify .env file** - Make sure it's in the root directory
4. **Restart server** - After any .env changes
5. **Test email script** - Run `npm run test:email` for diagnostics

## Quick Checklist

- [ ] Backend server is running (`npm run server`)
- [ ] `.env` file exists in root directory
- [ ] `EMAIL_PASSWORD` is set in `.env`
- [ ] Using Gmail App Password (not regular password)
- [ ] 2-Step Verification is enabled on Google account
- [ ] Frontend URL matches `FRONTEND_URL` in `.env`
- [ ] No port conflicts
- [ ] Email test passes (`npm run test:email`)

