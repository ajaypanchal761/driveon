import React from 'react';
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
  MdDownload
} from 'react-icons/md';
import { motion } from 'framer-motion';

// --- Shared Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-green-50 text-green-700 border-green-200',
    'Inactive': 'bg-red-50 text-red-700 border-red-200',
    'Pending': 'bg-orange-50 text-orange-700 border-orange-200',
    'Verified': 'bg-blue-50 text-blue-700 border-blue-200',
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
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.type === 'Payout' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {payment.type}
            </span>
        </td>
        <td className="px-6 py-4">
             <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                 {payment.status}
             </span>
        </td>
        <td className="px-6 py-4 text-right">
             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"><MdMoreVert /></button>
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

const MOCK_PERFORMANCE = [
    { id: 1, metric: "On-Time Arrival", value: "98%", change: "+2%", icon: MdCheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { id: 2, metric: "Avg Customer Rating", value: "4.7/5", change: "+0.2", icon: MdStar, color: "text-yellow-500", bg: "bg-yellow-50" },
    { id: 3, metric: "Trip Completion", value: "95%", change: "-1%", icon: MdTrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 4, metric: "Maintainance Adherence", value: "88%", change: "0%", icon: MdBuild, color: "text-purple-500", bg: "bg-purple-50" },
];

const MOCK_CAR_USAGE = [
     { id: 1, vendor: "Rajesh Motors", car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 45k", trips: 12, utilization: 85 },
     { id: 2, vendor: "City Cabs Inc", car: "Maruti Swift", reg: "PB 10 5678", revenue: "₹ 22k", trips: 28, utilization: 92 },
     { id: 3, vendor: "Elite Wheels", car: "Fortuner Legender", reg: "CH 01 9999", revenue: "₹ 1.2L", trips: 6, utilization: 60 },
];
// Hack for MdBuild since it was not pre-imported in MOCK_PERFORMANCE context due to ordering
import { MdBuild } from 'react-icons/md';

// --- Pages ---

export const AllVendorsPage = () => (
    <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Vendor Directory</h1>
                 <p className="text-gray-500 text-sm">Manage car providers, drivers, and partners.</p>
             </div>
             <div className="flex gap-3">
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2">
                     <MdFilterList /> Filter
                 </button>
                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 font-bold flex items-center gap-2">
                     <MdStore /> Add Vendor
                 </button>
             </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {MOCK_VENDORS.map(vendor => (
                 <VendorCard key={vendor.id} vendor={vendor} />
             ))}
         </div>
    </div>
);

export const VendorPaymentsPage = () => (
    <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
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
                         <th className="px-6 py-4 text-right">Action</th>
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

export const VendorHistoryPage = () => (
    <div className="space-y-6">
         <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Vendor History</h1>
                 <p className="text-gray-500 text-sm">Timeline of partnership milestones.</p>
             </div>
         </div>
         
         <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
             <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MdHistory size={40} />
             </div>
             <h3 className="text-lg font-bold text-gray-800">Timeline view coming soon</h3>
             <p className="text-gray-500 mt-2">We are aggregating historical data for deeper insights.</p>
         </div>
    </div>
);

export const VendorPerformancePage = () => (
    <div className="space-y-6">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">Vendor Performance</h1>
             <p className="text-gray-500 text-sm">Quality metrics and service delivery analysis.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {MOCK_PERFORMANCE.map(stat => (
                 <div key={stat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                              <stat.icon size={24} />
                          </div>
                          <span className={`${stat.change.includes('+') ? 'text-green-600' : 'text-red-500'} text-xs font-bold bg-gray-50 px-2 py-1 rounded-md`}>{stat.change}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-gray-500 text-xs font-bold uppercase mt-1">{stat.metric}</p>
                 </div>
             ))}
         </div>
    </div>
);

export const VendorCarUsagePage = () => (
    <div className="space-y-6">
         <div>
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
