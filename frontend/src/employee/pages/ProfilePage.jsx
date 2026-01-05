import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiAward, FiChevronRight, FiBriefcase, FiDollarSign, FiFileText, FiBell, FiShield, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const ProfilePage = () => {
  const navigate = useNavigate();

  const user = {
    name: "Payal Sharma",
    role: "Sales Executive",
    id: "EMP-2023-045",
    shift: "10:00 AM - 07:00 PM",
    phone: "+91 98765 43210",
    email: "payal.sharma@driveon.com",
    location: "Mumbai, India",
    joiningDate: "12 Aug, 2023",
    avatar: "https://ui-avatars.com/api/?name=Payal+Sharma&background=1C205C&color=fff&size=128"
  };

  const performance = {
    score: 85,
    rank: "Top 10%",
    conversions: 12,
    rating: 4.8
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100">
      
      <div className="sticky top-0 z-30 bg-[#F5F7FA]">
        {/* HEADER & PROFILE CARD */}
        <div className="bg-[#1C205C] pt-6 pb-24 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

            <HeaderTopBar title="My Profile" />

            <div className="flex flex-col items-center mt-4 text-white">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl overflow-hidden p-1 bg-white/10 backdrop-blur-sm">
                        <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-[#1C205C] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-3 tracking-wide">{user.name}</h2>
                <p className="text-blue-200 text-sm font-medium">{user.role} • {user.id}</p>
            </div>
        </div>

        {/* OVERLAPPING STATS CARD */}
        <div className="px-6 -mt-16 relative z-10">
            <div className="bg-white rounded-2xl p-4 shadow-xl shadow-blue-900/10 border border-white grid grid-cols-3 divide-x divide-gray-100">
                <div className="text-center px-2">
                    <p className="text-2xl font-black text-[#1C205C]">{performance.score}%</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Target Score</p>
                </div>
                <div className="text-center px-2">
                    <p className="text-2xl font-black text-emerald-600">{performance.rating}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Avg Rating</p>
                </div>
                <div className="text-center px-2">
                     <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 mb-1">
                        <FiAward />
                     </div>
                     <p className="text-[10px] uppercase font-bold text-gray-400">Hustler</p>
                </div>
            </div>
        </div>
      </div>

      {/* MENU LIST */}
      <div className="px-5 mt-6 space-y-3">
          {/* PERSONAL INFO SECTION */}
          <SectionTitle title="Personal Information" />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
               <InfoRow icon={<FiPhone size={16}/>} label="Phone" value={user.phone} />
               <InfoRow icon={<FiMail size={16}/>} label="Email" value={user.email} />
               <InfoRow icon={<FiBriefcase size={16}/>} label="Shift" value={user.shift} />
               <InfoRow icon={<FiMapPin size={16}/>} label="Location" value={user.location} />
          </div>

          {/* APP SETTINGS */}
          <SectionTitle title="App & Settings" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <MenuRow 
                 icon={<FiDollarSign />} 
                 label="Salary & Payouts" 
                 color="text-emerald-600" 
                 bg="bg-emerald-50" 
                 onClick={() => navigate('/employee/salary')}
               />
               <MenuRow 
                 icon={<FiFileText />} 
                 label="Expense Claims" 
                 color="text-blue-600" 
                 bg="bg-blue-50" 
                 onClick={() => navigate('/employee/expenses')}
               />
               <MenuRow 
                 icon={<FiShield />} 
                 label="Privacy & Security" 
                 color="text-purple-600" 
                 bg="bg-purple-50" 
                 onClick={() => navigate('/employee/privacy')}
               />
               <MenuRow 
                 icon={<FiBell />} 
                 label="Notifications" 
                 color="text-amber-600" 
                 bg="bg-amber-50" 
                 hasBadge 
                 badgeCount={3} 
                 onClick={() => navigate('/employee/notifications')}
               />
          </div>

          <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
              <FiLogOut /> Logout
          </button>
          
          <p className="text-center text-xs text-gray-300 font-medium mt-4 mb-2">v1.2.0 • Employee App</p>
      </div>

      <BottomNav />
    </div>
  );
};

const SectionTitle = ({ title }) => (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1">{title}</h3>
);

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            {icon}
        </div>
        <div className="flex-1 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
            <p className="text-sm font-bold text-[#1C205C]">{value}</p>
        </div>
    </div>
);

const MenuRow = ({ icon, label, color, bg, hasBadge, badgeCount, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                {icon}
            </div>
            <span className="font-bold text-[#1C205C]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {hasBadge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badgeCount}</span>}
            <FiChevronRight className="text-gray-300" />
        </div>
    </button>
);

export default ProfilePage;
