import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

/**
 * Routes configuration for module
 * Starting with HomePage only
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);

export default router;

