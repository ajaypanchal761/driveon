import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNavbar from '../components/layout/BottomNavbar';
import SearchCarCard from '../components/common/SearchCarCard';
import { colors } from '../theme/colors';

// Import car images (mock data)
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../assets/car_img2.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';

// All cars data with brand information
const allCars = [
  { id: 1, name: 'Ferrari-FF', brand: 'Ferrari', model: 'FF', image: carImg1, rating: '5.0', location: 'Washington DC', price: 'Rs. 200', carType: 'Sports' },
  { id: 2, name: 'Tesla Model S', brand: 'Tesla', model: 'Model S', image: carImg6, rating: '5.0', location: 'Chicago, USA', price: 'Rs. 100', carType: 'Electric' },
  { id: 3, name: 'BMW 3 Series', brand: 'BMW', model: '3 Series', image: carImg8, rating: '5.0', location: 'New York', price: 'Rs. 150', carType: 'Classic' },
  { id: 4, name: 'Lamborghini Aventador', brand: 'Lamborghini', model: 'Aventador', image: carImg4, rating: '4.9', location: 'New York', price: 'Rs. 250', carType: 'Sports' },
  { id: 5, name: 'BMW M2 GTS', brand: 'BMW', model: 'M2 GTS', image: carImg5, rating: '5.0', location: 'Los Angeles', price: 'Rs. 150', carType: 'Coupe' },
  { id: 6, name: 'Porsche 911', brand: 'Porsche', model: '911', image: carImg2, rating: '4.8', location: 'Miami, USA', price: 'Rs. 300', carType: 'Sports' },
  { id: 7, name: 'Audi e-tron', brand: 'Audi', model: 'e-tron', image: carImg4, rating: '4.7', location: 'San Francisco, USA', price: 'Rs. 180', carType: 'Electric' },
  { id: 8, name: 'Nissan GT-R', brand: 'Nissan', model: 'GT-R', image: carImg4, rating: '4.9', location: 'Los Angeles', price: 'Rs. 200', carType: 'Sports' },
  { id: 9, name: 'Honda Civic', brand: 'Honda', model: 'Civic', image: carImg8, rating: '4.8', location: 'Chicago, USA', price: 'Rs. 120', carType: 'Classic' },
  { id: 10, name: 'Toyota Camry', brand: 'Toyota', model: 'Camry', image: carImg1, rating: '4.9', location: 'New York', price: 'Rs. 130', carType: 'Classic' },
  { id: 11, name: 'Kia Sportage', brand: 'Kia', model: 'Sportage', image: carImg5, rating: '4.7', location: 'Miami, USA', price: 'Rs. 110', carType: 'Classic' },
  { id: 12, name: 'Audi A4', brand: 'Audi', model: 'A4', image: carImg4, rating: '4.8', location: 'San Francisco, USA', price: 'Rs. 170', carType: 'Classic' },
  { id: 13, name: 'Ferrari F8', brand: 'Ferrari', model: 'F8', image: carImg1, rating: '5.0', location: 'Los Angeles', price: 'Rs. 350', carType: 'Sports' },
  { id: 14, name: 'Lamborghini Huracan', brand: 'Lamborghini', model: 'Huracan', image: carImg4, rating: '5.0', location: 'Miami, USA', price: 'Rs. 400', carType: 'Sports' },
];

const BrandPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();

  const filteredCars = useMemo(() => {
    if (!brandName) return [];
    return allCars.filter(car => 
      car.brand.toLowerCase() === brandName.toLowerCase()
    );
  }, [brandName]);

  return (
    <div
      className="min-h-screen w-full flex flex-col md:hidden"
      style={{ backgroundColor: colors.backgroundPrimary }}
    >
      {/* Header */}
      <header className="px-4 pt-6 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
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
        <h1 className="text-base font-semibold text-black">
          {brandName} ({filteredCars.length})
        </h1>
        <div className="w-8 h-8" /> {/* Placeholder for alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-28">
        {filteredCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Cars Found</h3>
            <p className="text-sm text-gray-500">
              Sorry, we couldn't find any cars from {brandName}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SearchCarCard car={car} index={index} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default BrandPage;

