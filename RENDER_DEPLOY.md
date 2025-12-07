# Quick Render Deployment Guide

## Step 1: Push to GitHub

Make sure your code is on GitHub.

## Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Fill in:
   - **Name**: `snack-box-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`

## Step 3: Add Environment Variables

In Render dashboard → Environment tab:

```
NODE_ENV=production
PORT=10000
EMAIL_USER=snackbox2121@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
JWT_SECRET=generate-a-random-string-here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Step 4: Add Disk Storage

1. Go to **Disks** tab
2. Create disk:
   - **Name**: `snack-box-data`
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: 1 GB

## Step 5: Deploy

Click **"Create Web Service"** and wait for deployment.

Your API will be at: `https://snack-box-api.onrender.com`

## Important Notes

- Free tier services may spin down after inactivity (30-60s cold start)
- Update `FRONTEND_URL` after deploying frontend
- Excel files persist on the disk storage

