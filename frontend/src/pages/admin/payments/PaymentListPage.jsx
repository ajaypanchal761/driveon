import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../module/theme/colors';
import Card from '../../../components/common/Card';
import AdminCustomSelect from '../../../components/admin/common/AdminCustomSelect';
import { adminService } from '../../../services/admin.service';
import toastUtils from '../../../config/toast';

/**
 * Payment List Page
 * Admin can view, filter, and manage all payment transactions
 * No localStorage or Redux - All state managed via React hooks
 */
const PaymentListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial status from URL
  const getInitialStatus = () => {
    if (location.pathname.includes('/pending')) return 'pending';
    if (location.pathname.includes('/failed')) return 'failed';
    return 'all';
  };

  // State management
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: getInitialStatus(), // all, success, failed, pending, refunded
    paymentType: 'all', // all, full, partial, security_deposit
    dateRange: 'all', // all, today, week, month
    user: 'all',
    booking: 'all',
  });

  // Fetch payments from API (extract from bookings transactions)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        
        // Get all bookings to extract transactions
        const response = await adminService.getAllBookings({
          page: 1,
          limit: 1000, // Get all bookings to extract all transactions
        });
        
        if (response.success && response.data?.bookings) {
          const bookings = response.data.bookings;
          
          // Extract all transactions from bookings
          const allPayments = [];
          
          bookings.forEach((booking) => {
            if (booking.transactions && Array.isArray(booking.transactions)) {
              booking.transactions.forEach((transaction) => {
                // Determine payment type based on booking payment option
                let paymentType = 'full';
                if (booking.paymentOption === 'advance') {
                  // Check if this is advance payment or remaining payment
                  const advanceAmount = booking.pricing?.advancePayment || 0;
                  if (transaction.amount <= advanceAmount) {
                    paymentType = 'partial';
                  } else {
                    paymentType = 'partial'; // Remaining payment
                  }
                }
                
                // Map payment method to display name
                const paymentMethodMap = {
                  'phonepe': 'UPI',
                  'razorpay': transaction.razorpayPaymentId ? 'Credit Card' : 'UPI',
                  'stripe': 'Credit Card',
                };
                
                const paymentMethod = paymentMethodMap[transaction.paymentMethod] || transaction.paymentMethod || 'UPI';
                
                // Map payment gateway
                const paymentGatewayMap = {
                  'phonepe': 'PhonePe',
                  'razorpay': 'Razorpay',
                  'stripe': 'Stripe',
                };
                
                const paymentGateway = paymentGatewayMap[transaction.paymentMethod] || 'Razorpay';
                
                allPayments.push({
                  id: transaction._id?.toString() || transaction.transactionId,
                  transactionId: transaction.transactionId,
                  bookingId: booking.bookingId || booking._id?.toString(),
                  userId: booking.user?._id?.toString() || booking.user?.toString() || '',
                  userName: booking.user?.name || 'Unknown',
                  userEmail: booking.user?.email || '',
                  amount: transaction.amount || 0,
                  paymentType: paymentType,
                  paymentMethod: paymentMethod,
                  paymentGateway: paymentGateway,
                  status: transaction.status || 'pending',
                  timestamp: transaction.paymentDate || transaction.createdAt || booking.createdAt || new Date().toISOString(),
                  bookingDate: booking.bookingDate || booking.createdAt || new Date().toISOString(),
                  invoiceGenerated: booking.paymentStatus === 'paid' || booking.paymentStatus === 'partial',
                  refundAmount: transaction.refundAmount || 0,
                  refundDate: transaction.refundDate || null,
                  failureReason: transaction.status === 'failed' ? 'Payment failed' : null,
                });
              });
            }
          });
          
          // Sort by timestamp (newest first)
          allPayments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          setPayments(allPayments);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        toastUtils.error(error.response?.data?.message || 'Failed to fetch payments');
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);

  // Filter and search payments
  useEffect(() => {
    let filtered = [...payments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.transactionId.toLowerCase().includes(query) ||
          payment.bookingId.toLowerCase().includes(query) ||
          payment.userName.toLowerCase().includes(query) ||
          payment.userEmail.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((payment) => payment.status === filters.status);
    }

    // Payment type filter
    if (filters.paymentType !== 'all') {
      filtered = filtered.filter((payment) => payment.paymentType === filters.paymentType);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.timestamp);
        switch (filters.dateRange) {
          case 'today':
            return paymentDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // User filter
    if (filters.user !== 'all') {
      filtered = filtered.filter((payment) => payment.userId === filters.user);
    }

    // Booking filter
    if (filters.booking !== 'all') {
      filtered = filtered.filter((payment) => payment.bookingId === filters.booking);
    }

    setFilteredPayments(filtered);
  }, [payments, searchQuery, filters]);

  // Handle payment actions
  const handleProcessRefund = (paymentId) => {
    if (window.confirm('Process refund for this transaction?')) {
      setPayments((prevList) =>
        prevList.map((payment) => {
          if (payment.id === paymentId) {
            return {
              ...payment,
              status: 'refunded',
              refundAmount: payment.amount,
              refundDate: new Date().toISOString(),
            };
          }
          return payment;
        })
      );
    }
  };

  const handleMarkAsReceived = (paymentId) => {
    setPayments((prevList) =>
      prevList.map((payment) => {
        if (payment.id === paymentId) {
          return { ...payment, status: 'success' };
        }
        return payment;
      })
    );
  };

  const handleGenerateInvoice = (paymentId) => {
    // In real app, this would generate and download invoice
    setPayments((prevList) =>
      prevList.map((payment) => {
        if (payment.id === paymentId) {
          return { ...payment, invoiceGenerated: true };
        }
        return payment;
      })
    );
    console.log(`Generating invoice for transaction: ${paymentId}`);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  const handleExport = () => {
    // In real app, this would generate and download CSV/Excel
    console.log('Exporting payments data...');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get payment type display name
  const getPaymentTypeName = (type) => {
    const names = {
      full: 'Full Payment',
      partial: 'Partial Payment',
      security_deposit: 'Security Deposit',
    };
    return names[type] || type;
  };

  // Get unique users
  const users = Array.from(
    new Set(
      payments.map((payment) => ({
        id: payment.userId,
        name: payment.userName,
      }))
    )
  );

  // Get unique bookings
  const bookings = Array.from(
    new Set(
      payments.map((payment) => ({
        id: payment.bookingId,
        name: payment.bookingId,
      }))
    )
  );

  // Stats calculation
  const stats = {
    total: payments.length,
    success: payments.filter((p) => p.status === 'success').length,
    failed: payments.filter((p) => p.status === 'failed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    refunded: payments.filter((p) => p.status === 'refunded').length,
    totalRevenue: payments
      .filter((p) => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0),
    totalRefunded: payments
      .filter((p) => p.status === 'refunded')
      .reduce((sum, p) => sum + (p.refundAmount || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.backgroundTertiary }}
          ></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 md:px-6 md:pt-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: colors.backgroundTertiary }}>
                Payment Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manage all payment transactions</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              Export Reports
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: colors.backgroundTertiary }}>
              {stats.total}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-green-600">{stats.success}</div>
            <div className="text-xs md:text-sm text-gray-600">Success</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-red-600">{stats.failed}</div>
            <div className="text-xs md:text-sm text-gray-600">Failed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-yellow-600">{stats.pending}</div>
            <div className="text-xs md:text-sm text-gray-600">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: colors.backgroundTertiary }}>
              ₹{(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs md:text-sm text-gray-600">Revenue</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-purple-600">
              ₹{(stats.totalRefunded / 1000).toFixed(0)}K
            </div>
            <div className="text-xs md:text-sm text-gray-600">Refunded</div>
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
                placeholder="Search by transaction ID, booking ID, user name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Status Filter */}
            <AdminCustomSelect
              label="Payment Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: 'all', label: 'All' },
                { value: 'success', label: 'Success' },
                { value: 'failed', label: 'Failed' },
                { value: 'pending', label: 'Pending' },
                { value: 'refunded', label: 'Refunded' },
              ]}
            />

            {/* Payment Type Filter */}
            <AdminCustomSelect
              label="Payment Type"
              value={filters.paymentType}
              onChange={(value) => setFilters({ ...filters, paymentType: value })}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'full', label: 'Full Payment' },
                { value: 'partial', label: 'Partial Payment' },
                { value: 'security_deposit', label: 'Security Deposit' },
              ]}
            />

            {/* Date Range Filter */}
            <AdminCustomSelect
              label="Date Range"
              value={filters.dateRange}
              onChange={(value) => setFilters({ ...filters, dateRange: value })}
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
              ]}
            />

            {/* User Filter */}
            <AdminCustomSelect
              label="User"
              value={filters.user}
              onChange={(value) => setFilters({ ...filters, user: value })}
              options={[
                { value: 'all', label: 'All Users' },
                ...users.map((user) => ({
                  value: user.id,
                  label: user.name,
                })),
              ]}
            />

            {/* Booking Filter */}
            <AdminCustomSelect
              label="Booking"
              value={filters.booking}
              onChange={(value) => setFilters({ ...filters, booking: value })}
              options={[
                { value: 'all', label: 'All Bookings' },
                ...bookings.map((booking) => ({
                  value: booking.id,
                  label: booking.name,
                })),
              ]}
            />
          </div>
        </Card>

        {/* Payments List */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredPayments.length}</span> of <span className="font-semibold">{payments.length}</span> transactions
          </p>
        </div>

        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Payment Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {payment.transactionId} - {payment.bookingId}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {payment.userName} • {payment.userEmail}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                      {payment.invoiceGenerated && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Invoice
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Amount</p>
                      <p className="text-sm font-semibold" style={{ color: colors.backgroundTertiary }}>
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Payment Type</p>
                      <p className="text-sm text-gray-900">{getPaymentTypeName(payment.paymentType)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Payment Method</p>
                      <p className="text-sm text-gray-900">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Gateway</p>
                      <p className="text-sm text-gray-900">{payment.paymentGateway}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <span>Date: {new Date(payment.timestamp).toLocaleString()}</span>
                    {payment.status === 'failed' && payment.failureReason && (
                      <span className="text-red-600">Reason: {payment.failureReason}</span>
                    )}
                    {payment.status === 'refunded' && payment.refundAmount && (
                      <span className="text-purple-600">
                        Refunded: ₹{payment.refundAmount.toLocaleString()}
                      </span>
                    )}
                    {payment.status === 'refunded' && payment.refundDate && (
                      <span>Refund Date: {new Date(payment.refundDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-40">
                  <button
                    onClick={() => handleViewPayment(payment)}
                    className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                  >
                    View Details
                  </button>
                  
                  {payment.status === 'success' && !payment.invoiceGenerated && (
                    <button
                      onClick={() => handleGenerateInvoice(payment.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate Invoice
                    </button>
                  )}
                  
                  {payment.status === 'success' && payment.status !== 'refunded' && (
                    <button
                      onClick={() => handleProcessRefund(payment.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Process Refund
                    </button>
                  )}
                  
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleMarkAsReceived(payment.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Received
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No payments found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* Payment Detail Modal */}
      {showPaymentDetail && selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => {
            setShowPaymentDetail(false);
            setSelectedPayment(null);
          }}
          onProcessRefund={handleProcessRefund}
          onMarkAsReceived={handleMarkAsReceived}
          onGenerateInvoice={handleGenerateInvoice}
        />
      )}
    </div>
  );
};

/**
 * Payment Detail Modal Component
 */
const PaymentDetailModal = ({ payment, onClose, onProcessRefund, onMarkAsReceived, onGenerateInvoice }) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{payment.transactionId}</h2>
            <p className="text-sm text-gray-600">Booking: {payment.bookingId}</p>
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
          {/* Transaction Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Transaction ID</label>
                <p className="text-sm text-gray-900 font-mono">{payment.transactionId}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Booking ID</label>
                <p className="text-sm text-gray-900">{payment.bookingId}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Amount</label>
                <p className="text-sm font-semibold" style={{ color: colors.backgroundTertiary }}>
                  ₹{payment.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Payment Type</label>
                <p className="text-sm text-gray-900">
                  {payment.paymentType === 'full' ? 'Full Payment' : payment.paymentType === 'partial' ? 'Partial Payment' : 'Security Deposit'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Payment Method</label>
                <p className="text-sm text-gray-900">{payment.paymentMethod}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Payment Gateway</label>
                <p className="text-sm text-gray-900">{payment.paymentGateway}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Status</label>
                <p className="text-sm text-gray-900 capitalize">{payment.status}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Timestamp</label>
                <p className="text-sm text-gray-900">{new Date(payment.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{payment.userName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{payment.userEmail}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">User ID</label>
                <p className="text-sm text-gray-900">{payment.userId}</p>
              </div>
            </div>
          </div>

          {/* Failure/Refund Information */}
          {payment.status === 'failed' && payment.failureReason && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-semibold text-red-800 mb-2">Failure Reason</h4>
              <p className="text-sm text-red-700">{payment.failureReason}</p>
            </div>
          )}

          {payment.status === 'refunded' && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="text-sm font-semibold text-purple-800 mb-2">Refund Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-purple-700">Refund Amount</label>
                  <p className="text-sm font-semibold text-purple-900">
                    ₹{payment.refundAmount?.toLocaleString() || payment.amount.toLocaleString()}
                  </p>
                </div>
                {payment.refundDate && (
                  <div>
                    <label className="text-xs font-medium text-purple-700">Refund Date</label>
                    <p className="text-sm text-purple-900">{new Date(payment.refundDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Invoice Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Invoice Generated</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                payment.invoiceGenerated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {payment.invoiceGenerated ? 'Yes' : 'No'}
              </span>
            </div>
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
          {payment.status === 'success' && !payment.invoiceGenerated && (
            <button
              onClick={() => {
                onGenerateInvoice(payment.id);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Invoice
            </button>
          )}
          {payment.status === 'success' && payment.status !== 'refunded' && (
            <button
              onClick={() => {
                onProcessRefund(payment.id);
                onClose();
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Process Refund
            </button>
          )}
          {payment.status === 'pending' && (
            <button
              onClick={() => {
                onMarkAsReceived(payment.id);
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark as Received
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentListPage;

