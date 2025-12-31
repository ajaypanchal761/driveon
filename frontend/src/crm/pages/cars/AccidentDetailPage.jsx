import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdEdit, 
  MdCameraAlt, 
  MdNoteAdd, 
  MdLocationOn,
  MdClose,
  MdCheckCircle
} from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { premiumColors } from '../../../theme/colors';

// Internal Components
import CarDiagram from './components/CarDiagram';
import DamageCharts from './components/DamageCharts';
import DamageViewer from './components/DamageViewer';
import DamageNotes from './components/DamageNotes';

// Mock Data
const MOCK_ACCIDENT_DETAIL = {
  id: 1,
  carName: "Toyota Innova Crysta",
  regNumber: "PB 01 1234",
  severity: "Major",
  status: "In Repair",
  reportDate: "26 Dec 2025",
  location: "Delhi-Agra Hwy",
  estCost: "₹ 72,000",
  garage: "Sharma Auto Works",
  garageContact: "+91 98765 43210",
  description: "Head-on collision with divider. Front bumper and hood severely damaged. Right fender crumpled.",
  
  // Mapping names to SVG part names
  damagedAreas: [
     { 
       id: 'front-bumper', 
       name: 'Front Bumper', 
       severity: 'Major', 
       images: [
           "https://5.imimg.com/data5/SELLER/Default/2023/1/YI/IO/WO/3629087/car-denting-painting-services.jpg", // Mock
       ] 
     },
     { 
       id: 'hood', 
       name: 'Hood', 
       severity: 'Medium',
       images: [
           "https://imgd.aeplcdn.com/370x208/n/cw/ec/115025/innova-crysta-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80" 
       ]
     },
     { 
         id: 'right-fender', 
         name: 'Front Right Fender', 
         severity: 'Major',
         images: [] 
     },
     {
         id: 'roof',
         name: 'Roof',
         severity: 'Minor',
         images: []
     }
  ],
  
  allImages: [
      "https://imgd.aeplcdn.com/370x208/n/cw/ec/115025/innova-crysta-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80",
      "https://5.imimg.com/data5/SELLER/Default/2023/1/YI/IO/WO/3629087/car-denting-painting-services.jpg"
  ]
};

const AccidentDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const data = MOCK_ACCIDENT_DETAIL;

    // Local State
    const [status, setStatus] = useState(data.status);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    // Viewer State
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState([]);
    const [viewerIndex, setViewerIndex] = useState(0);

    const handlePartClick = (partName) => {
        // Find part data
        const part = data.damagedAreas.find(p => p.name.toLowerCase() === partName.toLowerCase());
        
        if (part && part.images && part.images.length > 0) {
            setViewerImages(part.images.map(src => ({ src, alt: `${partName} Damage` })));
            setViewerIndex(0);
            setIsViewerOpen(true);
        } else if (part) {
            // No images but damaged
            alert(`Selected: ${partName} (${part.severity}). No specific photos available.`);
        } else {
            console.log("Clicked undamaged part:", partName);
        }
    };

    const openAllPhotos = () => {
        setViewerImages(data.allImages.map(src => ({ src, alt: 'Accident Evidence' })));
        setViewerIndex(0);
        setIsViewerOpen(true);
    };

    const handleStatusUpdate = (newStatus, closingData = null) => {
        setStatus(newStatus);
        
        if (newStatus === 'Closed' && closingData) {
            // Navigate to Closed Cases page with the new case data
            const closedCaseData = {
                id: Date.now(), // Generate a new specific ID or use existing
                originalId: data.id,
                car: data.carName,
                reg: data.regNumber,
                date: data.reportDate, // Or today's date
                insurer: "Unknown", // You might want to add insurer to mock data or input
                finalCost: `₹ ${Number(closingData.finalCost).toLocaleString()}`,
                recovered: `₹ ${Number(closingData.recovered).toLocaleString()}`,
                netLoss: `₹ ${Number(closingData.finalCost - closingData.recovered).toLocaleString()}`,
                status: "Settled" // Or use the status provided
            };

            navigate('/crm/cars/accidents/closed', { state: { newClosedCase: closedCaseData } });
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors self-start">
                    <MdArrowBack /> Back to List
                </button>
                <div className="flex gap-2">

                    <button 
                        onClick={() => setIsStatusModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        <MdEdit /> Update Status
                    </button>
                </div>
            </div>

            {/* Title Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                 <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                     <img src={data.allImages[0]} alt="Car" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                     <div className="flex flex-wrap items-center gap-3 mb-1">
                         <h1 className="text-2xl font-bold text-gray-900">{data.carName}</h1>
                         <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">{data.severity} Damage</span>
                         <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">{status}</span>
                     </div>
                     <p className="font-mono text-gray-500 font-bold text-lg mb-2">{data.regNumber}</p>
                     <div className="flex items-center gap-4 text-sm text-gray-500">
                         <span className="flex items-center gap-1"><MdLocationOn className="text-gray-400" /> {data.location}</span>
                         <span>•</span>
                         <span>Reported: {data.reportDate}</span>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Interaction Diagram */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Interactive Damage Map</h2>
                            <p className="text-xs text-gray-400">Click highlighted parts to view photos</p>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
                             <CarDiagram damagedParts={data.damagedAreas} onPartClick={handlePartClick} />
                        </div>
                    </div>
                </div>

                {/* Right: Charts & Summaries */}
                <div className="space-y-6">
                    <DamageNotes data={data} />
                    <DamageCharts />
                </div>
            </div>

            {/* Viewer Modal */}
            <DamageViewer 
                visible={isViewerOpen} 
                onClose={() => setIsViewerOpen(false)} 
                images={viewerImages} 
                activeIndex={viewerIndex}
            />

            {/* Status Update Modal */}
            <UpdateStatusModal 
                isOpen={isStatusModalOpen} 
                onClose={() => setIsStatusModalOpen(false)} 
                currentStatus={status} 
                onUpdate={handleStatusUpdate} 
            />
        </div>
    );
};

const UpdateStatusModal = ({ isOpen, onClose, currentStatus, onUpdate }) => {
    const STATUS_OPTIONS = ["Open", "In Repair", "Closed"];
    const [selected, setSelected] = useState(currentStatus);
    
    // Suggest keeping these empty initially
    const [closingDetails, setClosingDetails] = useState({
        finalCost: '',
        recovered: ''
    });

    const handleUpdateClick = () => {
        if (selected === 'Closed') {
            // Optional: Add simple validation
            if (!closingDetails.finalCost || !closingDetails.recovered) {
                alert("Please fill in Final Cost and Recovered Amount to close the case.");
                return;
            }
        }
        onUpdate(selected, selected === 'Closed' ? closingDetails : null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                     <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                     />
                     <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                     >
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Update Case Status</h3>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><MdClose size={20} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelected(opt)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            selected === opt 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt}
                                        {selected === opt && <MdCheckCircle className="text-indigo-600" size={20} />}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {selected === 'Closed' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 space-y-3 border-t border-gray-100 mt-2">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Settlement Details</p>
                                            
                                            <div>
                                                <label className="text-xs text-gray-500 font-medium mb-1 block">Final Repair Cost (₹)</label>
                                                <input 
                                                    type="number"
                                                    value={closingDetails.finalCost}
                                                    onChange={(e) => setClosingDetails({...closingDetails, finalCost: e.target.value})}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 font-bold"
                                                    placeholder="e.g. 40000"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-gray-500 font-medium mb-1 block">Insurance Recovered (₹)</label>
                                                <input 
                                                    type="number"
                                                    value={closingDetails.recovered}
                                                    onChange={(e) => setClosingDetails({...closingDetails, recovered: e.target.value})}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 text-green-700 font-bold"
                                                    placeholder="e.g. 35000"
                                                />
                                            </div>

                                            {closingDetails.finalCost && closingDetails.recovered && (
                                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                                    <span className="text-xs font-bold text-red-600 uppercase">Net Loss</span>
                                                    <span className="font-bold text-red-700">₹ {(Number(closingDetails.finalCost) - Number(closingDetails.recovered)).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <button 
                                onClick={handleUpdateClick} 
                                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                {selected === 'Closed' ? 'Close & Settle Case' : 'Update Status'}
                            </button>
                        </div>
                     </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Default export mainly for the route lazy load
export default AccidentDetailPage;
