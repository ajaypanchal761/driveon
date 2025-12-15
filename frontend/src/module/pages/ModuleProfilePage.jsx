import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { clearUser, updateUser } from '../../store/slices/userSlice';
import { userService } from '../../services/user.service';
import toastUtils from '../../config/toast';
import ProfileHeader from '../components/layout/ProfileHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import { colors } from '../theme/colors';
import carImg1 from '../../assets/car_img1-removebg-preview.png';

/**
 * ModuleProfilePage Component
 * Profile page matching the image design with white background
 * Uses menu items from the old profile page: Complete Profile, KYC Status, Guarantor, etc.
 */
const ModuleProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.user);
  const { profileComplete, kycStatus, guarantor, referralCode, points } = useAppSelector(
    (state) => state.user
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await userService.getProfile();
        
        // Extract user data from response
        const userData = response.data?.user || response.data?.data?.user || response.user;
        
        if (userData) {
          // Update Redux store with fetched data
          dispatch(updateUser(userData));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Don't show error toast - just use Redux store data as fallback
      }
    };

    fetchUserProfile();
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    toastUtils.success('Logged out successfully');
    navigate('/');
  };

  // Calculate profile completion percentage from user data
  const profileCompletePercentage = user?.profileComplete ?? 0;
  const isProfileFullyComplete = profileCompletePercentage >= 100;

  // General section menu items
  const generalMenuItems = [
    {
      id: 'complete',
      label: 'Complete Profile',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      path: '/profile/complete',
    },
    {
      id: 'kyc',
      label: 'KYC Status',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      ),
      path: '/profile/kyc',
    },
    {
      id: 'guarantor',
      label: 'Guarantor',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      path: '/profile/guarantor',
    },
    {
      id: 'referrals',
      label: 'Referral Dashboard',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      ),
      path: '/profile/referrals',
    },
  ];

  // Support section menu items
  const supportMenuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
      ),
      path: '/profile/settings',
    },
    {
      id: 'languages',
      label: 'Languages',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      ),
      path: '/profile/settings',
    },
    {
      id: 'invite',
      label: 'Invite Friends',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      ),
      path: '/profile/referrals',
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
      path: '/privacy',
    },
    {
      id: 'support',
      label: 'Help Support',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      ),
      path: '/profile/support',
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      ),
      onClick: handleLogout,
    },
  ];

  const userName = user?.name || 'User';
  const userEmail = user?.email || user?.phone || 'user@example.com';
  const userPhoto = user?.profilePhoto;
  const username = user?.username || `@${userName.toLowerCase().replace(/\s+/g, '')}`;

  // Combine all menu items in the order shown in the image
  const allMenuItems = [
    ...generalMenuItems,
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      ),
      path: '/bookings',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
      ),
      path: '/profile/settings',
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      path: '/profile/support',
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      ),
      onClick: handleLogout,
    },
  ];

  // Light version of dark background for profile section
  const profileSectionBg = colors.backgroundPrimary || '#f8f8f8';
  const iconBgColor = colors.backgroundPrimary || colors.backgroundImage;

  return (
    <div 
      className="min-h-screen w-full relative pb-20 md:pb-0"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Web Header - Only visible on web */}
      <header
        className="hidden md:block w-full sticky top-0 z-50"
        style={{ backgroundColor: colors.brandBlack }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center h-16 md:h-20 lg:h-24 justify-between">
            {/* Left - Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/driveonlogo.png"
                alt="DriveOn Logo"
                className="h-8 md:h-10 lg:h-12 xl:h-14 w-auto object-contain"
              />
            </Link>

            {/* Center - Navigation Tabs */}
            <nav className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 h-full">
              <Link
                to="/"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Home
              </Link>
              <Link
                to="#"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                About
              </Link>
              <Link
                to="#"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                FAQs
              </Link>
            </nav>

            {/* Right - Login/Signup and Profile Icon */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                >
                  {/* Circular profile icon with white border */}
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={carImg1}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 rounded-lg border text-xs md:text-sm lg:text-base font-medium transition-all hover:opacity-90"
                  style={{
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header - Mobile view only */}
      <div className="md:hidden">
        <ProfileHeader />
      </div>


      {/* Web Container - Centered with max-width */}
      <div className="max-w-5xl mx-auto">
      {/* Profile Section with Light Background - Like Third Image */}
      <div 
          className="px-4 md:px-6 lg:px-8 xl:px-12 pt-4 md:pt-8 lg:pt-10 xl:pt-12 pb-3 md:pb-4 lg:pb-5 xl:pb-6 rounded-b-3xl"
        style={{ backgroundColor: profileSectionBg }}
      >
        {/* Profile Picture - Centered */}
          <div className="flex flex-col items-center mb-3 md:mb-3 lg:mb-4">
          <div className="relative mb-1.5 md:mb-2">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                  className="w-20 h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 hover:scale-105"
                style={{ borderColor: profileSectionBg }}
              />
            ) : (
              <div 
                  className="w-20 h-20 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: iconBgColor }}
              >
                <svg
                    className="w-10 h-10 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* User Name */}
            <h2 className="text-lg md:text-lg lg:text-xl font-bold text-black mb-0.5">
            {userName}
          </h2>
          
          {/* Email Display */}
            <p className="text-xs md:text-xs lg:text-sm text-gray-600">
            {userEmail}
          </p>
        </div>
      </div>

      {/* Menu Items Section - White Background with Card Design - Like First Image */}
        <div className="px-4 md:px-6 lg:px-8 xl:px-12 pt-3 md:pt-4 lg:pt-5 xl:pt-6 pb-6 md:pb-6 lg:pb-8 xl:pb-10" style={{ backgroundColor: colors.backgroundSecondary }}>
        {/* Menu Items List - Single column on mobile, 2 columns on web */}
          <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 lg:gap-4 xl:gap-5 md:space-y-0">
          {allMenuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
                className={`w-full flex items-center justify-between py-4 md:py-3 lg:py-3.5 px-3 md:px-4 lg:px-5 bg-white rounded-xl shadow-sm hover:shadow-lg active:bg-gray-50 transition-all duration-300 md:hover:scale-[1.02] ${
                item.id === 'logout' ? 'text-red-600' : ''
              }`}
            >
                <div className="flex items-center gap-3 md:gap-3 flex-1">
                {/* Icon with background circle */}
                <div
                    className="p-2 md:p-2 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: iconBgColor }}
                >
                  <svg
                      className={`w-5 h-5 md:w-5 md:h-5 ${item.id === 'logout' ? 'text-red-600' : 'text-gray-700'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                {/* Label */}
                  <span className={`text-base md:text-sm lg:text-base font-medium flex-1 text-left ${item.id === 'logout' ? 'text-red-600' : 'text-black'}`}>
                  {item.label}
                </span>
              </div>
              {/* Right Arrow */}
              <svg
                className={`w-5 h-5 md:w-5 md:h-5 flex-shrink-0 ${item.id === 'logout' ? 'text-red-600' : 'text-gray-400'}`}
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
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Bottom Navbar - Hidden on web */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ModuleProfilePage;

