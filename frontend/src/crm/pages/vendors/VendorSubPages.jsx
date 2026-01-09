import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  MdPerson, 
  MdStore, 
  MdStar, 
  MdPhone, 
  MdEmail, 
  MdDirectionsCar, 
  MdAttachMoney, 
  MdVerified, 
  MdWarning, 
  MdHistory,
  MdTrendingUp,
  MdBarChart,
  MdPieChart,
  MdFilterList,
  MdMoreVert,
  MdCheckCircle,
  MdSearch,
  MdDownload,
  MdClose,
  MdAdd,
  MdBuild
} from 'react-icons/md';
import { motion } from 'framer-motion';

// --- Shared Components ---

// Reusing SimpleModal pattern
const SimpleModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative m-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MdClose size={20} className="text-gray-500" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-green-50 text-green-700 border-green-200',
    'Inactive': 'bg-red-50 text-red-700 border-red-200',
    'Pending': 'bg-orange-50 text-orange-700 border-orange-200',
    'Verified': 'bg-blue-50 text-blue-700 border-blue-200',
    'Payout': 'bg-red-50 text-red-600 border-red-200',
    'Commission': 'bg-green-50 text-green-600 border-green-200',
    'Processing': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
};

const VendorCard = ({ vendor }) => (
    <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
       className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all group relative overflow-hidden"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#212c40] transition-colors">{vendor.name}</h3>

            </div>
        </div>

        <div className="space-y-2.5 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-2">
                <MdPhone className="text-[#212c40]/40" /> {vendor.phone}
            </div>
            <div className="flex items-center gap-2">
                <MdEmail className="text-[#212c40]/40" /> {vendor.email}
            </div>
        </div>
    </motion.div>
);

const PaymentRow = ({ payment }) => (
    <motion.tr 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="hover:bg-gray-50 transition-colors"
    >
        <td className="px-6 py-4 font-bold text-gray-700">{payment.date}</td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{payment.vendor}</span>
                {payment.verified && <MdVerified className="text-[#1c205c]" size={14} />}
            </div>
        </td>
        <td className="px-6 py-4 text-gray-500">{payment.refId}</td>
        <td className="px-6 py-4 font-bold text-gray-900">₹ {payment.amount.toLocaleString()}</td>
        <td className="px-6 py-4">
            <StatusBadge status={payment.type} />
        </td>
        <td className="px-6 py-4">
             <StatusBadge status={payment.status} />
        </td>
    </motion.tr>
);

// --- Mock Data ---

const MOCK_VENDORS = [
    { id: 1, name: "Rajesh Motors", type: "Car Provider", phone: "+91 98765 00001", email: "rajesh@motors.com", cars: 5, rating: 4.8, balance: 45000, verified: true, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "City Cabs Inc", type: "Fleet Partner", phone: "+91 99887 11111", email: "contact@citycabs.com", cars: 12, rating: 4.5, balance: -12000, verified: true, image: "https://randomuser.me/api/portraits/men/45.jpg" },
    { id: 3, name: "Singh Travels", type: "Driver Partner", phone: "+91 88776 22222", email: "singh@travels.com", cars: 2, rating: 4.2, balance: 8500, verified: false, image: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: 4, name: "Elite Wheels", type: "Premium Partner", phone: "+91 77665 33333", email: "info@elitewheels.com", cars: 8, rating: 4.9, balance: 150000, verified: true, image: "https://randomuser.me/api/portraits/men/85.jpg" },
];

const MOCK_PAYMENTS = [
    { id: 101, date: "26 Dec 2025", vendor: "Rajesh Motors", refId: "TXN-882199", amount: 25000, type: "Payout", status: "Completed", verified: true },
    { id: 102, date: "24 Dec 2025", vendor: "City Cabs Inc", refId: "TXN-882190", amount: 12000, type: "Commission", status: "Completed", verified: true },
    { id: 103, date: "20 Dec 2025", vendor: "Elite Wheels", refId: "TXN-882155", amount: 150000, type: "Payout", status: "Processing", verified: true },
];

const MOCK_HISTORY_LOGS = [
    { id: 1, date: "20 Dec 2025", vendor: "Elite Wheels", action: "Partnered", detail: "Joined as Premium Partner", status: "Verified" },
    { id: 2, date: "15 Dec 2025", vendor: "City Cabs Inc", action: "Fleet Update", detail: "Added 5 new vehicles", status: "Active" },
    { id: 3, date: "10 Dec 2025", vendor: "Rajesh Motors", action: "Payout", detail: "Monthly settlement processed", status: "Completed" },
];




// --- Pages ---

export const AllVendorsPage = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState(MOCK_VENDORS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newVendor, setNewVendor] = useState({ name: '', type: 'Car Provider', phone: '', email: '', image: 'https://randomuser.me/api/portraits/lego/1.jpg', balance: 0, cars: 0, rating: 5.0, verified: false });

    const [errors, setErrors] = useState({});

    const filteredVendors = vendors.filter(vendor => 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const validate = () => {
        let tempErrors = {};
        if (!/^\d{10}$/.test(newVendor.phone)) {
            tempErrors.phone = "Phone number must be 10 digits.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newVendor.email)) {
            tempErrors.email = "Invalid email format.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleAddVendor = () => {
        if (!newVendor.name || !newVendor.phone) return;
        if (!validate()) return;

        setVendors([...vendors, { ...newVendor, id: Date.now() }]);
        setIsAddModalOpen(false);
        setNewVendor({ name: '', type: 'Car Provider', phone: '', email: '', image: 'https://randomuser.me/api/portraits/lego/1.jpg', balance: 0, cars: 0, rating: 5.0, verified: false });
        setErrors({});
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="hover:text-[#212c40] cursor-pointer transition-colors" onClick={() => navigate('/crm/vendors/all')}>Vendors</span> 
                        <span>/</span> 
                        <span className="text-gray-800 font-medium">All Vendors</span>
                    </div>
                     <h1 className="text-2xl font-bold text-gray-900">Vendor Directory</h1>
                     <p className="text-gray-500 text-sm">Manage car providers, drivers, and partners.</p>
                 </div>
                 <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                         <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                         <input 
                            type="text"
                            placeholder="Search vendors..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#212c40]/20 focus:border-[#212c40] transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 bg-[#212c40] text-white rounded-xl shadow-lg shadow-gray-300 hover:bg-[#2a3550] font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                     >
                         <MdStore /> Add Vendor
                     </button>
                 </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {filteredVendors.map(vendor => (
                     <VendorCard key={vendor.id} vendor={vendor} />
                 ))}
             </div>

             {filteredVendors.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <h3 className="text-lg font-bold text-gray-800">No vendors found</h3>
                    <p className="text-gray-500">Try searching for something else.</p>
                </div>
             )}

             <SimpleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Vendor">
                 <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Photo</label>
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                <img src={newVendor.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const imageUrl = URL.createObjectURL(file);
                                        setNewVendor({...newVendor, image: imageUrl});
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-indigo-50 file:text-indigo-700
                                  hover:file:bg-indigo-100"
                            />
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212c40]/20 focus:border-[#212c40]" 
                            value={newVendor.name}
                            onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                         <input 
                            type="text" 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212c40]/20 focus:border-[#212c40] ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                            value={newVendor.phone}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val) && val.length <= 10) {
                                    setNewVendor({...newVendor, phone: val});
                                    if (errors.phone) setErrors({...errors, phone: null});
                                }
                            }}
                            placeholder="10 digit mobile number"
                         />
                         {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                         <input 
                            type="email" 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212c40]/20 focus:border-[#212c40] ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                            value={newVendor.email}
                            onChange={(e) => {
                                setNewVendor({...newVendor, email: e.target.value});
                                if (errors.email) setErrors({...errors, email: null});
                            }}
                            placeholder="example@domain.com"
                         />
                         {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                     </div>
                     <button 
                        onClick={handleAddVendor}
                        className="w-full py-2.5 bg-[#212c40] text-white rounded-xl font-bold hover:bg-[#2a3550] transition-colors shadow-lg shadow-gray-300"
                     >
                         Onboard Vendor
                     </button>
                 </div>
             </SimpleModal>
        </div>
    );
};



export const VendorHistoryPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
         <div className="flex justify-between items-end">
             <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/vendors/all')}>Vendors</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">History</span>
                </div>
                 <h1 className="text-2xl font-bold text-gray-900">Vendor History</h1>
                 <p className="text-gray-500 text-sm">Timeline of partnership milestones.</p>
             </div>
         </div>
         
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Vendor</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Detail</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {MOCK_HISTORY_LOGS.map(log => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-700">{log.date}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{log.vendor}</td>
                            <td className="px-6 py-4 text-indigo-600 font-bold">{log.action}</td>
                            <td className="px-6 py-4 text-gray-600">{log.detail}</td>
                            <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
    </div>
);
}


