# 🚀 SNACK BOX - Deployment Guide

## Quick Start

**Fastest way to deploy:**

1. **Backend (Render)**: Follow `RENDER_DEPLOY.md`
2. **Frontend (Vercel)**: Follow `VERCEL_DEPLOY.md`
3. **Full Guide**: See `DEPLOYMENT.md`

---

## 📋 What You Need

- GitHub account (code repository)
- Gmail account with App Password
- Render account (free tier available)
- Vercel account (free tier available)

---

## ⚡ 5-Minute Deployment

### 1. Backend (2 minutes)

```bash
# 1. Generate JWT secret
node generate-secret.js

# 2. Go to Render.com
# 3. Create Web Service
# 4. Set environment variables (see RENDER_DEPLOY.md)
# 5. Deploy
```

### 2. Frontend (2 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Set VITE_API_URL
vercel env add VITE_API_URL production
# Enter: https://your-render-api.onrender.com/api

# 4. Deploy to production
vercel --prod
```

### 3. Update CORS (1 minute)

1. Copy your Vercel URL
2. Update `FRONTEND_URL` in Render dashboard
3. Wait for auto-redeploy

---

## 📁 Files Created

- `vercel.json` - Vercel configuration
- `render.yaml` - Render configuration (optional, can use dashboard)
- `DEPLOYMENT.md` - Full deployment guide
- `QUICK_DEPLOY.md` - Quick reference
- `RENDER_DEPLOY.md` - Render-specific guide
- `VERCEL_DEPLOY.md` - Vercel-specific guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `generate-secret.js` - JWT secret generator

---

## 🔗 URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://snack-box-api.onrender.com`

---

## 🆘 Need Help?

1. Check `DEPLOYMENT.md` for detailed steps
2. Check `DEPLOYMENT_CHECKLIST.md` for verification
3. Review service logs in Render/Vercel dashboards
4. Test endpoints with curl commands

---

## 💡 Pro Tips

1. **Deploy backend first** - You need the API URL for frontend
2. **Use Render disk storage** - Excel files persist
3. **Free tier works** - But Render may spin down after inactivity
4. **HTTPS automatic** - Both platforms provide it
5. **Environment variables** - Set in dashboards, not in code

---

Ready to deploy? Start with `QUICK_DEPLOY.md`! 🚀

