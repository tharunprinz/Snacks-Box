# 🚀 How to Start SNACK BOX with Backend API

## ⚠️ Important: You Need TWO Terminals Running!

The SNACK BOX app requires **both** a backend server and a frontend server to work.

---

## Step-by-Step Instructions

### Step 1: Start Backend Server

**Open Terminal 1** and run:

```bash
cd /Users/tharunr/projects/snack-box
npm run server
```

**✅ You should see:**
```
🚀 SNACK BOX API server running on http://localhost:3000
📧 Email service configured: snackbox2121@gmail.com
✅ Email service verified and ready
```

**⚠️ KEEP THIS TERMINAL OPEN!** The server must keep running.

---

### Step 2: Start Frontend

**Open Terminal 2** (new terminal window) and run:

```bash
cd /Users/tharunr/projects/snack-box
npm run dev
```

**✅ You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 3: Open Browser

Open http://localhost:5173 in your browser.

---

## ✅ Quick Test

Once both servers are running, test the backend:

```bash
# In a third terminal, or use the check script:
./check-server.sh

# Or manually:
curl http://localhost:3000/api/health
```

You should get a JSON response.

---

## 🔧 Troubleshooting

### "Server returned empty response"

**This means the backend server is NOT running.**

**Fix:**
1. Open a terminal
2. Run: `npm run server`
3. Keep that terminal open
4. Try again

### "Connection refused"

**Same issue - server not running.**

**Fix:** Start the server with `npm run server`

### Server crashes on startup?

1. Check for errors in the terminal
2. Make sure `.env` file exists with `EMAIL_PASSWORD` set
3. Check syntax: `node -c server.js`

### Port 3000 already in use?

Change the port in `.env`:
```env
PORT=3001
```

Then update frontend `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 📋 Checklist

Before trying to send OTP:

- [ ] Backend server is running (`npm run server`)
- [ ] Backend terminal shows "🚀 SNACK BOX API server running"
- [ ] Frontend is running (`npm run dev`)
- [ ] Browser is open at http://localhost:5173
- [ ] `.env` file has `EMAIL_PASSWORD` set

---

## 🎯 Summary

**You need TWO terminals:**

| Terminal | Command | Purpose |
|----------|---------|---------|
| Terminal 1 | `npm run server` | Backend API (port 3000) |
| Terminal 2 | `npm run dev` | Frontend (port 5173) |

**Both must be running at the same time!**

---

## 💡 Pro Tip

Use a terminal multiplexer like `tmux` or split your terminal to see both servers at once!

