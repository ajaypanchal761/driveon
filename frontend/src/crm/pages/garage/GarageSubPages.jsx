import React from 'react';
import { 
  MdStore, 
  MdBuild, 
  MdHistory, 
  MdAttachMoney, 
  MdSecurity, 
  MdNotificationsActive,
  MdPhone,
  MdStar,
  MdLocationOn,
  MdSearch,
  MdFilterList,
  MdMoreVert,
  MdDirectionsCar,
  MdDateRange,
  MdReceipt,
  MdWarning,
  MdCheckCircle,
  MdAccessTime
} from 'react-icons/md';
import { motion } from 'framer-motion';

// --- Shared Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-green-50 text-green-700 border-green-200',
    'Inactive': 'bg-red-50 text-red-700 border-red-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Pending': 'bg-orange-50 text-orange-700 border-orange-200',
    'Completed': 'bg-gray-50 text-gray-700 border-gray-200',
    'Expiring Soon': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Valid': 'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
};

const GarageCard = ({ garage }) => (
    <motion.div 
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       whileHover={{ y: -2 }}
       className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <MdStore size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{garage.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MdLocationOn /> {garage.location}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold">
                <MdStar /> {garage.rating}
            </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
                <MdPhone className="text-gray-400" /> {garage.phone}
            </div>
            <div className="flex items-center gap-2">
                <MdBuild className="text-gray-400" /> Specialist: <span className="font-medium text-gray-800">{garage.specialist}</span>
            </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
            <button className="flex-1 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">Call Now</button>
            <button className="flex-1 py-2 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">Details</button>
        </div>
    </motion.div>
);

const RepairItem = ({ repair }) => (
    <motion.div 
       initial={{ opacity: 0, x: -10 }}
       animate={{ opacity: 1, x: 0 }}
       className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
        <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 shrink-0">
                 <MdBuild size={24} />
             </div>
             <div>
                 <h4 className="font-bold text-gray-900">{repair.car} <span className="text-gray-400 font-normal text-sm">({repair.reg})</span></h4>
                 <p className="text-sm text-gray-500 mt-0.5">{repair.issue} • at <span className="font-medium text-gray-700">{repair.garage}</span></p>
             </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="flex-1 md:w-48">
                 <div className="flex justify-between text-xs font-bold mb-1.5">
                     <span className="text-gray-500">Progress</span>
                     <span className="text-indigo-600">{repair.progress}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                     <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${repair.progress}%` }}></div>
                 </div>
                 <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                     <span>Diagnostics</span>
                     <span>Repair</span>
                     <span>Testing</span>
                 </div>
             </div>
             
             <div className="text-right shrink-0">
                 <p className="text-xs text-gray-400 font-bold uppercase">Est. Completion</p>
                 <p className="text-sm font-bold text-gray-800">{repair.completionDate}</p>
             </div>
             
             <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                  <MdMoreVert size={24} />
             </button>
        </div>
    </motion.div>
);

// --- Mock Data ---

const MOCK_GARAGES = [
    { id: 1, name: "Bosch Car Service", location: "Sector 29, Gurgaon", rating: 4.8, phone: "+91 98765 43210", specialist: "General Service, Electronics" },
    { id: 2, name: "GoMechanic Premium", location: "Okhla Phase 3, Delhi", rating: 4.5, phone: "+91 99887 76655", specialist: "Denting, Painting" },
    { id: 3, name: "Wheel Force Centre", location: "Mayapuri, Delhi", rating: 4.2, phone: "+91 88776 65544", specialist: "Wheel Alignment, Tyres" },
    { id: 4, name: "AutoTech Soluitons", location: "Noida Sec 63", rating: 4.0, phone: "+91 77665 54433", specialist: "Engine Repair" },
];

const MOCK_REPAIRS = [
    { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", garage: "Bosch Car Service", issue: "Brake Pad Replacement", progress: 75, completionDate: "Today, 5:00 PM" },
    { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", garage: "GoMechanic Premium", issue: "Clutch Plate Overhaul", progress: 30, completionDate: "29 Dec 2025" },
    { id: 3, car: "Maruti Swift", reg: "PB 10 5678", garage: "AutoTech Solutions", issue: "AC Compressor Check", progress: 90, completionDate: "Tomorrow, 10:00 AM" },
];

const MOCK_HISTORY = [
    { id: 101, date: "15 Dec 2025", car: "Hyundai Creta", garage: "Wheel Force Centre", service: "Periodic Service (20k km)", cost: 5500, status: "Completed" },
    { id: 102, date: "10 Nov 2025", car: "Toyota Fortuner", garage: "Bosch Car Service", service: "Battery Replacement", cost: 8500, status: "Completed" },
    { id: 103, date: "05 Oct 2025", car: "Honda City", garage: "GoMechanic", service: "Denting/Painting", cost: 12000, status: "Completed" },
];

const MOCK_PARTS = [
    { id: 1, name: "Exide Battery 65Ah", category: "Battery", stock: 4, cost: 4500, supplier: "Exide Dealer Delhi" },
    { id: 2, name: "Michelin Primacy 4ST", category: "Tyres", stock: 2, cost: 9500, supplier: "Tyre Empire" },
    { id: 3, name: "Motul 5W40 Engine Oil", category: "Fluid", stock: 15, cost: 3500, supplier: "Lube Distributors" },
];

const MOCK_ALERTS = [
    { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", alert: "Oil Change Due", dueIn: "150 km", severity: "High" },
    { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", alert: "Insurance Expiry", dueIn: "5 Days", severity: "Critical" },
    { id: 3, car: "Maruti Swift", reg: "PB 10 5678", alert: "Tyre Rotation", dueIn: "500 km", severity: "Medium" },
];

// --- Pages ---

export const AllGaragesPage = () => (
    <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Partner Garages</h1>
                 <p className="text-gray-500 text-sm">Network of authorized service centers.</p>
             </div>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 font-bold flex items-center gap-2">
                 <MdStore /> Add Garage
             </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {MOCK_GARAGES.map(active => (
                 <GarageCard key={active.id} garage={active} />
             ))}
         </div>
    </div>
);

export const ActiveRepairsPage = () => (
    <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Active Repairs</h1>
                 <p className="text-gray-500 text-sm">Real-time status of vehicles in garage.</p>
             </div>
         </div>
         <div className="space-y-4">
             {MOCK_REPAIRS.map(repair => (
                 <RepairItem key={repair.id} repair={repair} />
             ))}
         </div>
    </div>
);

export const ServiceHistoryPage = () => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Logs</h1>
                <p className="text-gray-500 text-sm">Archive of all maintenance activities.</p>
            </div>
            <div className="flex gap-3">
                 <div className="relative">
                      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search logs..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" />
                 </div>
                 <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">Export CSV</button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                     <tr>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Vehicle</th>
                         <th className="px-6 py-4">Garage</th>
                         <th className="px-6 py-4">Service Details</th>
                         <th className="px-6 py-4">Cost</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4"></th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                     {MOCK_HISTORY.map((log) => (
                         <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-6 py-4 font-bold text-gray-800">{log.date}</td>
                             <td className="px-6 py-4 text-gray-700 font-medium">{log.car}</td>
                             <td className="px-6 py-4 text-gray-500">{log.garage}</td>
                             <td className="px-6 py-4 text-gray-600">{log.service}</td>
                             <td className="px-6 py-4 font-bold text-gray-900">₹ {log.cost.toLocaleString()}</td>
                             <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                             <td className="px-6 py-4 text-right">
                                 <button className="text-indigo-600 hover:text-indigo-800"><MdReceipt size={20} /></button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </div>
    </div>
);

export const PartsCostPage = () => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                 <h1 className="text-2xl font-bold text-gray-900">Inventory & Parts Cost</h1>
                 <p className="text-gray-500 text-sm">Track spare parts inventory and pricing.</p>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {MOCK_PARTS.map(part => (
                 <div key={part.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">{part.name}</h4>
                          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{part.category}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{part.supplier}</p>
                      
                      <div className="flex justify-between items-end border-t border-gray-50 pt-3">
                          <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">Unit Cost</p>
                              <p className="text-lg font-bold text-indigo-600">₹ {part.cost.toLocaleString()}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-400 font-bold uppercase text-right">Stock</p>
                              <p className="text-lg font-bold text-gray-900 text-right">{part.stock} Units</p>
                          </div>
                      </div>
                 </div>
             ))}
        </div>
    </div>
);

export const WarrantyPage = () => (
    <div className="space-y-6">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">Warranty & Insurance</h1>
             <p className="text-gray-500 text-sm">Active policies and warranty coverages.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Policy Card */}
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 active-policy">
                 <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                     <MdSecurity size={24} />
                 </div>
                 <div className="flex-1">
                     <div className="flex justify-between items-start">
                         <div>
                             <h4 className="font-bold text-gray-900">Zero Dep Insurance</h4>
                             <p className="text-sm text-gray-500">Toyota Innova Crysta (PB 01 1234)</p>
                         </div>
                         <StatusBadge status="Valid" />
                     </div>
                     <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm flex justify-between">
                         <span className="text-gray-500">Policy No: <span className="text-gray-800 font-mono">POL-8829283</span></span>
                         <span className="text-gray-500">Exp: <span className="text-gray-800 font-bold">12 Oct 2026</span></span>
                     </div>
                 </div>
             </div>
             
             {/* Expiring Card */}
             <div className="bg-white p-6 rounded-2xl border border-l-4 border-l-yellow-400 border-gray-100 shadow-sm flex items-start gap-4">
                 <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                     <MdWarning size={24} />
                 </div>
                 <div className="flex-1">
                     <div className="flex justify-between items-start">
                         <div>
                             <h4 className="font-bold text-gray-900">Battery Warranty</h4>
                             <p className="text-sm text-gray-500">Mahindra Thar (PB 65 9876)</p>
                         </div>
                         <StatusBadge status="Expiring Soon" />
                     </div>
                     <div className="mt-4 p-3 bg-yellow-50/50 rounded-xl text-sm flex justify-between">
                         <span className="text-gray-500">Vendor: Exide</span>
                         <span className="text-red-500 font-bold">Exp: 3 Days Left</span>
                     </div>
                 </div>
             </div>
         </div>
    </div>
);

export const MaintenanceAlertsPage = () => (
    <div className="space-y-6">
         <div>
             <h1 className="text-2xl font-bold text-gray-900">Maintenance Alerts</h1>
             <p className="text-gray-500 text-sm">Scheduled tasks and urgent attention required.</p>
         </div>
         
         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
             {MOCK_ALERTS.map(alert => (
                 <div key={alert.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : alert.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                             <MdNotificationsActive size={20} />
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900">{alert.alert}</h4>
                             <p className="text-sm text-gray-500">{alert.car} <span className="text-gray-300">•</span> {alert.reg}</p>
                         </div>
                     </div>
                     
                     <div className="flex items-center gap-6">
                         <div className="text-right">
                             <p className="text-xs text-gray-400 font-bold uppercase">Due In</p>
                             <p className={`text-sm font-bold ${alert.severity === 'Critical' ? 'text-red-600' : 'text-gray-800'}`}>{alert.dueIn}</p>
                         </div>
                         <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-100">
                             Schedule
                         </button>
                     </div>
                 </div>
             ))}
         </div>
    </div>
);
