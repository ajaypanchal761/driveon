import { useState, useEffect } from 'react';
import { colors } from '../../../module/theme/colors';
import Card from '../../../components/common/Card';
import toastUtils from '../../../config/toast';
import {
  getAddOnServicesPrices,
  updateAddOnServicePrice,
  updateAllAddOnServicesPrices,
  resetToDefaultPrices,
} from '../../../utils/addOnServices';

/**
 * Add-on Services Management Page
 * Admin can edit prices for add-on services (Driver, Bodyguard, Gun men, Bouncer)
 * Prices are stored in localStorage (frontend only)
 */
const AddOnServicesPage = () => {
  const [prices, setPrices] = useState({
    driver: 500,
    bodyguard: 1000,
    gunmen: 1500,
    bouncer: 800,
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Service definitions
  const services = [
    {
      key: 'driver',
      name: 'Driver',
      description: 'Professional driver service',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'bodyguard',
      name: 'Bodyguard',
      description: 'Security personnel',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      key: 'gunmen',
      name: 'Gun men',
      description: 'Armed security personnel',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      key: 'bouncer',
      name: 'Bouncer',
      description: 'Event security personnel',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  // Load prices on mount
  useEffect(() => {
    const loadedPrices = getAddOnServicesPrices();
    setPrices(loadedPrices);
  }, []);

  // Handle price change
  const handlePriceChange = (serviceKey, value) => {
    const numValue = parseFloat(value) || 0;
    setPrices((prev) => ({
      ...prev,
      [serviceKey]: numValue,
    }));
    setHasChanges(true);
  };

  // Save all prices
  const handleSave = () => {
    setLoading(true);
    try {
      const success = updateAllAddOnServicesPrices(prices);
      if (success) {
        toastUtils.success('Add-on services prices updated successfully!');
        setHasChanges(false);
      } else {
        toastUtils.error('Failed to save prices');
      }
    } catch (error) {
      console.error('Error saving prices:', error);
      toastUtils.error('Failed to save prices');
    } finally {
      setLoading(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all prices to default values?')) {
      const defaultPrices = {
        driver: 500,
        bodyguard: 1000,
        gunmen: 1500,
        bouncer: 800,
      };
      setPrices(defaultPrices);
      resetToDefaultPrices();
      toastUtils.success('Prices reset to default values');
      setHasChanges(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Add-on Services Management
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Manage prices for add-on services that appear in booking forms
          </p>
        </div>

        {/* Services List */}
        <Card className="p-6">
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.key}
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${colors.backgroundTertiary}15`,
                      color: colors.backgroundTertiary,
                    }}
                  >
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {service.name}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={prices[service.key]}
                      onChange={(e) => handlePriceChange(service.key, e.target.value)}
                      className="w-32 px-3 py-2 rounded-lg border-2 text-base font-semibold"
                      style={{
                        borderColor: colors.borderMedium,
                        backgroundColor: colors.backgroundPrimary,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    per unit
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t" style={{ borderColor: colors.borderMedium }}>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.backgroundLight,
                color: colors.textPrimary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.borderMedium;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.backgroundLight;
              }}
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="px-6 py-2 rounded-lg font-medium text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: hasChanges ? colors.backgroundTertiary : colors.borderMedium,
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </Card>

        {/* Info Note */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.backgroundTertiary}15` }}>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            <strong style={{ color: colors.textPrimary }}>Note:</strong> These prices will be displayed
            dynamically in all booking forms. The total price will be calculated as: Quantity × Price per unit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddOnServicesPage;

