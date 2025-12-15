import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/layout/BottomNavbar";
import { colors } from "../theme/colors";
import FilterDropdown from "../components/common/FilterDropdown";

// Use existing car images from assets
import carImg1 from "../../assets/car_banImg1.jpg";
import carImg2 from "../../assets/car_banImg2.jpg";
import carImg3 from "../../assets/car_banImg3.jpg";
import carImg4 from "../../assets/car_banImg4.jpg";
import carImg5 from "../../assets/car_banImg5.jpg";
import carImg6 from "../../assets/car_img6-removebg-preview.png";
import nearbyImg1 from "../../assets/car_img8.png";
import nearbyImg2 from "../../assets/car_img4-removebg-preview.png";
import nearbyImg3 from "../../assets/car_img5-removebg-preview.png";
import logo1 from "../../assets/car_logo1_PNG1.png";
import logo2 from "../../assets/car_logo2_PNG.png";
import logo4 from "../../assets/car_logo4_PNG.png";
import logo5 from "../../assets/car_logo5_PNG.png";
import logo8 from "../../assets/car_logo8_PNG.png";
import logo10 from "../../assets/car_logo10_PNG.png";
import logo11 from "../../assets/car_logo11_PNG.png";

/**
 * ModuleTestPage
 * Standalone page that visually matches the reference mobile screen.
 * Purely UI/layout – no business logic changed.
 */
const ModuleTestPage = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, label: "Sports", count: 78, image: carImg1 },
    { id: 2, label: "Electric", count: 304, image: carImg2 },
    { id: 3, label: "Legends", count: 47, image: carImg3 },
    { id: 4, label: "Classic", count: 12, image: carImg4 },
    { id: 5, label: "Coupe", count: 19, image: carImg5 },
  ];

  const brands = [
    { id: 1, logo: logo4, name: "Ferrari" },
    { id: 2, logo: logo5, name: "Lamborghini" },
    { id: 3, logo: logo11, name: "Nissan" },
    { id: 4, logo: logo10, name: "Audi" },
    { id: 5, logo: logo8, name: "Honda" },
    { id: 6, logo: logo1, name: "Kia" },
    { id: 7, logo: logo2, name: "Toyota" },
  ];

  const nearbyCars = [
    {
      id: 1,
      name: "BMW 3 Series",
      rating: "5.0",
      location: "New York",
      seats: "5 Seats",
      price: "Rs. 150/Day",
      image: nearbyImg1,
    },
    {
      id: 2,
      name: "Lamborghini Aventador",
      rating: "4.9",
      location: "New York",
      seats: "2 Seats",
      price: "Rs. 250/Day",
      image: nearbyImg2,
    },
    {
      id: 3,
      name: "BMW M2 GTS",
      rating: "5.0",
      location: "Los Angeles",
      seats: "5 Seats",
      price: "Rs. 150/Day",
      image: nearbyImg3,
    },
  ];

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [activeFilter, setActiveFilter] = useState("$200–$1,000 / day");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTimeDisplay = () => {
    return `${selectedHour} : ${selectedMinute} ${selectedPeriod.toLowerCase()}`;
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: colors.backgroundTertiary }}
    >
      {/* TOP COMPACT HEADER - matches reference */}
      <div
        className="px-4 pt-6 pb-4 space-y-2"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
        <div className="flex justify-start mb-1.5">
          <img
            alt="DriveOn Logo"
            src="/driveonlogo.png"
            className="h-9 w-auto object-contain"
          />
        </div>
        {/* Location pill */}
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-full px-4 py-1.5 text-[11px]"
          style={{
            backgroundColor: colors.backgroundTertiary,
            color: colors.textWhite,
          }}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px]"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              <svg
                className="w-3 h-3"
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
            </span>
            <span className="truncate">Los Angeles, California, U.S.</span>
          </span>
          <svg
            className="w-3 h-3 text-gray-300 flex-shrink-0"
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

        {/* Date & time pill */}
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-full px-4 py-2 text-[11px]"
          style={{
            backgroundColor: colors.backgroundTertiary,
            color: colors.textWhite,
          }}
          onClick={() => setIsCalendarOpen(true)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <svg
              className="w-4 h-4 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="truncate">
              {pickupDate && dropoffDate
                ? `${formatDateDisplay(
                    pickupDate
                  )}, ${formatTimeDisplay()} – ${formatDateDisplay(
                    dropoffDate
                  )}, ${formatTimeDisplay()}`
                : `Sep 1, ${formatTimeDisplay()} – Sep 3, ${formatTimeDisplay()}`}
            </span>
          </span>
          <svg
            className="w-3 h-3 text-gray-300 flex-shrink-0"
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
        </button>
      </div>

      {/* CONTENT */}
      <main
        className="flex-1 pb-0"
        style={{ backgroundColor: colors.backgroundTertiary }}
      >
        {/* Floating white card container like reference */}
        <div className="mt-3 rounded-t-3xl bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-4 pt-4 pb-28 space-y-4">
          {/* FILTER PILLS ROW */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {/* All filters pill */}
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium flex-shrink-0 border"
              style={{
                borderColor: "#e5e7eb",
                backgroundColor:
                  activeFilter === "All filters"
                    ? colors.backgroundTertiary
                    : colors.backgroundSecondary,
                color:
                  activeFilter === "All filters"
                    ? "#ffffff"
                    : colors.textPrimary,
              }}
              onClick={() => {
                setActiveFilter("All filters");
                setIsFilterOpen(true);
              }}
            >
              <span>All filters</span>
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6L15 13.25V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.75L3.2 4.6A1 1 0 013 4z"
                />
              </svg>
            </button>

            {/* Price pill */}
            <button
              type="button"
              className="px-3 py-1.5 rounded-full text-[11px] font-medium flex-shrink-0"
              style={{
                backgroundColor:
                  activeFilter === "$200–$1,000 / day"
                    ? colors.backgroundTertiary
                    : colors.backgroundSecondary,
                color:
                  activeFilter === "$200–$1,000 / day"
                    ? "#ffffff"
                    : colors.textSecondary,
                border: "1px solid #e5e7eb",
              }}
              onClick={() => setActiveFilter("$200–$1,000 / day")}
            >
              $200–$1,000 / day
            </button>

            {["Brand", "Body", "More"].map((label) => (
              <button
                key={label}
                type="button"
                className="px-3 py-1.5 rounded-full text-[11px] font-medium flex-shrink-0 border"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor:
                    activeFilter === label
                      ? colors.backgroundTertiary
                      : colors.backgroundSecondary,
                  color:
                    activeFilter === label ? "#ffffff" : colors.textSecondary,
                }}
                onClick={() => setActiveFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CATEGORY IMAGE CARDS */}
          <div className="bg-white rounded-3xl px-3 pt-3 pb-4 shadow-sm border border-gray-100">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="flex-shrink-0 w-24"
                  onClick={() => navigate("/")}
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden mb-2 bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-gray-900">
                      {cat.label}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {cat.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TOP BRANDS SECTION (between categories and meta row) */}
          <div className="mb-4">
            <h2 className="text-sm font-bold text-black mb-3">Brands</h2>
            <div className="relative overflow-hidden w-full">
              <div className="flex gap-7 brands-scroll">
                {brands.concat(brands).map((brand, index) => (
                  <div
                    key={`${brand.id}-${index}`}
                    className="flex flex-col items-center gap-1.5 shrink-0"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center p-2.5"
                      style={{ backgroundColor: colors.backgroundTertiary }}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <style>{`
              .brands-scroll {
                animation: scrollBrands 30s linear infinite;
                display: flex;
                width: fit-content;
              }
              @keyframes scrollBrands {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .brands-scroll:hover {
                animation-play-state: paused;
              }
            `}</style>
          </div>

          {/* META ROW */}
          <div className="flex items-center justify-between mt-1 px-1">
            <span className="text-xs text-gray-500">165 available</span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs text-gray-600"
            >
              <span>Popular</span>
              <svg
                className="w-3 h-3"
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

          {/* FEATURED CAR CARD */}
          <div className="px-1">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <div className="w-full h-48 bg-gray-100">
                <img
                  src={carImg1}
                  alt="Audi R8 Performance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 pt-3 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Audi R8 Performance
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">$800 / day</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-white"
                      style={{ backgroundColor: colors.backgroundTertiary }}
                    >
                      <svg
                        className="w-3 h-3 text-yellow-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>5.0</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BEST CARS GRID (above Nearby) */}
          <div className="mt-4 px-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black">
                Best Cars
              </h2>
              <button
                type="button"
                className="text-sm text-gray-500 font-medium"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Ferrari-FF card */}
              <div
                className="w-full rounded-xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d0d0",
                }}
              >
                <div
                  className="relative w-full h-28 md:h-40 flex items-center justify-center rounded-t-xl overflow-hidden"
                  style={{ backgroundColor: "#f0f0f0" }}
                >
                  <img
                    alt="Ferrari-FF"
                    src={carImg1}
                    className="w-full h-full object-contain scale-125"
                    style={{ opacity: 1 }}
                  />
                  <button className="absolute -top-1 left-1.5 md:left-2 z-10">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-2 md:p-3 lg:p-4">
                  <h3 className="text-xs md:text-sm lg:text-base font-bold text-black mb-1 md:mb-1.5">
                    Ferrari-FF
                  </h3>
                  <div className="flex items-center gap-1 mb-1 md:mb-1.5">
                    <span className="text-xs md:text-sm font-semibold text-black">
                      5.0
                    </span>
                    <svg
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
                      fill="#FF6B35"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                    <svg
                      className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500"
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
                    <span className="text-[10px] md:text-xs text-gray-500">
                      Washington DC
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 md:mt-2">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                        />
                      </svg>
                      <span className="text-[10px] md:text-xs text-gray-500">
                        4 Seats
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] md:text-xs text-gray-500">
                        Rs. 200/Day
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tesla Model S card */}
              <div
                className="w-full rounded-xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d0d0d0",
                }}
              >
                <div
                  className="relative w-full h-28 md:h-40 flex items-center justify-center rounded-t-xl overflow-hidden"
                  style={{ backgroundColor: "#f0f0f0" }}
                >
                  <img
                    alt="Tesla Model S"
                    src={carImg6}
                    className="w-full h-full object-contain scale-125"
                    style={{ opacity: 1 }}
                  />
                  <button className="absolute -top-1 left-1.5 md:left-2 z-10">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-2 md:p-3 lg:p-4">
                  <h3 className="text-xs md:text-sm lg:text-base font-bold text-black mb-1 md:mb-1.5">
                    Tesla Model S
                  </h3>
                  <div className="flex items-center gap-1 mb-1 md:mb-1.5">
                    <span className="text-xs md:text-sm font-semibold text-black">
                      5.0
                    </span>
                    <svg
                      className="w-3.5 h-3.5 md:w-4 md:h-4"
                      fill="#FF6B35"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                    <svg
                      className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500"
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
                    <span className="text-[10px] md:text-xs text-gray-500">
                      Chicago, USA
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 md:mt-2">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                        />
                      </svg>
                      <span className="text-[10px] md:text-xs text-gray-500">
                        5 Seats
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] md:text-xs text-gray-500">
                        Rs. 100/Day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NEARBY CARS SECTION (horizontal cards) */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-black">Nearby</h2>
              <button
                type="button"
                className="text-sm text-gray-500 font-medium"
              >
                View All
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0">
              {nearbyCars.map((car) => (
                <div key={car.id} className="min-w-[280px] flex-shrink-0">
                  <div
                    className="w-full rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #d0d0d0",
                    }}
                  >
                    <div
                      className="relative w-full h-28 flex items-center justify-center rounded-t-xl overflow-hidden"
                      style={{ backgroundColor: "#f0f0f0" }}
                    >
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-contain scale-125"
                      />
                      <button className="absolute -top-1 left-1.5 z-10">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-2 md:p-3">
                      <h3 className="text-xs md:text-sm font-bold text-black mb-1">
                        {car.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs md:text-sm font-semibold text-black">
                          {car.rating}
                        </span>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="#FF6B35"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 mb-1.5">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-[10px] md:text-xs text-gray-500">
                          {car.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1">
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
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                            />
                          </svg>
                          <span className="text-[10px] md:text-xs text-gray-500">
                            {car.seats}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] md:text-xs text-gray-500">
                            {car.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION (reuse existing) */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>

      {/* Calendar modal styled like provided popup */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl bg-white opacity-100">
            <div className="p-4">
              {/* Time summary + open clock popup */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-black">
                  Time
                </label>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="w-auto px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      borderColor: "#21292b",
                      backgroundColor: "#21292b",
                      color: "#ffffff",
                    }}
                    onClick={() => setIsTimeOpen(true)}
                  >
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold text-sm">
                      {formatTimeDisplay()}
                    </span>
                  </button>
                </div>
              </div>

              {/* Calendar header */}
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                    type="button"
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h4 className="text-base font-semibold text-black">
                    December {new Date().getFullYear()}
                  </h4>
                  <button
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                    type="button"
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Week days */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-semibold py-1 text-gray-600"
                      >
                        {d}
                      </div>
                    )
                  )}

                  {/* Simple static days grid to match design */}
                  <div></div>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                    (day) => (
                      <button
                        key={day}
                        type="button"
                        disabled
                        className="p-1.5 rounded-lg text-xs font-semibold transition-all cursor-not-allowed"
                        style={{
                          backgroundColor: "transparent",
                          color: "#d1d5db",
                        }}
                      >
                        {day}
                      </button>
                    )
                  )}
                  {[
                    15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                    31,
                  ].map((day) => (
                    <button
                      key={day}
                      type="button"
                      className="p-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-gray-100"
                      style={{
                        backgroundColor: "transparent",
                        color: "#000000",
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  type="button"
                  style={{
                    borderColor: "#21292b",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  type="button"
                  style={{ backgroundColor: "#21292b" }}
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters popup */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[55] flex items-start justify-center bg-black/40 px-4 pt-24 md:hidden">
          <div
            className="filter-dropdown w-full max-w-md max-h-[75vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-20 px-3 py-2 flex items-center justify-between border-b"
              style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <h3 className="text-base font-bold text-black">Filters</h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
                type="button"
                onClick={() => setIsFilterOpen(false)}
              >
                <svg
                  className="w-6 h-6 text-gray-500"
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

            {/* Body (full static UI based on provided layout) */}
            <div className="p-3 space-y-3 md:space-y-4 text-xs text-black">
              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Brand
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    className="w-full px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <span>All Brands</span>
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

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Model
                </label>
                <input
                  placeholder="Enter model name"
                  className="w-full px-2.5 py-1.5 rounded-lg border text-xs"
                  type="text"
                  style={{
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Seats
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    className="w-full px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <span>Any</span>
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

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Fuel Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Petrol", "Diesel", "Electric", "Hybrid"].map((f) => (
                    <button
                      key={f}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                      style={{
                        borderColor: "#e5e7eb",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      type="button"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Transmission
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Manual", "Automatic", "CVT"].map((t) => (
                    <button
                      key={t}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                      style={{
                        borderColor: "#e5e7eb",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      type="button"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Color
                </label>
                <div className="relative w-full">
                  <button
                    type="button"
                    className="w-full px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <span>Any Color</span>
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

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Price Range (per day)
                </label>
                <div className="flex gap-1.5">
                  <input
                    placeholder="Min"
                    className="w-24 px-3 py-2 rounded-lg border text-sm"
                    type="number"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "#ffffff",
                    }}
                  />
                  <input
                    placeholder="Max"
                    className="w-24 px-3 py-2 rounded-lg border text-sm"
                    type="number"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Minimum Rating
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["4.0+ ⭐", "4.5+ ⭐", "5.0 ⭐"].map((r) => (
                    <button
                      key={r}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                      style={{
                        borderColor: "#e5e7eb",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      type="button"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Car Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "SUV",
                    "Sedan",
                    "Hatchback",
                    "Coupe",
                    "Convertible",
                    "Wagon",
                  ].map((c) => (
                    <button
                      key={c}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                      style={{
                        borderColor: "#e5e7eb",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      type="button"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Location
                </label>
                <input
                  placeholder="Enter location"
                  className="w-full px-2.5 py-1.5 rounded-lg border text-xs"
                  type="text"
                  style={{
                    borderColor: "#e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Availability
                </label>
                <div className="space-y-1.5">
                  {["From Date & Time", "To Date & Time"].map((label) => (
                    <div key={label} className="relative w-full">
                      <button
                        type="button"
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between"
                        style={{
                          borderColor: "#e5e7eb",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <span>{label}</span>
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Features
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "GPS Navigation",
                    "Bluetooth",
                    "USB Charging",
                    "Air Conditioning",
                    "Sunroof",
                    "Leather Seats",
                    "Backup Camera",
                    "Parking Sensors",
                  ].map((f) => (
                    <button
                      key={f}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                      style={{
                        borderColor: "#e5e7eb",
                        backgroundColor: "#ffffff",
                        color: "#000000",
                      }}
                      type="button"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div
              className="sticky bottom-0 px-3 py-2 flex gap-2 border-t"
              style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
            >
              <button
                className="flex-1 px-3 py-2 rounded-lg font-medium text-xs border"
                style={{
                  borderColor: "#e5e7eb",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                }}
                type="button"
              >
                Reset
              </button>
              <button
                className="flex-1 px-3 py-2 rounded-lg font-medium text-xs text-white"
                style={{ backgroundColor: "#21292b" }}
                type="button"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time picker popup shown above calendar */}
      {isTimeOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl shadow-2xl bg-white">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-center text-black">
                Select Time
              </h3>
              <div className="flex items-center justify-center gap-4 mb-6">
                {/* Hour column */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2 text-gray-600">
                    Hour
                  </label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, i) =>
                      String(i + 1).padStart(2, "0")
                    ).map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedHour === hour ? "text-white" : "text-black"
                        }`}
                        style={
                          selectedHour === hour
                            ? { backgroundColor: "#21292b", color: "#ffffff" }
                            : { backgroundColor: "transparent" }
                        }
                        onClick={() => setSelectedHour(hour)}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-2xl font-bold mt-8 text-black">:</span>

                {/* Minute column */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2 text-gray-600">
                    Minute
                  </label>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 60 }, (_, i) =>
                      String(i).padStart(2, "0")
                    ).map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                          selectedMinute === minute
                            ? "text-white"
                            : "text-black"
                        }`}
                        style={
                          selectedMinute === minute
                            ? { backgroundColor: "#21292b", color: "#ffffff" }
                            : { backgroundColor: "transparent" }
                        }
                        onClick={() => setSelectedMinute(minute)}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period column */}
                <div className="flex flex-col items-center">
                  <label className="text-xs font-semibold mb-2 text-gray-600">
                    Period
                  </label>
                  <div className="flex flex-col gap-2">
                    {["AM", "PM"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedPeriod === p ? "text-white" : "text-black"
                        }`}
                        style={
                          selectedPeriod === p
                            ? { backgroundColor: "#21292b", color: "#ffffff" }
                            : { backgroundColor: "transparent" }
                        }
                        onClick={() => setSelectedPeriod(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div
                className="mb-4 p-3 rounded-lg text-center"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <span className="text-lg font-bold text-black">
                  {formatTimeDisplay()}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                  type="button"
                  style={{
                    borderColor: "#21292b",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                  onClick={() => setIsTimeOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm"
                  type="button"
                  style={{ backgroundColor: "#21292b" }}
                  onClick={() => setIsTimeOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleTestPage;
