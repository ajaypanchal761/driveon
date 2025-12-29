import React, { useState } from 'react';
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

export const DailyReportsPage = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Daily Operations Report</h1>
                <p className="text-gray-500 text-sm">Real-time tracking for Today, {new Date().toLocaleDateString()}.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95">
                <MdDownload /> Export PDF
            </button>
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

export const MonthlyReportsPage = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div>
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

export const YearlyReportsPage = () => (
    <div className="space-y-6">
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

export const CarReportsPage = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Vehicle Analytics</h1>
                 <p className="text-gray-500 text-sm">Fleet performance benchmarking.</p>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Fleet Efficiency Radar" subtitle="Standard vs Premium Segment" className="h-[450px]" delay={0.1}>
                 <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={CAR_PERFORMANCE}>
                         <PolarGrid stroke={rgba('#000', 0.1)} />
                         <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
                         <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                         <Radar name="Standard Fleet" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                         <Radar name="Premium Fleet" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                         <Legend />
                         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                     </RadarChart>
                 </ResponsiveContainer>
            </ReportCard>

            <div className="space-y-6">
                <ReportCard title="Top Performing Cars" subtitle="By Revenue Generation">
                    <div className="space-y-4 overflow-y-auto max-h-[320px] custom-scrollbar pr-2">
                        {[1,2,3,4,5].map((i) => (
                             <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                 <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i===1 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>#{i}</span>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-gray-800">Toyota Innova Crysta</h4>
                                     <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                         <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${100 - (i*10)}%` }}></div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-bold text-indigo-600">₹ {4.5 - (i*0.5)}L</p>
                                     <p className="text-xs text-gray-400">Revenue</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                </ReportCard>
            </div>
        </div>
    </div>
);

export const StaffReportsPage = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Staff Performance Analytics</h1>
                 <p className="text-gray-500 text-sm">Productivity and efficiency metrics per employee.</p>
             </div>
             <button 
                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                style={{ backgroundColor: premiumColors.primary.DEFAULT }}
             >
                <MdDownload /> Export Report
             </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Productivity Leaders" subtitle="Tasks Completed vs Rating" className="h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart data={STAFF_DATA} layout="vertical">
                         <CartesianGrid stroke="#f5f5f5" />
                         <XAxis type="number" />
                         <YAxis dataKey="name" type="category" scale="band" />
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="tasks" barSize={20} fill={premiumColors.primary.DEFAULT} radius={[0, 4, 4, 0]} name="Tasks Completed" />
                         <Bar dataKey="attendance" barSize={20} fill="#10B981" radius={[0, 4, 4, 0]} name="Attendance %" />
                     </ComposedChart>
                 </ResponsiveContainer>
            </ReportCard>

            <div className="space-y-6">
                <ReportCard title="Employee Leaderboard" subtitle="Based on Customer Ratings">
                    <div className="space-y-4">
                        {STAFF_DATA.sort((a,b) => b.rating - a.rating).map((staff, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-gray-100">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${i===0 ? 'bg-yellow-400' : 'bg-gray-400'}`}>
                                         {i+1}
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-gray-800">{staff.name}</h4>
                                         <div className="flex text-yellow-500 text-xs">
                                             {'★'.repeat(Math.round(staff.rating))}
                                             <span className="text-gray-400 ml-1">({staff.rating})</span>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-xs font-bold text-gray-500">Tasks</div>
                                     <div className="text-lg font-bold" style={{ color: premiumColors.primary.DEFAULT }}>{staff.tasks}</div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </ReportCard>
            </div>
        </div>
    </div>
);

export const VendorReportsPage = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Vendor Analysis</h1>
                 <p className="text-gray-500 text-sm">Cost vs Quality assessment for external partners.</p>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Cost Breakdown" subtitle="Vendor Expenses" className="h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={VENDOR_DATA}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Bar dataKey="cost" fill={premiumColors.primary.DEFAULT} radius={[4, 4, 0, 0]} name="Total Cost (₹)" />
                     </BarChart>
                 </ResponsiveContainer>
            </ReportCard>

            <ReportCard title="Quality Scorecard" subtitle="Rating (5.0) vs Turnaround Time (Days)" className="h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart data={VENDOR_DATA}>
                         <CartesianGrid stroke="#f5f5f5" />
                         <XAxis dataKey="name" />
                         <YAxis yAxisId="left" domain={[0, 5]} />
                         <YAxis yAxisId="right" orientation="right" />
                         <Tooltip />
                         <Legend />
                         <Bar yAxisId="left" dataKey="quality" barSize={30} fill="#10B981" radius={[4, 4, 0, 0]} name="Quality Rating" />
                         <Line yAxisId="right" type="monotone" dataKey="turnaround" stroke="#F59E0B" strokeWidth={3} name="Turnaround Time" />
                     </ComposedChart>
                 </ResponsiveContainer>
            </ReportCard>
        </div>
    </div>
);

export const CustomReportsPage = () => {
    const [selectedMetric, setSelectedMetric] = useState('Revenue');
    const [selectedDim, setSelectedDim] = useState('Time (Monthly)');
    const [chartType, setChartType] = useState('Bar');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleRunQuery = () => {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            const data = generateMockData(selectedMetric, selectedDim);
            setChartData(data);
            setLoading(false);
        }, 600);
    };

    const generateMockData = (metric, dim) => {
        // Simple mock data generator based on dimension
        if (dim.includes('Daily')) {
            return [
                { name: 'Mon', value: Math.floor(Math.random() * 50000) + 10000 },
                { name: 'Tue', value: Math.floor(Math.random() * 50000) + 10000 },
                { name: 'Wed', value: Math.floor(Math.random() * 50000) + 10000 },
                { name: 'Thu', value: Math.floor(Math.random() * 50000) + 10000 },
                { name: 'Fri', value: Math.floor(Math.random() * 80000) + 20000 }, // High weekend
                { name: 'Sat', value: Math.floor(Math.random() * 90000) + 30000 },
                { name: 'Sun', value: Math.floor(Math.random() * 70000) + 20000 },
            ];
        } else if (dim.includes('Monthly')) {
            return [
                { name: 'Jan', value: Math.floor(Math.random() * 500000) + 100000 },
                { name: 'Feb', value: Math.floor(Math.random() * 500000) + 100000 },
                { name: 'Mar', value: Math.floor(Math.random() * 500000) + 100000 },
                { name: 'Apr', value: Math.floor(Math.random() * 500000) + 100000 },
                { name: 'May', value: Math.floor(Math.random() * 600000) + 100000 },
                { name: 'Jun', value: Math.floor(Math.random() * 600000) + 100000 },
            ];
        } else if (dim.includes('Vehicle')) {
            return [
                { name: 'Innova', value: Math.floor(Math.random() * 100000) + 20000 },
                { name: 'Swift', value: Math.floor(Math.random() * 50000) + 10000 },
                { name: 'Thar', value: Math.floor(Math.random() * 80000) + 15000 },
                { name: 'Creta', value: Math.floor(Math.random() * 70000) + 12000 },
                { name: 'Fortuner', value: Math.floor(Math.random() * 120000) + 30000 },
            ];
        } else {
             // Staff
             return [
                { name: 'Rajesh', value: Math.floor(Math.random() * 100) + 20 },
                { name: 'Vikram', value: Math.floor(Math.random() * 100) + 20 },
                { name: 'Priya', value: Math.floor(Math.random() * 100) + 20 },
                { name: 'Amit', value: Math.floor(Math.random() * 100) + 20 },
            ];
        }
    };

    const renderChart = () => {
        if (loading) return <div className="flex justify-center items-center h-full text-gray-400">Generatiing Report...</div>;
        if (chartData.length === 0) return <div className="flex justify-center items-center h-full text-gray-400">Select parameters and click "Run Query"</div>;

        const ChartComponent = chartType === 'Line' ? AreaChart : chartType === 'Area' ? AreaChart : BarChart;
        const DataComponent = chartType === 'Line' ? Line : chartType === 'Area' ? Area : Bar;

        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={chartData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={premiumColors.primary.DEFAULT} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={premiumColors.primary.DEFAULT} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={rgba('#000', 0.05)} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    {chartType === 'Line' ? (
                       <Line type="monotone" dataKey="value" stroke={premiumColors.primary.DEFAULT} strokeWidth={3} dot={{r:4}} activeDot={{r:6}} name={selectedMetric} />
                    ) : chartType === 'Area' ? (
                       <Area type="monotone" dataKey="value" stroke={premiumColors.primary.DEFAULT} fill="url(#colorValue)" name={selectedMetric} />
                    ) : (
                       <Bar dataKey="value" fill={premiumColors.primary.DEFAULT} radius={[4, 4, 0, 0]} name={selectedMetric} />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Custom Query Builder</h2>
                    <div className="flex gap-2">
                         {['Bar', 'Line', 'Area'].map(type => (
                             <button 
                                key={type}
                                onClick={() => setChartType(type)}
                                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${chartType === type ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                             >
                                 {type} Chart
                             </button>
                         ))}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                     <div className="md:col-span-1">
                         <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                             <MdShowChart /> Metric
                         </label>
                         <div className="relative">
                            <select 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer font-medium text-gray-700"
                                style={{ focusRingColor: rgba(premiumColors.primary.DEFAULT, 0.2) }}
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                            >
                                <option>Revenue</option>
                                <option>Bookings</option>
                                <option>Expenses</option>
                                <option>Net Profit</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <MdFilterList />
                            </div>
                         </div>
                     </div>
                     <div className="md:col-span-1">
                         <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                             <MdDateRange /> Dimension
                         </label>
                         <div className="relative">
                             <select 
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer font-medium text-gray-700"
                                 style={{ focusRingColor: rgba(premiumColors.primary.DEFAULT, 0.2) }}
                                 value={selectedDim}
                                 onChange={(e) => setSelectedDim(e.target.value)}
                             >
                                 <option>Time (Daily)</option>
                                 <option>Time (Monthly)</option>
                                 <option>By Vehicle</option>
                                 <option>By Staff</option>
                             </select>
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <MdFilterList />
                             </div>
                         </div>
                     </div>
                     <div className="md:col-span-2">
                         <button 
                            onClick={handleRunQuery}
                            disabled={loading}
                            className="w-full py-3 px-6 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ 
                                backgroundColor: premiumColors.primary.DEFAULT,
                                boxShadow: `0 10px 15px -3px ${rgba(premiumColors.primary.DEFAULT, 0.3)}`
                            }}
                         >
                             {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                             ) : (
                                <>
                                    <MdShowChart size={20} /> Run Analysis
                                </>
                             )}
                         </button>
                     </div>
                 </div>
            </div>

            <ReportCard title={`Report: ${selectedMetric} by ${selectedDim}`} className="h-[500px]">
                 {renderChart()}
            </ReportCard>
        </div>
    );
};

export const ComparisonReportsPage = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Period A</label>
                 <div className="flex items-center gap-2">
                     <MdDateRange className="text-gray-400" />
                     <span className="font-bold text-gray-800">Nov 2025</span>
                 </div>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Period B</label>
                 <div className="flex items-center gap-2">
                     <MdDateRange className="text-gray-400" />
                     <span className="font-bold text-gray-800">Dec 2025</span>
                 </div>
             </div>
        </div>

        <ReportCard title="Period Comparison" subtitle="Nov 2025 vs Dec 2025" className="h-[450px]">
             <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={COMPARISON_DATA} barGap={0}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="metric" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Bar dataKey="periodA" name="Nov 2025" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="periodB" name="Dec 2025" fill={premiumColors.primary.DEFAULT} radius={[4, 4, 0, 0]} />
                 </BarChart>
             </ResponsiveContainer>
        </ReportCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {COMPARISON_DATA.map((item, i) => {
                const growth = ((item.periodB - item.periodA) / item.periodA) * 100;
                return (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <p className="text-gray-500 text-xs uppercase font-bold">{item.metric}</p>
                        <h3 className="text-xl font-bold mt-1" style={{ color: growth >= 0 ? '#10B981' : '#EF4444' }}>
                           {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                        </h3>
                    </div>
                );
            })}
        </div>
    </div>
);
