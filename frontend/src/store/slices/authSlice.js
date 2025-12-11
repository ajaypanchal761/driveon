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
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
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
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.userRole = action.payload.userRole;
      state.error = null;

      // Store in localStorage
      localStorage.setItem('authToken', action.payload.token);
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
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
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.userRole = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('profileComplete');
    },

    // Token refresh
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem('authToken', action.payload.token);
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
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.userRole = null;
        state.error = null;

        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('profileComplete');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Even if API call fails, clear local state
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.userRole = null;

        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('profileComplete');
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
} = authSlice.actions;

export default authSlice.reducer;

