import { useState } from 'react';

/**
 * Header Component
 * Red background with location, profile icon, and promotional text
 * Exact match to image design
 */
const Header = () => {
  const [location] = useState('Columbia, South Carolina');

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-30 text-white overflow-visible rounded-b-3xl"
      style={{ backgroundColor: '#DC2626' }}
    >
      {/* Header Content */}
      <div className="relative px-4 pt-4 pb-8">
        {/* Top Row - Location and Profile Icon */}
        <div className="flex items-center justify-between mb-4">
          {/* Left - Location Section */}
          <div className="flex items-center gap-2">
            {/* Location Pin Icon - White Circle */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#DC2626' }}
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
            </div>
            
            {/* Location Text */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white leading-tight">Location</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-white">
                  {location}
                </span>
                <svg
                  className="w-3 h-3 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right - Profile Icon */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#DC2626' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Promotional Text */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium text-white leading-tight">
            Enjoy your holidays with our wheels
          </h2>
        </div>
      </div>

      {/* Search Bar - Half in Header, Half Below - Fixed Position for Highest Z-Index */}
      <div className="absolute left-4 right-4 bottom-0 transform translate-y-1/2 z-[9999]">
        <div className="bg-white rounded-xl shadow-lg flex items-center gap-2 px-2.5 py-0.5 max-w-[95%] mx-auto">
          {/* Magnifying Glass Icon - Bold */}
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: '#9CA3AF' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search a car..."
            className="flex-1 text-xs text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />

          {/* Filter Icon - Bold */}
          <button
            className="flex-shrink-0"
            aria-label="Filter"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#9CA3AF' }}
            >
              {/* Filter Icon - Two horizontal lines with two circles on each */}
              <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"/>
              <circle cx="7" cy="6" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="6" r="1.5" fill="currentColor"/>
              <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"/>
              <circle cx="14" cy="18" r="1.5" fill="currentColor"/>
              <circle cx="17" cy="18" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

