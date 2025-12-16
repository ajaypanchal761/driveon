import React from "react";
import { useNavigate } from "react-router-dom";
import BottomNavbar from "../components/layout/BottomNavbar";
import { colors } from "../theme/colors";

/**
 * ModuleLocationPage
 * Mobile-only location selector page, opened from ModuleTestPage header.
 * UI inspired by the provided "Your route" design but using DriveOn theme.
 */
const recentLocations = [
  {
    id: 1,
    label: "U Weinmeisterstrabe",
    sublabel: "Mitte, New York",
    type: "station",
  },
  {
    id: 2,
    label: "Home",
    sublabel: "1st Street, New York",
    type: "home",
  },
  {
    id: 3,
    label: "Work",
    sublabel: "2nd Road, New York",
    type: "work",
  },
  {
    id: 4,
    label: "Terminal 1 Berlin Brandenburg Airport",
    sublabel: "Berlin, Germany",
    type: "airport",
  },
  {
    id: 5,
    label: "New York Central Station",
    sublabel: "New York, USA",
    type: "station",
  },
];

const ModuleLocationPage = () => {
  const navigate = useNavigate();

  const renderIcon = (type) => {
    switch (type) {
      case "home":
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
      case "work":
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
      case "airport":
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
      case "station":
      default:
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
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:hidden"
      style={{ backgroundColor: colors.backgroundTertiary }}
    >
      {/* Header */}
      <header className="px-4 pt-6 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-white"
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
        <h1 className="text-base font-semibold text-white">Your route</h1>
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-white"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </header>

      {/* Content card */}
      <main className="flex-1 px-4 pb-28">
        <div className="rounded-3xl bg-white shadow-xl overflow-hidden">
          {/* From / To inputs */}
          <div className="p-4 space-y-3">
            {/* From */}
            <div className="flex items-start gap-3">
              <div className="mt-1 w-3 h-3 rounded-full border-2 border-[#4f46e5]" />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-gray-500 mb-0.5">
                  From
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  11th Garden Road, 31a
                </p>
              </div>
            </div>

            {/* Separator line */}
            <div className="ml-4 pl-1 border-l border-dashed border-gray-200 h-4" />

            {/* Add destination */}
            <button
              type="button"
              className="w-full flex items-center gap-3 rounded-2xl border border-[#4f46e5] bg-white px-3 py-2 shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
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
                    d="M11 5a1 1 0 012 0v14a1 1 0 11-2 0V5zM5 12a1 1 0 011-1h14a1 1 0 110 2H6a1 1 0 01-1-1z"
                  />
                </svg>
              </div>
              <span className="flex-1 text-sm text-gray-800 text-left">
                Add destination
              </span>
              <div className="w-7 h-7 rounded-full bg-[#4f46e5] flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v18m9-9H3"
                  />
                </svg>
              </div>
            </button>

            {/* Destination placeholder */}
            <div className="flex items-start gap-3 opacity-60">
              <div className="mt-1 w-3 h-3 rounded-full border border-gray-300" />
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-gray-500 mb-0.5">
                  Destination
                </p>
                <p className="text-sm text-gray-400">Choose destination</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100" />

          {/* Recent / Saved locations list */}
          <div className="p-4 space-y-3">
            {recentLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className="w-full flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-gray-50 text-left"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.backgroundTertiary }}
                >
                  {renderIcon(loc.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {loc.label}
                  </p>
                  <p className="text-[11px] text-gray-500">{loc.sublabel}</p>
                </div>
              </button>
            ))}
          </div>
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


