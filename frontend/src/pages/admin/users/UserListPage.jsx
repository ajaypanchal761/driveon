import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';
import { adminService } from '../../../services/admin.service';
import toastUtils from '../../../config/toast';

/**
 * Helper Functions - Shared between components
 */

// Calculate KYC status from user data
const getKycStatus = (user) => {
  if (!user) return 'pending';
  if (user.isPhoneVerified && user.isEmailVerified) {
    return 'verified';
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
  
  // Extract last 6 characters from ObjectId and convert to number
  const lastChars = userId.toString().slice(-6);
  // Convert hex to decimal, then take modulo to get a number between 0-999
  const num = parseInt(lastChars, 16) % 1000;
  // Pad with zeros to make it 3 digits
  const paddedNum = String(num).padStart(3, '0');
  
  return `USER${paddedNum}`;
};

/**
 * User List Page
 * Admin can view, search, filter, and manage all users
 * No localStorage or Redux - All state managed via React hooks
 */
const UserListPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    accountStatus: 'all', // all, active, suspended, banned
    kycStatus: 'all', // all, verified, pending, rejected
    profileCompletion: 'all', // all, complete, incomplete
    userType: 'all', // all, regular, guarantor, owner
    registrationDate: 'all', // all, today, week, month, year
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllUsers({
          page: 1,
          limit: 1000, // Get all users for now
          search: searchQuery,
          accountStatus: filters.accountStatus,
          kycStatus: filters.kycStatus,
          profileCompletion: filters.profileCompletion,
          userType: filters.userType,
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
  }, [searchQuery, filters.accountStatus, filters.kycStatus, filters.profileCompletion, filters.userType]);

  // Filter users (client-side filtering for additional filters)
  useEffect(() => {
    let filtered = [...users];

    // Registration date filter (client-side only, as backend handles other filters)
    if (filters.registrationDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter((user) => {
        // Use createdAt instead of registrationDate
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
  }, [users, filters.registrationDate]);

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

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleExport = () => {
    // In real app, this would generate and download CSV/Excel
    console.log('Exporting users data...');
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
            style={{ borderColor: theme.colors.primary }}
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
              <h1 className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
                User Management
              </h1>
              <p className="text-xs md:text-sm text-gray-600">Manage all users and their accounts</p>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm rounded-lg text-white font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 max-w-4xl">
          <Card className="p-2 text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5" style={{ color: theme.colors.primary }}>
              {stats.total}
            </div>
            <div className="text-xs text-gray-600">Total Users</div>
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
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {/* Account Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Account Status</label>
              <select
                value={filters.accountStatus}
                onChange={(e) => setFilters({ ...filters, accountStatus: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* KYC Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">KYC Status</label>
              <select
                value={filters.kycStatus}
                onChange={(e) => setFilters({ ...filters, kycStatus: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Profile Completion Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Profile</label>
              <select
                value={filters.profileCompletion}
                onChange={(e) => setFilters({ ...filters, profileCompletion: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>

            {/* User Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">User Type</label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All</option>
                <option value="regular">Regular</option>
                <option value="guarantor">Guarantor</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            {/* Registration Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-0.5">Registered</label>
              <select
                value={filters.registrationDate}
                onChange={(e) => setFilters({ ...filters, registrationDate: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Users List */}
        <div className="mb-3">
          <p className="text-xs text-gray-600">
            Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUsers.map((user) => (
            <Card key={user._id || user.id} className="p-3 hover:shadow-lg transition-all cursor-pointer relative" onClick={() => handleViewUser(user)}>
              {/* Status Badges - Top Right */}
              <div className="absolute top-2 right-2 flex flex-col gap-0.5 items-end">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(user.accountStatus || 'active')}`}>
                  {capitalize(user.accountStatus || 'active')}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(getKycStatus(user))}`}>
                  KYC: {capitalize(getKycStatus(user))}
                </span>
              </div>

              <div className="flex items-start gap-2 pr-16">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xs">{getFirstChar(user.name || user.email || 'U')}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">{user.name || 'No Name'}</h3>
                  <p className="text-xs text-gray-500 mb-0.5 truncate">{user.email || 'No Email'}</p>
                  <p className="text-xs text-gray-500">{user.phone || 'No Phone'}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                {(user.accountStatus || 'active') === 'active' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserAction(getUserId(user), 'suspend');
                    }}
                    className="flex-1 px-2 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded hover:bg-yellow-100 transition-colors"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserAction(getUserId(user), 'activate');
                    }}
                    className="flex-1 px-2 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserAction(getUserId(user), 'ban');
                  }}
                  className="flex-1 px-2 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                >
                  Ban
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewUser(user);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  View
                </button>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-4 text-center">
            <p className="text-sm text-gray-600">No users found matching your filters.</p>
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

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
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
                className={`px-3 py-1.5 font-medium text-xs transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === tab ? { borderBottomColor: theme.colors.primary } : {}}
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
              <div>
                <p className="text-sm text-gray-600">KYC Status: {capitalize(getKycStatus(user))}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Phone Verified: {user.isPhoneVerified ? 'Yes' : 'No'}
                </p>
                <p className="text-xs text-gray-500">Email Verified: {user.isEmailVerified ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-500 mt-1">KYC documents will be displayed here...</p>
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
          {user.accountStatus === 'active' ? (
            <button
              onClick={() => {
                onAction(getUserId(user), 'suspend');
                onClose();
              }}
              className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Suspend Account
            </button>
          ) : (
            <button
              onClick={() => {
                onAction(getUserId(user), 'activate');
                onClose();
              }}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Activate Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;

