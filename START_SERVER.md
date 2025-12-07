# How to Start the Backend Server

## Quick Start

1. **Open a terminal** in the project directory

2. **Start the server:**
   ```bash
   npm run server
   ```

3. **You should see:**
   ```
   🚀 SNACK BOX API server running on http://localhost:3000
   📧 Email service configured: snackbox2121@gmail.com
   ✅ Email service verified and ready
   ```

4. **Keep this terminal open** - the server needs to keep running

5. **In another terminal**, start the frontend:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Server won't start?

1. **Check for syntax errors:**
   ```bash
   node -c server.js
   node -c backend/routes/auth.js
   ```

2. **Check if port 3000 is already in use:**
   ```bash
   lsof -i :3000
   ```
   If something is using it, either:
   - Stop that process, or
   - Change `PORT=3001` in `.env` file

3. **Check your .env file:**
   - Make sure `.env` exists in the root directory
   - Make sure `EMAIL_PASSWORD` is set

### Server starts but crashes?

1. **Check the error message** in the terminal
2. **Common issues:**
   - Missing `EMAIL_PASSWORD` in `.env`
   - Wrong Gmail App Password
   - Port already in use

### "Connection refused" error?

- The server is not running
- Start it with: `npm run server`
- Make sure the terminal stays open

## Testing

Once the server is running, test it:

```bash
# Health check
curl http://localhost:3000/api/health

# Test OTP sending
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Running Both Frontend and Backend

You need **two terminals**:

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

