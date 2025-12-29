import React from 'react';
import { MdMenu, MdNotifications, MdSearch } from 'react-icons/md';
import { premiumColors } from '../../theme/colors';

const Topbar = ({ toggleSidebar }) => {
  return (
    <header 
      className="bg-white/80 backdrop-blur-md sticky top-0 z-20 h-16 border-b border-gray-200 px-4 flex items-center justify-between shadow-sm md:ml-64 transition-all duration-300"
      style={{ borderColor: premiumColors.border.light }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 md:hidden"
        >
          <MdMenu size={24} />
        </button>
        
        {/* Search Bar - Hidden on small mobile */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 lg:w-96 focus-within:ring-2 ring-blue-500/20 transition-all">
          <MdSearch className="text-gray-500 text-xl" />
          <input 
            type="text" 
            placeholder="Search bookings, cars, staff..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
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
