import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiCheckSquare, FiUser, FiClock } from 'react-icons/fi';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
    >
      <NavIcon 
        icon={<FiHome size={22} />} 
        label="Home" 
        active={isActive('/employee')} 
        onClick={() => navigate('/employee')}
      />
      <NavIcon 
        icon={<FiUsers size={22} />} 
        label="Enquiries" 
        active={isActive('/employee/enquiries')} 
        onClick={() => navigate('/employee/enquiries')}
      />
      
      {/* Floating Center Button (Attendance) */}
      <div className="relative -top-8">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           whileHover={{ scale: 1.1 }}
           onClick={() => navigate('/employee/attendance')}
           className="w-16 h-16 rounded-full bg-[#1C205C] text-white flex items-center justify-center shadow-xl shadow-blue-900/40 transform transition-all ring-4 ring-[#F5F7FA]"
         >
           <FiClock size={28} />
         </motion.button>
         <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold ${isActive('/employee/attendance') ? 'text-[#1C205C]' : 'text-gray-400'}`}>Attendance</span>
      </div>

      <NavIcon 
        icon={<FiCheckSquare size={22} />} 
        label="Tasks" 
        active={isActive('/employee/tasks')} 
        onClick={() => navigate('/employee/tasks')}
      />
      <NavIcon 
        icon={<FiUser size={22} />} 
        label="Profile" 
        active={isActive('/employee/profile')} 
        onClick={() => navigate('/employee/profile')}
      />
    </motion.div>
  );
};

const NavIcon = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 ${active ? 'text-[#1C205C]' : 'text-gray-300 hover:text-gray-500'} transition-colors`}
  >
    {icon}
    <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export default BottomNav;
