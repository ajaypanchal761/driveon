import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import MobileMenu from './MobileMenu';

/**
 * Header Component
 * Mobile: Exactly like design (hamburger, title, heart, profile)
 * Desktop: Horizontal navbar with theme colors
 */
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavorites, setIsFavorites] = useState(false);

  // Get current page title (you can customize this based on route)
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path === '/cars' || path.startsWith('/cars/')) return 'Choose a Car';
    if (path === '/') return 'DriveOn';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/bookings')) return 'My Bookings';
    return 'DriveOn';
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Header - Exactly like design */}
      <header className="md:hidden bg-primary text-white pt-0">
        {/* Main Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 touch-target"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Title - Centered */}
          <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
            {getPageTitle()}
          </h1>

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            {/* Heart Icon (Favorites) */}
            <button
              onClick={() => setIsFavorites(!isFavorites)}
              className="p-2 touch-target"
              aria-label="Favorites"
            >
              <svg
                className={`w-6 h-6 ${isFavorites ? 'fill-current' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Profile Picture */}
            <button
              onClick={handleProfileClick}
              className="touch-target"
              aria-label="Profile"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-white">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Section (Below Header) */}
        <div className="px-4 pb-3 flex items-center gap-2">
          {/* Location Input */}
          <div className="flex-1 bg-white rounded-lg px-3 py-2.5 flex items-center gap-2 min-h-[44px]">
            <svg
              className="w-5 h-5 text-text-secondary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Florida, USA"
              className="flex-1 text-base text-text-primary placeholder-text-secondary outline-none bg-transparent"
              readOnly
            />
          </div>

          {/* Calendar Button (Orange) */}
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2.5 touch-target min-w-[44px]"
            aria-label="Select date"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Filter Button */}
          <button
            className="bg-white hover:bg-background-secondary text-text-secondary rounded-lg p-2.5 touch-target min-w-[44px]"
            aria-label="Filter"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block bg-primary text-white shadow-md">
        <div className="container-mobile">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold">DriveOn</span>
            </Link>

            {/* Navigation Menu */}
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className="hover:text-white/80 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/cars"
                className="hover:text-white/80 transition-colors font-medium"
              >
                Browse Cars
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/bookings"
                    className="hover:text-white/80 transition-colors font-medium"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className="hover:text-white/80 transition-colors font-medium"
                  >
                    Profile
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsFavorites(!isFavorites)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Favorites"
                  >
                    <svg
                      className={`w-6 h-6 ${isFavorites ? 'fill-current' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleProfileClick}
                    className="touch-target"
                    aria-label="Profile"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-white">
                        <svg
                          className="w-6 h-6 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Header;

