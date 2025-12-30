import React from 'react';
import { motion } from 'framer-motion';
import { 
  MdWarning, 
  MdPersonAdd, 
  MdAttachMoney, 
  MdEventAvailable, 
  MdBuild, 
  MdAssignment,
  MdBarChart,
  MdDownload,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { premiumColors } from '../../theme/colors';
import { rgba } from 'polished';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const DashboardPage = () => {
  const navigate = useNavigate();

  // Mock Data for Charts
  const REVENUE_DATA = [
    { name: 'Jan', revenue: 4000, expenses: 2400 },
    { name: 'Feb', revenue: 3000, expenses: 1398 },
    { name: 'Mar', revenue: 2000, expenses: 9800 },
    { name: 'Apr', revenue: 2780, expenses: 3908 },
    { name: 'May', revenue: 1890, expenses: 4800 },
    { name: 'Jun', revenue: 2390, expenses: 3800 },
    { name: 'Jul', revenue: 3490, expenses: 4300 },
  ];

  const FLEET_DISTRIBUTION = [
    { name: 'Hatchback', value: 35 },
    { name: 'Sedan', value: 25 },
    { name: 'SUV', value: 30 },
    { name: 'Luxury', value: 10 },
  ];

  const COLORS = ['#1C205C', '#4F46E5', '#818CF8', '#C7D2FE'];

  // Local Mock Data for Dashboard Counters
  const DASHBOARD_STATS = {
    totalLeads: 24,
    bookings: 8,
    activeRepairs: 3,
    salaryPending: 3,
    insuranceExpiring: 2,
    vendorPending: 1,
    carIdle: 4,
    garagePending: 2,
    activeAccidents: 2,
    todayFollowUps: 3
  };

  const RECENT_ENQUIRIES = [
    { id: 1, name: "Rahul Kumar", action: "Inquired for Innova Crysta", time: "2m ago", img: "https://randomuser.me/api/portraits/men/32.jpg", type: "New" },
    { id: 2, name: "Priya Sharma", action: "Booked Maruti Swift", time: "15m ago", img: "https://randomuser.me/api/portraits/women/44.jpg", type: "Booking" },
    { id: 3, name: "Amit Singh", action: "Requested Call Back", time: "1h ago", img: "https://randomuser.me/api/portraits/men/86.jpg", type: "Lead" }
  ];

  // 1. Action Alerts Data (Mapped to Real Pages)
  const actionAlerts = [
    { 
      id: 1, 
      title: "Salary Pending", 
      count: DASHBOARD_STATS.salaryPending, 
      description: "Staff members awaiting payment",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      path: "/crm/staff/salary" 
    },
    { 
      id: 2, 
      title: "Insurance Expiring", 
      count: DASHBOARD_STATS.insuranceExpiring, 
      description: "Renew before 5th Jan",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      path: "/crm/cars/documents" 
    },
    { 
      id: 3, 
      title: "Vendor Payment Due", 
      count: DASHBOARD_STATS.vendorPending, 
      description: "Rs. 15,000 pending for Garage A",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
      path: "/crm/vendors/payments" 
    },
    { 
      id: 4, 
      title: "Active Accidents", 
      count: DASHBOARD_STATS.activeAccidents, 
      description: "2 cases in recovery tracking",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      path: "/crm/cars/accidents/active" 
    },
    { 
      id: 5, 
      title: "Car Idle > 5 Days", 
      count: DASHBOARD_STATS.carIdle, 
      description: "Assign them to new bookings",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      path: "/crm/cars/idle" 
    },
    { 
      id: 6, 
      title: "Garage Bill Pending", 
      count: DASHBOARD_STATS.garagePending, 
      description: "Check Active Repairs",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      path: "/crm/garage/active" 
    },
  ];

  // 2. Quick Actions Data (Functional)
  const quickActions = [
    { label: "New Enquiry", icon: <MdPersonAdd />, action: () => navigate('/crm/enquiries/new') },
    { label: "Add Expense", icon: <MdAttachMoney />, action: () => navigate('/crm/finance/expenses') },
    { label: "Attendance", icon: <MdEventAvailable />, action: () => navigate('/crm/staff/attendance') },
    { label: "Vendor Pay", icon: <MdAttachMoney />, action: () => navigate('/crm/vendors/payments') },
    { label: "Active Repairs", icon: <MdBuild />, action: () => navigate('/crm/garage/active') },
    { label: "Report Accident", icon: <MdWarning />, action: () => navigate('/crm/cars/accidents/add') },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: premiumColors.primary.DEFAULT }}>
             Smart Command Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here is what needs your attention today.
          </p>
        </div>
        <div className="flex gap-3">
            <div className="text-right cursor-pointer" onClick={() => navigate('/crm/enquiries/all')}>
                <span className="block text-2xl font-bold text-gray-800">{DASHBOARD_STATS.totalLeads}</span>
                <span className="text-xs text-gray-500 uppercase font-semibold">Leads</span>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-right cursor-pointer" onClick={() => navigate('/crm/bookings/active')}>
                <span className="block text-2xl font-bold text-gray-800">{DASHBOARD_STATS.bookings}</span>
                <span className="text-xs text-gray-500 uppercase font-semibold">Bookings</span>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="text-right cursor-pointer" onClick={() => navigate('/crm/garage/active')}>
                <span className="block text-2xl font-bold text-orange-600">{DASHBOARD_STATS.activeRepairs}</span>
                <span className="text-xs text-gray-500 uppercase font-semibold">Repairs</span>
            </div>
        </div>
      </div>

      {/* 1. Action Alerts Grid */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MdWarning className="text-amber-500" /> Action Required
        </h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {actionAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(alert.path)}
              className={`p-5 rounded-2xl border ${alert.borderColor} ${alert.bgColor} cursor-pointer shadow-sm hover:shadow-md transition-all relative overflow-hidden`}
            >
               <div className="flex justify-between items-start z-10 relative">
                  <div>
                      <h3 className={`font-bold text-lg ${alert.color}`}>{alert.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{alert.description}</p>
                  </div>
                  <div className={`text-2xl font-extrabold opacity-20 ${alert.color}`}>
                     {alert.count}
                  </div>
               </div>
               
               {/* Make it look "urgent" if count is high */}
               {alert.count > 0 && (
                   <div className={`absolute bottom-4 right-4 text-xs font-bold px-2 py-1 rounded-lg bg-white/50 border border-white/50 ${alert.color}`}>
                       {alert.count} Pending
                   </div>
               )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 2. Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <motion.div 
           className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
           variants={containerVariants}
           initial="hidden"
           animate="show"
        >
           {quickActions.map((action, idx) => (
             <motion.button
               key={idx}
               variants={itemVariants}
               initial="initial"
               whileHover="hover"
               whileTap="tap"
               onClick={action.action}
               className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
               style={{ borderColor: 'transparent' }}
             >
                <motion.div 
                    variants={{
                        initial: { 
                            backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), 
                            color: premiumColors.primary.DEFAULT 
                        },
                        hover: { 
                            backgroundColor: premiumColors.primary.DEFAULT, 
                            color: "#ffffff" 
                        }
                    }}
                    transition={{ duration: 0.2 }}
                    className="p-3 rounded-full mb-3"
                >
                   <span className="text-2xl">{action.icon}</span>
                </motion.div>
                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
             </motion.button>
           ))}
        </motion.div>
      </section>

      {/* 3. Performance Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer"
            onClick={() => navigate('/crm/finance/profit-loss')}
          >
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                         <MdBarChart size={24} />
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-gray-800">Business Analytics</h3>
                          <p className="text-xs text-gray-400">Real-time revenue & expense tracking</p>
                      </div>
                  </div>
                  {/* Export Report Button Removed */}
              </div>

              <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                      <div className="w-3 h-3 rounded-full bg-indigo-600"></div> Revenue
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div> Expenses
                  </div>
              </div>

              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={premiumColors.primary.DEFAULT} stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor={premiumColors.primary.DEFAULT} stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8' }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke={premiumColors.primary.DEFAULT} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRev)" 
                            animationDuration={2000}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="expenses" 
                            stroke="#f87171" 
                            strokeWidth={3}
                            fillOpacity={0}
                            strokeDasharray="5 5"
                            animationDuration={2000}
                          />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col cursor-pointer"
            onClick={() => navigate('/crm/cars/all')}
          >
              <h3 className="text-lg font-bold text-gray-800 mb-2">Fleet Popularity</h3>
              <p className="text-xs text-gray-400 mb-6">Booking distribution by car type</p>
              
              <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="h-64 w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={FLEET_DISTRIBUTION}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                  animationDuration={1500}
                              >
                                  {FLEET_DISTRIBUTION.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip />
                          </PieChart>
                      </ResponsiveContainer>
                      {/* Center Text for Donut */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-gray-800">1.2K</span>
                          <span className="text-[10px] uppercase font-bold text-gray-400">Bookings</span>
                      </div>
                  </div>
                  
                  <div className="w-full space-y-3 mt-6">
                      {FLEET_DISTRIBUTION.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                  <span className="text-xs font-semibold text-gray-600">{item.name}</span>
                              </div>
                              <span className="text-xs font-bold text-gray-800">{item.value}%</span>
                          </div>
                      ))}
                  </div>
              </div>
          </motion.div>
      </section>

      {/* 4. Recent Activity & Garage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Enquiries</h3>
            <div className="space-y-4">
               {RECENT_ENQUIRIES.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => navigate('/crm/enquiries/all')}>
                     <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                     <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.action} • {item.time}</p>
                     </div>
                     <span 
                        className="ml-auto text-xs font-semibold px-2 py-1 rounded"
                        style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), color: premiumColors.primary.DEFAULT }}
                     >
                        {item.type === 'New' ? 'New Lead' : item.type}
                     </span>
                  </div>
               ))}
               <button 
                  onClick={() => navigate('/crm/enquiries/all')}
                  className="w-full py-2 text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors mt-2"
               >
                  View All Enquiries
               </button>
            </div>
         </div>
         
         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Garage Status</h3>
             <div className="space-y-4 cursor-pointer" onClick={() => navigate('/crm/garage/active')}>
               <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Repairs</span>
                  <span className="font-bold text-gray-800">3 Cars</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
               </div>
               <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Est. Cost: Rs. 12,000</p>
                  <button className="text-xs font-semibold hover:underline" style={{ color: premiumColors.primary.DEFAULT }} onClick={(e) => { e.stopPropagation(); navigate('/crm/garage/active'); }}>View Details</button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default DashboardPage;
