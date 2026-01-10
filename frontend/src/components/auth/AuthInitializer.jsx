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
      // Determine context based on URL to enforce strict model separation
      const currentPath = window.location.pathname;
      const isEmployeeApp = currentPath.startsWith('/employee');

      // Get token from localStorage based on context
      const storedToken = isEmployeeApp
        ? localStorage.getItem('staffToken')
        : localStorage.getItem('authToken');

      // Select correct refresh token based on context
      const storedRefreshToken = isEmployeeApp
        ? localStorage.getItem('staffRefreshToken')
        : localStorage.getItem('refreshToken');

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

          let profileResponse;

          if (isEmployeeApp) {
            console.log('🔄 Restoring STAFF session (Employee Context)...');
            profileResponse = await userService.getStaffProfile();
          } else {
            console.log('🔄 Restoring USER session (User Context)...');
            profileResponse = await userService.getProfile();
          }

          if (profileResponse.success && profileResponse.data?.user) {
            const userData = profileResponse.data.user;

            // Restore authentication state
            dispatch(loginSuccess({
              token: storedToken,
              refreshToken: storedRefreshToken, // Pass the one we used
              // Strictly rely on context for role
              userRole: isEmployeeApp ? 'employee' : (userData.role || 'user'),
            }));

            // Restore user data
            dispatch(setUser(userData));

            // Mark initialization as complete
            dispatch(authInitialized());

            console.log('✅ Authentication restored');
          } else {
            // Profile fetch failed - token might be invalid for this context
            console.warn('⚠️ Failed to restore session - token invalid or wrong context');
            dispatch(authInitialized());
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

                // Store new tokens in correct slots
                if (isEmployeeApp) {
                  localStorage.setItem('staffToken', newToken);
                } else {
                  localStorage.setItem('authToken', newToken);
                }

                // Store new refresh token in correct slot
                if (newRefreshToken) {
                  if (isEmployeeApp) {
                    localStorage.setItem('staffRefreshToken', newRefreshToken);
                  } else {
                    localStorage.setItem('refreshToken', newRefreshToken);
                  }
                }

                // Retry profile fetch based on URL context
                let profileResponse;

                if (isEmployeeApp) {
                  profileResponse = await userService.getStaffProfile();
                } else {
                  profileResponse = await userService.getProfile();
                }

                if (profileResponse.success && profileResponse.data?.user) {
                  const userData = profileResponse.data.user;

                  // Restore authentication state
                  dispatch(loginSuccess({
                    token: newToken,
                    refreshToken: newRefreshToken,
                    userRole: isEmployeeApp ? 'employee' : (userData.role || 'user'),
                  }));

                  // Restore user data
                  dispatch(setUser(userData));

                  // Mark initialization as complete
                  dispatch(authInitialized());

                  console.log('✅ Authentication restored after refresh');
                } else {
                  // Still failed (e.g., Staff trying to access User App) -> Logout
                  dispatch(logout());
                  dispatch(authInitialized());
                }
              } else {
                dispatch(logout());
                dispatch(authInitialized());
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              dispatch(logout());
              dispatch(authInitialized());
            }
          } else {
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
