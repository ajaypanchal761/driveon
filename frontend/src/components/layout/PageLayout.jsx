import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';
import { theme } from '../../theme/theme.constants';

/**
 * PageLayout Component
 * Main layout wrapper for all pages
 * Includes Header, Footer, BottomNavbar (mobile), and loading states
 */
const PageLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isProfilePage = location.pathname.startsWith('/profile');
  
  // Routes where header and bottom navbar should be hidden
  const hideNavigationRoutes = ['/login', '/register', '/verify-otp'];
  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname);

  // Hide default header on homepage and profile pages (they have custom headers)
  const shouldShowHeader = !isHomePage && !isProfilePage && !shouldHideNavigation;

  return (
    <div className={`min-h-screen flex flex-col ${isProfilePage ? 'bg-white' : 'bg-background-primary'}`}>
      {/* Header - Mobile and Desktop (hidden on homepage, profile pages, and auth pages) */}
      {shouldShowHeader && <Header />}

      {/* Main Content */}
      <main className={`flex-1 w-full ${shouldHideNavigation ? '' : isHomePage || isProfilePage ? '' : 'pb-16 md:pb-0'}`}>
        {/* Loading fallback for lazy-loaded routes */}
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4" style={{ borderColor: theme.colors.primary }}></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer - Desktop Only (hidden on auth pages, homepage, and profile pages) */}
      {shouldShowHeader && <Footer />}

      {/* Bottom Navbar - Mobile Only (hidden on auth pages) */}
      {!shouldHideNavigation && <BottomNavbar />}
    </div>
  );
};

export default PageLayout;

