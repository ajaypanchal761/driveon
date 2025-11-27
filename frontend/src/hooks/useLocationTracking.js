import { useState, useEffect, useRef } from 'react';
import {
  getCurrentPosition,
  watchPosition,
  clearWatch,
  getAddressFromCoordinates,
  updateUserLocation,
} from '../services/location.service';

/**
 * Custom hook for location tracking
 * Tracks user's live location and updates backend
 * @param {boolean} enabled - Whether to enable location tracking
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @param {string} userId - User ID (optional, for backend updates)
 * @returns {Object} - Location state and methods
 */
export const useLocationTracking = (enabled = true, isAuthenticated = false, userId = null) => {
  const [currentLocation, setCurrentLocation] = useState('Loading location...');
  const [locationPermission, setLocationPermission] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const watchIdRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setCurrentLocation('Location not supported');
      setLocationPermission('denied');
      return;
    }

    // Request permission and get initial location
    const requestLocation = async () => {
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });

        // Show coordinates immediately for fast response
        const coordsDisplay = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setCurrentLocation(coordsDisplay);
        setLocationPermission('granted');

        // Update location on backend immediately (non-blocking)
        if (isAuthenticated && userId) {
          updateUserLocation(latitude, longitude, '').catch((error) => {
            console.error('Failed to update location on backend:', error);
          });
        }

        // Get address asynchronously (non-blocking) and update when ready
        getAddressFromCoordinates(latitude, longitude)
          .then((address) => {
            if (address) {
              setCurrentLocation(address);
              // Update backend with address if authenticated
              if (isAuthenticated && userId) {
                updateUserLocation(latitude, longitude, address).catch(() => {});
              }
            }
          })
          .catch((error) => {
            console.error('Error getting address:', error);
            // Keep showing coordinates if address fetch fails
          });

        // Start watching position for live updates
        watchIdRef.current = watchPosition(
          (pos) => {
            const { latitude: lat, longitude: lng } = pos.coords;
            const now = Date.now();

            // Throttle updates to every 2 seconds for faster updates
            if (now - lastUpdateTimeRef.current < 2000) {
              return;
            }
            lastUpdateTimeRef.current = now;

            // Update coordinates immediately for fast response
            setCoordinates({ latitude: lat, longitude: lng });
            const coordsDisplay = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setCurrentLocation(coordsDisplay);

            // Update location on backend immediately (non-blocking)
            if (isAuthenticated && userId) {
              updateUserLocation(lat, lng, '').catch((error) => {
                console.error('Failed to update location on backend:', error);
              });
            }

            // Get address asynchronously (non-blocking) and update when ready
            getAddressFromCoordinates(lat, lng)
              .then((updatedAddress) => {
                if (updatedAddress) {
                  setCurrentLocation(updatedAddress);
                  // Update backend with address if authenticated
                  if (isAuthenticated && userId) {
                    updateUserLocation(lat, lng, updatedAddress).catch(() => {});
                  }
                }
              })
              .catch((error) => {
                // Silently fail - coordinates are already shown
                console.error('Error getting address:', error);
              });
          },
          (error) => {
            console.error('Location tracking error:', error);
            if (error.code === 1) {
              // Permission denied
              setLocationPermission('denied');
              setCurrentLocation('Location permission denied');
            } else if (error.code === 2) {
              // Position unavailable
              setCurrentLocation('Location unavailable');
            } else if (error.code === 3) {
              // Timeout
              setCurrentLocation('Location request timeout');
            } else {
              setCurrentLocation('Location error');
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000, // Reduced timeout for faster updates
            maximumAge: 0, // Always get fresh location for accuracy
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        if (error.code === 1) {
          // Permission denied
          setLocationPermission('denied');
          setCurrentLocation('Location permission denied');
        } else {
          setCurrentLocation('Unable to get location');
        }
      }
    };

    requestLocation();

    // Cleanup: clear watch when component unmounts
    return () => {
      if (watchIdRef.current !== null) {
        clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled, isAuthenticated, userId]);

  return {
    currentLocation,
    locationPermission,
    coordinates,
  };
};

