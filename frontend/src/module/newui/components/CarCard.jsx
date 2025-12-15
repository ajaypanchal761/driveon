/**
 * CarCard Component
 * Individual car card for Available Near You section
 * Dark background with white text - Exact match to image design
 */
const CarCard = ({ car }) => {
  const { name, image, rating, weeklyPrice } = car;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-48 p-2 relative">
      {/* Car Image - Direct in Card */}
      <img
        src={image}
        alt={name}
        className="w-full h-28 object-contain mb-1"
      />
      {/* Favorite Icon - Red heart outline */}
      <button className="absolute top-3 right-3 flex items-center justify-center">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: '#DC2626' }}
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Car Details - Compact, No Extra Spacing */}
      <div>
        {/* Car Name */}
        <h4 className="text-sm font-bold text-white mb-0.5 leading-tight">{name}</h4>

        {/* Rating - 5 gold stars */}
        <div className="flex items-center gap-0.5 mb-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 24 24"
              style={{ color: '#FACC15' }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Price and View Button - Same Row */}
        <div className="flex items-center justify-between">
          {/* Price - White text */}
          <div>
            <span className="text-xs text-white">Weekly</span>
            <div className="text-sm font-bold text-white">${weeklyPrice}</div>
          </div>
          {/* View Button - Red background */}
          <button
            className="px-3 py-1 rounded text-white font-medium text-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#DC2626' }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

