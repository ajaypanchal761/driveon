import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';
import { useAdminAuth } from '../../../context/AdminContext';
import { adminService } from '../../../services/admin.service';
import toastUtils from '../../../config/toast';

/**
 * Admin Settings Page
 * Admin can manage system settings, features, notifications, and security
 * No localStorage or Redux - All state managed via React hooks
 */
const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const { adminUser, refreshProfile } = useAdminAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    adminName: '',
    appName: 'DriveOn',
    contactEmail: 'driveon721@gmail.com',
    contactPhone: '',
  });

  // Password Change Settings
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch system settings from backend
        const settingsResponse = await adminService.getSystemSettings();
        
        if (settingsResponse.success) {
          const settings = settingsResponse.data.settings;
          setGeneralSettings({
            adminName: adminUser?.name || '',
            appName: settings.appName || 'DriveOn',
            contactEmail: settings.contactEmail || 'driveon721@gmail.com',
            contactPhone: adminUser?.phone || settings.contactPhone || '+91 98765 43210',
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.response?.data?.message || 'Failed to load settings');
        // Set defaults if fetch fails
        setGeneralSettings({
          adminName: adminUser?.name || '',
          appName: 'DriveOn',
          contactEmail: 'driveon721@gmail.com',
          contactPhone: adminUser?.phone || '+91 98765 43210',
        });
      } finally {
        setLoading(false);
      }
    };

    if (adminUser) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [adminUser]);

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaved(false);

      // Update admin profile (name, phone)
      if (generalSettings.adminName || generalSettings.contactPhone) {
        const profileData = {};
        if (generalSettings.adminName) {
          profileData.name = generalSettings.adminName;
        }
        if (generalSettings.contactPhone) {
          profileData.phone = generalSettings.contactPhone;
        }

        const profileResponse = await adminService.updateProfile(profileData);
        if (!profileResponse.success) {
          throw new Error(profileResponse.message || 'Failed to update profile');
        }
      }

      // Update system settings (app name, contact email, contact phone)
      const settingsResponse = await adminService.updateSystemSettings({
        appName: generalSettings.appName,
        contactEmail: generalSettings.contactEmail,
        contactPhone: generalSettings.contactPhone,
      });

      if (!settingsResponse.success) {
        throw new Error(settingsResponse.message || 'Failed to update settings');
      }

      setSaved(true);
      toastUtils.success('Settings saved successfully!');
      setTimeout(() => setSaved(false), 3000);

      // Refresh admin profile to get updated data
      try {
        const updatedAdmin = await refreshProfile();
        if (updatedAdmin) {
          // Update form with new admin data
          setGeneralSettings(prev => ({
            ...prev,
            adminName: updatedAdmin.name || prev.adminName,
            contactPhone: updatedAdmin.phone || prev.contactPhone,
          }));
        }
      } catch (err) {
        console.error('Error refreshing profile:', err);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save settings';
      setError(errorMessage);
      toastUtils.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordSettings.currentPassword || !passwordSettings.newPassword || !passwordSettings.confirmPassword) {
      toastUtils.error('Please fill all password fields');
      return;
    }

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      toastUtils.error('New password and confirm password do not match');
      return;
    }

    if (passwordSettings.newPassword.length < 6) {
      toastUtils.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setChangingPassword(true);
      setError(null);
      setSaved(false);

      const response = await adminService.changePassword({
        currentPassword: passwordSettings.currentPassword,
        newPassword: passwordSettings.newPassword,
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }

      // Reset password fields
      setPasswordSettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setSaved(true);
      toastUtils.success('Password changed successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      toastUtils.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pt-20 md:pt-6 pb-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>
            System Settings
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage system configuration and preferences</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-800">Settings saved successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* General Settings */}
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                <input
                  type="text"
                  value={generalSettings.adminName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, adminName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter admin name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                <input
                  type="text"
                  value={generalSettings.appName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={generalSettings.contactPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveGeneral}
                  disabled={saving}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </Card>

        {/* Password Change Section */}
        <Card className="p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordSettings.currentPassword}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordSettings.newPassword}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordSettings.confirmPassword}
                  onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {changingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </div>
          </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

