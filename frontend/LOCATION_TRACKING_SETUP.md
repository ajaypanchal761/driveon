# Location Tracking Setup

## Overview
The application now includes live location tracking functionality that:
- Requests location permission when users visit the dashboard (homepage)
- Tracks user's live location using browser geolocation API
- Converts coordinates to readable addresses using Google Maps Geocoding API
- Updates user location on the backend for admin tracking

## Environment Variable Setup

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Geocoding API** (Required for converting coordinates to addresses)
   - **Maps JavaScript API** (Optional, for future map features)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key
6. (Recommended) Restrict the API key to only allow:
   - HTTP referrers (for web apps)
   - Geocoding API only

### Step 2: Add API Key to Environment

Create a `.env` file in the `frontend` directory (if it doesn't exist) and add:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Important:** 
- Replace `your_google_maps_api_key_here` with your actual API key
- Restart your development server after adding the API key
- Never commit the `.env` file to Git (it should be in `.gitignore`)

## Features

### Frontend
- **Location Service** (`src/services/location.service.js`): Handles geocoding and location updates
- **Location Hook** (`src/hooks/useLocationTracking.js`): Reusable hook for location tracking
- **Header Component**: Displays current location and tracks it on homepage
- **HomePage**: Shows location in header and uses it for nearby car searches

### Backend
- **User Model**: Added location fields (latitude, longitude, address, lastLocationUpdate)
- **Location Endpoint**: `POST /api/user/update-location` - Updates user location

## How It Works

1. When user visits homepage (`/`), the app requests location permission
2. Browser asks for permission (HTTPS or localhost required)
3. Once granted, app gets current position using browser Geolocation API (GPS/Network-based)
4. Coordinates (latitude, longitude) are obtained
5. Coordinates are converted to readable address using **Google Maps Geocoding API**
6. Address is formatted to show "City, State" format (e.g., "Mumbai, Maharashtra")
7. Location is displayed in header
8. Location is sent to backend every 2 seconds (throttled)
9. Location tracking continues while user is on homepage

### Technical Flow:
```
Browser Geolocation API → Coordinates (lat, lng) 
    ↓
Google Maps Geocoding API → Full Address
    ↓
formatAddress() → "City, State" format
    ↓
Display in UI
```

## Requirements

- **HTTPS or Localhost**: Browser Geolocation API requires secure context
  - ✅ `https://yourdomain.com`
  - ✅ `http://localhost:5173`
  - ❌ `http://yourdomain.com` (won't work)
- **Browser Support**: Modern browsers with geolocation support (Chrome, Firefox, Safari, Edge)
- **Google Maps API Key**: Required for converting coordinates to addresses
  - Must have **Geocoding API** enabled
  - API key must be valid and have proper restrictions
- **Location Permission**: User must allow location access when prompted

## Troubleshooting

### Location not showing?

1. **Check Browser Console** (F12) for errors:
   - "Google Maps API key not found" → Add API key to `.env`
   - "Geocoding failed: REQUEST_DENIED" → Check API key and enable Geocoding API
   - "Location permission denied" → Allow location in browser settings

2. **Check API Key**:
   - Verify API key is in `.env` file as `VITE_GOOGLE_MAPS_API_KEY`
   - Restart dev server after adding API key
   - Check Google Cloud Console that Geocoding API is enabled

3. **Check HTTPS**:
   - Must be on HTTPS or localhost
   - Check browser console for "Geolocation requires HTTPS" error

4. **Check Browser Permissions**:
   - Chrome: Settings → Privacy → Location → Allow
   - Firefox: Settings → Privacy → Permissions → Location
   - Safari: Preferences → Websites → Location Services

## API Endpoints

### Update User Location
```
POST /api/user/update-location
Headers: Authorization: Bearer <token>
Body: {
  lat: number,
  lng: number,
  address?: string
}
```

## Next Steps (Phase 2)

- Real-time updates using Socket.IO
- Google Map marker display for admin
- Route and ETA calculation
- MongoDB storage optimization

