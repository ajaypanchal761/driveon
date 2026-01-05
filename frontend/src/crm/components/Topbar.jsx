import React, { useState, useEffect, useRef } from 'react';
import { MdMenu, MdNotifications, MdSearch, MdDirectionsCar, MdPerson, MdEventNote, MdArrowForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { premiumColors } from '../../theme/colors';

// Mock Global Data for Search
const SEARCH_DATA = [
  // Cars
  { id: 'c1', type: 'Car', title: 'Toyota Innova Crysta', subtitle: 'PB 01 1234', path: '/crm/cars/all' },
  { id: 'c2', type: 'Car', title: 'Mahindra Thar', subtitle: 'PB 65 9876', path: '/crm/cars/all' },
  { id: 'c3', type: 'Car', title: 'Maruti Swift Dzire', subtitle: 'PB 10 5678', path: '/crm/cars/all' },
  // Staff
  { id: 's1', type: 'Staff', title: 'Rajesh Kumar', subtitle: 'Driver', path: '/crm/staff/directory' },
  { id: 's2', type: 'Staff', title: 'Priya Singh', subtitle: 'Manager', path: '/crm/staff/directory' },
  // Bookings
  { id: 'b1', type: 'Booking', title: 'Booking #BK-2025-001', subtitle: 'Rahul Sharma', path: '/crm/bookings/active' },
  { id: 'b2', type: 'Booking', title: 'Booking #BK-2025-002', subtitle: 'Amit Verma', path: '/crm/bookings/active' },
  // Pages
  { id: 'p1', type: 'Page', title: 'Dashboard', subtitle: 'Overview', path: '/crm/dashboard' },
  { id: 'p2', type: 'Page', title: 'All Cars', subtitle: 'Fleet Management', path: '/crm/cars/all' },
  { id: 'p3', type: 'Page', title: 'Active Accidents', subtitle: 'Claims & Repairs', path: '/crm/cars/accidents/active' },
  { id: 'p4', type: 'Page', title: 'Staff Directory', subtitle: 'HR & Management', path: '/crm/staff/directory' },
  { id: 'p5', type: 'Page', title: 'Settings', subtitle: 'System Configuration', path: '/crm/settings' },
];

const fuseOptions = {
  keys: ['title', 'subtitle', 'type'],
  threshold: 0.3,
};

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
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
      case 'Car': return <MdDirectionsCar className="text-blue-500" />;
      case 'Staff': return <MdPerson className="text-green-500" />;
      case 'Booking': return <MdEventNote className="text-orange-500" />;
      default: return <MdSearch className="text-gray-400" />;
    }
  };

  return (
    <header 
      className="bg-white/80 backdrop-blur-md sticky top-0 z-20 h-16 border-b border-gray-200 px-4 flex items-center justify-between shadow-sm md:ml-64 transition-all duration-300"
      style={{ borderColor: premiumColors.border.light }}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 md:hidden"
        >
          <MdMenu size={24} />
        </button>
        
        {/* Search Bar */}
        <div ref={searchRef} className="relative hidden md:block w-64 lg:w-96">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full focus-within:ring-2 ring-blue-500/20 transition-all">
            <MdSearch className="text-gray-500 text-xl" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 1 && setShowResults(true)}
              placeholder="Search bookings, cars, staff..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Search Dropdown */}
          {showResults && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto w-[120%] z-50">
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

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 relative text-gray-600 transition-colors">
          <MdNotifications size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Date Display */}
        <div className="hidden sm:block text-right mr-2">
            <p className="text-xs text-gray-500 font-medium">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
