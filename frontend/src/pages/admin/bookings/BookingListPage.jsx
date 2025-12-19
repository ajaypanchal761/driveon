import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../module/theme/colors';
import Card from '../../../components/common/Card';
import { adminService } from '../../../services/admin.service';
import AdminCustomSelect from '../../../components/admin/common/AdminCustomSelect';

/**
 * Format user ID to USER001 format
 * Takes MongoDB ObjectId and converts to USER + padded number
 */
const formatUserId = (userId) => {
  if (!userId) return 'N/A';
  
  // Extract last 6 characters from ObjectId and convert to number
  const lastChars = userId.slice(-6);
  // Convert hex to decimal, then take modulo to get a number between 0-999
  const num = parseInt(lastChars, 16) % 1000;
  // Pad with zeros to make it 3 digits
  const paddedNum = String(num).padStart(3, '0');
  
  return `USER${paddedNum}`;
};

/**
 * Format time to AM/PM format
 * Converts 24-hour format (HH:mm) to 12-hour format with AM/PM
 */
const formatTimeToAMPM = (timeString) => {
  if (!timeString) return '';
  
  // If already contains AM/PM, return as is
  if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
    return timeString;
  }
  
  // Parse time string (format: HH:mm or HH:mm:ss)
  const timeParts = timeString.split(':');
  if (timeParts.length < 2) return timeString;
  
  let hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  
  if (isNaN(hours) || isNaN(parseInt(minutes, 10))) {
    return timeString;
  }
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

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
  const [error, setError] = useState(null);
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

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminService.getAllBookings({
          status: filters.status !== 'all' ? filters.status : undefined,
          paymentStatus: filters.paymentStatus !== 'all' ? filters.paymentStatus : undefined,
        });
        
        // Extract bookings from response.data (backend returns { success: true, data: { bookings, ... } })
        const bookingsData = response?.data?.bookings || response?.bookings || [];
        
        // Transform API response to match component structure
        const transformedBookings = bookingsData.map((booking) => ({
          id: booking._id || booking.id,
          bookingId: booking.bookingId,
          userId: booking.user?._id || booking.userId,
          userName: booking.user?.name || booking.userName || 'N/A',
          userEmail: booking.user?.email || booking.userEmail || 'N/A',
          userPhone: booking.user?.phone || booking.userPhone || 'N/A',
          guarantorId: booking.guarantor?._id || booking.guarantorId,
          guarantorName: booking.guarantor?.name || booking.guarantorName,
          carId: booking.car?._id || booking.carId,
          carName: booking.car ? `${booking.car.brand || ''} ${booking.car.model || ''} ${booking.car.year || ''}`.trim() : booking.carName || 'N/A',
          carOwner: booking.car?.owner || booking.carOwner || 'N/A',
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          totalAmount: booking.pricing?.totalPrice || booking.totalAmount || 0,
          paidAmount: booking.paidAmount || 0,
          refundAmount: booking.refundAmount,
          pickupDate: booking.tripStart?.date || booking.pickupDate || booking.pickupDateTime,
          pickupTime: booking.tripStart?.time || booking.pickupTime || (booking.pickupDateTime ? new Date(booking.pickupDateTime).toLocaleTimeString() : 'N/A'),
          dropDate: booking.tripEnd?.date || booking.dropDate || booking.dropDateTime,
          dropTime: booking.tripEnd?.time || booking.dropTime || (booking.dropDateTime ? new Date(booking.dropDateTime).toLocaleTimeString() : 'N/A'),
          pickupLocation: booking.tripStart?.location || booking.pickupLocation || 'N/A',
          dropLocation: booking.tripEnd?.location || booking.dropLocation || 'N/A',
          bookingDate: booking.createdAt || booking.bookingDate,
          days: booking.totalDays || booking.days || booking.duration || 0,
          currentLocation: booking.currentLocation,
          completedDate: booking.completedDate,
          cancelledDate: booking.cancelledDate,
          cancellationReason: booking.cancellationReason,
          rating: booking.rating,
        })) || [];
        
        setBookings(transformedBookings);
        setFilteredBookings(transformedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          booking.carName.toLowerCase().includes(query)
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
  const handleApprove = async (bookingId) => {
    try {
      // Call backend API to update booking status to confirmed
      const response = await adminService.updateBooking(bookingId, {
        status: 'confirmed',
      });

      if (response.success) {
        // Update local state
        setBookings((prevList) =>
          prevList.map((booking) => {
            if (booking.id === bookingId) {
              return { ...booking, status: 'confirmed' };
            }
            return booking;
          })
        );
        
        // Show success message
        alert('Booking approved successfully! Status changed to Confirmed.');
      } else {
        alert('Failed to approve booking. Please try again.');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
      alert(error.response?.data?.message || 'Failed to approve booking. Please try again.');
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Are you sure you want to reject this booking?')) {
      return;
    }

    try {
      // Call backend API to update booking status to cancelled
      const response = await adminService.updateBooking(bookingId, {
        status: 'cancelled',
        cancellationReason: 'Rejected by admin',
      });

      if (response.success) {
        // Update local state
        setBookings((prevList) =>
          prevList.map((booking) => {
            if (booking.id === bookingId) {
              return { ...booking, status: 'cancelled', cancellationReason: 'Rejected by admin' };
            }
            return booking;
          })
        );
        
        // Show success message
        alert('Booking rejected successfully!');
      } else {
        alert('Failed to reject booking. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert(error.response?.data?.message || 'Failed to reject booking. Please try again.');
    }
  };

  const handleCancel = async (bookingId) => {
    console.log('🔄 handleCancel called with bookingId:', bookingId);
    
    if (!bookingId) {
      console.error('❌ No booking ID provided');
      alert('Error: Booking ID is missing');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      console.log('🔄 Cancelling booking:', bookingId);
      // Call backend API to update booking status to cancelled
      const response = await adminService.updateBooking(bookingId, {
        status: 'cancelled',
        cancellationReason: 'Cancelled by admin',
      });

      console.log('📊 Cancel booking response:', response);
      console.log('📊 Response success:', response?.success);

      if (response && response.success) {
        // Update local state for both bookings and filteredBookings
        setBookings((prevList) => {
          const updated = prevList.map((booking) => {
            if (booking.id === bookingId || booking._id === bookingId) {
              console.log('✅ Updating booking in bookings state:', booking.id);
              return {
                ...booking,
                status: 'cancelled',
                cancellationReason: 'Cancelled by admin',
                cancelledDate: new Date().toISOString(),
              };
            }
            return booking;
          });
          return updated;
        });
        
        // Also update filteredBookings to reflect the change immediately
        setFilteredBookings((prevList) => {
          const updated = prevList.map((booking) => {
            if (booking.id === bookingId || booking._id === bookingId) {
              console.log('✅ Updating booking in filteredBookings state:', booking.id);
              return {
                ...booking,
                status: 'cancelled',
                cancellationReason: 'Cancelled by admin',
                cancelledDate: new Date().toISOString(),
              };
            }
            return booking;
          });
          return updated;
        });
        
        // Show success message
        alert('Booking cancelled successfully!');
        
        // Refresh bookings list to get updated data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error('❌ API returned success: false');
        alert(response?.message || 'Failed to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      alert(error.response?.data?.message || error.message || 'Failed to cancel booking. Please try again.');
    }
  };

  const handleProcessRefund = async (bookingId) => {
    if (!window.confirm('Are you sure you want to process refund for this booking?')) {
      return;
    }

    try {
      // Get the booking to calculate refund amount
      const booking = bookings.find(b => b.id === bookingId);
      const refundAmount = booking?.paidAmount || booking?.totalAmount || 0;

      // Call backend API to update payment status to refunded
      const response = await adminService.updateBooking(bookingId, {
        paymentStatus: 'refunded',
        refundAmount: refundAmount,
      });

      if (response.success) {
        // Update local state
        setBookings((prevList) =>
          prevList.map((booking) => {
            if (booking.id === bookingId) {
              return {
                ...booking,
                paymentStatus: 'refunded',
                refundAmount: refundAmount,
              };
            }
            return booking;
          })
        );
        
        // Show success message
        alert('Refund processed successfully! Payment status updated to refunded. User side will reflect the changes on next refresh.');
      } else {
        alert('Failed to process refund. Please try again.');
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      alert(error.response?.data?.message || 'Failed to process refund. Please try again.');
    }
  };

  const handleMarkAsComplete = async (bookingId) => {
    console.log('🔄 handleMarkAsComplete called with bookingId:', bookingId);
    
    if (!bookingId) {
      console.error('❌ No booking ID provided');
      alert('Error: Booking ID is missing');
      return;
    }

    if (!window.confirm('Are you sure you want to mark this booking as completed?')) {
      return;
    }

    try {
      console.log('🔄 Marking booking as complete:', bookingId);
      // Call backend API to update booking status to completed
      const response = await adminService.updateBooking(bookingId, {
        status: 'completed',
      });

      console.log('📊 Mark complete response:', response);
      console.log('📊 Response success:', response?.success);

      if (response && response.success) {
        // Update local state for both bookings and filteredBookings
        setBookings((prevList) => {
          const updated = prevList.map((booking) => {
            if (booking.id === bookingId || booking._id === bookingId) {
              console.log('✅ Updating booking in bookings state:', booking.id);
              return {
                ...booking,
                status: 'completed',
                completedDate: new Date().toISOString(),
              };
            }
            return booking;
          });
          return updated;
        });
        
        // Also update filteredBookings to reflect the change immediately
        setFilteredBookings((prevList) => {
          const updated = prevList.map((booking) => {
            if (booking.id === bookingId || booking._id === bookingId) {
              console.log('✅ Updating booking in filteredBookings state:', booking.id);
              return {
                ...booking,
                status: 'completed',
                completedDate: new Date().toISOString(),
              };
            }
            return booking;
          });
          return updated;
        });
        
        // Show success message
        alert('Booking marked as completed! User will see it in completed bookings.');
        
        // Refresh bookings list to get updated data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error('❌ API returned success: false');
        alert(response?.message || 'Failed to mark booking as completed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error marking booking as complete:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      alert(error.response?.data?.message || error.message || 'Failed to mark booking as completed. Please try again.');
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetail(true);
  };

  // Export bookings to CSV (Excel-readable)
  const handleExport = () => {
    if (!bookings || bookings.length === 0) {
      alert('No bookings available to export.');
      return;
    }

    // Helper to safely format CSV values
    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Escape double quotes by doubling them
      if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const headers = [
      'Booking ID',
      'Status',
      'Payment Status',
      'User Name',
      'User Email',
      'User Phone',
      'Car Name',
      'Pickup Date',
      'Pickup Time',
      'Drop Date',
      'Drop Time',
      'Days',
      'Total Amount',
      'Paid Amount',
      'Refund Amount',
      'Booked At',
      'Completed Date',
      'Cancelled Date',
      'Cancellation Reason',
      'Current Location',
      'Guarantor Name',
      'Guarantor ID',
    ];

    const rows = bookings.map((b) => [
      b.bookingId || '',
      b.status || '',
      b.paymentStatus || '',
      b.userName || '',
      b.userEmail || '',
      b.userPhone || '',
      b.carName || '',
      b.pickupDate ? new Date(b.pickupDate).toLocaleDateString() : '',
      b.pickupTime ? formatTimeToAMPM(b.pickupTime) : '',
      b.dropDate ? new Date(b.dropDate).toLocaleDateString() : '',
      b.dropTime ? formatTimeToAMPM(b.dropTime) : '',
      b.days ?? '',
      typeof b.totalAmount === 'number' ? b.totalAmount : '',
      typeof b.paidAmount === 'number' ? b.paidAmount : '',
      typeof b.refundAmount === 'number' ? b.refundAmount : '',
      b.bookingDate ? new Date(b.bookingDate).toLocaleString() : '',
      b.completedDate ? new Date(b.completedDate).toLocaleString() : '',
      b.cancelledDate ? new Date(b.cancelledDate).toLocaleString() : '',
      b.cancellationReason || '',
      b.currentLocation || '',
      b.guarantorName || '',
      b.guarantorId || '',
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
    link.download = `bookings-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            style={{ borderColor: colors.backgroundTertiary }}
          ></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            Retry
          </button>
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
                Booking Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manage all bookings and trips</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              Export Data
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
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: colors.backgroundTertiary }}>
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
                placeholder="Search by booking ID, user name, email, or car name..."
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
              label="Booking Status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              options={[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />

            {/* Payment Status Filter */}
            <AdminCustomSelect
              label="Payment Status"
              value={filters.paymentStatus}
              onChange={(value) => setFilters({ ...filters, paymentStatus: value })}
              options={[
                { value: 'all', label: 'All' },
                { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
                { value: 'refunded', label: 'Refunded' },
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

            {/* Car Filter */}
            <AdminCustomSelect
              label="Car"
              value={filters.car}
              onChange={(value) => setFilters({ ...filters, car: value })}
              options={[
                { value: 'all', label: 'All Cars' },
                ...cars.map((car, index) => ({
                  value: car.id || `car-${index}`,
                  label: car.name,
                })),
              ]}
            />

            {/* User Filter */}
            <AdminCustomSelect
              label="User"
              value={filters.user}
              onChange={(value) => setFilters({ ...filters, user: value })}
              options={[
                { value: 'all', label: 'All Users' },
                ...users.map((user, index) => ({
                  value: user.id || `user-${index}`,
                  label: user.name,
                })),
              ]}
            />
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
                        {booking.userName} • {booking.userEmail} {booking.userPhone && `• ${booking.userPhone}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {booking.paymentStatus === 'partial' ? (
                        <>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor('paid')}`}>
                            Advance Done
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor('pending')}`}>
                            Remaining amount is Pending
                          </span>
                        </>
                      ) : booking.paymentStatus === 'pending' ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                          Payment : Remaining Amount Pending
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                          Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Pickup</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{formatTimeToAMPM(booking.pickupTime)}</p>
                      {booking.pickupLocation && booking.pickupLocation !== 'Location to be confirmed' && booking.pickupLocation !== 'N/A' && (
                        <p className="text-xs text-gray-500">{booking.pickupLocation}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Drop</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(booking.dropDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">{formatTimeToAMPM(booking.dropTime)}</p>
                      {booking.dropLocation && booking.dropLocation !== 'Location to be confirmed' && booking.dropLocation !== 'N/A' && (
                        <p className="text-xs text-gray-500">{booking.dropLocation}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{booking.days} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Amount</p>
                      <p className="text-sm font-semibold" style={{ color: colors.backgroundTertiary }}>
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
                    type="button"
                    onClick={() => handleViewBooking(booking)}
                    className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: colors.backgroundTertiary }}
                  >
                    View Details
                  </button>
                  
                  {booking.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/bookings/${booking.id}/tracking`)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Live Tracking
                    </button>
                  )}
                  
                  {booking.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(booking.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(booking.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {(booking.status === 'confirmed' || booking.status === 'active') && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🖱️ Cancel button clicked for booking:', booking.id);
                          handleCancel(booking.id);
                        }}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Booking
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🖱️ Mark complete button clicked for booking:', booking.id);
                          handleMarkAsComplete(booking.id);
                        }}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark as Complete
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'cancelled' && booking.paymentStatus !== 'refunded' && (
                    <button
                      type="button"
                      onClick={() => handleProcessRefund(booking.id)}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Refund
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
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus || 'pending');
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [guarantorPoints, setGuarantorPoints] = useState(null);
  const [loadingGuarantorPoints, setLoadingGuarantorPoints] = useState(false);

  // Update payment status when booking prop changes
  useEffect(() => {
    setPaymentStatus(booking.paymentStatus || 'pending');
  }, [booking.paymentStatus]);

  // Fetch guarantor points when modal opens
  useEffect(() => {
    const fetchGuarantorPoints = async () => {
      if (!booking?.id) return;
      
      try {
        setLoadingGuarantorPoints(true);
        const response = await adminService.getBookingGuarantorPoints(booking.id);
        if (response.success && response.data) {
          setGuarantorPoints(response.data);
        }
      } catch (error) {
        console.error('Error fetching guarantor points:', error);
        // Don't show error to user, just log it
      } finally {
        setLoadingGuarantorPoints(false);
      }
    };

    fetchGuarantorPoints();
  }, [booking?.id]);

  // Calculate remaining amount
  const remainingAmount = (booking.totalAmount || 0) - (booking.paidAmount || 0);
  const advanceAmount = booking.paidAmount || 0;
  
  // Determine advance payment status
  const advancePaymentStatus = advanceAmount > 0 ? 'done' : 'pending';
  
  // Determine remaining payment status based on overall payment status
  // If payment status is "paid", remaining payment is done, otherwise check remaining amount
  const remainingPaymentStatus = paymentStatus === 'paid' ? 'done' : (remainingAmount <= 0 ? 'done' : 'pending');

  // Handle payment status update
  const handlePaymentStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to change payment status to "${newStatus}"?`)) {
      return;
    }

    try {
      setIsUpdatingPayment(true);
      const response = await adminService.updateBooking(booking.id, {
        paymentStatus: newStatus,
      });

      if (response.success) {
        setPaymentStatus(newStatus);
        // Update booking object locally
        booking.paymentStatus = newStatus;
        
        // If status is changed to "paid", update paidAmount to totalAmount
        if (newStatus === 'paid' && booking.paidAmount < booking.totalAmount) {
          booking.paidAmount = booking.totalAmount;
        }
        
        alert('Payment status updated successfully! User side will reflect the changes on next refresh.');
      } else {
        alert('Failed to update payment status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert(error.response?.data?.message || 'Failed to update payment status. Please try again.');
    } finally {
      setIsUpdatingPayment(false);
    }
  };

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
                style={activeTab === tab ? { borderBottomColor: colors.backgroundTertiary } : {}}
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
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Car</label>
                      <p className="text-sm text-gray-900">{booking.carName}</p>
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
                      <label className="text-xs font-medium text-gray-700">Trip Start Date & Time</label>
                      <p className="text-sm text-gray-900">
                        {new Date(booking.pickupDate).toLocaleDateString()} at {formatTimeToAMPM(booking.pickupTime)}
                      </p>
                      {booking.pickupLocation && booking.pickupLocation !== 'Location to be confirmed' && booking.pickupLocation !== 'N/A' && (
                        <p className="text-xs text-gray-500 mt-1">{booking.pickupLocation}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Trip End Date & Time</label>
                      <p className="text-sm text-gray-900">
                        {new Date(booking.dropDate).toLocaleDateString()} at {formatTimeToAMPM(booking.dropTime)}
                      </p>
                      {booking.dropLocation && booking.dropLocation !== 'Location to be confirmed' && booking.dropLocation !== 'N/A' && (
                        <p className="text-xs text-gray-500 mt-1">{booking.dropLocation}</p>
                      )}
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
                        <span className="text-sm font-bold" style={{ color: colors.backgroundTertiary }}>
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
                      <p className="text-sm text-gray-900 font-mono">{formatUserId(booking.userId)}</p>
                    </div>
                  </div>
                </div>

                {/* Guarantor Information */}
                {booking.guarantorName && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Guarantor Information</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{booking.guarantorName}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">Guarantor ID</label>
                        <p className="text-sm text-gray-900">{booking.guarantorId}</p>
                      </div>
                    </div>

                    {/* Guarantor Points Section */}
                    {loadingGuarantorPoints ? (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Loading guarantor points...</p>
                      </div>
                    ) : guarantorPoints && guarantorPoints.guarantors && guarantorPoints.guarantors.length > 0 ? (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Guarantor Points Allocation</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-gray-600">Booking Amount:</span>
                              <p className="font-semibold text-gray-900">₹{guarantorPoints.bookingAmount?.toLocaleString() || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">10% Pool Amount:</span>
                              <p className="font-semibold text-gray-900">
                                ₹{(() => {
                                  const amt = Number(guarantorPoints.totalPoolAmount);
                                  if (amt % 1 === 0) return amt.toLocaleString();
                                  const decimals = amt.toString().split('.')[1]?.length || 0;
                                  return decimals <= 3 ? amt.toFixed(decimals) : amt.toFixed(3);
                                })()}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Total Guarantors:</span>
                              <p className="font-semibold text-gray-900">{guarantorPoints.totalGuarantors || 0}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Active Guarantors:</span>
                              <p className="font-semibold text-green-600">{guarantorPoints.activeGuarantors || 0}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-blue-200">
                            <h5 className="text-xs font-semibold text-gray-900 mb-2">Points Per Guarantor:</h5>
                            <div className="space-y-2">
                              {guarantorPoints.guarantors.map((guarantor, index) => (
                                <div key={guarantor.id || index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-900">{guarantor.guarantorName}</p>
                                    <p className="text-xs text-gray-500">{guarantor.guarantorEmail}</p>
                                    {guarantor.guarantorGuarantorId && (
                                      <p className="text-xs text-gray-500">ID: {guarantor.guarantorGuarantorId}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-sm font-bold ${guarantor.status === 'active' ? 'text-green-600' : 'text-red-600 line-through'}`}>
                                      {(() => {
                                        const pts = Number(guarantor.pointsAllocated);
                                        if (pts % 1 === 0) return pts.toLocaleString();
                                        const decimals = pts.toString().split('.')[1]?.length || 0;
                                        return decimals <= 3 ? pts.toFixed(decimals) : pts.toFixed(3);
                                      })()}
                                    </p>
                                    <p className={`text-xs ${guarantor.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                      {guarantor.status === 'active' ? 'Active' : 'Reversed'}
                                    </p>
                                    {guarantor.reversedAt && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {new Date(guarantor.reversedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                
                {/* Payment Status Dropdown */}
                <div className="mb-6">
                  <AdminCustomSelect
                    label="Payment Status"
                    value={paymentStatus}
                    onChange={(value) => handlePaymentStatusUpdate(value)}
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'paid', label: 'Paid' },
                    ]}
                    className={isUpdatingPayment ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                  />
                  {isUpdatingPayment && (
                    <p className="text-xs text-gray-500 mt-1">Updating...</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Total Amount</label>
                    <p className="text-sm font-semibold" style={{ color: colors.backgroundTertiary }}>
                      ₹{booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Paid Amount</label>
                    <p className="text-sm text-gray-900">₹{advanceAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Advance Payment Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Advance Payment Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      advancePaymentStatus === 'done' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {advancePaymentStatus === 'done' ? 'Done' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Advance Amount: ₹{advanceAmount.toLocaleString()}</p>
                </div>

                {/* Remaining Payment Status */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Remaining Payment Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      remainingPaymentStatus === 'done' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {remainingPaymentStatus === 'done' ? 'Done' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Remaining Amount: ₹{remainingAmount.toLocaleString()}</p>
                </div>

                {booking.refundAmount && booking.refundAmount > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-700">Refund Amount</label>
                    <p className="text-sm text-gray-900">₹{booking.refundAmount.toLocaleString()}</p>
                  </div>
                )}
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
                onClick={async () => {
                  await onApprove(booking.id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={async () => {
                  await onReject(booking.id);
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
              onClick={async () => {
                await onCancel(booking.id);
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

