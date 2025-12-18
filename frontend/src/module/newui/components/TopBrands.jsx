import { useState, useEffect } from 'react';
import { carService } from '../../../../services/car.service';
import logo1 from '../../../assets/car_logo1_PNG1.png';
import logo2 from '../../../assets/car_logo2_PNG.png';
import logo3 from '../../../assets/car_logo3_PNG.png';
import logo4 from '../../../assets/car_logo4_PNG.png';
import logo5 from '../../../assets/car_logo5_PNG.png';
import logo6 from '../../../assets/car_logo6_PNG.png';
import logo7 from '../../../assets/car_logo7_PNG.png';
import logo8 from '../../../assets/car_logo8_PNG.png';
import logo9 from '../../../assets/car_logo9_PNG.png';
import logo10 from '../../../assets/car_logo10_PNG.png';

// Fallback logo mapping for brands
const getBrandLogo = (brandName) => {
  const logoMap = {
    'mazda': logo1,
    'dodge': logo2,
    'toyota': logo3,
    'chevrolet': logo4,
    'tesla': logo5,
    'bmw': logo6,
    'mercedes': logo7,
    'audi': logo8,
    'ford': logo9,
    'nissan': logo10,
  };
  const normalizedName = brandName?.toLowerCase() || '';
  return logoMap[normalizedName] || logo1; // Default to logo1 if not found
};

/**
 * TopBrands Component
 * Horizontal scrollable list of car brand logos
 * Fetches brands from API and makes them clickable filters
 */
const TopBrands = ({ selectedBrand, onSelectBrand }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await carService.getTopBrands({ limit: 10 });
        
        if (response.success && response.data?.brands) {
          const formattedBrands = response.data.brands.map((brand) => ({
            name: brand.brand || brand.name,
            count: brand.count || 0,
            logo: getBrandLogo(brand.brand || brand.name),
          }));
          setBrands(formattedBrands);
        } else {
          // Fallback to default brands if API fails
          setBrands([
            { name: 'Mazda', logo: logo1, count: 0 },
            { name: 'Dodge', logo: logo2, count: 0 },
            { name: 'Toyota', logo: logo3, count: 0 },
            { name: 'Chevrolet', logo: logo4, count: 0 },
            { name: 'Tesla', logo: logo5, count: 0 },
            { name: 'BMW', logo: logo6, count: 0 },
            { name: 'Mercedes', logo: logo7, count: 0 },
            { name: 'Audi', logo: logo8, count: 0 },
            { name: 'Ford', logo: logo9, count: 0 },
            { name: 'Nissan', logo: logo10, count: 0 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Fallback to default brands on error
        setBrands([
          { name: 'Mazda', logo: logo1, count: 0 },
          { name: 'Dodge', logo: logo2, count: 0 },
          { name: 'Toyota', logo: logo3, count: 0 },
          { name: 'Chevrolet', logo: logo4, count: 0 },
          { name: 'Tesla', logo: logo5, count: 0 },
          { name: 'BMW', logo: logo6, count: 0 },
          { name: 'Mercedes', logo: logo7, count: 0 },
          { name: 'Audi', logo: logo8, count: 0 },
          { name: 'Ford', logo: logo9, count: 0 },
          { name: 'Nissan', logo: logo10, count: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brandName) => {
    // Toggle selection: if same brand is clicked, deselect it
    if (selectedBrand === brandName) {
      onSelectBrand(null);
    } else {
      onSelectBrand(brandName);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold" style={{ color: '#DC2626' }}>
          Top Brands
        </h3>
        <button className="text-sm text-white underline font-medium">
          View all
        </button>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-20 h-20 bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {brands.map((brand, index) => {
            const isSelected = selectedBrand === brand.name;
            return (
              <div
                key={index}
                onClick={() => handleBrandClick(brand.name)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg shadow-sm flex flex-col items-center justify-center p-2 border cursor-pointer transition-all hover:scale-105 ${
                  isSelected
                    ? 'bg-red-600 border-red-500'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-1">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {brand.name.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopBrands;

