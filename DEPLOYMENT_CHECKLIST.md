# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Deployment

- [ ] Code is pushed to GitHub
- [ ] All environment variables documented
- [ ] Gmail App Password generated
- [ ] JWT secret generated (`node generate-secret.js`)

## Backend (Render)

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web service created
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `EMAIL_USER=snackbox2121@gmail.com`
  - [ ] `EMAIL_PASSWORD=your-app-password`
  - [ ] `JWT_SECRET=generated-secret`
  - [ ] `FRONTEND_URL=will-update-after-frontend-deploy`
- [ ] Disk storage created and mounted
- [ ] Service deployed successfully
- [ ] Health check passes: `curl https://your-api.onrender.com/api/health`

## Frontend (Vercel)

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project created
- [ ] Environment variable set:
  - [ ] `VITE_API_URL=https://your-api.onrender.com/api`
- [ ] Build successful
- [ ] Frontend deployed

## Post-Deployment

- [ ] Updated `FRONTEND_URL` in Render
- [ ] Tested email OTP login
- [ ] Tested user registration
- [ ] Verified Excel files are being saved
- [ ] Tested WhatsApp sending (if configured)
- [ ] Checked browser console for errors
- [ ] Verified CORS is working

## Production Testing

- [ ] Login with email OTP works
- [ ] User data saves to backend Excel
- [ ] Menu items load correctly
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] Admin dashboard accessible
- [ ] Promo manager works
- [ ] WhatsApp sending works (if configured)

## Security

- [ ] `.env` files not committed to git
- [ ] Excel files in `.gitignore`
- [ ] JWT secret is strong and random
- [ ] Gmail App Password is secure
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on both platforms)

---

## Quick Commands

### Generate JWT Secret
```bash
node generate-secret.js
```

### Test Backend
```bash
curl https://your-api.onrender.com/api/health
```

### Test OTP Endpoint
```bash
curl -X POST https://your-api.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Check service logs in both dashboards for errors

