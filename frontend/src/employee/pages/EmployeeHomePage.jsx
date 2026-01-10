import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isToday, parseISO, format } from 'date-fns';
import {
  FiHome, FiUsers, FiCheckSquare, FiUser, FiBell, FiMenu,
  FiClock, FiActivity, FiPhone, FiTarget, FiBriefcase, FiArrowRight,
  FiCalendar, FiFileText, FiPieChart, FiMapPin
} from 'react-icons/fi';
import { BiTask, BiTimeFive } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';
import BottomNav from '../components/BottomNav';
import api from '../../services/api';

// Theme Colors
const THEME_COLOR = "#1C205C";
// Using the reference image style: deep blue header with curve
const GRADIENT_HEADER = "linear-gradient(135deg, #1C205C 0%, #0f1642 100%)";

import { useEmployee } from '../../context/EmployeeContext';

import { getCurrentPosition, getAddressFromCoordinates, watchPosition, clearWatch, updateUserLocation } from '../../services/location.service';

const EmployeeHomePage = () => {
  const navigate = useNavigate();
  const {
    clockedIn,
    elapsedSeconds,
    handleClockToggle,
    formatDuration,
    accumulatedSeconds,
    attendanceStatus,
    attendanceDays,
    formatTotalHours
  } = useEmployee();
  const [time, setTime] = useState(new Date());

  // Live Location State
  const [locationState, setLocationState] = useState({
    lat: null,
    lng: null,
    address: "Fetching Live Location..."
  });

  const [quickStatsCounts, setQuickStatsCounts] = useState({ enquiries: 0, pending: 0, closed: 0 });
  const [teamPresenceData, setTeamPresenceData] = useState({
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    activeStaff: []
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Location Tracking
  useEffect(() => {
    let watchId;
    let lastLat = 0;
    let lastLng = 0;

    const handlePositionSuccess = async (position) => {
      const { latitude, longitude } = position.coords;

      // Only reverse geocode if moved significantly (approx 10-20 meters) to save API calls
      // 0.0002 degrees is roughly 20 meters
      const dist = Math.sqrt(Math.pow(latitude - lastLat, 2) + Math.pow(longitude - lastLng, 2));

      if (dist > 0.0002 || lastLat === 0) {
        lastLat = latitude;
        lastLng = longitude;

        // Update state with coords immediately
        setLocationState(prev => ({
          ...prev,
          lat: latitude,
          lng: longitude
        }));

        // Fetch new address
        const address = await getAddressFromCoordinates(latitude, longitude);
        setLocationState(prev => ({
          lat: latitude,
          lng: longitude,
          address: address || "Address Unavailable"
        }));

        // Send to Backend to update DB
        await updateUserLocation(latitude, longitude, address);
      } else {
        // Just update coords if small movement
        setLocationState(prev => ({ ...prev, lat: latitude, lng: longitude }));
      }
    };

    const handlePositionError = (error) => {
      console.error("Location watch error:", error);
      setLocationState(prev => ({
        ...prev,
        address: "Location access denied or unavailable."
      }));
    };

    // Start watching position
    watchId = watchPosition(handlePositionSuccess, handlePositionError);

    return () => {
      if (watchId !== null) clearWatch(watchId);
    };
  }, []);

  // Fetch Enquiry Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/crm/enquiries');
        if (response.data.success) {
          const allEnquiries = response.data.data.enquiries;
          const total = allEnquiries.length;
          const pending = allEnquiries.filter(e => e.status === 'Pending').length;
          const closed = allEnquiries.filter(e => e.status === 'Closed').length;

          setQuickStatsCounts({ enquiries: total, pending, closed });
        }
      } catch (error) {
        console.error('Error fetching enquiry stats:', error);
      }
    };
    fetchStats();
    fetchTeamPresence(); // Fetch team presence
  }, []);

  const fetchTeamPresence = async () => {
    try {
      const response = await api.get('/crm/team-presence');
      if (response.data.success) {
        setTeamPresenceData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching team presence:', error);
    }
  };

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

  const { user } = useSelector(state => state.user);
  const [targetsData, setTargetsData] = useState({
    daily: { total: 0, current: 0 },
    highPriority: { total: 0, current: 0 },
    score: 0
  });
  const [ongoingTask, setOngoingTask] = useState(null);

  // Fetch Tasks for Targets
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || (!user._id && !user.id)) return;
      try {
        const userId = user._id || user.id;
        const response = await api.get(`/crm/staff-tasks?assignedTo=${userId}`);
        if (response.data.success) {
          const tasks = response.data.data.tasks;

          // Daily Goals (Tasks due today)
          const dailyTasks = tasks.filter(t => isToday(parseISO(t.dueDate)));
          const dailyTotal = dailyTasks.length;
          const dailyCompleted = dailyTasks.filter(t => t.status === 'Done').length;

          // High Priority (Tasks with priority High) - Active or Completed Recently
          // For targets, usually we track all current active + completed recently.
          // Let's count ALL High priority tasks assigned to this user that are due Today or Future (or just all valid tasks)
          const highPriorityTasks = tasks.filter(t => t.priority === 'High');
          const highTotal = highPriorityTasks.length;
          const highCompleted = highPriorityTasks.filter(t => t.status === 'Done').length;

          // Score Calculation (Simple avg of completion rates)
          let score = 0;
          if (dailyTotal > 0 || highTotal > 0) {
            const dailyRate = dailyTotal > 0 ? (dailyCompleted / dailyTotal) : 0;
            const highRate = highTotal > 0 ? (highCompleted / highTotal) : 0;
            // If both exist, avg them. If only one, use that.
            if (dailyTotal > 0 && highTotal > 0) score = ((dailyRate + highRate) / 2) * 100;
            else if (dailyTotal > 0) score = dailyRate * 100;
            else score = highRate * 100;
          }

          setTargetsData({
            daily: { total: dailyTotal, current: dailyCompleted },
            highPriority: { total: highTotal, current: highCompleted },
            score: Math.round(score)
          });

          // Determine Ongoing Priority Task
          const pendingTasks = tasks.filter(t => t.status !== 'Done');
          const priorityWeights = { Critical: 3, High: 2, Medium: 1, Low: 0 };

          // Sort by Priority Desc, then Due Date Asc
          pendingTasks.sort((a, b) => {
            const pA = priorityWeights[a.priority] || 0;
            const pB = priorityWeights[b.priority] || 0;
            if (pB !== pA) return pB - pA; // Higher priority first
            return new Date(a.dueDate) - new Date(b.dueDate); // Earlier due date first
          });

          if (pendingTasks.length > 0) {
            setOngoingTask(pendingTasks[0]);
          } else {
            setOngoingTask(null);
          }
        }
      } catch (error) {
        console.error('Error fetching tasks for targets:', error);
      }
    };
    fetchTasks();
  }, [user]);

  // Dummy Data with dynamic overrides
  const employeeData = {
    name: user?.name || "", // Removed static "Employee"
    role: user?.role || "",
    shift: user?.department ? `${user.department} Dept` : "", // Removed default shift if no dept
    todayHours: "06h 42m",
    status: "On Time",
    targets: {
      calls: { current: targetsData.daily.current, total: targetsData.daily.total, percent: 0 },
      followUps: { current: targetsData.highPriority.current, total: targetsData.highPriority.total, percent: 0 },
      conversions: { current: 1, total: 2, percent: 50 },
      score: targetsData.score
    },
    quickStats: [
      { id: 1, label: "Enquiries", value: quickStatsCounts.enquiries, icon: <FaUserFriends size={20} />, color: "text-green-600", bg: "bg-green-100" },
      { id: 2, label: "Pending", value: quickStatsCounts.pending, icon: <BiTask size={20} />, color: "text-blue-600", bg: "bg-blue-100" },
      { id: 3, label: "Closed", value: quickStatsCounts.closed, icon: <FiBell size={20} />, color: "text-orange-500", bg: "bg-orange-100" },
    ],
    // Remove hardcoded teamPresence, we now use teamPresenceData state
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
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Time</p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    {formatTime(time).split(' ')[0]}
                    <span className="text-sm text-gray-400 font-medium ml-1">{formatTime(time).split(' ')[1]}</span>
                  </h2>
                </div>

                {/* Timer Display */}
                <div className="mt-2 px-3 py-1.5 bg-blue-50/80 rounded-lg border border-blue-100 w-fit">
                  <p className="text-blue-500 text-[9px] font-bold uppercase tracking-wider mb-0 leading-none">Session Timer</p>
                  <div className="text-lg font-mono font-bold text-blue-700 flex items-center gap-1.5 mt-0.5 leading-none">
                    <FiActivity className={`${clockedIn ? 'animate-pulse' : ''}`} size={14} />
                    {formatDuration(elapsedSeconds)}
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-3">
                  <FiMapPin className="text-blue-500 mt-1 shrink-0" size={14} />
                  <div>
                    <p className="text-xs text-gray-600 font-bold leading-relaxed">{locationState.address}</p>
                  </div>
                </div>
              </div>

              {/* Clock Out Button - Prominent */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClockToggle}
                className={`${clockedIn ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} 
                    text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 h-fit`}
              >
                <FiClock />
                {clockedIn ? 'Check Out' : 'Check In'}
              </motion.button>
            </div>

            {/* Stats Row within Card */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <span className="block text-xl font-bold text-gray-800">
                  {formatTotalHours(accumulatedSeconds + (clockedIn ? elapsedSeconds : 0))}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Hours</span>
              </div>
              <div className="text-center border-l border-gray-100">
                <span className={`block text-xl font-bold ${attendanceStatus === 'Late' ? 'text-red-500' : 'text-green-500'}`}>
                  {attendanceStatus}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Status</span>
              </div>
              <div className="text-center border-l border-gray-100">
                <span className="block text-xl font-bold text-blue-500">{attendanceDays}</span>
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
              {teamPresenceData.total} Total Staff
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex -space-x-3">
                {teamPresenceData.activeStaff && teamPresenceData.activeStaff.length > 0 ? (
                  teamPresenceData.activeStaff.slice(0, 4).map((staff, i) => (
                    <div key={staff.id} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br ${i % 2 === 0 ? 'from-blue-400 to-blue-600' : 'from-indigo-400 to-indigo-600'} z-${10 - i} relative`}>
                      {staff.avatar ? <img src={staff.avatar} alt={staff.name} className="w-full h-full rounded-full object-cover" /> : staff.shortName}
                    </div>
                  ))
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-gray-400 bg-gray-100">
                    --
                  </div>
                )}
                {/* Count Badge */}
                {teamPresenceData.activeStaff && teamPresenceData.activeStaff.length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm bg-gradient-to-br from-gray-700 to-gray-900 z-0 relative">
                    +{teamPresenceData.activeStaff.length - 4}
                  </div>
                )}
              </div>
              <button onClick={() => navigate('/employee/directory')} className="text-xs font-bold text-[#1C205C] flex items-center gap-1 hover:underline">
                View Directory <FiArrowRight />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <span className="block text-xl font-black text-emerald-600">{teamPresenceData.present}</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Present</span>
              </div>
              <div className="bg-rose-50 rounded-xl p-3 text-center">
                <span className="block text-xl font-black text-rose-500">{teamPresenceData.absent}</span>
                <span className="text-[10px] font-bold text-rose-400 uppercase">Absent</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <span className="block text-xl font-black text-amber-500">{teamPresenceData.leave}</span>
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
              <div className="absolute top-0 right-0 p-4 opacity-50"><FiPhone className="text-blue-200 text-6xl transform rotate-12 -mr-4 -mt-4" /></div>
              <p className="text-gray-500 text-xs font-semibold mb-1">Tasks Target</p>
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
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between min-h-[140px]">
            {ongoingTask ? (
              <>
                <div>
                  <div className={`w-1.5 h-10 rounded-full absolute left-6 ${ongoingTask.priority === 'High' ? 'bg-red-500' : 'bg-blue-600'}`}></div> {/* Left accent */}
                  <span className={`text-xs font-bold uppercase mb-1 block pl-3 ${ongoingTask.priority === 'High' ? 'text-red-500' : 'text-blue-600'}`}>{ongoingTask.priority} Priority Task</span>
                  <h4 className="font-bold text-gray-800 text-base mb-1 pl-3 line-clamp-2">{ongoingTask.title}</h4>
                  <div className="flex items-center gap-3 pl-3 mt-3">
                    <div className="flex -space-x-2">
                      {/* Reuse team avatars for decoration if available, else static placeholders */}
                      {teamPresenceData.activeStaff && teamPresenceData.activeStaff.slice(0, 3).map((staff, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm bg-gradient-to-br from-indigo-400 to-purple-600 overflow-hidden">
                          {staff.avatar ? <img src={staff.avatar} className="w-full h-full object-cover" /> : staff.shortName}
                        </div>
                      ))}
                      {(!teamPresenceData.activeStaff || teamPresenceData.activeStaff.length === 0) && (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                          <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                        </>
                      )}
                      <div className="w-8 h-8 rounded-full bg-[#1C205C] text-white flex items-center justify-center text-xs font-bold border-2 border-white">+3</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="block">Due Date</span>
                      <span className="text-gray-600 font-semibold">
                        {format(new Date(ongoingTask.dueDate), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simple Circular Progress Area - Static 60% for "Ongoing" visuals or random? Keeping static to avoid complexity with no real subtasks */}
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0 ml-2">
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
                      stroke={ongoingTask.priority === 'High' ? "#EF4444" : "#4F46E5"}
                      strokeWidth="3"
                      strokeDasharray="60, 100" // Static 60% representing "Ongoing"
                    />
                  </svg>
                  <span className={`absolute text-xs font-bold ${ongoingTask.priority === 'High' ? 'text-red-500' : 'text-blue-600'}`}>60%</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full text-center py-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <FiCheckSquare size={24} />
                </div>
                <h4 className="font-bold text-gray-800">All Caught Up!</h4>
                <p className="text-xs text-gray-500">No pending priority tasks assigned.</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      <BottomNav />
    </motion.div>
  );
};

export default EmployeeHomePage;
