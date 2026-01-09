import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiRefreshCw, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

import { useEmployee } from '../../context/EmployeeContext';

const AttendancePage = () => {
  const navigate = useNavigate();
  const { clockedIn, handleClockToggle, startTime } = useEmployee();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Use context state
  const isClockedIn = clockedIn;
  
  const [locationAddress, setLocationAddress] = useState('Location not detected');
  const [attendanceData] = useState([
    { date: new Date(2025, 11, 28), status: 'Present', checkIn: '09:30 AM', checkOut: '06:30 PM', hours: '9h 00m' },
    { date: new Date(2025, 11, 27), status: 'Present', checkIn: '09:35 AM', checkOut: '06:40 PM', hours: '9h 05m' },
    { date: new Date(2025, 11, 26), status: 'Late', checkIn: '10:15 AM', checkOut: '07:00 PM', hours: '8h 45m' },
    { date: new Date(2025, 11, 25), status: 'Absent', checkIn: '--:--', checkOut: '--:--', hours: '0h 0m' },
    { date: new Date(2025, 11, 24), status: 'Holiday', checkIn: '--:--', checkOut: '--:--', hours: '-' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchLocation = () => {
    setLocationAddress('Fetching location...');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            // Using OpenStreetMap Nominatim for free reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            // Get a shorter address format
            const address = data.address ? 
                `${data.address.road || ''}, ${data.address.suburb || data.address.city || ''}`.replace(/^, /, '') : 
                'Unknown Location';
            
            const fullAddress = data.display_name || address;
            setLocationAddress(address || `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);

            // Store for CRM
            const locationData = {
                employeeId: 'EMP001', // Mock ID
                name: 'Current User', 
                address: fullAddress, 
                coords: { lat: latitude, long: longitude },
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('emp_latest_location', JSON.stringify(locationData));

        } catch (e) {
            console.error("Location fetch error", e);
            const coordsStr = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
            setLocationAddress(coordsStr);
        }
      }, (error) => {
        console.error("Geolocation error", error);
        setLocationAddress('Location access denied');
      });
    } else {
      setLocationAddress('Geolocation not supported');
    }
  };

  const onClockAction = () => {
    if (!isClockedIn) {
        fetchLocation();
    }
    handleClockToggle();
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Month Statistics
  const stats = [
    { label: 'Present', value: 22, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Late', value: 3, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Absent', value: 2, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Leaves', value: 1, color: 'text-blue-500', bg: 'bg-blue-50' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100 flex flex-col">
      
      <div className="sticky top-0 z-30">
          {/* HEADER BACKGROUND - REDUCED HEIGHT */}
          <div className="bg-[#1C205C] h-64 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
            
            <div className="pt-6 px-4">
               <HeaderTopBar title="Attendance" />
               <div className="mt-2 text-center text-blue-100/80 text-sm">
                  Manage your daily work hours
               </div>
            </div>
          </div>

          {/* MAIN DASHBOARD CARD - OVERLAPPING HEADER */}
          <div className="px-6 -mt-24 z-10">
             <div className="bg-white rounded-3xl p-5 shadow-xl shadow-blue-900/10 border border-white flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Decorative Background inside card */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isClockedIn ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-blue-400 to-indigo-600'}`}></div>

                {/* Date & Time */}
                <div className="mt-2 mb-6">
                   <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">{formattedDate}</p>
                   <h2 className="text-5xl font-medium text-[#1C205C] tracking-tight">{formattedTime}</h2>
                   <div className="flex items-center justify-center gap-2 mt-2 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full w-fit mx-auto max-w-[90%]">
                      <FiMapPin size={12} className={isClockedIn ? "text-emerald-500" : "text-gray-400"} />
                      <span className="truncate max-w-[200px]">{isClockedIn ? locationAddress : "Ready to clock in"}</span>
                      {isClockedIn && <FiRefreshCw size={10} onClick={fetchLocation} className="ml-1 cursor-pointer hover:rotate-180 transition-all text-blue-400" />}
                   </div>
                </div>

                {/* ACTION BUTTON (SLIDER STYLE) */}
                <motion.button 
                   whileTap={{ scale: 0.98 }}
                   onClick={onClockAction}
                   className={`
                     w-full py-3 rounded-xl flex items-center justify-between px-2 relative overflow-hidden transition-all duration-300 group
                     ${isClockedIn 
                       ? 'bg-rose-50 border border-rose-100' 
                       : 'bg-[#1C205C] shadow-lg shadow-blue-900/30'}
                   `}
                >
                   {/* Background Progress Fill (Visual Only) */}
                   <div className={`absolute inset-0 opacity-10 ${isClockedIn ? 'bg-rose-500' : 'bg-white'}`}></div>

                   {/* Icon Container */}
                   <div className={`
                      h-10 w-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300
                      ${isClockedIn ? 'bg-rose-500 text-white translate-x-[240px]' : 'bg-white/10 text-white translate-x-0'}
                   `}>
                      {isClockedIn ? <FiClock /> : <FiArrowRight />}
                   </div>

                   {/* Label */}
                   <span className={`absolute left-0 right-0 text-center font-bold text-sm pointer-events-none transition-colors duration-300
                      ${isClockedIn ? 'text-rose-600' : 'text-white'}
                   `}>
                      {isClockedIn ? 'Tap to Clock Out' : 'Swipe to Clock In'}
                   </span>
                </motion.button>
                
                {/* Status Footer */}
                <div className="mt-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                       {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
                    </span>
                </div>
             </div>
          </div>
      </div>

      {/* STATS GRID */}
      <div className="px-6 mt-6">
         <div className="grid grid-cols-2 gap-3">
             {stats.map((stat, idx) => (
                <div key={idx} className={`${stat.bg} p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-black/5 transition-all`}>
                    <div>
                       <p className={`text-xs font-bold uppercase ${stat.color} opacity-70`}>{stat.label}</p>
                       <p className={`text-2xl font-black ${stat.color} mt-0.5`}>{stat.value}</p>
                    </div>
                    {idx === 0 && <FiCheckCircle className="text-emerald-200" size={24} />}
                </div>
             ))}
         </div>
      </div>

      <div className="px-6 mt-8 flex-1">
          <div className="flex justify-between items-center mb-5">
              <h3 className="text-[#1C205C] font-bold text-lg">Activity Log</h3>
              <span className="text-xs font-medium text-gray-400">This Month</span>
          </div>

          <div className="space-y-3">
              {attendanceData.map((record, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index}
                    className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between"
                  >
                      <div className="flex items-center gap-4">
                          <div className={`
                             w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold border
                             ${record.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                               record.status === 'Absent' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                               record.status === 'Late' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-gray-50 text-gray-400 border-gray-100'}
                          `}>
                              <span className="text-xs uppercase">{record.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                              <span className="text-lg leading-none">{record.date.getDate()}</span>
                          </div>
                          
                          <div>
                              <p className="text-[#1C205C] font-bold text-sm mb-0.5">{record.status}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                  <span className="flex items-center gap-1"><FiClock size={10}/> {record.checkIn} - {record.checkOut}</span>
                              </div>
                          </div>
                      </div>

                      <div className="text-right">
                          <span className="block text-sm font-bold text-gray-700">{record.hours}</span>
                          <span className="block text-[10px] text-gray-400 font-medium">Hrs</span>
                      </div>
                  </motion.div>
              ))}
          </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AttendancePage;
