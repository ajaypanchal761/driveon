import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/layout/BottomNavbar";
import { colors } from "../theme/colors";
import { useLocation } from "../../hooks/useLocation";
import { useAppSelector } from "../../hooks/redux";
import { getAddressFromCoordinates, searchPlaces } from "../../services/location.service";

/**
 * ModuleLocationPage
 * Mobile-only location selector page, opened from ModuleTestPage header.
 * UI inspired by the provided "Your route" design but using DriveOn theme.
 * Now fully dynamic with live location and Google Places API search.
 */

const ModuleLocationPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);
  
  // Get user's current live location
  const { currentLocation, coordinates } = useLocation(true, isAuthenticated, user?._id || user?.id);
  
  const [searchValue, setSearchValue] = useState("");
  const [fromLocation, setFromLocation] = useState("Getting location...");
  const [destination, setDestination] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedLocations, setSavedLocations] = useState([]);

  // Update from location when current location is available (real-time updates)
  useEffect(() => {
    if (currentLocation && 
        currentLocation !== 'Getting location...' && 
        currentLocation !== 'Location not supported' &&
        currentLocation !== 'Location permission denied' &&
        currentLocation !== 'Location unavailable') {
      setFromLocation(currentLocation);
    } else if (currentLocation === 'Getting location...') {
      setFromLocation('Getting location...');
    }
  }, [currentLocation]);

  // Search places dynamically using Google Places API
  useEffect(() => {
    const searchPlacesAsync = async () => {
      if (!searchValue.trim()) {
        // Show saved locations when search is empty
        setFilteredLocations(savedLocations);
        return;
      }

      setIsSearching(true);
      try {
        // Use Google Places API to search for locations
        const results = await searchPlaces(searchValue, coordinates);
        
        if (results && results.length > 0) {
          const formattedResults = results.map((place, index) => ({
            id: place.place_id || `place-${index}`,
            label: place.name || place.formatted_address || 'Unknown',
            sublabel: place.formatted_address || place.vicinity || '',
            type: place.types?.[0] || 'recent',
            coordinates: place.geometry?.location,
          }));
          setFilteredLocations(formattedResults);
        } else {
          setFilteredLocations([]);
        }
      } catch (error) {
        console.error('Error searching places:', error);
        // Fallback: filter saved locations
        const filtered = savedLocations.filter(
          (loc) =>
            loc.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
            loc.sublabel?.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredLocations(filtered);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchPlacesAsync();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, coordinates, savedLocations]);

  const handleLocationSelect = (location) => {
    setDestination(location);
    setSearchValue("");
    // Navigate back after a short delay to show selection
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  const handleSwapLocations = () => {
    if (destination) {
      const temp = fromLocation;
      setFromLocation(destination.label);
      setDestination(null);
      // You could also set a new from location here if needed
    }
  };

  const renderIcon = (type) => {
    // Handle Google Places API types
    const normalizedType = type?.toLowerCase() || 'recent';
    
    if (normalizedType.includes('home') || normalizedType.includes('lodging')) {
      return (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10.5L12 4l9 6.5M5 10.5V20h14v-9.5"
          />
        </svg>
      );
    } else if (normalizedType.includes('work') || normalizedType.includes('establishment')) {
      return (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7h16M4 7v11a2 2 0 002 2h12a2 2 0 002-2V7M4 7l2-3h12l2 3"
          />
        </svg>
      );
    } else if (normalizedType.includes('airport')) {
      return (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.5 4.5l3 3L21 4.5l-3 7.5 3 6-7.5-3-3 3v-5.25L4.5 9l3-3 5.25 3z"
          />
        </svg>
      );
    } else if (normalizedType.includes('station') || normalizedType.includes('transit')) {
      return (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2a7 7 0 00-7 7c0 4.418 4.2 8.25 6.188 9.844a1.2 1.2 0 001.624 0C14.8 17.25 19 13.418 19 9a7 7 0 00-7-7z"
          />
          <circle cx="12" cy="9" r="2.5" fill="currentColor" />
        </svg>
      );
    } else {
      // Default: recent/location pin
      return (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
  };

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden md:hidden"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Header */}
      <header className="px-4 pt-6 pb-3 flex items-center justify-between flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-900">Your route</h1>
        <div className="w-8 h-8" />
      </header>

      {/* Content - Directly on page, no card */}
      <main className="flex-1 px-4 pb-28 overflow-y-auto">
        {/* From / To inputs */}
        <div className="pt-2 space-y-3">
            {/* From */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-full flex items-start gap-3 hover:bg-gray-50 rounded-lg p-1 -m-1 transition-colors"
            >
              <div
                className="mt-1 w-3 h-3 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: colors.backgroundTertiary }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                ></div>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[11px] font-semibold text-gray-500 mb-0.5">
                  From
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {fromLocation}
                </p>
              </div>
            </button>

            {/* Separator line */}
            <div className="ml-4 pl-1 border-l border-dashed border-gray-200 h-4" />

            {/* Add destination - Search input */}
            <div
              className="w-full flex items-center gap-2 rounded-2xl border-2 bg-white px-3 py-2.5 shadow-sm"
              style={{ borderColor: "#10b981" }}
            >
              {/* Search icon */}
              <svg
                className="w-4 h-4 text-gray-500 flex-shrink-0"
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
              {/* Input field */}
              <input
                type="text"
                placeholder="Add destination"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none border-none bg-transparent"
              />
              {/* Clear button (X) */}
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  <svg
                    className="w-3 h-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {/* Map pin icon */}
              <button
                type="button"
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.backgroundTertiary }}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657A8 8 0 1117.657 16.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Destination - Show selected or placeholder */}
            <div className="flex items-start gap-3">
              <div className="mt-1.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  destination ? 'border-gray-400' : 'border-gray-300'
                }`}>
                  {destination ? (
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-gray-500 mb-0.5">
                  Destination
                </p>
                {destination ? (
                  <p className="text-sm font-semibold text-gray-900">
                    {destination.label}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">Choose destination</p>
                )}
              </div>
            </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4" />

        {/* Recent / Saved locations list */}
        <div className="space-y-3">
          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: colors.backgroundTertiary }}></div>
              <p className="text-sm text-gray-500">Searching locations...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No locations found</p>
              <p className="text-xs text-gray-400 mt-1">
                {searchValue ? 'Try a different search term' : 'Start typing to search for places'}
              </p>
            </div>
          ) : (
            filteredLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={`w-full flex items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-gray-50 active:bg-gray-100 text-left transition-colors ${
                  destination?.id === loc.id ? 'bg-gray-50 border border-gray-200' : ''
                }`}
                onClick={() => handleLocationSelect(loc)}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  {renderIcon(loc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {loc.label}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {loc.sublabel}
                  </p>
                </div>
                {destination?.id === loc.id && (
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>
      </main>

      {/* Bottom navbar to keep module navigation consistent */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ModuleLocationPage;

