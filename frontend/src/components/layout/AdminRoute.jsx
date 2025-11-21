import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * AdminRoute Component
 * Guards routes that require admin authentication
 * Redirects to admin login if not authenticated
 */
const AdminRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin authentication token
    const adminToken = localStorage.getItem("adminAuthToken");
    const adminUser = localStorage.getItem("adminUser");

    if (adminToken && adminUser) {
      try {
        const user = JSON.parse(adminUser);
        if (
          user.role === "admin" ||
          user.role === "super_admin" ||
          user.role === "moderator"
        ) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error parsing admin user:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }

    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
