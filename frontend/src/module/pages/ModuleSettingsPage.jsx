import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';
import { clearUser } from '../../store/slices/userSlice';
import toastUtils from '../../config/toast';
import ProfileHeader from '../components/layout/ProfileHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import { colors } from '../theme/colors';

/**
 * ModuleSettingsPage Component
 * Premium Settings page matching module theme
 * Based on document.txt - Profile fields, notification preferences, privacy settings
 */
const ModuleSettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isSaving, setIsSaving] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call async logout thunk that calls backend API
      await dispatch(logoutUser()).unwrap();
      // Clear user data
      dispatch(clearUser());
      toastUtils.success('Logged out successfully');
      // Force redirect to login page using window.location for complete page reload
      window.location.href = '/login';
    } catch (error) {
      // Even if logout fails, clear state and force redirect
      dispatch(clearUser());
      toastUtils.success('Logged out successfully');
      // Force redirect to login page
      window.location.href = '/login';
    }
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toastUtils.success('Settings saved successfully!');
    }, 1000);
  };

  // Settings sections based on document.txt
  const settingsSections = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      items: [
        {
          id: 'edit-profile',
          label: 'Edit Profile',
          description: 'Update your personal information',
          action: () => navigate('/profile/edit'),
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          ),
        },
        {
          id: 'change-password',
          label: 'Change Password',
          description: 'Update your account password',
          action: () => navigate('/profile/change-password'),
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          ),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      ),
      items: [
        {
          id: 'push-notifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your device',
          toggle: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          id: 'email-notifications',
          label: 'Email Notifications',
          description: 'Receive updates via email',
          toggle: emailNotifications,
          onToggle: setEmailNotifications,
        },
        {
          id: 'sms-notifications',
          label: 'SMS Notifications',
          description: 'Receive updates via SMS',
          toggle: smsNotifications,
          onToggle: setSmsNotifications,
        },
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      ),
      items: [
        {
          id: 'location-tracking',
          label: 'Location Tracking',
          description: 'Allow location tracking during trips (Required for booking)',
          toggle: locationTracking,
          onToggle: setLocationTracking,
        },
        {
          id: 'privacy-policy',
          label: 'Privacy Policy',
          description: 'View our privacy policy',
          action: () => navigate('/privacy-policy'),
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          ),
        },
        {
          id: 'terms',
          label: 'Terms & Conditions',
          description: 'View terms and conditions',
          action: () => navigate('/terms'),
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          ),
        },
      ],
    },
    {
      id: 'app',
      title: 'App Settings',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
      ),
      items: [
        {
          id: 'language',
          label: 'Language',
          description: 'Select app language',
          value: language === 'en' ? 'English' : 'Hindi',
          action: () => {
            setLanguage(language === 'en' ? 'hi' : 'en');
            toastUtils.success(`Language changed to ${language === 'en' ? 'Hindi' : 'English'}`);
          },
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          ),
        },
        {
          id: 'about',
          label: 'About',
          description: 'App version and information',
          value: 'Version 1.0.0',
          action: () => toastUtils.info('DriveOn Car Rental App v1.0.0'),
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ),
        },
      ],
    },
  ];

  const iconBgColor = colors.backgroundPrimary || colors.backgroundPrimary;

  return (
    <div
      className="min-h-screen w-full relative pb-20 md:pb-0"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Header */}
      <ProfileHeader title="Settings" />

      {/* Web Container - Centered with max-width */}
      <div className="max-w-4xl mx-auto">
      {/* Settings Content */}
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 pt-4 md:pt-6 lg:pt-8 pb-6 md:pb-8 lg:pb-10" style={{ backgroundColor: colors.backgroundSecondary }}>
        {/* Settings Sections */}
        <div className="space-y-2 md:space-y-3 lg:space-y-4">
          {settingsSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Section Header - Premium Style */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: iconBgColor }}
                  >
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {section.icon}
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-black">{section.title}</h2>
                </div>
              </div>

              {/* Section Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`px-4 transition-colors hover:bg-gray-50 active:bg-gray-100 ${
                      index === 0 ? 'pt-4' : ''
                    } ${index === section.items.length - 1 ? 'pb-4' : 'py-4'}`}
                  >
                    {item.toggle !== undefined ? (
                      // Toggle Item - Premium Black & White Style
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.icon && (
                            <div
                              className="p-2 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: iconBgColor }}
                            >
                              <svg
                                className="w-4 h-4 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {item.icon}
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium mb-0.5 text-black">{item.label}</p>
                            <p className="text-xs text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={item.toggle}
                            onChange={(e) => item.onToggle(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div
                            className="w-11 h-6 rounded-full transition-all duration-300 relative"
                            style={{
                              backgroundColor: item.toggle ? colors.brandBlack : colors.borderCheckbox,
                            }}
                          >
                            <div
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                item.toggle ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    ) : (
                      // Action Item - Premium Black & White Style
                      <button
                        onClick={item.action}
                        className="w-full flex items-center justify-between group active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                          {item.icon && (
                            <div
                              className="p-2 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: iconBgColor }}
                            >
                              <svg
                                className="w-5 h-5 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {item.icon}
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium mb-0.5 text-black">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.description}
                            </p>
                            {item.value && (
                              <p className="text-xs font-medium mt-1.5 inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 border border-gray-200">
                                {item.value}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons - Premium Black & White Style */}
        <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8 lg:mt-10">
          {/* Save Button - Black Premium Style */}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2.5 bg-black text-white"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Save Settings</span>
              </>
            )}
          </button>

          {/* Logout Button - White with Red Border Premium Style */}
          <button
            onClick={handleLogout}
            className="w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2.5 bg-white border-2 border-red-500 text-red-500"
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
                strokeWidth={2.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
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

export default ModuleSettingsPage;

