# Backend API Setup Guide

This guide will help you set up the backend API server for SNACK BOX email OTP functionality.

## Prerequisites

- Node.js (v16 or higher)
- Gmail account (snackbox2121@gmail.com)
- Gmail App Password (see setup instructions below)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   FRONTEND_URL=http://localhost:5173

   # Email Configuration
   EMAIL_USER=snackbox2121@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password

   # JWT Secret (change this to a random string in production)
   JWT_SECRET=snackbox-secret-key-change-in-production
   ```

## Gmail App Password Setup

To send emails, you need to generate a Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "SNACK BOX API" as the name
6. Click **Generate**
7. Copy the 16-character password (no spaces)
8. Paste it in your `.env` file as `EMAIL_PASSWORD`

**Important:** Use the App Password, NOT your regular Gmail password.

## Running the Server

### Development Mode

```bash
# Run backend server only
npm run server

# Run with auto-reload (requires Node.js 18+)
npm run dev:server

# Run both frontend and backend (requires concurrently)
npm run dev:all
```

### Production Mode

```bash
# Build frontend first
npm run build

# Run backend server
npm run server
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Send OTP
- **POST** `/api/auth/send-otp`
- **Body:** `{ "email": "user@example.com" }`
- **Response:** `{ "success": true, "message": "OTP sent successfully" }`

### Verify OTP
- **POST** `/api/auth/verify-otp`
- **Body:** `{ "email": "user@example.com", "otp": "123456" }`
- **Response:** `{ "success": true, "valid": true, "message": "OTP verified successfully!", "token": "jwt_token" }`

## Frontend Configuration

The frontend is configured to use `http://localhost:3000/api` by default.

To change the API URL, create a `.env` file in the root directory with:
```env
VITE_API_URL=http://your-backend-url/api
```

## Testing

1. Start the backend server:
   ```bash
   npm run server
   ```

2. Start the frontend (in another terminal):
   ```bash
   npm run dev
   ```

3. Test the OTP flow:
   - Open the app in your browser
   - Click "Login with Email"
   - Enter your email address
   - Check your email for the OTP code
   - Enter the OTP to verify

## Troubleshooting

### Email Not Sending

1. **Check Gmail App Password:**
   - Make sure you're using the App Password, not your regular password
   - Verify the App Password is correct in `.env`

2. **Check Gmail Security:**
   - Ensure 2-Step Verification is enabled
   - Check if "Less secure app access" is needed (usually not with App Passwords)

3. **Check Server Logs:**
   - Look for error messages in the console
   - Common errors:
     - `EAUTH`: Invalid email credentials
     - `ECONNECTION`: Network/connection issues

### CORS Errors

If you see CORS errors in the browser:
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Check that the backend server is running
- Verify the API URL in the frontend matches the backend URL

### Port Already in Use

If port 3000 is already in use:
- Change `PORT` in `.env` to a different port (e.g., 3001)
- Update `VITE_API_URL` in frontend `.env` to match

## Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Change JWT_SECRET** - Use a strong random string in production
3. **Use HTTPS** - In production, always use HTTPS for API calls
4. **Rate Limiting** - Consider adding rate limiting middleware for production
5. **Database** - For production, replace in-memory OTP store with Redis or database

## Production Deployment

For production deployment:

1. Set up environment variables on your hosting platform
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name snackbox-api
   ```
3. Set up reverse proxy (nginx/Apache) if needed
4. Enable HTTPS
5. Set up monitoring and logging
6. Use a database or Redis for OTP storage

## Support

For issues or questions:
- Check server logs for error messages
- Verify environment variables are set correctly
- Test email sending with a simple nodemailer script
- Review the API documentation above

