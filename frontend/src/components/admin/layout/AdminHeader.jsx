import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { colors } from "../../../module/theme/colors";
import { useAdminAuth } from "../../../context/AdminContext";
import { MdSearch, MdPerson, MdDirectionsCar, MdEventNote, MdArrowForward } from "react-icons/md";

// Mock Global Data for Admin Search
const SEARCH_DATA = [
  // Users
  { id: 'u1', type: 'User', title: 'Rahul Sharma', subtitle: 'rahul@example.com', path: '/admin/users' },
  { id: 'u2', type: 'User', title: 'Amit Verma', subtitle: 'amit@example.com', path: '/admin/users' },
  // Cars
  { id: 'c1', type: 'Car', title: 'Toyota Innova Crysta', subtitle: 'PB 01 1234', path: '/admin/cars' },
  { id: 'c2', type: 'Car', title: 'Mahindra Thar', subtitle: 'PB 65 9876', path: '/admin/cars' },
  // Bookings
  { id: 'b1', type: 'Booking', title: 'Booking #BK-2025-001', subtitle: 'Active', path: '/admin/bookings/active' },
  { id: 'b2', type: 'Booking', title: 'Booking #BK-2025-002', subtitle: 'Pending', path: '/admin/bookings/pending' },
  // KYC & Guarantors
  { id: 'k1', type: 'KYC', title: 'Pending KYC Requests', subtitle: 'Verification', path: '/admin/kyc/pending' },
  { id: 'g1', type: 'Guarantor', title: 'Pending Guarantors', subtitle: 'Verification', path: '/admin/guarantors/pending' },
  // Pages
  { id: 'p1', type: 'Page', title: 'Dashboard', subtitle: 'Overview', path: '/admin/dashboard' },
  { id: 'p2', type: 'Page', title: 'Payments', subtitle: 'Transaction History', path: '/admin/payments' },
  { id: 'p3', type: 'Page', title: 'Tracking', subtitle: 'GPS Tracking', path: '/admin/tracking' },
  { id: 'p4', type: 'Page', title: 'Referrals', subtitle: 'Referral Management', path: '/admin/referrals' },
];

const fuseOptions = {
  keys: ['title', 'subtitle', 'type'],
  threshold: 0.3,
};

/**
 * Admin Header Component
 * Top header for admin panel with logo, admin name, and logout
 */
const AdminHeader = () => {
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const fuse = new Fuse(SEARCH_DATA, fuseOptions);

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = fuse.search(query);
      setResults(searchResults.map(result => result.item));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (path) => {
    navigate(path);
    setShowResults(false);
    setQuery('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'User': return <MdPerson className="text-blue-500" />;
      case 'Car': return <MdDirectionsCar className="text-orange-500" />;
      case 'Booking': return <MdEventNote className="text-green-500" />;
      case 'Page': return <MdSearch className="text-gray-400" />;
      default: return <MdSearch className="text-gray-400" />;
    }
  };

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
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b z-40 flex items-center justify-between pl-16 lg:pl-4 pr-3 md:pr-4 md:px-6 lg:px-8"
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
      <div className="hidden lg:flex flex-1 max-w-md min-w-0 mr-4" ref={searchRef}>
        <div className="relative w-full">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowResults(true)}
            placeholder="Search users, cars, bookings..."
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
            style={{
              border: `1px solid ${colors.borderMedium}`,
              backgroundColor: colors.backgroundSecondary,
              color: colors.textPrimary
            }}
          />
          
          {/* Search Results Dropdown */}
          {showResults && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto z-50">
                {results.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Search Results
                    </div>
                    {results.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item.path)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                      >
                         <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                            {getIcon(item.type)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 truncate">{item.type} • {item.subtitle}</p>
                         </div>
                         <MdArrowForward className="text-gray-300 transform -rotate-45" size={16} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm">No results found for "{query}"</p>
                  </div>
                )}
             </div>
          )}
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

