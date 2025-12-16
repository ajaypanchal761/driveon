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

/**
 * TopBrands Component
 * Horizontal scrollable list of car brand logos
 * Using images from assets folder
 */
const TopBrands = () => {
  const brands = [
    { name: 'Mazda', logo: logo1 },
    { name: 'Dodge', logo: logo2 },
    { name: 'Toyota', logo: logo3 },
    { name: 'Chevrolet', logo: logo4 },
    { name: 'Tesla', logo: logo5 },
    { name: 'BMW', logo: logo6 },
    { name: 'Mercedes', logo: logo7 },
    { name: 'Audi', logo: logo8 },
    { name: 'Ford', logo: logo9 },
    { name: 'Nissan', logo: logo10 },
  ];

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
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-20 h-20 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center p-2 border border-gray-100"
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
              <span
                className="text-xs font-semibold text-gray-600"
                style={{ display: 'none' }}
              >
                {brand.name}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {brand.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrands;

