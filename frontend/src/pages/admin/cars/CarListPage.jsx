import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';
import { adminService } from '../../../services/admin.service';
import toastUtils from '../../../config/toast';
import { Button } from '../../../components/common';

/**
 * Car List Page
 * Admin can view, filter, approve/reject, and manage all car listings
 * No localStorage or Redux - All state managed via React hooks
 */
const CarListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial status from URL
  const getInitialStatus = () => {
    if (location.pathname.includes('/pending')) return 'pending';
    return 'all';
  };

  // State management
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarDetail, setShowCarDetail] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  // Filter states
  const [filters, setFilters] = useState({
    status: getInitialStatus(), // all, active, inactive, pending, suspended
    availability: 'all', // all, available, booked
    owner: 'all',
    location: 'all',
    carType: 'all', // all, sedan, suv, hatchback, luxury
    priceRange: 'all', // all, 0-1000, 1000-2000, 2000+
  });

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllCars({
          page: 1,
          limit: 1000, // Get all cars for now
          search: searchQuery,
          status: filters.status,
          carType: filters.carType,
          brand: filters.brand || undefined,
          location: filters.location !== 'all' ? filters.location : undefined,
          owner: filters.owner !== 'all' ? filters.owner : undefined,
        });

        if (response.success && response.data) {
          // Format cars data for frontend
          const formattedCars = response.data.cars.map((car) => {
            // Get primary image or first image
            const primaryImage = car.images?.find(img => img.isPrimary) || car.images?.[0];
            const imageUrl = primaryImage?.url || null;
            
            return {
              id: car._id || car.id,
              brand: car.brand,
              model: car.model,
              year: car.year,
              carType: car.carType,
              pricePerDay: car.pricePerDay,
              status: car.status,
              availability: car.isAvailable ? 'available' : 'booked',
              ownerId: car.owner?._id || car.owner?.id || car.owner,
              ownerName: car.owner?.name || 'Unknown',
              ownerEmail: car.owner?.email || '',
              location: car.location?.city || car.location || 'Unknown',
              images: car.images || [],
              imageUrl: imageUrl, // Add primary image URL for easy access
              rating: car.averageRating || 0,
              totalBookings: car.totalBookings || 0,
              totalRevenue: car.totalRevenue || 0,
              features: car.features || [],
              registrationDate: car.createdAt || new Date().toISOString(),
              registrationNumber: car.registrationNumber,
              fuelType: car.fuelType,
              transmission: car.transmission,
              seatingCapacity: car.seatingCapacity,
              isFeatured: car.isFeatured,
              isPopular: car.isPopular,
            };
          });
          
          setCars(formattedCars);
        } else {
          setCars([]);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchQuery, filters.status, filters.carType, filters.brand, filters.location, filters.owner]);

  // Client-side filtering for availability (backend doesn't handle this filter)
  useEffect(() => {
    let filtered = [...cars];

    // Availability filter (client-side only)
    if (filters.availability !== 'all') {
      filtered = filtered.filter((car) => car.availability === filters.availability);
    }

    // Price range filter (client-side only)
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter((car) => {
        const price = car.pricePerDay;
        switch (filters.priceRange) {
          case '0-1000':
            return price >= 0 && price <= 1000;
          case '1000-2000':
            return price > 1000 && price <= 2000;
          case '2000+':
            return price > 2000;
          default:
            return true;
        }
      });
    }

    setFilteredCars(filtered);
  }, [cars, filters.availability, filters.priceRange]);

  // Helper function to refresh cars list
  const refreshCarsList = async () => {
    try {
      const response = await adminService.getAllCars({
        page: 1,
        limit: 1000,
        search: searchQuery,
        status: filters.status,
        carType: filters.carType,
        brand: filters.brand || undefined,
        location: filters.location !== 'all' ? filters.location : undefined,
        owner: filters.owner !== 'all' ? filters.owner : undefined,
      });

      if (response.success && response.data) {
          const formattedCars = response.data.cars.map((car) => {
            // Get primary image or first image
            const primaryImage = car.images?.find(img => img.isPrimary) || car.images?.[0];
            const imageUrl = primaryImage?.url || null;
            
            return {
              id: car._id || car.id,
              brand: car.brand,
              model: car.model,
              year: car.year,
              carType: car.carType,
              pricePerDay: car.pricePerDay,
              status: car.status,
              availability: car.isAvailable ? 'available' : 'booked',
              ownerId: car.owner?._id || car.owner?.id || car.owner,
              ownerName: car.owner?.name || 'Unknown',
              ownerEmail: car.owner?.email || '',
              location: car.location?.city || car.location || 'Unknown',
              images: car.images || [],
              imageUrl: imageUrl, // Add primary image URL for easy access
              rating: car.averageRating || 0,
              totalBookings: car.totalBookings || 0,
              totalRevenue: car.totalRevenue || 0,
              features: car.features || [],
              registrationDate: car.createdAt || new Date().toISOString(),
            };
          });
        setCars(formattedCars);
      }
    } catch (error) {
      console.error('Error refreshing cars list:', error);
    }
  };

  // Handle car actions
  const handleApprove = async (carId) => {
    try {
      const response = await adminService.updateCarStatus(carId, 'active');
      if (response.success) {
        toastUtils.success('Car approved successfully');
        await refreshCarsList();
      }
    } catch (error) {
      console.error('Error approving car:', error);
      toastUtils.error(error.response?.data?.message || 'Failed to approve car');
    }
  };

  const handleReject = async (carId) => {
    try {
      const response = await adminService.updateCarStatus(carId, 'rejected', 'Rejected by admin');
      if (response.success) {
        toastUtils.success('Car rejected successfully');
        await refreshCarsList();
      }
    } catch (error) {
      console.error('Error rejecting car:', error);
      toastUtils.error(error.response?.data?.message || 'Failed to reject car');
    }
  };

  const handleSuspend = async (carId) => {
    try {
      const response = await adminService.updateCarStatus(carId, 'suspended');
      if (response.success) {
        toastUtils.success('Car suspended successfully');
        await refreshCarsList();
      }
    } catch (error) {
      console.error('Error suspending car:', error);
      toastUtils.error(error.response?.data?.message || 'Failed to suspend car');
    }
  };

  const handleActivate = async (carId) => {
    try {
      const response = await adminService.updateCarStatus(carId, 'active');
      if (response.success) {
        toastUtils.success('Car activated successfully');
        await refreshCarsList();
      }
    } catch (error) {
      console.error('Error activating car:', error);
      toastUtils.error(error.response?.data?.message || 'Failed to activate car');
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car listing?')) {
      try {
        const response = await adminService.deleteCar(carId);
        if (response.success) {
          toastUtils.success('Car deleted successfully');
          await refreshCarsList();
        }
      } catch (error) {
        console.error('Error deleting car:', error);
        toastUtils.error(error.response?.data?.message || 'Failed to delete car');
      }
    }
  };

  const handleViewCar = (car) => {
    setSelectedCar(car);
    setShowCarDetail(true);
  };

  const handleEditCar = (car) => {
    navigate(`/admin/cars/${car.id}/edit`);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      available: 'bg-blue-100 text-blue-800',
      booked: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get car type display name
  const getCarTypeName = (type) => {
    const names = {
      sedan: 'Sedan',
      suv: 'SUV',
      hatchback: 'Hatchback',
      luxury: 'Luxury',
    };
    return names[type] || type;
  };

  // Get unique locations
  const locations = Array.from(new Set(cars.map((car) => car.location)));

  // Get unique owners
  const owners = Array.from(
    new Set(
      cars.map((car) => ({
        id: car.ownerId,
        name: car.ownerName,
      }))
    )
  );

  // Stats calculation
  const stats = {
    total: cars.length,
    active: cars.filter((c) => c.status === 'active').length,
    pending: cars.filter((c) => c.status === 'pending').length,
    suspended: cars.filter((c) => c.status === 'suspended').length,
    available: cars.filter((c) => c.availability === 'available').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading cars...</p>
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
                Car Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manage all car listings and approvals</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/admin/cars/new')}
                className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Add New Car
              </button>
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'grid' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'list' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 max-w-4xl">
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.total}
            </div>
            <div className="text-xs text-gray-600">Total Cars</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-green-600">{stats.active}</div>
            <div className="text-xs text-gray-600">Active</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-red-600">{stats.suspended}</div>
            <div className="text-xs text-gray-600">Suspended</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1 text-blue-600">{stats.available}</div>
            <div className="text-xs text-gray-600">Available</div>
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
                placeholder="Search by brand, model, owner, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Owner</label>
              <select
                value={filters.owner}
                onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Car Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Car Type</label>
              <select
                value={filters.carType}
                onChange={(e) => setFilters({ ...filters, carType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
              >
                <option value="all">All Prices</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-2000">₹1,000 - ₹2,000</option>
                <option value="2000+">₹2,000+</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Cars List */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredCars.length}</span> of <span className="font-semibold">{cars.length}</span> cars
          </p>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCars.map((car) => (
              <Card key={car.id} className="p-4 hover:shadow-lg transition-all">
                {/* Car Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full flex items-center justify-center ${car.imageUrl ? 'hidden' : ''}`}
                    style={{ display: car.imageUrl ? 'none' : 'flex' }}
                  >
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  </div>
                </div>

                {/* Car Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {car.brand} {car.model} ({car.year})
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{getCarTypeName(car.carType)} • {car.location}</p>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(car.status)}`}>
                      {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(car.availability)}`}>
                      {car.availability.charAt(0).toUpperCase() + car.availability.slice(1)}
                    </span>
                  </div>

                  {/* Price and Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold" style={{ color: theme.colors.primary }}>
                      ₹{car.pricePerDay.toLocaleString()}/day
                    </span>
                    {car.rating > 0 && (
                      <span className="text-gray-600">⭐ {car.rating}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>{car.totalBookings} bookings</span>
                    <span>₹{car.totalRevenue.toLocaleString()} revenue</span>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
                  <span className="text-gray-600">Owner: </span>
                  <span className="font-medium text-gray-900">{car.ownerName}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewCar(car)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    View
                  </button>
                  {car.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(car.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(car.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {car.status === 'active' && (
                    <button
                      onClick={() => handleSuspend(car.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Suspend
                    </button>
                  )}
                  {(car.status === 'suspended' || car.status === 'inactive') && (
                    <button
                      onClick={() => handleActivate(car.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredCars.map((car) => (
              <Card key={car.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Car Image */}
                  <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {car.imageUrl ? (
                      <img
                        src={car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center ${car.imageUrl ? 'hidden' : ''}`}
                      style={{ display: car.imageUrl ? 'none' : 'flex' }}
                    >
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {car.brand} {car.model} ({car.year})
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {getCarTypeName(car.carType)} • {car.location}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(car.status)}`}>
                          {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(car.availability)}`}>
                          {car.availability.charAt(0).toUpperCase() + car.availability.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Price/Day</p>
                        <p className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                          ₹{car.pricePerDay.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Bookings</p>
                        <p className="text-sm font-semibold text-gray-900">{car.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Revenue</p>
                        <p className="text-sm font-semibold text-gray-900">₹{car.totalRevenue.toLocaleString()}</p>
                      </div>
                      {car.rating > 0 && (
                        <div>
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="text-sm font-semibold text-gray-900">⭐ {car.rating}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-600">
                      <span>Owner: </span>
                      <span className="font-medium text-gray-900">{car.ownerName}</span>
                      <span className="mx-2">•</span>
                      <span>{car.ownerEmail}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-48">
                    <button
                      onClick={() => handleViewCar(car)}
                      className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      View Details
                    </button>
                    <div className="flex gap-2">
                      {car.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(car.id)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(car.id)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {car.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(car.id)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      {(car.status === 'suspended' || car.status === 'inactive') && (
                        <button
                          onClick={() => handleActivate(car.id)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this car?')) {
                            handleDelete(car.id);
                          }
                        }}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredCars.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No cars found matching your filters.</p>
          </Card>
        )}
      </div>

      {/* Car Detail Modal */}
      {showCarDetail && selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => {
            setShowCarDetail(false);
            setSelectedCar(null);
          }}
          onEdit={handleEditCar}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

/**
 * Car Detail Modal Component
 */
const CarDetailModal = ({ car, onClose, onEdit, onApprove, onReject, onSuspend, onActivate, onDelete }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!car) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {car.brand} {car.model} ({car.year})
            </h2>
            <p className="text-sm text-gray-600">{car.location}</p>
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
            {['details', 'owner', 'bookings', 'reviews'].map((tab) => (
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
                {/* Car Images */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Images</h3>
                  {car.images && car.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {car.images.map((image, index) => (
                        <div key={index} className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden group">
                          <img
                            src={image.url || image}
                            alt={`${car.brand} ${car.model} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full absolute inset-0 bg-gray-200 rounded-lg items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                          </div>
                          {image.isPrimary && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                              Primary
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="ml-2 text-gray-500 text-sm">No images available</span>
                    </div>
                  )}
                </div>

                {/* Car Specifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Brand</label>
                      <p className="text-sm text-gray-900">{car.brand}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Model</label>
                      <p className="text-sm text-gray-900">{car.model}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Year</label>
                      <p className="text-sm text-gray-900">{car.year}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900 capitalize">{car.carType}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Price/Day</label>
                      <p className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                        ₹{car.pricePerDay.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{car.location}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900 capitalize">{car.status}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Availability</label>
                      <p className="text-sm text-gray-900 capitalize">{car.availability}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Total Bookings</label>
                      <p className="text-sm font-semibold text-gray-900">{car.totalBookings}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Total Revenue</label>
                      <p className="text-sm font-semibold text-gray-900">₹{car.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Rating</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {car.rating > 0 ? `⭐ ${car.rating}` : 'No ratings yet'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Registration Date</label>
                      <p className="text-sm text-gray-900">{new Date(car.registrationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'owner' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{car.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{car.ownerEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700">Owner ID</label>
                    <p className="text-sm text-gray-900">{car.ownerId}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
                <p className="text-gray-600">Total Bookings: {car.totalBookings}</p>
                <p className="text-sm text-gray-500 mt-2">Booking history will be displayed here...</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews & Ratings</h3>
                <p className="text-gray-600">Average Rating: {car.rating > 0 ? `⭐ ${car.rating}` : 'No ratings yet'}</p>
                <p className="text-sm text-gray-500 mt-2">Reviews will be displayed here...</p>
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
          <button
            onClick={() => {
              onEdit(car);
              onClose();
            }}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: theme.colors.primary }}
          >
            Edit
          </button>
          {car.status === 'pending' && (
            <>
              <button
                onClick={() => {
                  onApprove(car.id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  onReject(car.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {car.status === 'active' && (
            <button
              onClick={() => {
                onSuspend(car.id);
                onClose();
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Suspend
            </button>
          )}
          {(car.status === 'suspended' || car.status === 'inactive') && (
            <button
              onClick={() => {
                onActivate(car.id);
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Activate
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this car?')) {
                onDelete(car.id);
                onClose();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarListPage;

