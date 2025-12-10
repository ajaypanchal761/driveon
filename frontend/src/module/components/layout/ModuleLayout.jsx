import ScrollToTop from '../common/ScrollToTop';
import { Outlet } from 'react-router-dom';

/**
 * ModuleLayout Component
 * Wraps all module routes and ensures scroll to top on navigation
 */
const ModuleLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default ModuleLayout;

