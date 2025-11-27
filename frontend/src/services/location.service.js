import api from './api';

/**
 * Location Service
 * Handles user location tracking and geocoding
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Get address from coordinates using Google Maps Geocoding API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export const getAddressFromCoordinates = async (lat, lng) => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found');
    return '';
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      // Get the most relevant result (first one)
      const address = data.results[0].formatted_address;
      return address;
    } else {
      console.warn('Geocoding failed:', data.status);
      return '';
    }
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return '';
  }
};

/**
 * Update user location on backend (fire-and-forget for speed)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Optional address
 * @returns {Promise<Object>} - API response
 */
export const updateUserLocation = async (lat, lng, address = '') => {
  try {
    // Use fire-and-forget approach for faster updates
    // Don't await to avoid blocking location updates
    api.post('/user/update-location', {
      lat,
      lng,
      address,
    }).catch((error) => {
      // Silently handle errors to not block location tracking
      console.error('Error updating user location (non-blocking):', error);
    });

    // Return immediately without waiting for response
    return { success: true };
  } catch (error) {
    // This should rarely happen, but handle gracefully
    console.error('Error initiating location update:', error);
    return { success: false };
  }
};

/**
 * Request location permission and get current position
 * @param {Object} options - Geolocation options
 * @returns {Promise<GeolocationPosition>} - Current position
 */
export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Increased to 10 seconds for better reliability
      maximumAge: 60000, // Allow cached location up to 1 minute old
      ...options,
    };

    // Try with high accuracy first
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        // If timeout or position unavailable, retry with lower accuracy
        if (error.code === 3 || error.code === 2) {
          // Retry with less strict options
          const fallbackOptions = {
            enableHighAccuracy: false,
            timeout: 15000, // Longer timeout for fallback
            maximumAge: 300000, // Allow cached location up to 5 minutes old
            ...options,
          };

          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (fallbackError) => reject(fallbackError),
            fallbackOptions
          );
        } else {
          reject(error);
        }
      },
      defaultOptions
    );
  });
};

/**
 * Watch user position and call callback on update
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 * @param {Object} options - Geolocation options
 * @returns {number} - Watch ID
 */
export const watchPosition = (onSuccess, onError, options = {}) => {
  if (!navigator.geolocation) {
    onError(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 5000, // Reduced from 10000 to 5000ms for faster updates
    maximumAge: 0, // Always get fresh location for accuracy
    ...options,
  };

  return navigator.geolocation.watchPosition(onSuccess, onError, defaultOptions);
};

/**
 * Clear position watch
 * @param {number} watchId - Watch ID from watchPosition
 */
export const clearWatch = (watchId) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

export default {
  getAddressFromCoordinates,
  updateUserLocation,
  getCurrentPosition,
  watchPosition,
  clearWatch,
};

