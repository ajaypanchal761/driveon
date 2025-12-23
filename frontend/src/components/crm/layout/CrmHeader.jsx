import { useState } from 'react';
import { Link } from 'react-router-dom';

const CrmHeader = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      {/* Left: Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div>
           <h1 className="text-lg font-bold text-gray-800 md:text-xl">Owner Dashboard</h1>
        </div>
      </div>

      {/* Right: Filters & Actions */}
      <div className="flex items-center gap-3">
        {/* City Selector */}
        <div className="hidden md:block">
            <select className="rounded-md border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>All Cities</option>
                <option>New Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
            </select>
        </div>

        {/* Date Range */}
        <div className="hidden md:block">
            <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Today</span>
            </button>
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                OP
            </div>
        </div>
      </div>
    </header>
  );
};

export default CrmHeader;
