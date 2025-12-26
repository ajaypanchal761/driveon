import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../../context/FavoritesContext';

/**
 * CarCard Component
 * Individual car card for Available Near You section
 * Dark background with white text - Exact match to image design
 */
const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { name, image, rating = 0, weeklyPrice, carId } = car;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Ensure we have a valid ID for favoriting
  const id = carId || car.id || car._id;
  const isFav = isFavorite(id);

  const handleCardClick = () => {
    if (id) {
      navigate(`/cars/${id}`);
    }
  };

  // Calculate number of filled stars based on rating
  const filledStars = Math.round(rating);
  const displayRating = rating > 0 ? rating.toFixed(1) : '0.0';

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 w-48 p-2 relative cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={handleCardClick}
    >
      {/* Car Image - Direct in Card */}
      <img
        src={image}
        alt={name}
        className="w-full h-28 object-contain mb-1"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/200x120?text=Car+Image';
        }}
      />
      {/* Favorite Icon - Red heart outline */}
      <button 
        className="absolute top-3 right-3 flex items-center justify-center z-10 touch-target"
        onClick={(e) => {
          e.stopPropagation();
          const wasFav = toggleFavorite(car); // Toggle logic
          if (wasFav) {
             setIsAnimating(true);
             setTimeout(() => setIsAnimating(false), 800);
          }
        }}
      >
        <div className="like-button-container" style={{ width: '24px', height: '24px' }}>
            {/* Sparkles Burst */}
            <div className="sparkles-container">
              {[...Array(8)].map((_, i) => (
                <span 
                  key={i} 
                  className={`sparkle-burst ${isAnimating ? 'active' : ''}`} 
                  style={{ '--angle': `${i * 45}deg` }} 
                />
              ))}
            </div>
            
            <svg
              className={`w-4 h-4 transition-colors duration-200 ${
                isFav ? 'text-red-600 heart-icon liked' : 'text-gray-400 heart-icon'
              }`}
              fill={isFav ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ overflow: 'visible' }} // Allow scale to overflow
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
        </div>
      </button>

      {/* Car Details - Compact, No Extra Spacing */}
      <div>
        {/* Car Name */}
        <h4 className="text-sm font-bold text-white mb-0.5 leading-tight">{name}</h4>

        {/* Rating - Dynamic stars based on actual rating */}
        <div className="flex items-center gap-0.5 mb-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-3 h-3"
              fill={i < filledStars ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: i < filledStars ? '#FACC15' : '#6B7280' }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
          {rating > 0 && (
            <span className="text-xs text-gray-400 ml-1">({displayRating})</span>
          )}
        </div>

        {/* Price and View Button - Same Row */}
        <div className="flex items-center justify-between">
          {/* Price - White text */}
          <div>
            <span className="text-xs text-white">Weekly</span>
            <div className="text-sm font-bold text-white">₹{weeklyPrice}</div>
          </div>
          {/* View Button - Red background */}
          <button
            className="px-3 py-1 rounded text-white font-medium text-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#DC2626' }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

