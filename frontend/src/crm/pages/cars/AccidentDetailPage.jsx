import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdEdit, 
  MdCameraAlt, 
  MdNoteAdd, 
  MdLocationOn
} from 'react-icons/md';
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

export const AccidentDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const data = MOCK_ACCIDENT_DETAIL;

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

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors self-start">
                    <MdArrowBack /> Back to List
                </button>
                <div className="flex gap-2">
                    <button onClick={openAllPhotos} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-colors">
                        <MdCameraAlt /> View All Photos
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-colors">
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
        </div>
    );
};

// Default export mainly for the route lazy load
export default AccidentDetailPage;
