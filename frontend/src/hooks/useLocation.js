import { useState, useEffect, useRef } from 'react';
import { getAddressFromCoordinates, getCurrentPosition } from '../services/location.service';

/**
 * Hook to get user's current location with address
 * Used for displaying location on home page
 * 
 * @param {boolean} enabled - Whether to fetch location
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {string} userId - User ID (optional)
 * @returns {Object} - { currentLocation, coordinates, locationPermission, apiKeyError }
 */
export const useLocation = (enabled = true, isAuthenticated = false, userId = null) => {
  const [currentLocation, setCurrentLocation] = useState('Getting location...');
  const [coordinates, setCoordinates] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [apiKeyError, setApiKeyError] = useState(null);
  const watchIdRef = useRef(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setCurrentLocation('Location tracking disabled');
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setCurrentLocation('Location not supported');
      setLocationPermission('denied');
      return;
    }

    // Function to fetch location and address
    const fetchLocation = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        setCurrentLocation('Getting location...');
        
        // Get current position
        const position = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        });

        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationPermission('granted');

        // Get address from coordinates
        const address = await getAddressFromCoordinates(latitude, longitude);
        
        if (address) {
          setCurrentLocation(address);
        } else {
          // If address fetch fails, show coordinates
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }

        // Update user location on backend if authenticated
        if (isAuthenticated && userId) {
          try {
            const { updateUserLocation } = await import('../services/location.service');
            updateUserLocation(latitude, longitude, address);
          } catch (err) {
            console.error('Error updating user location:', err);
          }
        }
      } catch (error) {
        let errorMessage = 'Getting location...';
        let permission = 'prompt';

        if (error.code === 1) {
          // PERMISSION_DENIED
          console.error('❌ Location error: Permission denied');
          errorMessage = 'Location permission denied';
          permission = 'denied';
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          console.warn('⚠️ Location error: Position unavailable');
          errorMessage = 'Location unavailable';
          permission = 'denied';
        } else if (error.code === 3) {
          // TIMEOUT - This is common and expected, log as warning
          console.warn('⏱️ Location timeout (this is normal, will retry)');
          // Don't change the location message for timeout - keep "Getting location..."
          // The watchPosition will continue trying
          return; // Exit early, don't update state
        } else {
          console.error('❌ Location error:', error);
          errorMessage = 'Location unavailable';
          permission = 'denied';
        }

        setCurrentLocation(errorMessage);
        setLocationPermission(permission);
      } finally {
        isFetchingRef.current = false;
      }
    };

    // Initial fetch
    fetchLocation();

    // Watch for location updates (every 30 seconds)
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000, // Update every 30 seconds
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationPermission('granted');

        // Get address from coordinates
        const address = await getAddressFromCoordinates(latitude, longitude);
        
        if (address) {
          setCurrentLocation(address);
        } else if (coordinates) {
          // Keep previous address if geocoding fails
          // Don't update to coordinates to avoid flickering
        }

        // Update user location on backend if authenticated
        if (isAuthenticated && userId) {
          try {
            const { updateUserLocation } = await import('../services/location.service');
            updateUserLocation(latitude, longitude, address);
          } catch (err) {
            console.error('Error updating user location:', err);
          }
        }
      },
      (error) => {
        // Handle different error types appropriately
        if (error.code === 1) {
          // PERMISSION_DENIED
          console.error('❌ Location watch error: Permission denied');
          setLocationPermission('denied');
          setCurrentLocation('Location permission denied');
        } else if (error.code === 3) {
          // TIMEOUT - This is common, log as warning and don't update state
          console.warn('⏱️ Location watch timeout (will continue retrying)');
          // Don't update state - keep trying
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          console.warn('⚠️ Location watch error: Position unavailable');
          // Don't update state - might recover
        } else {
          console.error('❌ Location watch error:', error);
        }
      },
      geoOptions
    );

    // Check for Google Maps API key error
    const checkApiKeyError = () => {
      try {
        const errorData = sessionStorage.getItem('google_maps_api_error');
        if (errorData) {
          const error = JSON.parse(errorData);
          // Only show error if it's recent (within last hour)
          if (Date.now() - error.timestamp < 3600000) {
            setApiKeyError(error.message);
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }
    };

    checkApiKeyError();

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, isAuthenticated, userId]);

  return {
    currentLocation,
    coordinates,
    locationPermission,
    apiKeyError,
  };
};

export default useLocation;

