import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import { loginSuccess, logout, authInitialized } from '../../store/slices/authSlice';
import { setUser } from '../../store/slices/userSlice';

/**
 * AuthInitializer Component
 * Checks and restores authentication state on app mount/refresh
 * Verifies token validity and restores user session
 */
const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const initializeAuth = async () => {
      // Get token from localStorage
      const storedToken = localStorage.getItem('authToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      // If no token, user is not authenticated
      if (!storedToken) {
        if (isAuthenticated) {
          // State says authenticated but no token - clear state
          dispatch(logout());
        }
        dispatch(authInitialized()); // Mark initialization as complete
        return;
      }

      // If already authenticated and user exists, skip
      // But only if token matches and we're not in the middle of initialization
      if (isAuthenticated && user && token === storedToken && token) {
        // Mark initialization as complete since we're already authenticated
        dispatch(authInitialized());
        return;
      }

      // If token exists but user is not in state, verify token and restore session
      // This handles the case where page was refreshed and user data needs to be restored
      if (storedToken) {
        try {
          // Try to fetch user profile to verify token
          const profileResponse = await userService.getProfile();
          
          if (profileResponse.success && profileResponse.data?.user) {
            const userData = profileResponse.data.user;
            
            // Restore authentication state
            dispatch(loginSuccess({
              token: storedToken,
              refreshToken: storedRefreshToken,
              userRole: userData.role || 'user',
            }));
            
            // Restore user data
            dispatch(setUser(userData));
            
            // Mark initialization as complete
            dispatch(authInitialized());
            
            console.log('✅ Authentication restored on refresh');
          } else {
            // Profile fetch failed - token might be invalid
            console.warn('⚠️ Failed to restore session - token may be invalid');
            dispatch(authInitialized()); // Mark initialization as complete
            // Don't logout immediately - let API interceptor handle it
          }
        } catch (error) {
          // If profile fetch fails, token might be expired
          // Try to refresh token
          if (storedRefreshToken) {
            try {
              const refreshResponse = await authService.refreshToken(storedRefreshToken);
              
              if (refreshResponse?.token || refreshResponse?.data?.token) {
                const newToken = refreshResponse.token || refreshResponse.data.token;
                const newRefreshToken = refreshResponse.refreshToken || refreshResponse.data.refreshToken || storedRefreshToken;
                
                // Store new tokens
                localStorage.setItem('authToken', newToken);
                if (newRefreshToken) {
                  localStorage.setItem('refreshToken', newRefreshToken);
                }
                
                // Try to fetch profile again with new token
                const profileResponse = await userService.getProfile();
                
                if (profileResponse.success && profileResponse.data?.user) {
                  const userData = profileResponse.data.user;
                  
                  // Restore authentication state
                  dispatch(loginSuccess({
                    token: newToken,
                    refreshToken: newRefreshToken,
                    userRole: userData.role || 'user',
                  }));
                  
                  // Restore user data
                  dispatch(setUser(userData));
                  
                  // Mark initialization as complete
                  dispatch(authInitialized());
                  
                  console.log('✅ Authentication restored after token refresh');
                } else {
                  // Still failed - clear auth
                  dispatch(logout());
                  dispatch(authInitialized());
                }
              } else {
                // Refresh failed - clear auth
                dispatch(logout());
                dispatch(authInitialized());
              }
            } catch (refreshError) {
              // Refresh failed - clear auth
              console.error('Token refresh failed on initialization:', refreshError);
              dispatch(logout());
              dispatch(authInitialized());
            }
          } else {
            // No refresh token - clear auth
            dispatch(logout());
            dispatch(authInitialized());
          }
        }
      }
    };

    // Only run on mount, not on every render
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return null; // This component doesn't render anything
};

export default AuthInitializer;

