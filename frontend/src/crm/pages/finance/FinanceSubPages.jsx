import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdTrendingUp, 
  MdTrendingDown, 
  MdAttachMoney, 
  MdAccountBalanceWallet, 
  MdReceipt, 
  MdWarning, 
  MdArrowUpward,
  MdArrowDownward,
  MdDownload,
  MdFilterList,
  MdPieChart,
  MdShowChart
} from 'react-icons/md';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  Line
} from 'recharts';
import { rgba } from 'polished';
import { motion } from 'framer-motion';

// --- Shared Components ---

const KPICard = ({ title, amount, percentage, trend, icon: Icon, color, delay }) => {
  const isPositive = trend === 'up';
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
         <Icon size={100} className={color} />
      </div>
      
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end gap-3 z-10 relative">
         <span className={`text-3xl font-bold ${color.replace('text-', 'text-')}`}>{amount}</span>
      </div>

      <div className={`mt-4 flex items-center gap-1 text-sm font-medium z-10 relative ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <MdArrowUpward /> : <MdArrowDownward />}
          <span>{percentage} this month</span>
      </div>
    </motion.div>
  );
};

// --- Mock Data ---

const INCOME_DATA = [
  { name: 'Mon', value: 12000 },
  { name: 'Tue', value: 19000 },
  { name: 'Wed', value: 15000 },
  { name: 'Thu', value: 22000 },
  { name: 'Fri', value: 28000 },
  { name: 'Sat', value: 35000 },
  { name: 'Sun', value: 32000 },
];

const EXPENSE_DATA = [
  { name: 'Week 1', fuel: 5000, maintenance: 2000, salary: 15000 },
  { name: 'Week 2', fuel: 6500, maintenance: 1000, salary: 0 },
  { name: 'Week 3', fuel: 11000, maintenance: 8500, salary: 0 },
  { name: 'Week 4', fuel: 7000, maintenance: 1200, salary: 15000 },
];

const PIE_DATA = [
  { name: 'Rentals', value: 65, color: '#4F46E5' },
  { name: 'Commissions', value: 25, color: '#10B981' },
  { name: 'Penalties', value: 10, color: '#F59E0B' },
];

const PENDING_PAYMENTS = [
  { id: 1, entity: "Corporate Client: TechSys", type: "Receivable", amount: 150000, due: "5 Days Overdue", status: "Critical" },
  { id: 2, entity: "Vendor: Rajesh Motors", type: "Payable", amount: 45000, due: "Due Tomorrow", status: "Warning" },
  { id: 3, entity: "Booking #BK-9921", type: "Receivable", amount: 12000, due: "Due in 2 Days", status: "Normal" },
];

const PROFIT_LOSS_DATA = [
    { month: 'Jan', revenue: 450000, expenses: 320000, profit: 130000 },
    { month: 'Feb', revenue: 520000, expenses: 350000, profit: 170000 },
    { month: 'Mar', revenue: 480000, expenses: 400000, profit: 80000 },
    { month: 'Apr', revenue: 600000, expenses: 380000, profit: 220000 },
];

// --- Pages ---

export const IncomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
       <div>
           <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                <span>/</span> 
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/finance/p-and-l')}>Finance</span> 
                <span>/</span> 
                <span className="text-gray-800 font-medium">Income</span>
            </div>
           <h1 className="text-2xl font-bold text-gray-900">Income Overview</h1>
           <p className="text-gray-500 text-sm">Revenue streams and earnings analysis.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <KPICard title="Total Revenue" amount="₹ 8.5L" percentage="+12%" trend="up" icon={MdAttachMoney} color="text-green-600" delay={0.1} />
           <KPICard title="Avg Daily Income" amount="₹ 28.3k" percentage="+5%" trend="up" icon={MdShowChart} color="text-blue-600" delay={0.2} />
           <KPICard title="Active Rentals" amount="42" percentage="+8%" trend="up" icon={MdDirectionsCar} color="text-indigo-600" delay={0.3} />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Chart */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 }}
             className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[400px]"
           >
               <h3 className="font-bold text-gray-800 mb-6">Weekly Revenue Trend</h3>
               <ResponsiveContainer width="100%" height="85%">
                   <AreaChart data={INCOME_DATA}>
                       <defs>
                           <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                           </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={val => `₹${val/1000}k`} />
                       <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                          formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Income']}
                       />
                       <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                   </AreaChart>
               </ResponsiveContainer>
           </motion.div>

           {/* Distribution */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
           >
               <h3 className="font-bold text-gray-800 mb-6">Revenue Sources</h3>
               <div className="h-[250px] relative">
                   <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                           <Pie
                               data={PIE_DATA}
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                           >
                               {PIE_DATA.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                           </Pie>
                           <Tooltip />
                       </PieChart>
                   </ResponsiveContainer>
                   {/* Center Text */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <span className="text-xl font-bold text-gray-700">100%</span>
                   </div>
               </div>
               <div className="space-y-3 mt-4">
                   {PIE_DATA.map((item, index) => (
                       <div key={index} className="flex justify-between items-center text-sm">
                           <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                               <span className="text-gray-600">{item.name}</span>
                           </div>
                           <span className="font-bold text-gray-800">{item.value}%</span>
                       </div>
                   ))}
               </div>
           </motion.div>
       </div>
    </div>
  );
};

export const ExpensesPage = () => {
    const navigate = useNavigate();
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
           <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/finance/p-and-l')}>Finance</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">Expenses</span>
                </div>
               <h1 className="text-2xl font-bold text-gray-900">Expense Tracking</h1>
               <p className="text-gray-500 text-sm">Monitor costs, fuel, and maintenance.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <KPICard title="Total Expenses" amount="₹ 4.2L" percentage="+8%" trend="up" icon={MdTrendingDown} color="text-red-500" delay={0.1} />
           <KPICard title="Fuel Cost" amount="₹ 1.5L" percentage="+15%" trend="up" icon={MdLocalGasStation} color="text-orange-500" delay={0.2} />
           <KPICard title="Maintenance" amount="₹ 85k" percentage="-5%" trend="down" icon={MdBuild} color="text-yellow-500" delay={0.3} />
        </div>

        <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[450px]"
        >
             <h3 className="font-bold text-gray-800 mb-6">Expense Breakdown (Weekly)</h3>
             <ResponsiveContainer width="100%" height="85%">
                 <BarChart data={EXPENSE_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                     <Legend />
                     <Bar dataKey="fuel" stackId="a" fill="#F97316" radius={[0,0,4,4]} barSize={40} name="Fuel" />
                     <Bar dataKey="maintenance" stackId="a" fill="#EAB308" name="Maintenance" />
                     <Bar dataKey="salary" stackId="a" fill="#3B82F6" radius={[4,4,0,0]} name="Salaries" />
                 </BarChart>
             </ResponsiveContainer>
        </motion.div>
    </div>
  );
};

export const PendingPaymentsPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                <span>/</span> 
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/finance/p-and-l')}>Finance</span> 
                <span>/</span> 
                <span className="text-gray-800 font-medium">Pending Payments</span>
            </div>
             <h1 className="text-2xl font-bold text-gray-900">Pending Payments</h1>
             <p className="text-gray-500 text-sm">Track outstanding invoices and unsettled dues.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
             {PENDING_PAYMENTS.map((item, index) => (
                 <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:border-indigo-100 transition-colors"
                 >
                     <div className="flex items-center gap-4 w-full md:w-auto">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.type === 'Receivable' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                             {item.type === 'Receivable' ? <MdArrowDownward size={24} /> : <MdArrowUpward size={24} />}
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900">{item.entity}</h4>
                             <p className="text-sm text-gray-500">{item.type} • <span className={`${item.status === 'Critical' ? 'text-red-600 font-bold' : 'text-orange-500'}`}>{item.due}</span></p>
                         </div>
                     </div>

                     <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                         <span className="text-xl font-bold text-gray-800">₹ {item.amount.toLocaleString()}</span>
                         <div className="flex gap-2">
                             <button className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg">Remind</button>
                             <button className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200">Settle</button>
                         </div>
                     </div>
                 </motion.div>
             ))}
        </div>
    </div>
);
}

export const ProfitLossPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                <span>/</span> 
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/finance/p-and-l')}>Finance</span> 
                <span>/</span> 
                <span className="text-gray-800 font-medium">P & L</span>
            </div>
             <h1 className="text-2xl font-bold text-gray-900">Profit & Loss Overview</h1>
             <p className="text-gray-500 text-sm">Monthly Net Profit Analysis.</p>
        </div>
        
        <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[500px]"
        >
             <h3 className="font-bold text-gray-800 mb-6">Revenue vs Expenses vs Profit</h3>
             <ResponsiveContainer width="100%" height="85%">
                 <BarChart data={PROFIT_LOSS_DATA} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                     <Legend />
                     <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" radius={[4,4,0,0]} barSize={20} />
                     <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4,4,0,0]} barSize={20} />
                     <Bar dataKey="profit" fill="#10B981" name="Net Profit" radius={[4,4,0,0]} barSize={20} />
                 </BarChart>
             </ResponsiveContainer>
        </motion.div>
    </div>
);
}

const CASH_FLOW_DATA = [
  { day: '01', cashIn: 15000, cashOut: -5000, net: 10000 },
  { day: '05', cashIn: 12000, cashOut: -8000, net: 4000 },
  { day: '10', cashIn: 20000, cashOut: -2000, net: 18000 },
  { day: '15', cashIn: 8000, cashOut: -12000, net: -4000 },
  { day: '20', cashIn: 25000, cashOut: -10000, net: 15000 },
  { day: '25', cashIn: 18000, cashOut: -5000, net: 13000 },
  { day: '30', cashIn: 30000, cashOut: -25000, net: 5000 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, desc: "Booking Payment #BK-001", type: "Credit", amount: 15000, date: "Today, 10:30 AM", method: "UPI" },
  { id: 2, desc: "Refill - Toyota Innova", type: "Debit", amount: 4500, date: "Today, 09:15 AM", method: "Cash" },
  { id: 3, desc: "Vendor Payout - Elite", type: "Debit", amount: 12000, date: "Yesterday, 04:00 PM", method: "Bank Transfer" },
  { id: 4, desc: "Security Deposit Refund", type: "Debit", amount: 2000, date: "Yesterday, 11:00 AM", method: "UPI" },
  { id: 5, desc: "Advance Booking #BK-042", type: "Credit", amount: 5000, date: "25 Dec, 02:00 PM", method: "Cash" },
  { id: 6, desc: "Office Utilities", type: "Debit", amount: 3500, date: "24 Dec, 10:00 AM", method: "Card" },
];

export const CashFlowPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
             <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="hover:text-[#1c205c] cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-[#1c205c] cursor-pointer transition-colors" onClick={() => navigate('/crm/finance/p-and-l')}>Finance</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">Cash Flow</span>
                </div>
                 <h1 className="text-2xl font-bold text-gray-900">Cash Flow Management</h1>
                 <p className="text-gray-500 text-sm">Real-time liquidity tracking & financial health.</p>
             </div>
             <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-[#1c205c] to-[#252d6d] text-white border border-[#1c205c] rounded-2xl px-6 py-3 flex items-center gap-4 shadow-xl shadow-gray-300"
             >
                 <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Current Balance</span>
                 <span className="text-3xl font-bold">₹ 8,42,000</span>
             </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Main Composed Chart */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 h-[450px] relative overflow-hidden"
             >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-red-500"></div>
                 <div className="flex justify-between items-center mb-8">
                     <div>
                        <h3 className="font-bold text-gray-800 text-lg">Cash Flow Trends</h3>
                        <p className="text-xs text-gray-400">Income vs Expenses vs Net Flow</p>
                     </div>
                     <div className="flex gap-4 text-xs font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                         <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Cash In</span>
                         <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Cash Out</span>
                         <span className="flex items-center gap-1.5 text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-[#1c205c]"></span> Net Flow</span>
                     </div>
                 </div>
                 <ResponsiveContainer width="100%" height="80%">
                     <ComposedChart data={CASH_FLOW_DATA} barGap={8}>
                         <defs>
                             <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                                 <stop offset="100%" stopColor="#10B981" stopOpacity={0.4}/>
                             </linearGradient>
                             <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8}/>
                                 <stop offset="100%" stopColor="#EF4444" stopOpacity={0.4}/>
                             </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={rgba('#000', 0.05)} />
                         <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                         <Tooltip 
                            cursor={{ fill: rgba('#000', 0.02) }}
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                padding: '12px 16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(4px)'
                            }} 
                         />
                         <Bar dataKey="cashIn" fill="url(#gIn)" radius={[6,6,0,0]} barSize={10} name="Cash In" animationDuration={1500} />
                         <Bar dataKey="cashOut" fill="url(#gOut)" radius={[6,6,0,0]} barSize={10} name="Cash Out" animationDuration={1500} />
                         <Line type="monotone" dataKey="net" stroke="#1c205c" strokeWidth={3} dot={{r: 4, fill: '#1c205c', strokeWidth: 2, stroke:'#fff'}} name="Net Flow" animationDuration={2000} />
                     </ComposedChart>
                 </ResponsiveContainer>
             </motion.div>

             {/* Recent Logs - Premium List */}
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col h-[450px]"
             >
                 <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                     <h3 className="font-bold text-gray-800 text-lg">Transactions</h3>
                     <button className="text-xs font-bold text-[#1c205c] hover:text-[#252d6d] bg-[#1c205c]/10 px-3 py-1.5 rounded-lg transition-colors">See All</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                     {RECENT_TRANSACTIONS.map((txn, i) => (
                         <motion.div 
                             key={txn.id}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.1 * i }}
                             whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
                             className="p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer bg-white"
                         >
                             <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${txn.type === 'Credit' ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-600' : 'bg-gradient-to-br from-red-50 to-red-100 text-red-600'}`}>
                                     {txn.type === 'Credit' ? <MdArrowDownward size={20} /> : <MdArrowUpward size={20} />}
                                 </div>
                                 <div className="min-w-0">
                                     <p className="text-sm font-bold text-gray-800 truncate">{txn.desc}</p>
                                     <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{txn.method}</span>
                                        <span className="text-xs text-gray-400">{txn.date}</span>
                                     </div>
                                 </div>
                             </div>
                             <span className={`text-sm font-bold whitespace-nowrap ${txn.type === 'Credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                 {txn.type === 'Credit' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                             </span>
                         </motion.div>
                     ))}
                 </div>
             </motion.div>
        </div>
        
        {/* Advanced Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-blue-100 relative overflow-hidden group"
                style={{ background: `linear-gradient(135deg, ${rgba('#EFF6FF', 0.8)}, ${rgba('#FFFFFF', 0.9)})` }}
             >
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                             <MdShowChart size={20} />
                          </div>
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">+8.2%</span>
                      </div>
                      <p className="text-blue-900 text-xs font-bold uppercase tracking-widest mb-1">Net Cash Flow</p>
                      <h4 className="text-3xl font-bold text-gray-900">₹ 42,000</h4>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Monthly surplus</p>
                  </div>
             </motion.div>

             <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-indigo-100 relative overflow-hidden group"
                style={{ background: `linear-gradient(135deg, ${rgba('#EEF2FF', 0.8)}, ${rgba('#FFFFFF', 0.9)})` }}
             >
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                             <MdAccountBalanceWallet size={20} />
                          </div>
                          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">Pending</span>
                      </div>
                      <p className="text-indigo-900 text-xs font-bold uppercase tracking-widest mb-1">Receivables</p>
                      <h4 className="text-3xl font-bold text-gray-900">₹ 1.2L</h4>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Due from clients</p>
                  </div>
             </motion.div>

             <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl border border-orange-100 relative overflow-hidden group"
                style={{ background: `linear-gradient(135deg, ${rgba('#FFF7ED', 0.8)}, ${rgba('#FFFFFF', 0.9)})` }}
             >
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-200">
                             <MdTrendingDown size={20} />
                          </div>
                          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">Avg</span>
                      </div>
                      <p className="text-orange-900 text-xs font-bold uppercase tracking-widest mb-1">Daily Burn</p>
                      <h4 className="text-3xl font-bold text-gray-900">₹ 12,000</h4>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Operational cost</p>
                  </div>
             </motion.div>
        </div>
    </div>
);
}

// Hack for Icons missing in explicit import to avoid ReferenceErrors in some environments
import { MdLocalGasStation, MdBuild, MdDirectionsCar } from 'react-icons/md';
