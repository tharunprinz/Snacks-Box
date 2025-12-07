# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 1. Build Fails

**Error**: Build command failed
**Solution**: 
- Check that `package.json` has `"build": "vite build"`
- Ensure all dependencies are listed (not just devDependencies)
- Check build logs in Vercel dashboard

### 2. Blank Page / 404 Errors

**Error**: Page shows blank or 404
**Solution**: 
- Verify `vercel.json` has correct rewrites
- Check that `outputDirectory` is `dist`
- Ensure `index.html` is in the root

### 3. API Calls Failing

**Error**: Network errors, CORS errors
**Solution**:
- Set `VITE_API_URL` environment variable in Vercel
- Check that backend URL is correct (no trailing slash)
- Verify backend CORS allows your Vercel domain

### 4. Environment Variables Not Working

**Error**: `import.meta.env.VITE_API_URL` is undefined
**Solution**:
- Environment variables must start with `VITE_` to be exposed
- Set in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

### 5. Framework Detection Issues

**Error**: Vercel can't detect framework
**Solution**:
- `vercel.json` specifies `"framework": "vite"`
- Or manually select "Vite" in dashboard

### 6. Build Output Directory Wrong

**Error**: Can't find build output
**Solution**:
- Verify `outputDirectory: "dist"` in `vercel.json`
- Check that `vite.config.js` outputs to `dist`

---

## Quick Fixes

### Update vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Check Environment Variables
1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-api.onrender.com/api`
4. Redeploy

### Verify Build Locally
```bash
npm run build
ls dist  # Should see built files
```

---

## Still Having Issues?

Share:
1. Error message from Vercel logs
2. Browser console errors
3. Build log output
4. What you see on the deployed page

