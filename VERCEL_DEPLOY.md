# Quick Vercel Deployment Guide

## Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Deploy

```bash
# First deployment (will ask questions)
vercel

# Production deployment
vercel --prod
```

## Step 4: Set Environment Variable

After deployment, set the API URL:

```bash
vercel env add VITE_API_URL production
# Enter: https://your-render-api.onrender.com/api
```

Or set it in Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-render-api.onrender.com/api`
4. Redeploy

## That's it!

Your frontend will be live at: `https://your-project.vercel.app`

