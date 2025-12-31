import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const HeaderTopBar = ({ title, showBack = true, rightAction }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center text-white mb-6">
      {showBack ? (
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
        >
          <FiArrowLeft size={20} />
        </button>
      ) : (
        <div className="w-9" /> // Spacer
      )}
      
      <h1 className="text-xl font-bold tracking-wide">{title}</h1>
      
      {rightAction ? (
        rightAction
      ) : (
        <div className="w-9" /> // Spacer to keep title centered if no right action
      )}
    </div>
  );
};

export default HeaderTopBar;
