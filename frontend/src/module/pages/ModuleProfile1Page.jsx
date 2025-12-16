import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { logoutUser } from "../../store/slices/authSlice";
import { clearUser, setUser } from "../../store/slices/userSlice";
import { userService } from "../../services/user.service";
import toastUtils from "../../config/toast";
import BottomNavbar from "../components/layout/BottomNavbar";
import { colors } from "../theme/colors";

/**
 * ModuleProfile1Page Component
 * Profile page matching the image design with light beige background and white rounded cards
 * Mobile view only - hidden on web
 * Premium feel with theme colors
 */
const ModuleProfile1Page = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { profileComplete, kycStatus, guarantor } = useAppSelector(
    (state) => state.user
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Calculate profile completion percentage
  const profileCompletePercentage = user?.profileComplete ?? 0;
  const isProfileFullyComplete = profileCompletePercentage >= 100;

  const [imageError, setImageError] = useState(false);

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        const userData =
          response?.data?.user || response?.user || response?.data;

        if (userData) {
          const normalizedUserData = {
            ...userData,
            name: userData.name || userData.fullName || "",
            phone: userData.phone || "",
            email: userData.email || "",
          };
          dispatch(setUser(normalizedUserData));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearUser());
      toastUtils.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      dispatch(clearUser());
      toastUtils.success("Logged out successfully");
      window.location.href = "/login";
    }
  };

  // Get user data with fallbacks
  const userName = (user?.name || user?.fullName || "").trim() || "User";
  const userPhone = (user?.phone || "").trim();
  const userPhoto =
    user?.profilePhoto && user.profilePhoto.trim() !== ""
      ? user.profilePhoto
      : null;
  const userId = user?._id || user?.id || userPhone || "N/A";

  // Get first letter of name for avatar
  const getInitial = (name) => {
    if (!name || name.trim() === "") return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone || phone === "" || phone.trim() === "") {
      return "Not provided";
    }
    const cleaned = String(phone).replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `+91 ${cleaned}`;
    }
    if (cleaned.length > 0) {
      return phone;
    }
    return "Not provided";
  };

  const displayPhone = formatPhoneNumber(userPhone);

  // Determine KYC status
  const isKYCVerified =
    kycStatus === "verified" ||
    kycStatus === "approved" ||
    (typeof kycStatus === "object" && kycStatus?.verified);
  const kycStatusText = isKYCVerified ? "Verified" : "Pending";

  // Module theme colors - using colors from module/theme/colors.js
  const primaryColor = colors.backgroundTertiary || "#21292b"; // Dark color for primary buttons
  const accentColor = colors.accentBlue || "#8FA3B0"; // Light blue-gray for accents
  const successColor = colors.success || "#4CAF50"; // Green for verified status
  const darkColor = colors.backgroundDark || "#294657"; // Dark blue for premium feel

  // Menu items matching current profile page
  const menuItems = [
    {
      id: "complete",
      title: "Complete Profile",
      description: "Complete your profile to start booking cars.",
      path: "/profile/complete",
    },
    {
      id: "kyc",
      title: "KYC Status",
      description: "View and manage your KYC verification status.",
      path: "/profile/kyc",
    },
    {
      id: "guarantor",
      title: "Guarantor",
      description: "Add or manage your guarantor information.",
      path: "/profile/guarantor",
    },
    {
      id: "referrals",
      title: "Referral Dashboard",
      description: "Share your code and earn extra on bookings.",
      path: "/profile/referrals",
    },
    {
      id: "bookings",
      title: "My Bookings",
      description: "View and manage your car bookings.",
      path: "/bookings",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Manage your account settings and preferences.",
      path: "/profile/settings",
    },
    {
      id: "support",
      title: "Help & Support",
      description: "Get help and contact support.",
      path: "/profile/support",
    },
    {
      id: "terms",
      title: "Terms & Conditions",
      description: "Read how DriveOn works for users.",
      path: "/terms",
    },
  ];

  return (
    <div
      className="min-h-screen w-full relative pb-20 md:hidden"
      style={{ backgroundColor: colors.backgroundPrimary || "#f8f8f8" }}
    >
      {/* Header with Close Button */}
      <motion.div
        className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center justify-between"
        style={{ backgroundColor: colors.backgroundPrimary || "#f8f8f8" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-2xl font-bold"
          style={{ color: colors.textPrimary || "#000000" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Profile
        </motion.h1>
        <motion.button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 2px 8px ${primaryColor}40`,
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* Main content - compact spacing for mobile */}
      <div className="px-4 pb-4 space-y-2">
        {/* Profile Summary Card */}
        <motion.div
          className="bg-white rounded-2xl p-3 shadow-sm"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              {/* Profile Picture or Initial */}
              {userPhoto && !imageError ? (
                <motion.img
                  src={userPhoto}
                  alt={userName}
                  onError={() => setImageError(true)}
                  className="rounded-full object-cover border-2"
                  style={{
                    borderColor: `${primaryColor}20`,
                    width: "56px",
                    height: "56px",
                    minWidth: "56px",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                />
              ) : (
                <motion.div
                  className="rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    width: "56px",
                    height: "56px",
                    minWidth: "56px",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {getInitial(userName)}
                </motion.div>
              )}

              <div className="flex-1 min-w-0">
                <h2
                  className="text-base font-bold mb-0.5"
                  style={{ color: colors.textPrimary || "#000000" }}
                >
                  {userName}
                </h2>
                <p
                  className="text-xs"
                  style={{ color: colors.textSecondary || "#666666" }}
                >
                  {userId}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:opacity-90 flex-shrink-0"
              style={{
                borderColor: colors.error || "#F44336",
                color: colors.error || "#F44336",
                backgroundColor: "transparent",
              }}
            >
              Logout
            </button>
          </div>

          {/* Status Tags */}
          <div className="flex flex-wrap gap-1.5">
            <motion.span
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{
                backgroundColor: isKYCVerified
                  ? `${successColor}15`
                  : `${primaryColor}15`,
                color: isKYCVerified ? successColor : primaryColor,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              KYC: {kycStatusText}
            </motion.span>
            <motion.span
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{
                backgroundColor: isProfileFullyComplete
                  ? `${successColor}15`
                  : `${primaryColor}15`,
                color: isProfileFullyComplete ? successColor : primaryColor,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              Profile:{" "}
              {isProfileFullyComplete
                ? "Complete"
                : `${profileCompletePercentage}%`}
            </motion.span>
            <motion.span
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{
                backgroundColor: guarantor?.verified
                  ? `${successColor}15`
                  : guarantor?.added
                  ? `${primaryColor}15`
                  : `${colors.backgroundIcon || "#e0e0e0"}15`,
                color: guarantor?.verified
                  ? successColor
                  : guarantor?.added
                  ? primaryColor
                  : colors.textSecondary,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              Guarantor:{" "}
              {guarantor?.verified
                ? "Verified"
                : guarantor?.added
                ? "Added"
                : "Not Added"}
            </motion.span>
          </div>
        </motion.div>

        {/* Profile Details Card */}
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-base font-bold"
              style={{ color: colors.textPrimary || "#000000" }}
            >
              Profile details
            </h3>
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all hover:opacity-90"
              style={{
                borderColor: primaryColor,
                color: primaryColor,
                backgroundColor: "transparent",
              }}
            >
              Edit profile
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span
                className="text-sm"
                style={{ color: colors.textSecondary || "#666666" }}
              >
                Name
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: colors.textPrimary || "#000000" }}
              >
                {userName}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span
                className="text-sm"
                style={{ color: colors.textSecondary || "#666666" }}
              >
                Phone
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: colors.textPrimary || "#000000" }}
              >
                {userPhone || displayPhone}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation List Items - Combined in one card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        >
          {menuItems.map((item, index) => (
            <div key={item.id}>
              <motion.button
                onClick={() => navigate(item.path)}
                className="w-full p-4 flex items-center justify-between transition-all active:bg-gray-50 relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.2 + index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-1 text-left min-w-0">
                  <h4
                    className="text-sm font-bold mb-0.5"
                    style={{ color: colors.textPrimary || "#000000" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[11px]"
                    style={{ color: colors.textSecondary || "#666666" }}
                  >
                    {item.description}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 flex-shrink-0 ml-3"
                  style={{ color: colors.textTertiary || "#999999" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
              {index < menuItems.length - 1 && (
                <div className="h-px bg-gray-100 mx-4" />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Navbar - Mobile only */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ModuleProfile1Page;
