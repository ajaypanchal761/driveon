/**
 * BottomNavbar Component
 * White navigation bar at the bottom with icons
 * Home (active/red), Heart, Map/Bookmark, Menu
 */
const BottomNavbar = () => {
  const navItems = [
    { icon: 'home', active: true },
    { icon: 'heart', active: false },
    { icon: 'map', active: false },
    { icon: 'menu', active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-40 border-t border-gray-100">
      <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center gap-1 relative"
            aria-label={item.icon}
          >
            {item.icon === 'home' && (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: item.active ? '#DC2626' : '#9CA3AF' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            )}
            {item.icon === 'heart' && (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: item.active ? '#DC2626' : '#9CA3AF' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            {item.icon === 'map' && (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: item.active ? '#DC2626' : '#9CA3AF' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            )}
            {item.icon === 'menu' && (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: item.active ? '#DC2626' : '#9CA3AF' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
            {/* Active Indicator - Black line below active icon */}
            {item.active && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;

