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
  MdAdd,
  MdEdit
} from 'react-icons/md';
import { motion } from 'framer-motion';
import ThemedDropdown from '../../components/ThemedDropdown';

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

const GarageCard = ({ garage, onDetails }) => (
    <motion.div 
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       whileHover={{ y: -2 }}
       className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#1c205c]/10 group-hover:text-[#1c205c] transition-colors">
                    <MdStore size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-[#1c205c] transition-colors">{garage.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MdLocationOn /> {garage.location}
                    </div>
                </div>
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

const RepairItem = ({ repair, onDelete, onComplete, onEdit }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
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
                 <h4 className="font-bold text-gray-900">{repair.car}</h4>
                 <p className="text-sm text-gray-500 mt-0.5">{repair.issue} • at <span className="font-medium text-gray-700">{repair.garage}</span></p>
             </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto">
             <div className="relative">
                 <button 
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                     className="p-2 text-gray-400 hover:text-[#1c205c] hover:bg-[#1c205c]/10 rounded-full transition-colors"
                 >
                      <MdMoreVert size={24} />
                 </button>
                 
                 {isMenuOpen && (
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                         <button 
                             onClick={() => { onEdit(repair); setIsMenuOpen(false); }}
                             className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#1c205c]/10 hover:text-[#1c205c] transition-colors flex items-center gap-2"
                         >
                             <MdEdit size={16} /> Edit Repair
                         </button>
                         <button 
                             onClick={() => { onComplete(repair.id); setIsMenuOpen(false); }}
                             className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#1c205c]/10 hover:text-[#1c205c] transition-colors flex items-center gap-2"
                         >
                             <MdCheckCircle size={16} /> Mark as Complete
                         </button>
                         <button 
                             onClick={() => { onDelete(repair.id); setIsMenuOpen(false); }}
                             className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                         >
                             <MdClose size={16} /> Delete Repair
                         </button>
                     </div>
                 )}
             </div>
        </div>
    </motion.div>
    );
};

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

    const [errors, setErrors] = useState({});

    const filteredGarages = garages.filter(garage => 
        garage.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        garage.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.specialist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const validate = () => {
        let tempErrors = {};
        if (!newGarage.name) tempErrors.name = "Garage Name is required.";
        if (!newGarage.location) tempErrors.location = "Location is required.";
        if (!newGarage.specialist) tempErrors.specialist = "Specialist field is required.";
        if (!/^\d{10}$/.test(newGarage.phone)) {
            tempErrors.phone = "Phone number must be 10 digits.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleAddGarage = () => {
        if (!validate()) return;
        setGarages([...garages, { ...newGarage, id: Date.now() }]);
        setIsAddModalOpen(false);
        setNewGarage({ name: '', location: '', phone: '', specialist: '', rating: '4.0' });
        setErrors({});
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
                        <span className="hover:text-[#1c205c] cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="hover:text-[#1c205c] cursor-pointer transition-colors" onClick={() => navigate('/crm/garage/all')}>Garage</span> 
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
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c205c]/20 focus:border-[#1c205c] transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 bg-[#1c205c] text-white rounded-xl shadow-lg shadow-gray-300 hover:bg-[#252d6d] font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
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
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c205c]/20 focus:border-[#1c205c] ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="e.g. Speed Auto Works"
                            value={newGarage.name}
                            onChange={(e) => {
                                setNewGarage({...newGarage, name: e.target.value});
                                if (errors.name) setErrors({...errors, name: null});
                            }}
                         />
                         {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                         <input 
                            type="text" 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c205c]/20 focus:border-[#1c205c] ${errors.location ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="e.g. Sector 15, Noida"
                            value={newGarage.location}
                            onChange={(e) => {
                                setNewGarage({...newGarage, location: e.target.value});
                                if (errors.location) setErrors({...errors, location: null});
                            }}
                         />
                         {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                         <input 
                            type="text" 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c205c]/20 focus:border-[#1c205c] ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="10 digit mobile number"
                            value={newGarage.phone}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*$/.test(val) && val.length <= 10) {
                                    setNewGarage({...newGarage, phone: val});
                                    if (errors.phone) setErrors({...errors, phone: null});
                                }
                            }}
                         />
                         {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Specialist In</label>
                         <input 
                            type="text" 
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c205c]/20 focus:border-[#1c205c] ${errors.specialist ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="e.g. Engine, Denting"
                            value={newGarage.specialist}
                            onChange={(e) => {
                                setNewGarage({...newGarage, specialist: e.target.value});
                                if (errors.specialist) setErrors({...errors, specialist: null});
                            }}
                         />
                         {errors.specialist && <p className="text-xs text-red-500 mt-1">{errors.specialist}</p>}
                     </div>
                     <button 
                        onClick={handleAddGarage}
                        className="w-full py-2.5 bg-[#1c205c] text-white rounded-xl font-bold hover:bg-[#252d6d] transition-colors shadow-lg shadow-gray-300"
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
                         <div className="grid grid-cols-1 gap-4">
                             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                 <p className="text-xs text-gray-400 uppercase font-bold">Contact</p>
                                 <p className="font-medium text-gray-800">{selectedGarage.phone}</p>
                             </div>
                         </div>
                         <div className="bg-[#1c205c]/10 p-4 rounded-xl border border-[#1c205c]/20">
                             <p className="text-xs text-[#1c205c] uppercase font-bold mb-1">Specialization</p>
                             <div className="flex items-center gap-2 text-[#1c205c] font-medium">
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
    const [editingRepair, setEditingRepair] = useState(null);
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
         
         if (editingRepair) {
             setRepairs(repairs.map(r => r.id === editingRepair.id ? { ...newRepair, id: editingRepair.id, progress: editingRepair.progress, completionDate: editingRepair.completionDate } : r));
             setEditingRepair(null);
         } else {
             setRepairs([{ ...newRepair, id: Date.now() }, ...repairs]);
         }
         
         setIsAddModalOpen(false);
         setNewRepair({ car: 'Toyota Innova Crysta', reg: 'PB 01 1234', garage: 'Bosch Car Service', issue: '', progress: 0, completionDate: 'Tomorrow' });
    };
    
    const handleDeleteRepair = (id) => {
        setRepairs(repairs.filter(r => r.id !== id));
    };
    
    const handleCompleteRepair = (id) => {
        setRepairs(repairs.filter(r => r.id !== id));
    };

    const handleEditRepair = (repair) => {
        setEditingRepair(repair);
        setNewRepair(repair);
        setIsAddModalOpen(true);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                 <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <span className="hover:text-[#1c205c] cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                        <span>/</span> 
                        <span className="hover:text-[#1c205c] cursor-pointer transition-colors" onClick={() => navigate('/crm/garage/all')}>Garage</span> 
                        <span>/</span> 
                        <span className="text-gray-800 font-medium">Active Repairs</span>
                    </div>
                     <h1 className="text-2xl font-bold text-gray-900">Active Repairs</h1>
                     <p className="text-gray-500 text-sm">Real-time status of vehicles in garage.</p>
                 </div>
                 <button 
                    onClick={() => {
                        setEditingRepair(null);
                        setNewRepair({ car: 'Toyota Innova Crysta', reg: 'PB 01 1234', garage: 'Bosch Car Service', issue: '', progress: 0, completionDate: 'Tomorrow' });
                        setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#1c205c] text-white rounded-xl shadow-lg shadow-gray-300 hover:bg-[#252d6d] font-bold flex items-center gap-2"
                 >
                     <MdAdd /> Logs New Repair
                 </button>
             </div>
             <div className="space-y-4">
                 {repairs.length > 0 ? (
                     repairs.map(repair => (
                         <RepairItem key={repair.id} repair={repair} onDelete={handleDeleteRepair} onComplete={handleCompleteRepair} onEdit={handleEditRepair} />
                     ))
                 ) : (
                     <div className="text-center py-10 text-gray-400">
                         No active repairs found.
                     </div>
                 )}
             </div>

             {/* Add Repair Modal */}
             <SimpleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={editingRepair ? "Edit Repair Log" : "Log New Repair"}>
                 <div className="space-y-4">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                         <ThemedDropdown
                            options={['Toyota Innova Crysta', 'Mahindra Thar', 'Maruti Swift']}
                            value={newRepair.car}
                            onChange={(val) => setNewRepair({...newRepair, car: val})}
                            className="bg-white"
                         />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Garage</label>
                         <ThemedDropdown
                            options={MOCK_GARAGES.map(g => g.name)}
                            value={newRepair.garage}
                            onChange={(val) => setNewRepair({...newRepair, garage: val})}
                            className="bg-white"
                         />
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
                        className="w-full py-2.5 bg-[#1c205c] text-white rounded-xl font-bold hover:bg-[#252d6d] transition-colors shadow-lg shadow-gray-300"
                     >
                         {editingRepair ? "Update Repair Log" : "Start Repair Log"}
                     </button>
                 </div>
             </SimpleModal>
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
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
                    <span>/</span> 
                    <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/garage/all')}>Garage</span> 
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
}


