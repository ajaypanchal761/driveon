# NewUI Car Booking Platform

A new car booking platform with a modern, mobile-first design matching the provided image specifications.

## Structure

```
newui/
├── pages/
│   └── HomePage.jsx          # Main home page
├── components/
│   ├── Header.jsx             # Red header with location and profile
│   ├── SearchBar.jsx          # Search bar component (integrated in Header)
│   ├── BodyTypeFilter.jsx    # Body type filter buttons
│   ├── TopBrands.jsx          # Top brands section with logos
│   ├── CarCard.jsx            # Individual car card component
│   ├── AvailableCars.jsx     # Available Near You section
│   ├── BottomNavbar.jsx       # Bottom navigation bar
│   └── index.js               # Component exports
├── styles/
│   └── index.css              # Custom styles
├── App.jsx                     # Main app component
└── README.md                   # This file
```

## Features

### Home Page
- **Red Header** (#DC2626) with:
  - Location indicator with white circular icon
  - Profile icon on the right
  - Promotional text: "Enjoy your holidays with our wheels"
  - Search bar that overlaps header and content area

### Body Type Filter
- Horizontal scrollable filter buttons
- Categories: All, Sedan, Hatchback, SUV, Luxury
- "All" is selected by default (black background)

### Top Brands
- Horizontal scrollable brand logos
- "View all" link
- Brand cards with logos and names

### Available Near You
- Car cards with:
  - Car image
  - Car name
  - 5-star rating (yellow stars)
  - Red heart favorite icon
  - Weekly price
  - Red "View" button

### Bottom Navigation
- Fixed bottom navigation bar
- Icons: Home (active/red), Heart, Map, Menu
- Black indicator line below active icon

## Design Specifications

- **Primary Red**: #DC2626
- **Yellow Stars**: #FACC15
- **Text Colors**: Black (#000000), Grey (#9CA3AF)
- **Background**: White (#FFFFFF)
- **Font**: System font stack (San Francisco, Segoe UI, etc.)

## Usage

To use this new UI, import and render the HomePage component:

```jsx
import HomePage from './module/newui/pages/HomePage';

function App() {
  return <HomePage />;
}
```

## Components

All components are self-contained and can be used independently. They follow the exact design specifications from the provided image.

