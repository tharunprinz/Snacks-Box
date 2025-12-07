# 🚀 Quick Deployment Guide

Deploy SNACK BOX in 10 minutes!

## Architecture
- **Frontend**: Vercel (free, fast CDN)
- **Backend**: Render (free tier available)

---

## 📦 Step 1: Deploy Backend to Render

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 1.2 Create Render Service

1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `snack-box-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Plan**: Free

### 1.3 Set Environment Variables

In Render → Environment tab, add:

```env
NODE_ENV=production
PORT=10000
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
JWT_SECRET=generate-random-string-here-min-32-chars
FRONTEND_URL=https://your-app.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Add Disk Storage

1. Go to **Disks** tab
2. **Create Disk**:
   - Name: `snack-box-data`
   - Mount: `/opt/render/project/src/backend/data`
   - Size: 1 GB

### 1.5 Deploy

Click **"Create Web Service"** → Wait for deployment

**Copy your Render URL**: `https://snack-box-api.onrender.com`

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set API URL (replace with your Render URL)
vercel env add VITE_API_URL production
# Enter: https://snack-box-api.onrender.com/api

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Add: `VITE_API_URL` = `https://snack-box-api.onrender.com/api`
6. Click **"Deploy"**

---

## ✅ Step 3: Update Backend CORS

After frontend is deployed:

1. Go to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Render will auto-redeploy

---

## 🧪 Step 4: Test

### Test Backend
```bash
curl https://snack-box-api.onrender.com/api/health
```

### Test Frontend
1. Open your Vercel URL
2. Try email OTP login
3. Check browser console for errors

---

## 📝 Environment Variables Checklist

### Render (Backend)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `EMAIL_USER=snackbox2121@gmail.com`
- [ ] `EMAIL_PASSWORD=your-app-password`
- [ ] `JWT_SECRET=random-string`
- [ ] `FRONTEND_URL=https://your-app.vercel.app`

### Vercel (Frontend)
- [ ] `VITE_API_URL=https://snack-box-api.onrender.com/api`

---

## ⚠️ Important Notes

1. **Render Free Tier**: Services may spin down after 15 min inactivity (30-60s cold start)
2. **Excel Files**: Stored on Render disk (persists)
3. **HTTPS**: Both platforms provide HTTPS automatically
4. **CORS**: Must match exactly (no trailing slashes)

---

## 🔧 Troubleshooting

### Backend not responding?
- Check Render service logs
- Verify environment variables
- Check disk is mounted

### Frontend can't connect?
- Verify `VITE_API_URL` in Vercel
- Check CORS in Render (`FRONTEND_URL`)
- Test backend health endpoint

### Email not sending?
- Verify Gmail App Password
- Check Render logs for errors

---

## 💰 Cost

- **Vercel**: Free (generous limits)
- **Render**: Free tier available
  - Free: May spin down after inactivity
  - Paid: $7/month (always on)

---

## 🎉 Done!

Your app is live:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://snack-box-api.onrender.com`

For detailed instructions, see `DEPLOYMENT.md`

