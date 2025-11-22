import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme/theme.constants';
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../assets/car_img2-removebg-preview.png';
import carImg3 from '../../assets/car_img3-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg7 from '../../assets/car_img7-removebg-preview.png';

/**
 * CarListingPage Component
 * Car listing page - Mobile-optimized with horizontal card layout
 * Matches the Tesla Model X card design pattern
 */
const CarListingPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    brand: [],
    seats: [],
    fuelType: [],
    transmission: [],
    color: [],
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    carType: [],
  });

  // Mock car data based on document.txt structure
  const cars = [
    {
      id: '1',
      brand: 'Tesla',
      model: 'Model X',
      year: 2018,
      price: 180,
      image: carImg1,
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Electric',
      color: 'White',
      rating: 4.8,
    },
    {
      id: '2',
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2020,
      price: 220,
      image: carImg2,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'Silver',
      rating: 4.7,
    },
    {
      id: '3',
      brand: 'BMW',
      model: '7 Series',
      year: 2019,
      price: 200,
      image: carImg3,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'White',
      rating: 4.6,
    },
    {
      id: '4',
      brand: 'Audi',
      model: 'A8 L',
      year: 2021,
      price: 210,
      image: carImg4,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'Black',
      rating: 4.9,
    },
    {
      id: '5',
      brand: 'Jaguar',
      model: 'XF',
      year: 2019,
      price: 175,
      image: carImg5,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      color: 'Blue',
      rating: 4.5,
    },
    {
      id: '6',
      brand: 'Lexus',
      model: 'LS 500',
      year: 2020,
      price: 195,
      image: carImg6,
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      color: 'Grey',
      rating: 4.8,
    },
    {
      id: '7',
      brand: 'Porsche',
      model: 'Panamera',
      year: 2021,
      price: 250,
      image: carImg7,
      seats: 4,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      color: 'Red',
      rating: 4.9,
    },
  ];

  const handleDetailsClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      if (filterType === 'priceRange' || filterType === 'rating') {
        return { ...prev, [filterType]: value };
      }
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      brand: [],
      seats: [],
      fuelType: [],
      transmission: [],
      color: [],
      priceRange: { min: 0, max: 1000 },
      rating: 0,
      carType: [],
    });
  };

  const handleApplyFilters = () => {
    // Apply filters logic here
    setShowFilters(false);
  };

  // Available filter options
  const filterOptions = {
    brand: ['Tesla', 'Mercedes-Benz', 'BMW', 'Audi', 'Jaguar', 'Lexus', 'Porsche'],
    seats: [4, 5, 7],
    fuelType: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    transmission: ['Automatic', 'Manual'],
    color: ['White', 'Black', 'Silver', 'Blue', 'Red', 'Grey'],
    carType: ['SUV', 'Sedan', 'Hatchback', 'Coupe'],
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Slide-out Filter Panel - Mobile */}
      {showFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowFilters(false)}
          ></div>
          
          {/* Filter Panel - Mobile */}
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden ${
              showFilters ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 touch-target"
                  aria-label="Close filters"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
              </div>

              {/* Filter Options */}
              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.brand.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.brand.includes(brand)}
                          onChange={() => handleFilterChange('brand', brand)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: theme.colors.primary }}
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Seats Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Seats</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.seats.map((seat) => (
                      <button
                        key={seat}
                        onClick={() => handleFilterChange('seats', seat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.seats.includes(seat)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={
                          filters.seats.includes(seat)
                            ? { backgroundColor: theme.colors.primary }
                            : {}
                        }
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Fuel Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.fuelType.map((fuel) => (
                      <label
                        key={fuel}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.fuelType.includes(fuel)}
                          onChange={() => handleFilterChange('fuelType', fuel)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: theme.colors.primary }}
                        />
                        <span className="text-sm text-gray-700">{fuel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transmission Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Transmission</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.transmission.map((trans) => (
                      <label
                        key={trans}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.transmission.includes(trans)}
                          onChange={() => handleFilterChange('transmission', trans)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: theme.colors.primary }}
                        />
                        <span className="text-sm text-gray-700">{trans}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleFilterChange('color', color)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.color.includes(color)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={
                          filters.color.includes(color)
                            ? { backgroundColor: theme.colors.primary }
                            : {}
                        }
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Price Range (Rs./day)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              min: parseInt(e.target.value) || 0,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Min"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              max: parseInt(e.target.value) || 1000,
                            },
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={filters.rating}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          rating: parseFloat(e.target.value),
                        }))
                      }
                      className="flex-1"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                      {filters.rating.toFixed(1)}+
                    </span>
                  </div>
                </div>

                {/* Car Type Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Car Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.carType.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange('carType', type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.carType.includes(type)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={
                          filters.carType.includes(type)
                            ? { backgroundColor: theme.colors.primary }
                            : {}
                        }
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <button
                  onClick={handleApplyFilters}
                  className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white shadow-sm"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-3 rounded-lg text-sm font-semibold border-2"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Filter Backdrop */}
      {showDesktopFilters && (
        <div
          className="hidden md:block fixed inset-0 bg-black/50 z-20"
          onClick={() => setShowDesktopFilters(false)}
        ></div>
      )}

      {/* Desktop Filter Sidebar */}
      <div className={`hidden md:block fixed top-0 right-0 h-full w-80 bg-white z-30 shadow-lg overflow-y-auto border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
        showDesktopFilters ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setShowDesktopFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close filters"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
          </div>

          {/* Filter Options - Same as mobile */}
          <div className="space-y-6">
            {/* Brand Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.brand.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brand.includes(brand)}
                      onChange={() => handleFilterChange('brand', brand)}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seats Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Seats</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.seats.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => handleFilterChange('seats', seat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.seats.includes(seat)
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={
                      filters.seats.includes(seat)
                        ? { backgroundColor: theme.colors.primary }
                        : {}
                    }
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Fuel Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.fuelType.map((fuel) => (
                  <label
                    key={fuel}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.fuelType.includes(fuel)}
                      onChange={() => handleFilterChange('fuelType', fuel)}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <span className="text-sm text-gray-700">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Transmission</h3>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.transmission.map((trans) => (
                  <label
                    key={trans}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.transmission.includes(trans)}
                      onChange={() => handleFilterChange('transmission', trans)}
                      className="w-4 h-4 rounded border-gray-300"
                      style={{ accentColor: theme.colors.primary }}
                    />
                    <span className="text-sm text-gray-700">{trans}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.color.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleFilterChange('color', color)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.color.includes(color)
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={
                      filters.color.includes(color)
                        ? { backgroundColor: theme.colors.primary }
                        : {}
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Price Range (Rs./day)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange,
                          min: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: {
                          ...prev.priceRange,
                          max: parseInt(e.target.value) || 1000,
                        },
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: parseFloat(e.target.value),
                    }))
                  }
                  className="flex-1"
                  style={{ accentColor: theme.colors.primary }}
                />
                <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                  {filters.rating.toFixed(1)}+
                </span>
              </div>
            </div>

            {/* Car Type Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Car Type</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.carType.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('carType', type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.carType.includes(type)
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={
                      filters.carType.includes(type)
                        ? { backgroundColor: theme.colors.primary }
                        : {}
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
            <button
              onClick={handleApplyFilters}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold border-2"
              style={{
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Header Section - Purple Background */}
      <header className="bg-[#3d096d] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white rounded-full -mr-16 -mt-16 md:-mr-24 md:-mt-24"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 bg-white rounded-full -ml-12 -mb-12 md:-ml-18 md:-mb-18"></div>
        </div>

        <div className="relative px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 md:max-w-7xl md:mx-auto">
          {/* Back Button, Title and Filter - Same Line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="p-1.5 -ml-1 touch-target hover:opacity-80 transition-opacity hover:bg-white/10 rounded-lg"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Title */}
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white">Browse Cars</h1>
            </div>
            
            {/* Filter Button - Mobile Only */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 touch-target md:hidden"
              aria-label="Filter cars"
            >
              <svg
                className={`w-5 h-5 text-white ${showFilters ? 'opacity-100' : 'opacity-90'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            {/* Filter Button - Desktop Only */}
            <button
              onClick={() => setShowDesktopFilters(!showDesktopFilters)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              aria-label="Filter cars"
            >
              <svg
                className={`w-5 h-5 text-white ${showDesktopFilters ? 'opacity-100' : 'opacity-90'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="text-sm font-medium text-white">Filters</span>
            </button>
          </div>
        </div>
      </header>

      {/* Car Listings - 1 card per row on mobile, grid on desktop */}
      <div className={`px-3 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 transition-all duration-300 ${
        showDesktopFilters ? 'md:pr-80' : ''
      }`}>
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-5 md:max-w-7xl md:mx-auto">
          {cars.map((car) => (
            <div
              key={car.id}
              onClick={() => handleDetailsClick(car.id)}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 relative cursor-pointer active:scale-[0.98] md:active:scale-100 transition-all hover:shadow-lg hover:-translate-y-1 p-3 md:p-3 lg:p-4"
            >
              {/* Compact Horizontal Card Layout - Mobile, Vertical on Desktop */}
              <div className="flex gap-3 md:flex-col md:gap-3">
                {/* Car Image */}
                <div className="flex-shrink-0 w-20 md:w-full flex items-center justify-center md:bg-gray-50 md:rounded-lg md:p-3">
                  <div className="w-20 h-20 md:w-full md:h-36 lg:h-40 flex items-center justify-center">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>

                {/* Car Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  {/* Top Section - Car Name, Year and Rating */}
                  <div className="mb-1.5 md:mb-2">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="text-base md:text-base lg:text-lg font-bold text-gray-900 leading-tight truncate">
                          {car.brand} {car.model}
                        </h3>
                        <span className="text-xs text-gray-500">{car.year}</span>
                      </div>
                      {/* Rating at top right */}
                      <div className="flex items-center flex-shrink-0">
                        <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-semibold text-gray-900">{car.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Car Details - Seats, Fuel Type, Transmission, Color */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 md:gap-x-2 md:gap-y-1.5 mb-1.5 md:mb-2">
                    <div className="flex items-center text-xs md:text-sm text-gray-700">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">{car.seats}</span>
                    </div>
                    
                    <div className="flex items-center text-xs md:text-sm text-gray-700">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{car.fuelType}</span>
                    </div>
                    
                    <div className="flex items-center text-xs md:text-sm text-gray-700">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{car.transmission}</span>
                    </div>
                    
                    <div className="flex items-center text-xs md:text-sm text-gray-700">
                      <svg className="w-3 h-3 md:w-4 md:h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span className="font-medium">{car.color}</span>
                    </div>
                  </div>
                  
                  {/* Price and Details Button - Same Line */}
                  <div className="flex items-center justify-between pt-1.5 md:pt-2">
                    {/* Price */}
                    <div className="flex items-baseline">
                      <span className="text-sm md:text-base lg:text-lg font-bold text-gray-900">
                        Rs. {car.price}
                      </span>
                      <span className="text-xs text-gray-500 ml-0.5">/day</span>
                    </div>
                    
                    {/* Details Button - Smaller */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailsClick(car.id);
                      }}
                      className="px-3 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs md:text-xs lg:text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                      style={{ backgroundColor: theme.colors.primary }}
                      aria-label="View details"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarListingPage;

