# NewUI Routes

## Available Routes

### Home Page
- **Path**: `/newui` or `/newui/home`
- **Component**: `HomePage`
- **Description**: Main home page with red header, body type filter, top brands, and available cars

## Usage

To access the new UI, navigate to:
- `http://localhost:5173/newui` or
- `http://localhost:5173/newui/home`

## Route Configuration

Routes are configured in `frontend/src/routes/index.jsx`:

```javascript
{
  path: "/newui",
  element: <NewUIHomePage />,
},
{
  path: "/newui/home",
  element: <NewUIHomePage />,
},
```

## Future Routes

Additional routes can be added as needed:
- `/newui/car-details/:id` - Car details page
- `/newui/search` - Search page
- `/newui/profile` - Profile page
- `/newui/bookings` - Bookings page
- etc.

