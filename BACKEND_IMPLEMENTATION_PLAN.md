# 🚀 DRIVEON - COMPLETE BACKEND IMPLEMENTATION PLAN

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [External Services Integration](#external-services-integration)
6. [Authentication & Authorization](#authentication--authorization)
7. [Core Features Implementation](#core-features-implementation)
8. [File Structure](#file-structure)
9. [Implementation Phases](#implementation-phases)
10. [Security Considerations](#security-considerations)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Plan](#deployment-plan)

---

## 1. PROJECT OVERVIEW

### Application Type
Car Rental Platform (DriveOn) - Full-stack MERN application

### Core Requirements
- User Registration & Authentication (OTP-based)
- Profile Management (100% completion required for booking)
- KYC Verification via DigiLocker
- Car Listing & Management
- Advanced Filtering System
- Dynamic Pricing Engine
- Booking Management
- Payment Processing (Razorpay)
- Guarantor System
- Referral System
- Live GPS Tracking
- Admin Dashboard
- Owner Dashboard
- Reviews & Ratings

### User Roles
1. **User** - Regular customer who books cars
2. **Owner** - Car owner who lists cars
3. **Guarantor** - Guarantor for bookings
4. **Admin** - Platform administrator

---

## 2. TECHNOLOGY STACK

### Backend Framework
- **Node.js** (v18+)
- **Express.js** (v4.18+)
- **TypeScript** (Optional, but recommended)

### Database
- **MongoDB** (v6+) - Primary database
- **Mongoose** (v7+) - ODM

### Authentication
- **JWT** (jsonwebtoken) - Access tokens
- **JWT** - Refresh tokens
- **OTP** - SMS/Email OTP verification
- **bcrypt** - Password hashing

### External Services
- **Razorpay** - Payment gateway
- **DigiLocker API** - KYC verification
- **Twilio/SMS Gateway** - OTP delivery
- **Nodemailer/SendGrid** - Email service
- **Socket.io** - Real-time tracking

### File Storage
- **Cloudinary** or **AWS S3** - Image storage
- **Multer** - File upload handling

### Real-time Communication
- **Socket.io** - WebSocket for live tracking

### Additional Libraries
- **express-validator** - Request validation
- **helmet** - Security headers
- **cors** - CORS configuration
- **dotenv** - Environment variables
- **winston/morgan** - Logging
- **node-cron** - Scheduled tasks
- **express-rate-limit** - Rate limiting

---

## 3. DATABASE SCHEMA

### 3.1 User Model (`users` collection)
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  phone: String (unique, required),
  password: String (hashed),
  name: String,
  age: Number,
  gender: String (enum: ['male', 'female', 'other']),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String (default: 'India')
  },
  profilePhoto: String (URL),
  role: String (enum: ['user', 'owner', 'guarantor', 'admin'], default: 'user'),
  profileComplete: Boolean (default: false),
  profileCompletionPercentage: Number (0-100),
  isEmailVerified: Boolean (default: false),
  isPhoneVerified: Boolean (default: false),
  referralCode: String (unique, auto-generated),
  referredBy: ObjectId (ref: 'User'),
  points: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 KYC Model (`kycs` collection)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', unique),
  aadhaar: {
    number: String,
    verified: Boolean (default: false),
    verifiedAt: Date,
    digiLockerRef: String,
    documentUrl: String
  },
  pan: {
    number: String,
    verified: Boolean (default: false),
    verifiedAt: Date,
    digiLockerRef: String,
    documentUrl: String
  },
  drivingLicense: {
    number: String,
    verified: Boolean (default: false),
    verifiedAt: Date,
    digiLockerRef: String,
    documentUrl: String,
    expiryDate: Date
  },
  overallStatus: String (enum: ['pending', 'partial', 'verified'], default: 'pending'),
  submittedAt: Date,
  verifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.3 Car Model (`cars` collection)
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: 'User'),
  brand: String (required),
  model: String (required),
  year: Number,
  seats: Number (required),
  transmission: String (enum: ['manual', 'automatic'], required),
  fuelType: String (enum: ['petrol', 'diesel', 'electric', 'hybrid'], required),
  color: String (required),
  carType: String (enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon']),
  features: [String], // ['GPS', 'Bluetooth', 'Sunroof', etc.]
  basePrice: Number (required, per day),
  images: [String] (URLs),
  location: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    address: String
  },
  availability: {
    availableFrom: Date,
    availableTo: Date,
    blockedDates: [Date] // Dates when car is booked
  },
  rating: Number (default: 0, 0-5),
  totalReviews: Number (default: 0),
  status: String (enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.4 Booking Model (`bookings` collection)
```javascript
{
  _id: ObjectId,
  bookingId: String (unique, auto-generated, e.g., 'BK001234'),
  userId: ObjectId (ref: 'User'),
  carId: ObjectId (ref: 'Car'),
  ownerId: ObjectId (ref: 'User'),
  guarantorId: ObjectId (ref: 'User'),
  pickupDate: Date (required),
  pickupTime: String (required),
  dropDate: Date (required),
  dropTime: String (required),
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dropLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  duration: Number (days),
  pricing: {
    basePrice: Number,
    totalDays: Number,
    weekendMultiplier: Number,
    holidayMultiplier: Number,
    timeOfDayMultiplier: Number,
    demandSurge: Number,
    durationDiscount: Number,
    subtotal: Number,
    securityDeposit: Number,
    totalPrice: Number
  },
  paymentType: String (enum: ['full', 'partial']),
  paymentStatus: String (enum: ['pending', 'partial', 'paid', 'refunded', 'failed']),
  paidAmount: Number (default: 0),
  remainingAmount: Number,
  securityDeposit: Number,
  status: String (enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'], default: 'pending'),
  cancellationReason: String,
  cancelledAt: Date,
  trackingEnabled: Boolean (default: false),
  tripStartedAt: Date,
  tripEndedAt: Date,
  reviewId: ObjectId (ref: 'Review'),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.5 Payment Model (`payments` collection)
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking'),
  userId: ObjectId (ref: 'User'),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number (required),
  currency: String (default: 'INR'),
  paymentType: String (enum: ['full', 'partial', 'security_deposit', 'remaining']),
  status: String (enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending'),
  paymentMethod: String (enum: ['razorpay', 'card', 'upi', 'netbanking', 'wallet']),
  refundAmount: Number,
  refundedAt: Date,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.6 Guarantor Model (`guarantors` collection)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'), // User who added guarantor
  guarantorId: ObjectId (ref: 'User'), // Guarantor user
  name: String,
  phone: String,
  email: String,
  relationship: String,
  status: String (enum: ['invited', 'pending_kyc', 'verified', 'rejected'], default: 'invited'),
  inviteToken: String (unique),
  invitedAt: Date,
  verifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3.7 Review Model (`reviews` collection)
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking', unique),
  userId: ObjectId (ref: 'User'),
  carId: ObjectId (ref: 'Car'),
  rating: Number (required, 1-5),
  title: String,
  comment: String,
  images: [String],
  helpfulCount: Number (default: 0),
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.8 Tracking Model (`trackings` collection)
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking'),
  location: {
    lat: Number (required),
    lng: Number (required),
    address: String
  },
  speed: Number (km/h),
  heading: Number (degrees),
  accuracy: Number (meters),
  timestamp: Date (required),
  createdAt: Date
}
```

### 3.9 Referral Model (`referrals` collection)
```javascript
{
  _id: ObjectId,
  referrerId: ObjectId (ref: 'User'), // User who referred
  referredId: ObjectId (ref: 'User'), // User who was referred
  referralCode: String,
  pointsEarned: Number,
  status: String (enum: ['pending', 'active', 'completed']),
  signupDate: Date,
  tripsCompleted: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.10 Pricing Rules Model (`pricing_rules` collection)
```javascript
{
  _id: ObjectId,
  name: String,
  type: String (enum: ['weekend', 'holiday', 'surge', 'duration', 'time']),
  multiplier: Number,
  startDate: Date,
  endDate: Date,
  daysOfWeek: [Number], // 0-6 (Sunday-Saturday)
  timeRange: {
    start: String, // HH:mm
    end: String // HH:mm
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.11 Coupon Model (`coupons` collection)
```javascript
{
  _id: ObjectId,
  code: String (unique, uppercase),
  type: String (enum: ['percentage', 'fixed']),
  value: Number,
  minAmount: Number,
  maxDiscount: Number,
  validFrom: Date,
  validTo: Date,
  usageLimit: Number,
  usedCount: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 3.12 Admin Settings Model (`admin_settings` collection)
```javascript
{
  _id: ObjectId,
  key: String (unique),
  value: Mixed,
  description: String,
  updatedBy: ObjectId (ref: 'User'),
  updatedAt: Date
}
```

### 3.13 OTP Model (`otps` collection)
```javascript
{
  _id: ObjectId,
  identifier: String (email or phone),
  otp: String (6 digits),
  type: String (enum: ['email', 'phone']),
  purpose: String (enum: ['register', 'login', 'reset_password']),
  expiresAt: Date,
  isUsed: Boolean (default: false),
  createdAt: Date
}
```

---

## 4. API ENDPOINTS

### 4.1 Authentication Routes (`/api/auth`)
```
POST   /register              - Register new user (send OTP)
POST   /verify-otp            - Verify OTP and complete registration
POST   /login                  - Login user (send OTP)
POST   /send-login-otp         - Send OTP for login
POST   /refresh-token          - Refresh access token
POST   /logout                 - Logout user
POST   /forgot-password        - Send password reset OTP
POST   /reset-password         - Reset password with OTP
```

### 4.2 User Routes (`/api/user`)
```
GET    /profile                - Get user profile
PUT    /profile                - Update user profile
POST   /upload-photo           - Upload profile photo
GET    /kyc-status             - Get KYC verification status
GET    /referral-code          - Get user's referral code
GET    /points                 - Get user points
GET    /referrals              - Get referral history
```

### 4.3 KYC Routes (`/api/kyc`)
```
GET    /digilocker-auth        - Initiate DigiLocker OAuth
GET    /callback               - Handle DigiLocker callback
GET    /status                 - Get KYC status
POST   /verify-document        - Manually verify document (admin)
```

### 4.4 Car Routes (`/api/cars`)
```
GET    /                       - Get cars list (with filters, pagination)
GET    /:id                    - Get car details
GET    /filters                - Get available filters (brands, models, etc.)
GET    /:id/availability       - Check car availability for dates
GET    /:id/reviews            - Get car reviews
POST   /                       - Create car (owner)
PUT    /:id                    - Update car (owner)
DELETE /:id                    - Delete car (owner)
POST   /:id/images             - Upload car images (owner)
```

### 4.5 Booking Routes (`/api/booking`)
```
POST   /                       - Create new booking
GET    /:id                    - Get booking details
GET    /                       - Get user bookings (with filters)
POST   /:id/confirm            - Confirm booking
POST   /:id/cancel             - Cancel booking
POST   /:id/start              - Start trip (enable tracking)
POST   /:id/end                - End trip (disable tracking)
GET    /:id/tracking           - Get live tracking data
```

### 4.6 Payment Routes (`/api/payment`)
```
POST   /create-order           - Create Razorpay order
POST   /verify                 - Verify payment
POST   /refund                  - Process refund
GET    /:id                    - Get payment details
GET    /                       - Get payment history
```

### 4.7 Guarantor Routes (`/api/guarantor`)
```
POST   /add                    - Add guarantor (send invite)
GET    /status                 - Get guarantor status
POST   /accept-invite          - Accept guarantor invite
POST   /remove                 - Remove guarantor
```

### 4.8 Pricing Routes (`/api/pricing`)
```
POST   /calculate               - Calculate dynamic price
GET    /rules                  - Get pricing rules (admin)
POST   /rules                  - Create pricing rule (admin)
PUT    /rules/:id              - Update pricing rule (admin)
DELETE /rules/:id              - Delete pricing rule (admin)
```

### 4.9 Review Routes (`/api/reviews`)
```
POST   /                       - Create review
GET    /:id                    - Get review details
GET    /car/:carId             - Get reviews for car
PUT    /:id                    - Update review
DELETE /:id                    - Delete review
POST   /:id/helpful            - Mark review as helpful
```

### 4.10 Admin Routes (`/api/admin`)
```
// Users
GET    /users                  - Get all users (with filters)
GET    /users/:id              - Get user details
PUT    /users/:id              - Update user
DELETE /users/:id              - Delete/suspend user

// KYC
GET    /kyc                    - Get all KYC requests
GET    /kyc/pending            - Get pending KYC
PUT    /kyc/:id/approve        - Approve KYC
PUT    /kyc/:id/reject         - Reject KYC

// Guarantors
GET    /guarantors             - Get all guarantors
GET    /guarantors/pending     - Get pending guarantors

// Cars
GET    /cars                   - Get all cars
GET    /cars/pending           - Get pending car approvals
PUT    /cars/:id/approve       - Approve car
PUT    /cars/:id/reject        - Reject car
PUT    /cars/:id/suspend       - Suspend car

// Bookings
GET    /bookings               - Get all bookings
GET    /bookings/pending       - Get pending bookings
GET    /bookings/active        - Get active bookings
PUT    /bookings/:id/status    - Update booking status

// Payments
GET    /payments               - Get all payments
GET    /payments/pending       - Get pending payments
GET    /payments/failed        - Get failed payments

// Tracking
GET    /tracking               - Get all active tracking
GET    /tracking/:bookingId    - Get tracking for booking

// Referrals
GET    /referrals              - Get referral statistics
GET    /referrals/top-referrers - Get top referrers

// Pricing
GET    /pricing                - Get pricing management data
POST   /pricing/holiday        - Add holiday pricing
POST   /pricing/surge         - Add surge pricing

// Coupons
GET    /coupons                - Get all coupons
POST   /coupons                - Create coupon
PUT    /coupons/:id            - Update coupon
DELETE /coupons/:id            - Delete coupon

// Reports
GET    /reports/users          - User reports
GET    /reports/bookings       - Booking reports
GET    /reports/revenue        - Revenue reports
GET    /reports/custom         - Custom reports

// Settings
GET    /settings               - Get admin settings
PUT    /settings               - Update admin settings
```

### 4.11 Owner Routes (`/api/owner`)
```
GET    /dashboard              - Get owner dashboard stats
GET    /cars                   - Get owner's cars
GET    /bookings               - Get owner's bookings
PUT    /bookings/:id/status    - Update booking status
GET    /revenue                - Get revenue statistics
```

### 4.12 Tracking Routes (`/api/tracking`)
```
POST   /                       - Send location update (mobile app)
GET    /:bookingId             - Get tracking data for booking
GET    /:bookingId/live        - Get live tracking (WebSocket)
```

---

## 5. EXTERNAL SERVICES INTEGRATION

### 5.1 Razorpay Payment Gateway
**Service:** Payment processing
**Integration Points:**
- Create payment order
- Verify payment signature
- Process refunds
- Webhook handling for payment status

**Required:**
- Razorpay Key ID
- Razorpay Key Secret
- Webhook secret

**Endpoints to implement:**
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/webhook` - Handle Razorpay webhooks
- `POST /api/payment/refund` - Process refund

### 5.2 DigiLocker API
**Service:** KYC document verification
**Integration Points:**
- OAuth2 authentication
- Fetch Aadhaar details
- Fetch PAN details
- Fetch Driving License details

**Required:**
- DigiLocker Client ID
- DigiLocker Client Secret
- Redirect URI
- API endpoints

**Endpoints to implement:**
- `GET /api/kyc/digilocker-auth` - Initiate OAuth
- `GET /api/kyc/callback` - Handle OAuth callback
- Internal service to fetch documents

### 5.3 SMS Service (OTP)
**Service:** Send OTP via SMS
**Options:**
- Twilio
- AWS SNS
- MSG91
- TextLocal

**Required:**
- API Key/Secret
- Sender ID
- Template ID (if using template)

**Implementation:**
- Service to send OTP
- Store OTP in database with expiry
- Verify OTP

### 5.4 Email Service
**Service:** Send emails (OTP, notifications, invites)
**Options:**
- Nodemailer (SMTP)
- SendGrid
- AWS SES
- Mailgun

**Required:**
- SMTP credentials or API key
- Email templates

**Emails to send:**
- Registration OTP
- Login OTP
- Password reset OTP
- Guarantor invite
- Booking confirmation
- Payment receipts
- Admin notifications

### 5.5 Cloud Storage (Images)
**Service:** Store car images, profile photos
**Options:**
- Cloudinary (recommended)
- AWS S3
- Google Cloud Storage

**Required:**
- API Key
- API Secret
- Cloud name/bucket name

**Implementation:**
- Upload service
- Image optimization
- CDN URLs

### 5.6 Socket.io (Real-time Tracking)
**Service:** WebSocket for live tracking
**Implementation:**
- Socket.io server
- Room-based connections (per booking)
- Location update broadcasting
- Connection management

---

## 6. AUTHENTICATION & AUTHORIZATION

### 6.1 JWT Token Strategy
- **Access Token:** Short-lived (15 minutes), contains user ID and role
- **Refresh Token:** Long-lived (7 days), stored in database
- **Token Storage:** HTTP-only cookies (recommended) or localStorage

### 6.2 OTP Flow
1. User requests OTP (register/login)
2. Generate 6-digit OTP
3. Store in database with expiry (5 minutes)
4. Send via SMS/Email
5. User submits OTP
6. Verify OTP
7. Issue JWT tokens

### 6.3 Role-Based Access Control (RBAC)
- **User:** Can book cars, manage profile
- **Owner:** Can manage cars, view bookings
- **Guarantor:** Can accept invites, complete KYC
- **Admin:** Full access to all resources

### 6.4 Middleware
- `authenticate` - Verify JWT token
- `authorize` - Check user role
- `profileComplete` - Check if profile is 100% complete
- `kycVerified` - Check if KYC is verified
- `guarantorVerified` - Check if guarantor is verified

---

## 7. CORE FEATURES IMPLEMENTATION

### 7.1 Dynamic Pricing Engine
**Logic:**
1. Base price (per day)
2. Weekend multiplier (20% surcharge)
3. Holiday multiplier (from pricing_rules)
4. Time of day multiplier (peak hours)
5. Demand surge (based on availability)
6. Duration discount (longer rentals)
7. Security deposit (10% of total)

**Implementation:**
- Service: `pricingService.calculatePrice()`
- Input: carId, pickupDate, dropDate, pickupTime, dropTime
- Output: Detailed pricing breakdown

### 7.2 Advanced Filtering System
**Filters:**
- Brand, Model
- Seats, Transmission, Fuel Type
- Color, Car Type
- Price Range
- Rating
- Location (city, coordinates)
- Availability (date range)
- Features

**Implementation:**
- MongoDB aggregation pipeline
- Indexes on filterable fields
- Geospatial queries for location

### 7.3 Guarantor Flow
1. User adds guarantor (phone/email)
2. Generate invite token
3. Send invite via SMS/Email
4. Guarantor clicks link, registers
5. Guarantor completes KYC
6. Link guarantor to user
7. User can now book

### 7.4 Referral System
**Points:**
- 50 points for signup via referral
- 50 points per completed trip
- Points usable as discount (1 point = ₹1)

**Implementation:**
- Auto-generate referral code on registration
- Track referrals in `referrals` collection
- Award points on signup and trip completion
- Apply points discount during payment

### 7.5 Live Tracking
**Flow:**
1. User starts trip → Enable tracking
2. Mobile app sends location every 10 seconds
3. Store in `trackings` collection
4. Broadcast via Socket.io to admin/owner
5. User ends trip → Disable tracking

**Implementation:**
- Socket.io server
- Location update endpoint
- Real-time broadcasting
- Historical tracking data

---

## 8. FILE STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── razorpay.js           # Razorpay config
│   │   ├── digilocker.js         # DigiLocker config
│   │   ├── cloudinary.js         # Cloudinary config
│   │   └── socket.js             # Socket.io config
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── KYC.js
│   │   ├── Car.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Guarantor.js
│   │   ├── Review.js
│   │   ├── Tracking.js
│   │   ├── Referral.js
│   │   ├── PricingRule.js
│   │   ├── Coupon.js
│   │   ├── AdminSetting.js
│   │   └── OTP.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── kyc.routes.js
│   │   ├── car.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── guarantor.routes.js
│   │   ├── pricing.routes.js
│   │   ├── review.routes.js
│   │   ├── admin.routes.js
│   │   ├── owner.routes.js
│   │   └── tracking.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── kyc.controller.js
│   │   ├── car.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   ├── guarantor.controller.js
│   │   ├── pricing.controller.js
│   │   ├── review.controller.js
│   │   ├── admin.controller.js
│   │   ├── owner.controller.js
│   │   └── tracking.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── otp.service.js
│   │   ├── email.service.js
│   │   ├── sms.service.js
│   │   ├── razorpay.service.js
│   │   ├── digilocker.service.js
│   │   ├── cloudinary.service.js
│   │   ├── pricing.service.js
│   │   ├── referral.service.js
│   │   └── tracking.service.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateOTP.js
│   │   ├── generateReferralCode.js
│   │   ├── calculatePrice.js
│   │   ├── logger.js
│   │   └── constants.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── car.validator.js
│   │   ├── booking.validator.js
│   │   └── payment.validator.js
│   │
│   ├── socket/
│   │   ├── socket.handlers.js
│   │   └── tracking.handlers.js
│   │
│   ├── jobs/
│   │   ├── cleanupOTP.js        # Cron job to clean expired OTPs
│   │   ├── updateBookingStatus.js # Auto-update booking status
│   │   └── sendReminders.js      # Send booking reminders
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── BACKEND_IMPLEMENTATION_PLAN.md
```

---

## 9. IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup (Node.js, Express, MongoDB)
- [ ] Database connection
- [ ] Environment configuration
- [ ] Basic authentication (JWT)
- [ ] User model and CRUD
- [ ] OTP service (SMS/Email)
- [ ] Error handling middleware

### Phase 2: Core Features (Week 3-4)
- [ ] Profile management
- [ ] KYC model and basic flow
- [ ] Car model and CRUD
- [ ] Image upload (Cloudinary)
- [ ] Car filtering system
- [ ] Booking model and basic flow

### Phase 3: Advanced Features (Week 5-6)
- [ ] Dynamic pricing engine
- [ ] Payment integration (Razorpay)
- [ ] Guarantor system
- [ ] Referral system
- [ ] Review system
- [ ] Admin routes (basic)

### Phase 4: Real-time & Tracking (Week 7)
- [ ] Socket.io setup
- [ ] Live tracking implementation
- [ ] Location update service
- [ ] Real-time notifications

### Phase 5: External Integrations (Week 8)
- [ ] DigiLocker OAuth integration
- [ ] Document fetching and verification
- [ ] Email service integration
- [ ] SMS service integration

### Phase 6: Admin & Owner Dashboards (Week 9)
- [ ] Admin dashboard APIs
- [ ] Owner dashboard APIs
- [ ] Reports and analytics
- [ ] Coupon management
- [ ] Pricing rules management

### Phase 7: Testing & Optimization (Week 10)
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Performance optimization
- [ ] Security audit

### Phase 8: Deployment (Week 11)
- [ ] Production environment setup
- [ ] Database migration
- [ ] CI/CD pipeline
- [ ] Monitoring and logging
- [ ] Documentation

---

## 10. SECURITY CONSIDERATIONS

### 10.1 Authentication Security
- JWT tokens with short expiry
- Refresh token rotation
- OTP expiry (5 minutes)
- Rate limiting on OTP requests
- Password hashing (bcrypt, salt rounds: 10)

### 10.2 API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (express-rate-limit)
- Input validation (express-validator)
- SQL injection prevention (MongoDB is safe, but validate inputs)
- XSS prevention

### 10.3 Data Security
- Encrypt sensitive data (PII)
- Secure file uploads (validate file types, size limits)
- Environment variables for secrets
- Database connection encryption

### 10.4 Payment Security
- Razorpay webhook signature verification
- Never store card details
- Secure payment flow
- Refund policy implementation

---

## 11. TESTING STRATEGY

### 11.1 Unit Tests
- Service functions
- Utility functions
- Middleware functions

### 11.2 Integration Tests
- API endpoints
- Database operations
- External service integrations

### 11.3 Test Tools
- Jest (testing framework)
- Supertest (API testing)
- MongoDB Memory Server (in-memory DB)

---

## 12. DEPLOYMENT PLAN

### 12.1 Environment Setup
- **Development:** Local MongoDB, local services
- **Staging:** Cloud MongoDB, test payment gateway
- **Production:** Cloud MongoDB, production payment gateway

### 12.2 Hosting Options
- **Backend:** Heroku, AWS EC2, DigitalOcean, Railway
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary or AWS S3

### 12.3 Environment Variables
```env
# Server
NODE_ENV=production
PORT=5000
API_BASE_URL=https://api.driveon.com

# Database
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# DigiLocker
DIGILOCKER_CLIENT_ID=...
DIGILOCKER_CLIENT_SECRET=...
DIGILOCKER_REDIRECT_URI=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# SMS
SMS_API_KEY=...
SMS_SENDER_ID=...

# Email
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASS=...

# Socket.io
SOCKET_IO_CORS_ORIGIN=...
```

---

## 📝 NOTES

1. **API Response Format:**
   ```json
   {
     "success": true,
     "message": "Operation successful",
     "data": {},
     "error": null
   }
   ```

2. **Error Response Format:**
   ```json
   {
     "success": false,
     "message": "Error message",
     "data": null,
     "error": {
       "code": "ERROR_CODE",
       "details": {}
     }
   }
   ```

3. **Pagination Format:**
   ```json
   {
     "data": [],
     "pagination": {
       "page": 1,
       "limit": 10,
       "total": 100,
       "totalPages": 10
     }
   }
   ```

---

## ✅ NEXT STEPS

1. Review this plan
2. Confirm technology stack
3. Set up development environment
4. Start with Phase 1 implementation
5. Regular progress reviews

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-20  
**Status:** Ready for Review

