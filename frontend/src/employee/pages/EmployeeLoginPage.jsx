import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiEye, FiEyeOff, FiSmartphone, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const EmployeeLoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    code: ''
  });
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, validation and auth would happen here
    navigate('/employee/dashboard');
  };

  const handleSendCode = () => {
    // Simulate sending code
    setIsCodeSent(true);
    // You could confirm sending with a toast here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Abstract Shapes (Subtle) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-50 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 p-8 md:p-10 relative z-10 border border-white/50 backdrop-blur-sm"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="inline-block"
          >
            {/* DriveOn Logo Placeholder - Using Text for now */}
            <h1 className="text-4xl font-black text-[#1C205C] tracking-tighter italic">
              Drive<span className="text-blue-500">On</span>
            </h1>
            <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mt-1">Employee Portal</p>
          </motion.div>
        </div>

        {/* Welcome Text */}
        <div className="mb-8 text-center">
             <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
             <p className="text-gray-400 text-sm mt-1">Please login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Username */}
          <div className="space-y-1">
             <div className="relative group">
                <FiUser className="absolute left-0 top-3.5 text-gray-400 group-focus-within:text-[#1C205C] transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="User Name"
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-200 focus:border-[#1C205C] outline-none transition-colors placeholder:text-gray-300 text-gray-700 font-medium"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
             </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
             <div className="relative group">
                <FiLock className="absolute left-0 top-3.5 text-gray-400 group-focus-within:text-[#1C205C] transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Password"
                  className="w-full pl-8 pr-12 py-3 bg-transparent border-b border-gray-200 focus:border-[#1C205C] outline-none transition-colors placeholder:text-gray-300 text-gray-700 font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                >
                   {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
             </div>
          </div>

          {/* Code Verification */}
          <div className="flex items-end gap-4 overflow-hidden">
             <div className="flex-1 relative group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Authentication Code</label>
                <input 
                   type="text" 
                   required
                   placeholder="Enter Code"
                   className="w-full py-2 bg-transparent border-b border-gray-200 focus:border-[#1C205C] outline-none transition-colors placeholder:text-gray-300 text-gray-700 font-medium tracking-widest"
                   value={formData.code}
                   onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
             </div>
             <button 
               type="button"
               onClick={handleSendCode}
               disabled={isCodeSent}
               className={`h-10 px-5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                 ${isCodeSent 
                   ? 'bg-green-50 text-green-600 border border-green-100' 
                   : 'bg-[#1C205C] text-white shadow-lg shadow-blue-900/30 hover:bg-blue-900 active:scale-95'
                 }
               `}
             >
                {isCodeSent ? 'Sent' : 'Send'}
             </button>
          </div>

          {/* Login Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#1C205C] text-white py-4 rounded-xl font-bold shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 transition-all flex items-center justify-center gap-2 group mt-8"
          >
            <span>LOGIN</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </form>
        
        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-8 font-medium">
           &copy; {new Date().getFullYear()} DriveOn Systems.
        </p>

      </motion.div>
    </div>
  );
};

export default EmployeeLoginPage;
