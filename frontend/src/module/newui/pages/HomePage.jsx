import { useState } from 'react';
import Header from '../components/Header';
import BodyTypeFilter from '../components/BodyTypeFilter';
import TopBrands from '../components/TopBrands';
import AvailableCars from '../components/AvailableCars';
import BottomNavbar from '../components/BottomNavbar';
import '../styles/index.css';

/**
 * HomePage Component
 * Exact match to the mobile app design shown in the image
 * Red header, white content area, car listings
 */
const HomePage = () => {
  const [selectedBodyType, setSelectedBodyType] = useState('All');

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Header Section - Red Background */}
      <Header />

      {/* Main Content Area */}
      <main className="pb-20 bg-white">
        {/* Body Type Section - Above Top Brands, Compact - Black Background */}
        <div className="bg-black px-4 py-1 pt-44">
          <BodyTypeFilter 
            selected={selectedBodyType} 
            onSelect={setSelectedBodyType} 
          />
        </div>

        {/* Top Brands Section - Black Background */}
        <div className="bg-black px-4 py-1">
          <TopBrands />
        </div>

        {/* Available Near You Section - Black Background */}
        <div className="bg-black px-4 py-1">
          <AvailableCars />
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavbar />
    </div>
  );
};

export default HomePage;

