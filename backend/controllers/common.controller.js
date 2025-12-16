/**
 * Common Controller
 * Handles banners, FAQs, and other common content
 */

/**
 * @desc    Get Hero Banners
 * @route   GET /api/common/banners/hero
 * @access  Public
 */
export const getHeroBanners = async (req, res) => {
  try {
    // Return default banners (can be extended to fetch from database)
    const banners = [
      {
        gradient: "linear-gradient(135deg, #f8f8f8, #d0d4d7)",
        title: "Easy Rentals,",
        subtitle: "Anywhere You Go.",
        cta: "Find Perfect Car To DriveOn",
      },
      {
        gradient: "linear-gradient(135deg, #f8f8f8, #e4e7ea)",
        title: "Premium Electric,",
        subtitle: "Experience The Future.",
        cta: "Drive Sustainable Luxury",
      },
      {
        gradient: "linear-gradient(135deg, #f8f8f8, #cfd4da)",
        title: "Luxury Redefined,",
        subtitle: "Style Meets Performance.",
        cta: "Discover Premium Comfort",
      },
    ];

    res.json({
      success: true,
      data: {
        banners,
      },
    });
  } catch (error) {
    console.error('Get hero banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero banners',
      error: error.message,
    });
  }
};

/**
 * @desc    Get FAQs
 * @route   GET /api/common/faqs
 * @access  Public
 */
export const getFAQs = async (req, res) => {
  try {
    // Return default FAQs (can be extended to fetch from database)
    const faqs = [
      {
        question: "How do I complete my profile?",
        answer: "To book a car, you need to complete 100% of your profile. This includes: Name, Email, Phone Number, Age, Gender, Address, Profile Photo, and KYC verification through DigiLocker. You must verify your Aadhaar, PAN, and Driving License documents via DigiLocker OAuth2 integration. Booking is not allowed until your profile is 100% complete.",
      },
      {
        question: "What is KYC verification and how does it work?",
        answer: "KYC (Know Your Customer) verification is done through DigiLocker integration. When you click 'Verify Documents', you'll be redirected to DigiLocker where you approve access. Our backend then fetches your verified Aadhaar, PAN, and Driving License documents. These verified document references are stored securely, and your KYC status is marked as verified. This ensures maximum security and trust for both renters and car owners.",
      },
      {
        question: "Do I need a guarantor? How does the guarantor system work?",
        answer: "Yes, you need to add a guarantor who must also complete registration and KYC verification. Here's how it works: You enter your guarantor's phone number or email. The guarantor receives an invite link, installs the app, completes registration and KYC verification. Once verified, the guarantor is linked to your account in the database. Booking is not allowed until your guarantor is verified. This adds an extra layer of security and trust.",
      },
      {
        question: "What payment options are available?",
        answer: "We offer flexible payment options to suit your needs. You can choose between Full Payment or 35% Advance Payment. Payments are processed securely through Razorpay and Stripe. If you choose the 35% advance option, the remaining amount is automatically debited. We also handle security deposit management seamlessly.",
      },
      {
        question: "Is live GPS tracking mandatory?",
        answer: "Yes, live GPS tracking is mandatory during active trips for safety and security. When your trip starts, GPS tracking is automatically enabled. The mobile app runs a background service that sends location data to the backend every 10 seconds. This provides real-time location updates for both renters and car owners. Location data is stored for 6 months for dispute resolution purposes.",
      },
      {
        question: "How does the referral program work?",
        answer: "Every user gets a unique referral code. When a new user signs up using your referral code, you earn points. When that new user completes their first trip, you get an extra reward. Your referral points are visible in your profile and can be used as discounts on your bookings. It's a great way to earn rewards while helping others discover DriveOn.",
      },
      {
        question: "How does dynamic pricing work?",
        answer: "Our pricing engine calculates prices dynamically based on several factors: date of booking (weekday/weekend), time of booking (peak hours), duration, seasonal surge, car demand, last available units, and festive days. The system includes weekend multipliers, holiday multipliers, time of day multipliers, peak demand surcharges, and duration-based pricing. This ensures fair and transparent pricing that adjusts to market conditions.",
      },
      {
        question: "How do I book a car?",
        answer: "First, ensure your profile is 100% complete and your guarantor is verified. Then browse and filter our car collection based on your preferences (brand, model, price, location, etc.). Select your preferred car and view detailed information. Choose your pickup and drop-off dates and times. The system will calculate the dynamic price. Select your payment option (Full or 35% advance) and complete the secure payment. Once payment is confirmed, your booking is complete. GPS tracking will automatically start when your trip begins.",
      },
    ];

    res.json({
      success: true,
      data: {
        faqs,
      },
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Promotional Banner
 * @route   GET /api/common/banners/promotional
 * @access  Public
 */
export const getPromotionalBanner = async (req, res) => {
  try {
    const banner = {
      title: "20% Off Your First Ride!",
      subtitle: "Experience Seamless Car Rentals.",
    };

    res.json({
      success: true,
      data: banner,
    });
  } catch (error) {
    console.error('Get promotional banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching promotional banner',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Banner Overlay
 * @route   GET /api/common/banners/overlay
 * @access  Public
 */
export const getBannerOverlay = async (req, res) => {
  try {
    const overlay = {
      title: "Premium Luxury Experience",
      subtitle: "Drive in Style with Our Premium Collection",
    };

    res.json({
      success: true,
      data: overlay,
    });
  } catch (error) {
    console.error('Get banner overlay error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching banner overlay',
      error: error.message,
    });
  }
};


