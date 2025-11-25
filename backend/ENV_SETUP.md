# Environment Variables Setup

## Create `.env` file in the `backend` directory

Copy the following content into a `.env` file in the `backend` directory:

```env
# ============================================
# DriveOn Backend - Environment Configuration
# ============================================

# MongoDB Configuration
# For local MongoDB: mongodb://localhost:27017/driveon
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/driveon
MONGODB_URI=mongodb+srv://driveon:driveon2025@cluster0.dbvxz1c.mongodb.net/driveon?appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET=driveon-jwt-secret-key-2024
JWT_REFRESH_SECRET=driveon-refresh-secret-key-2024
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# ============================================
# Cloudinary Configuration
# ============================================
CLOUDINARY_CLOUD_NAME=dypq1jsp4
CLOUDINARY_API_KEY=527951272348495
CLOUDINARY_API_SECRET=3KvMgaUJ6rdYXX-haDPkOfey8-c

# ============================================
# SMSIndia Hub Configuration
# ============================================
SMSINDIAHUB_API_KEY=j8oT8a4QSkuE8UbnoUHqDw
SMSINDIAHUB_SENDER_ID=SMSHUB
# SMSINDIAHUB_TEMPLATE_ID=your_template_id_here  # Optional: DLT template ID (register template in SMSIndia Hub dashboard)
# SMSINDIAHUB_USE_PROMOTIONAL=false  # Optional: Set to 'true' for promotional SMS (NOT recommended for OTP, use only for testing)
```

## Quick Setup

1. Navigate to the `backend` directory
2. Create a new file named `.env`
3. Copy and paste the content above
4. Save the file
5. Restart your backend server

## Important Notes

- **Never commit `.env` file to Git** - it contains sensitive credentials
- The `.env.example` file is a template (without actual secrets)
- Make sure MongoDB Atlas connection string includes your database name
- JWT tokens expire in 24 hours (configurable via `JWT_EXPIRE`)

