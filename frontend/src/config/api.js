/**
 * API Configuration
 * Centralized base URL configuration for backend API calls
 */

// Base URL for backend API
// Priority: 1. Environment variable, 2. Production URL, 3. Localhost (for development)
const getApiBaseUrl = () => {
  // 1. Check environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '';

  // Valid URL check: must contain "://" and have a domain after it
  if (envUrl.includes('://') && envUrl.split('://')[1]?.length > 5) {
    // Make sure the host isn't just "https" or "http"
    const host = envUrl.split('://')[1].split('/')[0];
    if (host !== 'https' && host !== 'http' && host !== 'undefined') {
      return envUrl;
    }
  }

  // 2. Check if running on localhost
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
  }

  // 3. Fallback for Contabo / Live Domain
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

  let socketUrl = apiUrl.replace('/api', '').replace(/\/$/, '');

  // CRITICAL: Ensure we have a valid hostname (not just "https")
  try {
    const url = new URL(socketUrl);
    if (url.hostname === 'https' || url.hostname === 'http' || !url.hostname || url.hostname === 'undefined') {
      throw new Error('Invalid hostname');
    }
    return socketUrl;
  } catch (e) {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
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

