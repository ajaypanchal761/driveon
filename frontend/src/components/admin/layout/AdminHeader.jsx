import { useNavigate } from "react-router-dom";
import { colors } from "../../../module/theme/colors";
import { useAdminAuth } from "../../../context/AdminContext";

/**
 * Admin Header Component
 * Top header for admin panel with logo, admin name, and logout
 * No localStorage - State managed via React hooks
 */
const AdminHeader = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();

  // Default admin user if not available
  const displayUser = adminUser || {
    name: "Admin User",
    email: "admin@driveon.com",
    avatar: null,
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header 
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b z-30 flex items-center justify-between pl-16 lg:pl-4 pr-3 md:pr-4 md:px-6 lg:px-8 overflow-hidden"
      style={{ 
        backgroundColor: colors.backgroundSecondary,
        borderBottomColor: colors.borderMedium
      }}
    >
      {/* Mobile: Left Side - Title/Logo (only on mobile) */}
      <div className="lg:hidden flex items-center min-w-0 flex-1">
        <h1 className="text-base font-bold truncate" style={{ color: colors.textPrimary }}>
          Admin Panel
        </h1>
      </div>

      {/* Desktop: Left Side - Search Bar */}
      <div className="hidden lg:flex flex-1 max-w-md min-w-0 mr-4">
        <div className="relative w-full">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search users, cars, bookings..."
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
            style={{
              border: `1px solid ${colors.borderMedium}`,
              backgroundColor: colors.backgroundSecondary,
              color: colors.textPrimary
            }}
          />
        </div>
      </div>

      {/* Right Side - Admin Info & Actions */}
      <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 flex-shrink-0">
        {/* Notifications Icon */}
        <button
          className="relative p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 touch-target"
          style={{
            color: colors.textSecondary
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundLight}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          aria-label="Notifications"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: colors.textSecondary }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Logout Icon */}
        <button
          onClick={handleLogout}
          className="p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 touch-target"
          style={{ color: colors.textSecondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.backgroundLight;
            e.currentTarget.style.color = colors.error;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.textSecondary;
          }}
          aria-label="Logout"
          title="Logout"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'inherit' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>

        {/* Admin Profile Info */}
        <button
          onClick={() => navigate('/admin/profile')}
          className="flex items-center gap-1.5 md:gap-2 lg:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="View Profile"
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            {displayUser.avatar ? (
              <img
                src={displayUser.avatar}
                alt={displayUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{displayUser.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          {/* Name - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:block text-left min-w-0">
            <p className="text-xs md:text-sm font-medium truncate" style={{ color: colors.textPrimary }}>
              {displayUser.name}
            </p>
            <p className="text-xs truncate hidden lg:block" style={{ color: colors.textSecondary }}>{displayUser.email}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

