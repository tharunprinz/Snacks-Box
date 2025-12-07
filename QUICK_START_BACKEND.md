# Quick Start - Backend API

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App passwords**
4. Generate a new app password for "SNACK BOX API"
5. Copy the 16-character password

### 3. Create `.env` File

Create a `.env` file in the root directory:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-here
JWT_SECRET=snackbox-secret-key-change-in-production
```

**Replace `your-16-char-app-password-here` with your actual Gmail App Password!**

### 4. Start the Backend Server

```bash
npm run server
```

You should see:
```
🚀 SNACK BOX API server running on http://localhost:3000
📧 Email service configured: snackbox2121@gmail.com
```

### 5. Start the Frontend (in another terminal)

```bash
npm run dev
```

### 6. Test It!

1. Open http://localhost:5173
2. Click "Login with Email"
3. Enter your email
4. Check your email inbox for the OTP
5. Enter the OTP to login

## ✅ That's It!

Your backend API is now running and ready to send OTP emails!

## 🔧 Troubleshooting

**Email not sending?**
- Double-check your Gmail App Password in `.env`
- Make sure 2-Step Verification is enabled
- Check server console for error messages

**CORS errors?**
- Make sure backend is running on port 3000
- Check that `FRONTEND_URL` in `.env` matches your frontend URL

**Port already in use?**
- Change `PORT=3001` in `.env`
- Update frontend `.env` with `VITE_API_URL=http://localhost:3001/api`

For more details, see [BACKEND_SETUP.md](./BACKEND_SETUP.md)

