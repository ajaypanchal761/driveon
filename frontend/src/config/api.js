/**
 * API Configuration
 * Centralized base URL configuration for backend API calls
 */

// Base URL for backend API
// Priority: 1. Environment variable, 2. Production URL, 3. Localhost (for development)
const getApiBaseUrl = () => {
  // 1. HARD RULE: If we are on your live domain, ALWAYS use it.
  // This bypasses any broken environment variables on the live server.
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('driveoncar.co.in')) {
      return `${origin}/api`;
    }

    // 2. Check for localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
  }

  // 3. Check environment variable as a secondary option
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';

  // Strict Validation: Host cannot be "https" or "http"
  try {
    if (envUrl && envUrl.includes('://')) {
      const url = new URL(envUrl);
      const host = url.hostname.toLowerCase();
      if (host !== 'https' && host !== 'http' && host !== 'undefined' && host.length > 3) {
        return envUrl;
      }
    }
  } catch (e) {
    // Invalid URL format
  }

  // 4. Final Fallback
  return 'https://driveon-19hg.onrender.com/api';
};

/**
 * Get Socket.IO server URL from API base URL
 */
export const getSocketUrl = () => {
  const apiUrl = getApiBaseUrl();

  if (!apiUrl || !apiUrl.includes('://')) {
    return typeof window !== 'undefined' ? window.location.origin : 'https://driveoncar.co.in';
  }

  // Remove /api and trailing slashes
  let socketUrl = apiUrl.replace('/api', '').replace(/\/$/, '');

  // Final Safety: If the result is still just "https://https", use window origin
  try {
    const url = new URL(socketUrl);
    if (url.hostname.toLowerCase() === 'https' || url.hostname.toLowerCase() === 'http') {
      throw new Error('Malformed URL');
    }
    return socketUrl;
  } catch (e) {
    return typeof window !== 'undefined' ? window.location.origin : 'https://driveoncar.co.in';
  }
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getSocketUrl();

// Log for debugging in production (visible in console)
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  console.log('🚀 DriveOn Socket Initialized at:', SOCKET_URL);
}

export default API_BASE_URL;

