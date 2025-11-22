import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';

/**
 * Guarantor List Page
 * Admin can view, filter, and manage all guarantor relationships
 * No localStorage or Redux - All state managed via React hooks
 */
const GuarantorListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial status from URL
  const getInitialStatus = () => {
    if (location.pathname.includes('/pending')) return 'pending';
    return 'all';
  };

  // State management
  const [guarantors, setGuarantors] = useState([]);
  const [filteredGuarantors, setFilteredGuarantors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuarantor, setSelectedGuarantor] = useState(null);
  const [showGuarantorDetail, setShowGuarantorDetail] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    verificationStatus: getInitialStatus(), // all, verified, pending, rejected
    invitationStatus: 'all', // all, sent, accepted, pending, expired
    linkedUser: 'all', // all or specific user
  });

  // Mock guarantor data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockGuarantors = [
        {
          id: '1',
          guarantorId: 'g1',
          guarantorName: 'Rajesh Kumar',
          guarantorEmail: 'rajesh.k@example.com',
          guarantorPhone: '+91 98765 43220',
          guarantorKYCStatus: 'verified',
          verificationStatus: 'verified',
          verificationDate: '2024-03-10T10:00:00',
          linkedUserId: '1',
          linkedUserName: 'John Doe',
          linkedUserEmail: 'john.doe@example.com',
          invitationStatus: 'accepted',
          invitationSentDate: '2024-03-05T09:00:00',
          invitationAcceptedDate: '2024-03-08T14:30:00',
          linkedBookings: 3,
          avatar: null,
        },
        {
          id: '2',
          guarantorId: 'g2',
          guarantorName: 'Priya Sharma',
          guarantorEmail: 'priya.s@example.com',
          guarantorPhone: '+91 98765 43221',
          guarantorKYCStatus: 'pending',
          verificationStatus: 'pending',
          linkedUserId: '2',
          linkedUserName: 'Jane Smith',
          linkedUserEmail: 'jane.smith@example.com',
          invitationStatus: 'accepted',
          invitationSentDate: '2024-03-12T11:00:00',
          invitationAcceptedDate: '2024-03-13T16:00:00',
          linkedBookings: 1,
          avatar: null,
        },
        {
          id: '3',
          guarantorId: 'g3',
          guarantorName: 'Amit Patel',
          guarantorEmail: 'amit.p@example.com',
          guarantorPhone: '+91 98765 43222',
          guarantorKYCStatus: 'verified',
          verificationStatus: 'verified',
          verificationDate: '2024-03-15T12:00:00',
          linkedUserId: '5',
          linkedUserName: 'David Brown',
          linkedUserEmail: 'david.b@example.com',
          invitationStatus: 'accepted',
          invitationSentDate: '2024-03-10T10:00:00',
          invitationAcceptedDate: '2024-03-11T09:00:00',
          linkedBookings: 5,
          avatar: null,
        },
        {
          id: '4',
          guarantorId: 'g4',
          guarantorName: 'Sneha Reddy',
          guarantorEmail: 'sneha.r@example.com',
          guarantorPhone: '+91 98765 43223',
          guarantorKYCStatus: 'rejected',
          verificationStatus: 'rejected',
          rejectionDate: '2024-03-14T15:00:00',
          rejectionReason: 'KYC verification failed',
          linkedUserId: '6',
          linkedUserName: 'Emily Davis',
          linkedUserEmail: 'emily.d@example.com',
          invitationStatus: 'accepted',
          invitationSentDate: '2024-03-08T08:00:00',
          invitationAcceptedDate: '2024-03-09T10:00:00',
          linkedBookings: 0,
          avatar: null,
        },
        {
          id: '5',
          guarantorId: 'g5',
          guarantorName: 'Vikram Singh',
          guarantorEmail: 'vikram.s@example.com',
          guarantorPhone: '+91 98765 43224',
          guarantorKYCStatus: 'pending',
          verificationStatus: 'pending',
          linkedUserId: '4',
          linkedUserName: 'Sarah Williams',
          linkedUserEmail: 'sarah.w@example.com',
          invitationStatus: 'sent',
          invitationSentDate: '2024-03-16T10:00:00',
          linkedBookings: 0,
          avatar: null,
        },
        {
          id: '6',
          guarantorId: 'g6',
          guarantorName: 'Anita Desai',
          guarantorEmail: 'anita.d@example.com',
          guarantorPhone: '+91 98765 43225',
          guarantorKYCStatus: 'verified',
          verificationStatus: 'verified',
          verificationDate: '2024-03-12T11:00:00',
          linkedUserId: '7',
          linkedUserName: 'Robert Wilson',
          linkedUserEmail: 'robert.w@example.com',
          invitationStatus: 'accepted',
          invitationSentDate: '2024-03-05T09:00:00',
          invitationAcceptedDate: '2024-03-06T12:00:00',
          linkedBookings: 8,
          avatar: null,
        },
        {
          id: '7',
          guarantorId: 'g7',
          guarantorName: 'Mohammed Ali',
          guarantorEmail: 'mohammed.a@example.com',
          guarantorPhone: '+91 98765 43226',
          guarantorKYCStatus: 'pending',
          verificationStatus: 'pending',
          linkedUserId: '8',
          linkedUserName: 'Lisa Anderson',
          linkedUserEmail: 'lisa.a@example.com',
          invitationStatus: 'pending',
          invitationSentDate: '2024-03-17T09:00:00',
          linkedBookings: 0,
          avatar: null,
        },
        {
          id: '8',
          guarantorId: 'g8',
          guarantorName: 'Deepak Mehta',
          guarantorEmail: 'deepak.m@example.com',
          guarantorPhone: '+91 98765 43227',
          guarantorKYCStatus: 'verified',
          verificationStatus: 'pending',
          linkedUserId: '1',
          linkedUserName: 'John Doe',
          linkedUserEmail: 'john.doe@example.com',
          invitationStatus: 'accepted',
          invitationSentDate: '2024-03-15T10:00:00',
          invitationAcceptedDate: '2024-03-16T14:00:00',
          linkedBookings: 0,
          avatar: null,
        },
      ];
      setGuarantors(mockGuarantors);
      setFilteredGuarantors(mockGuarantors);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and search guarantors
  useEffect(() => {
    let filtered = [...guarantors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (guarantor) =>
          guarantor.guarantorName.toLowerCase().includes(query) ||
          guarantor.guarantorEmail.toLowerCase().includes(query) ||
          guarantor.guarantorPhone.includes(query) ||
          guarantor.linkedUserName.toLowerCase().includes(query) ||
          guarantor.linkedUserEmail.toLowerCase().includes(query)
      );
    }

    // Verification status filter
    if (filters.verificationStatus !== 'all') {
      filtered = filtered.filter((guarantor) => guarantor.verificationStatus === filters.verificationStatus);
    }

    // Invitation status filter
    if (filters.invitationStatus !== 'all') {
      filtered = filtered.filter((guarantor) => guarantor.invitationStatus === filters.invitationStatus);
    }

    // Linked user filter
    if (filters.linkedUser !== 'all') {
      filtered = filtered.filter((guarantor) => guarantor.linkedUserId === filters.linkedUser);
    }

    setFilteredGuarantors(filtered);
  }, [guarantors, searchQuery, filters]);

  // Handle guarantor actions
  const handleVerify = (guarantorId) => {
    setGuarantors((prevList) =>
      prevList.map((guarantor) => {
        if (guarantor.id === guarantorId) {
          return {
            ...guarantor,
            verificationStatus: 'verified',
            verificationDate: new Date().toISOString(),
          };
        }
        return guarantor;
      })
    );
  };

  const handleReject = (guarantorId, reason) => {
    setGuarantors((prevList) =>
      prevList.map((guarantor) => {
        if (guarantor.id === guarantorId) {
          return {
            ...guarantor,
            verificationStatus: 'rejected',
            rejectionDate: new Date().toISOString(),
            rejectionReason: reason,
          };
        }
        return guarantor;
      })
    );
  };

  const handleRemoveLink = (guarantorId) => {
    // In real app, this would make an API call
    setGuarantors((prevList) => prevList.filter((guarantor) => guarantor.id !== guarantorId));
  };

  const handleSendReminder = (guarantorId) => {
    // In real app, this would send a reminder notification
    console.log(`Sending reminder to guarantor: ${guarantorId}`);
  };

  const handleViewGuarantor = (guarantor) => {
    setSelectedGuarantor(guarantor);
    setShowGuarantorDetail(true);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-blue-100 text-blue-800',
      sent: 'bg-gray-100 text-gray-800',
      expired: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Stats calculation
  const stats = {
    total: guarantors.length,
    verified: guarantors.filter((g) => g.verificationStatus === 'verified').length,
    pending: guarantors.filter((g) => g.verificationStatus === 'pending').length,
    rejected: guarantors.filter((g) => g.verificationStatus === 'rejected').length,
    activeLinks: guarantors.filter((g) => g.verificationStatus === 'verified' && g.invitationStatus === 'accepted').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading guarantors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>
              Guarantor Management
            </h1>
            <p className="text-sm md:text-base text-gray-600">Manage guarantor relationships and verifications</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 max-w-4xl">
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.total}
            </div>
            <div className="text-xs text-gray-600">Total Guarantors</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-green-600">{stats.verified}</div>
            <div className="text-xs text-gray-600">Verified</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-red-600">{stats.rejected}</div>
            <div className="text-xs text-gray-600">Rejected</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-blue-600">{stats.activeLinks}</div>
            <div className="text-xs text-gray-600">Active Links</div>
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
                placeholder="Search by guarantor name, email, phone, or linked user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Verification Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Verification Status</label>
              <select
                value={filters.verificationStatus}
                onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Invitation Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Invitation Status</label>
              <select
                value={filters.invitationStatus}
                onChange={(e) => setFilters({ ...filters, invitationStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Linked User Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Linked User</label>
              <select
                value={filters.linkedUser}
                onChange={(e) => setFilters({ ...filters, linkedUser: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All Users</option>
                {Array.from(new Set(guarantors.map((g) => g.linkedUserId))).map((userId) => {
                  const guarantor = guarantors.find((g) => g.linkedUserId === userId);
                  return (
                    <option key={userId} value={userId}>
                      {guarantor?.linkedUserName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </Card>

        {/* Guarantors List */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredGuarantors.length}</span> of <span className="font-semibold">{guarantors.length}</span> guarantors
          </p>
        </div>

        <div className="space-y-4">
          {filteredGuarantors.map((guarantor) => (
            <Card key={guarantor.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Guarantor Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      {guarantor.avatar ? (
                        <img src={guarantor.avatar} alt={guarantor.guarantorName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>{guarantor.guarantorName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    {/* Guarantor Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{guarantor.guarantorName}</h3>
                      <p className="text-xs text-gray-500 mb-1">{guarantor.guarantorEmail}</p>
                      <p className="text-xs text-gray-500 mb-2">{guarantor.guarantorPhone}</p>
                      
                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(guarantor.verificationStatus)}`}>
                          {guarantor.verificationStatus.charAt(0).toUpperCase() + guarantor.verificationStatus.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(guarantor.guarantorKYCStatus)}`}>
                          KYC: {guarantor.guarantorKYCStatus.charAt(0).toUpperCase() + guarantor.guarantorKYCStatus.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(guarantor.invitationStatus)}`}>
                          Invitation: {guarantor.invitationStatus.charAt(0).toUpperCase() + guarantor.invitationStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Linked User Info */}
                  <div className="ml-16 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-700 mb-2">Linked User:</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{guarantor.linkedUserName}</p>
                        <p className="text-xs text-gray-500">{guarantor.linkedUserEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Linked Bookings:</p>
                        <p className="text-sm font-semibold text-gray-900">{guarantor.linkedBookings}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="ml-16 mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                    {guarantor.invitationSentDate && (
                      <div>
                        <span className="font-medium">Invited:</span> {new Date(guarantor.invitationSentDate).toLocaleDateString()}
                      </div>
                    )}
                    {guarantor.invitationAcceptedDate && (
                      <div>
                        <span className="font-medium">Accepted:</span> {new Date(guarantor.invitationAcceptedDate).toLocaleDateString()}
                      </div>
                    )}
                    {guarantor.verificationDate && (
                      <div>
                        <span className="font-medium">Verified:</span> {new Date(guarantor.verificationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {guarantor.verificationStatus === 'rejected' && guarantor.rejectionReason && (
                    <div className="ml-16 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-700">{guarantor.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-40">
                  <button
                    onClick={() => handleViewGuarantor(guarantor)}
                    className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    View Details
                  </button>
                  
                  {guarantor.verificationStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(guarantor.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) handleReject(guarantor.id, reason);
                        }}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {guarantor.guarantorKYCStatus === 'pending' && (
                    <button
                      onClick={() => handleSendReminder(guarantor.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      Send KYC Reminder
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove this guarantor link?')) {
                        handleRemoveLink(guarantor.id);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove Link
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredGuarantors.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No guarantors found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* Guarantor Detail Modal */}
      {showGuarantorDetail && selectedGuarantor && (
        <GuarantorDetailModal
          guarantor={selectedGuarantor}
          onClose={() => {
            setShowGuarantorDetail(false);
            setSelectedGuarantor(null);
          }}
          onVerify={handleVerify}
          onReject={handleReject}
          onRemoveLink={handleRemoveLink}
          onSendReminder={handleSendReminder}
        />
      )}
    </div>
  );
};

/**
 * Guarantor Detail Modal Component
 */
const GuarantorDetailModal = ({ guarantor, onClose, onVerify, onReject, onRemoveLink, onSendReminder }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!guarantor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Guarantor Details</h2>
            <p className="text-sm text-gray-600">{guarantor.guarantorName}</p>
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
            {['profile', 'linkedUser', 'bookings', 'history'].map((tab) => (
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
                {tab === 'linkedUser' ? 'Linked User' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guarantor Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{guarantor.guarantorName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{guarantor.guarantorEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{guarantor.guarantorPhone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">KYC Status</label>
                    <p className="text-sm text-gray-900 capitalize">{guarantor.guarantorKYCStatus}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Verification Status</label>
                    <p className="text-sm text-gray-900 capitalize">{guarantor.verificationStatus}</p>
                  </div>
                  {guarantor.verificationDate && (
                    <div>
                      <label className="text-xs font-medium text-gray-700">Verification Date</label>
                      <p className="text-sm text-gray-900">{new Date(guarantor.verificationDate).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'linkedUser' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{guarantor.linkedUserName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{guarantor.linkedUserEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Linked Bookings</label>
                    <p className="text-sm text-gray-900">{guarantor.linkedBookings}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Invitation Status</label>
                    <p className="text-sm text-gray-900 capitalize">{guarantor.invitationStatus}</p>
                  </div>
                  {guarantor.invitationSentDate && (
                    <div>
                      <label className="text-xs font-medium text-gray-700">Invitation Sent</label>
                      <p className="text-sm text-gray-900">{new Date(guarantor.invitationSentDate).toLocaleString()}</p>
                    </div>
                  )}
                  {guarantor.invitationAcceptedDate && (
                    <div>
                      <label className="text-xs font-medium text-gray-700">Invitation Accepted</label>
                      <p className="text-sm text-gray-900">{new Date(guarantor.invitationAcceptedDate).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Linked Bookings</h3>
                <p className="text-gray-600">Total Bookings: {guarantor.linkedBookings}</p>
                <p className="text-sm text-gray-500 mt-2">Booking history will be displayed here...</p>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitation History</h3>
                <div className="space-y-3">
                  {guarantor.invitationSentDate && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Invitation Sent</p>
                      <p className="text-xs text-gray-500">{new Date(guarantor.invitationSentDate).toLocaleString()}</p>
                    </div>
                  )}
                  {guarantor.invitationAcceptedDate && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Invitation Accepted</p>
                      <p className="text-xs text-gray-500">{new Date(guarantor.invitationAcceptedDate).toLocaleString()}</p>
                    </div>
                  )}
                  {guarantor.verificationDate && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Verified</p>
                      <p className="text-xs text-gray-500">{new Date(guarantor.verificationDate).toLocaleString()}</p>
                    </div>
                  )}
                  {guarantor.rejectionDate && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Rejected</p>
                      <p className="text-xs text-gray-500">{new Date(guarantor.rejectionDate).toLocaleString()}</p>
                      {guarantor.rejectionReason && (
                        <p className="text-xs text-red-700 mt-1">{guarantor.rejectionReason}</p>
                      )}
                    </div>
                  )}
                </div>
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
          {guarantor.verificationStatus === 'pending' && (
            <>
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => {
                      onVerify(guarantor.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <div className="flex-1">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (rejectReason.trim()) {
                          onReject(guarantor.id, rejectReason);
                          onClose();
                        }
                      }}
                      disabled={!rejectReason.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          {guarantor.guarantorKYCStatus === 'pending' && (
            <button
              onClick={() => {
                onSendReminder(guarantor.id);
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Send KYC Reminder
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to remove this guarantor link?')) {
                onRemoveLink(guarantor.id);
                onClose();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuarantorListPage;

