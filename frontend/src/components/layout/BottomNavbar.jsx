import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

/**
 * BottomNavbar Component
 * Mobile-only bottom navigation bar
 * Options: Home, Profile, Search, Bookings
 */
const BottomNavbar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

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
  ];

  const isActive = (path) => {
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
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-default z-30 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const disabled = item.requiresAuth && !isAuthenticated;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleClick(item, e)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors touch-target
                ${active ? 'text-primary' : 'text-text-secondary'}
                ${disabled ? 'opacity-50' : ''}
                ${active ? 'bg-primary/10' : 'hover:bg-background-secondary'}
              `}
              aria-label={item.label}
            >
              <svg
                className={`w-6 h-6 ${active ? 'text-primary' : 'text-text-secondary'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;

