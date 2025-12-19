import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarCard from './CarCard';
import { carService } from '../../../services/car.service';
import carImg1 from '../../../assets/car_img1-removebg-preview.png';

/**
 * AvailableCars Component
 * Available Near You section with car listings
 * Fetches cars from API and filters based on selectedBodyType and selectedBrand
 */
const AvailableCars = ({ selectedBodyType, selectedBrand }) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map body type labels to backend carType values
  const getCarTypeValue = (bodyType) => {
    const typeMap = {
      'All': null,
      'Sedan': 'sedan',
      'SUV': 'suv',
      'MUV': 'muv',
      'Hatchback': 'hatchback',
      'Luxury': 'luxury',
    };
    return typeMap[bodyType] || null;
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const queryParams = {
          page: 1,
          limit: 20,
          status: 'active',
          isAvailable: true,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        };

        // Add car type filter
        const carType = getCarTypeValue(selectedBodyType);
        if (carType) {
          queryParams.carType = carType;
        }

        // Add brand filter
        if (selectedBrand) {
          queryParams.brand = selectedBrand;
        }

        const response = await carService.getCars(queryParams);

        if (response.success && response.data?.cars) {
          // Format cars data for display
          const formattedCars = response.data.cars.map((car) => {
            // Get primary image or first image
            const primaryImage =
              car.images?.find((img) => img.isPrimary) || car.images?.[0];
            const imageUrl = primaryImage?.url || car.primaryImage?.url || carImg1;

            // Calculate weekly price (7 days)
            const weeklyPrice = car.pricePerDay ? Math.round(car.pricePerDay * 7) : 0;

            return {
              id: car._id || car.id,
              name: `${car.brand || ''} ${car.model || ''}`.trim() || 'Car',
              image: imageUrl,
              rating: car.averageRating || 0,
              weeklyPrice: weeklyPrice,
              carId: car._id || car.id,
            };
          });
          setCars(formattedCars);
        } else {
          setCars([]);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [selectedBodyType, selectedBrand]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white">Available Near You</h3>
        <button 
          className="text-sm text-white underline font-medium"
          onClick={() => navigate('/cars')}
        >
          View all
        </button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-40 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : cars.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-400 text-sm">
            {selectedBodyType !== 'All' || selectedBrand
              ? 'No cars found with selected filters'
              : 'No cars available at the moment'}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableCars;


