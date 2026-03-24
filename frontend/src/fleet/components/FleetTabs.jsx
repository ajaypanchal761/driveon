import { NavLink } from 'react-router-dom';
import { colors } from '../../module/theme/colors';

const tabBase =
  'px-4 py-2 rounded-lg text-sm font-medium transition-all border';

const FleetTabs = () => {
  const getTabClass = ({ isActive }) =>
    `${tabBase} ${isActive ? 'text-white shadow-sm' : ''}`;

  const getTabStyle = (isActive) =>
    isActive
      ? {
          backgroundColor: colors.backgroundTertiary,
          borderColor: colors.backgroundTertiary,
          color: colors.textWhite,
        }
      : {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.borderMedium,
          color: colors.textPrimary,
        };

  return (
    <div className="flex flex-wrap gap-2">
      <NavLink
        to="/admin/fleet/outward"
        className={getTabClass}
        style={({ isActive }) => getTabStyle(isActive)}
      >
        Outward Cars
      </NavLink>
      <NavLink
        to="/admin/fleet/inward"
        className={getTabClass}
        style={({ isActive }) => getTabStyle(isActive)}
      >
        Inward Cars
      </NavLink>
      <NavLink
        to="/admin/fleet/bookings"
        className={getTabClass}
        style={({ isActive }) => getTabStyle(isActive)}
      >
        Bookings
      </NavLink>
    </div>
  );
};

export default FleetTabs;

