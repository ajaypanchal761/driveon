import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiShield, FiEye, FiEyeOff, FiSmartphone, FiGlobe, FiFileText } from 'react-icons/fi';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const PrivacySecurityPage = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-[#1C205C] pt-6 pb-20 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
          <HeaderTopBar title="Privacy & Security" />
      </div>

      {/* CONTENT */}
      <div className="px-6 -mt-8 z-10 space-y-6 flex-1">
          
          {/* PASSWORD CHANGE */}
          <SectionContainer title="Change Password" icon={<FiLock />}>
              <div className="space-y-4">
                  <PasswordInput 
                    label="Current Password" 
                    placeholder="Enter current password" 
                    show={showCurrentPassword} 
                    onToggle={() => setShowCurrentPassword(!showCurrentPassword)} 
                  />
                  <PasswordInput 
                    label="New Password" 
                    placeholder="Enter new password" 
                    show={showNewPassword} 
                    onToggle={() => setShowNewPassword(!showNewPassword)} 
                  />
                  <button className="w-full bg-[#1C205C] text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20 active:scale-[0.98]">
                      Update Password
                  </button>
              </div>
          </SectionContainer>

          {/* APP SECURITY */}
          <SectionContainer title="App Security" icon={<FiShield />}>
              <div className="space-y-1">
                  <ToggleRow 
                     label="Biometric Login" 
                     description="Use fingerprint or face ID to log in" 
                     active={biometricEnabled} 
                     onToggle={() => setBiometricEnabled(!biometricEnabled)}
                     icon={<FiSmartphone />}
                  />
                  <div className="border-t border-gray-50 my-2"></div>
                  <ToggleRow 
                     label="Location Access" 
                     description="Allow app to access your location" 
                     active={locationAccess} 
                     onToggle={() => setLocationAccess(!locationAccess)}
                     icon={<FiGlobe />}
                  />
              </div>
          </SectionContainer>

           {/* LEGAL */}
           <SectionContainer title="Legal & Compliance" icon={<FiFileText />}>
              <div className="space-y-2">
                  <LinkRow label="Privacy Policy" />
                  <LinkRow label="Terms of Service" />
                  <LinkRow label="Third-Party Licenses" />
              </div>
          </SectionContainer>

      </div>

      <BottomNav />
    </div>
  );
};

const SectionContainer = ({ title, icon, children }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100"
    >
        <div className="flex items-center gap-2 mb-4 text-[#1C205C]">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                {icon}
            </div>
            <h3 className="font-bold text-lg">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const PasswordInput = ({ label, placeholder, show, onToggle }) => (
    <div className="relative">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">{label}</label>
        <div className="relative group">
            <input 
              type={show ? "text" : "password"} 
              className="w-full bg-gray-50 text-[#1C205C] font-bold py-3.5 pl-4 pr-12 rounded-xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-gray-300 placeholder:font-medium"
              placeholder={placeholder}
            />
            <button 
              onClick={onToggle}
              className="absolute right-2 top-[55%] -translate-y-1/2 text-gray-400 hover:text-[#1C205C] p-2 rounded-lg hover:bg-white transition-all active:scale-95"
            >
                {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
        </div>
    </div>
);

const ToggleRow = ({ label, description, active, onToggle, icon }) => (
    <div className="flex items-center justify-between py-3.5 group">
        <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-[#1C205C]">
                {icon}
             </div>
             <div>
                 <h4 className="font-bold text-[#1C205C] text-sm tracking-tight">{label}</h4>
                 <p className="text-[10px] text-gray-400 font-semibold leading-tight">{description}</p>
             </div>
        </div>
        <button 
          onClick={onToggle}
          className="relative transition-all duration-300 flex-shrink-0 outline-none"
          style={{ 
            width: '56px', 
            height: '28px', 
            borderRadius: '999px',
            backgroundColor: active ? '#161f56' : '#e6e6e6',
            overflow: 'hidden'
          }}
        >
            <div 
              className="absolute top-[4px] left-[4px] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all duration-300"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: active ? 'white' : '#161f56',
                transform: active ? 'translateX(28px)' : 'translateX(0)'
              }}
            ></div>
        </button>
    </div>
);

const LinkRow = ({ label }) => (
    <button className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
        <span className="font-bold text-gray-600 text-sm group-hover:text-[#1C205C] transition-colors">{label}</span>
        <span className="text-gray-300 group-hover:text-blue-500 transition-colors">↗</span>
    </button>
);

export default PrivacySecurityPage;
