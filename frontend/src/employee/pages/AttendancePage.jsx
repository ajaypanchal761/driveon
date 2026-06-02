import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiRefreshCw, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';
import api from '../../services/api';

import { useEmployee } from '../../context/EmployeeContext';
import { getAddressFromCoordinates, watchPosition, clearWatch, getCurrentPosition } from '../../services/location.service';

const AttendancePage = () => {
  const navigate = useNavigate();
  const { clockedIn, handleClockToggle, startTime } = useEmployee();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use context state
  const isClockedIn = clockedIn;

  const [locationAddress, setLocationAddress] = useState('Fetching Live Location...');

  // Real DB attendance and stats states
  const { user } = useSelector((state) => state.user);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Present', value: 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Late', value: 0, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Absent', value: 0, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Leaves', value: 0, color: 'text-blue-500', bg: 'bg-blue-50' }
  ]);

  // Segment states for Telecaller (Enquiries + Team Attendance names)
  const userRole = user?.role || '';
  const isTelecaller = userRole.toLowerCase() === 'telecaller' || userRole.toLowerCase() === 'tellecaller';
  const [activeSegment, setActiveSegment] = useState('my'); // 'my' or 'team'

  // Team Presence List States
  const [teamList, setTeamList] = useState([]);
  const [teamCounts, setTeamCounts] = useState({ present: 0, absent: 0, leave: 0, total: 0 });
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('All');

  const fetchTeamData = async () => {
    try {
      setTeamLoading(true);
      const response = await api.get('/crm/team-presence');
      if (response.data.success) {
        const { activeStaff, present, absent, leave, total } = response.data.data;
        setTeamList(activeStaff || []);
        setTeamCounts({ present, absent, leave, total });
      }
    } catch (error) {
      console.error('Error fetching team presence:', error);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    if (activeSegment === 'team') {
      fetchTeamData();
    }
  }, [activeSegment]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        setLoading(true);
        const response = await api.get(`/crm/attendance?staffId=${userId}`);
        if (response.data.success) {
          const records = response.data.data.records || [];

          // Parse records into list format
          const formatted = records.map(r => ({
            date: new Date(r.date),
            status: r.status || 'Present',
            checkIn: r.inTime || '--:--',
            checkOut: r.outTime || '--:--',
            hours: r.workHours || '-'
          }));

          setAttendanceData(formatted);

          // Calculate statistics for the current month
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const currentMonthRecords = formatted.filter(r =>
            r.date.getMonth() === currentMonth &&
            r.date.getFullYear() === currentYear
          );

          const presentCount = currentMonthRecords.filter(r => r.status === 'Present').length;
          const lateCount = currentMonthRecords.filter(r => r.status === 'Late').length;
          const absentCount = currentMonthRecords.filter(r => r.status === 'Absent').length;
          const leavesCount = currentMonthRecords.filter(r => r.status === 'Leave' || r.status === 'Leaves').length;

          setStats([
            { label: 'Present', value: presentCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Late', value: lateCount, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Absent', value: absentCount, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Leaves', value: leavesCount, color: 'text-blue-500', bg: 'bg-blue-50' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching real attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, clockedIn]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Location Tracking
  useEffect(() => {
    let watchId = null;
    let lastLat = 0;
    let lastLng = 0;

    // Check if location access is enabled in settings
    const isLocationEnabled = localStorage.getItem('location_access_enabled') !== 'false';

    if (!isLocationEnabled) {
      setLocationAddress('Location access disabled in settings');
      return;
    }

    const handlePositionSuccess = async (position) => {
      const { latitude, longitude } = position.coords;

      // Only reverse geocode if moved significantly (approx 20 meters)
      const dist = Math.sqrt(Math.pow(latitude - lastLat, 2) + Math.pow(longitude - lastLng, 2));

      if (dist > 0.0002 || lastLat === 0) {
        lastLat = latitude;
        lastLng = longitude;

        // Fetch new address using shared service
        const address = await getAddressFromCoordinates(latitude, longitude);
        setLocationAddress(address || "Address Unavailable");

        // Update local storage for other components if needed
        const locationData = {
          employeeId: 'EMP001',
          name: 'Current User',
          address: address || "Address Unavailable",
          coords: { lat: latitude, long: longitude },
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('emp_latest_location', JSON.stringify(locationData));
      }
    };

    const handlePositionError = (error) => {
      console.error("Location watch error:", error);
      setLocationAddress('Location access denied');
    };

    // Start watching position
    watchId = watchPosition(handlePositionSuccess, handlePositionError);

    return () => {
      if (watchId !== null) clearWatch(watchId);
    };
  }, []);

  const fetchLocation = async () => {
    // Check if location access is enabled in settings
    const isLocationEnabled = localStorage.getItem('location_access_enabled') !== 'false';
    if (!isLocationEnabled) {
      setLocationAddress('Location access disabled in settings');
      return;
    }

    try {
      setLocationAddress('Updating location...');
      const position = await getCurrentPosition();
      const address = await getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
      setLocationAddress(address || "Address Unavailable");
    } catch (error) {
      console.error("Error manual refreshing location:", error);
      setLocationAddress('Location access denied');
    }
  };

  const onClockAction = () => {
    handleClockToggle();
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Filtered team list
  const filteredTeamList = teamList.filter(staff => {
    const searchLower = teamSearch.trim().toLowerCase();
    const matchesSearch = (staff.name || '').toLowerCase().includes(searchLower) ||
        (staff.role || '').toLowerCase().includes(searchLower);
    const matchesFilter = teamFilter === 'All' || staff.status === teamFilter;
    return matchesSearch && matchesFilter;
  });

  const getTeamStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Absent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Leave': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F5F7FA] font-sans selection:bg-blue-100">
      <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
        <div className="relative z-30">
          {/* HEADER BACKGROUND */}
          <div className="bg-[#1C205C] pb-8 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <div className="pt-6 px-4">
              <HeaderTopBar title="Attendance" />
              <div className="mt-2 text-center text-blue-100/80 text-sm font-semibold">
                {activeSegment === 'my' ? 'Manage your daily work hours' : 'Colleague presence directory'}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Segment Toggle for Telecallers */}
        {isTelecaller && (
          <div className="px-6 mt-6 flex gap-2">
            <button
              onClick={() => setActiveSegment('my')}
              className={`flex-1 py-3 rounded-xl text-xs font-black shadow-sm transition-all border ${activeSegment === 'my' ? 'bg-[#1C205C] text-white border-[#1C205C]' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
            >
              My Attendance
            </button>
            <button
              onClick={() => setActiveSegment('team')}
              className={`flex-1 py-3 rounded-xl text-xs font-black shadow-sm transition-all border ${activeSegment === 'team' ? 'bg-[#1C205C] text-white border-[#1C205C]' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
            >
              Team Attendance
            </button>
          </div>
        )}

        {activeSegment === 'my' ? (
          <>
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
                <h3 className="text-[#1C205C] font-bold text-sm">Activity Log</h3>
                <span className="text-xs font-medium text-gray-400">This Month</span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center p-8 bg-white rounded-xl border border-gray-100">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1C205C]"></div>
                  </div>
                ) : attendanceData.length === 0 ? (
                  <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 font-semibold text-sm">
                    No attendance logs found for this period.
                  </div>
                ) : (
                  attendanceData.map((record, index) => (
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
                              record.status === 'Late' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                record.status === 'Leave' || record.status === 'Leaves' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}
                                `}>
                          <span className="text-xs uppercase">{record.date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="text-lg leading-none">{record.date.getDate()}</span>
                        </div>

                        <div>
                          <p className="text-[#1C205C] font-bold text-sm mb-0.5">{record.status === 'Late' ? 'Present (Late)' : record.status}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1"><FiClock size={10} /> {record.checkIn} - {record.checkOut}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* TEAM ATTENDANCE / STAFF DIRECTORY SYSTEM */
          <div className="px-6 mt-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all font-semibold text-xs shadow-sm"
                placeholder="Search colleague by name or role..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {['All', 'Present', 'Absent', 'Leave'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTeamFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-sm border transition-all ${teamFilter === filter ? 'bg-[#1C205C] text-white border-[#1C205C]' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Presence Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between gap-3">
              <div className="flex-1 bg-emerald-50 rounded-xl py-2.5 text-center border border-emerald-100/30">
                <span className="block text-lg font-black text-emerald-600">{teamCounts.present}</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Present</span>
              </div>
              <div className="flex-1 bg-rose-50 rounded-xl py-2.5 text-center border border-rose-100/30">
                <span className="block text-lg font-black text-rose-500">{teamCounts.absent}</span>
                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Absent</span>
              </div>
              <div className="flex-1 bg-amber-50 rounded-xl py-2.5 text-center border border-amber-100/30">
                <span className="block text-lg font-black text-amber-500">{teamCounts.leave}</span>
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">On Leave</span>
              </div>
            </div>

            {/* Colleague Presence List */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-800 font-bold text-xs">Staff List ({filteredTeamList.length})</h3>
                <button onClick={fetchTeamData} className="text-purple-600 hover:text-purple-800 text-[10px] font-black uppercase tracking-wider">Refresh</button>
              </div>

              {teamLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1C205C]"></div>
                </div>
              ) : filteredTeamList.length > 0 ? (
                filteredTeamList.map((staff, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    key={staff.id || staff._id || idx}
                    className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-[#1C205C] border border-purple-100 flex items-center justify-center font-black text-xs">
                        {staff.avatar ? (
                          <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          staff.name ? staff.name.charAt(0).toUpperCase() : 'S'
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1C205C] text-xs">{staff.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{staff.role}</p>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black border mt-1 ${getTeamStatusColor(staff.status)}`}>
                          {staff.status === 'Present' && '● Present'}
                          {staff.status === 'Absent' && '○ Absent'}
                          {staff.status === 'Leave' && '◐ On Leave'}
                        </span>
                      </div>
                    </div>
                    {staff.phone && (
                      <a href={`tel:${staff.phone}`} className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 font-semibold text-xs">
                  No staff members found matching search filter.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default AttendancePage;
