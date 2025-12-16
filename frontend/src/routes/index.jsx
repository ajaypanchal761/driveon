import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, useState, useEffect } from "react";
import AdminRoute from "../components/layout/AdminRoute";
import AdminLayout from "../components/admin/layout/AdminLayout";
import ModuleLayout from "../module/components/layout/ModuleLayout";
import { useAdminAuth } from "../context/AdminContext";

// Module pages (new frontend)
const ModuleHomePage = lazy(() => import("../module/pages/HomePage"));
const ModuleSearchPage = lazy(() => import("../module/pages/SearchPage"));
const ModuleCarDetailsPage = lazy(() => import("../module/pages/CarDetailsPage"));
const ModuleCarReviewsPage = lazy(() => import("../module/pages/CarReviewsPage"));
const ModuleProfilePage = lazy(() => import("../module/pages/ModuleProfilePage"));
const ModuleCompleteProfilePage = lazy(() => import("../module/pages/ModuleCompleteProfilePage"));
const ModuleEditProfilePage = lazy(() => import("../module/pages/ModuleEditProfilePage"));
const ModuleChangePasswordPage = lazy(() => import("../module/pages/ModuleChangePasswordPage"));
const ModuleKYCStatusPage = lazy(() => import("../module/pages/ModuleKYCStatusPage"));
const ModuleGuarantorPage = lazy(() => import("../module/pages/ModuleGuarantorPage"));
const ModuleReferralDashboardPage = lazy(() => import("../module/pages/ModuleReferralDashboardPage"));
const ModuleSettingsPage = lazy(() => import("../module/pages/ModuleSettingsPage"));
const ModuleSupportPage = lazy(() => import("../module/pages/ModuleSupportPage"));
const ModuleLoginPage = lazy(() => import("../module/pages/LoginPage"));
const ModuleRegisterPage = lazy(() => import("../module/pages/RegisterPage"));
const ModuleBookingsPage = lazy(() => import("../module/pages/BookingsPage"));
const ModuleBookNowPage = lazy(() => import("../module/pages/BookNowPage"));
const ModuleWriteReviewPage = lazy(() => import("../module/pages/ModuleWriteReviewPage"));
const ModuleFAQPage = lazy(() => import("../module/pages/FAQPage"));
const ModulePrivacyPolicyPage = lazy(() => import("../module/pages/PrivacyPolicyPage"));
const ModuleTermsAndConditionsPage = lazy(() => import("../module/pages/TermsAndConditionsPage"));
const ModuleTestPage = lazy(() => import("../module/pages/ModuleTestPage"));
const ModuleLocationPage = lazy(() => import("../module/pages/ModuleLocationPage"));
const CategoryPage = lazy(() => import("../module/pages/CategoryPage"));
const BrandPage = lazy(() => import("../module/pages/BrandPage"));
const ModuleNewProfilePage = lazy(() => import("../module/pages/ModuleNewProfilePage"));
const ModuleProfile1Page = lazy(() => import("../module/pages/ModuleProfile1Page"));

// NewUI pages (new car booking platform)
const NewUIHomePage = lazy(() => import("../module/newui/pages/HomePage"));

// Admin pages
const AdminDashboardPage = lazy(() =>
  import("../pages/admin/AdminDashboardPage")
);
const UserListPage = lazy(() =>
  import("../pages/admin/users/UserListPage")
);
const KYCListPage = lazy(() =>
  import("../pages/admin/kyc/KYCListPage")
);
const GuarantorListPage = lazy(() =>
  import("../pages/admin/guarantors/GuarantorListPage")
);
const CarListPage = lazy(() =>
  import("../pages/admin/cars/CarListPage")
);
const AddCarPage = lazy(() =>
  import("../pages/admin/cars/AddCarPage")
);
const EditCarPage = lazy(() =>
  import("../pages/admin/cars/EditCarPage")
);
const BookingListPage = lazy(() =>
  import("../pages/admin/bookings/BookingListPage")
);
const PaymentListPage = lazy(() =>
  import("../pages/admin/payments/PaymentListPage")
);
const TrackingPage = lazy(() =>
  import("../pages/admin/tracking/TrackingPage")
);
const ReferralManagementPage = lazy(() =>
  import("../pages/admin/referrals/ReferralManagementPage")
);
const CouponManagementPage = lazy(() =>
  import("../pages/admin/coupons/CouponManagementPage")
);
const AdminSettingsPage = lazy(() =>
  import("../pages/admin/settings/AdminSettingsPage")
);
const AdminProfilePage = lazy(() =>
  import("../pages/admin/profile/AdminProfilePage")
);
const AdminSupportPage = lazy(() =>
  import("../pages/admin/support/AdminSupportPage")
);
const AdminLoginPage = lazy(() =>
  import("../pages/admin/AdminLoginPage")
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

/**
 * ModuleResponsiveHome Component
 * - Mobile view: show ModuleTestPage (module-test UI)
 * - Desktop / tablet view: show original ModuleHomePage
 * All other routes and redirections remain unchanged.
 */
const ModuleResponsiveHome = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth < 768; // Tailwind md breakpoint
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <ModuleTestPage />;
  }

  return <ModuleHomePage />;
};

/**
 * AdminRedirectRoute Component
 * Handles /admin route - redirects to dashboard if authenticated, login if not
 */
const AdminRedirectRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4 border-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/admin/login" replace />;
};

// Create router configuration
const router = createBrowserRouter([
  // Module routes (new frontend) - wrapped with ModuleLayout
  {
    element: <ModuleLayout />,
    children: [
      {
        path: "/",
        element: <ModuleResponsiveHome />,
      },
      {
        path: "/login",
        element: <ModuleLoginPage />,
      },
      {
        path: "/register",
        element: <ModuleRegisterPage />,
      },
      {
        path: "/search",
        element: <ModuleSearchPage />,
      },
      {
        path: "/car-details/:id",
        element: <ModuleCarDetailsPage />,
      },
      {
        path: "/car-details/:id/reviews",
        element: <ModuleCarReviewsPage />,
      },
      {
        path: "/book-now/:id",
        element: <ModuleBookNowPage />,
      },
      {
        path: "/profile",
        element: <ModuleProfile1Page />,
      },
      {
        path: "/profile/complete",
        element: <ModuleCompleteProfilePage />,
      },
      {
        path: "/profile/edit",
        element: <ModuleEditProfilePage />,
      },
      {
        path: "/profile/change-password",
        element: <ModuleChangePasswordPage />,
      },
      {
        path: "/profile/kyc",
        element: <ModuleKYCStatusPage />,
      },
      {
        path: "/profile/guarantor",
        element: <ModuleGuarantorPage />,
      },
      {
        path: "/profile/referrals",
        element: <ModuleReferralDashboardPage />,
      },
      {
        path: "/profile/settings",
        element: <ModuleSettingsPage />,
      },
      {
        path: "/profile/support",
        element: <ModuleSupportPage />,
      },
      {
        path: "/bookings",
        element: <ModuleBookingsPage />,
      },
      {
        path: "/write-review/:bookingId",
        element: <ModuleWriteReviewPage />,
      },
      {
        path: "/faq",
        element: <ModuleFAQPage />,
      },
      {
        path: "/privacy-policy",
        element: <ModulePrivacyPolicyPage />,
      },
      {
        path: "/terms",
        element: <ModuleTermsAndConditionsPage />,
      },
      {
        path: "/module-test",
        element: <ModuleTestPage />,
      },
      {
        path: "/module-location",
        element: <ModuleLocationPage />,
      },
      {
        path: "/category/:categoryName",
        element: <CategoryPage />,
      },
      {
        path: "/brand/:brandName",
        element: <BrandPage />,
      },
      {
        path: "/module-profile1",
        element: <ModuleProfile1Page />,
      },
    ],
  },
  // NewUI routes (new car booking platform) - separate from ModuleLayout
  {
    path: "/newui",
    element: <NewUIHomePage />,
  },
  {
    path: "/newui/home",
    element: <NewUIHomePage />,
  },
  // Admin Auth Routes (public - no authentication required)
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  // Admin root route - redirects based on authentication
  {
    path: "/admin",
    element: <AdminRedirectRoute />,
  },
  // Admin Routes (require admin role and use AdminLayout)
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboardPage />,
          },
          {
            path: "/admin/users",
            element: <UserListPage />,
          },
          {
            path: "/admin/kyc",
            element: <KYCListPage />,
          },
          {
            path: "/admin/kyc/pending",
            element: <KYCListPage />,
          },
          {
            path: "/admin/kyc/approved",
            element: <KYCListPage />,
          },
          {
            path: "/admin/kyc/rejected",
            element: <KYCListPage />,
          },
          {
            path: "/admin/guarantors",
            element: <GuarantorListPage />,
          },
          {
            path: "/admin/guarantors/pending",
            element: <GuarantorListPage />,
          },
          {
            path: "/admin/cars",
            element: <CarListPage />,
          },
          {
            path: "/admin/cars/new",
            element: <AddCarPage />,
          },
          {
            path: "/admin/cars/:carId/edit",
            element: <EditCarPage />,
          },
          {
            path: "/admin/cars/pending",
            element: <CarListPage />,
          },
          {
            path: "/admin/bookings",
            element: <BookingListPage />,
          },
          {
            path: "/admin/bookings/pending",
            element: <BookingListPage />,
          },
          {
            path: "/admin/bookings/active",
            element: <BookingListPage />,
          },
          {
            path: "/admin/payments",
            element: <PaymentListPage />,
          },
          {
            path: "/admin/payments/pending",
            element: <PaymentListPage />,
          },
          {
            path: "/admin/payments/failed",
            element: <PaymentListPage />,
          },
          {
            path: "/admin/tracking",
            element: <TrackingPage />,
          },
          {
            path: "/admin/tracking/active",
            element: <TrackingPage />,
          },
          {
            path: "/admin/tracking/history",
            element: <TrackingPage />,
          },
          {
            path: "/admin/referrals",
            element: <ReferralManagementPage />,
          },
          {
            path: "/admin/referrals/statistics",
            element: <ReferralManagementPage />,
          },
          {
            path: "/admin/referrals/top-referrers",
            element: <ReferralManagementPage />,
          },
          {
            path: "/admin/coupons",
            element: <CouponManagementPage />,
          },
          {
            path: "/admin/support",
            element: <AdminSupportPage />,
          },
          {
            path: "/admin/settings",
            element: <AdminSettingsPage />,
          },
          {
            path: "/admin/settings/notifications",
            element: <AdminSettingsPage />,
          },
          {
            path: "/admin/settings/security",
            element: <AdminSettingsPage />,
          },
          {
            path: "/admin/settings/features",
            element: <AdminSettingsPage />,
          },
          {
            path: "/admin/profile",
            element: <AdminProfilePage />,
          },
        ],
      },
    ],
  },
  // 404 Page
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
