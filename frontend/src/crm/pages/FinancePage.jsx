import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MdAttachMoney, 
  MdTrendingUp, 
  MdTrendingDown, 
  MdPieChart, 
  MdBarChart,
  MdDateRange,
  MdDownload
} from 'react-icons/md';

// MOCK DATA: FINANCE
const MONTHLY_STATS = {
  income: 450000,
  expense: 120000,
  netProfit: 330000,
  growth: '+12%'
};

const EXPENSE_BREAKDOWN = [
  { category: 'Staff Salary', amount: 45000, color: 'bg-blue-500' },
  { category: 'Fuel', amount: 35000, color: 'bg-orange-500' },
  { category: 'Garage & Spares', amount: 20000, color: 'bg-red-500' },
  { category: 'Vendor Payments', amount: 15000, color: 'bg-purple-500' },
  { category: 'Office/Misc', amount: 5000, color: 'bg-gray-400' },
];

const TRANSACTIONS = [
  { id: 1, desc: 'Booking #1012 Payment', type: 'Income', amount: 15000, date: '2023-12-27', source: 'Customer' },
  { id: 2, desc: 'Diesel Fill - Innova', type: 'Expense', amount: 3500, date: '2023-12-27', source: 'Fuel Card' },
  { id: 3, desc: 'Booking #1011 Payment', type: 'Income', amount: 12000, date: '2023-12-26', source: 'Customer' },
  { id: 4, desc: 'Garage Bill - AutoFix', type: 'Expense', amount: 8500, date: '2023-12-26', source: 'Vendor' },
];

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, P&L, Reports

  // TAB 1: Financial Overview (Dashboard)
  const Overview = () => (
    <div className="space-y-6">
       {/* Top Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <MdTrendingUp size={60} className="text-green-500" />
             </div>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">Total Income</p>
             <h3 className="text-3xl font-bold text-green-600">Rs. {MONTHLY_STATS.income.toLocaleString()}</h3>
             <p className="text-xs text-green-700 bg-green-50 w-fit px-2 py-1 rounded-full flex items-center gap-1">
                <MdTrendingUp /> {MONTHLY_STATS.growth} vs last month
             </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <MdTrendingDown size={60} className="text-red-500" />
             </div>
             <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">Total Expenses</p>
             <h3 className="text-3xl font-bold text-red-600">Rs. {MONTHLY_STATS.expense.toLocaleString()}</h3>
             <p className="text-xs text-gray-400">Fixed + Variable Costs</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900 to-indigo-800 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between h-32">
             <p className="opacity-80 text-sm font-bold uppercase tracking-wide">Net Profit</p>
             <h3 className="text-3xl font-bold text-white">Rs. {MONTHLY_STATS.netProfit.toLocaleString()}</h3>
             <p className="text-xs opacity-60">December 2023</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MdPieChart className="text-blue-500" /> Expense Distribution
             </h3>
             <div className="space-y-4">
                {EXPENSE_BREAKDOWN.map((item, idx) => {
                   const percentage = Math.round((item.amount / MONTHLY_STATS.expense) * 100);
                   return (
                      <div key={idx} className="group cursor-pointer">
                         <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.category}</span>
                            <span className="text-gray-500">Rs. {item.amount.toLocaleString()} ({percentage}%)</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out group-hover:opacity-80`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <MdAttachMoney className="text-green-600" /> Cash Flow
                </h3>
                <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
             </div>
             
             <div className="space-y-4">
                {TRANSACTIONS.map(tx => (
                   <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${tx.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {tx.type === 'Income' ? <MdTrendingUp /> : <MdTrendingDown />}
                         </div>
                         <div>
                            <p className="font-bold text-gray-800 text-sm">{tx.desc}</p>
                            <p className="text-xs text-gray-400">{tx.date} • {tx.source}</p>
                         </div>
                      </div>
                      <span className={`font-bold text-sm ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                         {tx.type === 'Income' ? '+' : '-'} Rs. {tx.amount.toLocaleString()}
                      </span>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  // TAB 2: Reports (Simple List for this iteration)
  const ReportsView = () => (
     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 text-3xl">
           <MdBarChart />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Detailed Reports</h3>
        <p className="text-gray-500 max-w-md mx-auto mt-2 mb-6">
           Download monthly statements, vehicle profitability reports, and staff performance metrics.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
           {['Monthly P&L Statement', 'Car-wise Profitability', 'Staff Salary Slip', 'GST Output Report'].map((report, idx) => (
              <button key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                 <span className="font-semibold text-gray-700 group-hover:text-blue-700">{report}</span>
                 <MdDownload className="text-gray-400 group-hover:text-blue-600" />
              </button>
           ))}
        </div>
     </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance & Reports</h1>
            <p className="text-gray-500 text-sm">Profit analysis and expense tracking</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
             {['Overview', 'Reports'].map(tab => (
                <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2
                      ${activeTab === tab 
                        ? 'bg-gray-900 text-white shadow' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                   {tab === 'Overview' ? <MdAttachMoney /> : <MdBarChart />}
                   {tab}
                </button>
             ))}
          </div>
       </div>

       <motion.div
         key={activeTab}
         initial={{ opacity: 0, y: 5 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.2 }}
       >
          {activeTab === 'Overview' && <Overview />}
          {activeTab === 'Reports' && <ReportsView />}
       </motion.div>
    </div>
  );
};

export default FinancePage;
