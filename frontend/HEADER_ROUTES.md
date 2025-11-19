# 📱 HEADER ROUTES - STEP 7

## Routes Available in Header Component

### 🖥️ **DESKTOP HEADER ROUTES**

#### **Logo (Left Side)**
- **`/`** - Home page (clicking logo)

#### **Navigation Menu (Center)**
- **`/`** - Home
- **`/cars`** - Browse Cars
- **`/bookings`** - My Bookings *(only if authenticated)*
- **`/profile`** - Profile *(only if authenticated)*

#### **Right Side (Not Authenticated)**
- **`/login`** - Login button
- **`/register`** - Sign Up button

#### **Right Side (Authenticated)**
- **Heart Icon** - Favorites (toggle, no route - functionality)
- **Profile Picture** - Navigates to `/profile` (or `/login` if not authenticated)

---

### 📱 **MOBILE HEADER ROUTES**

#### **Left Side**
- **Hamburger Menu** - Opens MobileMenu (slide-in menu)

#### **Center**
- **Title** - Dynamic based on current route:
  - `/cars` → "Choose a Car"
  - `/` → "DriveOn"
  - `/profile/*` → "Profile"
  - `/bookings` → "My Bookings"

#### **Right Side**
- **Heart Icon** - Favorites (toggle, no route - functionality)
- **Profile Picture** - Navigates to `/profile` (or `/login` if not authenticated)

#### **Below Header (Search Bar Section)**
- **Location Input** - Currently read-only (placeholder: "Florida, USA")
- **Calendar Button** - Date picker (no route - functionality)
- **Filter Button** - Filter cars (no route - functionality)

---

### 📱 **MOBILE MENU ROUTES** (Hamburger Menu)

#### **Main Menu Items** (Always Visible)
- **`/`** - Home
- **`/cars`** - Browse Cars

#### **Auth Menu Items** (If NOT Authenticated)
- **`/login`** - Login
- **`/register`** - Sign Up

#### **Auth Menu Items** (If Authenticated)
- **`/bookings`** - My Bookings
- **`/profile`** - Profile

#### **Role-Based Menu Items** (If Authenticated)
- **`/admin`** - Admin Dashboard *(only if admin role)*
- **`/owner`** - Owner Dashboard *(only if owner role)*

#### **Actions**
- **Logout** - Logs out user (no route, action only)

---

### 📱 **BOTTOM NAVBAR ROUTES** (Mobile Only)

- **`/`** - Home
- **`/profile`** - Profile *(requires authentication, redirects to login if not)*
- **`/cars`** - Search (Browse Cars)
- **`/bookings`** - Bookings *(requires authentication, redirects to login if not)*

---

## Route Behavior

### **Profile Picture Click:**
- **If authenticated** → Navigates to `/profile`
- **If NOT authenticated** → Navigates to `/login`

### **Dynamic Title:**
The mobile header title changes based on current route:
```javascript
'/cars' or '/cars/:id' → "Choose a Car"
'/' → "DriveOn"
'/profile/*' → "Profile"
'/bookings' → "My Bookings"
```

### **Conditional Routes:**
- **My Bookings** - Only shows if `isAuthenticated === true`
- **Profile** - Only shows if `isAuthenticated === true`
- **Login/Sign Up** - Only shows if `isAuthenticated === false`
- **Admin Dashboard** - Only shows if `userRole === 'admin'`
- **Owner Dashboard** - Only shows if `userRole === 'owner'`

---

## Summary

### **Desktop Header Routes:**
1. `/` - Home (logo + menu)
2. `/cars` - Browse Cars
3. `/bookings` - My Bookings (auth required)
4. `/profile` - Profile (auth required)
5. `/login` - Login (if not authenticated)
6. `/register` - Sign Up (if not authenticated)

### **Mobile Header Routes:**
1. Hamburger → Opens MobileMenu
2. Profile Picture → `/profile` or `/login`
3. Heart Icon → Toggle favorites (no route)

### **Mobile Menu Routes:**
1. `/` - Home
2. `/cars` - Browse Cars
3. `/login` - Login (if not authenticated)
4. `/register` - Sign Up (if not authenticated)
5. `/bookings` - My Bookings (if authenticated)
6. `/profile` - Profile (if authenticated)
7. `/admin` - Admin Dashboard (if admin)
8. `/owner` - Owner Dashboard (if owner)

### **Bottom Navbar Routes:**
1. `/` - Home
2. `/profile` - Profile
3. `/cars` - Search
4. `/bookings` - Bookings

---

## Quick Reference

**Most Common Header Routes:**
- Home: `/`
- Browse Cars: `/cars`
- Profile: `/profile`
- Bookings: `/bookings`
- Login: `/login`
- Register: `/register`

