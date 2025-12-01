# Location Tracking Setup Guide

This guide explains how to set up and use the real-time location tracking feature for users and guarantors.

## Features

- ✅ Real-time GPS location tracking for users and guarantors
- ✅ Live map view in admin panel using Google Maps
- ✅ Socket.IO for real-time updates
- ✅ Location history stored in MongoDB
- ✅ Separate tracking for users and guarantors

## Backend Setup

### 1. Install Dependencies

Socket.IO is already installed. If you need to reinstall:

```bash
cd driveon/backend
npm install socket.io
```

### 2. Environment Variables

Ensure your `.env` file has the following:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Frontend URL (for Socket.IO CORS)
FRONTEND_URL=http://localhost:5173

# Port
PORT=5000
```

### 3. Server Configuration

The server is already configured with Socket.IO. The server will:
- Accept Socket.IO connections on the same port as the HTTP server
- Handle location updates from users/guarantors
- Broadcast updates to admin clients
- Store location history in MongoDB

### 4. API Endpoints

**Admin Endpoints (Protected):**
- `GET /api/admin/locations/latest` - Get latest locations for all users/guarantors
- `GET /api/admin/locations/user/:userId` - Get location history for a specific user

**User Endpoints (Protected):**
- `POST /api/location/update` - Update user location (also works via Socket.IO)

## Frontend Setup

### 1. Install Dependencies

Socket.IO client is already installed. If you need to reinstall:

```bash
cd driveon/frontend
npm install socket.io-client
```

### 2. Environment Variables

Add to your `.env` file:

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Google Maps API Key Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict the API key to your domain (optional but recommended)
6. Add the key to your `.env` file as `VITE_GOOGLE_MAPS_API_KEY`

**Required APIs:**
- Maps JavaScript API
- Places API (optional, for reverse geocoding)

### 4. Using Location Tracking Hook

For users/guarantors to enable location tracking:

```jsx
import { useLocationTracking } from '../hooks/useLocationTracking';

function UserComponent() {
  const { isTracking, error, startTracking, stopTracking } = useLocationTracking({
    userId: user._id,
    userType: 'user', // or 'guarantor'
    enabled: true, // Auto-start tracking
    updateInterval: 5000, // Update every 5 seconds
  });

  return (
    <div>
      {isTracking ? (
        <button onClick={stopTracking}>Stop Tracking</button>
      ) : (
        <button onClick={startTracking}>Start Tracking</button>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Admin Panel Usage

### 1. Access Location & Tracking Page

Navigate to `/admin/tracking` in the admin panel.

### 2. View Live Locations

- The map shows all active users and guarantors
- Blue markers = Users
- Red markers = Guarantors
- Click on markers to see details
- Filter by type (All/Users/Guarantors)

### 3. Real-time Updates

- Locations update automatically via Socket.IO
- Green indicator shows "Live" connection status
- Updates appear on the map in real-time

## Socket.IO Events

### Client → Server Events

**Register:**
```javascript
socket.emit('register', {
  role: 'admin' | 'user' | 'guarantor',
  userId: 'user_id_string'
});
```

**Location Update:**
```javascript
socket.emit('location:update', {
  userId: 'user_id',
  userType: 'user' | 'guarantor',
  lat: 20.5937,
  lng: 78.9629,
  accuracy: 10,
  speed: 50,
  heading: 90,
  altitude: 100,
  address: 'Address string',
  timestamp: Date.now()
});
```

**Request Latest Locations (Admin only):**
```javascript
socket.emit('location:request');
```

### Server → Client Events

**Registered:**
```javascript
socket.on('registered', (data) => {
  // { role, userId, socketId }
});
```

**Location Update:**
```javascript
socket.on('location:update', (locationData) => {
  // { userId, userType, name, lat, lng, accuracy, speed, timestamp, ... }
});
```

**Latest Locations:**
```javascript
socket.on('location:latest', (data) => {
  // { locations: [...] }
});
```

**Location Acknowledgment:**
```javascript
socket.on('location:ack', (data) => {
  // { ok: true, timestamp }
});
```

**Error:**
```javascript
socket.on('location:error', (data) => {
  // { message: 'Error message' }
});
```

## Database Schema

### Location Model

```javascript
{
  userId: String,        // User or Guarantor ID
  userType: 'user' | 'guarantor',
  lat: Number,          // Latitude
  lng: Number,          // Longitude
  accuracy: Number,     // GPS accuracy in meters
  speed: Number,        // Speed in km/h
  heading: Number,      // Direction in degrees
  altitude: Number,     // Altitude in meters
  address: String,      // Reverse geocoded address
  timestamp: Date,      // When location was recorded
  isLatest: Boolean,    // Is this the latest location for this user?
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

1. **Authentication**: All Socket.IO connections should be authenticated
2. **Authorization**: Only admins can view all locations
3. **Rate Limiting**: Consider implementing rate limiting for location updates
4. **Privacy**: Users should explicitly consent to location tracking
5. **Data Retention**: Consider implementing automatic cleanup of old location data

## Troubleshooting

### Map Not Loading

1. Check Google Maps API key is set correctly
2. Verify API key has Maps JavaScript API enabled
3. Check browser console for errors
4. Ensure API key restrictions allow your domain

### Socket.IO Not Connecting

1. Check server is running
2. Verify FRONTEND_URL matches your frontend URL
3. Check browser console for connection errors
4. Verify admin token is present in localStorage

### Locations Not Updating

1. Check user has granted location permissions
2. Verify Socket.IO connection is established
3. Check server logs for errors
4. Ensure user is registered with correct role

### GPS Not Accurate

1. Ensure device has GPS enabled
2. Check device location settings
3. Use `enableHighAccuracy: true` in geolocation options
4. Consider using a combination of GPS, WiFi, and cell tower data

## Testing

### Test Location Tracking

1. Open admin panel in one browser
2. Open user app in another browser/device
3. Enable location tracking in user app
4. Verify location appears on admin map
5. Move device and verify updates in real-time

### Test Socket.IO Connection

```javascript
// In browser console
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected!'));
socket.emit('register', { role: 'admin', userId: 'admin' });
```

## Production Deployment

1. **HTTPS Required**: Geolocation API requires HTTPS (except localhost)
2. **API Key Security**: Restrict Google Maps API key to your domain
3. **Socket.IO**: Use secure WebSocket (wss://) in production
4. **Environment Variables**: Set all required env vars in production
5. **Database Indexing**: Ensure MongoDB indexes are created for performance
6. **Monitoring**: Monitor Socket.IO connections and location update frequency

## Support

For issues or questions:
- Check server logs for errors
- Check browser console for client errors
- Verify all environment variables are set
- Ensure all dependencies are installed

