import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { store } from './store/store';
import { queryClient } from './config/reactQuery';
import { router } from './routes';
import Toaster from './components/common/Toaster';
import './App.css';

/**
 * Main App Component
 * Wraps the app with Redux Provider, React Query Provider, Router, and Toaster
 */
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
