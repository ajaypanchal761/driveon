# Testing Module HomePage

## How to Test

### Option 1: Test on Home Route (Currently Active)
The module HomePage is currently set as the home page (`/`). Just run:

```bash
cd frontend
npm run dev
```

Then open: `http://localhost:5173/`

### Option 2: Test on Separate Route
You can also test on a separate route: `http://localhost:5173/module-test`

## What to Check

1. **Header**: 
   - Logo with black circle background
   - Bell icon with red badge showing "2"
   - Profile picture

2. **Search Bar**:
   - Magnifying glass icon
   - Placeholder text "Search your dream car....."
   - Filter button on right

3. **Brands Section**:
   - 4 brand logos (Tesla, Lamborghini, BMW, Ferrari)
   - Black circular backgrounds
   - Horizontal scrollable

4. **Best Cars Section**:
   - Title "Best Cars" with "Available" text
   - "View All" link
   - 2 car cards side by side
   - Each card shows: image, heart icon, name, rating, location, seats, price

5. **Nearby Section**:
   - Title "Nearby" with "View All" link
   - Horizontal scrollable car card

6. **Bottom Navbar**:
   - Dark background (#21292b)
   - 5 icons: Home, Search, Messages, Notifications, Profile
   - Home icon should be active (filled white)

## Colors to Verify

- Background: #f8f8f8 (light grey)
- White: #ffffff
- Bottom Navbar: #21292b (dark grey)
- Brand logo backgrounds: #000000 (black)
- Rating star: Orange (#FF6B35)
- Notification badge: Red (#FF0000)

## Revert to Original

To revert back to original HomePage, edit `frontend/src/routes/index.jsx`:

Change:
```jsx
element: <ModuleHomePage />,
```

Back to:
```jsx
element: <HomePage />,
```

