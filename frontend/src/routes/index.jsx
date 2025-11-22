import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AdminRoute from "../components/layout/AdminRoute";
import OwnerRoute from "../components/layout/OwnerRoute";
import ProfileCompleteRoute from "../components/layout/ProfileCompleteRoute";
import PageLayout from "../components/layout/PageLayout";
import AdminLayout from "../components/admin/layout/AdminLayout";

// Lazy load pages for code splitting (better performance)
const HomePage = lazy(() => import("../pages/home/HomePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const VerifyOTPPage = lazy(() => import("../pages/auth/VerifyOTPPage"));
const CarListingPage = lazy(() => import("../pages/cars/CarListingPage"));
const CarDetailsPage = lazy(() => import("../pages/cars/CarDetailsPage"));
const CarReviewsPage = lazy(() => import("../pages/cars/CarReviewsPage"));
const BookingFormPage = lazy(() => import("../pages/booking/BookingFormPage"));
const BookingDateTimePage = lazy(() =>
  import("../pages/booking/BookingDateTimePage")
);
const BookingPaymentOptionPage = lazy(() =>
  import("../pages/booking/BookingPaymentOptionPage")
);
const BookingGuarantorPage = lazy(() =>
  import("../pages/booking/BookingGuarantorPage")
);
const BookingPaymentPage = lazy(() =>
  import("../pages/booking/BookingPaymentPage")
);
const BookingConfirmationPage = lazy(() =>
  import("../pages/booking/BookingConfirmationPage")
);
const ActiveBookingPage = lazy(() =>
  import("../pages/booking/ActiveBookingPage")
);
const BookingHistoryPage = lazy(() =>
  import("../pages/booking/BookingHistoryPage")
);
const ReviewFormPage = lazy(() => import("../pages/booking/ReviewFormPage"));
const ProfileDashboardPage = lazy(() =>
  import("../pages/profile/ProfileDashboardPage")
);
const ProfileCompletePage = lazy(() =>
  import("../pages/profile/ProfileCompletePage")
);
const KYCStatusPage = lazy(() => import("../pages/profile/KYCStatusPage"));
const GuarantorManagementPage = lazy(() =>
  import("../pages/profile/GuarantorManagementPage")
);
const ReferralDashboardPage = lazy(() =>
  import("../pages/profile/ReferralDashboardPage")
);
const SettingsPage = lazy(() => import("../pages/profile/SettingsPage"));
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
const PricingManagementPage = lazy(() =>
  import("../pages/admin/pricing/PricingManagementPage")
);
const CouponManagementPage = lazy(() =>
  import("../pages/admin/coupons/CouponManagementPage")
);
const ReportsPage = lazy(() =>
  import("../pages/admin/reports/ReportsPage")
);
const AdminSettingsPage = lazy(() =>
  import("../pages/admin/settings/AdminSettingsPage")
);
const AdminLoginPage = lazy(() =>
  import("../pages/admin/AdminLoginPage")
);
const AdminSignupPage = lazy(() =>
  import("../pages/admin/AdminSignupPage")
);
const OwnerDashboardPage = lazy(() =>
  import("../pages/owner/OwnerDashboardPage")
);
const OwnerAddCarPage = lazy(() => import("../pages/owner/OwnerAddCarPage"));
const OwnerEditCarPage = lazy(() => import("../pages/owner/OwnerEditCarPage"));
const OwnerBookingsPage = lazy(() =>
  import("../pages/owner/OwnerBookingsPage")
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      // Public Routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "verify-otp",
        element: <VerifyOTPPage />,
      },
      // Admin Auth Routes (public - no authentication required)
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "admin/signup",
        element: <AdminSignupPage />,
      },
      // Admin Routes (require admin role and use AdminLayout)
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "admin/dashboard",
                element: <AdminDashboardPage />,
              },
              {
                path: "admin/users",
                element: <UserListPage />,
              },
              {
                path: "admin/kyc",
                element: <KYCListPage />,
              },
              {
                path: "admin/kyc/pending",
                element: <KYCListPage />,
              },
              {
                path: "admin/kyc/approved",
                element: <KYCListPage />,
              },
              {
                path: "admin/kyc/rejected",
                element: <KYCListPage />,
              },
              {
                path: "admin/guarantors",
                element: <GuarantorListPage />,
              },
              {
                path: "admin/guarantors/pending",
                element: <GuarantorListPage />,
              },
              {
                path: "admin/cars",
                element: <CarListPage />,
              },
              {
                path: "admin/cars/pending",
                element: <CarListPage />,
              },
              {
                path: "admin/bookings",
                element: <BookingListPage />,
              },
              {
                path: "admin/bookings/pending",
                element: <BookingListPage />,
              },
              {
                path: "admin/bookings/active",
                element: <BookingListPage />,
              },
              {
                path: "admin/payments",
                element: <PaymentListPage />,
              },
              {
                path: "admin/payments/pending",
                element: <PaymentListPage />,
              },
              {
                path: "admin/payments/failed",
                element: <PaymentListPage />,
              },
              {
                path: "admin/tracking",
                element: <TrackingPage />,
              },
              {
                path: "admin/tracking/active",
                element: <TrackingPage />,
              },
              {
                path: "admin/tracking/history",
                element: <TrackingPage />,
              },
              {
                path: "admin/referrals",
                element: <ReferralManagementPage />,
              },
              {
                path: "admin/referrals/statistics",
                element: <ReferralManagementPage />,
              },
              {
                path: "admin/referrals/top-referrers",
                element: <ReferralManagementPage />,
              },
              {
                path: "admin/pricing",
                element: <PricingManagementPage />,
              },
              {
                path: "admin/pricing/holidays",
                element: <PricingManagementPage />,
              },
              {
                path: "admin/pricing/surge",
                element: <PricingManagementPage />,
              },
              {
                path: "admin/coupons",
                element: <CouponManagementPage />,
              },
              {
                path: "admin/reports",
                element: <ReportsPage />,
              },
              {
                path: "admin/reports/users",
                element: <ReportsPage />,
              },
              {
                path: "admin/reports/bookings",
                element: <ReportsPage />,
              },
              {
                path: "admin/reports/revenue",
                element: <ReportsPage />,
              },
              {
                path: "admin/reports/custom",
                element: <ReportsPage />,
              },
              {
                path: "admin/settings",
                element: <AdminSettingsPage />,
              },
              {
                path: "admin/settings/notifications",
                element: <AdminSettingsPage />,
              },
              {
                path: "admin/settings/security",
                element: <AdminSettingsPage />,
              },
              {
                path: "admin/settings/features",
                element: <AdminSettingsPage />,
              },
              // Other admin routes will be added here
              // {
              //   path: "admin/users",
              //   element: <AdminUsersPage />,
              // },
              // {
              //   path: "admin/kyc",
              //   element: <AdminKYCPage />,
              // },
              // etc...
            ],
          },
        ],
      },
      {
        path: "cars",
        element: <CarListingPage />,
      },
      {
        path: "cars/:id",
        element: <CarDetailsPage />,
      },
      {
        path: "cars/:id/reviews",
        element: <CarReviewsPage />,
      },
      {
        path: "booking/:carId",
        element: <BookingFormPage />,
      },
      {
        path: "booking/:carId/payment",
        element: <BookingPaymentPage />,
      },

      // Protected Routes (require authentication)
      {
        element: <ProtectedRoute />,
        children: [
          // Profile Routes
          {
            path: "profile",
            element: <ProfileDashboardPage />,
          },
          {
            path: "profile/complete",
            element: <ProfileCompletePage />,
          },
          {
            path: "profile/kyc",
            element: <KYCStatusPage />,
          },
          {
            path: "profile/guarantor",
            element: <GuarantorManagementPage />,
          },
          {
            path: "profile/referrals",
            element: <ReferralDashboardPage />,
          },
          {
            path: "profile/settings",
            element: <SettingsPage />,
          },
          {
            path: "bookings",
            element: <BookingHistoryPage />,
          },
          {
            path: "booking/:id/active",
            element: <ActiveBookingPage />,
          },

          // Booking Routes (require profile completion)
          {
            element: <ProfileCompleteRoute />,
            children: [
              {
                path: "booking/:carId/date-time",
                element: <BookingDateTimePage />,
              },
              {
                path: "booking/:carId/payment-option",
                element: <BookingPaymentOptionPage />,
              },
              {
                path: "booking/:carId/guarantor",
                element: <BookingGuarantorPage />,
              },
              {
                path: "booking/:id/confirm",
                element: <BookingConfirmationPage />,
              },
            ],
          },
          {
            path: "booking/:bookingId/review",
            element: <ReviewFormPage />,
          },

          // Owner Routes (require owner role)
          {
            element: <OwnerRoute />,
            children: [
              {
                path: "owner",
                element: <OwnerDashboardPage />,
              },
              {
                path: "owner/cars/new",
                element: <OwnerAddCarPage />,
              },
              {
                path: "owner/cars/:id/edit",
                element: <OwnerEditCarPage />,
              },
              {
                path: "owner/bookings",
                element: <OwnerBookingsPage />,
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
    ],
  },
]);

export default router;
