import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../module/theme/colors';
import Card from '../../../components/common/Card';
import { adminService } from '../../../services/admin.service';
import toastUtils from '../../../config/toast';
import { onMessageListener } from "../../../services/firebase";
import AdminCustomSelect from '../../../components/admin/common/AdminCustomSelect';

/**
 * Helper Functions - Shared between components
 */

// Calculate KYC status from user data
const getKycStatus = (user) => {
  if (!user) return 'pending';
  if (user.isKYCVerified) return 'verified';
  if (user.kycDetails?.aadhaar?.isVerified || user.kycDetails?.pan?.isVerified || user.kycDetails?.dl?.isVerified) {
    return 'pending'; // Partially verified
  }
  return 'pending';
};


// Helper function to safely get first character
const getFirstChar = (str) => {
  if (!str || typeof str !== 'string') return '?';
  return str.charAt(0).toUpperCase();
};

// Helper function to safely capitalize
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper to get user ID (handles both _id and id)
const getUserId = (user) => {
  return user._id || user.id;
};

/**
 * Format user ID to USER001 format
 * Takes MongoDB ObjectId and converts to USER + padded number
 */
const formatUserId = (userId) => {
  if (!userId) return 'N/A';
  const idStr = userId.toString();
  return `user-${idStr.slice(-5)}`;
};

/**
 * User List Page
 * Admin can view, search, filter, and manage all users
 * No localStorage or Redux - All state managed via React hooks
 */
const UserListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlParams.get('search') || '');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    accountStatus: 'all', // all, active, suspended, banned
    kycStatus: 'all', // all, verified, pending
    userType: 'all', // all, regular, guarantor, owner
    registrationDate: 'all', // all, today, week, month, year
  });

  // Listen for notifications
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        toastUtils.info(`🔔 Admin Alert: ${payload.notification.title}`);
        console.log("Admin Notification:", payload);
      })
      .catch((err) => console.log("failed: ", err));
  }, []);

  // Listen for global search events from header
  useEffect(() => {
    const handleGlobalSearch = (e) => setSearchQuery(e.detail);
    window.addEventListener('admin-global-search', handleGlobalSearch);
    return () => window.removeEventListener('admin-global-search', handleGlobalSearch);
  }, []);

  // Fetch users from API (Runs only once on mount)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllUsers({
          page: 1,
          limit: 1000, // Fetch all users
        });

        if (response.success && response.data) {
          setUsers(response.data.users || []);
        } else {
          toastUtils.error('Failed to fetch users');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toastUtils.error(error.response?.data?.message || 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Combined client-side search and filtering for ultra-responsive, blink-free user experience
  useEffect(() => {
    let filtered = [...users];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Match special format "user-XXXXX"
      const userMatch = query.match(/^user-?([0-9a-fA-F]+)$/);
      const isCustomIdSearch = !!userMatch;
      const customIdSuffix = userMatch ? userMatch[1] : '';

      filtered = filtered.filter((user) => {
        const name = (user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const phone = (user.phone || '').toLowerCase();
        const id = (user._id || user.id || '').toString().toLowerCase();

        if (isCustomIdSearch) {
          return id.endsWith(customIdSuffix);
        }

        return name.includes(query) || email.includes(query) || phone.includes(query);
      });
    }

    // 2. Account Status Filter
    if (filters.accountStatus !== 'all') {
      filtered = filtered.filter((user) => {
        const accountStatus = user.accountStatus || 'active';
        return accountStatus === filters.accountStatus;
      });
    }

    // 3. KYC Status Filter
    if (filters.kycStatus !== 'all') {
      filtered = filtered.filter((user) => {
        const kycStatus = getKycStatus(user);
        return kycStatus === filters.kycStatus;
      });
    }

    // 4. User Type Filter
    if (filters.userType !== 'all') {
      filtered = filtered.filter((user) => {
        const role = (user.role || 'user').toLowerCase();
        if (filters.userType === 'regular') {
          return role === 'user' || role === 'regular';
        }
        return role === filters.userType;
      });
    }

    // 6. Registration Date Filter
    if (filters.registrationDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter((user) => {
        const regDate = user.createdAt ? new Date(user.createdAt) : null;
        if (!regDate) return false;

        switch (filters.registrationDate) {
          case 'today':
            return regDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return regDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return regDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return regDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, filters]);

  // Handle user actions
  const handleUserAction = async (userId, action) => {
    try {
      const response = await adminService.updateUserStatus(userId, action);

      if (response.success) {
        toastUtils.success(`User ${action}ed successfully`);

        // Update user status locally
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (getUserId(user) === userId) {
              return {
                ...user,
                accountStatus: response.data.user.accountStatus,
                isActive: response.data.user.isActive,
              };
            }
            return user;
          })
        );
      } else {
        toastUtils.error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toastUtils.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        const response = await adminService.deleteUser(userId);
        if (response.success) {
          toastUtils.success('User deleted successfully');
          // Remove the user from the state locally
          setUsers((prevUsers) => prevUsers.filter((user) => getUserId(user) !== userId));
        } else {
          toastUtils.error(response.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toastUtils.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleExport = () => {
    if (!users || users.length === 0) {
      alert('No users available to export.');
      return;
    }

    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Age',
      'Gender',
      'Address',
      'Account Status',
      'KYC Status',
      'Profile Complete (%)',
      'Referral Code',
      'Registered At',
      'Last Login',
    ];

    const rows = users.map((user) => [
      user.name || user.fullName || '',
      user.email || '',
      user.phone || '',
      user.age || '',
      user.gender || '',
      user.address || '',
      user.isActive === false ? 'Suspended' : (user.isBanned ? 'Banned' : 'Active'),
      user.isKYCVerified ? 'Verified' : 'Pending',
      user.profileComplete || 0,
      user.referralCode || '',
      user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
      user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '',
    ]);

    const csvLines = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map((row) => row.map(escapeCsvValue).join(',')),
    ];

    const csvContent = csvLines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.download = `users-export-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      banned: 'bg-red-100 text-red-800',
      verified: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter((u) => u.accountStatus === 'active').length,
    suspended: users.filter((u) => u.accountStatus === 'suspended').length,
    banned: users.filter((u) => u.accountStatus === 'banned').length,
    kycPending: users.filter((u) => getKycStatus(u) === 'pending').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.backgroundTertiary }}
          ></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 md:px-6 md:pt-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 md:mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                User Management
              </h1>
              <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>Manage all users and their accounts</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 max-w-4xl">
          <Card className="p-2 text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5" style={{ color: colors.textPrimary }}>
              {stats.total}
            </div>
            <div className="text-xs" style={{ color: colors.textSecondary }}>Total Users</div>
          </Card>
          <Card className="p-2 text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5 text-green-600">{stats.active}</div>
            <div className="text-xs text-gray-600">Active</div>
          </Card>
          <Card className="p-2 text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5 text-yellow-600">{stats.suspended}</div>
            <div className="text-xs text-gray-600">Suspended</div>
          </Card>
          <Card className="p-2 text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5 text-red-600">{stats.banned}</div>
            <div className="text-xs text-gray-600">Banned</div>
          </Card>
          <Card className="p-2 text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5 text-orange-600">{stats.kycPending}</div>
            <div className="text-xs text-gray-600">KYC Pending</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-3 md:p-4 mb-4">
          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative">
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg focus:outline-none focus:ring-2"
                style={{
                  border: `1px solid ${colors.borderMedium}`,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Account Status Filter */}
            <AdminCustomSelect
              label="Account Status"
              value={filters.accountStatus}
              onChange={(value) => setFilters({ ...filters, accountStatus: value })}
              options={[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Banned', value: 'banned' },
              ]}
            />

            {/* KYC Status Filter */}
            <AdminCustomSelect
              label="KYC Status"
              value={filters.kycStatus}
              onChange={(value) => setFilters({ ...filters, kycStatus: value })}
              options={[
                { label: 'All', value: 'all' },
                { label: 'Verified', value: 'verified' },
                { label: 'Pending', value: 'pending' },
              ]}
            />

            {/* User Type Filter */}
            <AdminCustomSelect
              label="User Type"
              value={filters.userType}
              onChange={(value) => setFilters({ ...filters, userType: value })}
              options={[
                { label: 'All', value: 'all' },
                { label: 'Regular', value: 'regular' },
                { label: 'Guarantor', value: 'guarantor' },
                { label: 'Owner', value: 'owner' },
              ]}
            />

            {/* Registration Date Filter */}
            <AdminCustomSelect
              label="Registered"
              value={filters.registrationDate}
              onChange={(value) => setFilters({ ...filters, registrationDate: value })}
              options={[
                { label: 'All Time', value: 'all' },
                { label: 'Today', value: 'today' },
                { label: 'This Week', value: 'week' },
                { label: 'This Month', value: 'month' },
                { label: 'This Year', value: 'year' },
              ]}
            />
          </div>
        </Card>

        {/* Users List */}
        <div className="mb-3">
          <p className="text-xs text-gray-600">
            Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
          </p>
        </div>

        <Card className="overflow-hidden p-0 border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">KYC Status</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Account Status</th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const kycStatus = getKycStatus(user);
                  const accountStatus = user.accountStatus || 'active';
                  
                  return (
                    <tr 
                      key={user._id || user.id} 
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      onClick={() => handleViewUser(user)}
                    >
                      {/* User Column (Avatar & Name/Email) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-inner"
                            style={{ backgroundColor: colors.backgroundTertiary }}
                          >
                            {user.profilePhoto ? (
                              <img src={user.profilePhoto} alt={user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-xs">{getFirstChar(user.name || user.email || 'U')}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-900 truncate">
                              {user.name || 'No Name'}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {user.email || 'No Email'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-medium">
                          {user.phone || '—'}
                        </span>
                      </td>

                      {/* KYC Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(kycStatus)}`}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
                          KYC: {capitalize(kycStatus)}
                        </span>
                      </td>

                      {/* Account Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(accountStatus)}`}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75"></span>
                          {capitalize(accountStatus)}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          {accountStatus === 'active' ? (
                            <button
                              onClick={() => handleUserAction(getUserId(user), 'suspend')}
                              className="px-3 py-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(getUserId(user), 'activate')}
                              className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleUserAction(getUserId(user), 'ban')}
                            className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                          >
                            Ban
                          </button>
                          <button
                            onClick={() => handleViewUser(user)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: colors.backgroundTertiary }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteUser(getUserId(user))}
                            className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                            title="Delete User"
                          >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredUsers.length === 0 && (
          <Card className="p-4 text-center">
            <p className="text-sm" style={{ color: colors.textSecondary }}>No users found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowUserDetail(false);
            setSelectedUser(null);
          }}
          onAction={handleUserAction}
        />
      )}
    </div>
  );
};

/**
 * User Detail Modal Component
 */
const UserDetailModal = ({ user, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-xs text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-gray-200">
            {['profile', 'bookings', 'payments', 'kyc', 'referrals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 font-medium text-xs transition-colors ${activeTab === tab
                  ? 'border-b-2 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
                style={activeTab === tab ? { borderBottomColor: colors.backgroundTertiary } : {}}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'profile' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Name</label>
                    <p className="text-xs text-gray-900">{user.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <p className="text-xs text-gray-900">{user.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Phone</label>
                    <p className="text-xs text-gray-900">{user.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">User Type</label>
                    <p className="text-xs text-gray-900 capitalize">{user.role || 'user'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">User ID</label>
                    <p className="text-xs text-gray-900 font-mono">{formatUserId(user._id || user.id)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">KYC Status</label>
                    <p className="text-xs text-gray-900 capitalize">{getKycStatus(user)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Profile Completion</label>
                    <p className="text-xs text-gray-900">{user.profileCompletion || 0}%</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Registration Date</label>
                    <p className="text-xs text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <p className="text-sm text-gray-600">Total Bookings: {user.totalBookings || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Booking history will be displayed here...</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <p className="text-sm text-gray-600">Total Spent: ₹{(user.totalSpent || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Payment history will be displayed here...</p>
              </div>
            )}

            {activeTab === 'kyc' && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">KYC Status: {capitalize(getKycStatus(user))}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aadhaar */}
                  <div className={`p-3 rounded-lg border ${user.kycDetails?.aadhaar?.isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className="text-xs font-bold mb-1">Aadhaar Card</h4>
                    <p className="text-xs text-gray-900">No: {user.kycDetails?.aadhaar?.idNumber || 'N/A'}</p>
                    <p className="text-[10px] text-gray-500">Status: {user.kycDetails?.aadhaar?.isVerified ? 'Verified' : 'Not Verified'}</p>
                    {user.kycDetails?.aadhaar?.verifiedAt && <p className="text-[10px] text-gray-500">Date: {new Date(user.kycDetails.aadhaar.verifiedAt).toLocaleDateString()}</p>}
                  </div>

                  {/* PAN */}
                  <div className={`p-3 rounded-lg border ${user.kycDetails?.pan?.isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className="text-xs font-bold mb-1">PAN Card</h4>
                    <p className="text-xs text-gray-900">No: {user.kycDetails?.pan?.idNumber || 'N/A'}</p>
                    <p className="text-[10px] text-gray-500">Status: {user.kycDetails?.pan?.isVerified ? 'Verified' : 'Not Verified'}</p>
                    {user.kycDetails?.pan?.verifiedAt && <p className="text-[10px] text-gray-500">Date: {new Date(user.kycDetails.pan.verifiedAt).toLocaleDateString()}</p>}
                  </div>

                  {/* DL */}
                  <div className={`p-3 rounded-lg border ${user.kycDetails?.dl?.isVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h4 className="text-xs font-bold mb-1">Driving License</h4>
                    <p className="text-xs text-gray-900">No: {user.kycDetails?.dl?.idNumber || 'N/A'}</p>
                    <p className="text-xs text-gray-900">DOB: {user.kycDetails?.dl?.dob || 'N/A'}</p>
                    <p className="text-[10px] text-gray-500">Status: {user.kycDetails?.dl?.isVerified ? 'Verified' : 'Not Verified'}</p>
                    {user.kycDetails?.dl?.verifiedAt && <p className="text-[10px] text-gray-500">Date: {new Date(user.kycDetails.dl.verifiedAt).toLocaleDateString()}</p>}
                  </div>

                  {/* Basic Verification */}
                  <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                    <h4 className="text-xs font-bold mb-1">Basic Verification</h4>
                    <p className="text-[10px] text-gray-700">Phone: {user.isPhoneVerified ? '✅ Verified' : '❌ Pending'}</p>
                    <p className="text-[10px] text-gray-700">Email: {user.isEmailVerified ? '✅ Verified' : '❌ Pending'}</p>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'referrals' && (
              <div>
                <p className="text-xs text-gray-500">Referral details will be displayed here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;

