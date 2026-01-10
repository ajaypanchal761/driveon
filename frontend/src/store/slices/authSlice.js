import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

/**
 * Async thunk for logout - calls backend API
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Call backend logout API
      await authService.logout();
      return { success: true };
    } catch (error) {
      // Even if API call fails, we should still logout locally
      console.error('Logout API error:', error);
      // Return success to allow local logout
      return { success: true };
    }
  }
);

/**
 * Auth Slice
 * Manages authentication state (tokens, user authentication status)
 */
const initialState = {
  token: localStorage.getItem('authToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  // Don't set isAuthenticated to true initially - wait for AuthInitializer to verify token
  // This prevents showing login form during token verification on page refresh
  isAuthenticated: !!localStorage.getItem('authToken'), // Assume logged in if token exists to prevent flashing login page
  isLoading: false,
  isInitializing: true, // Track if auth is being initialized on app mount
  error: null,
  userRole: localStorage.getItem('userRole') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isInitializing = false; // Auth initialization complete
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.userRole = action.payload.userRole;
      state.error = null;

      // Store in localStorage
      const isEmployee = action.payload.userRole === 'employee';

      if (isEmployee) {
        localStorage.setItem('staffToken', action.payload.token);
      } else {
        localStorage.setItem('authToken', action.payload.token);
      }

      // Store refresh token based on role to avoid overwriting user/staff sessions
      if (action.payload.refreshToken) {
        if (isEmployee) {
          localStorage.setItem('staffRefreshToken', action.payload.refreshToken);
        } else {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      }

      if (action.payload.userRole) {
        localStorage.setItem('userRole', action.payload.userRole);
      }
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.token = null;
      state.refreshToken = null;
    },

    // Logout action (synchronous - for immediate state clearing)
    logout: (state) => {
      // Determine what to clear based on current role
      const isEmployee = state.userRole === 'employee';

      if (isEmployee) {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffRefreshToken');
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }

      // Always clear common items
      localStorage.removeItem('userRole');
      localStorage.removeItem('profileComplete');

      state.isAuthenticated = false;
      state.isInitializing = false;
      state.token = null;
      state.refreshToken = null;
      state.userRole = null;
      state.error = null;
    },

    // Mark auth initialization as complete
    authInitialized: (state) => {
      state.isInitializing = false;
    },

    // Token refresh
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token;

      const isEmployee = state.userRole === 'employee';
      if (isEmployee) {
        localStorage.setItem('staffToken', action.payload.token);
      } else {
        localStorage.setItem('authToken', action.payload.token);
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle async logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;

        const isEmployee = state.userRole === 'employee';

        if (isEmployee) {
          localStorage.removeItem('staffToken');
          localStorage.removeItem('staffRefreshToken');
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }

        localStorage.removeItem('userRole');
        localStorage.removeItem('profileComplete');

        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.userRole = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Even if API call fails, clear local state

        const isEmployee = state.userRole === 'employee';

        if (isEmployee) {
          localStorage.removeItem('staffToken');
          localStorage.removeItem('staffRefreshToken');
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }

        localStorage.removeItem('userRole');
        localStorage.removeItem('profileComplete');

        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.userRole = null;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenSuccess,
  clearError,
  authInitialized,
} = authSlice.actions;

export default authSlice.reducer;

