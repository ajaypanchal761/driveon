import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDateRange, 
  MdTrendingUp, 
  MdTrendingDown, 
  MdDownload, 
  MdFilterList, 
  MdPieChart, 
  MdBarChart, 
  MdShowChart, 
  MdDirectionsCar,
  MdPerson,
  MdStore
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
  Line,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { rgba } from 'polished';
import { premiumColors } from '../../../theme/colors';

// --- Shared Components & Styles ---

const GLASS_STYLE = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
};

const ReportCard = ({ title, subtitle, children, delay = 0, className = "" }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        className={`bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col overflow-hidden ${className}`}
    >
        <div className="p-6 border-b border-gray-50 flex justify-between items-start">
            <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 block"></span>
                    {title}
                </h3>
                {subtitle && <p className="text-gray-400 text-xs mt-1 ml-3">{subtitle}</p>}
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">
                <MdFilterList size={18} />
            </div>
        </div>
        <div className="flex-1 w-full min-h-0 p-6 relative">
            {children}
        </div>
    </motion.div>
);

const StatWidget = ({ title, value, change, isPositive, color, icon: Icon, delay }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        whileHover={{ scale: 1.02 }}
        className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
    >
        <div className={`absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 scale-150`}>
            <Icon size={120} style={{ color: color.includes('text-indigo') ? premiumColors.primary.DEFAULT : '' }} className={!color.includes('text-indigo') ? color : ''} />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform`}
                     style={{ backgroundColor: color.includes('text-indigo') ? premiumColors.primary.DEFAULT : (color.includes('green') ? '#10B981' : (color.includes('red') ? '#EF4444' : '#F59E0B')) }}
                >
                    <Icon size={22} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <MdTrendingUp /> : <MdTrendingDown />}
                    {change}
                </span>
            </div>
            <h4 className="text-2xl font-black text-gray-800 tracking-tight">{value}</h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{title}</p>
        </div>
    </motion.div>
);

// --- Mock Data ---

const DAILY_DATA = [
    { time: '08:00', bookings: 2, revenue: 5000 },
    { time: '10:00', bookings: 5, revenue: 12000 },
    { time: '12:00', bookings: 8, revenue: 18000 },
    { time: '14:00', bookings: 6, revenue: 15000 },
    { time: '16:00', bookings: 10, revenue: 25000 },
    { time: '18:00', bookings: 12, revenue: 30000 },
    { time: '20:00', bookings: 7, revenue: 16000 },
];

const MONTHLY_DATA = [
    { name: 'Week 1', revenue: 45000, target: 40000, expenses: 15000 },
    { name: 'Week 2', revenue: 52000, target: 42000, expenses: 18000 },
    { name: 'Week 3', revenue: 48000, target: 45000, expenses: 16000 },
    { name: 'Week 4', revenue: 61000, target: 48000, expenses: 22000 },
];

const CAR_PERFORMANCE = [
    { subject: 'Utilization', A: 120, B: 110, fullMark: 150 },
    { subject: 'Revenue', A: 98, B: 130, fullMark: 150 },
    { subject: 'Maintenance', A: 86, B: 130, fullMark: 150 },
    { subject: 'Rating', A: 99, B: 100, fullMark: 150 },
    { subject: 'Fuel Eff.', A: 85, B: 90, fullMark: 150 },
    { subject: 'Trips', A: 65, B: 85, fullMark: 150 },
];

const PIE_DATA_1 = [
    { name: 'Rental', value: 400, color: '#6366F1' },
    { name: 'Chauffeur', value: 300, color: '#8B5CF6' },
    { name: 'Subscription', value: 300, color: '#EC4899' },
    { name: 'Other', value: 200, color: '#9CA3AF' },
];

const STAFF_DATA = [
    { name: 'Rajesh', tasks: 45, rating: 4.8, attendance: 98 },
    { name: 'Vikram', tasks: 38, rating: 4.5, attendance: 92 },
    { name: 'Priya', tasks: 52, rating: 4.9, attendance: 99 },
    { name: 'Amit', tasks: 30, rating: 4.2, attendance: 85 },
    { name: 'Suresh', tasks: 42, rating: 4.6, attendance: 95 },
];

const VENDOR_DATA = [
    { name: 'Garage A', cost: 45000, quality: 4.5, turnaround: 2 },
    { name: 'Garage B', cost: 32000, quality: 4.0, turnaround: 3 },
    { name: 'Fuel Station X', cost: 85000, quality: 5.0, turnaround: 0 },
    { name: 'Clean Services', cost: 12000, quality: 3.8, turnaround: 1 },
];

const COMPARISON_DATA = [
    { metric: 'Revenue', periodA: 150000, periodB: 180000 },
    { metric: 'Expenses', periodA: 60000, periodB: 65000 },
    { metric: 'Bookings', periodA: 45, periodB: 52 },
    { metric: 'New Leads', periodA: 120, periodB: 110 },
];

// --- Pages ---

export const DailyReportsPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/reports/daily')}>Reports</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">Daily</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Daily Operations Report</h1>
                <p className="text-gray-500 text-sm">Real-time tracking for Today, {new Date().toLocaleDateString()}.</p>
            </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatWidget title="Total Bookings" value="48" change="+12%" isPositive={true} color="text-indigo-500" icon={MdDirectionsCar} delay={0.1} />
            <StatWidget title="Revenue Today" value="₹ 1.2L" change="+8.5%" isPositive={true} color="text-green-500" icon={MdShowChart} delay={0.2} />
            <StatWidget title="Avg Trip Time" value="4.5 Hrs" change="-2.1%" isPositive={false} color="text-orange-500" icon={MdDateRange} delay={0.3} />
            <StatWidget title="Cancellations" value="3" change="0%" isPositive={true} color="text-red-500" icon={MdTrendingDown} delay={0.4} />
        </div>

        <ReportCard title="Hourly Performance" subtitle="Bookings vs Revenue Intensity" className="h-[400px]" delay={0.5}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DAILY_DATA}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={rgba('#000', 0.05)} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} name="Revenue" />
                    <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#F59E0B" strokeWidth={3} dot={{r:4, fill:'#fff', stroke:'#F59E0B', strokeWidth:2}} name="Bookings" />
                </AreaChart>
            </ResponsiveContainer>
        </ReportCard>
    </div>
);
}

export const MonthlyReportsPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/reports/daily')}>Reports</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">Monthly</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Monthly Performance</h1>
                <p className="text-gray-500 text-sm">Financial and operational review for current month.</p>
            </div>
            <div className="flex gap-2">
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50">Last Month</button>
                 <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold">This Month</button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ReportCard title="Revenue vs Expenses" subtitle="Weekly Breakdown" className="lg:col-span-2 h-[400px]" delay={0.1}>
                 <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={MONTHLY_DATA} barGap={8}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={rgba('#000', 0.05)} />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{fill: 'transparent'}} />
                         <Legend wrapperStyle={{paddingTop: '20px'}} />
                         <Bar dataKey="revenue" fill="#10B981" radius={[4,4,0,0]} barSize={15} name="Revenue" animationDuration={1500} />
                         <Bar dataKey="expenses" fill="#EF4444" radius={[4,4,0,0]} barSize={15} name="Expenses" animationDuration={1500} />
                     </BarChart>
                 </ResponsiveContainer>
            </ReportCard>

            <ReportCard title="Revenue Distribution" subtitle="By Service Type" className="h-[400px]" delay={0.2}>
                 <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                         <Pie
                            data={PIE_DATA_1}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {PIE_DATA_1.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                         </Pie>
                         <Tooltip />
                         <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                 </ResponsiveContainer>
            </ReportCard>
        </div>
    </div>
);
}

export const YearlyReportsPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
            <span>/</span> 
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/reports/daily')}>Reports</span> 
            <span>/</span> 
            <span className="text-gray-800 font-medium">Yearly</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center min-h-[400px] text-center p-10 bg-white rounded-2xl border border-gray-100 shadow-sm md:text-left">
            <div>
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6"
                 >
                     <MdBarChart size={40} />
                 </motion.div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Annual Year Review</h2>
                 <p className="text-gray-500 max-w-md">Detailed yearly reports including YoY Growth, Seasonal Trends, and Long-term Forecasting are generated at the end of financial year.</p>
                 <button className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">Generate Legacy Report</button>
            </div>
            <div className="hidden md:flex justify-center">
                 <img src="https://cdn-icons-png.flaticon.com/512/2875/2875333.png" alt="Analytics" className="w-64 opacity-80" />
            </div>
        </div>
    </div>
);
}


