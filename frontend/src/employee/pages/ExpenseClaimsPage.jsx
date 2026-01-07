import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiFileText, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiPaperclip } from 'react-icons/fi';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const ExpenseClaimsPage = () => {
  const [activeTab, setActiveTab] = useState('Active');

  const stats = [
    { label: 'Total Claimed', value: '₹12,450', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Approved', value: '₹8,200', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: '₹4,250', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const claims = [
    { id: 1, type: 'Fuel', date: 'Dec 28, 2025', amount: '₹2,500', status: 'Pending', description: 'Refueling for client visit to Noida', attachment: true },
    { id: 2, type: 'Food', date: 'Dec 25, 2025', amount: '₹450', status: 'Approved', description: 'Team lunch', attachment: true },
    { id: 3, type: 'Travel', date: 'Dec 20, 2025', amount: '₹1,200', status: 'Rejected', description: 'Taxi fare - late night', attachment: false },
    { id: 4, type: 'Fuel', date: 'Dec 15, 2025', amount: '₹1,800', status: 'Paid', description: 'Monthly fuel allowance', attachment: true },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Rejected': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Paid': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-[#1C205C] pt-6 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
          <HeaderTopBar title="Expense Claims" />
          
          {/* Main Action Button in Header */}
          <div className="mt-6">
            <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-all shadow-lg active:scale-95">
                <FiPlus className="text-xl" /> New Claim Request
            </button>
          </div>
      </div>

      {/* STATS ROW */}
      <div className="px-6 -mt-10 z-10 grid grid-cols-3 gap-3">
         {stats.map((stat, idx) => (
             <div key={idx} className="bg-white p-3 rounded-2xl shadow-lg shadow-blue-900/5 border border-white flex flex-col items-center justify-center text-center">
                 <span className={`text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1`}>{stat.label}</span>
                 <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
             </div>
         ))}
      </div>

      {/* FILTER TABS */}
      <div className="px-6 mt-6 flex gap-2">
         {['Active', 'History'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-[#1C205C] text-white shadow-md' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
             >
               {tab}
             </button>
         ))}
      </div>

      {/* CLAIMS LIST */}
      <div className="px-6 mt-4 space-y-4 flex-1">
          {claims.map((claim, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={claim.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group overflow-hidden"
              >
                  <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                              {claim.type === 'Fuel' ? <FiDollarSign /> : <FiFileText />}
                          </div>
                          <div>
                              <h4 className="font-bold text-gray-800">{claim.type}</h4>
                              <p className="text-xs text-gray-400">{claim.date}</p>
                          </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(claim.status)}`}>
                          {claim.status}
                      </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 pl-13 border-l-2 border-gray-100 ml-5 pl-4">
                      {claim.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                         {claim.attachment && (
                             <span className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-1 rounded-md cursor-pointer hover:bg-blue-100">
                                 <FiPaperclip /> 1 Attachment
                             </span>
                         )}
                      </div>
                      <span className="text-lg font-black text-[#1C205C]">{claim.amount}</span>
                  </div>
              </motion.div>
          ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default ExpenseClaimsPage;
