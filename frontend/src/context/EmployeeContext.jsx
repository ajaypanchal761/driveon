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

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('emp_clocked_in', clockedIn);
    if (startTime) {
      localStorage.setItem('emp_start_time', startTime.toString());
    } else {
      localStorage.removeItem('emp_start_time');
    }
  }, [clockedIn, startTime]);

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
      setStartTime(null);
      setElapsedSeconds(0);
    } else {
      // Clock In
      setClockedIn(true);
      setStartTime(Date.now());
      setElapsedSeconds(0);
    }
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <EmployeeContext.Provider value={{
      clockedIn,
      startTime,
      elapsedSeconds,
      handleClockToggle,
      formatDuration
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
