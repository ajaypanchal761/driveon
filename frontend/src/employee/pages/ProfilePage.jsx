import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiAward, FiChevronRight, FiBriefcase, FiDollarSign, FiFileText, FiBell, FiShield, FiPhone, FiMail, FiMapPin, FiAlertTriangle, FiHeadphones, FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { logoutUser } from '../../store/slices/authSlice';
import { useEmployee } from '../../context/EmployeeContext';
import { updateUser } from '../../store/slices/userSlice';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { unreadCount } = useEmployee();
    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarClick = () => {
        if (!isUploading) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size too large. Maximum size is 5MB.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        setIsUploading(true);
        const loadingToast = toast.loading('Uploading profile photo...');
        try {
            const response = await api.post('/auth/staff-upload-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success('Profile photo updated successfully', { id: loadingToast });
                dispatch(updateUser(response.data.data.user));
            }
        } catch (error) {
            console.error('Upload photo error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload photo', { id: loadingToast });
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/employee/login');
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const response = await api.delete('/auth/staff-profile');
            if (response.data.success) {
                toast.success('Account deleted successfully');
                await dispatch(logoutUser());
                navigate('/employee/login');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const { user: userData } = useSelector(state => state.user);
    const { isInitializing } = useSelector(state => state.auth);

    const user = {
        name: userData?.name || "",
        role: userData?.role || "",
        id: userData?.employeeId || "",
        phone: userData?.phone || "",
        email: userData?.email || "",
        avatar: userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=1C205C&color=fff&size=128`,
        joinDate: userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString() : ""
    };

    useEffect(() => {
        // No extra fetching needed for now
    }, [userData]);

    if (isInitializing || !userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4 border-[#1C205C]"></div>
                <p className="text-[#1C205C] font-medium">Loading profile...</p>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F5F7FA] font-sans selection:bg-blue-100">
            <div className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
                <div className="sticky top-0 z-30">
                    {/* PREMIUM HEADER SECTION */}
                    <div className="bg-gradient-to-br from-[#1C205C] via-[#242976] to-[#1a1d4f] pt-6 pb-12 px-6 rounded-b-[48px] shadow-2xl relative overflow-hidden z-0">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-400/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

                        <HeaderTopBar title="My Profile" showBack={false} />

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="flex flex-col items-center mt-6 text-white"
                        >
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                <div className="w-28 h-28 rounded-full border-[4px] border-white/20 shadow-2xl overflow-hidden p-1.5 bg-white/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 relative">
                                    {isUploading ? (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-full">
                                            <FiCamera className="text-white" size={24} />
                                        </div>
                                    )}
                                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-white text-[#1C205C] w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                                    <FiCamera size={14} className="stroke-[2.5]" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-black mt-4 tracking-tight drop-shadow-md">{user.name}</h2>
                            <div className="flex items-center gap-2 mt-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                                <FiBriefcase className="text-blue-300" size={14} />
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">{user.role} • {user.id}</p>
                            </div>
                        </motion.div>
                    </div>


                </div>

                {/* MENU LIST */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="px-5 mt-8 space-y-8"
                >
                    {/* PERSONAL INFO SECTION */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <SectionTitle title="Personal Information" />
                        <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 overflow-hidden">
                            <InfoRow icon={<FiPhone size={18} />} label="Phone Number" value={user.phone} />
                            <InfoRow icon={<FiMail size={18} />} label="Email Address" value={user.email} isLast />
                        </div>
                    </motion.div>

                    {/* APP SETTINGS */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <SectionTitle title="App & Settings" />
                        <div className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 overflow-hidden">
                            <MenuRow
                                icon={<FiShield size={20} />}
                                label="Privacy & Security"
                                color="text-indigo-600"
                                bg="bg-indigo-50"
                                onClick={() => navigate('/employee/privacy')}
                            />
                            <MenuRow
                                icon={<FiBell size={20} />}
                                label="Notifications"
                                color="text-amber-600"
                                bg="bg-amber-50"
                                hasBadge={unreadCount > 0}
                                badgeCount={unreadCount}
                                onClick={() => navigate('/employee/notifications')}
                            />
                            <MenuRow
                                icon={<FiHeadphones size={20} />}
                                label="Support"
                                color="text-teal-600"
                                bg="bg-teal-50"
                                onClick={() => navigate('/employee/support')}
                                isLast
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-2 space-y-3">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-50/80 text-red-600 font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-red-100 transition-all active:scale-[0.98]"
                        >
                            <FiLogOut size={20} /> Logout
                        </button>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full bg-transparent text-gray-400 font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-[0.98]"
                        >
                            <FiAlertTriangle size={18} /> Delete Account
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center pb-8">
                        <p className="text-[11px] text-gray-400 font-bold tracking-widest uppercase">DriveOn Employee App</p>
                        <p className="text-[10px] text-gray-300 font-medium mt-1">v1.2.0 • Build 429</p>
                    </motion.div>
                </motion.div>
            </div>

            <BottomNav />

            {/* Premium Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setShowDeleteModal(false)}
                            className="absolute inset-0 bg-[#1C205C]/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-white/20"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <FiAlertTriangle className="text-red-500" size={36} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Delete Account?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 px-2">
                                    This action is permanent and cannot be undone. All your data will be permanently removed.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            "Yes, Delete My Account"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl active:scale-95 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SectionTitle = ({ title }) => (
    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">{title}</h3>
);

const InfoRow = ({ icon, label, value, isLast }) => (
    <div className={`flex items-center gap-4 p-3 hover:bg-gray-50/50 transition-colors rounded-[16px] ${!isLast ? 'mb-1' : ''}`}>
        <div className="w-12 h-12 rounded-[14px] bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 shadow-sm border border-gray-100">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-[15px] font-bold text-gray-800 tracking-wide">{value}</p>
        </div>
    </div>
);

const MenuRow = ({ icon, label, color, bg, hasBadge, badgeCount, onClick, isLast }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center justify-between p-3 hover:bg-gray-50/80 transition-all rounded-[16px] group active:scale-[0.98] ${!isLast ? 'mb-1' : ''}`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${bg} ${color} shadow-sm border border-white group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <span className="font-bold text-gray-800 text-[15px] tracking-wide">{label}</span>
        </div>
        <div className="flex items-center gap-3 pr-2">
            {hasBadge && <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">{badgeCount}</span>}
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <FiChevronRight className="text-gray-400" size={18} />
            </div>
        </div>
    </button>
);

export default ProfilePage;
