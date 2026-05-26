import { useState, useEffect } from 'react';
import { colors } from '../../../module/theme/colors';
import Card from '../../../components/common/Card';
import toastUtils from '../../../config/toast';
import { adminService } from '../../../services/admin.service';
import api from '../../../services/api';

const AddOnServicesPage = () => {
  const [prices, setPrices] = useState({
    driver: 500,
    bodyguard: 1000,
    gunmen: 1500,
    bouncer: 800,
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [customServices, setCustomServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '', pricePerUnit: '' });

  // Fixed services
  const services = [
    { key: 'driver', name: 'Driver', description: 'Professional driver service' },
    { key: 'bodyguard', name: 'Bodyguard', description: 'Security personnel' },
    { key: 'gunmen', name: 'Gun men', description: 'Armed security personnel' },
    { key: 'bouncer', name: 'Bouncer', description: 'Event security personnel' },
  ];

  useEffect(() => {
    fetchPrices();
    fetchCustomServices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAddOnServicesPrices();
      if (response.success && response.data) {
        setPrices({
          driver: response.data.driver || 500,
          bodyguard: response.data.bodyguard || 1000,
          gunmen: response.data.gunmen || 1500,
          bouncer: response.data.bouncer || 800,
        });
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomServices = async () => {
    try {
      const response = await api.get('/admin/addon-services/custom');
      if (response.data.success) {
        setCustomServices(response.data.data.services);
      }
    } catch (error) {
      console.error('Error fetching custom services:', error);
    }
  };

  const handlePriceChange = (serviceKey, value) => {
    setPrices(prev => ({ ...prev, [serviceKey]: parseFloat(value) || 0 }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await adminService.updateAddOnServicesPrices(prices);
      if (response.success) {
        toastUtils.success('Prices updated successfully!');
        setHasChanges(false);
      }
    } catch (error) {
      toastUtils.error('Failed to save prices');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all prices to default?')) return;
    const defaultPrices = { driver: 500, bodyguard: 1000, gunmen: 1500, bouncer: 800 };
    try {
      await adminService.updateAddOnServicesPrices(defaultPrices);
      setPrices(defaultPrices);
      setHasChanges(false);
      toastUtils.success('Prices reset to default');
    } catch (error) {
      toastUtils.error('Failed to reset');
    }
  };

  // Custom service CRUD
  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: '', phone: '', email: '', address: '', pricePerUnit: '' });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      phone: service.phone || '',
      email: service.email || '',
      address: service.address || '',
      pricePerUnit: service.pricePerUnit,
    });
    setShowModal(true);
  };

  const handleSaveService = async () => {
    if (!formData.name.trim()) {
      toastUtils.error('Service Name is required');
      return;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      toastUtils.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toastUtils.error('Please enter a valid email address');
      return;
    }
    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      toastUtils.error('Price Per Unit is required');
      return;
    }

    try {
      if (editingService) {
        const res = await api.put(`/admin/addon-services/custom/${editingService._id}`, formData);
        if (res.data.success) {
          toastUtils.success('Service updated');
          fetchCustomServices();
        }
      } else {
        const res = await api.post('/admin/addon-services/custom', formData);
        if (res.data.success) {
          toastUtils.success('Service added');
          fetchCustomServices();
        }
      }
      setShowModal(false);
    } catch (error) {
      toastUtils.error('Failed to save service');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await api.delete(`/admin/addon-services/custom/${id}`);
      if (res.data.success) {
        setCustomServices(prev => prev.filter(s => s._id !== id));
        toastUtils.success('Service deleted');
      }
    } catch (error) {
      toastUtils.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundPrimary }}>
      <div className="container mx-auto px-4 pt-24 pb-8 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>Add-on Services Management</h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>Manage prices for add-on services that appear in booking forms</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-lg text-white font-bold text-sm"
            style={{ backgroundColor: colors.backgroundTertiary }}
          >
            + Add Service
          </button>
        </div>

        {/* Fixed Services */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Default Services</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.key} className="flex items-center justify-between p-4 rounded-lg border-2" style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundSecondary }}>
                <div>
                  <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>{service.name}</h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>{service.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>₹</span>
                  <input
                    type="number"
                    min="0"
                    value={prices[service.key]}
                    onChange={(e) => handlePriceChange(service.key, e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg border-2 text-base font-semibold"
                    style={{ borderColor: colors.borderMedium, color: colors.textPrimary }}
                  />
                  <span className="text-sm" style={{ color: colors.textSecondary }}>per unit</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: colors.borderMedium }}>
            <button onClick={handleReset} className="px-5 py-2 rounded-lg font-medium border" style={{ borderColor: colors.borderMedium, color: colors.textPrimary }}>Reset to Default</button>
            <button onClick={handleSave} disabled={!hasChanges || loading} className="px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ backgroundColor: colors.backgroundTertiary }}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </Card>

        {/* Custom Services */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Custom Services ({customServices.length})</h2>
          {customServices.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: colors.textSecondary }}>No custom services added yet. Click "Add Service" to create one.</p>
          ) : (
            <div className="space-y-3">
              {customServices.map((service) => (
                <div key={service._id} className="flex items-center justify-between p-4 rounded-lg border-2" style={{ borderColor: colors.borderMedium, backgroundColor: colors.backgroundSecondary }}>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold" style={{ color: colors.textPrimary }}>{service.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {service.phone && <span className="text-xs" style={{ color: colors.textSecondary }}>📞 {service.phone}</span>}
                      {service.email && <span className="text-xs" style={{ color: colors.textSecondary }}>✉️ {service.email}</span>}
                      {service.address && <span className="text-xs" style={{ color: colors.textSecondary }}>📍 {service.address}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold" style={{ color: colors.backgroundTertiary }}>₹{service.pricePerUnit}/unit</span>
                    <button onClick={() => openEditModal(service)} className="px-3 py-1.5 rounded-lg text-xs font-bold border" style={{ borderColor: colors.borderMedium, color: colors.textPrimary }}>Edit</button>
                    <button onClick={() => handleDeleteService(service._id)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Service Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Personal Driver" className="w-full px-3 py-2 border-2 rounded-lg text-sm" style={{ borderColor: colors.borderMedium }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Phone Number *</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit phone" maxLength={10} className="w-full px-3 py-2 border-2 rounded-lg text-sm" style={{ borderColor: colors.borderMedium }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="w-full px-3 py-2 border-2 rounded-lg text-sm" style={{ borderColor: colors.borderMedium }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Address</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Service address" className="w-full px-3 py-2 border-2 rounded-lg text-sm" style={{ borderColor: colors.borderMedium }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>Price Per Unit (₹) *</label>
                <input type="number" min="0" value={formData.pricePerUnit} onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })} placeholder="e.g., 500" className="w-full px-3 py-2 border-2 rounded-lg text-sm" style={{ borderColor: colors.borderMedium }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg font-medium border" style={{ borderColor: colors.borderMedium, color: colors.textPrimary }}>Cancel</button>
                <button onClick={handleSaveService} className="flex-1 py-2.5 rounded-lg font-bold text-white" style={{ backgroundColor: colors.backgroundTertiary }}>{editingService ? 'Update' : 'Add Service'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOnServicesPage;
