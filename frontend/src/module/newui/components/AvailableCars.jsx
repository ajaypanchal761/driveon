import CarCard from './CarCard';
import carImg1 from '../../../assets/car_img1-removebg-preview.png';
import carImg2 from '../../../assets/car_img2.png';
import carImg4 from '../../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../../assets/car_img8.png';

/**
 * AvailableCars Component
 * Available Near You section with car listings
 * Using dummy data with images from assets folder
 */
const AvailableCars = () => {
  const cars = [
    {
      id: 1,
      name: 'Dodge RAM 1500',
      image: carImg1,
      rating: 5,
      weeklyPrice: 250,
    },
    {
      id: 2,
      name: 'BMW 5 Series',
      image: carImg2,
      rating: 5,
      weeklyPrice: 450,
    },
    {
      id: 3,
      name: 'Toyota Camry',
      image: carImg4,
      rating: 5,
      weeklyPrice: 320,
    },
    {
      id: 4,
      name: 'Mercedes C-Class',
      image: carImg5,
      rating: 5,
      weeklyPrice: 480,
    },
    {
      id: 5,
      name: 'Honda Accord',
      image: carImg6,
      rating: 5,
      weeklyPrice: 280,
    },
    {
      id: 6,
      name: 'Audi A4',
      image: carImg8,
      rating: 5,
      weeklyPrice: 420,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white">Available Near You</h3>
        <button className="text-sm text-white underline font-medium">
          View all
        </button>
      </div>
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default AvailableCars;

