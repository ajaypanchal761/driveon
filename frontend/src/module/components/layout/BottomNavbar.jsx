import { Link, useLocation } from 'react-router-dom';
import { colors } from '../../theme/colors';

/**
 * BottomNavbar Component - Exact match to design
 * Fixed bottom navigation with 4 icons
 */
const BottomNavbar = () => {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/search') {
      return location.pathname === '/search';
    }
    if (path === '/profile') {
      return location.pathname.startsWith('/profile');
    }
    if (path === '/bookings') {
      return location.pathname === '/bookings';
    }
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/search', icon: 'search', label: 'Search' },
    { path: '/bookings', icon: 'bookings', label: 'My Bookings' },
    { path: '/profile', icon: 'profile', label: 'Profile' },
  ];

  const getIcon = (iconName, active) => {
    const iconClass = active ? `w-6 h-6` : `w-6 h-6 text-white`;
    const iconColor = active ? { color: colors.backgroundTertiary } : { color: colors.textWhite };
    
    switch (iconName) {
      case 'home':
        return (
          <svg className={iconClass} style={iconColor} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'search':
        return (
          <svg className={iconClass} style={iconColor} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'bookings':
        return (
          <svg className={iconClass} style={iconColor} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'profile':
        return (
          <svg className={iconClass} style={iconColor} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 w-full px-4 py-3 rounded-t-2xl flex items-center justify-around z-50"
      style={{ backgroundColor: colors.backgroundTertiary }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px]"
          >
            {active ? (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: colors.backgroundPrimary }}
              >
                {getIcon(item.icon, active)}
              </div>
            ) : (
              getIcon(item.icon, active)
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;

