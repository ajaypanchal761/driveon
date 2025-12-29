import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, useState, useEffect } from "react";
import AdminRoute from "../components/layout/AdminRoute";
import AdminLayout from "../components/admin/layout/AdminLayout";
import ModuleLayout from "../module/components/layout/ModuleLayout";
import { useAdminAuth } from "../context/AdminContext";
import RouteErrorBoundary from "../components/common/RouteErrorBoundary";

// Module pages (new frontend)
const ModuleHomePage = lazy(() => import("../module/pages/HomePage"));
const ModuleSearchPage = lazy(() => import("../module/pages/SearchPage"));
const ModuleCarDetailsPage = lazy(() => 
  import("../module/pages/CarDetailsPage").catch((error) => {
    console.error("Failed to load CarDetailsPage:", error);
    // Return a fallback component
    return {
      default: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Failed to load page</h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Reload
            </button>
          </div>
        </div>
      ),
    };
  })
);
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
const ModuleAboutPage = lazy(() => import("../module/pages/AboutPage"));
const ModuleContactPage = lazy(() => import("../module/pages/ContactPage"));
const ModulePrivacyPolicyPage = lazy(() => import("../module/pages/PrivacyPolicyPage"));
const ModuleTermsAndConditionsPage = lazy(() => import("../module/pages/TermsAndConditionsPage"));
const ModuleTestPage = lazy(() => import("../module/pages/ModuleTestPage"));
const ModuleLocationPage = lazy(() => import("../module/pages/ModuleLocationPage"));
const CategoryPage = lazy(() => import("../module/pages/CategoryPage"));
const BrandPage = lazy(() => import("../module/pages/BrandPage"));
const ModuleNewProfilePage = lazy(() => import("../module/pages/ModuleNewProfilePage"));
const ModuleProfile1Page = lazy(() => import("../module/pages/ModuleProfile1Page"));
const ModuleFavoritesPage = lazy(() => import("../module/pages/ModuleFavoritesPage"));




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
const AddOnServicesPage = lazy(() =>
  import("../pages/admin/addon-services/AddOnServicesPage")
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
 * ModuleResponsiveProfile Component
 * Use the unified mobile-first profile UI on all breakpoints to avoid
 * inconsistent designs between desktop and mobile.
 */
const ModuleResponsiveProfile = () => {
  return <ModuleProfile1Page />;
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

const CRMLayout = lazy(() => import("../crm/layout/CRMLayout"));
const CRM_DashboardPage = lazy(() => import("../crm/pages/DashboardPage"));
const CRM_EnquiriesPage = lazy(() => import("../crm/pages/EnquiriesPage"));

// Import Subpages
const CRM_EnquirySub = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.AllEnquiriesPage })));
const CRM_EnquiryNew = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.NewEnquiriesPage })));
const CRM_EnquiryInProgress = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.InProgressEnquiriesPage })));
const CRM_EnquiryFollowUp = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.FollowUpsEnquiriesPage })));
const CRM_EnquiryConverted = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.ConvertedEnquiriesPage })));
const CRM_EnquiryClosed = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.ClosedEnquiriesPage })));
const CRM_EnquiryAnalytics = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.EnquiryAnalyticsPage })));
const CRM_EnquiryCalendar = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.FollowUpCalendarPage })));
const CRM_EnquiryDetails = lazy(() => import("../crm/pages/enquiries/EnquirySubPages").then(module => ({ default: module.EnquiryDetailsPage })));

const CRM_StaffPage = lazy(() => import("../crm/pages/StaffPage"));

// Import Staff Subpages
const CRM_StaffDirectory = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.StaffDirectoryPage })));
const CRM_StaffRoles = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.RolesPage })));
const CRM_StaffAttendance = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.AttendancePage })));
const CRM_StaffSalary = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.SalaryPage })));
const CRM_StaffAdvances = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.AdvancesPage })));
const CRM_StaffPerformance = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.PerformancePage })));
const CRM_StaffTasks = lazy(() => import("../crm/pages/staff/StaffSubPages").then(module => ({ default: module.StaffTasksPage })));

const CRM_CarsPage = lazy(() => import("../crm/pages/CarsPage"));
// Import Car Subpages
const CRM_AllCars = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.AllCarsPage })));
const CRM_LiveStatus = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.LiveStatusPage })));
const CRM_IdleCars = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.IdleCarsPage })));
const CRM_CarTimeline = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.CarTimelinePage })));
const CRM_CarProfit = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.CarProfitLossPage })));
const CRM_CarHealth = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.CarHealthPage })));
const CRM_CarDocs = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.CarDocumentsPage })));
// Accident Subpages
const CRM_AccidentActive = lazy(() => import("../crm/pages/cars/AccidentActiveCases"));
const CRM_AccidentDetail = lazy(() => import("../crm/pages/cars/AccidentDetailPage").then(module => ({ default: module.AccidentDetailPage })));
const CRM_AccidentAdd = lazy(() => import("../crm/pages/cars/AccidentAddCase"));
const CRM_AccidentClaims = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.AccidentClaimsPage })));
const CRM_AccidentRecovery = lazy(() => import("../crm/pages/cars/CarSubPages").then(module => ({ default: module.AccidentRecoveryPage })));
const CRM_AccidentClosed = lazy(() => import("../crm/pages/cars/AccidentClosedCases"));
const CRM_AccidentSummary = lazy(() => import("../crm/pages/cars/AccidentLossSummary"));

const CRM_BookingsPage = lazy(() => import("../crm/pages/BookingsPage"));
// Import Booking Subpages
const CRM_ActiveBookings = lazy(() => import("../crm/pages/bookings/BookingSubPages").then(module => ({ default: module.ActiveBookingsPage })));
const CRM_UpcomingBookings = lazy(() => import("../crm/pages/bookings/BookingSubPages").then(module => ({ default: module.UpcomingBookingsPage })));
const CRM_CompletedBookings = lazy(() => import("../crm/pages/bookings/BookingSubPages").then(module => ({ default: module.CompletedBookingsPage })));
const CRM_CancelledBookings = lazy(() => import("../crm/pages/bookings/BookingSubPages").then(module => ({ default: module.CancelledBookingsPage })));
const CRM_BookingPayments = lazy(() => import("../crm/pages/bookings/BookingSubPages").then(module => ({ default: module.BookingPaymentStatusPage })));
const CRM_BookingProfit = lazy(() => import("../crm/pages/bookings/BookingSubPages").then(module => ({ default: module.BookingProfitViewPage })));

const CRM_GaragePage = lazy(() => import("../crm/pages/GaragePage"));
// Import Garage Subpages
const CRM_AllGarages = lazy(() => import("../crm/pages/garage/GarageSubPages").then(module => ({ default: module.AllGaragesPage })));
const CRM_ActiveRepairs = lazy(() => import("../crm/pages/garage/GarageSubPages").then(module => ({ default: module.ActiveRepairsPage })));
const CRM_ServiceHistory = lazy(() => import("../crm/pages/garage/GarageSubPages").then(module => ({ default: module.ServiceHistoryPage })));
const CRM_PartsCost = lazy(() => import("../crm/pages/garage/GarageSubPages").then(module => ({ default: module.PartsCostPage })));
const CRM_Warranty = lazy(() => import("../crm/pages/garage/GarageSubPages").then(module => ({ default: module.WarrantyPage })));
const CRM_MaintenanceAlerts = lazy(() => import("../crm/pages/garage/GarageSubPages").then(module => ({ default: module.MaintenanceAlertsPage })));

const CRM_VendorsPage = lazy(() => import("../crm/pages/VendorsPage"));
// Import Vendor Subpages
const CRM_AllVendors = lazy(() => import("../crm/pages/vendors/VendorSubPages").then(module => ({ default: module.AllVendorsPage })));
const CRM_VendorPayments = lazy(() => import("../crm/pages/vendors/VendorSubPages").then(module => ({ default: module.VendorPaymentsPage })));
const CRM_VendorHistory = lazy(() => import("../crm/pages/vendors/VendorSubPages").then(module => ({ default: module.VendorHistoryPage })));
const CRM_VendorPerformance = lazy(() => import("../crm/pages/vendors/VendorSubPages").then(module => ({ default: module.VendorPerformancePage })));
const CRM_VendorCarUsage = lazy(() => import("../crm/pages/vendors/VendorSubPages").then(module => ({ default: module.VendorCarUsagePage })));

const CRM_FinancePage = lazy(() => import("../crm/pages/FinancePage"));
// Import Finance Subpages
const CRM_Income = lazy(() => import("../crm/pages/finance/FinanceSubPages").then(module => ({ default: module.IncomePage })));
const CRM_Expenses = lazy(() => import("../crm/pages/finance/FinanceSubPages").then(module => ({ default: module.ExpensesPage })));
const CRM_PendingPayments = lazy(() => import("../crm/pages/finance/FinanceSubPages").then(module => ({ default: module.PendingPaymentsPage })));
const CRM_ProfitLoss = lazy(() => import("../crm/pages/finance/FinanceSubPages").then(module => ({ default: module.ProfitLossPage })));
const CRM_CashFlow = lazy(() => import("../crm/pages/finance/FinanceSubPages").then(module => ({ default: module.CashFlowPage })));

const CRM_SettingsPage = lazy(() => import("../crm/pages/SettingsPage"));
// Import Report Subpages
const CRM_DailyReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.DailyReportsPage })));
const CRM_MonthlyReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.MonthlyReportsPage })));
const CRM_YearlyReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.YearlyReportsPage })));
const CRM_CarReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.CarReportsPage })));
const CRM_StaffReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.StaffReportsPage })));
const CRM_VendorReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.VendorReportsPage })));
const CRM_CustomReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.CustomReportsPage })));
const CRM_ComparisonReports = lazy(() => import("../crm/pages/reports/ReportSubPages").then(module => ({ default: module.ComparisonReportsPage })));

// Import Tool Subpages
const CRM_ExcelExport = lazy(() => import("../crm/pages/tools/ToolsSubPages").then(module => ({ default: module.ExcelExportPage })));
const CRM_PDFExport = lazy(() => import("../crm/pages/tools/ToolsSubPages").then(module => ({ default: module.PDFExportPage })));
const CRM_Notes = lazy(() => import("../crm/pages/tools/ToolsSubPages").then(module => ({ default: module.NotesPage })));
const CRM_Reminders = lazy(() => import("../crm/pages/tools/ToolsSubPages").then(module => ({ default: module.RemindersPage })));
const CRM_Calculator = lazy(() => import("../crm/pages/tools/ToolsSubPages").then(module => ({ default: module.CalculatorPage })));
const CRM_AuditLogs = lazy(() => import("../crm/pages/tools/ToolsSubPages").then(module => ({ default: module.AuditLogsPage })));
// Import Setting Subpages
const CRM_SettingsOverview = lazy(() => import("../crm/pages/settings/SettingsSubPages").then(module => ({ default: module.SettingsOverviewPage })));
const CRM_Locations = lazy(() => import("../crm/pages/settings/SettingsSubPages").then(module => ({ default: module.LocationsPage })));
const CRM_ExpenseCategories = lazy(() => import("../crm/pages/settings/SettingsSubPages").then(module => ({ default: module.ExpenseCategoriesPage })));
const CRM_SalaryRules = lazy(() => import("../crm/pages/settings/SettingsSubPages").then(module => ({ default: module.SalaryRulesPage })));
const CRM_RolesAccess = lazy(() => import("../crm/pages/settings/SettingsSubPages").then(module => ({ default: module.RolesAccessPage })));
const CRM_AlertsLimits = lazy(() => import("../crm/pages/settings/SettingsSubPages").then(module => ({ default: module.AlertsLimitsPage })));

// Create router configuration
const router = createBrowserRouter([
  // CRM Routes
  {
    path: "/crm",
    element: <CRMLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <CRM_DashboardPage />,
      },
      // ENQUIRIES ROUTES
      {
        path: "enquiries",
        element: <Navigate to="enquiries/all" replace />,
      },
      {
        path: "enquiries/all",
        element: <CRM_EnquirySub />, 
      },
      {
        path: "enquiries/new",
        element: <CRM_EnquiryNew />,
      },
      {
        path: "enquiries/in-progress",
        element: <CRM_EnquiryInProgress />,
      },
      {
        path: "enquiries/follow-ups",
        element: <CRM_EnquiryFollowUp />,
      },
      {
        path: "enquiries/converted",
        element: <CRM_EnquiryConverted />,
      },
      {
        path: "enquiries/closed",
        element: <CRM_EnquiryClosed />,
      },
      {
        path: "enquiries/analytics",
        element: <CRM_EnquiryAnalytics />,
      },
      {
        path: "enquiries/calendar",
        element: <CRM_EnquiryCalendar />,
      },
      {
        path: "enquiries/:id",
        element: <CRM_EnquiryDetails />,
      },
      // STAFF ROUTES
      {
        path: "staff",
        element: <Navigate to="staff/directory" replace />,
      },
      {
        path: "staff/directory",
        element: <CRM_StaffDirectory />,
      },
      {
        path: "staff/roles",
        element: <CRM_StaffRoles />,
      },
      {
        path: "staff/attendance",
        element: <CRM_StaffAttendance />,
      },
      {
        path: "staff/salary",
        element: <CRM_StaffSalary />,
      },
      {
        path: "staff/advances",
        element: <CRM_StaffAdvances />,
      },
      {
        path: "staff/performance",
        element: <CRM_StaffPerformance />,
      },
      {
        path: "staff/tasks",
        element: <CRM_StaffTasks />,
      },
      // CAR ROUTES
      {
        path: "cars",
        element: <Navigate to="cars/all" replace />,
      },
      {
        path: "cars/all",
        element: <CRM_AllCars />,
      },
      {
        path: "cars/live",
        element: <CRM_LiveStatus />,
      },
      {
        path: "cars/idle",
        element: <CRM_IdleCars />,
      },
      {
        path: "cars/timeline",
        element: <CRM_CarTimeline />,
      },
      {
        path: "cars/profit",
        element: <CRM_CarProfit />,
      },
      {
        path: "cars/health",
        element: <CRM_CarHealth />,
      },
      {
        path: "cars/documents",
        element: <CRM_CarDocs />,
      },
      // Accident Routes
      {
        path: "cars/accidents",
        element: <CRM_AccidentActive />,
      },
      {
        path: "cars/accidents/:id",
        element: <CRM_AccidentDetail />,
      },
      {
        path: "cars/accidents/active",
        element: <CRM_AccidentActive />,
      },
      {
        path: "cars/accidents/add",
        element: <CRM_AccidentAdd />,
      },
      {
        path: "cars/accidents/claims",
        element: <CRM_AccidentClaims />,
      },
      {
        path: "cars/accidents/recovery",
        element: <CRM_AccidentRecovery />,
      },
      {
        path: "cars/accidents/closed",
        element: <CRM_AccidentClosed />,
      },
      {
        path: "cars/accidents/summary",
        element: <CRM_AccidentSummary />,
      },
      // BOOKING ROUTES
      {
        path: "bookings",
        element: <Navigate to="bookings/active" replace />,
      },
      {
        path: "bookings/active",
        element: <CRM_ActiveBookings />,
      },
      {
        path: "bookings/upcoming",
        element: <CRM_UpcomingBookings />,
      },
      {
        path: "bookings/completed",
        element: <CRM_CompletedBookings />,
      },
      {
        path: "bookings/cancelled",
        element: <CRM_CancelledBookings />,
      },
      {
        path: "bookings/payments",
        element: <CRM_BookingPayments />,
      },
      {
        path: "bookings/profit",
        element: <CRM_BookingProfit />,
      },
      // GARAGE ROUTES
      {
        path: "garage",
        element: <Navigate to="garage/active" replace />,
      },
      {
        path: "garage/all",
        element: <CRM_AllGarages />,
      },
      {
        path: "garage/active",
        element: <CRM_ActiveRepairs />,
      },
      {
        path: "garage/history",
        element: <CRM_ServiceHistory />,
      },
      {
        path: "garage/parts",
        element: <CRM_PartsCost />,
      },
      {
        path: "garage/warranty",
        element: <CRM_Warranty />,
      },
      {
        path: "garage/alerts",
        element: <CRM_MaintenanceAlerts />,
      },
      // VENDOR ROUTES
      {
        path: "vendors",
        element: <Navigate to="vendors/all" replace />,
      },
      {
        path: "vendors/all",
        element: <CRM_AllVendors />,
      },
      {
        path: "vendors/payments",
        element: <CRM_VendorPayments />,
      },
      {
        path: "vendors/history",
        element: <CRM_VendorHistory />,
      },
      {
        path: "vendors/performance",
        element: <CRM_VendorPerformance />,
      },
      {
        path: "vendors/car-usage",
        element: <CRM_VendorCarUsage />,
      },
      // FINANCE ROUTES
      {
        path: "finance",
        element: <Navigate to="finance/profit-loss" replace />, // Default to P&L overview
      },
      {
        path: "finance/income",
        element: <CRM_Income />,
      },
      {
        path: "finance/expenses",
        element: <CRM_Expenses />,
      },
      {
        path: "finance/pending",
        element: <CRM_PendingPayments />,
      },
      {
        path: "finance/profit-loss",
        element: <CRM_ProfitLoss />,
      },
      {
        path: "finance/cash-flow",
        element: <CRM_CashFlow />,
      },
      // REPORT ROUTES
      {
        path: "reports",
        element: <Navigate to="reports/monthly" replace />,
      },
      {
        path: "reports/daily",
        element: <CRM_DailyReports />,
      },
      {
        path: "reports/monthly",
        element: <CRM_MonthlyReports />,
      },
      {
        path: "reports/yearly",
        element: <CRM_YearlyReports />,
      },
      {
        path: "reports/car-wise",
        element: <CRM_CarReports />,
      },
      {
        path: "reports/staff-wise",
        element: <CRM_StaffReports />,
      },
      {
        path: "reports/vendor-wise",
        element: <CRM_VendorReports />,
      },
      {
        path: "reports/custom",
        element: <CRM_CustomReports />,
      },
      {
        path: "reports/comparison",
        element: <CRM_ComparisonReports />,
      },
      // SETTINGS ROUTES
      {
        path: "settings",
        element: <CRM_SettingsOverview />,
      },
      {
        path: "settings/locations",
        element: <CRM_Locations />,
      },
      {
        path: "settings/expenses",
        element: <CRM_ExpenseCategories />,
      },
      {
        path: "settings/salary",
        element: <CRM_SalaryRules />,
      },
      {
        path: "settings/roles",
        element: <CRM_RolesAccess />,
      },
      {
        path: "settings/alerts",
        element: <CRM_AlertsLimits />,
      },
      // TOOLS ROUTES
      {
        path: "tools",
        element: <Navigate to="tools/notes" replace />,
      },
      {
        path: "tools/excel",
        element: <CRM_ExcelExport />,
      },
      {
        path: "tools/pdf",
        element: <CRM_PDFExport />,
      },
      {
        path: "tools/notes",
        element: <CRM_Notes />,
      },
      {
        path: "tools/reminders",
        element: <CRM_Reminders />,
      },
      {
        path: "tools/calculator",
        element: <CRM_Calculator />,
      },
      {
        path: "tools/audit-logs",
        element: <CRM_AuditLogs />,
      },
      {
        path: "*",
        element: <Navigate to="dashboard" replace />,
      }
    ]
  },

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
        errorElement: <RouteErrorBoundary />,
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
        element: <ModuleResponsiveProfile />,
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
        path: "/favorites",
        element: <ModuleFavoritesPage />,
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
        path: "/about",
        element: <ModuleAboutPage />,
      },
      {
        path: "/contact",
        element: <ModuleContactPage />,
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
            path: "/admin/addon-services",
            element: <AddOnServicesPage />,
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
