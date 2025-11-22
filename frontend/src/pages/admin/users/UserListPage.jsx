import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';

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

  // Mock users data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 98765 43210',
          profileCompletion: 100,
          kycStatus: 'verified',
          accountStatus: 'active',
          userType: 'regular',
          registrationDate: '2024-01-15',
          avatar: null,
          totalBookings: 12,
          totalSpent: 45000,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+91 98765 43211',
          profileCompletion: 85,
          kycStatus: 'pending',
          accountStatus: 'active',
          userType: 'guarantor',
          registrationDate: '2024-02-20',
          avatar: null,
          totalBookings: 5,
          totalSpent: 18000,
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.j@example.com',
          phone: '+91 98765 43212',
          profileCompletion: 100,
          kycStatus: 'verified',
          accountStatus: 'suspended',
          userType: 'owner',
          registrationDate: '2023-12-10',
          avatar: null,
          totalBookings: 0,
          totalSpent: 0,
          carsOwned: 3,
        },
        {
          id: '4',
          name: 'Sarah Williams',
          email: 'sarah.w@example.com',
          phone: '+91 98765 43213',
          profileCompletion: 60,
          kycStatus: 'rejected',
          accountStatus: 'active',
          userType: 'regular',
          registrationDate: '2024-03-05',
          avatar: null,
          totalBookings: 2,
          totalSpent: 8000,
        },
        {
          id: '5',
          name: 'David Brown',
          email: 'david.b@example.com',
          phone: '+91 98765 43214',
          profileCompletion: 100,
          kycStatus: 'verified',
          accountStatus: 'active',
          userType: 'regular',
          registrationDate: '2024-01-28',
          avatar: null,
          totalBookings: 8,
          totalSpent: 32000,
        },
        {
          id: '6',
          name: 'Emily Davis',
          email: 'emily.d@example.com',
          phone: '+91 98765 43215',
          profileCompletion: 90,
          kycStatus: 'pending',
          accountStatus: 'active',
          userType: 'guarantor',
          registrationDate: '2024-02-15',
          avatar: null,
          totalBookings: 3,
          totalSpent: 12000,
        },
        {
          id: '7',
          name: 'Robert Wilson',
          email: 'robert.w@example.com',
          phone: '+91 98765 43216',
          profileCompletion: 100,
          kycStatus: 'verified',
          accountStatus: 'banned',
          userType: 'regular',
          registrationDate: '2023-11-20',
          avatar: null,
          totalBookings: 15,
          totalSpent: 55000,
        },
        {
          id: '8',
          name: 'Lisa Anderson',
          email: 'lisa.a@example.com',
          phone: '+91 98765 43217',
          profileCompletion: 100,
          kycStatus: 'verified',
          accountStatus: 'active',
          userType: 'owner',
          registrationDate: '2024-01-05',
          avatar: null,
          totalBookings: 0,
          totalSpent: 0,
          carsOwned: 5,
        },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and search users
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone.includes(query)
      );
    }

    // Account status filter
    if (filters.accountStatus !== 'all') {
      filtered = filtered.filter((user) => user.accountStatus === filters.accountStatus);
    }

    // KYC status filter
    if (filters.kycStatus !== 'all') {
      filtered = filtered.filter((user) => user.kycStatus === filters.kycStatus);
    }

    // Profile completion filter
    if (filters.profileCompletion === 'complete') {
      filtered = filtered.filter((user) => user.profileCompletion === 100);
    } else if (filters.profileCompletion === 'incomplete') {
      filtered = filtered.filter((user) => user.profileCompletion < 100);
    }

    // User type filter
    if (filters.userType !== 'all') {
      filtered = filtered.filter((user) => user.userType === filters.userType);
    }

    // Registration date filter
    if (filters.registrationDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter((user) => {
        const regDate = new Date(user.registrationDate);
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
  const handleUserAction = (userId, action) => {
    // In real app, this would make an API call
    console.log(`Action: ${action} for user: ${userId}`);
    
    // Update user status locally
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          if (action === 'suspend') {
            return { ...user, accountStatus: 'suspended' };
          } else if (action === 'activate') {
            return { ...user, accountStatus: 'active' };
          } else if (action === 'ban') {
            return { ...user, accountStatus: 'banned' };
          }
        }
        return user;
      })
    );
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
    kycPending: users.filter((u) => u.kycStatus === 'pending').length,
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
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>
                User Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manage all users and their accounts</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 max-w-4xl">
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.total}
            </div>
            <div className="text-xs text-gray-600">Total Users</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-green-600">{stats.active}</div>
            <div className="text-xs text-gray-600">Active</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-yellow-600">{stats.suspended}</div>
            <div className="text-xs text-gray-600">Suspended</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-red-600">{stats.banned}</div>
            <div className="text-xs text-gray-600">Banned</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-orange-600">{stats.kycPending}</div>
            <div className="text-xs text-gray-600">KYC Pending</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 md:p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Account Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Account Status</label>
              <select
                value={filters.accountStatus}
                onChange={(e) => setFilters({ ...filters, accountStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* KYC Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">KYC Status</label>
              <select
                value={filters.kycStatus}
                onChange={(e) => setFilters({ ...filters, kycStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Profile Completion Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profile</label>
              <select
                value={filters.profileCompletion}
                onChange={(e) => setFilters({ ...filters, profileCompletion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>

            {/* User Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="regular">Regular</option>
                <option value="guarantor">Guarantor</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            {/* Registration Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Registered</label>
              <select
                value={filters.registrationDate}
                onChange={(e) => setFilters({ ...filters, registrationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 hover:shadow-lg transition-all cursor-pointer relative" onClick={() => handleViewUser(user)}>
              {/* Status Badges - Top Right */}
              <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(user.accountStatus)}`}>
                  {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(user.kycStatus)}`}>
                  KYC: {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
                </span>
              </div>

              <div className="flex items-start gap-3 pr-20">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{user.name}</h3>
                  <p className="text-xs text-gray-500 mb-1 truncate">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                {user.accountStatus === 'active' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserAction(user.id, 'suspend');
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserAction(user.id, 'activate');
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserAction(user.id, 'ban');
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
          <Card className="p-8 text-center">
            <p className="text-gray-600">No users found matching your filters.</p>
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
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
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['profile', 'bookings', 'payments', 'kyc', 'referrals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">User Type</label>
                    <p className="text-sm text-gray-900 capitalize">{user.userType}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Account Status</label>
                    <p className="text-sm text-gray-900 capitalize">{user.accountStatus}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">KYC Status</label>
                    <p className="text-sm text-gray-900 capitalize">{user.kycStatus}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Profile Completion</label>
                    <p className="text-sm text-gray-900">{user.profileCompletion}%</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Registration Date</label>
                    <p className="text-sm text-gray-900">{new Date(user.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <p className="text-gray-600">Total Bookings: {user.totalBookings}</p>
                <p className="text-sm text-gray-500 mt-2">Booking history will be displayed here...</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <p className="text-gray-600">Total Spent: ₹{user.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Payment history will be displayed here...</p>
              </div>
            )}

            {activeTab === 'kyc' && (
              <div>
                <p className="text-gray-600">KYC Status: {user.kycStatus}</p>
                <p className="text-sm text-gray-500 mt-2">KYC documents will be displayed here...</p>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div>
                <p className="text-sm text-gray-500">Referral details will be displayed here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {user.accountStatus === 'active' ? (
            <button
              onClick={() => {
                onAction(user.id, 'suspend');
                onClose();
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Suspend Account
            </button>
          ) : (
            <button
              onClick={() => {
                onAction(user.id, 'activate');
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

