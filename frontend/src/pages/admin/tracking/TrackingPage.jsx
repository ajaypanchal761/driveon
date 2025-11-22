import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';

/**
 * Tracking Page
 * Admin can view active trips on map and track vehicles
 * No localStorage or Redux - All state managed via React hooks
 */
const TrackingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial view from URL
  const getInitialView = () => {
    if (location.pathname.includes('/active')) return 'active';
    if (location.pathname.includes('/history')) return 'history';
    return 'active';
  };

  // State management
  const [activeTrips, setActiveTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripDetail, setShowTripDetail] = useState(false);
  const [viewMode, setViewMode] = useState(getInitialView()); // active, history
  const [mapCenter, setMapCenter] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai default
  
  // Filter states
  const [filters, setFilters] = useState({
    dateRange: 'all', // all, today, week, month
    booking: 'all',
  });

  // Mock active trips data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockActiveTrips = [
        {
          id: '1',
          bookingId: 'BK003',
          userId: '5',
          userName: 'David Brown',
          carId: '3',
          carName: 'BMW 7 Series 2023',
          carOwner: 'Mike Johnson',
          startLocation: { lat: 19.0760, lng: 72.8777, address: 'Mumbai Downtown' },
          endLocation: { lat: 19.2183, lng: 72.9781, address: 'Mumbai Airport' },
          currentLocation: { lat: 19.1500, lng: 72.9000, address: 'Mumbai - Bandra' },
          startTime: '2024-03-18T11:00:00',
          expectedEndTime: '2024-03-20T11:00:00',
          currentSpeed: 45,
          averageSpeed: 42,
          distanceTraveled: 25.5,
          totalDistance: 50.0,
          duration: '2h 30m',
          status: 'active',
        },
        {
          id: '2',
          bookingId: 'BK008',
          userId: '6',
          userName: 'Emily Davis',
          carId: '7',
          carName: 'Tata Nexon 2022',
          carOwner: 'Lisa Anderson',
          startLocation: { lat: 18.5204, lng: 73.8567, address: 'Pune Station' },
          endLocation: { lat: 18.5204, lng: 73.8567, address: 'Pune Station' },
          currentLocation: { lat: 18.5500, lng: 73.8500, address: 'Pune - Hinjewadi' },
          startTime: '2024-03-19T08:00:00',
          expectedEndTime: '2024-03-22T08:00:00',
          currentSpeed: 35,
          averageSpeed: 38,
          distanceTraveled: 15.2,
          totalDistance: 30.0,
          duration: '1h 45m',
          status: 'active',
        },
      ];

      const mockCompletedTrips = [
        {
          id: '3',
          bookingId: 'BK004',
          userId: '7',
          userName: 'Robert Wilson',
          carId: '7',
          carName: 'Tata Nexon 2022',
          carOwner: 'Lisa Anderson',
          startLocation: { lat: 18.5204, lng: 73.8567, address: 'Pune Station' },
          endLocation: { lat: 18.5204, lng: 73.8567, address: 'Pune Station' },
          startTime: '2024-03-10T08:00:00',
          endTime: '2024-03-12T08:30:00',
          totalDistance: 120.5,
          averageSpeed: 40,
          duration: '48h 30m',
          status: 'completed',
        },
      ];

      setActiveTrips(mockActiveTrips);
      setCompletedTrips(mockCompletedTrips);
      setLoading(false);
    }, 500);
  }, []);

  // Filter trips
  useEffect(() => {
    // Filtering logic can be added here if needed
  }, [filters]);

  const handleViewTrip = (trip) => {
    setSelectedTrip(trip);
    setShowTripDetail(true);
    if (trip.currentLocation) {
      setMapCenter(trip.currentLocation);
    }
  };

  const handleDownloadTracking = (tripId) => {
    // In real app, this would download tracking data
    console.log(`Downloading tracking data for trip: ${tripId}`);
  };

  // Mock map component (placeholder)
  const MapView = ({ trips, center }) => {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg relative overflow-hidden">
        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-500 text-sm">Map View</p>
            <p className="text-gray-400 text-xs mt-1">Active Trips: {trips.length}</p>
          </div>
        </div>

        {/* Trip Markers */}
        {trips.map((trip, index) => (
          <div
            key={trip.id}
            className="absolute"
            style={{
              left: `${20 + index * 30}%`,
              top: `${30 + index * 20}%`,
            }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: theme.colors.primary }}
              onClick={() => handleViewTrip(trip)}
              title={trip.carName}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Stats calculation
  const stats = {
    active: activeTrips.length,
    completed: completedTrips.length,
    totalDistance: activeTrips.reduce((sum, trip) => sum + trip.distanceTraveled, 0),
    averageSpeed: activeTrips.length > 0
      ? activeTrips.reduce((sum, trip) => sum + trip.currentSpeed, 0) / activeTrips.length
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading tracking data...</p>
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
                Location & Tracking
              </h1>
              <p className="text-sm md:text-base text-gray-600">Track active trips and view location data</p>
            </div>
            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('active')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'active'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'active' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  Active Trips
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'history'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'history' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-green-600">{stats.active}</div>
            <div className="text-xs md:text-sm text-gray-600">Active Trips</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-gray-600">{stats.completed}</div>
            <div className="text-xs md:text-sm text-gray-600">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.totalDistance.toFixed(1)} km
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Distance</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {stats.averageSpeed.toFixed(0)} km/h
            </div>
            <div className="text-xs md:text-sm text-gray-600">Avg Speed</div>
          </Card>
        </div>

        {/* Map View - Active Trips */}
        {viewMode === 'active' && (
          <>
            <Card className="p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Map - Active Trips</h2>
              <MapView trips={activeTrips} center={mapCenter} />
            </Card>

            {/* Active Trips List */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Trips</h2>
            </div>

            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <Card key={trip.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Trip Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {trip.bookingId} - {trip.carName}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {trip.userName} • Owner: {trip.carOwner}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>

                      {/* Trip Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Current Location</p>
                          <p className="text-sm font-semibold text-gray-900">📍 {trip.currentLocation.address}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Current Speed</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.currentSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Distance Traveled</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {trip.distanceTraveled} / {trip.totalDistance} km
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.duration}</p>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                        <span>Start: {trip.startLocation.address}</span>
                        <span>→</span>
                        <span>End: {trip.endLocation.address}</span>
                        <span>•</span>
                        <span>Started: {new Date(trip.startTime).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-40">
                      <button
                        onClick={() => handleViewTrip(trip)}
                        className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/admin/bookings/${trip.bookingId}/tracking`)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Live Tracking
                      </button>
                      <button
                        onClick={() => handleDownloadTracking(trip.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Download Data
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {activeTrips.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No active trips at the moment.</p>
              </Card>
            )}
          </>
        )}

        {/* History View */}
        {viewMode === 'history' && (
          <>
            {/* Filters */}
            <Card className="p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
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

            {/* Completed Trips List */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Trips</h2>
            </div>

            <div className="space-y-4">
              {completedTrips.map((trip) => (
                <Card key={trip.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Trip Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {trip.bookingId} - {trip.carName}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {trip.userName} • Owner: {trip.carOwner}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Completed
                        </span>
                      </div>

                      {/* Trip Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Total Distance</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.totalDistance} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Average Speed</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.averageSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-sm font-semibold text-gray-900">{trip.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Completed</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(trip.endTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                        <span>Start: {trip.startLocation.address}</span>
                        <span>→</span>
                        <span>End: {trip.endLocation.address}</span>
                        <span>•</span>
                        <span>Started: {new Date(trip.startTime).toLocaleString()}</span>
                        <span>•</span>
                        <span>Ended: {new Date(trip.endTime).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-48">
                      <button
                        onClick={() => handleViewTrip(trip)}
                        className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDownloadTracking(trip.id)}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Download Data
                      </button>
                      <button
                        onClick={() => {
                          // View route replay
                          console.log('View route replay for trip:', trip.id);
                        }}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Route Replay
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {completedTrips.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No completed trips found.</p>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Trip Detail Modal */}
      {showTripDetail && selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => {
            setShowTripDetail(false);
            setSelectedTrip(null);
          }}
          onDownload={handleDownloadTracking}
        />
      )}
    </div>
  );
};

/**
 * Trip Detail Modal Component
 */
const TripDetailModal = ({ trip, onClose, onDownload }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{trip.bookingId}</h2>
            <p className="text-sm text-gray-600">{trip.carName}</p>
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
            {['overview', 'route', 'analytics'].map((tab) => (
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Trip Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Booking ID</label>
                      <p className="text-sm text-gray-900">{trip.bookingId}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">User</label>
                      <p className="text-sm text-gray-900">{trip.userName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Car</label>
                      <p className="text-sm text-gray-900">{trip.carName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900 capitalize">{trip.status}</p>
                    </div>
                    {trip.currentLocation && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">Current Location</label>
                        <p className="text-sm text-gray-900">📍 {trip.currentLocation.address}</p>
                      </div>
                    )}
                    {trip.currentSpeed && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">Current Speed</label>
                        <p className="text-sm text-gray-900">{trip.currentSpeed} km/h</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Start Location</label>
                      <p className="text-sm text-gray-900">{trip.startLocation.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trip.startLocation.lat}, {trip.startLocation.lng}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">End Location</label>
                      <p className="text-sm text-gray-900">{trip.endLocation.address}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trip.endLocation.lat}, {trip.endLocation.lng}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trip Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trip.distanceTraveled !== undefined && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">Distance Traveled</label>
                        <p className="text-sm font-semibold text-gray-900">
                          {trip.distanceTraveled} / {trip.totalDistance} km
                        </p>
                      </div>
                    )}
                    {trip.totalDistance && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">Total Distance</label>
                        <p className="text-sm font-semibold text-gray-900">{trip.totalDistance} km</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-gray-700">Average Speed</label>
                      <p className="text-sm font-semibold text-gray-900">
                        {trip.averageSpeed || trip.currentSpeed} km/h
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700">Duration</label>
                      <p className="text-sm font-semibold text-gray-900">{trip.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700">Start Time</label>
                      <p className="text-sm text-gray-900">{new Date(trip.startTime).toLocaleString()}</p>
                    </div>
                    {trip.endTime && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">End Time</label>
                        <p className="text-sm text-gray-900">{new Date(trip.endTime).toLocaleString()}</p>
                      </div>
                    )}
                    {trip.expectedEndTime && (
                      <div>
                        <label className="text-xs font-medium text-gray-700">Expected End Time</label>
                        <p className="text-sm text-gray-900">{new Date(trip.expectedEndTime).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'route' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h3>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm text-gray-500">Route visualization will appear here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Analytics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Distance</p>
                    <p className="text-lg font-semibold text-gray-900">{trip.totalDistance || trip.distanceTraveled} km</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Average Speed</p>
                    <p className="text-lg font-semibold text-gray-900">{trip.averageSpeed || trip.currentSpeed} km/h</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">{trip.duration}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Detailed analytics will be displayed here...</p>
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
              onDownload(trip.id);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download Tracking Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;

