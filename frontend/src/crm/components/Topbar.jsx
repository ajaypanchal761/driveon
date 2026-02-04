import React, { useState, useEffect, useRef } from 'react';
import { MdMenu, MdNotifications, MdSearch, MdDoneAll, MdInfo, MdWarning, MdError, MdCheckCircle } from 'react-icons/md';
import { premiumColors } from '../../theme/colors';
import { notificationService } from '../../services/notification.service';
import { onMessageListener } from '../../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar = ({ toggleSidebar }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
    const setupNotificationListener = async () => {
      try {
        const payload = await onMessageListener();
        if (payload) {
          fetchNotifications();
        }
      } catch (err) {
        console.error('Notification listener error:', err);
      }
    };

    setupNotificationListener();

    // Click outside handler
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <MdWarning className="text-amber-500" />;
      case 'alert': return <MdError className="text-red-500" />;
      case 'success': return <MdCheckCircle className="text-emerald-500" />;
      default: return <MdInfo className="text-blue-500" />;
    }
  };

  return (
    <header
      className="bg-white/80 backdrop-blur-md sticky top-0 z-20 h-16 border-b border-gray-200 px-4 flex items-center justify-between shadow-sm md:ml-64 transition-all duration-300"
      style={{ borderColor: premiumColors.border.light }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 md:hidden"
        >
          <MdMenu size={24} />
        </button>

        {/* Search Bar - Hidden on small mobile */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 lg:w-96 focus-within:ring-2 ring-blue-500/20 transition-all">
          <MdSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search bookings, cars, staff..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-full hover:bg-gray-100 relative text-gray-600 transition-colors group"
          >
            <MdNotifications size={22} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left"
              >
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wider"
                    >
                      <MdDoneAll size={14} /> Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="shrink-0 mt-0.5 text-lg">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold text-gray-900 truncate ${notif.isRead ? 'font-medium' : ''}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MdNotifications className="text-gray-300 text-2xl" />
                      </div>
                      <p className="text-xs text-gray-400 font-bold">No notifications yet</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-50 bg-gray-50/30 text-center">
                    <button className="text-[10px] font-bold text-gray-500 hover:text-gray-700 uppercase tracking-widest">
                      View All History
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Display */}
        <div className="hidden sm:block text-right mr-2">
          <p className="text-xs text-gray-500 font-medium tracking-tight">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
