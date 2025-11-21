import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNavbar from "./BottomNavbar";
import { theme } from "../../theme/theme.constants";

/**
 * PageLayout Component
 * Main layout wrapper for all pages
 * Includes Header, Footer, BottomNavbar (mobile), and loading states
 */
const PageLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isProfilePage = location.pathname.startsWith("/profile");
  const isBookingPage =
    location.pathname === "/bookings" ||
    location.pathname.startsWith("/booking");
  const isCarsPage = location.pathname.startsWith("/cars");
  const isCarDetailsPage = location.pathname.match(/^\/cars\/[^/]+$/); // Matches /cars/:id but not /cars/:id/...
  const isCarReviewsPage = location.pathname.match(/^\/cars\/[^/]+\/reviews$/); // Matches /cars/:id/reviews
  const isBookingFormPage = location.pathname.match(/^\/booking\/[^/]+$/); // Matches /booking/:carId
  const isBookingPaymentPage = location.pathname.match(
    /^\/booking\/[^/]+\/payment$/
  ); // Matches /booking/:carId/payment
  const isReviewFormPage = location.pathname.match(
    /^\/booking\/[^/]+\/review$/
  ); // Matches /booking/:bookingId/review

  // Routes where header and bottom navbar should be hidden
  const hideNavigationRoutes = [
    "/login",
    "/register",
    "/verify-otp",
    "/admin/login",
  ];
  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname);

  // Hide default header on homepage, profile pages, booking pages, and cars page (they have custom headers)
  const shouldShowHeader =
    !isHomePage &&
    !isProfilePage &&
    !isBookingPage &&
    !isCarsPage &&
    !shouldHideNavigation;

  // Hide bottom navbar on car details page, car reviews page, booking form page, payment page, and review form page (they have their own bottom bars)
  const shouldShowBottomNavbar =
    !shouldHideNavigation &&
    !isCarDetailsPage &&
    !isCarReviewsPage &&
    !isBookingFormPage &&
    !isBookingPaymentPage &&
    !isReviewFormPage;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isProfilePage ? "bg-white" : "bg-background-primary"
      }`}
    >
      {/* Header - Mobile and Desktop (hidden on homepage, profile pages, and auth pages) */}
      {shouldShowHeader && <Header />}

      {/* Main Content */}
      <main
        className={`flex-1 w-full ${
          shouldHideNavigation
            ? ""
            : isHomePage || isProfilePage
            ? ""
            : "pb-16 md:pb-0"
        }`}
      >
        {/* Loading fallback for lazy-loaded routes */}
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
                  style={{ borderColor: theme.colors.primary }}
                ></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer - Desktop Only (hidden on auth pages, homepage, and profile pages) */}
      {shouldShowHeader && <Footer />}

      {/* Bottom Navbar - Mobile Only (hidden on auth pages and car details page) */}
      {shouldShowBottomNavbar && <BottomNavbar />}
    </div>
  );
};

export default PageLayout;
