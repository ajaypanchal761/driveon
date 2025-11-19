import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AdminRoute from '../components/layout/AdminRoute';
import OwnerRoute from '../components/layout/OwnerRoute';
import ProfileCompleteRoute from '../components/layout/ProfileCompleteRoute';
import PageLayout from '../components/layout/PageLayout';

// Lazy load pages for code splitting (better performance)
const HomePage = lazy(() => import('../pages/home/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const VerifyOTPPage = lazy(() => import('../pages/auth/VerifyOTPPage'));
const CarListingPage = lazy(() => import('../pages/cars/CarListingPage'));
const CarDetailsPage = lazy(() => import('../pages/cars/CarDetailsPage'));
const BookingDateTimePage = lazy(() => import('../pages/booking/BookingDateTimePage'));
const BookingPaymentOptionPage = lazy(() => import('../pages/booking/BookingPaymentOptionPage'));
const BookingGuarantorPage = lazy(() => import('../pages/booking/BookingGuarantorPage'));
const BookingPaymentPage = lazy(() => import('../pages/booking/BookingPaymentPage'));
const BookingConfirmationPage = lazy(() => import('../pages/booking/BookingConfirmationPage'));
const ActiveBookingPage = lazy(() => import('../pages/booking/ActiveBookingPage'));
const BookingHistoryPage = lazy(() => import('../pages/booking/BookingHistoryPage'));
const ProfileDashboardPage = lazy(() => import('../pages/profile/ProfileDashboardPage'));
const ProfileCompletePage = lazy(() => import('../pages/profile/ProfileCompletePage'));
const KYCStatusPage = lazy(() => import('../pages/profile/KYCStatusPage'));
const GuarantorManagementPage = lazy(() => import('../pages/profile/GuarantorManagementPage'));
const ReferralDashboardPage = lazy(() => import('../pages/profile/ReferralDashboardPage'));
const SettingsPage = lazy(() => import('../pages/profile/SettingsPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminKYCPage = lazy(() => import('../pages/admin/AdminKYCPage'));
const AdminCarsPage = lazy(() => import('../pages/admin/AdminCarsPage'));
const AdminBookingsPage = lazy(() => import('../pages/admin/AdminBookingsPage'));
const AdminPricingPage = lazy(() => import('../pages/admin/AdminPricingPage'));
const AdminReportsPage = lazy(() => import('../pages/admin/AdminReportsPage'));
const OwnerDashboardPage = lazy(() => import('../pages/owner/OwnerDashboardPage'));
const OwnerAddCarPage = lazy(() => import('../pages/owner/OwnerAddCarPage'));
const OwnerEditCarPage = lazy(() => import('../pages/owner/OwnerEditCarPage'));
const OwnerBookingsPage = lazy(() => import('../pages/owner/OwnerBookingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Create router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      // Public Routes
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOTPPage />,
      },
      {
        path: 'cars',
        element: <CarListingPage />,
      },
      {
        path: 'cars/:id',
        element: <CarDetailsPage />,
      },

      // Protected Routes (require authentication)
      {
        element: <ProtectedRoute />,
        children: [
          // Profile Routes
          {
            path: 'profile',
            element: <ProfileDashboardPage />,
          },
          {
            path: 'profile/complete',
            element: <ProfileCompletePage />,
          },
          {
            path: 'profile/kyc',
            element: <KYCStatusPage />,
          },
          {
            path: 'profile/guarantor',
            element: <GuarantorManagementPage />,
          },
          {
            path: 'profile/referrals',
            element: <ReferralDashboardPage />,
          },
          {
            path: 'profile/settings',
            element: <SettingsPage />,
          },
          {
            path: 'bookings',
            element: <BookingHistoryPage />,
          },
          {
            path: 'booking/:id/active',
            element: <ActiveBookingPage />,
          },

          // Booking Routes (require profile completion)
          {
            element: <ProfileCompleteRoute />,
            children: [
              {
                path: 'booking/:carId/date-time',
                element: <BookingDateTimePage />,
              },
              {
                path: 'booking/:carId/payment-option',
                element: <BookingPaymentOptionPage />,
              },
              {
                path: 'booking/:carId/guarantor',
                element: <BookingGuarantorPage />,
              },
              {
                path: 'booking/:carId/payment',
                element: <BookingPaymentPage />,
              },
              {
                path: 'booking/:id/confirm',
                element: <BookingConfirmationPage />,
              },
            ],
          },

          // Admin Routes (require admin role)
          {
            element: <AdminRoute />,
            children: [
              {
                path: 'admin',
                element: <AdminDashboardPage />,
              },
              {
                path: 'admin/users',
                element: <AdminUsersPage />,
              },
              {
                path: 'admin/kyc',
                element: <AdminKYCPage />,
              },
              {
                path: 'admin/cars',
                element: <AdminCarsPage />,
              },
              {
                path: 'admin/bookings',
                element: <AdminBookingsPage />,
              },
              {
                path: 'admin/pricing',
                element: <AdminPricingPage />,
              },
              {
                path: 'admin/reports',
                element: <AdminReportsPage />,
              },
            ],
          },

          // Owner Routes (require owner role)
          {
            element: <OwnerRoute />,
            children: [
              {
                path: 'owner',
                element: <OwnerDashboardPage />,
              },
              {
                path: 'owner/cars/new',
                element: <OwnerAddCarPage />,
              },
              {
                path: 'owner/cars/:id/edit',
                element: <OwnerEditCarPage />,
              },
              {
                path: 'owner/bookings',
                element: <OwnerBookingsPage />,
              },
            ],
          },
        ],
      },

      // 404 Page
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

