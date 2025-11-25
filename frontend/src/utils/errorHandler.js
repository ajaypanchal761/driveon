/**
 * Error Handler Utility
 * Suppresses browser extension errors and handles application errors
 */

// Suppress browser extension errors
if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Catch and suppress extension errors
  const originalError = console.error;
  console.error = function(...args) {
    // Filter out browser extension errors
    const errorMessage = args[0]?.toString() || '';
    if (
      errorMessage.includes('runtime.lastError') ||
      errorMessage.includes('Receiving end does not exist') ||
      errorMessage.includes('Could not establish connection')
    ) {
      // Silently ignore browser extension errors
      return;
    }
    // Log other errors normally
    originalError.apply(console, args);
  };
}

// Suppress warnings for extension errors
if (typeof chrome !== 'undefined' && chrome.runtime) {
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const warnMessage = args[0]?.toString() || '';
    if (
      warnMessage.includes('runtime.lastError') ||
      warnMessage.includes('Receiving end does not exist') ||
      warnMessage.includes('Could not establish connection')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

/**
 * Handle application errors gracefully
 */
export const handleError = (error, context = '') => {
  // Don't log browser extension errors
  if (
    error?.message?.includes('runtime.lastError') ||
    error?.message?.includes('Receiving end does not exist') ||
    error?.message?.includes('Could not establish connection')
  ) {
    return;
  }

  // Log actual application errors
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
};

export default handleError;

