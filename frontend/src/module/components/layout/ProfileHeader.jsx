import { colors } from '../../theme/colors';

const ProfileHeader = ({ title = 'Profile' }) => {

  return (
    <header 
      className="w-full relative rounded-b-3xl sticky top-0 z-50"
      style={{ backgroundColor: colors.backgroundTertiary }}
    >
      {/* Status Bar Area (for mobile) */}
      <div className="h-2" style={{ backgroundColor: colors.backgroundTertiary }}></div>

      {/* Abstract Line Graphics Background - Lighter blue patterns */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <svg 
          className="absolute top-0 right-0 w-full h-full" 
          viewBox="0 0 400 200" 
          fill="none"
          style={{ color: colors.accentBlue }}
        >
          {/* Abstract flowing lines */}
          <path 
            d="M50 30 Q150 20, 250 40 T450 50" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-60"
          />
          <path 
            d="M80 60 Q180 50, 280 70 T480 80" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-40"
          />
          <path 
            d="M30 90 Q130 80, 230 100 T430 110" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-30"
          />
          <path 
            d="M100 120 Q200 110, 300 130 T500 140" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-25"
          />
          {/* Additional subtle lines */}
          <path 
            d="M150 10 Q250 0, 350 20" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
            className="opacity-50"
          />
          <path 
            d="M200 40 Q300 30, 400 50" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none"
            className="opacity-35"
          />
        </svg>
      </div>

      {/* Main Header Content */}
      <div className="relative z-10 px-4 py-3 flex items-center justify-center">
        {/* Profile Title - Center */}
        <h1 className="text-lg font-bold text-center" style={{ color: colors.textWhite }}>{title}</h1>
      </div>
    </header>
  );
};

export default ProfileHeader;

