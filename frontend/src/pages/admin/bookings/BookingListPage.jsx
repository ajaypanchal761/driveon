import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';

/**
 * Booking List Page
 * Admin can view, filter, and manage all bookings
 * No localStorage or Redux - All state managed via React hooks
 */
const BookingListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial status from URL
  const getInitialStatus = () => {
    if (location.pathname.includes('/pending')) return 'pending';
    if (location.pathname.includes('/active')) return 'active';
    return 'all';
  };

  // State management
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: getInitialStatus(), // all, pending, confirmed, active, completed, cancelled
    paymentStatus: 'all', // all, paid, pending, refunded
    dateRange: 'all', // all, today, week, month
    car: 'all',
    user: 'all',
  });

  // Mock bookings data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: '1',
          bookingId: 'BK001',
          userId: '1',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+91 98765 43210',
          guarantorId: 'g1',
          guarantorName: 'Rajesh Kumar',
          carId: '1',
          carName: 'Toyota Camry 2022',
          carOwner: 'Mike Johnson',
          status: 'confirmed',
          paymentStatus: 'paid',
          totalAmount: 15000,
          paidAmount: 15000,
          pickupDate: '2024-03-20',
          pickupTime: '10:00 AM',
          dropDate: '2024-03-22',
          dropTime: '10:00 AM',
          pickupLocation: 'Mumbai Airport',
          dropLocation: 'Mumbai Airport',
          bookingDate: '2024-03-15T10:00:00',
          days: 2,
        },
        {
          id: '2',
          bookingId: 'BK002',
          userId: '2',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          userPhone: '+91 98765 43211',
          guarantorId: 'g2',
          guarantorName: 'Priya Sharma',
          carId: '4',
          carName: 'Maruti Swift 2022',
          carOwner: 'Lisa Anderson',
          status: 'pending',
          paymentStatus: 'pending',
          totalAmount: 4800,
          paidAmount: 0,
          pickupDate: '2024-03-25',
          pickupTime: '09:00 AM',
          dropDate: '2024-03-27',
          dropTime: '09:00 AM',
          pickupLocation: 'Delhi Central',
          dropLocation: 'Delhi Central',
          bookingDate: '2024-03-16T14:30:00',
          days: 2,
        },
        {
          id: '3',
          bookingId: 'BK003',
          userId: '5',
          userName: 'David Brown',
          userEmail: 'david.b@example.com',
          userPhone: '+91 98765 43214',
          guarantorId: 'g3',
          guarantorName: 'Amit Patel',
          carId: '3',
          carName: 'BMW 7 Series 2023',
          carOwner: 'Mike Johnson',
          status: 'active',
          paymentStatus: 'paid',
          totalAmount: 50000,
          paidAmount: 50000,
          pickupDate: '2024-03-18',
          pickupTime: '11:00 AM',
          dropDate: '2024-03-20',
          dropTime: '11:00 AM',
          pickupLocation: 'Mumbai Downtown',
          dropLocation: 'Mumbai Downtown',
          bookingDate: '2024-03-10T09:00:00',
          days: 2,
          currentLocation: 'Mumbai - Bandra',
        },
        {
          id: '4',
          bookingId: 'BK004',
          userId: '7',
          userName: 'Robert Wilson',
          userEmail: 'robert.w@example.com',
          userPhone: '+91 98765 43216',
          guarantorId: 'g6',
          guarantorName: 'Anita Desai',
          carId: '7',
          carName: 'Tata Nexon 2022',
          carOwner: 'Lisa Anderson',
          status: 'completed',
          paymentStatus: 'paid',
          totalAmount: 14400,
          paidAmount: 14400,
          pickupDate: '2024-03-10',
          pickupTime: '08:00 AM',
          dropDate: '2024-03-12',
          dropTime: '08:00 AM',
          pickupLocation: 'Pune Station',
          dropLocation: 'Pune Station',
          bookingDate: '2024-03-05T12:00:00',
          days: 2,
          completedDate: '2024-03-12T08:30:00',
          rating: 4.5,
        },
        {
          id: '5',
          bookingId: 'BK005',
          userId: '1',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userPhone: '+91 98765 43210',
          guarantorId: 'g1',
          guarantorName: 'Rajesh Kumar',
          carId: '1',
          carName: 'Toyota Camry 2022',
          carOwner: 'Mike Johnson',
          status: 'cancelled',
          paymentStatus: 'refunded',
          totalAmount: 15000,
          paidAmount: 15000,
          refundAmount: 15000,
          pickupDate: '2024-03-12',
          pickupTime: '10:00 AM',
          dropDate: '2024-03-14',
          dropTime: '10:00 AM',
          pickupLocation: 'Mumbai Airport',
          dropLocation: 'Mumbai Airport',
          bookingDate: '2024-03-08T10:00:00',
          days: 2,
          cancelledDate: '2024-03-11T15:00:00',
          cancellationReason: 'User requested cancellation',
        },
        {
          id: '6',
          bookingId: 'BK006',
          userId: '5',
          userName: 'David Brown',
          userEmail: 'david.b@example.com',
          userPhone: '+91 98765 43214',
          guarantorId: 'g3',
          guarantorName: 'Amit Patel',
          carId: '4',
          carName: 'Maruti Swift 2022',
          carOwner: 'Lisa Anderson',
          status: 'pending',
          paymentStatus: 'pending',
          totalAmount: 8000,
          paidAmount: 0,
          pickupDate: '2024-03-28',
          pickupTime: '10:00 AM',
          dropDate: '2024-03-30',
          dropTime: '10:00 AM',
          pickupLocation: 'Bangalore City',
          dropLocation: 'Bangalore City',
          bookingDate: '2024-03-17T11:00:00',
          days: 2,
        },
        {
          id: '7',
          bookingId: 'BK007',
          userId: '8',
          userName: 'Lisa Anderson',
          userEmail: 'lisa.a@example.com',
          userPhone: '+91 98765 43217',
          guarantorId: null,
          guarantorName: null,
          carId: '2',
          carName: 'Honda City 2023',
          carOwner: 'Lisa Anderson',
          status: 'confirmed',
          paymentStatus: 'paid',
          totalAmount: 7200,
          paidAmount: 7200,
          pickupDate: '2024-03-22',
          pickupTime: '09:00 AM',
          dropDate: '2024-03-24',
          dropTime: '09:00 AM',
          pickupLocation: 'Delhi Airport',
          dropLocation: 'Delhi Airport',
          bookingDate: '2024-03-15T16:00:00',
          days: 2,
        },
        {
          id: '8',
          bookingId: 'BK008',
          userId: '6',
          userName: 'Emily Davis',
          userEmail: 'emily.d@example.com',
          userPhone: '+91 98765 43215',
          guarantorId: 'g2',
          guarantorName: 'Priya Sharma',
          carId: '7',
          carName: 'Tata Nexon 2022',
          carOwner: 'Lisa Anderson',
          status: 'active',
          paymentStatus: 'paid',
          totalAmount: 18000,
          paidAmount: 18000,
          pickupDate: '2024-03-19',
          pickupTime: '08:00 AM',
          dropDate: '2024-03-22',
          dropTime: '08:00 AM',
          pickupLocation: 'Pune Station',
          dropLocation: 'Pune Station',
          bookingDate: '2024-03-12T10:00:00',
          days: 3,
          currentLocation: 'Pune - Hinjewadi',
        },
      ];
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and search bookings
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.bookingId.toLowerCase().includes(query) ||
          booking.userName.toLowerCase().includes(query) ||
          booking.userEmail.toLowerCase().includes(query) ||
          booking.carName.toLowerCase().includes(query) ||
          booking.carOwner.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((booking) => booking.status === filters.status);
    }

    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter((booking) => booking.paymentStatus === filters.paymentStatus);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        switch (filters.dateRange) {
          case 'today':
            return bookingDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return bookingDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return bookingDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Car filter
    if (filters.car !== 'all') {
      filtered = filtered.filter((booking) => booking.carId === filters.car);
    }

    // User filter
    if (filters.user !== 'all') {
      filtered = filtered.filter((booking) => booking.userId === filters.user);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, filters]);

  // Handle booking actions
  const handleApprove = (bookingId) => {
    setBookings((prevList) =>
      prevList.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, status: 'confirmed' };
        }
        return booking;
      })
    );
  };

  const handleReject = (bookingId) => {
    setBookings((prevList) =>
      prevList.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, status: 'cancelled', cancellationReason: 'Rejected by admin' };
        }
        return booking;
      })
    );
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings((prevList) =>
        prevList.map((booking) => {
          if (booking.id === bookingId) {
            return {
              ...booking,
              status: 'cancelled',
              cancellationReason: 'Cancelled by admin',
            };
          }
          return booking;
        })
      );
    }
  };

  const handleProcessRefund = (bookingId) => {
    if (window.confirm('Process refund for this booking?')) {
      setBookings((prevList) =>
        prevList.map((booking) => {
          if (booking.id === bookingId) {
            return {
              ...booking,
              paymentStatus: 'refunded',
              refundAmount: booking.totalAmount,
            };
          }
          return booking;
        })
      );
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetail(true);
  };

  const handleExport = () => {
    // In real app, this would generate and download CSV/Excel
    console.log('Exporting bookings data...');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get unique cars using Map to handle duplicates by ID
  const carsMap = new Map();
  bookings.forEach((booking) => {
    if (booking.carId && booking.carName) {
      carsMap.set(booking.carId, {
        id: booking.carId,
        name: booking.carName,
      });
    }
  });
  const cars = Array.from(carsMap.values());

  // Get unique users using Map to handle duplicates by ID
  const usersMap = new Map();
  bookings.forEach((booking) => {
    if (booking.userId && booking.userName) {
      usersMap.set(booking.userId, {
        id: booking.userId,
        name: booking.userName,
      });
    }
  });
  const users = Array.from(usersMap.values());

  // Stats calculation
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    active: bookings.filter((b) => b.status === 'active').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter((b) => b.status === 'completed' || b.status === 'active')
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading bookings...</p>
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
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>
                Booking Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manage all bookings and trips</p>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.total}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-yellow-600">{stats.pending}</div>
            <div className="text-xs md:text-sm text-gray-600">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-blue-600">{stats.confirmed}</div>
            <div className="text-xs md:text-sm text-gray-600">Confirmed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-green-600">{stats.active}</div>
            <div className="text-xs md:text-sm text-gray-600">Active</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-gray-600">{stats.completed}</div>
            <div className="text-xs md:text-sm text-gray-600">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              ₹{(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-xs md:text-sm text-gray-600">Revenue</div>
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
                placeholder="Search by booking ID, user name, email, car name, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Booking Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Car Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Car</label>
              <select
                value={filters.car}
                onChange={(e) => setFilters({ ...filters, car: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Cars</option>
                {cars.map((car, index) => (
                  <option key={car.id || `car-${index}`} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>

            {/* User Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">User</label>
              <select
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Users</option>
                {users.map((user, index) => (
                  <option key={user.id || `user-${index}`} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Bookings List */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredBookings.length}</span> of <span className="font-semibold">{bookings.length}</span> bookings
          </p>
        </div>

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {booking.bookingId} - {booking.carName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {booking.userName} • {booking.userEmail}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                        Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Pickup</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{booking.pickupTime}</p>
                      <p className="text-xs text-gray-500">{booking.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Drop</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.dropDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{booking.dropTime}</p>
                      <p className="text-xs text-gray-500">{booking.dropLocation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.days} days</p>
                      <p className="text-xs text-gray-500">Owner: {booking.carOwner}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Amount</p>
                      <p className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                        ₹{booking.totalAmount.toLocaleString()}
                      </p>
                      {booking.guarantorName && (
                        <p className="text-xs text-gray-500">Guarantor: {booking.guarantorName}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <span>Booked: {new Date(booking.bookingDate).toLocaleString()}</span>
                    {booking.status === 'active' && booking.currentLocation && (
                      <span className="text-green-600 font-medium">📍 {booking.currentLocation}</span>
                    )}
                    {booking.status === 'completed' && booking.completedDate && (
                      <span>Completed: {new Date(booking.completedDate).toLocaleString()}</span>
                    )}
                    {booking.status === 'cancelled' && booking.cancellationReason && (
                      <span className="text-red-600">Reason: {booking.cancellationReason}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-40">
                  <button
                    onClick={() => handleViewBooking(booking)}
                    className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    View Details
                  </button>
                  
                  {booking.status === 'active' && (
                    <button
                      onClick={() => navigate(`/admin/bookings/${booking.id}/tracking`)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Live Tracking
                    </button>
                  )}
                  
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(booking.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {(booking.status === 'confirmed' || booking.status === 'active') && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                  
                  {booking.status === 'cancelled' && booking.paymentStatus === 'paid' && booking.paymentStatus !== 'refunded' && (
                    <button
                      onClick={() => handleProcessRefund(booking.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Process Refund
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No bookings found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showBookingDetail && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowBookingDetail(false);
            setSelectedBooking(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
          onProcessRefund={handleProcessRefund}
        />
      )}
    </div>
  );
};

/**
 * Booking Detail Modal Component
 */
const BookingDetailModal = ({ booking, onClose, onApprove, onReject, onCancel, onProcessRefund }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{booking.bookingId}</h2>
            <p className="text-sm text-gray-600">{booking.carName}</p>
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
            {['details', 'user', 'payment', 'timeline'].map((tab) => (
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
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Car Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Car</label>
                      <p className="text-sm text-gray-900">{booking.carName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Owner</label>
                      <p className="text-sm text-gray-900">{booking.carOwner}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900 capitalize">{booking.status}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Pickup Date & Time</label>
                      <p className="text-sm text-gray-900">
                        {new Date(booking.pickupDate).toLocaleDateString()} at {booking.pickupTime}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{booking.pickupLocation}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Drop Date & Time</label>
                      <p className="text-sm text-gray-900">
                        {new Date(booking.dropDate).toLocaleDateString()} at {booking.dropTime}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{booking.dropLocation}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Duration</label>
                      <p className="text-sm text-gray-900">{booking.days} days</p>
                    </div>
                    {booking.status === 'active' && booking.currentLocation && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">Current Location</label>
                        <p className="text-sm text-green-600 font-medium">📍 {booking.currentLocation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Price per day</span>
                      <span className="text-sm text-gray-900">₹{(booking.totalAmount / booking.days).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Days</span>
                      <span className="text-sm text-gray-900">{booking.days}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                        <span className="text-sm font-bold" style={{ color: theme.colors.primary }}>
                          ₹{booking.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'user' && (
              <div className="space-y-6">
                {/* User Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{booking.userName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{booking.userEmail}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{booking.userPhone}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">User ID</label>
                      <p className="text-sm text-gray-900">{booking.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Guarantor Information */}
                {booking.guarantorName && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Guarantor Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{booking.guarantorName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">Guarantor ID</label>
                        <p className="text-sm text-gray-900">{booking.guarantorId}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Payment Status</label>
                    <p className="text-sm text-gray-900 capitalize">{booking.paymentStatus}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Total Amount</label>
                    <p className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                      ₹{booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Paid Amount</label>
                    <p className="text-sm text-gray-900">₹{booking.paidAmount.toLocaleString()}</p>
                  </div>
                  {booking.refundAmount && (
                    <div>
                      <label className="text-xs font-medium text-gray-700">Refund Amount</label>
                      <p className="text-sm text-gray-900">₹{booking.refundAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Booking Created</p>
                    <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleString()}</p>
                  </div>
                  {booking.status === 'confirmed' && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Booking Confirmed</p>
                      <p className="text-xs text-gray-500">Status: Confirmed</p>
                    </div>
                  )}
                  {booking.status === 'active' && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Trip Started</p>
                      <p className="text-xs text-gray-500">Pickup: {new Date(booking.pickupDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {booking.status === 'completed' && booking.completedDate && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Trip Completed</p>
                      <p className="text-xs text-gray-500">{new Date(booking.completedDate).toLocaleString()}</p>
                    </div>
                  )}
                  {booking.status === 'cancelled' && booking.cancellationReason && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Booking Cancelled</p>
                      <p className="text-xs text-gray-500">{booking.cancellationReason}</p>
                      {booking.cancelledDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(booking.cancelledDate).toLocaleString()}
                        </p>
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
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => {
                  onApprove(booking.id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  onReject(booking.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {(booking.status === 'confirmed' || booking.status === 'active') && (
            <button
              onClick={() => {
                onCancel(booking.id);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel Booking
            </button>
          )}
          {booking.status === 'cancelled' && booking.paymentStatus === 'paid' && booking.paymentStatus !== 'refunded' && (
            <button
              onClick={() => {
                onProcessRefund(booking.id);
                onClose();
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Process Refund
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingListPage;

