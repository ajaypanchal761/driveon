import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiUsers, FiCheckSquare, FiUser, FiBell, FiMenu, 
  FiClock, FiActivity, FiPhone, FiTarget, FiBriefcase, FiArrowRight,
  FiCalendar, FiFileText, FiPieChart
} from 'react-icons/fi';
import { BiTask, BiTimeFive } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';
import BottomNav from '../components/BottomNav';

// Theme Colors
const THEME_COLOR = "#1C205C";
// Using the reference image style: deep blue header with curve
const GRADIENT_HEADER = "linear-gradient(135deg, #1C205C 0%, #0f1642 100%)";

const EmployeeHomePage = () => {
  const navigate = useNavigate();
  const [clockedIn, setClockedIn] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  // Dummy Data
  const employeeData = {
    name: "Payal",
    role: "Sales Executive",
    shift: "10:00 AM - 07:00 PM",
    todayHours: "06h 42m",
    status: "On Time",
    targets: {
      calls: { current: 12, total: 20, percent: 60 },
      followUps: { current: 5, total: 8, percent: 62 },
      conversions: { current: 1, total: 2, percent: 50 },
      score: 68
    },
    quickStats: [
      { id: 1, label: "Enquiries", value: "4", icon: <FaUserFriends size={20} />, color: "text-green-600", bg: "bg-green-100" },
      { id: 2, label: "Pending", value: "5", icon: <BiTask size={20} />, color: "text-blue-600", bg: "bg-blue-100" },
      { id: 3, label: "Closed", value: "1", icon: <FiBell size={20} />, color: "text-orange-500", bg: "bg-orange-100" },
    ],
    teamPresence: {
        present: 12,
        absent: 4,
        leave: 2,
        total: 18
    },
    projects: [
      { id: 1, title: "Calls Target", subtitle: "Daily Goal", status: "Ongoing", color: "bg-blue-50", iconColor: "text-blue-600" },
      { id: 2, title: "Follow-ups", subtitle: "High Priority", status: "In Process", color: "bg-indigo-50", iconColor: "text-indigo-600" },
    ],
    upcomingTasks: [
      { id: 1, title: "Candidate Management", subtitle: "For - Zoho Project", progress: 88, due: "June 6, 2022" },
    ]
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100"
    >
      
      <div className="sticky top-0 z-30">
          {/* HEADER SECTION - Curved & Clean */}
          <motion.div 
            variants={itemVariants}
            className="text-white pt-10 pb-24 rounded-b-[40px] relative overflow-hidden shadow-xl"
            style={{ background: GRADIENT_HEADER }}
          >
            <div className="px-6 relative z-10 flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-blue-100 text-sm font-medium mb-1 tracking-wide">Good Morning,</span>
                <h1 className="text-3xl font-bold tracking-tight">{employeeData.name}</h1>
                <div className="flex items-center gap-2 mt-2 opacity-80 text-xs font-light">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">{employeeData.role}</span>
                  <span>•</span>
                  <span>{employeeData.shift}</span>
                </div>
              </div>
              <div className="flex gap-3">
                 <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => navigate('/employee/notifications')}
                   className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all shadow-lg shadow-blue-900/20 relative"
                 >
                  <FiBell className="text-xl" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1C205C]"></span>
                </motion.button>
              </div>
            </div>

            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>
          </motion.div>

          {/* OVERLOGGING CARD - "Working Time" Style */}
          <div className="px-6 -mt-16 relative z-40">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-white"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Working Time</p>
                  <div className="flex items-baseline gap-1">
                     <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                      {formatTime(time).split(' ')[0]}
                      <span className="text-lg text-gray-400 font-medium ml-1">{formatTime(time).split(' ')[1]}</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-xs text-gray-400 font-medium"> <FiBriefcase className="inline mr-1"/> Kuwaiti Mosque Rd </span>
                  </div>
                </div>
                {/* Clock Out Button - Prominent */}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setClockedIn(!clockedIn)}
                  className={`${clockedIn ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} 
                    text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2`}
                >
                  <FiClock />
                  {clockedIn ? 'Check Out' : 'Check In'}
                </motion.button>
              </div>
              
              {/* Stats Row within Card */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                 <div className="text-center">
                   <span className="block text-xl font-bold text-gray-800">{employeeData.todayHours}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">Total Hours</span>
                 </div>
                 <div className="text-center border-l border-gray-100">
                   <span className="block text-xl font-bold text-green-500">{employeeData.status}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">Status</span>
                 </div>
                 <div className="text-center border-l border-gray-100">
                   <span className="block text-xl font-bold text-blue-500">28</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase">Days</span>
                 </div>
              </div>
            </motion.div>
          </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        
        {/* QUICK REQUESTS - Circular Icons (Ref Image 2) */}
        <motion.div variants={itemVariants}>
          <h3 className="text-gray-800 font-bold text-lg mb-4">Quick Overview</h3>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {employeeData.quickStats.map((stat) => (
              <motion.div 
                whileTap={{ scale: 0.95 }}
                key={stat.id} 
                onClick={() => {
                   let tab = 'All';
                   if (stat.label === 'Pending') tab = 'Pending';
                   if (stat.label === 'Closed') tab = 'Closed';
                   navigate('/employee/enquiries', { state: { activeTab: tab } });
                }}
                className="bg-white p-3 rounded-2xl w-28 flex-shrink-0 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-center">
                   <span className="block font-bold text-gray-800">{stat.label}</span>
                   <span className={`text-xs font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TEAM PRESENCE SECTION (ADDED) */}
        <motion.div variants={itemVariants}>
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-bold text-lg">Team Presence</h3>
            <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
               {employeeData.teamPresence.total} Total Staff
            </span>
           </div>
           
           <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex -space-x-3">
                      {[1,2,3,4].map((i) => (
                          <div key={i} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br ${i === 4 ? 'from-gray-700 to-gray-900 z-0' : 'from-blue-400 to-blue-600 z-10'}`}>
                             {i === 4 ? '+8' : `U${i}`}
                          </div>
                      ))}
                  </div>
                  <button onClick={() => navigate('/employee/directory')} className="text-xs font-bold text-[#1C205C] flex items-center gap-1 hover:underline">
                      View Directory <FiArrowRight />
                  </button>
               </div>

               <div className="grid grid-cols-3 gap-2">
                   <div className="bg-emerald-50 rounded-xl p-3 text-center">
                       <span className="block text-xl font-black text-emerald-600">{employeeData.teamPresence.present}</span>
                       <span className="text-[10px] font-bold text-emerald-400 uppercase">Present</span>
                   </div>
                   <div className="bg-rose-50 rounded-xl p-3 text-center">
                       <span className="block text-xl font-black text-rose-500">{employeeData.teamPresence.absent}</span>
                       <span className="text-[10px] font-bold text-rose-400 uppercase">Absent</span>
                   </div>
                   <div className="bg-amber-50 rounded-xl p-3 text-center">
                       <span className="block text-xl font-black text-amber-500">{employeeData.teamPresence.leave}</span>
                       <span className="text-[10px] font-bold text-amber-400 uppercase">On Leave</span>
                   </div>
               </div>
           </div>
        </motion.div>

        {/* PROJECTS / TARGETS - Card Grid (Ref Image 1) */}
        <motion.div variants={itemVariants}>
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-bold text-lg">Your Targets</h3>
            <span className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-full">Score: {employeeData.targets.score}%</span>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              {/* Custom Target Cards */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/employee/tasks')}
                className="bg-blue-50 p-4 rounded-3xl relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                  <div className="absolute top-0 right-0 p-4 opacity-50"><FiPhone className="text-blue-200 text-6xl transform rotate-12 -mr-4 -mt-4" /></div>
                  <p className="text-gray-500 text-xs font-semibold mb-1">Calls Target</p>
                  <h4 className="text-gray-800 font-bold text-lg mb-6">Daily Goal</h4>
                  <div className="flex justify-between items-end">
                     <div>
                       <span className="text-blue-600 font-bold text-2xl">{employeeData.targets.calls.current}</span>
                       <span className="text-gray-400 text-xs"> /{employeeData.targets.calls.total}</span>
                     </div>
                     <span className="bg-white/60 p-2 rounded-full text-blue-600"><FiArrowRight /></span>
                  </div>
              </motion.div>

              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/employee/enquiries', { state: { activeTab: 'Pending' } })}
                className="bg-indigo-50 p-4 rounded-3xl relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                  <div className="absolute top-0 right-0 p-4 opacity-50"><FiActivity className="text-indigo-200 text-6xl transform rotate-12 -mr-4 -mt-4" /></div>
                  <p className="text-gray-500 text-xs font-semibold mb-1">Follow-ups</p>
                  <h4 className="text-gray-800 font-bold text-lg mb-6">High Priority</h4>
                   <div className="flex justify-between items-end">
                     <div>
                       <span className="text-indigo-600 font-bold text-2xl">{employeeData.targets.followUps.current}</span>
                       <span className="text-gray-400 text-xs"> /{employeeData.targets.followUps.total}</span>
                     </div>
                     <span className="bg-white/60 p-2 rounded-full text-indigo-600"><FiArrowRight /></span>
                  </div>
              </motion.div>
           </div>
        </motion.div>

        {/* ONGOING TASK - Large Card (Ref Image 1/2) */}
        <motion.div variants={itemVariants}>
           <h3 className="text-gray-800 font-bold text-lg mb-4">Ongoing Priority</h3>
           <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <div className="w-1.5 h-10 bg-blue-600 rounded-full absolute left-6"></div> {/* Left accent */}
                <span className="text-xs font-bold text-blue-600 uppercase mb-1 block pl-3">High Priority Task</span>
                <h4 className="font-bold text-gray-800 text-base mb-1 pl-3">Call vendor about Swift</h4>
                <div className="flex items-center gap-3 pl-3 mt-3">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-[#1C205C] text-white flex items-center justify-center text-xs font-bold border-2 border-white">+3</div>
                   </div>
                   <div className="text-xs text-gray-400">
                     <span className="block">Due Date</span>
                     <span className="text-gray-600 font-semibold">Today, 5 PM</span>
                   </div>
                </div>
              </div>
              
              {/* Simple Circular Progress Area */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                 <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray="75, 100" // 75%
                    />
                 </svg>
                 <span className="absolute text-xs font-bold text-blue-600">75%</span>
              </div>
           </div>
        </motion.div>

      </div>

      <BottomNav />
    </motion.div>
  );
};

export default EmployeeHomePage;
