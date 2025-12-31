import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HeaderTopBar from '../components/HeaderTopBar'; // Will need to create generic header actually, but I'll inline for now or create it.
import EnquiryCard from '../components/EnquiryCard';
import BottomNav from '../components/BottomNav';

// Dummy Data
const dummyEnquiries = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", status: "Pending", date: "Today, 10:30 AM" },
  { id: 2, name: "Priya Singh", phone: "+91 98989 89898", status: "Missed", date: "Yesterday, 4:15 PM" },
  { id: 3, name: "Amit Verma", phone: "+91 99887 76655", status: "Converted", date: "Oct 24, 2023" },
  { id: 4, name: "Sneha Gupta", phone: "+91 88776 65544", status: "Pending", date: "Oct 23, 2023" },
  { id: 5, name: "Vikram Malhotra", phone: "+91 77665 54433", status: "Missed", date: "Oct 22, 2023" },
];

const EnquiriesListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const filteredEnquiries = activeTab === 'All' 
    ? dummyEnquiries 
    : dummyEnquiries.filter(e => e.status === activeTab);

  const tabs = ['All', 'Pending', 'Missed', 'Converted'];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-24 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <div className="bg-[#1C205C] pt-12 pb-6 px-6 rounded-b-[30px] shadow-lg sticky top-0 z-40">
        <HeaderTopBar 
          title="Enquiries" 
          rightAction={
            <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
               <FiSearch size={20} />
            </button>
          } 
        />

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
           {tabs.map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all
                 ${activeTab === tab 
                   ? 'bg-white text-[#1C205C] shadow-md' 
                   : 'bg-white/10 text-blue-100 hover:bg-white/20'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Showing {filteredEnquiries.length} {activeTab} 
          </p>
          <button className="text-[#1C205C] text-xs font-bold flex items-center gap-1">
             <FiFilter /> Filter
          </button>
        </div>

        <motion.div layout className="space-y-4">
           <AnimatePresence>
             {filteredEnquiries.length > 0 ? (
               filteredEnquiries.map(enquiry => (
                 <EnquiryCard key={enquiry.id} enquiry={enquiry} onClick={() => navigate(`/employee/enquiries/${enquiry.id}`)} />
               ))
             ) : (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                 className="text-center py-10 text-gray-400"
               >
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiSearch className="text-2xl" />
                 </div>
                 No enquiries found.
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#1C205C] rounded-full text-white shadow-xl shadow-blue-900/30 flex items-center justify-center z-40"
      >
        <FiPlus size={28} />
      </motion.button>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
};

export default EnquiriesListPage;
