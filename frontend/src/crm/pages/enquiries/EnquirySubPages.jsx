import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdFolderOpen,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdVisibility,
  MdCall,
  MdMoreVert,
  MdArrowBack,
  MdArrowForward,
  MdPhone,
  MdEmail,
  MdCheck,
  MdClose,
  MdGroup,
  MdPieChart,
  MdBarChart,
  MdChevronLeft,
  MdChevronRight,
  MdWarning,
  MdTrendingUp,
  MdTrendingDown,
  MdPersonAdd,
  MdCheckCircle,
  MdDownload,
  MdCalendarToday,
  MdRestore,
  MdEdit
} from 'react-icons/md';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import { premiumColors } from '../../../theme/colors';
import { rgba } from 'polished';

import ThemedDropdown from '../../components/ThemedDropdown';
import api from '../../../services/api';

// --- Shared Components for Analytics ---
const ReportCard = ({ title, subtitle, children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    className={`bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 flex flex-col overflow-hidden ${className}`}
  >
    <div className="p-6 border-b border-gray-50 flex justify-between items-start">
      <div>
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 block"></span>
          {title}
        </h3>
        {subtitle && <p className="text-gray-400 text-xs mt-1 ml-3">{subtitle}</p>}
      </div>
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">
        <MdFilterList size={18} />
      </div>
    </div>
    <div className="flex-1 w-full min-h-0 p-6 relative">
      {children}
    </div>
  </motion.div>
);

const StatWidget = ({ title, value, change, isPositive, color, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
  >
    <div className={`absolute -right-6 -top-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12 scale-150`}>
      <Icon size={120} style={{ color: color.includes('text-[') ? premiumColors.primary.DEFAULT : '' }} className={!color.includes('text-[') ? color : ''} />
    </div>

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 transition-transform`}
          style={{ backgroundColor: color.includes('text-[') ? premiumColors.primary.DEFAULT : (color.includes('green') ? '#10B981' : (color.includes('red') ? '#EF4444' : '#F59E0B')) }}
        >
          <Icon size={22} />
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? <MdTrendingUp /> : <MdTrendingDown />}
          {change}
        </span>
      </div>
      <h4 className="text-2xl font-black text-gray-800 tracking-tight">{value}</h4>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{title}</p>
    </div>
  </motion.div>
);
const MOCK_ENQUIRIES = [
  { id: 1, name: "Rahul Kumar", phone: "+91 98765 43210", email: "rahul@example.com", car: "Toyota Innova Crysta", status: "New", date: "27 Dec 2025", source: "Website", image: "https://i.pravatar.cc/150?u=11" },
  { id: 2, name: "Priya Singh", phone: "+91 99887 76655", email: "priya@example.com", car: "Maruti Swift Dzire", status: "Follow-up", date: "26 Dec 2025", source: "Referral", image: "https://i.pravatar.cc/150?u=5" },
  { id: 3, name: "Amit Sharma", phone: "+91 91234 56789", email: "amit@example.com", car: "Mahindra Thar", status: "Converted", date: "25 Dec 2025", source: "Walk-in", image: "https://i.pravatar.cc/150?u=12" },
  { id: 4, name: "Sneha Gupta", phone: "+91 98989 89898", email: "sneha@example.com", car: "Honda City", status: "Closed", date: "24 Dec 2025", source: "Phone", image: "https://i.pravatar.cc/150?u=9" },
  { id: 5, name: "Vikram Malhotra", phone: "+91 95544 33221", email: "vikram@example.com", car: "Hyundai Creta", status: "In Progress", date: "24 Dec 2025", source: "Website", image: "https://i.pravatar.cc/150?u=13" },
];

/**
 * Generic Placeholder for Enquiries Sub-Pages
 * This reuses the main layout but customizes the content area.
 */
const EnquiriesPlaceholder = ({ title, subtitle }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <MdFolderOpen size={40} />
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Module: {title}</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          This page is ready for implementation. It will contain specific features for "{title}".
        </p>
      </div>
    </div>
  );
};

export const AllEnquiriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [dateFilter, setDateFilter] = useState('Date: All Time');

  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // Fetch all enquiries from backend
  React.useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/enquiries');
      if (response.data.success) {
        // Map backend data to frontend format
        const mappedData = response.data.data.enquiries.map(enq => ({
          id: enq._id,
          name: enq.name,
          phone: enq.phone,
          interest: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (typeof enq.carInterested === 'string' ? enq.carInterested : (enq.carInterested?._id || 'Not Specified')),
          source: enq.source,
          date: enq.createdAt,
          status: enq.status,
          email: enq.email || '',
          note: enq.note || enq.notes || '',
          car: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (typeof enq.carInterested === 'string' ? enq.carInterested : (enq.carInterested?._id || 'Not Specified'))
        }));
        setEnquiriesList(mappedData);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEnquiry = async (data) => {
    try {
      if (editingEnquiry) {
        // Update existing
        await api.put(`/crm/enquiries/${editingEnquiry.id}`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          note: data.note
        });
      }
      // Refresh list after save
      await fetchEnquiries();
      setIsModalOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving enquiry:', error);
      alert('Failed to save enquiry. Please try again.');
    }
  };

  const handleEditClick = (enquiry) => {
    // Transform data for modal
    setEditingEnquiry({
      ...enquiry,
      interest: enquiry.interest || enquiry.car
    });
    setIsModalOpen(true);
  };

  // Filter Logic
  const filteredEnquiries = enquiriesList.filter(enquiry => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (enquiry.name || '').toLowerCase().includes(searchLower) ||
      (enquiry.phone || '').includes(searchTerm) ||
      (enquiry.car || '').toLowerCase().includes(searchLower);

    // Status
    const statusVal = statusFilter.replace('Status: ', '');
    const matchesStatus = statusFilter === 'Status: All' || enquiry.status === statusVal;

    // Date
    let matchesDate = true;
    if (dateFilter !== 'Date: All Time') {
      const enquiryDate = new Date(enquiry.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'Date: Today') {
        matchesDate = enquiryDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'Date: Yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = enquiryDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === 'Date: Last 7 Days') {
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        matchesDate = enquiryDate >= last7;
      } else if (dateFilter === 'Date: This Month') {
        matchesDate = enquiryDate.getMonth() === today.getMonth() && enquiryDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-blue-50 text-blue-600',
      'Follow-up': 'bg-orange-50 text-orange-600',
      'Converted': 'bg-green-50 text-green-600',
      'Closed': 'bg-red-50 text-red-600',
      'In Progress': 'bg-purple-50 text-purple-600'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Enquiries</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">All Enquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">All Enquiries</h1>
          <p className="text-gray-500 text-sm">Manage and track all customer leads.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Name, Phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative min-w-[140px]">
            <ThemedDropdown
              options={['Status: All', 'New', 'In Progress', 'Follow-up', 'Converted', 'Closed']}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="bg-white text-sm"
              width="w-full"
            />
          </div>

          <div className="relative min-w-[140px]">
            <ThemedDropdown
              options={['Date: All Time', 'Date: Today', 'Date: Yesterday', 'Date: Last 7 Days', 'Date: This Month']}
              value={dateFilter}
              onChange={(val) => setDateFilter(val)}
              className="bg-white text-sm"
              width="w-full"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4">Name / Contact</th>
                <th className="p-4">Car Interested</th>
                <th className="p-4">Source</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      Loading enquiries...
                    </div>
                  </td>
                </tr>
              ) : filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{enquiry.name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><MdPhone size={10} /> {enquiry.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{enquiry.car}</td>
                    <td className="p-4 text-gray-500">{enquiry.source}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(enquiry.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">{getStatusBadge(enquiry.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(enquiry); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <MdEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No enquiries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
          Showing {filteredEnquiries.length} of {enquiriesList.length} enquiries
        </div>
      </div>

      {/* Edit Modal */}
      <CreateEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEnquiry}
        initialData={editingEnquiry}
      />
    </div>
  );
};
// Mock Data for New Enquiries
// Helper to get consistent dates
const getToday = () => new Date();
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

const MOCK_NEW_ENQUIRIES = [
  { id: 1, name: "Vikram Malhotra", phone: "+91 95544 33221", interest: "Hyundai Creta", time: "10 mins ago", status: "New", source: "Website", date: getToday().toISOString() },
  { id: 2, name: "Anjali Dubey", phone: "+91 98877 66554", interest: "Mahindra Thar", time: "1 hour ago", status: "New", source: "Facebook", date: getToday().toISOString() },
  { id: 3, name: "Rohan Singhania", phone: "+91 99112 23344", interest: "Toyota Innova", time: "2 hours ago", status: "New", source: "Referral", date: getYesterday().toISOString() },
  { id: 4, name: "Meera Iyer", phone: "+91 91234 56780", interest: "Swift Dzire", time: "5 hours ago", status: "New", source: "Website", date: getYesterday().toISOString() },
];



const CreateEnquiryModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
    source: 'Walk-in',
    status: 'New',
    note: ''
  });

  const [availableCars, setAvailableCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Fetch available cars from database
  React.useEffect(() => {
    if (isOpen) {
      fetchAvailableCars();
    }
  }, [isOpen]);

  const fetchAvailableCars = async () => {
    try {
      setLoadingCars(true);
      // Use the plural /cars endpoint with the centralized api instance
      const response = await api.get('/cars?limit=100');
      if (response.data.success && response.data.data && response.data.data.cars) {
        // Extract car names and IDs from the response
        const cars = response.data.data.cars.map(car => ({
          name: `${car.brand || ''} ${car.model || ''}`.trim(),
          id: car._id
        }));

        // Sort by name
        const sortedCars = cars.sort((a, b) => a.name.localeCompare(b.name));
        setAvailableCars(sortedCars);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setAvailableCars([]);
    } finally {
      setLoadingCars(false);
    }
  };

  React.useEffect(() => {
    if (initialData) {
      // Find matching car ID if interest is currently a string name
      let interestValue = initialData.interest?._id || initialData.carId || initialData.interest || '';

      // If interestValue is not a valid ObjectId (regex check for hex 24 chars) and we have available cars, try matching by name
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(interestValue);
      if (interestValue && !isObjectId && availableCars.length > 0) {
        const matchingCar = availableCars.find(c => c.name.toLowerCase() === interestValue.toLowerCase());
        if (matchingCar) {
          interestValue = matchingCar.id;
        }
      }

      setFormData({
        ...initialData,
        interest: interestValue,
        status: initialData.status || 'New',
        note: initialData.note || initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        interest: '',
        source: 'Walk-in',
        status: 'New',
        note: ''
      });
    }
  }, [initialData, isOpen, availableCars]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg md:max-w-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                {initialData ? <MdEdit size={22} /> : <MdPersonAdd size={22} />}
              </span>
              {initialData ? 'Edit Enquiry' : 'New Enquiry'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <MdClose size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Customer Name</label>
                <div className="relative">
                  <MdPersonAdd className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all overflow-hidden">
                  <div className="pl-3 pr-2 flex items-center justify-center border-r border-gray-200 bg-gray-100 text-gray-500 h-full">
                    <MdPhone className="mr-1 text-gray-400" />
                    <span className="text-sm font-medium pt-0.5">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    className="w-full pl-3 pr-4 py-2.5 bg-transparent border-none focus:outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="98765 43210"
                    value={formData.phone.replace('+91 ', '')}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val ? `+91 ${val}` : '' });
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Interested Car</label>
                <div className="relative">
                  <ThemedDropdown
                    placeholder={loadingCars ? 'Loading cars...' : 'Select Car Model'}
                    options={availableCars.map(car => ({ value: car.id, label: car.name }))}
                    value={formData.interest}
                    onChange={(val) => setFormData({ ...formData, interest: val })}
                    className="bg-gray-50"
                    width="w-full"
                  />

                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Lead Source</label>
                <div className="relative">
                  <ThemedDropdown
                    options={['Walk-in', 'Phone Call', 'Referral', 'Social Media']}
                    value={formData.source}
                    onChange={(val) => setFormData({ ...formData, source: val })}
                    className="bg-gray-50"
                    width="w-full"
                  />

                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</label>
                <div className="relative">
                  <ThemedDropdown
                    options={['New', 'In Progress', 'Follow-up', 'Converted', 'Closed']}
                    value={formData.status}
                    onChange={(val) => setFormData({ ...formData, status: val })}
                    className="bg-gray-50"
                    width="w-full"
                  />

                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Notes / Requirements</label>
              <textarea
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none"
                placeholder="Any specific preferences or comments..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                style={{ backgroundColor: premiumColors.primary.DEFAULT }}
              >
                <MdCheckCircle size={20} />
                {initialData ? 'Save Changes' : 'Create Enquiry'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const NewEnquiriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Date: All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch enquiries from backend
  React.useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/enquiries?status=New');
      if (response.data.success) {
        // Map backend data to frontend format
        const mappedData = response.data.data.enquiries.map(enq => ({
          id: enq._id,
          name: enq.name,
          phone: enq.phone,
          interest: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (typeof enq.carInterested === 'string' ? enq.carInterested : (enq.carInterested?._id || 'Not Specified')),
          source: enq.source,
          time: getTimeAgo(enq.createdAt),
          date: enq.createdAt,
          status: enq.status,
          email: enq.email || '',
          note: enq.note || enq.notes || ''
        }));
        setEnquiriesList(mappedData);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // State for enquiries list (initially loaded from API)

  // Filtering Logic
  const filteredEnquiries = enquiriesList.filter(enquiry => {
    const matchesSearch =
      (enquiry.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.phone || '').includes(searchTerm);

    let matchesDate = true;
    if (dateFilter !== 'Date: All') {
      const enquiryDate = new Date(enquiry.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'Date: Today') {
        matchesDate = enquiryDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'Date: Yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = enquiryDate.toDateString() === yesterday.toDateString();
      }
    }

    return matchesSearch && matchesDate;
  });

  const handleSaveEnquiry = async (data) => {
    try {
      if (editingEnquiry) {
        // Update existing
        await api.put(`/crm/enquiries/${editingEnquiry.id}`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          status: data.status,
          note: data.note
        });
      } else {
        // Create new
        await api.post('/crm/enquiries', {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          status: data.status || 'New',
          note: data.note
        });
      }
      // Refresh list after save
      await fetchEnquiries();
      setIsCreateModalOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving enquiry:', error);
      alert('Failed to save enquiry. Please try again.');
    }
  };

  const handleEditClick = (enquiry) => {
    setEditingEnquiry(enquiry);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingEnquiry(null);
  };

  return (
    <div className="space-y-6">
      <CreateEnquiryModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEnquiry}
        initialData={editingEnquiry}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Enquiries</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">New Leads</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">New Enquiries</h1>
          <p className="text-gray-500 text-sm">Fresh leads received today. <span className="text-red-500 font-semibold">Action needed immediately.</span></p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all transform"
          style={{ backgroundColor: premiumColors.primary.DEFAULT }}
        >
          <MdAdd size={22} />
          New Enquiry
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Name or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">

          <div className="relative">
            <ThemedDropdown 
              options={['Date: All', 'Date: Today', 'Date: Yesterday']}
              value={dateFilter}
              onChange={(val) => setDateFilter(val)}
              className="bg-white text-sm"
              width="w-40"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-50/30 border-b border-red-100 text-xs uppercase tracking-wider text-red-700 font-bold">
              <th className="p-4">Name / Contact</th>
              <th className="p-4">Interest</th>
              <th className="p-4">Received</th>
              <th className="p-4">Source</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    Loading enquiries...
                  </div>
                </td>
              </tr>
            ) : filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{enquiry.name}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                      <MdPhone size={10} /> {enquiry.phone}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{enquiry.interest}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">
                      {enquiry.time}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{enquiry.source}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditClick(enquiry); }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Details"
                    >
                      <MdEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No new enquiries found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="p-4 text-sm text-gray-500 border-t border-gray-100">
          Showing {filteredEnquiries.length} of {enquiriesList.length} new enquiries
        </div>
      </div>
    </div>
  );
};
// Mock Data for In Progress Enquiries
const MOCK_IN_PROGRESS = [
  { id: 1, name: "Amit Kumar", phone: "+91 98765 43210", interest: "Mahindra Thar 4x4", stage: "Negotiation", assignedTo: "Rajesh (Sales)", lastUpdate: "2 hours ago" },
  { id: 2, name: "Sneha Roy", phone: "+91 99887 76655", interest: "Innova Crysta", stage: "Doc Verification", assignedTo: "Priya (Admin)", lastUpdate: "1 day ago" },
  { id: 3, name: "Karan Johar", phone: "+91 91234 56789", interest: "Swift Dzire", stage: "Test Drive Done", assignedTo: "Vikram (Driver)", lastUpdate: "3 hours ago" },
];

export const InProgressEnquiriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('Stage: All');
  const [inProgressList, setInProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // Fetch in-progress enquiries from backend
  React.useEffect(() => {
    fetchInProgress();
  }, []);

  const fetchInProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/enquiries?status=In Progress');
      if (response.data.success) {
        // Map backend data to frontend format
        const mappedData = response.data.data.enquiries.map(enq => ({
          id: enq._id,
          name: enq.name,
          phone: enq.phone,
          interest: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (typeof enq.carInterested === 'string' ? enq.carInterested : (enq.carInterested?._id || 'Not Specified')),
          source: enq.source,
          date: enq.createdAt,
          status: enq.status,
          email: enq.email || '',
          note: enq.note || enq.notes || '',
          assignedTo: 'Assigned',
          stage: enq.stage || 'Negotiation',
          lastUpdate: getTimeAgo(enq.updatedAt)
        }));
        setInProgressList(mappedData);
      }
    } catch (error) {
      console.error('Error fetching in-progress enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMins = Math.floor((now - date) / (1000 * 60));
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleSaveEnquiry = async (data) => {
    try {
      if (editingEnquiry) {
        await api.put(`/crm/enquiries/${editingEnquiry.id}`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          note: data.note
        });
      }
      await fetchInProgress();
      setIsModalOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving enquiry:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleEditClick = (enquiry) => {
    setEditingEnquiry({
      ...enquiry,
      interest: enquiry.interest
    });
    setIsModalOpen(true);
  };

  // Filter Logic
  const filteredInProgress = inProgressList.filter(enquiry => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.interest.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'Stage: All' || enquiry.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Enquiries</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">In Progress</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">In Progress leads</h1>
          <p className="text-gray-500 text-sm">Track active leads moving through the funnel.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Name or interest..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ThemedDropdown 
          options={['Stage: All', 'Negotiation', 'Doc Verification', 'Test Drive Done']}
          value={stageFilter}
          onChange={(val) => setStageFilter(val)}
          className="bg-white text-sm"
          width="w-44"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Lead Details</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      Loading leads...
                    </div>
                  </td>
                </tr>
              ) : filteredInProgress.length > 0 ? (
                filteredInProgress.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{enquiry.name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                        <MdPhone size={10} /> {enquiry.phone}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{enquiry.interest}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100">
                        {enquiry.stage}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">Updated {enquiry.lastUpdate}</div>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {enquiry.assignedTo}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(enquiry); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <MdEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-sm text-gray-500 border-t border-gray-100">
          Showing {filteredInProgress.length} of {inProgressList.length} active leads
        </div>
      </div>

      <CreateEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEnquiry}
        initialData={editingEnquiry}
      />
    </div>
  );
};
// Mock Data for Follow-up Enquiries
const MOCK_FOLLOW_UPS = [
  { id: 1, name: "Simran Kaur", phone: "+91 99880 00011", car: "Baleno", dueDate: "Yesterday", time: "-", note: "Ask for Aadhaar copy", status: "Overdue" },
  { id: 2, name: "Priya Singh", phone: "+91 99887 76655", car: "Swift Dzire", dueDate: "Today", time: "2:00 PM", note: "Call regarding loan approval", status: "Due Today" },
  { id: 3, name: "Rahul Kumar", phone: "+91 98765 43210", car: "Innova Crysta", dueDate: "Tomorrow", time: "10:00 AM", note: "Confirm Test Drive slot", status: "Upcoming" },
];

export const FollowUpsEnquiriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Show: All');
  const [assigneeFilter, setAssigneeFilter] = useState('Assigned to Me');
  const [followUpsList, setFollowUpsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // Fetch follow-up enquiries from backend
  React.useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/enquiries?status=Follow-up');
      if (response.data.success) {
        setFollowUpsList(response.data.data.enquiries.map(enq => ({
          id: enq._id,
          name: enq.name,
          phone: enq.phone,
          interest: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (typeof enq.carInterested === 'string' ? enq.carInterested : (enq.carInterested?._id || 'Not Specified')),
          car: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (typeof enq.carInterested === 'string' ? enq.carInterested : (enq.carInterested?._id || 'Not Specified')),
          date: enq.createdAt,
          dueDate: getDueDate(enq.updatedAt),
          time: '-',
          note: enq.note || enq.notes || 'N/A',
          status: getFollowUpStatus(enq.updatedAt),
          email: enq.email || ''
        })));
      }
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDueDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1); // Mock: next day follows
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const getFollowUpStatus = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return 'Overdue';
    if (d.toDateString() === today.toDateString()) return 'Due Today';
    return 'Upcoming';
  };

  const handleSaveEnquiry = async (data) => {
    try {
      if (editingEnquiry) {
        await api.put(`/crm/enquiries/${editingEnquiry.id}`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          status: data.status,
          note: data.note
        });
      }
      await fetchFollowUps();
      setIsModalOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleEditClick = (enquiry) => {
    setEditingEnquiry({
      ...enquiry,
      interest: enquiry.car
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Overdue': return 'text-red-600 bg-red-50 border-red-100';
      case 'Due Today': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const filteredFollowUps = followUpsList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Show: All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkDone = (id) => {
    setFollowUpsList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Enquiries</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Follow-ups</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up Leads</h1>
          <p className="text-gray-500 text-sm">Never miss a potential customer. Track your calls.</p>
        </div>
        <button
          onClick={() => navigate('/crm/enquiries/calendar')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-colors"
        >
          <MdCalendarToday size={20} />
          Calendar View
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Name or Note..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <ThemedDropdown 
            options={['Show: All', 'Overdue', 'Due Today', 'Upcoming']}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/30 border-b border-orange-100 text-xs uppercase tracking-wider text-orange-800 font-bold">
                <th className="p-4">Customer</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Note / Task</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      Loading follow-ups...
                    </div>
                  </td>
                </tr>
              ) : filteredFollowUps.length > 0 ? (
                filteredFollowUps.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                        {item.car} • {item.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{item.dueDate}</div>
                      {item.time !== '-' && <div className="text-xs text-gray-500">{item.time}</div>}
                    </td>
                    <td className="p-4 text-gray-600 italic line-clamp-1">
                      "{item.note}"
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <MdEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No scheduled follow-ups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-sm text-gray-500 border-t border-gray-100">
          Showing {filteredFollowUps.length} of {followUpsList.length} follow-ups
        </div>
      </div>

      <CreateEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEnquiry}
        initialData={editingEnquiry}
      />
    </div>
  );
};
// Mock Data for Converted Enquiries
const MOCK_CONVERTED_ENQUIRIES = [
  { id: 1, name: "Rohit Sharma", bookingId: "BK-2025-001", car: "Innova Crysta", amount: "₹ 15,000", convertedBy: "Rajesh (Sales)", date: "20 Dec 2025" },
  { id: 2, name: "Ankita Patel", bookingId: "BK-2025-002", car: "Swift Dzire", amount: "₹ 8,500", convertedBy: "Priya (Admin)", date: "18 Dec 2025" },
  { id: 3, name: "Suresh Raina", bookingId: "BK-2025-003", car: "Mahindra Thar", amount: "₹ 22,000", convertedBy: "Rajesh (Sales)", date: "15 Dec 2025" },
];

export const ConvertedEnquiriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Date: All Time');
  const [convertedList, setConvertedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // Fetch converted enquiries from backend
  React.useEffect(() => {
    fetchConverted();
  }, []);

  const fetchConverted = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/enquiries?status=Converted');
      if (response.data.success) {
        setConvertedList(response.data.data.enquiries.map(enq => ({
          id: enq._id,
          name: enq.name,
          phone: enq.phone,
          car: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (enq.carInterested || 'Not Specified'),
          bookingId: enq.bookingId || 'N/A',
          amount: enq.revenue ? `₹ ${enq.revenue.toLocaleString()}` : (enq.amount || '₹ 0'),
          convertedBy: 'System',
          date: new Date(enq.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          rawDate: new Date(enq.updatedAt),
          email: enq.email || '',
          note: enq.note || enq.notes || ''
        })));
      }
    } catch (error) {
      console.error('Error fetching converted:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEnquiry = async (data) => {
    try {
      if (editingEnquiry) {
        await api.put(`/crm/enquiries/${editingEnquiry.id}`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          notes: data.note
        });
      }
      await fetchConverted();
      setIsModalOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleEditClick = (enquiry) => {
    setEditingEnquiry({
      ...enquiry,
      interest: enquiry.car
    });
    setIsModalOpen(true);
  };

  const filteredConverted = convertedList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    const itemDate = item.rawDate;
    const now = new Date();

    if (dateFilter === 'Date: This Month') {
      matchesDate = itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear();
    } else if (dateFilter === 'Last Month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      matchesDate = itemDate.getMonth() === lastMonth.getMonth() &&
        itemDate.getFullYear() === lastMonth.getFullYear();
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Enquiries</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Converted</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Converted Enquiries</h1>
          <p className="text-gray-500 text-sm">Successfully closed leads and generated revenue.</p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Customer or Booking ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <ThemedDropdown 
            options={['Date: All Time', 'Date: This Month', 'Last Month']}
            value={dateFilter}
            onChange={(val) => setDateFilter(val)}
            className="bg-white text-sm"
            width="w-40"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-50/30 border-b border-green-100 text-xs uppercase tracking-wider text-green-800 font-bold">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Booking Info</th>
                <th className="p-4">Converted By</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      Loading conversions...
                    </div>
                  </td>
                </tr>
              ) : filteredConverted.length > 0 ? (
                filteredConverted.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.date}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.car}</div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          {item.convertedBy.charAt(0)}
                        </span>
                        {item.convertedBy}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <MdEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No converted enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-sm text-gray-500 border-t border-gray-100">
          Showing {filteredConverted.length} of {convertedList.length} conversions
        </div>
      </div>

      <CreateEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEnquiry}
        initialData={editingEnquiry}
      />
    </div>
  );
};
// Mock Data for Closed Enquiries
const MOCK_CLOSED_ENQUIRIES = [
  { id: 1, name: "Kavita R.", phone: "+91 98989 89898", reason: "Price Too High", date: "10 Dec 2025", note: "Wanted 20% discount" },
  { id: 2, name: "John Doe", phone: "+91 91122 33445", reason: "Booked w/ Competitor", date: "05 Dec 2025", note: "Found cheaper rate elsewhere" },
  { id: 3, name: "Alice Smith", phone: "+91 77788 99900", reason: "Plan Cancelled", date: "01 Dec 2025", note: "Trip cancelled due to emergency" },
];

export const ClosedEnquiriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('Reason: All');
  const [closedList, setClosedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  // Fetch closed enquiries from backend
  React.useEffect(() => {
    fetchClosed();
  }, []);

  const fetchClosed = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crm/enquiries?status=Closed');
      if (response.data.success) {
        setClosedList(response.data.data.enquiries.map(enq => ({
          id: enq._id,
          name: enq.name,
          phone: enq.phone,
          reason: enq.lostReason || 'Closed',
          date: new Date(enq.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          note: enq.notes || '',
          email: enq.email || '',
          car: enq.carInterested?.brand ? `${enq.carInterested.brand} ${enq.carInterested.model}` : (enq.carInterested || 'Not Specified'),
          source: enq.source
        })));
      }
    } catch (error) {
      console.error('Error fetching closed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEnquiry = async (data) => {
    try {
      if (editingEnquiry) {
        await api.put(`/crm/enquiries/${editingEnquiry.id}`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          carInterested: data.interest,
          source: data.source,
          notes: data.note
        });
      }
      await fetchClosed();
      setIsModalOpen(false);
      setEditingEnquiry(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleEditClick = (enquiry) => {
    setEditingEnquiry({
      ...enquiry,
      interest: enquiry.car
    });
    setIsModalOpen(true);
  };

  const filteredClosed = closedList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);
    const matchesReason = reasonFilter === 'Reason: All' || item.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const handleRestore = (id) => {
    setClosedList(closedList.filter(item => item.id !== id));
    // alert("Enquiry restored to Active!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span>
            <span>/</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/enquiries/all')}>Enquiries</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">Closed</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Closed Enquiries</h1>
          <p className="text-gray-500 text-sm">Leads marked as lost or cancelled.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Name or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <ThemedDropdown 
            options={['Reason: All', 'Price Too High', 'Booked w/ Competitor', 'Plan Cancelled', 'Change of Mind']}
            value={reasonFilter}
            onChange={(val) => setReasonFilter(val)}
            className="bg-white text-sm"
            width="w-44"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Lead Details</th>
                <th className="p-4">Lost Reason</th>
                <th className="p-4">Date Closed</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      Loading closed leads...
                    </div>
                  </td>
                </tr>
              ) : filteredClosed.length > 0 ? (
                filteredClosed.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                        <MdPhone size={10} /> {item.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold border border-red-100">
                        {item.reason}
                      </span>
                      {item.note && <p className="text-gray-400 text-xs mt-1 italic line-clamp-1">"{item.note}"</p>}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {item.date}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <MdEdit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No closed enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 text-sm text-gray-500 border-t border-gray-100">
          Showing {filteredClosed.length} of {closedList.length} closed leads
        </div>
      </div>

      <CreateEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEnquiry}
        initialData={editingEnquiry}
      />
    </div>
  );
};

// Mock Data for Calendar Events


export const EnquiryDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchEnquiryDetails();
  }, [id]);

  const fetchEnquiryDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/crm/enquiries/${id}`);
      if (response.data.success) {
        setEnquiry(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500">Loading lead details...</p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <h2 className="text-2xl font-bold text-gray-800">Enquiry Not Found</h2>
        <button onClick={() => navigate('/crm/enquiries/all')} className="mt-4 text-indigo-600 hover:underline">Back to List</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header / Back */}
      <button
        onClick={() => navigate('/crm/enquiries/all')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <MdArrowBack /> Back to Enquiries
      </button>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Banner/Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-900 to-blue-900 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-gray-100 text-3xl font-bold text-gray-400">
              {enquiry.name?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{enquiry.name}</h1>
              <div className="flex items-center gap-4 text-gray-500 mt-2 text-sm">
                <span className="flex items-center gap-1"><MdPhone /> {enquiry.phone}</span>
                <span className="flex items-center gap-1"><MdEmail /> {enquiry.email || 'No Email'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-full font-bold text-sm bg-blue-50 text-blue-700 border border-blue-100`}>
                {enquiry.status}
              </div>
              <button className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
                <MdCall />
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MdFolderOpen className="text-indigo-600" /> Lead Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Interested Car</span>
                    <span className="font-semibold text-gray-900">
                      {enquiry.carInterested?.brand ? `${enquiry.carInterested.brand} ${enquiry.carInterested.model}` : (enquiry.carInterested || 'Not Specified')}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Source</span>
                    <span className="font-semibold text-gray-900">{enquiry.source}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Enquiry Date</span>
                    <span className="font-semibold text-gray-900">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Last Update</span>
                    <span className="font-semibold text-gray-900">{new Date(enquiry.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Actions / Notes */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                    <MdCall size={18} /> Call Customer
                  </button>
                  <button className="p-3 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                    <MdEmail size={18} /> Send Email
                  </button>
                  <button className="col-span-2 p-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <MdCalendarToday size={18} /> Schedule Follow-up
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">Notes</h3>
                <p className="text-yellow-700 text-sm italic">
                  "{enquiry.notes || 'No notes added yet.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
