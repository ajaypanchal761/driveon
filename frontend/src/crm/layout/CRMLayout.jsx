import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

import { StaffProvider } from '../context/StaffContext';

const CRMLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <StaffProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex flex-col min-h-screen">
          <Topbar toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 md:ml-64 p-4 md:p-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
               <Outlet />
            </div>
          </main>
        </div>
      </div>
    </StaffProvider>
  );
};

export default CRMLayout;
