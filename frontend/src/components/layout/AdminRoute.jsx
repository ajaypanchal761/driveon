import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * AdminRoute Component
 * Guards routes that require admin role
 * Redirects to home if user is not admin
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, userRole, isLoading } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && userRole === 'admin';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

