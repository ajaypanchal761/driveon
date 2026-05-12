import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeadphones, FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EmployeeSupportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans selection:bg-blue-100 flex flex-col">
      {/* HEADER */}
      <div className="bg-[#1C205C] pt-12 pb-16 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center justify-between">
            <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
                <FiArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white tracking-wide">Employee Support</h1>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                <FiHeadphones size={20} />
            </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 -mt-8 z-10 space-y-6 flex-1 pb-10 max-w-3xl mx-auto w-full">
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6"
        >
            <div className="text-center pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#1C205C]">How can we help?</h2>
                <p className="text-gray-500 text-sm mt-1">Contact HR or IT support for any issues</p>
            </div>

            <div className="space-y-4">
                <SupportCard 
                    title="IT Support" 
                    desc="App issues, login problems, technical bugs"
                    icon={<FiMessageCircle size={24} className="text-blue-500" />}
                    action="Email IT"
                    link="mailto:it.support@driveon.com"
                />
                
                <SupportCard 
                    title="HR Department" 
                    desc="Payroll, attendance, policies, or general queries"
                    icon={<FiMail size={24} className="text-green-500" />}
                    action="Email HR"
                    link="mailto:hr@driveon.com"
                />

                <SupportCard 
                    title="Emergency Helpline" 
                    desc="For urgent safety or on-field emergency assistance"
                    icon={<FiPhone size={24} className="text-red-500" />}
                    action="Call Now"
                    link="tel:+18000000000"
                />
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                    Expected response time for IT/HR emails is 24-48 hours. <br/> For urgent matters, please use the phone line.
                </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

const SupportCard = ({ title, desc, icon, action, link }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            {icon}
        </div>
        <div className="ml-4 flex-1">
            <h3 className="font-bold text-[#1C205C]">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
        <a 
            href={link}
            className="ml-2 px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors"
        >
            {action}
        </a>
    </div>
);

export default EmployeeSupportPage;
