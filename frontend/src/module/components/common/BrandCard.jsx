import { colors } from '../../theme/colors';

/**
 * BrandCard Component - Circular brand logo with black background
 */
const BrandCard = ({ logo, name }) => {
  return (
    <div className="flex flex-col items-center gap-1.5 lg:gap-2 shrink-0">
      {/* Circular Logo Container */}
      <div 
        className="w-14 h-14 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full flex items-center justify-center p-2.5 md:p-3 lg:p-4"
        style={{ backgroundColor: colors.brandBlack }}
      >
        <img 
          src={logo} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>
      {/* Brand Name */}
      <span className="text-xs lg:text-base text-gray-600 font-medium">{name}</span>
    </div>
  );
};

export default BrandCard;

