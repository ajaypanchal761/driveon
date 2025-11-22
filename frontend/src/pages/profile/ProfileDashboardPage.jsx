import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { clearUser } from '../../store/slices/userSlice';
import toastUtils from '../../config/toast';
// Theme color constant
const PRIMARY_COLOR = '#3d096d';
const PRIMARY_COLOR_LIGHT = '#5d0d8a';

/**
 * ProfileDashboardPage Component
 * Beautiful profile page with user info and menu options
 * Matches homepage theme (purple #3d096d)
 * Mobile-first design
 */
const ProfileDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.user);
  const { profileComplete, kycStatus, guarantor, referralCode, points } = useAppSelector(
    (state) => state.user
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Show loading only if explicitly loading, otherwise show page with default data
  // Don't block rendering if user data is not loaded yet

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    toastUtils.success('Logged out successfully');
    navigate('/');
  };

  // Menu options based on project requirements
  const menuOptions = [
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
      badge: profileComplete ? '100%' : '0%',
      badgeColor: profileComplete ? 'bg-green-500' : 'bg-red-500',
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
      badge: kycStatus.verified ? 'Verified' : 'Pending',
      badgeColor: kycStatus.verified ? 'bg-green-500' : 'bg-yellow-500',
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
      badge: guarantor.verified ? 'Added' : 'Not Added',
      badgeColor: guarantor.verified ? 'bg-green-500' : 'bg-gray-400',
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
      badge: points > 0 ? `${points} pts` : null,
      badgeColor: 'bg-primary',
    },
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
  ];

  const userName = user?.name || 'User';
  const userEmail = user?.email || user?.phone || 'user@example.com';
  const userPhoto = user?.profilePhoto;

  return (
    <div className="w-full min-h-screen bg-white pb-20 overflow-x-hidden relative z-0" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section - Purple Background */}
      <header className="w-full text-white relative overflow-hidden" style={{ backgroundColor: PRIMARY_COLOR }}>
        {/* Abstract purple pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Header Content */}
        <div className="relative px-4 py-3 md:px-6 md:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button, Profile Icon, and User Name - All Aligned */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 -ml-1 touch-target flex-shrink-0 md:p-2"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Profile Photo */}
              <div className="relative">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/20 border-2 border-white flex items-center justify-center shadow-md">
                    <svg
                      className="w-7 h-7 md:w-10 md:h-10 text-white"
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
                {profileComplete && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 flex items-center justify-center" style={{ borderColor: PRIMARY_COLOR }}>
                    <svg
                      className="w-2 h-2 md:w-2.5 md:h-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name and Email */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-white mb-0.5 md:mb-1 truncate">{userName}</h1>
                <p className="text-xs md:text-sm text-white/80 truncate">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 pt-4 pb-3 md:px-6 md:pt-8 md:pb-6 w-full max-w-7xl mx-auto" style={{ backgroundColor: '#ffffff' }}>
        {/* Profile Completion Status Card */}
        {!profileComplete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 mb-3 md:mb-6">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-yellow-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5 md:mb-1">
                  <h3 className="text-xs md:text-sm font-semibold text-yellow-900">
                    Complete Your Profile
                  </h3>
                  <span className="text-xs md:text-sm font-bold text-yellow-900">0%</span>
                </div>
                <p className="text-xs md:text-sm text-yellow-700 mb-1.5 md:mb-2">
                  Complete your profile to start booking cars
                </p>
                <button
                  onClick={() => navigate('/profile/complete')}
                  className="text-xs md:text-sm font-medium text-yellow-900 underline hover:no-underline"
                >
                  Complete Now →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Options */}
        <div className="space-y-1.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 pt-2">
          {menuOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.path)}
              className="w-full bg-white rounded-lg p-3 md:p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md md:hover:shadow-lg transition-all touch-target group"
            >
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-colors flex-shrink-0" style={{ backgroundColor: `${PRIMARY_COLOR}1A` }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${PRIMARY_COLOR}33`} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${PRIMARY_COLOR}1A`}>
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    style={{ color: PRIMARY_COLOR }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {option.icon}
                  </svg>
                </div>

                {/* Label */}
                <span className="text-sm md:text-base font-medium text-gray-900 truncate">{option.label}</span>
              </div>

              {/* Badge and Arrow */}
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {option.badge && (
                  <span
                    className={`${option.badgeColor} text-white text-xs md:text-sm font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full`}
                  >
                    {option.badge}
                  </span>
                )}
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = PRIMARY_COLOR}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
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
              </div>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 rounded-lg p-3 md:p-4 flex items-center justify-between shadow-sm border border-red-100 hover:shadow-md md:hover:shadow-lg transition-all touch-target group mt-3 md:mt-4 md:col-span-2"
          >
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              {/* Icon */}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>

              {/* Label */}
              <span className="text-sm md:text-base font-medium text-red-600">Logout</span>
            </div>

            {/* Arrow */}
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-red-400 group-hover:text-red-600 transition-colors flex-shrink-0"
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
        </div>

        {/* Referral Code Display */}
        {referralCode && (
          <div className="mt-3 md:mt-6 rounded-lg p-3 md:p-4 text-white" style={{ background: `linear-gradient(to right, ${PRIMARY_COLOR}, ${PRIMARY_COLOR_LIGHT})` }}>
            <div className="flex items-center justify-between gap-2 md:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-white/80 mb-0.5 md:mb-1">Your Referral Code</p>
                <p className="text-sm md:text-lg font-bold font-mono truncate">{referralCode}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referralCode);
                  toastUtils.success('Referral code copied!');
                }}
                className="p-1.5 md:p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex-shrink-0 touch-target"
                aria-label="Copy referral code"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfileDashboardPage;
