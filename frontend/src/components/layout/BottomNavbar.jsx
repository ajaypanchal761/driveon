import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { theme } from '../../theme/theme.constants';

/**
 * BottomNavbar Component
 * Mobile-only bottom navigation bar
 * Tabs: Home, Search, Add (center button), Bookings, Profile
 */
const BottomNavbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
    },
    {
      path: '/cars',
      label: 'Search',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      ),
    },
    {
      type: 'add',
      label: 'Add',
      onClick: () => {
        // Handle add action - could navigate to add car or booking
        if (isAuthenticated) {
          // Navigate to appropriate add page
        }
      },
    },
    {
      path: '/bookings',
      label: 'Bookings',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      ),
      requiresAuth: true,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      requiresAuth: true,
    },
  ];

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleClick = (item, e) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      window.location.href = '/login';
    }
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%'
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          // Special handling for Add button (center button)
          if (item.type === 'add') {
            return (
              <button
                key="add"
                onClick={handleClick.bind(null, item)}
                className="flex flex-col items-center justify-center -mt-6 touch-target"
                aria-label={item.label}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.colors.primary }}>
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>
            );
          }

          const active = isActive(item.path);
          const disabled = item.requiresAuth && !isAuthenticated;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleClick(item, e)}
              className={`
                flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-colors touch-target
                ${disabled ? 'opacity-50' : ''}
              `}
              aria-label={item.label}
            >
              <svg
                className="w-6 h-6"
                style={{ color: active ? theme.colors.primary : '#6b7280' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              <span className="text-xs font-medium" style={{ color: active ? theme.colors.primary : '#6b7280' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;

