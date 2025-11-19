/**
 * Theme Constants
 * Centralized theme configuration for the entire application
 * All colors, spacing, and design tokens are defined here
 * 
 * Usage:
 * import { theme } from '../theme/theme.constants';
 * 
 * <div style={{ backgroundColor: theme.colors.primary }}>
 * <div className={`bg-[${theme.colors.primary}]`}>
 */

import { customTheme } from './themes/custom.theme';

// Export theme colors as constants for easy access
export const theme = {
  colors: {
    // Primary Colors
    primary: customTheme.colors.primary.DEFAULT, // #3d096d
    primaryDark: customTheme.colors.primary.dark, // #2d0750
    primaryLight: customTheme.colors.primary.light, // #5d0d8a
    
    // Background Colors
    background: customTheme.colors.background.primary, // #ffffff
    backgroundSecondary: customTheme.colors.background.secondary, // #f1f1f1
    backgroundTertiary: customTheme.colors.background.tertiary, // #e8e8e8
    
    // Text Colors
    textPrimary: customTheme.colors.text.primary, // #1a1a1a
    textSecondary: customTheme.colors.text.secondary, // #4a4a4a
    textTertiary: customTheme.colors.text.tertiary, // #808080
    textInverse: customTheme.colors.text.inverse, // #ffffff
    
    // Border Colors
    borderLight: customTheme.colors.border.light, // #e8e8e8
    borderDefault: customTheme.colors.border.DEFAULT, // #d0d0d0
    borderDark: customTheme.colors.border.dark, // #a0a0a0
    borderFocus: customTheme.colors.border.focus, // #3d096d
    
    // Status Colors
    success: customTheme.colors.success.DEFAULT, // #28a745
    error: customTheme.colors.error.DEFAULT, // #dc3545
    warning: customTheme.colors.warning.DEFAULT, // #ffc107
    info: customTheme.colors.info.DEFAULT, // #17a2b8
    
    // Neutral Colors
    white: customTheme.colors.white, // #ffffff
    black: customTheme.colors.black, // #000000
    
    // Additional colors used in app
    yellow: '#ffc107', // Yellow for buttons
    yellow400: '#facc15', // Yellow-400
    yellow500: '#eab308', // Yellow-500
    green: '#28a745', // Green for success
    green500: '#22c55e', // Green-500
    red: '#dc3545', // Red for errors
    red50: '#fef2f2', // Red-50
    red100: '#fee2e2', // Red-100
    red600: '#dc2626', // Red-600
    blue: '#17a2b8', // Blue for info
    blue50: '#eff6ff', // Blue-50
    blue500: '#3b82f6', // Blue-500
    gray: '#808080', // Gray
    gray100: '#f3f4f6', // Gray-100
    gray200: '#e5e7eb', // Gray-200
    gray300: '#d1d5db', // Gray-300
    gray400: '#9ca3af', // Gray-400
    gray500: '#6b7280', // Gray-500
    gray600: '#4b5563', // Gray-600
    gray700: '#374151', // Gray-700
    gray900: '#111827', // Gray-900
  },
  
  // Spacing
  spacing: customTheme.spacing,
  
  // Border Radius
  borderRadius: customTheme.borderRadius,
  
  // Shadows
  boxShadow: customTheme.boxShadow,
  
  // Typography
  typography: customTheme.typography,
};

// Export as default for convenience
export default theme;

// Export individual color values for direct use
export const {
  primary,
  primaryDark,
  primaryLight,
  background,
  backgroundSecondary,
  textPrimary,
  textSecondary,
  textInverse,
  white,
  black,
  success,
  error,
  warning,
} = theme.colors;

