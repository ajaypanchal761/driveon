import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MdAccessTime,
  MdClose,
  MdAdd
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { premiumColors } from '../../../theme/colors';
import { rgba } from 'polished';

// --- Shared Components ---

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
    'In Progress': 'text-white border-transparent', // Custom styled below
    'Pending': 'bg-orange-50 text-orange-700 border-orange-200',
    'Completed': 'bg-gray-50 text-gray-700 border-gray-200',
    'Expiring Soon': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Valid': 'bg-green-50 text-green-700 border-green-200',
  };
  const getStyle = (s) => {
      if (s === 'In Progress') {
          return { backgroundColor: premiumColors.primary.DEFAULT, color: 'white', borderColor: 'transparent' };
      }
      return {};
  };

  return (
    <span 
        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600'}`}
        style={getStyle(status)}
    >
      {status}
    </span>
  );
};

const GarageCard = ({ garage, onDetails }) => (
    <motion.div 
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       whileHover={{ y: -2 }}
       className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
                <div 
                    className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 transition-colors group-hover:text-white"
                    style={{ '--hover-bg': premiumColors.primary.DEFAULT }}
                >
                    <MdStore size={32} className="group-hover:text-white" />
                    <style>{`.group:hover .w-14 { background-color: ${premiumColors.primary.DEFAULT} !important; color: white !important; }`}</style>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 transition-colors group-hover:opacity-80" style={{ '--hover-color': premiumColors.primary.DEFAULT }}>{garage.name}</h3>
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
            <button 
                onClick={() => onDetails(garage)}
                className="w-full py-2 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
                View Details
            </button>
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
                     <span className="font-bold" style={{ color: premiumColors.primary.DEFAULT }}>{repair.progress}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                     <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${repair.progress}%`, backgroundColor: premiumColors.primary.DEFAULT }}></div>
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
             
              <button 
                  className="p-2 text-gray-400 rounded-full transition-colors hover:text-white"
                  style={{ '--hover-bg': rgba(premiumColors.primary.DEFAULT, 0.1), '--hover-text': premiumColors.primary.DEFAULT }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = rgba(premiumColors.primary.DEFAULT, 0.1); e.currentTarget.style.color = premiumColors.primary.DEFAULT; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
              >
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



// --- Pages ---

export const AllGaragesPage = () => {
    const navigate = useNavigate();
    const [garages, setGarages] = useState(MOCK_GARAGES);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedGarage, setSelectedGarage] = useState(null);
    const [newGarage, setNewGarage] = useState({ name: '', location: '', phone: '', specialist: '', rating: '4.0' });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGarages = garages.filter(garage => 
        garage.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        garage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.specialist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddGarage = () => {
        if (!newGarage.name || !newGarage.location) return;
        setGarages([...garages, { ...newGarage, id: Date.now() }]);
        setIsAddModalOpen(false);
        setNewGarage({ name: '', location: '', phone: '', specialist: '', rating: '4.0' });
    };

    const handleViewDetails = (garage) => {
        setSelectedGarage(garage);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/garage/all')}>Garage</span> 
                        <span>/</span> 
                        <span className="text-gray-800 font-medium">All Garages</span>
                    </div>
                     <h1 className="text-2xl font-bold text-gray-900">Partner Garages</h1>
                     <p className="text-gray-500 text-sm">Network of authorized service centers.</p>
                 </div>
                 <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                         <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                         <input 
                            type="text"
                         placeholder="Search garages..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-sm"
                            style={{ '--tw-ring-color': rgba(premiumColors.primary.DEFAULT, 0.2) }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 text-white rounded-xl shadow-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        style={{ backgroundColor: premiumColors.primary.DEFAULT, boxShadow: `0 10px 15px -3px ${rgba(premiumColors.primary.DEFAULT, 0.3)}` }}
                     >
                         <MdStore /> Add Garage
                     </button>
                 </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {filteredGarages.map(active => (
                     <GarageCard key={active.id} garage={active} onDetails={handleViewDetails} />
                 ))}
             </div>

             {filteredGarages.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                        <MdSearch size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No results found</h3>
                    <p className="text-gray-500">No garages match your search for "{searchTerm}"</p>
                </div>
             )}

             {/* Add Garage Modal */}
             <SimpleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Garage">
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Garage Name</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            placeholder="e.g. Speed Auto Works"
                            value={newGarage.name}
                            onChange={(e) => setNewGarage({...newGarage, name: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            placeholder="e.g. Sector 15, Noida"
                            value={newGarage.location}
                            onChange={(e) => setNewGarage({...newGarage, location: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            placeholder="+91..."
                            value={newGarage.phone}
                            onChange={(e) => setNewGarage({...newGarage, phone: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Specialist In</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            placeholder="e.g. Engine, Denting"
                            value={newGarage.specialist}
                            onChange={(e) => setNewGarage({...newGarage, specialist: e.target.value})}
                         />
                     </div>
                     <button 
                        onClick={handleAddGarage}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                     >
                         Add Garage
                     </button>
                 </div>
             </SimpleModal>

             {/* Garage Details Modal */}
             <SimpleModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Garage Details">
                 {selectedGarage && (
                     <div className="space-y-4">
                         <div className="flex items-center gap-4 mb-4">
                             <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                 <MdStore size={40} />
                             </div>
                             <div>
                                 <h4 className="font-bold text-xl text-gray-900">{selectedGarage.name}</h4>
                                 <div className="flex items-center gap-1 text-sm text-gray-500">
                                     <MdLocationOn /> {selectedGarage.location}
                                 </div>
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                 <p className="text-xs text-gray-400 uppercase font-bold">Contact</p>
                                 <p className="font-medium text-gray-800">{selectedGarage.phone}</p>
                             </div>
                             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                 <p className="text-xs text-gray-400 uppercase font-bold">Rating</p>
                                 <div className="flex items-center gap-1 font-medium text-gray-800">
                                     <MdStar className="text-yellow-500" /> {selectedGarage.rating}
                                 </div>
                             </div>
                         </div>
                         <div className="p-4 rounded-xl border" style={{ backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.05), borderColor: rgba(premiumColors.primary.DEFAULT, 0.2) }}>
                             <p className="text-xs uppercase font-bold mb-1" style={{ color: premiumColors.primary.DEFAULT }}>Specialization</p>
                             <div className="flex items-center gap-2 font-medium" style={{ color: premiumColors.primary.DEFAULT }}>
                                 <MdBuild /> {selectedGarage.specialist}
                             </div>
                         </div>

                     </div>
                 )}
             </SimpleModal>
        </div>
    );
};

export const ActiveRepairsPage = () => {
    const navigate = useNavigate();
    const [repairs, setRepairs] = useState(MOCK_REPAIRS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newRepair, setNewRepair] = useState({
        car: 'Toyota Innova Crysta',
        reg: 'PB 01 1234',
        garage: 'Bosch Car Service',
        issue: '',
        progress: 0,
        completionDate: 'Tomorrow'
    });

    const handleAddRepair = () => {
         if (!newRepair.issue) return;
         setRepairs([{ ...newRepair, id: Date.now() }, ...repairs]);
         setIsAddModalOpen(false);
         setNewRepair({ car: 'Toyota Innova Crysta', reg: 'PB 01 1234', garage: 'Bosch Car Service', issue: '', progress: 0, completionDate: 'Tomorrow' });
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/garage/all')}>Garage</span> 
                        <span>/</span> 
                        <span className="text-gray-800 font-medium">Active Repairs</span>
                    </div>
                     <h1 className="text-2xl font-bold text-gray-900">Active Repairs</h1>
                     <p className="text-gray-500 text-sm">Real-time status of vehicles in garage.</p>
                 </div>
                 <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-white rounded-xl shadow-lg font-bold flex items-center gap-2"
                    style={{ backgroundColor: premiumColors.primary.DEFAULT, boxShadow: `0 10px 15px -3px ${rgba(premiumColors.primary.DEFAULT, 0.3)}` }}
                 >
                     <MdAdd /> Logs New Repair
                 </button>
             </div>
             <div className="space-y-4">
                 {repairs.length > 0 ? (
                     repairs.map(repair => (
                         <RepairItem key={repair.id} repair={repair} />
                     ))
                 ) : (
                     <div className="text-center py-10 text-gray-400">
                         No active repairs found.
                     </div>
                 )}
             </div>

             {/* Add Repair Modal */}
             <SimpleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Log New Repair">
                 <div className="space-y-4">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                         <select 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={newRepair.car}
                            onChange={(e) => setNewRepair({...newRepair, car: e.target.value})}
                         >
                             <option>Toyota Innova Crysta</option>
                             <option>Mahindra Thar</option>
                             <option>Maruti Swift</option>
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Garage</label>
                         <select 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            value={newRepair.garage}
                            onChange={(e) => setNewRepair({...newRepair, garage: e.target.value})}
                         >
                             {MOCK_GARAGES.map(g => <option key={g.id}>{g.name}</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Issue / Service Type</label>
                         <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" 
                            placeholder="e.g. Brake Pad Replacement"
                            value={newRepair.issue}
                            onChange={(e) => setNewRepair({...newRepair, issue: e.target.value})}
                         />
                     </div>
                     <button 
                        onClick={handleAddRepair}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                     >
                         Start Repair Log
                     </button>
                 </div>
             </SimpleModal>
        </div>
    );
};

export const ServiceHistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState(MOCK_HISTORY);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredHistory = history.filter(log => 
        log.car.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.garage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/garage/all')}>Garage</span> 
                        <span>/</span> 
                        <span className="text-gray-800 font-medium">Service Logs</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Logs</h1>
                    <p className="text-gray-500 text-sm">Archive of all maintenance activities.</p>
                </div>
                <div className="flex gap-3">
                     <div className="relative">
                          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search logs..." 
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                     </div>
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
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-sm">
                         {filteredHistory.map((log) => (
                             <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-gray-800">{log.date}</td>
                                 <td className="px-6 py-4 text-gray-700 font-medium">{log.car}</td>
                                 <td className="px-6 py-4 text-gray-500">{log.garage}</td>
                                 <td className="px-6 py-4 text-gray-600">{log.service}</td>
                                 <td className="px-6 py-4 font-bold text-gray-900">₹ {log.cost.toLocaleString()}</td>
                                 <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
            </div>
        </div>
    );
};

export const PartsCostPage = () => {
    const navigate = useNavigate();
    return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/garage/all')}>Garage</span> 
                    <span>/</span> 
                    <span className="text-gray-800 font-medium">Inventory</span>
                </div>
                 <h1 className="text-2xl font-bold text-gray-900">Inventory & Parts Cost</h1>
                 <p className="text-gray-500 text-sm">Track spare parts inventory and pricing.</p>
             </div>
             <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2">
                 <MdFilterList /> Filter
             </button>
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
                              <p className="text-lg font-bold" style={{ color: premiumColors.primary.DEFAULT }}>₹ {part.cost.toLocaleString()}</p>
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
}


