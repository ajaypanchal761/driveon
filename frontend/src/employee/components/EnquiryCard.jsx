import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

const EnquiryCard = ({ enquiry, onClick }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-blue-100 text-blue-600';
      case 'closed': return 'bg-orange-100 text-orange-600';
      case 'converted': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
            {enquiry.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-base">{enquiry.name}</h4>
            <div className="flex items-center gap-1 text-xs text-gray-400">
               <FiPhone className="text-[10px]" /> {enquiry.phone}
            </div>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getStatusColor(enquiry.status)}`}>
          {enquiry.status}
        </span>
      </div>

      <div className="flex justify-between items-center border-t border-gray-50 pt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FiCalendar />
          <span>{enquiry.date}</span>
        </div>
        
        <button className="flex items-center gap-1 text-xs font-bold text-[#1C205C] hover:text-blue-700">
          View Details <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default EnquiryCard;
