# 📱 WHERE TO REVIEW HEADER & BOTTOM NAVBAR

## Routes to Review Header and Bottom Navbar Design

The **Header** and **Bottom Navbar** are visible on **ALL pages** (they're part of PageLayout), but here are the best routes to review them:

---

## 🎯 **BEST ROUTES TO REVIEW DESIGN**

### 1. **`/cars` - Car Listing Page** ⭐ **RECOMMENDED**
**URL:** `http://localhost:5173/cars`

**Why this route:**
- ✅ Shows **"Choose a Car"** in mobile header (exactly like your design)
- ✅ Shows location input, calendar button, filter button below header
- ✅ Shows bottom navbar
- ✅ Perfect match to your design image

**What you'll see:**
- Mobile Header: Hamburger, "Choose a Car" title, Heart icon, Profile picture
- Search Bar: Location input, Orange calendar button, White filter button
- Bottom Navbar: Home, Profile, Search, Bookings

---

### 2. **`/` - Home Page**
**URL:** `http://localhost:5173/`

**Why this route:**
- ✅ Shows header with "DriveOn" title
- ✅ Shows bottom navbar
- ✅ Clean page to review layout

**What you'll see:**
- Mobile Header: Hamburger, "DriveOn" title, Heart icon, Profile picture
- Bottom Navbar: Home, Profile, Search, Bookings

---

### 3. **`/profile` - Profile Page** (if logged in)
**URL:** `http://localhost:5173/profile`

**Why this route:**
- ✅ Shows header with "Profile" title
- ✅ Shows bottom navbar
- ✅ Shows how header adapts to different pages

**What you'll see:**
- Mobile Header: Hamburger, "Profile" title, Heart icon, Profile picture
- Bottom Navbar: Home, Profile (active), Search, Bookings

---

### 4. **`/bookings` - Bookings Page** (if logged in)
**URL:** `http://localhost:5173/bookings`

**Why this route:**
- ✅ Shows header with "My Bookings" title
- ✅ Shows bottom navbar
- ✅ Shows active state on bottom navbar

**What you'll see:**
- Mobile Header: Hamburger, "My Bookings" title, Heart icon, Profile picture
- Bottom Navbar: Home, Profile, Search, Bookings (active)

---

## 📱 **MOBILE VIEW** (0-767px width)

### To See Mobile Header:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android, etc.)
4. Navigate to: **`http://localhost:5173/cars`**

**You'll see:**
- ✅ Dark purple header (#3d096d)
- ✅ Hamburger menu (left)
- ✅ "Choose a Car" title (centered)
- ✅ Heart icon (right)
- ✅ Profile picture (right)
- ✅ Location input + Calendar + Filter buttons (below header)
- ✅ Bottom navbar (fixed at bottom)

---

## 🖥️ **DESKTOP VIEW** (768px+ width)

### To See Desktop Header:
1. Open browser in desktop view (or resize to 1024px+)
2. Navigate to: **`http://localhost:5173/cars`**

**You'll see:**
- ✅ Horizontal navbar (purple background #3d096d)
- ✅ Logo (left)
- ✅ Navigation menu (center)
- ✅ User menu (right)
- ✅ Footer at bottom
- ✅ NO bottom navbar (hidden on desktop)

---

## 🧪 **QUICK TEST STEPS**

### Step 1: Start Dev Server
```bash
cd frontend
npm run dev
```

### Step 2: Open Browser
Open: `http://localhost:5173/cars`

### Step 3: Test Mobile View
1. Press **F12** (open DevTools)
2. Press **Ctrl+Shift+M** (toggle device toolbar)
3. Select **iPhone 12 Pro** or any mobile device
4. You'll see the mobile header and bottom navbar

### Step 4: Test Desktop View
1. Close device toolbar (or resize browser to 1024px+)
2. You'll see desktop navbar and footer
3. Bottom navbar will be hidden

---

## 📍 **SPECIFIC ROUTES SUMMARY**

| Route | Mobile Header Title | Best For Reviewing |
|-------|-------------------|-------------------|
| `/cars` | "Choose a Car" | ⭐ **Best - Matches your design** |
| `/` | "DriveOn" | Home page layout |
| `/profile` | "Profile" | Profile page layout |
| `/bookings` | "My Bookings" | Bookings page layout |
| `/login` | "DriveOn" | Auth pages (header still visible) |
| `/register` | "DriveOn" | Auth pages (header still visible) |

---

## ✅ **WHAT TO CHECK**

### Mobile Header (on `/cars` route):
- [ ] Dark purple background (#3d096d)
- [ ] Hamburger menu icon (left, white)
- [ ] "Choose a Car" title (centered, white, large)
- [ ] Heart icon (right, white)
- [ ] Profile picture (right, circular)
- [ ] Location input (white background, below header)
- [ ] Orange calendar button (below header)
- [ ] White filter button (below header)

### Bottom Navbar (Mobile Only):
- [ ] Fixed at bottom
- [ ] 4 icons: Home, Profile, Search, Bookings
- [ ] Active state highlighting
- [ ] Touch-friendly (44x44px)

### Desktop Header:
- [ ] Purple background (#3d096d)
- [ ] Logo (left)
- [ ] Navigation menu (center)
- [ ] User menu (right)

### Desktop Footer:
- [ ] Purple background (#3d096d)
- [ ] Multiple columns
- [ ] Links and social media

---

## 🎯 **RECOMMENDED ROUTE TO START**

**Go to:** `http://localhost:5173/cars`

This route shows:
- ✅ Mobile header exactly like your design
- ✅ "Choose a Car" title
- ✅ Location, Calendar, Filter buttons
- ✅ Bottom navbar
- ✅ Perfect for reviewing the design

