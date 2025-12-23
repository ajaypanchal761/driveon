import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CrmSidebar from './CrmSidebar';
import CrmHeader from './CrmHeader';
import Calculator from '../common/Calculator';

const CrmLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <CrmSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden md:pl-64">
        <CrmHeader onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 relative">
          <Outlet />
          <Calculator />
        </main>
      </div>
    </div>
  );
};

export default CrmLayout;
