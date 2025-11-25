import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme/theme.constants';
import Card from '../../components/common/Card';
import { adminService } from '../../services/admin.service';

/**
 * Admin Dashboard Page
 * Comprehensive admin dashboard based on ADMIN_PANEL_PLAN.md
 * No localStorage or Redux - All state managed via React hooks
 */
const AdminDashboardPage = () => {
  const navigate = useNavigate();
  
  // Dashboard data state (using useState)
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    stats: {
      totalUsers: 0,
      totalCars: 0,
      activeBookings: 0,
      pendingKYC: 0,
      todayRevenue: 0,
      activeTrips: 0,
    },
    recentBookings: [],
    pendingKYC: [],
    recentPayments: [],
    revenueTrend: [],
    bookingTrends: [],
    userGrowth: [],
  });

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));

        // Fetch dashboard statistics from backend
        const statsResponse = await adminService.getDashboardStats();

        if (statsResponse.success && statsResponse.data) {
          const stats = statsResponse.data.stats;
          
          setDashboardData(prev => ({
            ...prev,
            loading: false,
            stats: {
              totalUsers: stats.totalUsers || 0,
              totalCars: stats.totalCars || 0,
              activeBookings: stats.activeBookings || 0,
              pendingKYC: stats.pendingKYC || 0,
              todayRevenue: stats.todayRevenue || 0,
              activeTrips: stats.activeTrips || 0,
            },
          }));
        } else {
          setDashboardData(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchDashboardData();
  }, []);

  // Overview Statistics Cards
  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers.toLocaleString(),
      icon: (
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: theme.colors.primary,
      change: '--',
      changeType: 'neutral',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Total Cars',
      value: dashboardData.stats.totalCars.toLocaleString(),
      icon: (
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      color: theme.colors.info,
      change: '--',
      changeType: 'neutral',
      onClick: () => navigate('/admin/cars'),
    },
    {
      title: 'Active Bookings',
      value: dashboardData.stats.activeBookings.toString(),
      icon: (
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: theme.colors.success,
      change: '--',
      changeType: 'neutral',
      onClick: () => navigate('/admin/bookings/active'),
    },
    {
      title: 'Pending KYC',
      value: dashboardData.stats.pendingKYC.toString(),
      icon: (
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: theme.colors.warning,
      change: dashboardData.stats.pendingKYC > 0 ? `${dashboardData.stats.pendingKYC} pending` : '--',
      changeType: dashboardData.stats.pendingKYC > 0 ? 'warning' : 'neutral',
      onClick: () => navigate('/admin/kyc/pending'),
    },
    {
      title: "Today's Revenue",
      value: `₹${(dashboardData.stats.todayRevenue / 1000).toFixed(1)}K`,
      icon: (
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: theme.colors.success,
      change: '--',
      changeType: 'neutral',
      onClick: () => navigate('/admin/payments'),
    },
    {
      title: 'Active Trips',
      value: dashboardData.stats.activeTrips.toString(),
      icon: (
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: theme.colors.info,
      change: 'Live',
      changeType: 'info',
      onClick: () => navigate('/admin/tracking/active'),
    },
  ];

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      confirmed: theme.colors.success,
      pending: theme.colors.warning,
      active: theme.colors.info,
      completed: theme.colors.primary,
      cancelled: theme.colors.error,
      success: theme.colors.success,
      failed: theme.colors.error,
    };
    return colors[status] || theme.colors.textSecondary;
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-6 md:px-6 md:pt-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>
            Admin Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Overview Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 md:mb-8">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              variant="clickable"
              onClick={stat.onClick}
              className="p-3 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex gap-3">
                {/* Left Column: Icon and Title */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <div style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="text-xs font-medium text-gray-700">
                    {stat.title}
                  </div>
                </div>
                
                {/* Right Column: Number and Status */}
                <div className="flex flex-col items-end justify-between flex-1 min-w-0">
                  <div className="text-lg md:text-xl font-bold text-right" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-medium whitespace-nowrap ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'warning' ? 'text-yellow-600' :
                    stat.changeType === 'info' ? 'text-blue-600' :
                    stat.changeType === 'neutral' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Bookings */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Recent Bookings</h3>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="text-sm font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.recentBookings.length > 0 ? (
                dashboardData.recentBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{booking.userId}</p>
                      <p className="text-xs text-gray-600">{booking.car}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.time}</p>
                    </div>
                    <div className="flex flex-col items-end ml-3">
                      <span className="text-sm font-bold" style={{ color: theme.colors.primary }}>
                        {formatCurrency(booking.amount)}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded-full text-white mt-1"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent bookings</p>
                </div>
              )}
            </div>
          </Card>

          {/* Pending KYC */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Pending KYC</h3>
              <button
                onClick={() => navigate('/admin/kyc/pending')}
                className="text-sm font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.pendingKYC.length > 0 ? (
                dashboardData.pendingKYC.map((kyc) => (
                <div
                  key={kyc.id}
                  className="flex items-start justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer border-l-4"
                  style={{ borderLeftColor: theme.colors.warning }}
                  onClick={() => navigate(`/admin/kyc/${kyc.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{kyc.userId}</p>
                    <p className="text-xs text-gray-600 capitalize">{kyc.documentType}</p>
                    <p className="text-xs text-gray-500 mt-1">{kyc.time}</p>
                  </div>
                  <button
                    className="ml-3 px-3 py-1 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: theme.colors.primary }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/kyc/${kyc.id}`);
                    }}
                  >
                    Review
                  </button>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No pending KYC verifications</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Payments */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Recent Payments</h3>
              <button
                onClick={() => navigate('/admin/payments')}
                className="text-sm font-medium hover:underline"
                style={{ color: theme.colors.primary }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.recentPayments.length > 0 ? (
                dashboardData.recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/payments/${payment.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{payment.userId}</p>
                    <p className="text-xs text-gray-600">Booking: {payment.bookingId}</p>
                    <p className="text-xs text-gray-500 mt-1">{payment.time}</p>
                  </div>
                  <div className="flex flex-col items-end ml-3">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white mt-1"
                      style={{ backgroundColor: getStatusColor(payment.status) }}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No recent payments</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
