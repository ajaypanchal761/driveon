import express from 'express';
import {
    getEnquiries,
    createEnquiry,
    updateEnquiry,
    getEnquiryDetails,
    getTasks,
    createTask,
    updateTask,
    getActiveBookings,
    getUpcomingBookings,
    getCRMAnalytics,
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getAttendance,
    markAttendance,
    getPayroll,
    createPayroll,
    updatePayrollStatus,
    getAdvances,
    createAdvance,
    addRepayment,
    getPerformanceReviews,
    createPerformanceReview,
    getStaffWorkTasks,
    createStaffWorkTask,
    updateStaffWorkTask,
    getCarDocuments,
    uploadCarDocument,
    createFastBooking,
    reportAccident,
    getAccidentCases,
    updateAccidentCase,
    getAccidentSummary,
    getActiveBookingsDetails,
    getPaymentStatus,
    getProfitabilityAnalysis,
    getGarages,
    createGarage,
    createCarExpense,
    getActiveRepairs,
    getRepairLogs,
    createRepairJob,
    updateRepairProgress,
    getInventory,
    createInventoryItem,
    onboardVendor,
    getVendorDirectory,
    getVendorSettlements,
    getVendorHistory,
    getFleetUtilization,
    getIncomeOverview,
    getExpenseTracking,
    getPendingPayments,
    settleInvoice,
    getPLOverview,
    getCashFlow,
    getDailyOperationsReport,
    getMonthlyPerformance,
    getAnnualReport,
    getExpenseCategories,
    createExpenseCategory,
    deleteExpenseCategory,
    getCities,
    createCity,
    updateCity,
    deleteCity,
    getDashboardAlerts
} from '../controllers/crm.controller.js';
// import { protect, admin } from '../middleware/auth.middleware.js'; // Assuming you have auth middleware

const router = express.Router();

// Middleware to handle file uploads using app.locals.upload
const handleFileUpload = (fieldName, isMultiple = false) => (req, res, next) => {
    const upload = req.app.locals.upload;
    if (!upload) return next();

    if (isMultiple) {
        upload.array(fieldName, 10)(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    } else {
        upload.single(fieldName)(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    }
};

// Enquiries Routes
router.route('/enquiries')
    .get(getEnquiries)
    .post(createEnquiry);

router.route('/enquiries/:id')
    .get(getEnquiryDetails)
    .put(updateEnquiry);

// Tasks / Follow-ups Routes
router.route('/tasks')
    .get(getTasks)
    .post(createTask);

router.route('/tasks/:id')
    .put(updateTask);

// Staff Routes
router.route('/staff')
    .get(getStaff)
    .post(handleFileUpload('avatar'), createStaff);

router.route('/staff/:id')
    .put(handleFileUpload('avatar'), updateStaff)
    .delete(deleteStaff);

// Roles Routes
router.route('/roles')
    .get(getRoles)
    .post(createRole);

router.route('/roles/:id')
    .put(updateRole)
    .delete(deleteRole);

// Attendance Routes
router.route('/attendance')
    .get(getAttendance)
    .post(markAttendance);

// Payroll Routes
router.route('/payroll')
    .get(getPayroll)
    .post(createPayroll);

router.route('/payroll/:id')
    .put(updatePayrollStatus);

// Advance & Loan Routes
router.route('/advances')
    .get(getAdvances)
    .post(createAdvance);

router.route('/advances/:id/repay')
    .post(addRepayment);

// Performance Routes
router.route('/performance')
    .get(getPerformanceReviews)
    .post(createPerformanceReview);

// Staff Work Task Routes
router.route('/staff-tasks')
    .get(getStaffWorkTasks)
    .post(createStaffWorkTask);

router.route('/staff-tasks/:id')
    .put(updateStaffWorkTask);

// Car Document Routes
router.route('/car-documents')
    .get(getCarDocuments)
    .post(handleFileUpload('file'), uploadCarDocument);

// Fast Booking Route
router.post('/fast-booking', createFastBooking);

// Accident Routes
router.route('/accidents')
    .get(getAccidentCases)
    .post(handleFileUpload('evidence', true), reportAccident);

router.route('/accidents/:id')
    .put(updateAccidentCase);

// Reports & Analytics Routes
router.get('/reports/accident-summary', getAccidentSummary);
router.get('/reports/profitability', getProfitabilityAnalysis);

// Bookings Detailed (CRM View)
router.get('/bookings/active-details', getActiveBookingsDetails);

// Finance Routes
router.get('/finance/payments', getPaymentStatus);

// Garage & Expense Routes
router.route('/garages')
    .get(getGarages)
    .post(handleFileUpload('logo'), createGarage);

router.post('/expenses', createCarExpense);

// Repair Job Routes
router.get('/repairs/active', getActiveRepairs);
router.get('/repairs/logs', getRepairLogs);
router.post('/repairs', createRepairJob);
router.put('/repairs/:id', updateRepairProgress);

// Inventory Routes
router.route('/inventory')
    .get(getInventory)
    .post(createInventoryItem);

// Vendor Routes
router.route('/vendors')
    .post(handleFileUpload('profileImage'), onboardVendor)
    .get(getVendorDirectory);

router.get('/vendors/settlements', getVendorSettlements);
router.get('/vendors/history', getVendorHistory);
router.get('/vendors/utilization', getFleetUtilization);

// Financial Routes
router.get('/finance/income-overview', getIncomeOverview);
router.get('/finance/expenses', getExpenseTracking);
router.get('/finance/pending-payments', getPendingPayments);
router.put('/finance/invoices/:id/settle', settleInvoice);
router.get('/finance/pl-overview', getPLOverview);
router.get('/finance/cash-flow', getCashFlow);

// Reporting Routes
router.get('/reports/daily-operations', getDailyOperationsReport);
router.get('/reports/monthly-performance', getMonthlyPerformance);
router.get('/reports/annual-review', getAnnualReport);

// Expense Categories
router.route('/finance/categories')
    .get(getExpenseCategories)
    .post(createExpenseCategory);
router.delete('/finance/categories/:id', deleteExpenseCategory);

// Settings - Cities & Locations
router.route('/settings/cities')
    .get(getCities)
    .post(createCity);
router.route('/settings/cities/:id')
    .put(updateCity)
    .delete(deleteCity);

// Dashboard - Smart Command Center
router.get('/dashboard/alerts', getDashboardAlerts);

// Bookings Routes
router.get('/bookings/active', getActiveBookings);
router.get('/bookings/upcoming', getUpcomingBookings);

// Analytics Route
router.get('/analytics', getCRMAnalytics);

export default router;
