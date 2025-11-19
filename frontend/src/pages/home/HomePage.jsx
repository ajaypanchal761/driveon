import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { theme } from '../../theme/theme.constants';

/**
 * HomePage Component
 * Exact match to the mobile app design shown in the image
 * Mobile-first design with purple theme
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const [location, setLocation] = useState('Lombok mataram');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Mock data for vehicles
  const vehicles = [
    { id: 1, name: 'Vintage Yellow Car', image: '/api/placeholder/200/150' },
    { id: 2, name: 'Modern Silver Car', image: '/api/placeholder/200/150' },
    { id: 3, name: 'SUV Vehicle', image: '/api/placeholder/200/150' },
    { id: 4, name: 'Sports Car', image: '/api/placeholder/200/150' },
  ];

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Status Bar Spacing */}
      <div className="h-6" style={{ backgroundColor: theme.colors.primary }}></div>

      {/* Header Section - Purple Background */}
      <header className="text-white relative overflow-hidden md:rounded-none rounded-b-3xl" style={{ backgroundColor: theme.colors.primary }}>
        {/* Abstract purple pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Header Content */}
        <div className="relative px-4 py-3 flex items-center justify-between">
          {/* Location Section */}
          <div className="flex items-center gap-2 flex-1">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="flex-1">
              <div className="text-xs text-white/80">Your location</div>
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1 text-sm font-medium"
              >
                {location}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Profile Picture */}
          <button
            onClick={handleProfileClick}
            className="ml-4 touch-target"
            aria-label="Profile"
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 py-4 space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search vehicle.."
            className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        {/* Top Chart of the Day Banner */}
        <div className="rounded-xl p-4 relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          </div>

          <div className="relative flex items-center justify-between">
            {/* Left Side - Text Content */}
            <div className="flex-1 pr-4">
              <div className="text-xs text-white/70 mb-1 uppercase tracking-wide">top chart of the day</div>
              <h2 className="text-xl font-bold text-white mb-3 leading-tight">Stuff You Should Know</h2>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-md">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Read Now
              </button>
            </div>

            {/* Right Side - SUV Image */}
            <div className="w-32 h-24 flex-shrink-0 relative">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Simple car silhouette */}
                <svg
                  className="w-24 h-24 text-gray-400"
                  viewBox="0 0 100 60"
                  fill="currentColor"
                >
                  <rect x="15" y="25" width="70" height="20" rx="2" />
                  <rect x="20" y="15" width="25" height="15" rx="2" />
                  <rect x="55" y="15" width="25" height="15" rx="2" />
                  <circle cx="30" cy="45" r="5" />
                  <circle cx="70" cy="45" r="5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Brands Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Brands</h3>
            <button className="text-sm font-medium hover:underline" style={{ color: theme.colors.primary }}>See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[1, 2, 3, 4].map((brand) => (
              <div
                key={brand}
                className="flex-shrink-0 w-20 h-20 bg-black rounded-lg flex items-center justify-center shadow-sm"
              >
                <svg
                  className="w-12 h-12 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4v8.82c0 4.54-3.07 8.76-8 9.82-4.93-1.06-8-5.28-8-9.82V8.18l8-4z" />
                  <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-2.21 0-4-1.79-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.21-1.79 4-4 4z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Identify the Closest Vehicle Card */}
        <div className="rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: theme.colors.primary }}>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: theme.colors.primary }}></div>
            </div>
            <span className="text-white font-medium text-sm">Identify the closest vehicle</span>
          </div>
          <svg
            className="w-5 h-5 text-white flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Available Near You Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Available Near You</h3>
            <button className="text-sm font-medium hover:underline" style={{ color: theme.colors.primary }}>See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                  {/* Car silhouette placeholder */}
                  <svg
                    className="w-20 h-20 text-gray-400"
                    viewBox="0 0 100 60"
                    fill="currentColor"
                  >
                    <rect x="15" y="25" width="70" height="20" rx="2" />
                    <rect x="20" y="15" width="25" height="15" rx="2" />
                    <rect x="55" y="15" width="25" height="15" rx="2" />
                    <circle cx="30" cy="45" r="5" />
                    <circle cx="70" cy="45" r="5" />
                  </svg>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{vehicle.name}</h4>
                  <p className="text-xs text-gray-500">Available now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
