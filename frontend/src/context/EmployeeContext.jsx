import React, { createContext, useState, useContext, useEffect } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  // Initialize state from localStorage or default
  const [clockedIn, setClockedIn] = useState(() => {
    const saved = localStorage.getItem('emp_clocked_in');
    return saved === 'true';
  });

  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('emp_start_time');
    return saved ? parseInt(saved) : null;
  });

  const [accumulatedSeconds, setAccumulatedSeconds] = useState(() => {
    const saved = localStorage.getItem('emp_accumulated_seconds');
    return saved ? parseInt(saved) : 0;
  });

  const [attendanceStatus, setAttendanceStatus] = useState(() => {
    return localStorage.getItem('emp_attendance_status') || 'Absent';
  });

  const [attendanceDays, setAttendanceDays] = useState(() => {
    // Dynamic days in current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  });

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('emp_clocked_in', clockedIn);
    if (startTime) {
      localStorage.setItem('emp_start_time', startTime.toString());
    } else {
      localStorage.removeItem('emp_start_time');
    }
    localStorage.setItem('emp_accumulated_seconds', accumulatedSeconds.toString());
    localStorage.setItem('emp_attendance_status', attendanceStatus);
  }, [clockedIn, startTime, accumulatedSeconds, attendanceStatus, attendanceDays]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (clockedIn && startTime) {
      // Calculate initial elapsed time
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - startTime) / 1000));

      timer = setInterval(() => {
        const currentNow = Date.now();
        setElapsedSeconds(Math.floor((currentNow - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [clockedIn, startTime]);

  const handleClockToggle = () => {
    if (clockedIn) {
      // Clock Out
      setClockedIn(false);
      // Add current session time to accumulated total
      setAccumulatedSeconds(prev => prev + elapsedSeconds);
      setStartTime(null);
      setElapsedSeconds(0);
    } else {
      // Clock In
      setClockedIn(true);
      setStartTime(Date.now());
      setElapsedSeconds(0);

      // Update Status and Days if specifically starting a new day (simple logic: if status is Absent)
      if (attendanceStatus === 'Absent') {
        const now = new Date();
        const shiftStart = new Date();
        shiftStart.setHours(10, 0, 0, 0); // 10:00 AM

        if (now > shiftStart) {
          setAttendanceStatus('Late');
        } else {
          setAttendanceStatus('On Time');
        }
      }
    }
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTotalHours = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  };

  return (
    <EmployeeContext.Provider value={{
      clockedIn,
      startTime,
      elapsedSeconds,
      accumulatedSeconds,
      attendanceStatus,
      attendanceDays,
      handleClockToggle,
      formatDuration,
      formatTotalHours
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};
