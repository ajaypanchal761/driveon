import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CarDetailsHeader from '../components/layout/CarDetailsHeader';
import { colors } from '../theme/colors';
import { useAppSelector } from '../../hooks/redux';

// Import car images - matching CarDetailsPage
import carImg1 from '../../assets/car_img1-removebg-preview.png';
import carImg4 from '../../assets/car_img4-removebg-preview.png';
import carImg5 from '../../assets/car_img5-removebg-preview.png';
import carImg6 from '../../assets/car_img6-removebg-preview.png';
import carImg8 from '../../assets/car_img8.png';

/**
 * CarReviewsPage Component
 * Displays all reviews for a specific car
 * Based on document.txt - User rates car, trip experience, and car owner ratings
 */
const CarReviewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get authentication state
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);

  // Mock car data - matching CarDetailsPage exactly
  const getCarData = () => {
    const cars = {
      '1': {
        id: 1,
        brand: 'Ferrari',
        model: 'FF',
        name: 'Ferrari-FF',
        image: carImg1,
        rating: 5.0,
        reviewsCount: 100,
      },
      '2': {
        id: 2,
        brand: 'Tesla',
        model: 'Model S',
        name: 'Tesla Model S',
        image: carImg6, // Matching CarDetailsPage
        rating: 5.0,
        reviewsCount: 125,
      },
      '3': {
        id: 3,
        brand: 'BMW',
        model: '3 Series',
        name: 'BMW 3 Series',
        image: carImg8, // Matching CarDetailsPage
        rating: 5.0,
        reviewsCount: 125,
      },
      '4': {
        id: 4,
        brand: 'Lamborghini',
        model: 'Aventador',
        name: 'Lamborghini Aventador',
        image: carImg4,
        rating: 4.9,
        reviewsCount: 80,
      },
      '5': {
        id: 5,
        brand: 'BMW',
        model: 'M2 GTS',
        name: 'BMW M2 GTS',
        image: carImg5,
        rating: 5.0,
        reviewsCount: 95,
      },
    };
    return cars[id] || cars['1'];
  };

  const car = getCarData();

  // Mock reviews data with detailed information based on document.txt
  // Reviews include: User rates car, trip experience, car owner ratings, date, verified status
  const getAllReviews = () => {
    const reviewsData = {
      '1': [
        {
          id: 1,
          name: 'Mr. Jack',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 5,
          ownerRating: 5,
          comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
          date: new Date().toISOString().split('T')[0], // Today
          verified: true,
        },
        {
          id: 2,
          name: 'Robert',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 4,
          ownerRating: 5,
          comment: 'The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
          verified: true,
        },
        {
          id: 3,
          name: 'Sarah Johnson',
          profilePic: 'https://via.placeholder.com/40',
          rating: '4.5',
          carRating: 5,
          tripExperienceRating: 4,
          ownerRating: 4,
          comment: 'Great car with excellent features. The owner was very professional and responsive. The trip was comfortable and the car handled beautifully on the highway.',
          date: '2024-01-08',
          verified: true,
        },
        {
          id: 4,
          name: 'Michael Chen',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 5,
          ownerRating: 5,
          comment: 'Perfect rental experience! The car is in immaculate condition and the owner was extremely helpful. Highly recommended for anyone looking for a premium car rental.',
          date: '2024-01-05',
          verified: true,
        },
        {
          id: 5,
          name: 'Emily Davis',
          profilePic: 'https://via.placeholder.com/40',
          rating: '4.0',
          carRating: 4,
          tripExperienceRating: 4,
          ownerRating: 4,
          comment: 'Very good car with modern features. The owner was punctual and the handover process was smooth. Overall a pleasant experience.',
          date: '2024-01-03',
          verified: true,
        },
        {
          id: 6,
          name: 'David Wilson',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 5,
          ownerRating: 5,
          comment: 'Outstanding service and car quality! The Ferrari-FF is a dream to drive. The owner was professional and the entire process was seamless.',
          date: '2023-12-28',
          verified: true,
        },
        {
          id: 7,
          name: 'Lisa Anderson',
          profilePic: 'https://via.placeholder.com/40',
          rating: '4.5',
          carRating: 5,
          tripExperienceRating: 4,
          ownerRating: 4,
          comment: 'Excellent car with great performance. The owner was very cooperative and understanding. Would definitely rent again!',
          date: '2023-12-25',
          verified: true,
        },
        {
          id: 8,
          name: 'James Brown',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 5,
          ownerRating: 5,
          comment: 'Best rental experience ever! The car exceeded all expectations. The owner is very professional and the car is maintained perfectly.',
          date: '2023-12-20',
          verified: true,
        },
      ],
      '2': [
        {
          id: 1,
          name: 'Mr. Jack',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 5,
          ownerRating: 5,
          comment: 'The rental car was clean, reliable, and the service was quick and efficient. Tesla Model S is amazing!',
          date: '2024-01-12',
          verified: true,
        },
        {
          id: 2,
          name: 'Robert',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 4,
          ownerRating: 5,
          comment: 'The rental car was clean, reliable, and the service was quick.',
          date: '2024-01-08',
          verified: true,
        },
      ],
      '3': [
        {
          id: 1,
          name: 'Mr. Jack',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 5,
          ownerRating: 5,
          comment: 'The rental car was clean, reliable, and the service was quick and efficient. BMW is fantastic!',
          date: '2024-01-10',
          verified: true,
        },
        {
          id: 2,
          name: 'Robert',
          profilePic: 'https://via.placeholder.com/40',
          rating: '5.0',
          carRating: 5,
          tripExperienceRating: 4,
          ownerRating: 5,
          comment: 'The rental car was clean, reliable, and the service was quick.',
          date: '2024-01-06',
          verified: true,
        },
      ],
    };
    return reviewsData[id] || reviewsData['1'];
  };

  const baseReviews = getAllReviews();
  const [reviews, setReviews] = useState(baseReviews);

  // Merge reviews from localStorage with existing reviews
  useEffect(() => {
    try {
      const localReviews = JSON.parse(localStorage.getItem('localReviews') || '[]');
      console.log('CarReviewsPage - All local reviews:', localReviews);
      
      // Normalize IDs for comparison (convert all to strings)
      const carIdString = id.toString();
      const carIdString2 = car.id.toString();
      console.log('CarReviewsPage - Looking for carId:', carIdString, 'or', carIdString2);
      
      // Filter reviews for this car - compare as strings
      const carReviews = localReviews.filter(review => {
        if (!review.carId) {
          console.log('Review missing carId:', review);
          return false;
        }
        const reviewCarId = review.carId.toString();
        const matches = reviewCarId === carIdString || reviewCarId === carIdString2;
        if (matches) {
          console.log('Found matching review:', review);
        }
        return matches;
      });
      
      console.log('CarReviewsPage - Filtered reviews for this car:', carReviews);
      
      // Convert local reviews to match reviews structure
      const formattedLocalReviews = carReviews.map(review => ({
        id: review.id || `local_${Date.now()}`,
        name: review.name,
        profilePic: review.profilePic || 'https://via.placeholder.com/40',
        rating: review.rating,
        carRating: review.carRating || parseFloat(review.rating),
        tripExperienceRating: review.tripExperienceRating || parseFloat(review.rating),
        ownerRating: review.ownerRating || parseFloat(review.rating),
        comment: review.comment,
        date: review.date,
        verified: review.verified || true,
      }));
      
      // Merge with existing reviews (local reviews first)
      const mergedReviews = [...formattedLocalReviews, ...baseReviews];
      console.log('CarReviewsPage - Merged reviews:', mergedReviews);
      
      setReviews(mergedReviews);
    } catch (error) {
      console.error('Error loading reviews from localStorage:', error);
      // If error, use base reviews
      setReviews(baseReviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Format date - "Today", "Yesterday", or date
  const formatDate = (dateString) => {
    const today = new Date();
    const reviewDate = new Date(dateString);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    reviewDate.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    
    if (reviewDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (reviewDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      const diffTime = Math.abs(today - reviewDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        return `${diffDays} days ago`;
      } else {
        return reviewDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: reviewDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }
    }
  };

  // Render stars - always show 5 solid orange stars for 5.0 rating
  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4"
          fill={colors.accentOrange}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    // Render empty stars for remaining
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4"
          fill="none"
          stroke={colors.borderCheckbox}
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div
      className="min-h-screen w-full relative pb-6"
      style={{ backgroundColor: colors.backgroundPrimary }}
    >
      {/* Web Header - Only visible on web */}
      <header
        className="hidden md:block w-full sticky top-0 z-50"
        style={{ backgroundColor: colors.brandBlack }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center h-16 md:h-20 lg:h-24 justify-between">
            {/* Left - Logo */}
            <Link to="/module-test" className="flex-shrink-0">
              <img
                src="/driveonlogo.png"
                alt="DriveOn Logo"
                className="h-8 md:h-10 lg:h-12 xl:h-14 w-auto object-contain"
              />
            </Link>

            {/* Center - Navigation Tabs */}
            <nav className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 h-full">
              <Link
                to="/module-test"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Home
              </Link>
              <Link
                to="#"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                About
              </Link>
              <Link
                to="#"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                Contact
              </Link>
              <Link
                to="/module-faq"
                className="text-xs md:text-sm lg:text-base xl:text-lg font-medium transition-all hover:opacity-80 flex items-center h-full"
                style={{ color: colors.textWhite }}
              >
                FAQs
              </Link>
            </nav>

            {/* Right - Login/Signup and Profile Icon */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {isAuthenticated ? (
                <Link
                  to="/module-profile"
                  className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
                >
                  {/* Circular profile icon with white border */}
                  <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-gray-800">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={carImg1}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/module-login"
                  className="px-3 md:px-4 lg:px-5 xl:px-6 py-1.5 md:py-2 lg:py-2.5 rounded-lg border text-xs md:text-sm lg:text-base font-medium transition-all hover:opacity-90"
                  style={{
                    borderColor: colors.borderMedium,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Header - Mobile view only */}
      <div className="md:hidden">
        <CarDetailsHeader />
      </div>

      {/* Back Button - Below Header */}
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            style={{ color: colors.backgroundTertiary }}
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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
            <span className="text-base md:text-lg font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Main Container - Responsive */}
      <div className="max-w-4xl mx-auto">
        {/* Car Info Section */}
        <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-4 md:pb-6">
          <div
            className="rounded-2xl md:rounded-3xl p-4 md:p-6"
            style={{
              backgroundColor: colors.backgroundSecondary,
              boxShadow: `0 2px 8px ${colors.shadowLight}`,
            }}
          >
            <div className="flex items-center gap-3 md:gap-4">
              <img
                src={car.image}
                alt={car.name || `${car.brand} ${car.model}`}
                className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-black mb-1 md:mb-2">
                  {car.name || `${car.brand} ${car.model}`}
                </h1>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <span className="text-sm md:text-base lg:text-lg font-semibold text-black">
                      {car.rating?.toString() || '5.0'}
                    </span>
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill={colors.accentOrange}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm text-gray-500">
                    ({car.reviewsCount} Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black mb-4 md:mb-6">
            All Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div
              className="rounded-lg md:rounded-xl p-6 md:p-8 text-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <p className="text-sm md:text-base text-gray-600">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg md:rounded-xl p-4 md:p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow md:flex md:flex-col"
                  style={{ backgroundColor: colors.backgroundSecondary }}
                >
                  {/* User Info and Date */}
                  <div className="flex items-start justify-between mb-2 md:mb-2.5">
                    <div className="flex-1">
                      <span className="text-base md:text-base lg:text-lg font-bold text-black block mb-1 md:mb-1.5">
                        {review.name}
                      </span>
                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {/* Date in top right */}
                    <span className="text-sm md:text-xs lg:text-sm text-gray-500 whitespace-nowrap ml-2 md:ml-3">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  {/* Review Comment */}
                  <p className="text-sm md:text-sm lg:text-base text-gray-600 leading-relaxed md:leading-normal flex-1">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarReviewsPage;

