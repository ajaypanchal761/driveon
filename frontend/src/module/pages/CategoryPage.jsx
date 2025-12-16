import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNavbar from "../components/layout/BottomNavbar";
import CarCard from "../components/common/CarCard";
import { colors } from "../theme/colors";

// Import car images
import carImg1 from "../../assets/car_banImg1.jpg";
import carImg2 from "../../assets/car_banImg2.jpg";
import carImg3 from "../../assets/car_banImg3.jpg";
import carImg4 from "../../assets/car_banImg4.jpg";
import carImg5 from "../../assets/car_banImg5.jpg";
import carImg6 from "../../assets/car_img6-removebg-preview.png";
import nearbyImg1 from "../../assets/car_img8.png";
import nearbyImg2 from "../../assets/car_img4-removebg-preview.png";
import nearbyImg3 from "../../assets/car_img5-removebg-preview.png";

/**
 * CategoryPage Component
 * Shows cars filtered by category (Sports, Electric, Legends, Classic, Coupe)
 */
const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();

  // Category mapping
  const categoryMap = {
    sports: { label: "Sports", count: 78 },
    electric: { label: "Electric", count: 304 },
    legends: { label: "Legends", count: 47 },
    classic: { label: "Classic", count: 12 },
    coupe: { label: "Coupe", count: 19 },
  };

  // Mock cars data - In real app, this would come from API filtered by category
  const allCars = {
    sports: [
      {
        id: 1,
        name: "Ferrari-FF",
        rating: "5.0",
        location: "Washington DC",
        seats: "4 Seats",
        price: "Rs. 200/Day",
        image: carImg1,
      },
      {
        id: 2,
        name: "Lamborghini Aventador",
        rating: "4.9",
        location: "New York",
        seats: "2 Seats",
        price: "Rs. 250/Day",
        image: nearbyImg2,
      },
      {
        id: 3,
        name: "BMW M2 GTS",
        rating: "5.0",
        location: "Los Angeles",
        seats: "5 Seats",
        price: "Rs. 150/Day",
        image: nearbyImg3,
      },
    ],
    electric: [
      {
        id: 4,
        name: "Tesla Model S",
        rating: "5.0",
        location: "Chicago, USA",
        seats: "5 Seats",
        price: "Rs. 100/Day",
        image: carImg6,
      },
      {
        id: 5,
        name: "BMW 3 Series",
        rating: "5.0",
        location: "New York",
        seats: "5 Seats",
        price: "Rs. 150/Day",
        image: nearbyImg1,
      },
    ],
    legends: [
      {
        id: 6,
        name: "Audi R8 Performance",
        rating: "5.0",
        location: "Los Angeles",
        seats: "2 Seats",
        price: "Rs. 300/Day",
        image: carImg1,
      },
      {
        id: 7,
        name: "Porsche 911",
        rating: "4.8",
        location: "Miami",
        seats: "4 Seats",
        price: "Rs. 280/Day",
        image: carImg3,
      },
    ],
    classic: [
      {
        id: 8,
        name: "Vintage Mustang",
        rating: "4.9",
        location: "Detroit",
        seats: "4 Seats",
        price: "Rs. 350/Day",
        image: carImg4,
      },
      {
        id: 9,
        name: "Classic Corvette",
        rating: "5.0",
        location: "Las Vegas",
        seats: "2 Seats",
        price: "Rs. 400/Day",
        image: carImg5,
      },
    ],
    coupe: [
      {
        id: 10,
        name: "Mercedes AMG GT",
        rating: "4.9",
        location: "New York",
        seats: "2 Seats",
        price: "Rs. 220/Day",
        image: carImg2,
      },
      {
        id: 11,
        name: "Aston Martin DB11",
        rating: "5.0",
        location: "London",
        seats: "4 Seats",
        price: "Rs. 450/Day",
        image: carImg3,
      },
    ],
  };

  const category = categoryMap[categoryName?.toLowerCase()] || categoryMap.sports;
  const cars = allCars[categoryName?.toLowerCase()] || allCars.sports;

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <div className="flex items-center gap-3 mb-4">
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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{category.label}</h1>
            <p className="text-sm text-gray-500">{category.count} cars available</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 pb-28">
        {cars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CarCard car={car} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
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
            <p className="text-gray-500 text-center">
              No cars found in this category
            </p>
          </div>
        )}
      </main>

      {/* Bottom navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default CategoryPage;

