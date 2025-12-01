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
        console.error('Location error:', error);
        
        let errorMessage = 'Getting location...';
        let permission = 'prompt';

        if (error.code === 1) {
          // PERMISSION_DENIED
          errorMessage = 'Location permission denied';
          permission = 'denied';
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          errorMessage = 'Location unavailable';
          permission = 'denied';
        } else if (error.code === 3) {
          // TIMEOUT
          errorMessage = 'Location request timed out';
          permission = 'prompt';
        } else {
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
        console.error('Location watch error:', error);
        if (error.code === 1) {
          setLocationPermission('denied');
          setCurrentLocation('Location permission denied');
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

