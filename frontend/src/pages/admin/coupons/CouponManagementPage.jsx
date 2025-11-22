import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';

/**
 * Coupon Management Page
 * Admin can create, edit, and manage all coupons and discounts
 * No localStorage or Redux - All state managed via React hooks
 */
const CouponManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all', // all, active, expired, used
    couponType: 'all', // all, percentage, fixed
    dateRange: 'all', // all, today, week, month
  });

  // Form state
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage', // percentage, fixed
    discountValue: '',
    minAmount: '',
    maxDiscount: '',
    validityStart: '',
    validityEnd: '',
    usageLimit: '',
    usedCount: 0,
    applicableTo: 'all', // all, car_type, car_id, user_id
    carType: '',
    carId: '',
    userId: '',
    isActive: true,
    description: '',
  });

  // Mock coupons data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCoupons = [
        {
          id: '1',
          code: 'WELCOME20',
          discountType: 'percentage',
          discountValue: 20,
          minAmount: 1000,
          maxDiscount: 500,
          validityStart: '2024-03-01',
          validityEnd: '2024-03-31',
          usageLimit: 100,
          usedCount: 45,
          applicableTo: 'all',
          isActive: true,
          description: 'Welcome discount for new users',
          createdAt: '2024-02-25T10:00:00',
        },
        {
          id: '2',
          code: 'FLAT500',
          discountType: 'fixed',
          discountValue: 500,
          minAmount: 2000,
          validityStart: '2024-03-15',
          validityEnd: '2024-04-15',
          usageLimit: 50,
          usedCount: 12,
          applicableTo: 'all',
          isActive: true,
          description: 'Flat ₹500 off on bookings above ₹2000',
          createdAt: '2024-03-10T10:00:00',
        },
        {
          id: '3',
          code: 'WEEKEND30',
          discountType: 'percentage',
          discountValue: 30,
          minAmount: 1500,
          maxDiscount: 1000,
          validityStart: '2024-03-01',
          validityEnd: '2024-03-31',
          usageLimit: 200,
          usedCount: 78,
          applicableTo: 'all',
          isActive: true,
          description: '30% off on weekend bookings',
          createdAt: '2024-02-28T10:00:00',
        },
        {
          id: '4',
          code: 'LUXURY15',
          discountType: 'percentage',
          discountValue: 15,
          minAmount: 5000,
          maxDiscount: 2000,
          validityStart: '2024-03-10',
          validityEnd: '2024-04-10',
          usageLimit: 30,
          usedCount: 8,
          applicableTo: 'car_type',
          carType: 'luxury',
          isActive: true,
          description: '15% off on luxury car bookings',
          createdAt: '2024-03-05T10:00:00',
        },
        {
          id: '5',
          code: 'EXPIRED50',
          discountType: 'percentage',
          discountValue: 50,
          minAmount: 1000,
          validityStart: '2024-02-01',
          validityEnd: '2024-02-29',
          usageLimit: 100,
          usedCount: 100,
          applicableTo: 'all',
          isActive: false,
          description: 'Expired coupon',
          createdAt: '2024-01-25T10:00:00',
        },
        {
          id: '6',
          code: 'FIRST100',
          discountType: 'fixed',
          discountValue: 100,
          minAmount: 500,
          validityStart: '2024-03-20',
          validityEnd: '2024-04-20',
          usageLimit: 100,
          usedCount: 0,
          applicableTo: 'all',
          isActive: true,
          description: '₹100 off for first-time users',
          createdAt: '2024-03-18T10:00:00',
        },
      ];
      setCoupons(mockCoupons);
      setFilteredCoupons(mockCoupons);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and search coupons
  useEffect(() => {
    let filtered = [...coupons];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(query) ||
          coupon.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter((coupon) => {
        if (filters.status === 'active') {
          return coupon.isActive && new Date(coupon.validityEnd) >= now;
        }
        if (filters.status === 'expired') {
          return new Date(coupon.validityEnd) < now || !coupon.isActive;
        }
        if (filters.status === 'used') {
          return coupon.usedCount >= coupon.usageLimit;
        }
        return true;
      });
    }

    // Coupon type filter
    if (filters.couponType !== 'all') {
      filtered = filtered.filter((coupon) => coupon.discountType === filters.couponType);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter((coupon) => {
        const createdDate = new Date(coupon.createdAt);
        switch (filters.dateRange) {
          case 'today':
            return createdDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return createdDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return createdDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredCoupons(filtered);
  }, [coupons, searchQuery, filters]);

  const handleCreateCoupon = () => {
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minAmount: '',
      maxDiscount: '',
      validityStart: '',
      validityEnd: '',
      usageLimit: '',
      usedCount: 0,
      applicableTo: 'all',
      carType: '',
      carId: '',
      userId: '',
      isActive: true,
      description: '',
    });
    setSelectedCoupon(null);
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: coupon.minAmount || '',
      maxDiscount: coupon.maxDiscount || '',
      validityStart: coupon.validityStart,
      validityEnd: coupon.validityEnd,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      applicableTo: coupon.applicableTo,
      carType: coupon.carType || '',
      carId: coupon.carId || '',
      userId: coupon.userId || '',
      isActive: coupon.isActive,
      description: coupon.description || '',
    });
    setShowCouponModal(true);
  };

  const handleSaveCoupon = () => {
    if (selectedCoupon) {
      // Update existing coupon
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === selectedCoupon.id ? { ...coupon, ...couponForm } : coupon
        )
      );
    } else {
      // Create new coupon
      const newCoupon = {
        id: Date.now().toString(),
        ...couponForm,
        createdAt: new Date().toISOString(),
      };
      setCoupons((prev) => [...prev, newCoupon]);
    }
    setShowCouponModal(false);
    setSelectedCoupon(null);
  };

  const handleToggleCoupon = (couponId) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
      )
    );
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== couponId));
    }
  };

  const handleViewUsage = (coupon) => {
    setSelectedCoupon(coupon);
    setShowUsageModal(true);
  };

  const handleExport = () => {
    // In real app, this would generate and download CSV/Excel
    console.log('Exporting coupons data...');
  };

  // Get status badge color
  const getStatusColor = (coupon) => {
    const now = new Date();
    if (!coupon.isActive || new Date(coupon.validityEnd) < now) {
      return 'bg-red-100 text-red-800';
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (coupon) => {
    const now = new Date();
    if (!coupon.isActive) return 'Inactive';
    if (new Date(coupon.validityEnd) < now) return 'Expired';
    if (coupon.usedCount >= coupon.usageLimit) return 'Used Up';
    return 'Active';
  };

  // Stats calculation
  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => {
      const now = new Date();
      return c.isActive && new Date(c.validityEnd) >= now && c.usedCount < c.usageLimit;
    }).length,
    expired: coupons.filter((c) => {
      const now = new Date();
      return new Date(c.validityEnd) < now || !c.isActive;
    }).length,
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading coupons...</p>
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
                Coupon Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Create and manage discount coupons</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Export Reports
              </button>
              <button
                onClick={handleCreateCoupon}
                className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.total}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Coupons</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-green-600">{stats.active}</div>
            <div className="text-xs md:text-sm text-gray-600">Active</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-red-600">{stats.expired}</div>
            <div className="text-xs md:text-sm text-gray-600">Expired</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.totalUsage}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Usage</div>
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
                placeholder="Search by coupon code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="used">Used Up</option>
              </select>
            </div>

            {/* Coupon Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                value={filters.couponType}
                onChange={(e) => setFilters({ ...filters, couponType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Created</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Coupons List */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredCoupons.length}</span> of <span className="font-semibold">{coupons.length}</span> coupons
          </p>
        </div>

        <div className="space-y-4">
          {filteredCoupons.map((coupon) => (
            <Card key={coupon.id} className="p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Coupon Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        <span className="font-mono text-lg" style={{ color: theme.colors.primary }}>
                          {coupon.code}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500">{coupon.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}>
                      {getStatusText(coupon)}
                    </span>
                  </div>

                  {/* Coupon Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Discount</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </p>
                      {coupon.maxDiscount && (
                        <p className="text-xs text-gray-500">Max: ₹{coupon.maxDiscount}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Min Amount</p>
                      <p className="text-sm text-gray-900">₹{coupon.minAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Usage</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {coupon.usedCount} / {coupon.usageLimit}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{
                            width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Validity</p>
                      <p className="text-sm text-gray-900">
                        {new Date(coupon.validityStart).toLocaleDateString()} - {new Date(coupon.validityEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Applicable To */}
                  <div className="text-xs text-gray-600">
                    Applicable to:{' '}
                    {coupon.applicableTo === 'all'
                      ? 'All Users & Cars'
                      : coupon.applicableTo === 'car_type'
                      ? `Car Type: ${coupon.carType}`
                      : coupon.applicableTo === 'car_id'
                      ? `Car ID: ${coupon.carId}`
                      : `User ID: ${coupon.userId}`}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-40">
                  <button
                    onClick={() => handleViewUsage(coupon)}
                    className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    View Usage
                  </button>
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleCoupon(coupon.id)}
                    className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      coupon.isActive
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCoupons.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No coupons found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <CouponModal
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          onClose={() => {
            setShowCouponModal(false);
            setSelectedCoupon(null);
          }}
          onSave={handleSaveCoupon}
        />
      )}

      {/* Usage Modal */}
      {showUsageModal && selectedCoupon && (
        <UsageModal
          coupon={selectedCoupon}
          onClose={() => {
            setShowUsageModal(false);
            setSelectedCoupon(null);
          }}
        />
      )}
    </div>
  );
};

/**
 * Coupon Modal Component
 */
const CouponModal = ({ couponForm, setCouponForm, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create Coupon</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              placeholder="e.g., WELCOME20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={couponForm.description}
              onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="2"
              placeholder="Coupon description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
            <select
              value={couponForm.discountType}
              onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
            <input
              type="number"
              value={couponForm.discountValue}
              onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={couponForm.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
            />
          </div>

          {couponForm.discountType === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (Optional)</label>
              <input
                type="number"
                value={couponForm.maxDiscount}
                onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 1000"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Amount *</label>
            <input
              type="number"
              value={couponForm.minAmount}
              onChange={(e) => setCouponForm({ ...couponForm, minAmount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 1000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Validity Start *</label>
              <input
                type="date"
                value={couponForm.validityStart}
                onChange={(e) => setCouponForm({ ...couponForm, validityStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Validity End *</label>
              <input
                type="date"
                value={couponForm.validityEnd}
                onChange={(e) => setCouponForm({ ...couponForm, validityEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit *</label>
            <input
              type="number"
              value={couponForm.usageLimit}
              onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To *</label>
            <select
              value={couponForm.applicableTo}
              onChange={(e) => setCouponForm({ ...couponForm, applicableTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Users & Cars</option>
              <option value="car_type">Car Type</option>
              <option value="car_id">Specific Car</option>
              <option value="user_id">Specific User</option>
            </select>
          </div>

          {couponForm.applicableTo === 'car_type' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
              <select
                value={couponForm.carType}
                onChange={(e) => setCouponForm({ ...couponForm, carType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Car Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          )}

          {couponForm.applicableTo === 'car_id' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car ID</label>
              <input
                type="text"
                value={couponForm.carId}
                onChange={(e) => setCouponForm({ ...couponForm, carId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., car123"
              />
            </div>
          )}

          {couponForm.applicableTo === 'user_id' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                value={couponForm.userId}
                onChange={(e) => setCouponForm({ ...couponForm, userId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., user123"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={couponForm.isActive}
              onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Usage Modal Component
 */
const UsageModal = ({ coupon, onClose }) => {
  // Mock usage data
  const usageData = [
    { userId: '1', userName: 'John Doe', bookingId: 'BK001', usedDate: '2024-03-15', discountApplied: 300 },
    { userId: '2', userName: 'Jane Smith', bookingId: 'BK002', usedDate: '2024-03-16', discountApplied: 500 },
    { userId: '5', userName: 'David Brown', bookingId: 'BK003', usedDate: '2024-03-17', discountApplied: 400 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Coupon Usage Statistics</h2>
            <p className="text-sm text-gray-600">Code: {coupon.code}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Total Usage</p>
              <p className="text-2xl font-bold" style={{ color: theme.colors.primary }}>
                {coupon.usedCount}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Usage Limit</p>
              <p className="text-2xl font-bold text-gray-900">{coupon.usageLimit}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-green-600">
                {coupon.usageLimit - coupon.usedCount}
              </p>
            </div>
          </div>

          {/* Usage List */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage History</h3>
          <div className="space-y-2">
            {usageData.slice(0, coupon.usedCount).map((usage, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{usage.userName}</p>
                    <p className="text-xs text-gray-500">Booking: {usage.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{usage.discountApplied}</p>
                    <p className="text-xs text-gray-500">{new Date(usage.usedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponManagementPage;

