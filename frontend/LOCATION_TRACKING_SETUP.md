# Location Tracking Setup

## Overview
The application now includes live location tracking functionality that:
- Requests location permission when users visit the dashboard (homepage)
- Tracks user's live location using browser geolocation API
- Converts coordinates to readable addresses using Google Maps Geocoding API
- Updates user location on the backend for admin tracking

## Environment Variable Setup

Add the following environment variable to your `.env` file in the `frontend` directory:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDaQfoCtcWZm4mLuSivwdcOzDKfkjS5SOw
```

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
2. Browser asks for permission (HTTPS required)
3. Once granted, app gets current position with high accuracy
4. Coordinates are converted to address using Google Maps Geocoding API
5. Location is displayed in header
6. Location is sent to backend every 5 seconds (throttled)
7. Location tracking continues while user is on homepage

## Requirements

- **HTTPS**: Location API requires secure context (HTTPS or localhost)
- **Browser Support**: Modern browsers with geolocation support
- **Google Maps API Key**: For address geocoding

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

