import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Admin Context
 * Manages admin authentication state using React hooks only
 * NO localStorage - All state managed via React hooks
 */

const AdminContext = createContext(null);

/**
 * Admin Context Provider
 * Provides admin authentication state and methods to child components
 */
export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Mock admin login function
   * In real app, this would call an API
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication - In real app, this would be an API call
      // For demo purposes, accept any email/password combination
      // In production, validate against backend
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock successful login
      const mockAdminUser = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        avatar: null,
      };

      setAdminUser(mockAdminUser);
      setIsAuthenticated(true);
      setError(null);

      return { success: true, user: mockAdminUser };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      setIsAuthenticated(false);
      setAdminUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mock admin signup function
   * In real app, this would call an API
   */
  const signup = useCallback(async (name, email, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Mock successful signup
      const mockAdminUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        role: 'admin',
        avatar: null,
      };

      setAdminUser(mockAdminUser);
      setIsAuthenticated(true);
      setError(null);

      return { success: true, user: mockAdminUser };
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      setIsAuthenticated(false);
      setAdminUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears admin state
   */
  const logout = useCallback(() => {
    setAdminUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const value = {
    adminUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

/**
 * Custom hook to use Admin Context
 * Throws error if used outside AdminProvider
 */
export const useAdminAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminProvider');
  }
  return context;
};

export default AdminContext;

