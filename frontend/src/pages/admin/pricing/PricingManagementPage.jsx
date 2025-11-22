import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../../theme/theme.constants';
import Card from '../../../components/common/Card';

/**
 * Pricing Management Page
 * Admin can manage dynamic pricing rules, multipliers, and special pricing
 * No localStorage or Redux - All state managed via React hooks
 */
const PricingManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial view from URL
  const getInitialView = () => {
    if (location.pathname.includes('/holidays')) return 'holidays';
    if (location.pathname.includes('/surge')) return 'surge';
    return 'rules';
  };

  // State management
  const [pricingRules, setPricingRules] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [viewMode, setViewMode] = useState(getInitialView()); // rules, holidays, surge
  
  // Form states
  const [ruleForm, setRuleForm] = useState({
    name: '',
    type: 'multiplier', // multiplier, fixed, percentage
    value: '',
    applicableTo: 'all', // all, car_type, location, car_id
    carType: '',
    location: '',
    carId: '',
    startDate: '',
    endDate: '',
    daysOfWeek: [], // 0-6 (Sunday-Saturday)
    timeRange: { start: '', end: '' },
    isActive: true,
  });

  const [holidayForm, setHolidayForm] = useState({
    name: '',
    date: '',
    multiplier: 1.5,
    isRecurring: false,
  });

  // Mock pricing rules data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRules = [
        {
          id: '1',
          name: 'Weekend Multiplier',
          type: 'multiplier',
          value: 1.2,
          applicableTo: 'all',
          daysOfWeek: [0, 6], // Saturday, Sunday
          isActive: true,
          createdAt: '2024-01-15T10:00:00',
        },
        {
          id: '2',
          name: 'Holiday Multiplier',
          type: 'multiplier',
          value: 1.5,
          applicableTo: 'all',
          isActive: true,
          createdAt: '2024-01-15T10:00:00',
        },
        {
          id: '3',
          name: 'Peak Hours Surge',
          type: 'multiplier',
          value: 1.3,
          applicableTo: 'all',
          timeRange: { start: '08:00', end: '10:00' },
          isActive: true,
          createdAt: '2024-01-20T10:00:00',
        },
        {
          id: '4',
          name: 'Luxury Car Premium',
          type: 'multiplier',
          value: 1.4,
          applicableTo: 'car_type',
          carType: 'luxury',
          isActive: true,
          createdAt: '2024-02-01T10:00:00',
        },
        {
          id: '5',
          name: 'Mumbai Location Surcharge',
          type: 'multiplier',
          value: 1.1,
          applicableTo: 'location',
          location: 'Mumbai',
          isActive: true,
          createdAt: '2024-02-10T10:00:00',
        },
        {
          id: '6',
          name: 'Festive Season Pricing',
          type: 'multiplier',
          value: 1.6,
          applicableTo: 'all',
          startDate: '2024-10-20',
          endDate: '2024-11-05',
          isActive: false,
          createdAt: '2024-02-15T10:00:00',
        },
      ];

      const mockHolidays = [
        {
          id: '1',
          name: 'New Year',
          date: '2024-01-01',
          multiplier: 1.5,
          isRecurring: true,
        },
        {
          id: '2',
          name: 'Republic Day',
          date: '2024-01-26',
          multiplier: 1.5,
          isRecurring: true,
        },
        {
          id: '3',
          name: 'Holi',
          date: '2024-03-25',
          multiplier: 1.6,
          isRecurring: true,
        },
        {
          id: '4',
          name: 'Diwali',
          date: '2024-11-01',
          multiplier: 2.0,
          isRecurring: true,
        },
        {
          id: '5',
          name: 'Christmas',
          date: '2024-12-25',
          multiplier: 1.5,
          isRecurring: true,
        },
      ];

      setPricingRules(mockRules);
      setHolidays(mockHolidays);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateRule = () => {
    setRuleForm({
      name: '',
      type: 'multiplier',
      value: '',
      applicableTo: 'all',
      carType: '',
      location: '',
      carId: '',
      startDate: '',
      endDate: '',
      daysOfWeek: [],
      timeRange: { start: '', end: '' },
      isActive: true,
    });
    setSelectedRule(null);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setRuleForm({
      name: rule.name,
      type: rule.type,
      value: rule.value,
      applicableTo: rule.applicableTo,
      carType: rule.carType || '',
      location: rule.location || '',
      carId: rule.carId || '',
      startDate: rule.startDate || '',
      endDate: rule.endDate || '',
      daysOfWeek: rule.daysOfWeek || [],
      timeRange: rule.timeRange || { start: '', end: '' },
      isActive: rule.isActive,
    });
    setShowRuleModal(true);
  };

  const handleSaveRule = () => {
    if (selectedRule) {
      // Update existing rule
      setPricingRules((prev) =>
        prev.map((rule) =>
          rule.id === selectedRule.id ? { ...rule, ...ruleForm } : rule
        )
      );
    } else {
      // Create new rule
      const newRule = {
        id: Date.now().toString(),
        ...ruleForm,
        createdAt: new Date().toISOString(),
      };
      setPricingRules((prev) => [...prev, newRule]);
    }
    setShowRuleModal(false);
    setSelectedRule(null);
  };

  const handleToggleRule = (ruleId) => {
    setPricingRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm('Are you sure you want to delete this pricing rule?')) {
      setPricingRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    }
  };

  const handleCreateHoliday = () => {
    setHolidayForm({
      name: '',
      date: '',
      multiplier: 1.5,
      isRecurring: false,
    });
    setShowHolidayModal(true);
  };

  const handleSaveHoliday = () => {
    const newHoliday = {
      id: Date.now().toString(),
      ...holidayForm,
    };
    setHolidays((prev) => [...prev, newHoliday]);
    setShowHolidayModal(false);
  };

  const handleDeleteHoliday = (holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      setHolidays((prev) => prev.filter((holiday) => holiday.id !== holidayId));
    }
  };

  const handleTestPricing = () => {
    // In real app, this would test pricing calculations
    alert('Pricing calculation test would run here');
  };

  // Get rule type display name
  const getRuleTypeName = (type) => {
    const names = {
      multiplier: 'Multiplier',
      fixed: 'Fixed Amount',
      percentage: 'Percentage',
    };
    return names[type] || type;
  };

  // Get applicable to display
  const getApplicableToDisplay = (rule) => {
    if (rule.applicableTo === 'all') return 'All Cars';
    if (rule.applicableTo === 'car_type') return `Car Type: ${rule.carType}`;
    if (rule.applicableTo === 'location') return `Location: ${rule.location}`;
    if (rule.applicableTo === 'car_id') return `Car ID: ${rule.carId}`;
    return rule.applicableTo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}
          ></div>
          <p className="text-gray-600">Loading pricing rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>
                Pricing Management
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manage dynamic pricing rules and multipliers</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleTestPricing}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Test Pricing
              </button>
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('rules')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'rules'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'rules' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  Rules
                </button>
                <button
                  onClick={() => setViewMode('holidays')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'holidays'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'holidays' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  Holidays
                </button>
                <button
                  onClick={() => setViewMode('surge')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'surge'
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={viewMode === 'surge' ? { backgroundColor: theme.colors.primary } : {}}
                >
                  Surge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {pricingRules.length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Rules</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-green-600">
              {pricingRules.filter((r) => r.isActive).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Active Rules</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-1 text-gray-600">{holidays.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Holidays</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-xl md:text-2xl font-bold mb-1" style={{ color: theme.colors.primary }}>
              {pricingRules.filter((r) => r.type === 'multiplier').length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Multipliers</div>
          </Card>
        </div>

        {/* Pricing Rules View */}
        {viewMode === 'rules' && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pricing Rules</h2>
              <button
                onClick={handleCreateRule}
                className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Create Rule
              </button>
            </div>

            <div className="space-y-4">
              {pricingRules.map((rule) => (
                <Card key={rule.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Rule Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{rule.name}</h3>
                          <p className="text-sm text-gray-500">{getRuleTypeName(rule.type)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              rule.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Rule Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">Value</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {rule.type === 'multiplier' ? `${rule.value}x` : `₹${rule.value}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Applicable To</p>
                          <p className="text-sm text-gray-900">{getApplicableToDisplay(rule)}</p>
                        </div>
                        {rule.daysOfWeek && rule.daysOfWeek.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-600">Days</p>
                            <p className="text-sm text-gray-900">
                              {rule.daysOfWeek.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                            </p>
                          </div>
                        )}
                        {rule.timeRange && rule.timeRange.start && (
                          <div>
                            <p className="text-xs text-gray-600">Time Range</p>
                            <p className="text-sm text-gray-900">
                              {rule.timeRange.start} - {rule.timeRange.end}
                            </p>
                          </div>
                        )}
                        {rule.startDate && (
                          <div>
                            <p className="text-xs text-gray-600">Date Range</p>
                            <p className="text-sm text-gray-900">
                              {new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Created: {new Date(rule.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-40">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          rule.isActive
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {rule.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Holidays View */}
        {viewMode === 'holidays' && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Holiday Calendar</h2>
              <button
                onClick={handleCreateHoliday}
                className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Add Holiday
              </button>
            </div>

            <div className="space-y-4">
              {holidays.map((holiday) => (
                <Card key={holiday.id} className="p-4 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{holiday.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Date</p>
                          <p className="text-sm text-gray-900">{new Date(holiday.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Multiplier</p>
                          <p className="text-sm font-semibold text-gray-900">{holiday.multiplier}x</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Recurring</p>
                          <p className="text-sm text-gray-900">{holiday.isRecurring ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:w-32">
                      <button
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        className="w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Surge Pricing View */}
        {viewMode === 'surge' && (
          <>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Surge Pricing Settings</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Peak Demand Multiplier</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatically adjust pricing based on demand and availability
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Low Demand</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="0.9"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Normal</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">High Demand</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Peak Demand</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Time-Based Surge</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set multipliers for specific time periods
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700 w-32">Morning Rush (7-9 AM)</span>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.2"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700 w-32">Evening Rush (5-7 PM)</span>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.3"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700 w-32">Night (10 PM - 6 AM)</span>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="1.1"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Save Surge Settings
                </button>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Rule Modal */}
      {showRuleModal && (
        <RuleModal
          ruleForm={ruleForm}
          setRuleForm={setRuleForm}
          onClose={() => {
            setShowRuleModal(false);
            setSelectedRule(null);
          }}
          onSave={handleSaveRule}
        />
      )}

      {/* Holiday Modal */}
      {showHolidayModal && (
        <HolidayModal
          holidayForm={holidayForm}
          setHolidayForm={setHolidayForm}
          onClose={() => setShowHolidayModal(false)}
          onSave={handleSaveHoliday}
        />
      )}
    </div>
  );
};

/**
 * Rule Modal Component
 */
const RuleModal = ({ ruleForm, setRuleForm, onClose, onSave }) => {
  const handleDayToggle = (day) => {
    setRuleForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create Pricing Rule</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
            <input
              type="text"
              value={ruleForm.name}
              onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Weekend Multiplier"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              value={ruleForm.type}
              onChange={(e) => setRuleForm({ ...ruleForm, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="multiplier">Multiplier</option>
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
            <input
              type="number"
              step="0.1"
              value={ruleForm.value}
              onChange={(e) => setRuleForm({ ...ruleForm, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={ruleForm.type === 'multiplier' ? 'e.g., 1.2' : 'e.g., 500'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Applicable To *</label>
            <select
              value={ruleForm.applicableTo}
              onChange={(e) => setRuleForm({ ...ruleForm, applicableTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Cars</option>
              <option value="car_type">Car Type</option>
              <option value="location">Location</option>
              <option value="car_id">Specific Car</option>
            </select>
          </div>

          {ruleForm.applicableTo === 'car_type' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
              <select
                value={ruleForm.carType}
                onChange={(e) => setRuleForm({ ...ruleForm, carType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Car Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          )}

          {ruleForm.applicableTo === 'location' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={ruleForm.location}
                onChange={(e) => setRuleForm({ ...ruleForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Mumbai"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
            <div className="flex flex-wrap gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayToggle(index)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    ruleForm.daysOfWeek.includes(index)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={ruleForm.startDate}
                onChange={(e) => setRuleForm({ ...ruleForm, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={ruleForm.endDate}
                onChange={(e) => setRuleForm({ ...ruleForm, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={ruleForm.timeRange.start}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    timeRange: { ...ruleForm.timeRange, start: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={ruleForm.timeRange.end}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    timeRange: { ...ruleForm.timeRange, end: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={ruleForm.isActive}
              onChange={(e) => setRuleForm({ ...ruleForm, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Rule
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Holiday Modal Component
 */
const HolidayModal = ({ holidayForm, setHolidayForm, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add Holiday</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name *</label>
            <input
              type="text"
              value={holidayForm.name}
              onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Diwali"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={holidayForm.date}
              onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Multiplier *</label>
            <input
              type="number"
              step="0.1"
              value={holidayForm.multiplier}
              onChange={(e) => setHolidayForm({ ...holidayForm, multiplier: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={holidayForm.isRecurring}
              onChange={(e) => setHolidayForm({ ...holidayForm, isRecurring: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="isRecurring" className="text-sm text-gray-700">
              Recurring Holiday
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Save Holiday
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingManagementPage;

