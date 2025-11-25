# MongoDB Connection Fix Guide

## Current Error
```
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
Could not connect to any servers in your MongoDB Atlas cluster
```

## Quick Fix: IP Whitelist in MongoDB Atlas

### Step 1: Access MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Select your cluster (e.g., `Cluster0`)

### Step 2: Whitelist Your IP Address
1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"** button
3. For **development**, click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ **Warning**: Only use this for development, not production!
4. Click **"Confirm"**
5. Wait **1-2 minutes** for changes to take effect

### Step 3: Verify Connection String
Make sure your `.env` file has the correct connection string:
```env
MONGODB_URI=mongodb+srv://driveon:driveon2025@cluster0.dbvxz1c.mongodb.net/driveon?appName=Cluster0
```

### Step 4: Restart Backend Server
After whitelisting your IP:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Alternative: Use Local MongoDB (For Development)

If you prefer to use local MongoDB instead of Atlas:

### Step 1: Install MongoDB Locally
- **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Or use MongoDB via Docker:
  ```bash
  docker run -d -p 27017:27017 --name mongodb mongo:latest
  ```

### Step 2: Update .env File
Change `MONGODB_URI` in your `.env` file:
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/driveon

# OR if MongoDB requires authentication:
MONGODB_URI=mongodb://username:password@localhost:27017/driveon
```

### Step 3: Restart Backend Server
```bash
npm run dev
```

## Verify Connection

After fixing, you should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: driveon
```

## Common Issues

### Issue 1: "IP not whitelisted"
**Solution**: Follow Step 2 above to whitelist your IP in MongoDB Atlas

### Issue 2: "Authentication failed"
**Solution**: 
- Check username and password in connection string
- Make sure database user exists in MongoDB Atlas
- Verify user has proper permissions

### Issue 3: "Cluster is paused" (Free Tier)
**Solution**: 
- Go to MongoDB Atlas
- Click on your cluster
- Click "Resume" if it's paused
- Free tier clusters pause after 1 hour of inactivity

### Issue 4: Connection timeout
**Solution**:
- Check your internet connection
- Verify firewall isn't blocking MongoDB ports
- Try whitelisting IP again
- Check if MongoDB Atlas is accessible from your network

## Testing Connection

You can test the connection directly:
```bash
# Using MongoDB Compass (GUI)
# Connection string: mongodb+srv://driveon:driveon2025@cluster0.dbvxz1c.mongodb.net/driveon

# Using mongo shell
mongosh "mongodb+srv://driveon:driveon2025@cluster0.dbvxz1c.mongodb.net/driveon"
```

## Need Help?

If issues persist:
1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Review MongoDB Atlas logs in the dashboard
3. Verify all environment variables are set correctly
4. Check backend server logs for detailed error messages

