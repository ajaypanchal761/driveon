import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../../module/theme/colors";
import { useAdminAuth } from "../../../context/AdminContext";
import { messaging } from "../../../services/firebase";
import { onMessage } from "firebase/messaging";
import toastUtils from "../../../config/toast";

/**
 * Admin Header Component
 * Top header for admin panel with logo, admin name, and logout
 * No localStorage - State managed via React hooks
 */
const AdminHeader = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Default admin user if not available
  const displayUser = adminUser || {
    name: "Admin User",
    email: "admin@driveon.com",
    avatar: null,
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notification Listener
  useEffect(() => {
    if (messaging) {
      try {
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("🔔 Notification Received in Header:", payload);

          // Add to list
          const newNotification = {
            id: Date.now(),
            title: payload.notification?.title || "New Notification",
            body: payload.notification?.body || "",
            time: new Date(),
            read: false,
            data: payload.data || {}
          };

          setNotifications(prev => [newNotification, ...prev]);

          // Show Toast
          if (payload.notification) {
            toastUtils.info(`${payload.notification.title}: ${payload.notification.body}`);
          }
        });
        return () => {
          if (typeof unsubscribe === 'function') unsubscribe();
        };
      } catch (err) {
        console.error("Failed to setup notification listener:", err);
      }
    }
  }, []);

  // Helper to format time
  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 60000); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b z-30 flex items-center justify-between pl-16 lg:pl-4 pr-3 md:pr-4 md:px-6 lg:px-8"
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

        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 touch-target focus:outline-none"
            style={{
              color: colors.textSecondary,
              backgroundColor: showNotifications ? colors.backgroundLight : 'transparent'
            }}
            onMouseEnter={(e) => !showNotifications && (e.currentTarget.style.backgroundColor = colors.backgroundLight)}
            onMouseLeave={(e) => !showNotifications && (e.currentTarget.style.backgroundColor = 'transparent')}
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
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="absolute right-[-60px] md:right-0 mt-2 w-[85vw] max-w-[350px] md:w-80 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform origin-top-right transition-all"
              style={{
                backgroundColor: colors.backgroundSecondary,
                border: `1px solid ${colors.borderMedium}`
              }}
            >
              <div
                className="px-4 py-3 border-b flex justify-between items-center bg-opacity-50 backdrop-blur-sm"
                style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundLight }}
              >
                <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-xs font-medium hover:underline"
                    style={{ color: colors.primary }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 mb-3 opacity-20" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.textSecondary }}>
                      <path d="M10 2a6 6 0 00-9 6v3.586l-.707.707A1 1 0 001 14h12a1 1 0 00.707-1.707L13 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>No new notifications</p>
                    <p className="text-xs mt-1 opacity-60" style={{ color: colors.textSecondary }}>Real-time alerts will appear here</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 hover:bg-opacity-50 transition-colors cursor-pointer relative group ${!notification.read ? 'bg-opacity-5' : ''}`}
                      style={{
                        borderColor: colors.borderLight,
                        backgroundColor: !notification.read ? colors.primary + '10' : 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundLight}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !notification.read ? colors.primary + '10' : 'transparent'}
                      onClick={() => {
                        setNotifications(prev => prev.map(n => n.id === notification.id ? ({ ...n, read: true }) : n));
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm ${!notification.read ? 'font-bold' : 'font-medium'}`} style={{ color: colors.textPrimary }}>
                          {notification.title}
                        </p>
                        <span className="text-xs whitespace-nowrap ml-2 opacity-70" style={{ color: colors.textSecondary }}>
                          {formatTime(notification.time)}
                        </span>
                      </div>
                      <p className="text-xs line-clamp-2 leading-relaxed opacity-90" style={{ color: colors.textSecondary }}>
                        {notification.body}
                      </p>
                      {!notification.read && (
                        <span className="absolute top-4 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
