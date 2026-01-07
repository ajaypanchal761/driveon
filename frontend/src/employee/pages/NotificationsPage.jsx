import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiInfo, FiAlertCircle, FiClock, FiCheckCircle } from 'react-icons/fi';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: "Meeting Reminder", message: "Team standup meeting in 15 minutes.", time: "10:45 AM", read: false },
    { id: 2, type: 'success', title: "Claim Approved", message: "Your fuel expense claim of ₹2,500 has been approved.", time: "09:30 AM", read: false },
    { id: 3, type: 'info', title: "New Policy Update", message: "Please review the updated leave policy in the documents section.", time: "Yesterday", read: true },
    { id: 4, type: 'warning', title: "Pending Task", message: "You have 3 follow-ups pending for today.", time: "Yesterday", read: true },
    { id: 5, type: 'info', title: "System Maintenance", message: "The CRM will be down for maintenance on Sunday from 2 AM to 4 AM.", time: "2 days ago", read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <FiClock className="text-amber-600" />;
      case 'success': return <FiCheckCircle className="text-emerald-600" />;
      case 'warning': return <FiAlertCircle className="text-rose-600" />;
      case 'info': default: return <FiInfo className="text-blue-600" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'alert': return 'bg-amber-100';
      case 'success': return 'bg-emerald-100';
      case 'warning': return 'bg-rose-100';
      case 'info': default: return 'bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-[#1C205C] pt-6 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
          <HeaderTopBar title="Notifications" />
          
          <div className="mt-6 flex justify-between items-end text-white">
             <div>
                <h2 className="text-2xl font-bold">Inbox</h2>
                <p className="text-blue-200 text-sm">You have {notifications.filter(n => !n.read).length} unread messages</p>
             </div>
             <button onClick={markAllAsRead} className="text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-1">
                <FiCheck /> Mark all read
             </button>
          </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="px-5 -mt-8 z-10 space-y-3 flex-1">
          {notifications.map((notif, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={notif.id} 
                className={`p-4 rounded-2xl shadow-sm border flex gap-4 transition-all ${notif.read ? 'bg-white border-gray-100 opacity-80' : 'bg-white border-blue-100 shadow-md ring-1 ring-blue-50'}`}
              >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}>
                      {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold text-sm ${notif.read ? 'text-gray-700' : 'text-[#1C205C]'}`}>{notif.title}</h4>
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                  </div>
                  {!notif.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  )}
              </motion.div>
          ))}
          
          {notifications.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <FiBell size={48} className="text-gray-300 mb-4"/>
                <p className="text-gray-500 font-bold">No notifications</p>
             </div>
          )}
      </div>

      <BottomNav />
    </div>
  );
};

export default NotificationsPage;
