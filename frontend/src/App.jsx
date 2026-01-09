import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { store } from './store/store';
import { queryClient } from './config/reactQuery';
import { AdminProvider } from './context/AdminContext';
import router from './routes';
import Toaster from './components/common/Toaster';
import AuthInitializer from './components/auth/AuthInitializer';
import { EmployeeProvider } from './context/EmployeeContext';
import './App.css';

/**
 * Main App Component
 * Wraps the app with Redux Provider, React Query Provider, Admin Provider, Employee Provider, Router, and Toaster
 */
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AdminProvider>
          <EmployeeProvider>
            <AuthInitializer />
            <RouterProvider router={router} />
            <Toaster />
          </EmployeeProvider>
        </AdminProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
