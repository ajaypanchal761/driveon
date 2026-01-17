/**
 * API Configuration
 * Centralized base URL configuration for backend API calls
 */

// Base URL for backend API
// Priority: 1. Environment variable, 2. Production URL, 3. Localhost (for development)
const getApiBaseUrl = () => {
  // 1. Check environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  // Strict check: must be a full URL and not just "https" or "https://"
  if (envUrl && envUrl.includes('://') && envUrl.length > 12) {
    return envUrl;
  }

  // 2. Check if running on localhost
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
  }

  // 3. Default Production Fallback (Render or your Contabo domain)
  // If we are on driveoncar.co.in, we should ideally use that as base
  if (typeof window !== 'undefined' && window.location.origin.includes('driveoncar.co.in')) {
    return `${window.location.origin}/api`;
  }

  return 'https://driveon-19hg.onrender.com/api';
};

/**
 * Get Socket.IO server URL from API base URL
 */
export const getSocketUrl = () => {
  const apiUrl = getApiBaseUrl();

  // If apiUrl is somehow still invalid, use window origin
  if (!apiUrl || apiUrl.length < 10 || !apiUrl.includes('://')) {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  let socketUrl = apiUrl.replace('/api', '');
  socketUrl = socketUrl.replace(/\/$/, '');

  // CRITICAL: Ensure we don't return just "https" or something broken
  if (socketUrl === 'https:/' || socketUrl === 'https' || socketUrl === 'http:/' || socketUrl === 'http') {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  return socketUrl;
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

