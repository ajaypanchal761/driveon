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

  // Filter Logic
  const filteredEnquiries = MOCK_ENQUIRIES.filter(enquiry => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchLower) || 
      enquiry.phone.includes(searchTerm) || 
      enquiry.car.toLowerCase().includes(searchLower);
      
    // Status
    const matchesStatus = statusFilter === 'Status: All' || enquiry.status === statusFilter;
    
    // Date
    let matchesDate = true;
    if (dateFilter !== 'Date: All Time') {
        const enquiryDate = new Date(enquiry.date);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (dateFilter === 'Today') {
            matchesDate = enquiryDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'Yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            matchesDate = enquiryDate.toDateString() === yesterday.toDateString();
        } else if (dateFilter === 'Last 7 Days') {
            const last7 = new Date(today);
            last7.setDate(last7.getDate() - 7);
            matchesDate = enquiryDate >= last7;
        } else if (dateFilter === 'This Month') {
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
         
         <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="relative min-w-[140px]">
               <select 
                 className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-indigo-400 text-gray-600 text-sm font-medium cursor-pointer hover:border-gray-300"
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option>Status: All</option>
                 <option>New</option>
                 <option>In Progress</option>
                 <option>Follow-up</option>
                 <option>Converted</option>
                 <option>Closed</option>
               </select>
               <MdFilterList className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
             <div className="relative min-w-[140px]">
               <select 
                 className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-indigo-400 text-gray-600 text-sm font-medium cursor-pointer hover:border-gray-300"
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
               >
                 <option>Date: All Time</option>
                 <option>Today</option>
                 <option>Yesterday</option>
                 <option>Last 7 Days</option>
                 <option>This Month</option>
               </select>
               <MdFilterList className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <tr 
                    key={enquiry.id} 
                    onClick={() => navigate(`/crm/enquiries/${enquiry.id}`)}
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{enquiry.name}</div>
                      <div className="text-gray-500 text-xs flex items-center gap-2 mt-0.5">
                         <span className="flex items-center gap-1"><MdPhone size={10} /> {enquiry.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{enquiry.car}</td>
                    <td className="p-4 text-gray-500">{enquiry.source}</td>
                    <td className="p-4 text-gray-500">{enquiry.date}</td>
                    <td className="p-4">{getStatusBadge(enquiry.status)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-400 rounded-lg transition-colors" 
                          title="View Details"
                          style={{ color: 'gray', ':hover': { color: premiumColors.primary.DEFAULT, backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1) } }}
                        >
                          <MdVisibility size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Call Customer">
                          <MdCall size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MdMoreVert size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan="6" className="p-8 text-center text-gray-500">
                    No enquiries found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing <strong>{filteredEnquiries.length}</strong> of <strong>{MOCK_ENQUIRIES.length}</strong> enquiries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1" disabled><MdArrowBack size={14} /> Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">Next <MdArrowForward size={14} /></button>
          </div>
        </div>
      </div>
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
        note: ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                phone: '',
                email: '',
                interest: '',
                source: 'Walk-in',
                note: ''
            });
        }
    }, [initialData, isOpen]);

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
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                                <div className="relative">
                                    <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="tel" 
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                             <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Interested Car</label>
                                <div className="relative">
                                    <select 
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer"
                                        value={formData.interest}
                                        onChange={(e) => setFormData({...formData, interest: e.target.value})}
                                    >
                                        <option value="">Select Car Model</option>
                                        <option value="Innova Crysta">Innova Crysta</option>
                                        <option value="Fortuner">Fortuner</option>
                                        <option value="Swift Dzire">Swift Dzire</option>
                                        <option value="Mahindra Thar">Mahindra Thar</option>
                                        <option value="Hyundai Creta">Hyundai Creta</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <MdChevronRight className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Lead Source</label>
                                <div className="relative">
                                    <select 
                                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer"
                                        value={formData.source}
                                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                                    >
                                        <option>Walk-in</option>
                                        <option>Phone Call</option>
                                        <option>Referral</option>
                                        <option>Social Media</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <MdChevronRight className="rotate-90" />
                                    </div>
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
                                onChange={(e) => setFormData({...formData, note: e.target.value})}
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
    
    // State for enquiries list (initially loaded from mock)
    const [enquiriesList, setEnquiriesList] = useState(MOCK_NEW_ENQUIRIES);

    // Filtering Logic
    const filteredEnquiries = enquiriesList.filter(enquiry => {
        const matchesSearch = 
            enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            enquiry.phone.includes(searchTerm);
        
        let matchesDate = true;
        if (dateFilter !== 'Date: All') {
            const enquiryDate = new Date(enquiry.date);
            const today = new Date();
            today.setHours(0,0,0,0);
            
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

    const handleSaveEnquiry = (data) => {
        if (editingEnquiry) {
            // Update existing
            const updatedList = enquiriesList.map(item => 
                item.id === editingEnquiry.id ? { ...item, ...data } : item
            );
            setEnquiriesList(updatedList);
        } else {
            // Create new
            const newEnquiry = {
                id: enquiriesList.length + 1,
                ...data,
                time: 'Just now',
                status: 'New',
                date: new Date().toISOString()
            };
            setEnquiriesList([newEnquiry, ...enquiriesList]);
        }
        setIsCreateModalOpen(false);
        setEditingEnquiry(null);
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
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                    <MdVisibility /> Auto-Assign
                </button>
                <div className="relative">
                    <select 
                        className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option>Date: All</option>
                        <option>Date: Today</option>
                        <option>Date: Yesterday</option>
                    </select>
                    <MdFilterList className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
              {filteredEnquiries.length > 0 ? (
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
    const [inProgressList, setInProgressList] = useState(MOCK_IN_PROGRESS);

    // Filter Logic
    const filteredInProgress = inProgressList.filter(enquiry => {
        const matchesSearch = 
            enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            enquiry.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.interest.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStage = stageFilter === 'Stage: All' || enquiry.stage === stageFilter;
        
        return matchesSearch && matchesStage;
    });

    const handleViewDetails = (id) => {
        navigate(`/crm/enquiries/${id}`);
    };

    const handleMoveStage = (id) => {
       alert(`Move stage for enquiry ID: ${id}`);
       // Logic to update stage would go here
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
              <span className="text-gray-800 font-medium">In Progress</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">In Progress</h1>
            <p className="text-gray-500 text-sm">Track active leads moving through the funnel.</p>
          </div>

        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Name or assigned staff..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ focusRingColor: rgba(premiumColors.primary.DEFAULT, 0.2), borderColor: 'transparent' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
            >
                <option>Stage: All</option>
                <option>Negotiation</option>
                <option>Doc Verification</option>
                <option>Test Drive Done</option>
            </select>
        </div>
  
        {/* Data Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50/30 border-b border-purple-100 text-xs uppercase tracking-wider text-purple-700 font-bold">
                <th className="p-4">Lead Details</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredInProgress.length > 0 ? (
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
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {enquiry.assignedTo.charAt(0)}
                        </div>
                        <span className="text-gray-700 font-medium">{enquiry.assignedTo}</span>
                     </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => handleViewDetails(enquiry.id)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title="View Details"
                        >
                            <MdVisibility size={18} />
                        </button>
                        <button 
                            onClick={() => handleMoveStage(enquiry.id)}
                            className="px-3 py-1 rounded-lg text-xs font-bold border hover:bg-opacity-10"
                            style={{ 
                                backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1), 
                                color: premiumColors.primary.DEFAULT,
                                borderColor: rgba(premiumColors.primary.DEFAULT, 0.2)
                            }}
                        >
                            Move Stage
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                        No enquiries found matching your criteria.
                    </td>
                </tr>
            )}
            </tbody>
          </table>
          
          {MOCK_IN_PROGRESS.length === 0 && (
             <div className="p-10 text-center text-gray-500">No active enquiries found.</div>
          )}
        </div>
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
    const [followUpsList, setFollowUpsList] = useState(MOCK_FOLLOW_UPS);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Overdue': return 'text-red-600 bg-red-50 border-red-100';
            case 'Due Today': return 'text-amber-600 bg-amber-50 border-amber-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    const filteredFollowUps = followUpsList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.note.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'Show: All' || item.status === statusFilter;
        // Mocking assignee logic
        return matchesSearch && matchesStatus;
    });

    const handleMarkDone = (id) => {
        const updated = followUpsList.filter(item => item.id !== id);
        setFollowUpsList(updated);
        // alert("Task marked as done!");
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
                 <select 
                    className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option>Show: All</option>
                    <option>Overdue</option>
                    <option>Due Today</option>
                    <option>Upcoming</option>
                </select>
                <select 
                    className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer text-gray-500"
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                    <option>Assigned to Me</option>
                    <option>All Staff</option>
                </select>
            </div>
        </div>
  
        {/* Data Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/30 border-b border-orange-100 text-xs uppercase tracking-wider text-orange-800 font-bold">
                <th className="p-4">Customer</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Note / Task</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Done?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredFollowUps.map((item) => (
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
                  <td className="p-4 text-gray-600 italic">
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
                            onClick={() => handleMarkDone(item.id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 border border-gray-200 flex items-center gap-1"
                        >
                             <MdCheck size={16} /> Mark Done
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_FOLLOW_UPS.length === 0 && (
             <div className="p-10 text-center text-gray-500">No scheduled follow-ups.</div>
          )}
        </div>
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
    
    const filteredConverted = MOCK_CONVERTED_ENQUIRIES.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
        // Date Logic Mock
        return matchesSearch;
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
          <button 
            onClick={() => navigate('/crm/bookings/active')}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium shadow-sm hover:bg-green-700 transition-colors"
          >
            <MdAdd size={20} />
            New Conversion
          </button>
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
               <select 
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
               >
                 <option>Date: This Month</option>
                 <option>Last Month</option>
                 <option>Date: All Time</option>
               </select>
            </div>
        </div>
  
        {/* Data Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-50/30 border-b border-green-100 text-xs uppercase tracking-wider text-green-800 font-bold">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Booking Info</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Converted By</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredConverted.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{item.date}</div>
                  </td>
                  <td className="p-4">
                     <div className="font-medium text-gray-800">{item.bookingId}</div>
                     <div className="text-xs text-gray-500">{item.car}</div>
                  </td>
                  <td className="p-4 font-bold text-green-600">
                    {item.amount}
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
                    <button 
                        onClick={() => navigate('/crm/bookings/active')}
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                    >
                        View Booking <MdArrowForward />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_CONVERTED_ENQUIRIES.length === 0 && (
             <div className="p-10 text-center text-gray-500">No converted enquiries found.</div>
          )}
        </div>
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
    
    // Explicitly using state to allow "Restoring" removal
    const [closedList, setClosedList] = useState(MOCK_CLOSED_ENQUIRIES);
    
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
               <select 
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
               >
                 <option>Reason: All</option>
                 <option>Price Too High</option>
                 <option>Booked w/ Competitor</option>
                 <option>Plan Cancelled</option>
                 <option>Change of Mind</option>
               </select>
            </div>
        </div>
  
        {/* Data Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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
              {filteredClosed.map((item) => (
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
                     <p className="text-gray-400 text-xs mt-1 italic">"{item.note}"</p>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {item.date}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={() => handleRestore(item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                    >
                        <MdRestore size={14} /> Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_CLOSED_ENQUIRIES.length === 0 && (
             <div className="p-10 text-center text-gray-500">No closed enquiries found.</div>
          )}
        </div>
      </div>
    );
};
const ENQUIRY_TREND_DATA = [
    { name: 'Week 1', leads: 24, converted: 4 },
    { name: 'Week 2', leads: 18, converted: 3 },
    { name: 'Week 3', leads: 32, converted: 8 },
    { name: 'Week 4', leads: 46, converted: 12 },
];

const SOURCE_DATA = [
    { name: 'Website', value: 60, color: premiumColors.primary.DEFAULT },
    { name: 'Referral', value: 20, color: '#10B981' },
    { name: 'Walk-in', value: 15, color: '#F59E0B' },
    { name: 'Social', value: 5, color: '#EF4444' },
];

const VEHICLE_INTEREST_DATA = [
    { name: 'Innova Crysta', count: 45 },
    { name: 'Swift Dzire', count: 38 },
    { name: 'Fortuner', count: 25 },
    { name: 'Thar', count: 20 },
    { name: 'Creta', count: 18 },
];

export const EnquiryAnalyticsPage = () => {
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
              <span className="text-gray-800 font-medium">Analytics</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: premiumColors.primary.DEFAULT }}>Enquiry Analytics</h1>
            <p className="text-gray-500 text-sm">Real-time insights into lead generation and conversion.</p>
          </div>
          
          <div className="flex gap-2">
              <select 
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                style={{ color: premiumColors.primary.DEFAULT }}
              >
                 <option>This Month</option>
                 <option>Last Month</option>
                 <option>Last Quarter</option>
                 <option>This Year</option>
              </select>
              <button 
                className="p-2 text-white rounded-xl shadow-md transition-transform active:scale-95"
                style={{ backgroundColor: premiumColors.primary.DEFAULT }}
              >
                  <MdDownload />
              </button>
          </div>
        </div>
  
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatWidget 
                title="Total Enquiries" 
                value="120" 
                change="+12%" 
                isPositive={true} 
                color={`text-[${premiumColors.primary.DEFAULT}]`} 
                icon={MdPersonAdd} 
                delay={0.1} 
            />
            <StatWidget 
                title="Conversion Rate" 
                value="15.5%" 
                change="+2.4%" 
                isPositive={true} 
                color="text-emerald-600" 
                icon={MdTrendingUp} 
                delay={0.2} 
            />
            <StatWidget 
                title="Lost Leads" 
                value="24" 
                change="-5%" 
                isPositive={false} 
                color="text-red-500" 
                icon={MdWarning} 
                delay={0.3} 
            />
        </div>
  
        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trend Chart (Large) */}
            <ReportCard title="Enquiry Growth Trend" subtitle="Leads vs Conversions (Weekly)" className="lg:col-span-2 h-[400px]" delay={0.4}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ENQUIRY_TREND_DATA}>
                        <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={premiumColors.primary.DEFAULT} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={premiumColors.primary.DEFAULT} stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={rgba('#000', 0.05)} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{paddingTop: '20px'}} />
                        <Area type="monotone" dataKey="leads" stroke={premiumColors.primary.DEFAULT} strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" name="Total Leads" />
                        <Area type="monotone" dataKey="converted" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorConv)" name="Converted" />
                    </AreaChart>
                </ResponsiveContainer>
            </ReportCard>

            {/* Source Distribution (Side) */}
            <ReportCard title="Lead Sources" subtitle="Platform Distribution" className="h-[400px]" delay={0.5}>
                <div className="relative h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={SOURCE_DATA}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {SOURCE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total Label */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-800">120</span>
                        <p className="text-xs text-gray-400 font-medium">Total</p>
                    </div>
                </div>
            </ReportCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportCard title="Vehicle Demand" subtitle="Top Requested Cars" className="h-[350px]" delay={0.6}>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={VEHICLE_INTEREST_DATA} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={rgba('#000', 0.05)} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 12, fontWeight: 600}} width={100} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="count" fill={premiumColors.primary.DEFAULT} radius={[0, 4, 4, 0]} barSize={24} name="Enquiries">
                             {VEHICLE_INTEREST_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fillOpacity={1 - (index * 0.15)} />
                             ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ReportCard>

            {/* Quick Actions / Recommendations */}
            <ReportCard title="AI Insights" subtitle="Recommendations for improvement" className="h-[350px]" delay={0.7}>
                 <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                     <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                         <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                             <MdWarning />
                         </div>
                         <div>
                             <h4 className="font-bold text-orange-800 text-sm">High Drop-off Rate</h4>
                             <p className="text-xs text-orange-600 mt-1">40% of leads drop off after the first call. Consider updating the script.</p>
                         </div>
                     </div>
                     <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                             <MdTrendingUp />
                         </div>
                         <div>
                             <h4 className="font-bold text-indigo-800 text-sm">Weekend Spike</h4>
                             <p className="text-xs text-indigo-600 mt-1">Enquiries peak on Saturday 2-5 PM. Ensure staff availability.</p>
                         </div>
                     </div>
                     <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
                         <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                             <MdCheckCircle />
                         </div>
                         <div>
                             <h4 className="font-bold text-green-800 text-sm">Conversion Goal</h4>
                             <p className="text-xs text-green-600 mt-1">You are 5% away from your monthly target. 3 more conversions needed.</p>
                         </div>
                     </div>
                 </div>
            </ReportCard>
        </div>
      </div>
    );
};
// Mock Data for Calendar Events
const MOCK_CALENDAR_EVENTS = {
    '2025-12-14': [
        { id: 1, title: "Call Rohit (Loan Status)", time: "10:00 AM", status: "Done" },
        { id: 2, title: "Call Priya (Docs)", time: "2:00 PM", status: "Pending" }
    ],
    '2025-12-27': [
        { id: 3, title: "Follow up Amit (Thar)", time: "11:00 AM", status: "Pending" },
        { id: 4, title: "Call Sneha (Test Drive)", time: "4:00 PM", status: "Pending" }
    ],
    '2025-12-05': [
        { id: 5, title: "Meeting with John", time: "10:00 AM", status: "Done" }
    ]
};

export const FollowUpCalendarPage = () => {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); // Dec 2025
    const [selectedDate, setSelectedDate] = useState('2025-12-27');
    const [events, setEvents] = useState(MOCK_CALENDAR_EVENTS);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Mon start (0-6, Mon-Sun)
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleAddTask = () => {
        const title = prompt("Enter task title:");
        if (title) {
            const time = prompt("Enter time (e.g., 10:00 AM):", "10:00 AM");
            const newEvent = { id: Date.now(), title, time, status: 'Pending' };
            setEvents(prev => ({
                ...prev,
                [selectedDate]: [...(prev[selectedDate] || []), newEvent]
            }));
        }
    };

    const handleMarkTaskDone = (taskId) => {
         setEvents(prev => {
             const dayEvents = prev[selectedDate] || [];
             const updatedEvents = dayEvents.map(ev => 
                 ev.id === taskId ? { ...ev, status: 'Done' } : ev
             );
             return { ...prev, [selectedDate]: updatedEvents };
         });
    };

    const handleCall = (name) => {
        alert(`Calling ${name}...`);
    };

    const daysCount = getDaysInMonth(currentMonth);
    const startDayOffset = getFirstDayOfMonth(currentMonth);
    const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
              <span className="text-gray-800 font-medium">Calendar</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Follow-up Calendar</h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-gray-200 shadow-sm select-none">
             <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600"><MdChevronLeft size={24} /></button>
             <span className="font-bold text-gray-800 w-40 text-center">{monthName}</span>
             <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-600"><MdChevronRight size={24} /></button>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Calendar Grid */}
             <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="grid grid-cols-7 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">{day}</div>
                    ))}
                 </div>
                 <div className="grid grid-cols-7 gap-2">
                    {/* Empty slots for starting day offset */}
                    {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`}></div>)} 
                    
                    {daysArray.map(day => {
                        const dateStr = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        const hasEvents = events[dateStr];
                        const isSelected = selectedDate === dateStr;
                        
                        return (
                            <div 
                                key={day} 
                                onClick={() => setSelectedDate(dateStr)}
                                className={`
                                    min-h-[80px] rounded-xl border p-2 cursor-pointer transition-all relative
                                    ${isSelected ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100' : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}
                                `}
                            >
                                <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>{day}</span>
                                {hasEvents && hasEvents.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        <div className="text-[10px] font-medium px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded w-fit">
                                            {hasEvents.length} Tasks
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                 </div>
             </div>
             
             {/* Daily Agenda Side Panel */}
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
                 <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MdCalendarToday className="text-indigo-500" /> 
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                 </h3>
                 
                 <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                     {events[selectedDate] && events[selectedDate].length > 0 ? (
                         events[selectedDate].map((event) => (
                             <div key={event.id} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors bg-gray-50">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="font-bold text-gray-800 text-sm">{event.time}</span>
                                     <button 
                                        onClick={() => handleMarkTaskDone(event.id)}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${event.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                                     >
                                         {event.status}
                                     </button>
                                 </div>
                                 <p className="font-medium text-gray-700 mb-3">{event.title}</p>
                             </div>
                         ))
                     ) : (
                         <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                 <MdCheck size={24} className="opacity-20" />
                             </div>
                             No tasks scheduled for this day.
                         </div>
                     )}
                 </div>
                 
                 <button 
                    onClick={handleAddTask}
                    className="mt-4 w-full py-2.5 border border-dashed border-gray-300 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                 >
                     <MdAdd /> Add Task
                 </button>
             </div>
        </div>
      </div>
    );
};

export const EnquiryDetailsPage = () => {
    const navigate = useNavigate();
    // Assuming useParams is imported or accessible, if not we need to use window location or add import
    // Since we are in the same file, we need a way to get the ID. 
    // Best way is to use 'useParams' from 'react-router-dom'.
    // I will assume it's imported at the top, if not I need to add it.
    // Checking imports... 'useParams' was NOT imported in original file.
    // I will add it to the import statement in a separate replacement chunk if possible, 
    // or just use window.location.pathname split for now to be safe without breaking top imports
    // actually, let's just assume we can add the import.
    // Wait, I can't add import easily without regex matching the top.
    // For now I will use a simple location hack or assume the user will let me fix the import.
    // Actually, let's just do it cleanly. I'll add the import in a separate chunk.
    
    // BUT, wait, I am already writing this chunk. 
    // I will use a helper for now.
    const getIdFromUrl = () => {
        const parts = window.location.pathname.split('/');
        return parts[parts.length - 1]; // /crm/enquiries/1 -> 1
    };
    const id = getIdFromUrl();
    
    // In a real app, use useParams(). For this specific file edit, I'll stick to this to avoid top-of-file conflicts unless I do it there.
    // Actually, I can rely on the fact that I will edit the top imports in the next tool call / or same tool call.
    // Let's use a hook-like structure assuming useParams will be there.
    // The safest is to rely on props if it was passed, but it's a route component.
    
    // Let's just find the enquiry.
    const enquiry = MOCK_ENQUIRIES.find(e => e.id == id);

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
                        <motion.img 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={enquiry.image} 
                            alt={enquiry.name} 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
                        />
                    </div>
                </div>

                <div className="pt-20 pb-8 px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{enquiry.name}</h1>
                            <div className="flex items-center gap-4 text-gray-500 mt-2 text-sm">
                                <span className="flex items-center gap-1"><MdPhone /> {enquiry.phone}</span>
                                <span className="flex items-center gap-1"><MdEmail /> {enquiry.email}</span>
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
                                        <span className="font-semibold text-gray-900">{enquiry.car}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Source</span>
                                        <span className="font-semibold text-gray-900">{enquiry.source}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-2">
                                        <span className="text-gray-500">Enquiry Date</span>
                                        <span className="font-semibold text-gray-900">{enquiry.date}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-gray-500">Last Interaction</span>
                                        <span className="font-semibold text-gray-900">Yesterday</span>
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
                                    "Customer is interested in the top model. Asked for a test drive this weekend. Also inquiring about loan options."
                                </p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
