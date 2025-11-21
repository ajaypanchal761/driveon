# 🎯 ADMIN PANEL - COMPLETE IMPLEMENTATION PLAN

## 📋 TABLE OF CONTENTS

1. [Admin Panel Overview](#admin-panel-overview)
2. [Admin Authentication](#admin-authentication)
3. [Admin Dashboard](#admin-dashboard)
4. [User Management](#user-management)
5. [KYC Management](#kyc-management)
6. [Guarantor Management](#guarantor-management)
7. [Car Listing Management](#car-listing-management)
8. [Booking Management](#booking-management)
9. [Payment Management](#payment-management)
10. [Referral Dashboard](#referral-dashboard)
11. [Dynamic Pricing Management](#dynamic-pricing-management)
12. [Reports & Analytics](#reports--analytics)
13. [Live Tracking](#live-tracking)
14. [Dispute Management](#dispute-management)
15. [Coupon Management](#coupon-management)
16. [System Settings](#system-settings)
17. [Frontend Flow & Routes](#frontend-flow--routes)
18. [Component Structure](#component-structure)
19. [API Endpoints Required](#api-endpoints-required)

---

## 🎯 ADMIN PANEL OVERVIEW

### Purpose

The Admin Panel is a comprehensive management system that allows administrators to oversee and control all aspects of the Car Rental Platform, including user verification, content management, financial oversight, and system configuration.

### Key Principles

- **Security First**: Separate admin authentication with enhanced security
- **Role-Based Access**: Admin-only routes and features
- **Real-Time Updates**: Live tracking and real-time notifications
- **Comprehensive Control**: Full CRUD operations on all entities
- **Analytics & Insights**: Data-driven decision making tools
- **Mobile Responsive**: Works seamlessly on all devices

---

## 🔐 ADMIN AUTHENTICATION

### Separate Admin Login/Signup System

#### Admin Login Page (`/admin/login`)

**Features:**

- Email/Phone + Password authentication (more secure than OTP for admin)
- Two-Factor Authentication (2FA) option
- Remember me functionality
- Forgot password recovery
- Admin-specific branding and design
- Rate limiting to prevent brute force attacks

**Fields:**

- Email/Phone Number
- Password
- Remember Me (checkbox)
- 2FA Code (if enabled)

#### Admin Signup Page (`/admin/signup`)

**Features:**

- Admin invitation code required (only super admins can create new admins)
- Email verification
- Strong password requirements
- Admin role selection (Super Admin, Admin, Moderator)
- Initial profile setup

**Fields:**

- Invitation Code (required)
- Full Name
- Email
- Phone Number
- Password
- Confirm Password
- Admin Role (dropdown: Super Admin, Admin, Moderator)
- Terms & Conditions acceptance

#### Admin Profile & Settings

- Change password
- Enable/Disable 2FA
- Update profile information
- View login history
- Manage API keys (if needed)

---

## 📊 ADMIN DASHBOARD

### Dashboard Overview (`/admin`)

#### Key Metrics Cards (Top Section)

1. **Total Users**

   - Active users count
   - New users today/week/month
   - Growth percentage

2. **Total Bookings**

   - Total bookings count
   - Active bookings
   - Completed bookings
   - Cancelled bookings
   - Revenue (total, today, this month)

3. **Total Cars**

   - Total cars listed
   - Available cars
   - Booked cars
   - Cars pending approval

4. **KYC Status**

   - Pending KYC verifications
   - Approved KYC count
   - Rejected KYC count
   - Pending guarantor verifications

5. **Payments**

   - Total revenue
   - Pending payments
   - Failed transactions
   - Refunds processed

6. **Referrals**
   - Total referral codes issued
   - Active referrals
   - Points distributed
   - Top referrers

#### Quick Actions Section

- Approve Pending KYCs
- Review Pending Cars
- View Active Bookings
- Handle Disputes
- Generate Reports

#### Recent Activity Feed

- Latest user registrations
- Recent bookings
- KYC submissions
- Payment transactions
- System alerts

#### Charts & Graphs

- Revenue trends (line chart)
- Booking trends (bar chart)
- User growth (area chart)
- Popular car models (pie chart)
- Peak booking hours (heatmap)

#### Notifications Panel

- Pending approvals
- Dispute alerts
- System warnings
- Payment failures
- Critical issues

---

## 👥 USER MANAGEMENT

### User List Page (`/admin/users`)

#### Features:

1. **User List Table**

   - Search by name, email, phone
   - Filter by:
     - Status (Active, Inactive, Suspended, Banned)
     - Role (User, Owner, Guarantor)
     - KYC Status (Verified, Pending, Rejected)
     - Registration Date
     - Profile Completion Status
   - Sort by: Name, Registration Date, Last Active
   - Pagination

2. **User Actions**

   - View full profile
   - Edit user details
   - Suspend/Activate account
   - Ban user
   - Delete user (soft delete)
   - Send notification/email
   - View booking history
   - View KYC documents
   - View guarantor details
   - View referral details

3. **Bulk Actions**
   - Export user list (CSV/Excel)
   - Bulk suspend/activate
   - Send bulk notifications
   - Bulk delete

### User Detail Page (`/admin/users/:id`)

#### Tabs:

1. **Profile Information**

   - Basic details (name, email, phone, age, gender, address)
   - Profile photo
   - Registration date
   - Last active
   - Account status

2. **KYC Documents**

   - Aadhaar details
   - PAN details
   - Driving License details
   - Verification status
   - Verification history
   - Approve/Reject buttons

3. **Guarantor Information**

   - Linked guarantors
   - Guarantor KYC status
   - Guarantor verification history

4. **Booking History**

   - All bookings by user
   - Booking status
   - Payment history
   - Reviews given

5. **Referral Activity**

   - Referral code
   - Referrals made
   - Points earned
   - Points redeemed

6. **Activity Log**
   - Login history
   - Actions performed
   - System interactions

---

## ✅ KYC MANAGEMENT

### KYC List Page (`/admin/kyc`)

#### Features:

1. **KYC List Table**

   - Filter by:
     - Status (Pending, Approved, Rejected, Under Review)
     - Document Type (Aadhaar, PAN, Driving License)
     - User Type (User, Guarantor)
     - Submission Date
   - Search by user name/email/phone
   - Sort by submission date, status

2. **KYC Actions**

   - View full document details
   - View user profile
   - Approve KYC
   - Reject KYC (with reason)
   - Request additional documents
   - Download documents
   - View verification history

3. **Bulk Actions**
   - Bulk approve
   - Bulk reject
   - Export KYC list

### KYC Detail Page (`/admin/kyc/:id`)

#### Document Viewer:

- **Aadhaar Card**

  - Front image
  - Back image
  - Aadhaar number
  - Name
  - Date of Birth
  - Address
  - Verification status from DigiLocker

- **PAN Card**

  - PAN image
  - PAN number
  - Name
  - Date of Birth
  - Father's Name
  - Verification status

- **Driving License**
  - DL image
  - License number
  - Name
  - Date of Birth
  - Validity
  - Vehicle classes
  - Verification status

#### Actions:

- Approve (with optional notes)
- Reject (with mandatory reason)
- Request Additional Documents
- View Verification History
- Download Documents

---

## 🛡️ GUARANTOR MANAGEMENT

### Guarantor List Page (`/admin/guarantors`)

#### Features:

1. **Guarantor List Table**

   - Filter by:
     - Verification Status (Pending, Verified, Rejected)
     - Linked User
     - KYC Status
   - Search by guarantor name/email/phone
   - View linked user details

2. **Guarantor Actions**
   - View guarantor profile
   - View KYC documents
   - Verify/Reject guarantor
   - View linked users
   - View booking history

### Guarantor Detail Page (`/admin/guarantors/:id`)

#### Information Displayed:

- Guarantor profile details
- KYC documents (same as user KYC)
- Linked users list
- Verification status
- Verification history
- Actions: Approve/Reject verification

---

## 🚗 CAR LISTING MANAGEMENT

### Car List Page (`/admin/cars`)

#### Features:

1. **Car List Table/Grid**

   - Filter by:
     - Status (Active, Inactive, Pending Approval, Rejected)
     - Owner
     - Brand, Model
     - Fuel Type
     - Transmission
     - Price Range
     - Availability
   - Search by car name, brand, model, owner
   - Sort by: Price, Rating, Created Date, Bookings Count

2. **Car Actions**

   - View car details
   - Edit car information
   - Approve/Reject car listing
   - Activate/Deactivate car
   - Delete car
   - View owner details
   - View booking history
   - View reviews
   - Manage availability calendar

3. **Bulk Actions**
   - Bulk approve/reject
   - Bulk activate/deactivate
   - Export car list

### Car Detail Page (`/admin/cars/:id`)

#### Tabs:

1. **Car Information**

   - Basic details (brand, model, seats, transmission, fuel type, color)
   - Features list
   - Images gallery
   - Price details
   - Availability calendar
   - Location

2. **Owner Information**

   - Owner profile
   - Owner contact details
   - Owner verification status

3. **Booking History**

   - All bookings for this car
   - Booking statistics
   - Revenue generated

4. **Reviews & Ratings**

   - All reviews
   - Average rating
   - Rating distribution

5. **Availability Management**
   - Calendar view
   - Block dates
   - Set availability

### Add/Edit Car Page (`/admin/cars/new`, `/admin/cars/:id/edit`)

#### Form Fields:

- **Basic Information**

  - Brand (dropdown/autocomplete)
  - Model (dropdown/autocomplete)
  - Year
  - Seats
  - Transmission (Manual, Automatic)
  - Fuel Type (Petrol, Diesel, Electric, Hybrid)
  - Color
  - Car Type (SUV, Sedan, Hatchback, etc.)

- **Features**

  - Multi-select checkboxes (AC, GPS, Bluetooth, etc.)

- **Pricing**

  - Base Price per day
  - Security Deposit
  - Additional charges

- **Images**

  - Upload multiple images
  - Set primary image
  - Image preview

- **Location**

  - Address
  - City
  - State
  - Pincode
  - Map picker

- **Availability**

  - Availability calendar
  - Block dates

- **Status**
  - Active/Inactive
  - Approval status

---

## 📅 BOOKING MANAGEMENT

### Booking List Page (`/admin/bookings`)

#### Features:

1. **Booking List Table**

   - Filter by:
     - Status (Pending, Confirmed, Active, Completed, Cancelled, Disputed)
     - Payment Status (Paid, Pending, Failed, Refunded)
     - Date Range
     - User
     - Car
     - Owner
   - Search by booking ID, user name, car name
   - Sort by: Booking Date, Start Date, Amount

2. **Booking Actions**

   - View booking details
   - Edit booking
   - Cancel booking
   - Refund payment
   - View live tracking
   - View payment details
   - Handle disputes
   - Send notifications

3. **Bulk Actions**
   - Export bookings (CSV/Excel)
   - Bulk cancel
   - Bulk refund

### Booking Detail Page (`/admin/bookings/:id`)

#### Information Displayed:

- **Booking Information**

  - Booking ID
  - Booking Date
  - Start Date & Time
  - End Date & Time
  - Duration
  - Status

- **User Information**

  - User profile link
  - Contact details
  - KYC status

- **Car Information**

  - Car details link
  - Owner details
  - Car location

- **Guarantor Information**

  - Guarantor details
  - Guarantor verification status

- **Pricing Details**

  - Base price
  - Dynamic pricing breakdown
  - Discounts applied
  - Total amount
  - Payment method
  - Payment status

- **Payment Details**

  - Transaction ID
  - Payment date
  - Amount paid
  - Payment gateway
  - Refund history

- **Live Tracking**

  - Real-time location map
  - Route history
  - Speed tracking
  - Start/End locations

- **Actions**
  - Cancel booking
  - Process refund
  - Handle dispute
  - Send notification
  - View reviews

---

## 💳 PAYMENT MANAGEMENT

### Payment List Page (`/admin/payments`)

#### Features:

1. **Payment List Table**

   - Filter by:
     - Status (Success, Pending, Failed, Refunded)
     - Payment Gateway (Razorpay, Stripe)
     - Payment Type (Full Payment, Partial Payment, Security Deposit, Refund)
     - Date Range
     - User
     - Booking
   - Search by transaction ID, booking ID, user name
   - Sort by: Date, Amount

2. **Payment Actions**

   - View payment details
   - Process refund
   - Retry failed payment
   - Download invoice
   - View booking details

3. **Payment Statistics**
   - Total revenue
   - Successful payments
   - Failed payments
   - Refunds processed
   - Pending payments

### Payment Detail Page (`/admin/payments/:id`)

#### Information Displayed:

- Transaction ID
- Payment Gateway
- Payment Status
- Amount
- Payment Date
- User Details
- Booking Details
- Payment Method
- Gateway Response
- Refund History
- Invoice Download

---

## 🎁 REFERRAL DASHBOARD

### Referral Dashboard Page (`/admin/referrals`)

#### Features:

1. **Referral Statistics**

   - Total referral codes issued
   - Active referrals
   - Total points distributed
   - Points redeemed
   - Conversion rate

2. **Top Referrers Table**

   - User name
   - Referral code
   - Total referrals
   - Points earned
   - Points redeemed
   - Conversion rate

3. **Referral Activity**

   - Recent referrals
   - Points distribution history
   - Redemption history

4. **Referral Management**
   - View all referral codes
   - Manage points system
   - Set point values
   - Configure rewards

---

## 💰 DYNAMIC PRICING MANAGEMENT

### Pricing Rules Page (`/admin/pricing`)

#### Features:

1. **Pricing Rules Configuration**

   - Base Price Multipliers

     - Weekend multiplier
     - Holiday multiplier
     - Peak hours multiplier
     - Seasonal multiplier

   - Surge Pricing

     - Demand-based surge
     - Last available units surge
     - Festive days surge

   - Discount Rules
     - Early booking discount
     - Long-term rental discount
     - Referral discount
     - Coupon discounts

2. **Holiday Calendar**

   - Add/Edit/Delete holidays
   - Set holiday multipliers
   - Import holidays

3. **Peak Hours Configuration**

   - Set peak hours
   - Set peak hour multipliers
   - Day-wise configuration

4. **Seasonal Pricing**

   - Set seasonal periods
   - Set seasonal multipliers
   - Configure by region

5. **Test Pricing Calculator**
   - Test price calculation
   - Preview pricing for different scenarios

---

## 📈 REPORTS & ANALYTICS

### Reports Page (`/admin/reports`)

#### Available Reports:

1. **Revenue Reports**

   - Daily/Weekly/Monthly/Yearly revenue
   - Revenue by car
   - Revenue by owner
   - Revenue trends
   - Export to PDF/Excel

2. **Booking Reports**

   - Booking statistics
   - Booking trends
   - Popular cars
   - Peak booking times
   - Cancellation rate

3. **User Reports**

   - User growth
   - Active users
   - User retention
   - User demographics

4. **Car Reports**

   - Car utilization
   - Most booked cars
   - Car performance
   - Owner performance

5. **KYC Reports**

   - KYC approval rate
   - KYC processing time
   - Rejection reasons

6. **Payment Reports**

   - Payment success rate
   - Failed transactions
   - Refund reports
   - Payment gateway performance

7. **Referral Reports**

   - Referral conversion
   - Points distribution
   - Top referrers

8. **Custom Reports**
   - Generate custom reports
   - Date range selection
   - Multiple filters
   - Export options

---

## 📍 LIVE TRACKING

### Live Tracking Page (`/admin/tracking`)

#### Features:

1. **Active Bookings Map**

   - Real-time map view
   - All active bookings displayed
   - Click to view booking details
   - Route history

2. **Booking Tracking**

   - Select booking to track
   - Real-time location updates
   - Speed monitoring
   - Route visualization
   - Start/End locations

3. **Tracking History**
   - View past tracking data
   - Download route data
   - Analyze routes

---

## ⚖️ DISPUTE MANAGEMENT

### Dispute List Page (`/admin/disputes`)

#### Features:

1. **Dispute List Table**

   - Filter by:
     - Status (Open, In Progress, Resolved, Closed)
     - Type (Booking, Payment, Car, User)
     - Priority (High, Medium, Low)
   - Search by dispute ID, booking ID, user name

2. **Dispute Actions**
   - View dispute details
   - Assign to admin
   - Add notes
   - Resolve dispute
   - Escalate dispute
   - Close dispute

### Dispute Detail Page (`/admin/disputes/:id`)

#### Information Displayed:

- Dispute ID
- Dispute Type
- Status
- Priority
- Created Date
- User Details
- Booking Details
- Dispute Description
- Evidence/Attachments
- Communication History
- Resolution Notes

#### Actions:

- Assign to admin
- Add notes
- Request more information
- Resolve dispute
- Close dispute

---

## 🎫 COUPON MANAGEMENT

### Coupon List Page (`/admin/coupons`)

#### Features:

1. **Coupon List Table**

   - Filter by:
     - Status (Active, Inactive, Expired)
     - Type (Percentage, Fixed Amount)
   - Search by coupon code

2. **Coupon Actions**
   - Create new coupon
   - Edit coupon
   - Activate/Deactivate
   - Delete coupon
   - View usage statistics

### Create/Edit Coupon Page (`/admin/coupons/new`, `/admin/coupons/:id/edit`)

#### Form Fields:

- Coupon Code
- Description
- Discount Type (Percentage, Fixed Amount)
- Discount Value
- Minimum Purchase Amount
- Maximum Discount Amount
- Valid From Date
- Valid To Date
- Usage Limit (per user, total)
- Applicable Cars (All, Specific)
- Status (Active/Inactive)

---

## ⚙️ SYSTEM SETTINGS

### Settings Page (`/admin/settings`)

#### Tabs:

1. **General Settings**

   - App Name
   - App Logo
   - Support Email
   - Support Phone
   - Terms & Conditions
   - Privacy Policy

2. **Payment Settings**

   - Payment Gateway Configuration
   - Razorpay Keys
   - Stripe Keys
   - Payment Methods Enabled

3. **Email Settings**

   - SMTP Configuration
   - Email Templates
   - Notification Settings

4. **SMS Settings**

   - SMS Gateway Configuration
   - SMS Templates

5. **DigiLocker Settings**

   - OAuth Configuration
   - API Keys

6. **Security Settings**

   - Password Policy
   - Session Timeout
   - Rate Limiting
   - IP Whitelisting

7. **Notification Settings**
   - Push Notification Settings
   - Email Notification Preferences
   - SMS Notification Preferences

---

## 🎨 FRONTEND FLOW & ROUTES

### Route Structure

```
/admin/login                    - Admin Login Page
/admin/signup                   - Admin Signup Page (with invitation code)
/admin                          - Admin Dashboard (protected)
/admin/users                    - User Management List
/admin/users/:id                - User Detail Page
/admin/kyc                      - KYC Management List
/admin/kyc/:id                  - KYC Detail Page
/admin/guarantors               - Guarantor Management List
/admin/guarantors/:id           - Guarantor Detail Page
/admin/cars                     - Car Management List
/admin/cars/new                 - Add New Car
/admin/cars/:id                 - Car Detail Page
/admin/cars/:id/edit            - Edit Car
/admin/bookings                 - Booking Management List
/admin/bookings/:id             - Booking Detail Page
/admin/payments                 - Payment Management List
/admin/payments/:id             - Payment Detail Page
/admin/referrals                - Referral Dashboard
/admin/pricing                  - Dynamic Pricing Management
/admin/reports                  - Reports & Analytics
/admin/tracking                 - Live Tracking
/admin/disputes                 - Dispute Management List
/admin/disputes/:id             - Dispute Detail Page
/admin/coupons                  - Coupon Management List
/admin/coupons/new              - Create Coupon
/admin/coupons/:id/edit         - Edit Coupon
/admin/settings                 - System Settings
/admin/profile                  - Admin Profile
/admin/notifications            - Notifications Center
```

### Navigation Structure

#### Sidebar Navigation (Desktop)

- Dashboard
- User Management
- KYC Management
- Guarantor Management
- Car Management
- Booking Management
- Payment Management
- Referral Dashboard
- Pricing Management
- Reports & Analytics
- Live Tracking
- Dispute Management
- Coupon Management
- System Settings
- Notifications
- Profile
- Logout

#### Mobile Navigation

- Bottom navigation bar with main sections
- Hamburger menu for full navigation

---

## 🧩 COMPONENT STRUCTURE

### Admin Components Directory

```
src/components/admin/
├── layout/
│   ├── AdminLayout.jsx          - Main admin layout with sidebar
│   ├── AdminSidebar.jsx         - Sidebar navigation
│   ├── AdminHeader.jsx          - Top header with notifications
│   └── AdminRoute.jsx           - Route protection (already exists)
├── dashboard/
│   ├── DashboardStats.jsx       - Statistics cards
│   ├── DashboardCharts.jsx      - Charts and graphs
│   ├── RecentActivity.jsx       - Activity feed
│   └── QuickActions.jsx         - Quick action buttons
├── users/
│   ├── UserList.jsx             - User list table
│   ├── UserCard.jsx             - User card component
│   ├── UserFilters.jsx          - Filter component
│   ├── UserDetailTabs.jsx       - User detail tabs
│   └── UserActions.jsx          - Action buttons
├── kyc/
│   ├── KYCList.jsx              - KYC list table
│   ├── KYCDocumentViewer.jsx    - Document viewer
│   ├── KYCApprovalModal.jsx     - Approval modal
│   └── KYCRejectionModal.jsx    - Rejection modal
├── guarantors/
│   ├── GuarantorList.jsx        - Guarantor list
│   └── GuarantorCard.jsx        - Guarantor card
├── cars/
│   ├── CarList.jsx              - Car list grid/table
│   ├── CarCard.jsx              - Car card component
│   ├── CarForm.jsx              - Add/Edit car form
│   ├── CarFilters.jsx           - Filter component
│   └── AvailabilityCalendar.jsx - Availability calendar
├── bookings/
│   ├── BookingList.jsx          - Booking list table
│   ├── BookingCard.jsx          - Booking card
│   ├── BookingFilters.jsx       - Filter component
│   └── BookingDetailTabs.jsx    - Detail tabs
├── payments/
│   ├── PaymentList.jsx          - Payment list
│   ├── PaymentCard.jsx          - Payment card
│   └── RefundModal.jsx          - Refund modal
├── referrals/
│   ├── ReferralStats.jsx        - Statistics
│   ├── TopReferrersTable.jsx    - Top referrers
│   └── ReferralActivity.jsx     - Activity feed
├── pricing/
│   ├── PricingRulesForm.jsx     - Pricing rules form
│   ├── HolidayCalendar.jsx      - Holiday calendar
│   ├── PeakHoursConfig.jsx      - Peak hours config
│   └── PricingCalculator.jsx    - Test calculator
├── reports/
│   ├── ReportFilters.jsx        - Report filters
│   ├── ReportCharts.jsx         - Charts
│   └── ReportExport.jsx         - Export options
├── tracking/
│   ├── TrackingMap.jsx          - Map component
│   ├── ActiveBookingsList.jsx   - Active bookings
│   └── RouteHistory.jsx         - Route history
├── disputes/
│   ├── DisputeList.jsx          - Dispute list
│   ├── DisputeCard.jsx          - Dispute card
│   └── DisputeDetailTabs.jsx    - Detail tabs
├── coupons/
│   ├── CouponList.jsx           - Coupon list
│   ├── CouponForm.jsx           - Add/Edit form
│   └── CouponCard.jsx           - Coupon card
├── settings/
│   ├── SettingsTabs.jsx         - Settings tabs
│   ├── GeneralSettings.jsx      - General settings form
│   ├── PaymentSettings.jsx      - Payment settings
│   └── EmailSettings.jsx        - Email settings
└── common/
    ├── DataTable.jsx             - Reusable data table
    ├── FilterBar.jsx             - Reusable filter bar
    ├── StatusBadge.jsx           - Status badge component
    ├── ActionDropdown.jsx        - Action dropdown
    └── ConfirmationModal.jsx     - Confirmation modal
```

---

## 🔌 API ENDPOINTS REQUIRED

### Authentication

```
POST   /api/admin/auth/login
POST   /api/admin/auth/signup
POST   /api/admin/auth/logout
POST   /api/admin/auth/refresh-token
GET    /api/admin/auth/profile
PUT    /api/admin/auth/profile
PUT    /api/admin/auth/password
```

### Users

```
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
POST   /api/admin/users/:id/suspend
POST   /api/admin/users/:id/activate
POST   /api/admin/users/:id/ban
GET    /api/admin/users/:id/bookings
GET    /api/admin/users/:id/activity
POST   /api/admin/users/bulk-action
GET    /api/admin/users/export
```

### KYC

```
GET    /api/admin/kyc
GET    /api/admin/kyc/:id
POST   /api/admin/kyc/:id/approve
POST   /api/admin/kyc/:id/reject
POST   /api/admin/kyc/:id/request-documents
GET    /api/admin/kyc/:id/download
POST   /api/admin/kyc/bulk-approve
GET    /api/admin/kyc/export
```

### Guarantors

```
GET    /api/admin/guarantors
GET    /api/admin/guarantors/:id
POST   /api/admin/guarantors/:id/verify
POST   /api/admin/guarantors/:id/reject
```

### Cars

```
GET    /api/admin/cars
GET    /api/admin/cars/:id
POST   /api/admin/cars
PUT    /api/admin/cars/:id
DELETE /api/admin/cars/:id
POST   /api/admin/cars/:id/approve
POST   /api/admin/cars/:id/reject
POST   /api/admin/cars/:id/activate
POST   /api/admin/cars/:id/deactivate
GET    /api/admin/cars/:id/bookings
POST   /api/admin/cars/bulk-action
GET    /api/admin/cars/export
```

### Bookings

```
GET    /api/admin/bookings
GET    /api/admin/bookings/:id
PUT    /api/admin/bookings/:id
POST   /api/admin/bookings/:id/cancel
GET    /api/admin/bookings/:id/tracking
GET    /api/admin/bookings/export
```

### Payments

```
GET    /api/admin/payments
GET    /api/admin/payments/:id
POST   /api/admin/payments/:id/refund
POST   /api/admin/payments/:id/retry
GET    /api/admin/payments/:id/invoice
GET    /api/admin/payments/stats
GET    /api/admin/payments/export
```

### Referrals

```
GET    /api/admin/referrals
GET    /api/admin/referrals/stats
GET    /api/admin/referrals/top-referrers
GET    /api/admin/referrals/activity
PUT    /api/admin/referrals/settings
```

### Pricing

```
GET    /api/admin/pricing/rules
PUT    /api/admin/pricing/rules
GET    /api/admin/pricing/holidays
POST   /api/admin/pricing/holidays
PUT    /api/admin/pricing/holidays/:id
DELETE /api/admin/pricing/holidays/:id
GET    /api/admin/pricing/peak-hours
PUT    /api/admin/pricing/peak-hours
POST   /api/admin/pricing/calculate
```

### Reports

```
GET    /api/admin/reports/revenue
GET    /api/admin/reports/bookings
GET    /api/admin/reports/users
GET    /api/admin/reports/cars
GET    /api/admin/reports/kyc
GET    /api/admin/reports/payments
GET    /api/admin/reports/referrals
POST   /api/admin/reports/custom
```

### Tracking

```
GET    /api/admin/tracking/active
GET    /api/admin/tracking/:bookingId
GET    /api/admin/tracking/:bookingId/history
```

### Disputes

```
GET    /api/admin/disputes
GET    /api/admin/disputes/:id
POST   /api/admin/disputes/:id/assign
POST   /api/admin/disputes/:id/resolve
POST   /api/admin/disputes/:id/close
POST   /api/admin/disputes/:id/notes
```

### Coupons

```
GET    /api/admin/coupons
GET    /api/admin/coupons/:id
POST   /api/admin/coupons
PUT    /api/admin/coupons/:id
DELETE /api/admin/coupons/:id
GET    /api/admin/coupons/:id/stats
```

### Settings

```
GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/settings/email-templates
PUT    /api/admin/settings/email-templates/:id
```

### Dashboard

```
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/recent-activity
GET    /api/admin/dashboard/charts
GET    /api/admin/dashboard/notifications
```

---

## 🎨 DESIGN GUIDELINES

### Color Scheme

- Primary: Purple (#3d096d) - matching main app
- Secondary: Complementary colors
- Success: Green
- Warning: Orange
- Error: Red
- Info: Blue

### Typography

- Headings: Bold, clear hierarchy
- Body: Readable font sizes
- Tables: Compact but readable

### Layout

- Sidebar navigation (desktop)
- Top header with notifications
- Main content area
- Responsive design (mobile-first)

### Components

- Consistent button styles
- Form inputs with validation
- Modal dialogs for confirmations
- Toast notifications for actions
- Loading states
- Empty states
- Error states

---

## 🔒 SECURITY CONSIDERATIONS

1. **Authentication**

   - Strong password requirements
   - 2FA support
   - Session management
   - Rate limiting

2. **Authorization**

   - Role-based access control
   - Permission checks
   - Route protection

3. **Data Protection**

   - Sensitive data encryption
   - Secure API calls
   - Input validation
   - XSS prevention

4. **Audit Trail**
   - Log all admin actions
   - Track changes
   - Activity history

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Optimizations

- Bottom navigation
- Collapsible sidebar
- Touch-friendly buttons
- Swipeable tables
- Mobile-optimized forms

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Authentication & Layout

- [ ] Admin login page
- [ ] Admin signup page
- [ ] Admin layout component
- [ ] Admin sidebar
- [ ] Admin header
- [ ] Route protection

### Phase 2: Dashboard

- [ ] Dashboard page
- [ ] Statistics cards
- [ ] Charts
- [ ] Recent activity
- [ ] Quick actions

### Phase 3: User Management

- [ ] User list page
- [ ] User detail page
- [ ] User filters
- [ ] User actions

### Phase 4: KYC Management

- [ ] KYC list page
- [ ] KYC detail page
- [ ] Document viewer
- [ ] Approval/Rejection

### Phase 5: Guarantor Management

- [ ] Guarantor list page
- [ ] Guarantor detail page
- [ ] Verification actions

### Phase 6: Car Management

- [ ] Car list page
- [ ] Car detail page
- [ ] Add/Edit car form
- [ ] Car approval

### Phase 7: Booking Management

- [ ] Booking list page
- [ ] Booking detail page
- [ ] Booking actions

### Phase 8: Payment Management

- [ ] Payment list page
- [ ] Payment detail page
- [ ] Refund processing

### Phase 9: Additional Features

- [ ] Referral dashboard
- [ ] Pricing management
- [ ] Reports
- [ ] Live tracking
- [ ] Dispute management
- [ ] Coupon management
- [ ] Settings

### Phase 10: Polish & Testing

- [ ] Responsive design
- [ ] Error handling
- [ ] Loading states
- [ ] Testing
- [ ] Documentation

---

## 📝 NOTES

- All admin pages should have consistent design
- Use reusable components where possible
- Implement proper error handling
- Add loading states for all async operations
- Include proper validation for all forms
- Ensure mobile responsiveness
- Add proper accessibility features
- Implement proper state management
- Use React Query for server state
- Add proper TypeScript types (if using TypeScript)

---

**This plan provides a comprehensive roadmap for building a full-featured admin panel for the Car Rental Platform. Each section can be implemented incrementally, starting with the most critical features (authentication, dashboard, user management, KYC) and then expanding to other features.**
