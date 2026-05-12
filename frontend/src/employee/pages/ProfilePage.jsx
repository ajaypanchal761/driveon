import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FiUser, FiSettings, FiLogOut, FiAward, FiChevronRight, FiBriefcase, FiDollarSign, FiFileText, FiBell, FiShield, FiPhone, FiMail, FiMapPin, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { logoutUser } from '../../store/slices/authSlice';
import { useEmployee } from '../../context/EmployeeContext';
import HeaderTopBar from '../components/HeaderTopBar';
import BottomNav from '../components/BottomNav';

const ProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { unreadCount, fetchUnreadCount } = useEmployee();

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

    // Fallback/Default data if backend data is missing structure
    const user = {
        name: userData?.name || "", // Removed static "Employee"
        role: userData?.role || "",
        id: userData?.employeeId || "",
        phone: userData?.phone || "",
        email: userData?.email || "",
        // Ensure avatar is never empty string to avoid React warning
        avatar: userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=1C205C&color=fff&size=128`,
        joinDate: userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString() : ""
    };

    const [performanceStats, setPerformanceStats] = useState({
        score: 0,
        rating: 0,
        badge: "Rookie"
    });

    useEffect(() => {
        // Unread count is now fetched automatically by EmployeeContext on user mount/change
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!userData || (!userData.id && !userData._id)) return;
            const userId = userData.id || userData._id;

            try {
                // 1. Calculate Target Score from Tasks (Completion Rate)
                const tasksResponse = await api.get(`/crm/staff-tasks?assignedTo=${userId}`);
                let calculatedScore = 0;
                if (tasksResponse.data.success) {
                    const tasks = tasksResponse.data.data.tasks;
                    const totalTasks = tasks.length;
                    const completedTasks = tasks.filter(t => t.status === 'Done').length;
                    if (totalTasks > 0) {
                        calculatedScore = Math.round((completedTasks / totalTasks) * 100);
                    }
                }

                // 2. Calculate Avg Rating from Performance Reviews
                const reviewsResponse = await api.get(`/crm/performance?staffId=${userId}`);
                let avgRating = 0;
                if (reviewsResponse.data.success) {
                    const reviews = reviewsResponse.data.data.reviews;
                    if (reviews.length > 0) {
                        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                        avgRating = (totalRating / reviews.length).toFixed(1);
                    }
                }

                // 3. Determine Badge
                let badge = "Rookie";
                if (calculatedScore >= 80 && avgRating >= 4.5) badge = "Superstar";
                else if (calculatedScore >= 80) badge = "Hustler";
                else if (avgRating >= 4.5) badge = "Expert";
                else if (calculatedScore >= 50) badge = "Achiever";

                setPerformanceStats({
                    score: calculatedScore,
                    rating: avgRating,
                    badge: badge
                });

            } catch (error) {
                console.error("Error fetching profile stats:", error);
            }
        };

        fetchData();
    }, [userData]);

    // Show loading state while initializing or if user data is still being fetched
    if (isInitializing || !userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA] p-4">
                <div
                    className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
                    style={{ borderColor: '#1C205C' }}
                ></div>
                <p className="text-[#1C205C] font-medium">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-y-auto bg-[#F5F7FA] pb-32 font-sans selection:bg-blue-100">

            <div className="sticky top-0 z-30 bg-[#F5F7FA]">
                {/* HEADER & PROFILE CARD */}
                <div className="bg-[#1C205C] pt-6 pb-24 px-6 rounded-b-[40px] shadow-lg relative overflow-hidden z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                    <HeaderTopBar title="My Profile" showBack={false} />

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
                            <p className="text-2xl font-black text-[#1C205C]">{performanceStats.score}%</p>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Target Score</p>
                        </div>
                        <div className="text-center px-2">
                            <p className="text-2xl font-black text-emerald-600">{performanceStats.rating}</p>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Avg Rating</p>
                        </div>
                        <div className="text-center px-2">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 mb-1">
                                <FiAward />
                            </div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">{performanceStats.badge}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MENU LIST */}
            <div className="px-5 mt-6 space-y-3">
                {/* PERSONAL INFO SECTION */}
                <SectionTitle title="Personal Information" />
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                    <InfoRow icon={<FiPhone size={16} />} label="Phone" value={user.phone} />
                    <InfoRow icon={<FiMail size={16} />} label="Email" value={user.email} />

                </div>

                {/* APP SETTINGS */}
                <SectionTitle title="App & Settings" />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">


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
                        hasBadge={unreadCount > 0}
                        badgeCount={unreadCount}
                        onClick={() => navigate('/employee/notifications')}
                    />
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <FiLogOut /> Logout
                </button>

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full text-red-500 font-bold py-2 mt-2 flex items-center justify-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                    Delete account
                </button>

                <p className="text-center text-xs text-gray-300 font-medium mt-4 mb-2">v1.2.0 • Employee App</p>
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
                            className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiAlertTriangle className="text-red-500" size={36} />
                                </div>
                                <h3 className="text-2xl font-black text-[#1C205C] mb-3">Delete Account?</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    Are you sure you want to delete your account? This action is permanent and your profile will be deactivated.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                        className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            "Yes, Delete Account"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        className="w-full bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl active:scale-95 transition-all"
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
