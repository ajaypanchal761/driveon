// Custom Theme - Your Brand Colors
// Primary: #272343, White: #ffffff, Background: #e3f6f5

export const customTheme = {
  name: 'custom',
  colors: {
    // Primary Colors
    primary: {
      50: '#e8e9f0',
      100: '#d1d3e1',
      200: '#a3a7c3',
      300: '#757ba5',
      400: '#474f87',
      500: '#3a4169',
      600: '#2d3350',
      700: '#272343', // Main brand color
      800: '#1f1c35',
      900: '#171527',
      DEFAULT: '#272343',
      dark: '#1f1c35',
      light: '#3a4169',
    },
    
    // Secondary Colors (complementary to primary)
    secondary: {
      50: '#f0f0f0',
      100: '#e0e0e0',
      200: '#d0d0d0',
      300: '#c0c0c0',
      400: '#b0b0b0',
      500: '#a0a0a0',
      600: '#909090',
      700: '#808080',
      800: '#707070',
      900: '#606060',
      DEFAULT: '#808080',
    },

    // Neutral Colors
    white: '#ffffff',
    black: '#000000',
    
    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#e3f6f5',
      tertiary: '#bae8e8',
      dark: '#1a1a1a',
    },

    // Text Colors
    text: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      tertiary: '#808080',
      inverse: '#ffffff',
      disabled: '#b0b0b0',
    },

    // Border Colors
    border: {
      light: '#bae8e8',
      DEFAULT: '#d0d0d0',
      dark: '#a0a0a0',
      focus: '#272343',
    },

    // Status Colors
    success: {
      light: '#d4edda',
      DEFAULT: '#28a745',
      dark: '#155724',
    },
    error: {
      light: '#f8d7da',
      DEFAULT: '#dc3545',
      dark: '#721c24',
    },
    warning: {
      light: '#fff3cd',
      DEFAULT: '#ffc107',
      dark: '#856404',
    },
    info: {
      light: '#d1ecf1',
      DEFAULT: '#17a2b8',
      dark: '#0c5460',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Menlo', 'Monaco', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing (Mobile-first)
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows (Mobile-optimized)
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },

  // Transitions
  transition: {
    duration: {
      fast: '150ms',
      DEFAULT: '200ms',
      slow: '300ms',
    },
    timing: {
      DEFAULT: 'ease-in-out',
      in: 'ease-in',
      out: 'ease-out',
    },
  },

  // Breakpoints (Mobile-first)
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

