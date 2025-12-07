# Deployment Guide - Vercel (Frontend) + Render (Backend)

This guide will help you deploy SNACK BOX to Vercel (frontend) and Render (backend).

## Architecture

- **Frontend**: Vercel (React/Vite app)
- **Backend**: Render (Node.js/Express API)
- **Storage**: Render disk storage for Excel files

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Render

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `snack-box-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Plan**: Free (or paid for better performance)

### Step 3: Set Environment Variables on Render

In Render dashboard, go to **Environment** tab and add:

```env
NODE_ENV=production
PORT=10000
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
JWT_SECRET=your-strong-random-secret-key-here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important**: 
- Replace `FRONTEND_URL` with your actual Vercel URL (you'll get this after deploying frontend)
- Use a strong random string for `JWT_SECRET`
- `EMAIL_PASSWORD` should be your Gmail App Password

### Step 4: Add Disk Storage (for Excel files)

1. In Render dashboard, go to **Disks** tab
2. Click **"Create Disk"**
3. Configure:
   - **Name**: `snack-box-data`
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: 1 GB (free tier)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete
3. Copy your Render URL (e.g., `https://snack-box-api.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL

The frontend will automatically use `VITE_API_URL` environment variable. We'll set this in Vercel.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set environment variable**:
   ```bash
   vercel env add VITE_API_URL
   # Enter your Render API URL: https://snack-box-api.onrender.com/api
   ```

5. **Redeploy with environment variable**:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Add: `VITE_API_URL` = `https://your-render-api.onrender.com/api`
   - Make sure it's set for **Production**, **Preview**, and **Development**

6. **Deploy**: Click **"Deploy"**

---

## Part 3: Update Backend CORS

After deploying frontend, update Render environment variable:

1. Go to Render dashboard
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Render will automatically redeploy

---

## Part 4: Verify Deployment

### Test Backend

```bash
curl https://your-render-api.onrender.com/api/health
```

Should return:
```json
{"status":"ok","message":"SNACK BOX API is running",...}
```

### Test Frontend

1. Open your Vercel URL in browser
2. Try logging in with email OTP
3. Check browser console for any errors

---

## Environment Variables Summary

### Render (Backend)

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Server port (Render default) |
| `EMAIL_USER` | `snackbox2121@gmail.com` | Gmail address |
| `EMAIL_PASSWORD` | `your-app-password` | Gmail App Password |
| `JWT_SECRET` | `random-string` | JWT signing secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Vercel frontend URL |

### Vercel (Frontend)

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-api.onrender.com/api` | Backend API URL |

---

## Troubleshooting

### Backend Issues

1. **Excel files not persisting?**
   - Make sure disk is mounted correctly
   - Check disk mount path in Render dashboard

2. **CORS errors?**
   - Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
   - Check CORS configuration in `server.js`

3. **Email not sending?**
   - Verify `EMAIL_PASSWORD` is correct Gmail App Password
   - Check Render logs for email errors

### Frontend Issues

1. **API calls failing?**
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Check browser console for CORS errors
   - Ensure backend is running on Render

2. **Build errors?**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on both platforms
- [ ] CORS configured correctly
- [ ] Excel disk storage mounted on Render
- [ ] Email service tested
- [ ] OTP login tested
- [ ] WhatsApp integration ready (if needed)

---

## Cost Estimate

- **Vercel**: Free tier (generous limits)
- **Render**: Free tier available (with limitations)
  - Free tier: Services may spin down after inactivity
  - Paid tier: $7/month for always-on service

---

## Notes

1. **Render Free Tier**: Services may take 30-60 seconds to start if they've been idle
2. **Excel Files**: Stored on Render disk (persists across deployments)
3. **Environment Variables**: Keep sensitive data in environment variables, never commit to git
4. **HTTPS**: Both Vercel and Render provide HTTPS automatically

---

## Support

For issues:
- Render: Check service logs in dashboard
- Vercel: Check deployment logs
- Both platforms have excellent documentation

