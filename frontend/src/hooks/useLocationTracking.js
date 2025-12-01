import { useState, useEffect, useRef } from 'react';
import {
  getCurrentPosition,
  watchPosition,
  clearWatch,
  getAddressFromCoordinates,
  updateUserLocation,
} from '../services/location.service';

/**
 * Format address to show full location details
 * @param {string} fullAddress - Full formatted address from Google Maps
 * @returns {string} - Formatted address (Full location with area, city, state)
 */
const formatAddress = (fullAddress) => {
  if (!fullAddress) return '';
  
  // Split address by commas
  const parts = fullAddress.split(',').map(part => part.trim()).filter(part => part.length > 0);
  
  if (parts.length === 0) return fullAddress;
  
  // For Indian addresses, format is usually: Street/Area, City, State PIN, India
  // We want to show: Area, City, State (full location)
  
  // Remove country if it's the last part
  let addressParts = [...parts];
  if (addressParts.length > 1 && 
      (addressParts[addressParts.length - 1].toLowerCase() === 'india' || 
       addressParts[addressParts.length - 1].toLowerCase() === 'भारत')) {
    addressParts = addressParts.slice(0, -1);
  }
  
  // If we have multiple parts, format them nicely
  if (addressParts.length >= 2) {
    // Remove PIN code from state if present
    const cleanedParts = addressParts.map((part, index) => {
      // If it's the state part (usually second to last), remove PIN code
      if (index === addressParts.length - 1 && /\d{6}/.test(part)) {
        // Remove 6-digit PIN code
        return part.replace(/\s*\d{6}\s*$/, '').trim();
      }
      return part;
    });
    
    // Join all parts with comma - show full location
    const formattedAddress = cleanedParts.join(', ');
    
    // Return full address without truncation
    // If it's very long (like full street address), still show it but prioritize area, city, state
    if (formattedAddress.length > 100 && cleanedParts.length > 4) {
      // For very long addresses, show: Area, City, State (skip detailed street address)
      // But still show more than just city and state
      if (cleanedParts.length >= 4) {
        // Show last 4 parts (usually: Area, City, State, Country or similar)
        return cleanedParts.slice(-4).join(', ');
      }
    }
    
    // Return full formatted address
    return formattedAddress;
  }
  
  // If only one part, return as is
  return addressParts[0] || fullAddress;
};

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
  const [apiKeyError, setApiKeyError] = useState(null);
  const watchIdRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Check for API key error on mount
    if (typeof window !== 'undefined') {
      const storedError = sessionStorage.getItem('google_maps_api_error');
      if (storedError) {
        try {
          const errorData = JSON.parse(storedError);
          // Check if error is recent (within last 5 minutes)
          if (Date.now() - errorData.timestamp < 300000) {
            setApiKeyError(errorData);
          } else {
            sessionStorage.removeItem('google_maps_api_error');
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
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
        console.log('Requesting location permission...');
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', { latitude, longitude });
        
        setCoordinates({ latitude, longitude });
        setLocationPermission('granted');

        // Show coordinates as temporary display while fetching address
        const tempLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setCurrentLocation('Fetching address...');

        // Check for API key error from sessionStorage
        if (typeof window !== 'undefined') {
          const storedError = sessionStorage.getItem('google_maps_api_error');
          if (storedError) {
            try {
              const errorData = JSON.parse(storedError);
              // Check if error is recent (within last 5 minutes)
              if (Date.now() - errorData.timestamp < 300000) {
                setApiKeyError(errorData);
              } else {
                sessionStorage.removeItem('google_maps_api_error');
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }

        // Get address from coordinates using Google Maps Geocoding API
        getAddressFromCoordinates(latitude, longitude)
          .then((address) => {
            console.log('Address received from Google Maps:', address);
            if (address && address.trim()) {
              // Format address to show city and state/country
              const formattedAddress = formatAddress(address);
              console.log('Formatted address:', formattedAddress);
              setCurrentLocation(formattedAddress);
              setApiKeyError(null); // Clear error on success
              // Clear sessionStorage error on success
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('google_maps_api_error');
              }
              // Update backend with address if authenticated
              if (isAuthenticated && userId) {
                updateUserLocation(latitude, longitude, formattedAddress).catch(() => {});
              }
            } else {
              // Check if it's an API key error
              if (typeof window !== 'undefined') {
                const storedError = sessionStorage.getItem('google_maps_api_error');
                if (storedError) {
                  try {
                    const errorData = JSON.parse(storedError);
                    setApiKeyError(errorData);
                  } catch (e) {
                    // Ignore
                  }
                }
              }
              // If address fetch fails but we have coordinates, show a readable format
              console.warn('⚠️ Google Maps API returned empty address. Check API key and Geocoding API enablement.');
              // Show coordinates in a readable format
              const coordsText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setCurrentLocation(coordsText);
            }
          })
          .catch((error) => {
            console.error('❌ Error getting address from Google Maps:', error);
            // If address fetch fails but we have coordinates, show them
            const coordsText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setCurrentLocation(coordsText);
          });

        // Update location on backend (non-blocking)
        if (isAuthenticated && userId) {
          updateUserLocation(latitude, longitude, '').catch((error) => {
            console.error('Failed to update location on backend:', error);
          });
        }

        // Start watching position for live updates
        watchIdRef.current = watchPosition(
          (pos) => {
            const { latitude: lat, longitude: lng, accuracy } = pos.coords;
            const now = Date.now();

            // Throttle updates to every 3 seconds for live tracking (balance between accuracy and performance)
            if (now - lastUpdateTimeRef.current < 3000) {
              return;
            }
            lastUpdateTimeRef.current = now;

            console.log('📍 Live location update:', {
              lat: lat.toFixed(6),
              lng: lng.toFixed(6),
              accuracy: accuracy ? `${Math.round(accuracy)}m` : 'unknown'
            });

            // Update coordinates immediately
            setCoordinates({ latitude: lat, longitude: lng });

            // Get address from coordinates and update display
            getAddressFromCoordinates(lat, lng)
              .then((updatedAddress) => {
                if (updatedAddress && updatedAddress.trim()) {
                  // Format address to show city and state/country
                  const formattedAddress = formatAddress(updatedAddress);
                  setCurrentLocation(formattedAddress);
                  setApiKeyError(null); // Clear error on success
                  // Clear sessionStorage error on success
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('google_maps_api_error');
                  }
                  // Update backend with address if authenticated
                  if (isAuthenticated && userId) {
                    updateUserLocation(lat, lng, formattedAddress).catch(() => {});
                  }
                } else {
                  // Check if it's an API key error
                  if (typeof window !== 'undefined') {
                    const storedError = sessionStorage.getItem('google_maps_api_error');
                    if (storedError) {
                      try {
                        const errorData = JSON.parse(storedError);
                        setApiKeyError(errorData);
                      } catch (e) {
                        // Ignore
                      }
                    }
                  }
                }
                // If address fetch fails, keep current location (don't show coordinates)
              })
              .catch((error) => {
                console.error('Error getting address in watch:', error);
                // Don't update location if address fetch fails - keep previous address
              });

            // Update location on backend (non-blocking)
            if (isAuthenticated && userId) {
              updateUserLocation(lat, lng, '').catch((error) => {
                console.error('Failed to update location on backend:', error);
              });
            }
          },
          (error) => {
            // Handle timeout errors gracefully - don't log as error
            if (error.code === 3) {
              // Timeout - this is common, handle silently
              // Don't update location, keep previous location
              // Only log in development mode
              if (process.env.NODE_ENV === 'development') {
                console.warn('Location tracking timeout (this is normal if GPS is slow)');
              }
              return; // Don't update state on timeout, keep previous location
            }
            
            // Log other errors
            if (error.code !== 3) {
              console.error('Location tracking error:', error);
            }
            
            if (error.code === 1) {
              // Permission denied
              setLocationPermission('denied');
              setCurrentLocation('Location permission denied');
            } else if (error.code === 2) {
              // Position unavailable
              setCurrentLocation('Location unavailable');
            } else if (error.code !== 3) {
              // Other errors (not timeout)
              setCurrentLocation('Location error');
            }
          },
          {
            enableHighAccuracy: true, // Use GPS for accurate live location
            timeout: 30000, // 30 seconds timeout - increased for better reliability
            maximumAge: 60000, // Allow cached location up to 1 minute old - helps avoid timeouts
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          name: error.name
        });
        
        if (error.code === 1) {
          // Permission denied
          setLocationPermission('denied');
          setCurrentLocation('Location permission denied - Please allow location access');
        } else if (error.code === 2) {
          // Position unavailable
          setLocationPermission('unavailable');
          setCurrentLocation('Location unavailable - Please check your GPS');
        } else if (error.code === 3) {
          // Timeout - retry with less strict options
          console.warn('Initial location request timeout, retrying with network-based location...');
          // Retry with network-based location (faster, less accurate)
          try {
            const fallbackPosition = await getCurrentPosition({
              enableHighAccuracy: false,
              timeout: 20000,
              maximumAge: 300000, // Allow 5 minute old cache
            });
            const { latitude, longitude } = fallbackPosition.coords;
            setCoordinates({ latitude, longitude });
            setLocationPermission('granted');
            setCurrentLocation('Fetching address...');
            
            // Get address
            getAddressFromCoordinates(latitude, longitude)
              .then((address) => {
                if (address && address.trim()) {
                  const formattedAddress = formatAddress(address);
                  setCurrentLocation(formattedAddress);
                  if (isAuthenticated && userId) {
                    updateUserLocation(latitude, longitude, formattedAddress).catch(() => {});
                  }
                } else {
                  const coordsText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                  setCurrentLocation(coordsText);
                }
              })
              .catch(() => {
                const coordsText = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setCurrentLocation(coordsText);
              });
            
            // Start watching with less strict options
            watchIdRef.current = watchPosition(
              (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                const now = Date.now();
                if (now - lastUpdateTimeRef.current < 3000) return;
                lastUpdateTimeRef.current = now;
                
                setCoordinates({ latitude: lat, longitude: lng });
                getAddressFromCoordinates(lat, lng)
                  .then((updatedAddress) => {
                    if (updatedAddress && updatedAddress.trim()) {
                      const formattedAddress = formatAddress(updatedAddress);
                      setCurrentLocation(formattedAddress);
                      if (isAuthenticated && userId) {
                        updateUserLocation(lat, lng, formattedAddress).catch(() => {});
                      }
                    }
                  })
                  .catch(() => {});
                
                if (isAuthenticated && userId) {
                  updateUserLocation(lat, lng, '').catch(() => {});
                }
              },
              (watchError) => {
                if (watchError.code !== 3) {
                  console.error('Location watch error:', watchError);
                }
              },
              {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 60000,
              }
            );
            return; // Successfully got location with fallback
          } catch (fallbackError) {
            // Fallback also failed
            setLocationPermission('timeout');
            setCurrentLocation('Location request timeout - Please check GPS settings');
          }
        } else {
          setLocationPermission('error');
          setCurrentLocation('Unable to get location - Please check browser settings');
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
    apiKeyError,
  };
};

