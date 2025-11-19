# 🗺️ ROUTES REFERENCE GUIDE

## Complete List of All Available Routes

### 🌐 **PUBLIC ROUTES** (No Authentication Required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home Page | Landing page |
| `/login` | Login Page | User login |
| `/register` | Register Page | User registration |
| `/verify-otp` | OTP Verification | OTP verification after registration |
| `/cars` | Car Listing | Browse all cars (with header showing "Choose a Car") |
| `/cars/:id` | Car Details | View specific car details |

**Example URLs:**
- `http://localhost:5173/` - Home
- `http://localhost:5173/login` - Login
- `http://localhost:5173/register` - Register
- `http://localhost:5173/cars` - Car Listing (shows "Choose a Car" in header)
- `http://localhost:5173/cars/123` - Car Details (replace 123 with car ID)

---

### 🔒 **PROTECTED ROUTES** (Require Authentication)

#### **Profile Routes**
| Route | Page | Description |
|-------|------|-------------|
| `/profile` | Profile Dashboard | User profile overview |
| `/profile/complete` | Profile Completion | Complete your profile wizard |
| `/profile/kyc` | KYC Status | View KYC verification status |
| `/profile/guarantor` | Guarantor Management | Manage guarantor |
| `/profile/referrals` | Referral Dashboard | View referral code and points |
| `/profile/settings` | Settings | User settings |

#### **Booking Routes**
| Route | Page | Description |
|-------|------|-------------|
| `/bookings` | Booking History | View all past bookings |
| `/booking/:id/active` | Active Booking | View active booking with tracking |

**Example URLs:**
- `http://localhost:5173/profile` - Profile Dashboard
- `http://localhost:5173/bookings` - Booking History
- `http://localhost:5173/booking/abc123/active` - Active Booking

---

### ✅ **PROFILE COMPLETE ROUTES** (Require 100% Profile Completion)

These routes require both authentication AND complete profile:

| Route | Page | Description |
|-------|------|-------------|
| `/booking/:carId/date-time` | Date & Time Selection | Step 1: Select pickup/drop dates |
| `/booking/:carId/payment-option` | Payment Option | Step 2: Choose payment type |
| `/booking/:carId/guarantor` | Add Guarantor | Step 3: Add guarantor |
| `/booking/:carId/payment` | Payment | Step 4: Complete payment |
| `/booking/:id/confirm` | Booking Confirmation | Booking confirmed page |

**Example URLs:**
- `http://localhost:5173/booking/car123/date-time` - Start booking flow
- `http://localhost:5173/booking/booking456/confirm` - Booking confirmation

---

### 👨‍💼 **ADMIN ROUTES** (Require Admin Role)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Admin Dashboard | Admin overview |
| `/admin/users` | User Management | Manage all users |
| `/admin/kyc` | KYC Management | Approve/reject KYC |
| `/admin/cars` | Car Management | Manage car listings |
| `/admin/bookings` | Booking Management | View all bookings |
| `/admin/pricing` | Pricing Rules | Configure dynamic pricing |
| `/admin/reports` | Reports | Generate reports |

**Example URLs:**
- `http://localhost:5173/admin` - Admin Dashboard
- `http://localhost:5173/admin/users` - User Management

---

### 🚗 **OWNER ROUTES** (Require Owner Role)

| Route | Page | Description |
|-------|------|-------------|
| `/owner` | Owner Dashboard | Owner overview |
| `/owner/cars/new` | Add Car | Add new car listing |
| `/owner/cars/:id/edit` | Edit Car | Edit existing car |
| `/owner/bookings` | Owner Bookings | View bookings for owner's cars |

**Example URLs:**
- `http://localhost:5173/owner` - Owner Dashboard
- `http://localhost:5173/owner/cars/new` - Add Car
- `http://localhost:5173/owner/cars/123/edit` - Edit Car

---

### ❌ **ERROR ROUTES**

| Route | Page | Description |
|-------|------|-------------|
| `/*` (any invalid route) | 404 Not Found | Page not found error |

---

## 🔐 **Route Access Requirements**

### **Public Routes** (No Requirements)
- ✅ Anyone can access
- No login needed

### **Protected Routes** (Authentication Required)
- ✅ Must be logged in
- ❌ Redirects to `/login` if not authenticated

### **Profile Complete Routes** (100% Profile Required)
- ✅ Must be logged in
- ✅ Must have complete profile
- ❌ Redirects to `/profile/complete` if profile incomplete

### **Admin Routes** (Admin Role Required)
- ✅ Must be logged in
- ✅ Must have admin role
- ❌ Redirects to `/` if not admin

### **Owner Routes** (Owner Role Required)
- ✅ Must be logged in
- ✅ Must have owner role
- ❌ Redirects to `/` if not owner

---

## 📱 **Mobile View Routes**

All routes work on mobile, but the header will show:
- **`/cars`** → Header shows "Choose a Car" (matches your design)
- **`/`** → Header shows "DriveOn"
- **`/profile`** → Header shows "Profile"
- **`/bookings`** → Header shows "My Bookings"

---

## 🧪 **Testing Routes**

### **To Test Public Routes:**
1. Open browser: `http://localhost:5173/`
2. Navigate to: `/login`, `/register`, `/cars`

### **To Test Protected Routes:**
1. First login at `/login`
2. Set in localStorage: `authToken` = "test-token"
3. Navigate to: `/profile`, `/bookings`

### **To Test Admin Routes:**
1. Login
2. Set in localStorage: 
   - `authToken` = "test-token"
   - `userRole` = "admin"
3. Navigate to: `/admin`

### **To Test Owner Routes:**
1. Login
2. Set in localStorage:
   - `authToken` = "test-token"
   - `userRole` = "owner"
3. Navigate to: `/owner`

---

## 🎯 **Quick Access Routes**

**Most Common Routes:**
- `/` - Home
- `/cars` - Car Listing (shows "Choose a Car" header)
- `/login` - Login
- `/register` - Register
- `/profile` - Profile (after login)
- `/bookings` - Bookings (after login)

---

## 📝 **Notes**

- All routes use React Router v6
- Routes are lazy-loaded for better performance
- Route guards automatically redirect unauthorized users
- Mobile header title changes based on current route
- Bottom navbar (mobile) highlights active route

