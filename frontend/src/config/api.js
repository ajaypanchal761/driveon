/**
 * API Configuration
 * Centralized base URL configuration for backend API calls
 */

// Base URL for backend API
// Priority: 1. Environment variable, 2. Production URL, 3. Localhost (for development)
const getApiBaseUrl = () => {
  // Check if environment variable is set and is a valid URL (contains ://)
  if (import.meta.env.VITE_API_BASE_URL) {
    const envUrl = import.meta.env.VITE_API_BASE_URL.trim();
    if (envUrl && envUrl.includes('://') && envUrl.length > 10) {
      console.log('🔗 Using API URL from environment:', envUrl);
      return envUrl;
    }
  }

  // Check if running on localhost
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    console.log('🔗 Using Localhost API URL: http://localhost:5001/api');
    return 'http://localhost:5001/api';
  }

  // Use production backend by default
  const productionUrl = 'https://driveon-19hg.onrender.com/api';
  console.log('🔗 Using production API URL:', productionUrl);
  return productionUrl;
};

/**
 * Get Socket.IO server URL from API base URL
 * Removes /api suffix and returns the base server URL
 */
export const getSocketUrl = () => {
  const apiUrl = getApiBaseUrl();
  let socketUrl = apiUrl.replace('/api', '');

  // Remove trailing slash if present
  socketUrl = socketUrl.replace(/\/$/, '');

  // If it's a full URL, use it; otherwise construct it
  if (socketUrl.startsWith('http')) {
    return socketUrl;
  }

  // Fallback to current origin
  return window.location.origin;
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getSocketUrl();

// Log configuration on load
if (import.meta.env.DEV) {
  console.log('📡 API Configuration:', {
    API_BASE_URL,
    SOCKET_URL,
    NODE_ENV: import.meta.env.MODE,
    hasEnvVar: !!import.meta.env.VITE_API_BASE_URL,
  });
}

export default API_BASE_URL;

