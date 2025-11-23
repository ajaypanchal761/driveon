# Render Deployment Guide for DriveOn Backend

## Quick Setup on Render

### Option 1: Using Render Dashboard (Recommended)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select the repository

2. **Configure Service Settings**

   **Basic Settings:**
   - **Name**: `driveon-backend` (or your preferred name)
   - **Region**: Choose closest to your users (e.g., `Singapore` for India)
   - **Branch**: `main` or `master`
   - **Root Directory**: `backend` (if monorepo) or `.` (if backend is root)
   - **Environment**: `Node`
   - **Build Command**: `npm install` (or leave empty - Render auto-installs)
   - **Start Command**: `npm start`

   **Advanced Settings:**
   - **Auto-Deploy**: `Yes` (deploys on every push)

3. **Environment Variables**
   Add these in Render Dashboard → Environment:

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   SMSINDIAHUB_API_KEY=your_sms_api_key
   SMSINDIAHUB_SENDER_ID=your_sender_id
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy

### Option 2: Using render.yaml (Infrastructure as Code)

1. **Use the provided `render.yaml` file**
   - The file is already in the `backend` folder
   - In Render Dashboard, select "New +" → "Blueprint"
   - Connect your repo
   - Render will auto-detect `render.yaml`

2. **Set Environment Variables**
   - Go to your service → Environment
   - Add all required variables (see list above)

## Important Configuration Details

### Build Command
```
npm install
```
**OR** leave it empty - Render automatically runs `npm install` before start command.

### Start Command
```
npm start
```
This runs `node server.js` as defined in `package.json`.

### Port Configuration
- Render automatically sets `PORT` environment variable
- Your code uses `process.env.PORT || 5000`
- Render provides port via `PORT` env var (usually `10000` for free tier)

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment | Yes | `production` |
| `PORT` | Server port | Auto-set by Render | `10000` |
| `MONGODB_URI` | MongoDB connection | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | JWT secret key | Yes | Random string |
| `JWT_REFRESH_SECRET` | Refresh token secret | Yes | Random string |
| `JWT_EXPIRE` | Access token expiry | Optional | `15m` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | Optional | `7d` |
| `FRONTEND_URL` | Frontend URL (for CORS) | Yes | `https://your-app.vercel.app` |
| `SMSINDIAHUB_API_KEY` | SMS API key | Yes | Your API key |
| `SMSINDIAHUB_SENDER_ID` | SMS sender ID | Yes | Your sender ID |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | Your cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | Your API secret |

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Add to `MONGODB_URI` in Render

### Option 2: Render MongoDB (Paid)
1. Create MongoDB service in Render
2. Use internal connection string

## Post-Deployment

### 1. Get Your Backend URL
After deployment, Render provides a URL like:
```
https://driveon-backend.onrender.com
```

### 2. Update Frontend Environment Variable
In Vercel (or your frontend hosting):
```
VITE_API_BASE_URL=https://driveon-backend.onrender.com/api
```

### 3. Update CORS in Backend
Make sure `FRONTEND_URL` in Render matches your frontend URL.

### 4. Test Your API
```bash
curl https://driveon-backend.onrender.com/health
```

## Troubleshooting

### Issue: Build fails
**Solution:**
- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version is compatible (Render uses Node 18+ by default)

### Issue: Server crashes on start
**Solution:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string
- Verify PORT is not hardcoded (use `process.env.PORT`)

### Issue: CORS errors
**Solution:**
- Verify `FRONTEND_URL` is set correctly in Render
- Check frontend is calling correct backend URL
- Ensure CORS middleware is configured

### Issue: MongoDB connection fails
**Solution:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Verify MongoDB credentials are correct

### Issue: API returns 404
**Solution:**
- Check routes are mounted correctly
- Verify API base URL includes `/api`
- Check server logs for route registration

## Free Tier Limitations

- **Spins down after 15 minutes of inactivity**
- First request after spin-down takes ~30 seconds
- **512MB RAM**
- **0.1 CPU**

**Solution for production:**
- Upgrade to paid plan ($7/month) for always-on
- Or use a service like [UptimeRobot](https://uptimerobot.com) to ping your API every 5 minutes

## Health Check Endpoint

Your API has a health check endpoint:
```
GET /health
```

You can use this for monitoring services.

## Support

For issues:
1. Check Render logs in dashboard
2. Verify environment variables
3. Test locally with same environment variables
4. Check Render status page: https://status.render.com

