import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';

/**
 * PageLayout Component
 * Main layout wrapper for all pages
 * Includes Header, Footer, BottomNavbar (mobile), and loading states
 */
const PageLayout = () => {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* Header - Mobile and Desktop */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* Loading fallback for lazy-loaded routes */}
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading...</p>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer - Desktop Only */}
      <Footer />

      {/* Bottom Navbar - Mobile Only */}
      <BottomNavbar />
    </div>
  );
};

export default PageLayout;

