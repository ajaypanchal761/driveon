# Backend Connection Setup Guide

This guide explains how to properly connect the frontend to the backend API.

## Quick Setup

### 1. Create Environment File

Create a `.env` file in the `driveon/frontend/` directory with the following content:

```env
# Backend API Base URL
# For local development:
VITE_API_BASE_URL=http://localhost:5000/api

# For production (if using production backend):
# VITE_API_BASE_URL=https://driveon-19hg.onrender.com/api

# Google Maps API Key (optional, for location features)
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Start Backend Server

Make sure the backend server is running:

```bash
cd driveon/backend
npm install
npm run dev
```

The backend should start on `http://localhost:5000`

### 3. Start Frontend

```bash
cd driveon/frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Configuration Details

### API Base URL

The frontend uses a centralized API configuration located at `src/config/api.js`:

- **Priority 1**: Environment variable `VITE_API_BASE_URL`
- **Priority 2**: Production URL (default): `https://driveon-19hg.onrender.com/api`
- **Priority 3**: Local development fallback

### Socket.IO Connection

Socket.IO automatically uses the same base URL as the API (without `/api` suffix):
- Local: `http://localhost:5000`
- Production: `https://driveon-19hg.onrender.com`

## API Endpoints

All API endpoints are defined in `src/constants/index.js` and use the centralized API instance from `src/services/api.js`.

### Available Services

- **Auth Service** (`src/services/auth.service.js`) - User authentication
- **User Service** (`src/services/user.service.js`) - User profile management
- **Car Service** (`src/services/car.service.js`) - Car listings and details
- **Booking Service** (`src/services/booking.service.js`) - Booking management
- **Payment Service** (`src/services/payment.service.js`) - Payment processing
- **Admin Service** (`src/services/admin.service.js`) - Admin operations
- **Support Service** (`src/services/support.service.js`) - Support tickets
- **Location Service** (`src/services/location.service.js`) - Location tracking

## Testing the Connection

### 1. Check Backend Health

Open your browser and navigate to:
```
http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "..."
}
```

### 2. Check API Connection

Open browser console (F12) and look for:
```
🔗 Using API URL from environment: http://localhost:5000/api
📡 API Configuration: { API_BASE_URL: "...", SOCKET_URL: "..." }
```

### 3. Test API Call

Try logging in or registering a user. Check the Network tab in browser DevTools to see if API calls are being made to the correct backend URL.

## Troubleshooting

### Connection Refused Error

**Problem**: `ERR_CONNECTION_REFUSED` or `Network Error`

**Solutions**:
1. Make sure the backend server is running on port 5000
2. Check if the backend `.env` file has correct MongoDB connection
3. Verify CORS settings in backend `server.js` allow frontend origin

### CORS Error

**Problem**: `Access-Control-Allow-Origin` error

**Solution**: 
- Check `FRONTEND_URL` in backend `.env` file
- Should be: `FRONTEND_URL=http://localhost:5173`

### Socket.IO Connection Failed

**Problem**: Socket.IO not connecting

**Solutions**:
1. Verify backend Socket.IO is enabled (check backend `server.js`)
2. Check browser console for Socket.IO connection errors
3. Ensure firewall is not blocking WebSocket connections

### Environment Variable Not Working

**Problem**: Frontend still using production URL

**Solutions**:
1. Make sure `.env` file is in `driveon/frontend/` directory (not `driveon/`)
2. Restart the Vite dev server after creating/modifying `.env`
3. Check that variable name starts with `VITE_` prefix
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

## Production Deployment

For production, set the environment variable to your production backend URL:

```env
VITE_API_BASE_URL=https://your-production-backend.com/api
```

Or use your hosting platform's environment variable configuration (Vercel, Netlify, etc.)

## Additional Notes

- All API calls automatically include authentication tokens when available
- Token refresh is handled automatically by the API interceptor
- Socket.IO reconnection is automatic with retry logic
- API timeout is set to 30 seconds

