/**
 * API Configuration
 * Centralized base URL configuration for backend API calls
 */

// Base URL for backend API
// Priority: 1. Environment variable, 2. Production URL, 3. Localhost (for development)
const getApiBaseUrl = () => {
  // Check if environment variable is set
  if (import.meta.env.VITE_API_BASE_URL) {
    const envUrl = import.meta.env.VITE_API_BASE_URL.trim();
    if (envUrl) {
      console.log('🔗 Using API URL from environment:', envUrl);
      return envUrl;
    }
  }
  
  // Use production backend by default
  // For local development, set VITE_API_BASE_URL=http://localhost:5000/api in .env file
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

