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
  MdAdd
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
        {vendor.verified && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-bl-xl shadow-sm z-10">
                <MdVerified size={16} />
            </div>
        )}
        
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{vendor.name}</h3>
                <p className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md inline-block mt-1">{vendor.type}</p>
            </div>
        </div>

        <div className="space-y-2.5 text-sm text-gray-600 mb-5">
            <div className="flex items-center gap-2">
                <MdPhone className="text-indigo-300" /> {vendor.phone}
            </div>
            <div className="flex items-center gap-2">
                <MdEmail className="text-indigo-300" /> {vendor.email}
            </div>
            <div className="flex items-center gap-2">
                <MdDirectionsCar className="text-indigo-300" /> <span className="font-bold text-gray-800">{vendor.cars} Active Cars</span>
            </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
             <div className="flex items-center gap-1 text-amber-500 font-bold">
                 <MdStar /> {vendor.rating}
             </div>
             <div className="text-right">
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Balance</p>
                 <p className={`text-sm font-bold ${vendor.balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                     ₹ {Math.abs(vendor.balance).toLocaleString()} {vendor.balance > 0 ? 'Due' : 'Cr'}
                 </p>
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
                {payment.verified && <MdVerified className="text-blue-500" size={14} />}
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

const MOCK_CAR_USAGE = [
     { id: 1, vendor: "Rajesh Motors", car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 45k", trips: 12, utilization: 85 },
     { id: 2, vendor: "City Cabs Inc", car: "Maruti Swift", reg: "PB 10 5678", revenue: "₹ 22k", trips: 28, utilization: 92 },
     { id: 3, vendor: "Elite Wheels", car: "Fortuner Legender", reg: "CH 01 9999", revenue: "₹ 1.2L", trips: 6, utilization: 60 },
];
// Hack for MdBuild since it was not pre-imported in MOCK_PERFORMANCE context due to ordering
import { MdBuild } from 'react-icons/md';

// --- Pages ---

export const AllVendorsPage = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState(MOCK_VENDORS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newVendor, setNewVendor] = useState({ name: '', type: 'Car Provider', phone: '', email: '', image: 'https://randomuser.me/api/portraits/lego/1.jpg', balance: 0, cars: 0, rating: 5.0, verified: false });

    const filteredVendors = vendors.filter(vendor => 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddVendor = () => {
        if (!newVendor.name || !newVendor.phone) return;
        setVendors([...vendors, { ...newVendor, id: Date.now() }]);
        setIsAddModalOpen(false);
        setNewVendor({ name: '', type: 'Car Provider', phone: '', email: '', image: 'https://randomuser.me/api/portraits/lego/1.jpg', balance: 0, cars: 0, rating: 5.0, verified: false });
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/vendors/all')}>Vendors</span> 
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
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-center gap-2">
                         <MdFilterList /> Filter
                     </button>
                     <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
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
                         <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            value={newVendor.name}
                            onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                         <select 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={newVendor.type}
                            onChange={(e) => setNewVendor({...newVendor, type: e.target.value})}
                         >
                             <option>Car Provider</option>
                             <option>Fleet Partner</option>
                             <option>Driver Partner</option>
                             <option>Premium Partner</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            value={newVendor.phone}
                            onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                         <input 
                            type="email" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            value={newVendor.email}
                            onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                         />
                     </div>
                     <button 
                        onClick={handleAddVendor}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                     >
                         Onboard Vendor
                     </button>
                 </div>
             </SimpleModal>
        </div>
    );
};

export const VendorPaymentsPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/vendors/all')}>Vendors</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">Payments</span>
                </div>
                 <h1 className="text-2xl font-bold text-gray-900">Payments & Settlements</h1>
                 <p className="text-gray-500 text-sm">Track vendor payouts and commissions.</p>
             </div>
             <button className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 flex items-center gap-2">
                 <MdDownload /> Report
             </button>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                 <p className="text-red-800 text-xs font-bold uppercase">Total Due (Payouts)</p>
                 <h3 className="text-2xl font-bold text-red-700 mt-1">₹ 2,45,000</h3>
             </div>
             <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                 <p className="text-green-800 text-xs font-bold uppercase">Paid This Month</p>
                 <h3 className="text-2xl font-bold text-green-700 mt-1">₹ 8,20,000</h3>
             </div>
             <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                 <p className="text-blue-800 text-xs font-bold uppercase">Commission Earned</p>
                 <h3 className="text-2xl font-bold text-blue-700 mt-1">₹ 1,15,000</h3>
             </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                     <tr>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Vendor</th>
                         <th className="px-6 py-4">Reference ID</th>
                         <th className="px-6 py-4">Amount</th>
                         <th className="px-6 py-4">Type</th>
                         <th className="px-6 py-4">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                     {MOCK_PAYMENTS.map((payment) => (
                         <PaymentRow key={payment.id} payment={payment} />
                     ))}
                 </tbody>
             </table>
         </div>
    </div>
);
}

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

export const VendorCarUsagePage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
         <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                <span>/</span> 
                <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/vendors/all')}>Vendors</span> 
                <span>/</span> 
                <span className="text-gray-800 font-medium">Car Usage</span>
            </div>
             <h1 className="text-2xl font-bold text-gray-900">Fleet Utilization</h1>
             <p className="text-gray-500 text-sm">Performance of vendor-owned vehicles.</p>
         </div>

         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                     <tr>
                         <th className="px-6 py-4">Vendor</th>
                         <th className="px-6 py-4">Vehicle</th>
                         <th className="px-6 py-4">Trips (Available)</th>
                         <th className="px-6 py-4">Revenue Generated</th>
                         <th className="px-6 py-4">Utilization</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                     {MOCK_CAR_USAGE.map((item) => (
                         <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-indigo-600">{item.vendor}</td>
                             <td className="px-6 py-4">
                                 <div className="font-medium text-gray-900">{item.car}</div>
                                 <div className="text-xs text-gray-500">{item.reg}</div>
                             </td>
                             <td className="px-6 py-4 text-gray-700 font-bold">{item.trips} Trips</td>
                             <td className="px-6 py-4 text-green-600 font-bold">{item.revenue}</td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="flex-1 bg-gray-100 rounded-full h-2 w-24 overflow-hidden">
                                         <div className={`h-full rounded-full ${item.utilization > 80 ? 'bg-green-500' : item.utilization > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.utilization}%` }}></div>
                                     </div>
                                     <span className="text-xs font-bold text-gray-600">{item.utilization}%</span>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
    </div>
);
}
