import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdFolderOpen, 
  MdWarning, 
  MdSearch, 
  MdAdd, 
  MdFilterList, 
  MdDirectionsCar, 
  MdLocalGasStation, 
  MdSettings, 
  MdVisibility, 
  MdMoreVert,
  MdRefresh,
  MdLocationOn,
  MdAccessTime,
  MdCheckCircle,
  MdTimer,
  MdLocalParking,
  MdPlayArrow,
  MdHistory,
  MdBuild,
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdHealthAndSafety,
  MdSpeed,
  MdDescription,
  MdFileUpload,
  MdDateRange,
  MdError,
  MdPerson,
  MdDriveEta,
  MdCloudUpload,
  MdImage,
  MdPolicy,
  MdMoneyOff,
  MdGavel,
  MdLocalShipping,
  MdCall
} from 'react-icons/md';
import { premiumColors } from '../../../theme/colors';
import { rgba } from 'polished';

// Mock Data for Cars
const MOCK_CARS_DATA = [
  { id: 1, name: "Toyota Innova Crysta", plate: "PB 01 1234", type: "SUV", fuel: "Diesel", seats: "7 Seater", price: "₹ 2,500", status: "Active", trips: 45, image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/115025/innova-crysta-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80" },
  { id: 2, name: "Mahindra Thar", plate: "PB 65 9876", type: "SUV", fuel: "Diesel", seats: "4 Seater", price: "₹ 3,000", status: "Maintenance", trips: 12, image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=80" },
  { id: 3, name: "Maruti Swift Dzire", plate: "PB 10 5678", type: "Sedan", fuel: "CNG", seats: "5 Seater", price: "₹ 1,200", status: "Active", trips: 89, image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg?q=80" },
  { id: 4, name: "Hyundai Creta", plate: "PB 08 4321", type: "SUV", fuel: "Petrol", seats: "5 Seater", price: "₹ 2,000", status: "Active", trips: 34, image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80" },
];

/**
 * Generic Placeholder for Car Sub-Pages
 */
const CarPlaceholder = ({ title, subtitle, isAccident = false }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className={`bg-white rounded-xl border-2 border-dashed ${isAccident ? 'border-red-300' : 'border-gray-300'} p-10 flex flex-col items-center justify-center text-center min-h-[400px]`}>
         <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isAccident ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
            {isAccident ? <MdWarning size={40} /> : <MdFolderOpen size={40} />}
         </div>
         <h3 className="text-xl font-semibold text-gray-700">Module: {title}</h3>
         <p className="text-gray-500 max-w-sm mt-2">
            Features for "{title}" will be implemented here. {isAccident ? 'This is a critical module for accident tracking.' : ''}
         </p>
      </div>
    </div>
  );
};

export const AllCarsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Active': return <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">Active</span>;
            case 'Maintenance': return <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Maintenance</span>;
            case 'Idle': return <span className="px-2 py-1 rounded bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">Idle</span>;
            default: return <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">{status}</span>;
        }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">All Cars</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
            <p className="text-gray-500 text-sm">Manage your entire fleet and viewing details.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium shadow-sm transition-colors"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            <MdAdd size={20} />
            Add New Car
          </button>
        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Make, Model, Plate..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ focusRingColor: rgba(premiumColors.primary.DEFAULT, 0.2), borderColor: 'transparent' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
               <select 
                  className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer min-w-[120px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option>Status: All</option>
                 <option>Active</option>
                 <option>Maintenance</option>
                 <option>Idle</option>
               </select>
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer min-w-[120px]">
                 <option>Type: All</option>
                 <option>SUV</option>
                 <option>Sedan</option>
                 <option>Hatchback</option>
               </select>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 w-24">Image</th>
                <th className="p-4">Car Details</th>
                <th className="p-4">Reg No</th>
                <th className="p-4">Price/Day</th>
                <th className="p-4">Status & Trips</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_CARS_DATA.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{car.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                       <span>{car.fuel}</span> • <span>{car.type}</span> • <span>{car.seats}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-gray-600 font-medium">
                    {car.plate}
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    {car.price}
                  </td>
                  <td className="p-4">
                     <div className="flex flex-col items-start gap-1">
                        {getStatusBadge(car.status)}
                        <span className="text-[10px] text-gray-400 font-semibold">{car.trips} Trips Completed</span>
                     </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        className="p-2 text-gray-400 rounded-lg transition-colors"
                        style={{ ':hover': { color: premiumColors.primary.DEFAULT, backgroundColor: rgba(premiumColors.primary.DEFAULT, 0.1) } }}
                    >
                        <MdVisibility size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MdMoreVert size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_CARS_DATA.length === 0 && (
             <div className="p-10 text-center text-gray-500">No cars found in fleet.</div>
          )}
        </div>
      </div>
    );
};
// Mock Data for Live Status
const MOCK_LIVE_STATUS = [
  { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", trip: "Delhi -> Agra", location: "Agra Hwy, Near Mathura", return: "Today, 8:00 PM", status: "On Trip" },
  { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", trip: "Manali Trip", location: "Mandi, HP", return: "Tomorrow, 10:00 AM", status: "On Trip" },
  { id: 3, car: "Swift Dzire", reg: "PB 10 5678", trip: "Local Usage", location: "Sector 17, Chandigarh", return: "Today, 6:00 PM", status: "On Trip" },
];

export const LiveStatusPage = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">Live Status</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Live Status Comparison</h1>
            <p className="text-gray-500 text-sm">Real-time tracking of fleet movement.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-colors"
          >
            <MdRefresh size={20} />
            Refresh
          </button>
        </div>
  
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">On Trip</p>
                   <h3 className="text-2xl font-extrabold text-green-600 mt-1">45</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full text-green-500">
                    <MdDirectionsCar size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Idle</p>
                   <h3 className="text-2xl font-extrabold text-gray-600 mt-1">10</h3>
                </div>
                <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                    <MdLocalGasStation size={24} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                   <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Maintenance</p>
                   <h3 className="text-2xl font-extrabold text-red-600 mt-1">5</h3>
                </div>
                <div className="p-3 bg-red-50 rounded-full text-red-500">
                    <MdSettings size={24} />
                </div>
            </div>
        </div>
  
        {/* Live Tracking Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/30 border-b border-blue-100 text-xs uppercase tracking-wider text-blue-800 font-bold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Current Trip</th>
                <th className="p-4">Current Location</th>
                <th className="p-4">Est. Return</th>
                <th className="p-4 text-right">Map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_LIVE_STATUS.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4">
                     <span className="font-medium text-gray-800">{item.trip}</span>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5 text-gray-600">
                        <MdLocationOn className="text-red-500" size={16} /> {item.location}
                     </div>
                  </td>
                  <td className="p-4 font-medium text-indigo-600">
                    {item.return}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        View Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
// Mock Data for Idle Cars
const MOCK_IDLE_CARS = [
  { id: 1, car: "Maruti Swift Dzire", reg: "PB 10 5678", location: "Office HQ", idleFor: "2 Days", condition: "Good" },
  { id: 2, car: "Hyundai Creta", reg: "PB 08 4321", location: "Airport Yard", idleFor: "1 Day", condition: "Needs Wash" },
  { id: 3, car: "Toyota Etios", reg: "PB 01 9988", location: "Sector 17", idleFor: "5 Hours", condition: "Fuel Low" },
];

export const IdleCarsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
  
    const getConditionBadge = (condition) => {
        switch(condition) {
            case 'Good': return <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">Good</span>;
            case 'Needs Wash': return <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">Needs Wash</span>;
            case 'Fuel Low': return <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Fuel Low</span>;
            default: return <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">{condition}</span>;
        }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">Idle Cars</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Idle Inventory</h1>
            <p className="text-gray-500 text-sm">Vehicles available for immediate booking.</p>
          </div>
          <button 
            onClick={() => navigate('/crm/bookings/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            <MdAdd size={20} />
            Create Booking
          </button>
        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Vehicle..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3">
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Location: All</option>
                 <option>Office HQ</option>
                 <option>Airport Yard</option>
               </select>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Vehicle Details</th>
                <th className="p-4">Parked At</th>
                <th className="p-4">Idle Duration</th>
                <th className="p-4">Condition</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_IDLE_CARS.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5 text-gray-700">
                        <MdLocalParking className="text-gray-400" size={16} /> {item.location}
                     </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <MdTimer className="text-orange-400" size={16} /> {item.idleFor}
                     </div>
                  </td>
                  <td className="p-4">
                     {getConditionBadge(item.condition)}
                  </td>
                  <td className="p-4 text-right">
                    <button className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                        <MdPlayArrow size={16} /> Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {MOCK_IDLE_CARS.length === 0 && (
             <div className="p-10 text-center text-gray-500">No idle cars available. Great job!</div>
          )}
        </div>
      </div>
    );
};
// Mock Data for Car Timeline
const MOCK_TIMELINE_DATA = [
  { id: 1, date: "Dec 27, 2025", time: "10:00 AM", type: "Trip Started", title: "Delhi -> Agra", description: "Driven by Rajesh", icon: "car", color: "bg-blue-100 text-blue-600" },
  { id: 2, date: "Dec 26, 2025", time: "05:00 PM", type: "Refueling", title: "₹ 2,000 Diesel", description: "@ Shell Pump, Ambala", icon: "fuel", color: "bg-green-100 text-green-600" },
  { id: 3, date: "Dec 25, 2025", time: "02:00 PM", type: "Service", title: "Oil Change & Wheel Alignment", description: "@ Sharma Garage", icon: "service", color: "bg-orange-100 text-orange-600" },
  { id: 4, date: "Dec 20, 2025", time: "09:00 PM", type: "Trip Ended", title: "Manali -> Delhi", description: "4 Days Trip Completed", icon: "history", color: "bg-gray-100 text-gray-600" },
];

export const CarTimelinePage = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">Timeline</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Car History Log</h1>
            <p className="text-gray-500 text-sm">Chronological events and usage history.</p>
          </div>
          <div className="w-full md:w-72">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Select Vehicle</label>
             <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-gray-700 cursor-pointer shadow-sm">
                <option>Toyota Innova Crysta (PB 01 1234)</option>
                <option>Mahindra Thar (PB 65 9876)</option>
             </select>
          </div>
        </div>
  
        {/* Timeline Content */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
             <div className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-gray-100 md:left-[147px]"></div>
             
             <div className="space-y-8 relative">
                 {MOCK_TIMELINE_DATA.map((item) => (
                     <div key={item.id} className="flex flex-col md:flex-row gap-4 md:gap-8 relative">
                         {/* Date & Time (Left on Desktop) */}
                         <div className="md:w-32 text-left md:text-right shrink-0 pt-2 pl-14 md:pl-0">
                             <div className="font-bold text-gray-800 text-sm">{item.date}</div>
                             <div className="text-xs text-gray-400 font-medium">{item.time}</div>
                         </div>
                         
                         {/* Icon/Connector */}
                         <div className="absolute left-0 md:left-[130px] w-14 md:w-auto flex justify-center md:block">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 relative ${item.color}`}>
                                  {item.icon === 'car' && <MdDirectionsCar size={18} />}
                                  {item.icon === 'fuel' && <MdLocalGasStation size={18} />}
                                  {item.icon === 'service' && <MdBuild size={18} />}
                                  {item.icon === 'history' && <MdHistory size={18} />}
                              </div>
                         </div>
                         
                         {/* Content Card */}
                         <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors ml-14 md:ml-0">
                             <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1 inline-block ${item.color.replace('text-', 'bg-').replace('100', '50')} ${item.color.split(' ')[1]}`}>
                                    {item.type}
                                </span>
                             </div>
                             <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                             <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                         </div>
                     </div>
                 ))}
             </div>
             
             {/* End of Log */}
             <div className="flex flex-col md:flex-row gap-4 md:gap-8 relative mt-8">
                <div className="md:w-32 text-right shrink-0"></div>
                <div className="absolute left-0 md:left-[130px] w-14 md:w-auto flex justify-center md:block">
                     <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white ml-[14px] md:ml-[14px]"></div>
                </div>
                <div className="flex-1 pl-14 md:pl-0 text-xs text-gray-400 font-medium uppercase tracking-wider">
                     End of stored history
                </div>
             </div>
        </div>
      </div>
    );
};
// Mock Data for Profit/Loss
const MOCK_PROFIT_LOSS = [
  { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 2,00,000", expense: "₹ 50,000", profit: "₹ 1,50,000", roi: "15%", status: "High Profit" },
  { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", revenue: "₹ 1,00,000", expense: "₹ 80,000", profit: "₹ 20,000", roi: "2%", status: "Low Margin" },
  { id: 3, car: "Swift Dzire", reg: "PB 10 5678", revenue: "₹ 50,000", expense: "₹ 10,000", profit: "₹ 40,000", roi: "20%", status: "Excellent" },
];

export const CarProfitLossPage = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">Profit & Loss</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Financial Analysis</h1>
            <p className="text-gray-500 text-sm">Revenue vs Expenses per vehicle breakdown.</p>
          </div>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium cursor-pointer shadow-sm">
             <option>Last 90 Days</option>
             <option>This Month</option>
             <option>Last Quarter</option>
             <option>This Year</option>
          </select>
        </div>
  
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MdAttachMoney size={80} className="text-green-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Earnings</p>
                <h3 className="text-3xl font-extrabold text-green-600 mt-2">₹ 5,00,000</h3>
                <div className="mt-2 text-xs font-semibold text-green-700 flex items-center gap-1">
                   <MdTrendingUp /> +15% vs last period
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MdTrendingDown size={80} className="text-red-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Expenses</p>
                <h3 className="text-3xl font-extrabold text-red-500 mt-2">₹ 1,50,000</h3>
                <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                   <MdWarning /> Fuel costs increased by 5%
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MdDirectionsCar size={80} className="text-indigo-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Net Profit</p>
                <h3 className="text-3xl font-extrabold text-indigo-900 mt-2">₹ 3,50,000</h3>
                <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                   Healthy Margin (70%)
                </div>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50/30 border-b border-indigo-100 text-xs uppercase tracking-wider text-indigo-800 font-bold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Expense</th>
                <th className="p-4">Net Profit</th>
                <th className="p-4">ROI</th>
                <th className="p-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_PROFIT_LOSS.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4 text-green-600 font-bold">
                    {item.revenue}
                  </td>
                  <td className="p-4 text-red-500 font-medium">
                    - {item.expense}
                  </td>
                  <td className="p-4 font-extrabold text-indigo-900">
                    {item.profit}
                  </td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold border ${item.status === 'Low Margin' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        {item.roi}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'Low Margin' ? (
                         <div className="flex items-center justify-end gap-1 text-red-500 font-bold text-xs"><MdTrendingDown /> Declining</div>
                    ) : (
                         <div className="flex items-center justify-end gap-1 text-green-500 font-bold text-xs"><MdTrendingUp /> Growing</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
// Mock Data for Car Health
const MOCK_CAR_HEALTH = [
  { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", odometer: "50,000 km", health: 95, nextService: "In 2,000 km", status: "Good" },
  { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", odometer: "10,000 km", health: 40, nextService: "Overdue (500 km)", status: "Critical" },
  { id: 3, car: "Swift Dzire", reg: "PB 10 5678", odometer: "85,000 km", health: 78, nextService: "In 500 km", status: "Warning" },
];

export const CarHealthPage = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">Health Score</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Health Dashboard</h1>
            <p className="text-gray-500 text-sm">Monitor fleet condition and service schedules.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            <MdBuild size={20} />
            Schedule Service
          </button>
        </div>
  
        {/* Fleet Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MdHealthAndSafety size={24} className="text-green-600" />
                    <span className="font-bold text-green-800">Good Condition</span>
                </div>
                <span className="text-2xl font-bold text-green-700">40</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MdWarning size={24} className="text-amber-600" />
                    <span className="font-bold text-amber-800">Needs Attention</span>
                </div>
                <span className="text-2xl font-bold text-amber-700">10</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MdWarning size={24} className="text-red-600" />
                    <span className="font-bold text-red-800">Critical</span>
                </div>
                <span className="text-2xl font-bold text-red-700">5</span>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Odometer</th>
                <th className="p-4">Health Score</th>
                <th className="p-4">Next Service</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_CAR_HEALTH.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <MdSpeed size={16} className="text-gray-400" /> {item.odometer}
                     </div>
                  </td>
                  <td className="p-4">
                     <div className="w-full max-w-[100px]">
                        <div className="flex justify-between text-xs mb-1 font-bold">
                            <span>{item.health}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${item.health > 80 ? 'bg-green-500' : item.health > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                style={{ width: `${item.health}%` }}
                            ></div>
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                     <span className={`text-sm font-semibold ${item.nextService.includes('Overdue') ? 'text-red-600' : 'text-gray-600'}`}>
                        {item.nextService}
                     </span>
                  </td>
                  <td className="p-4">
                     {item.status === 'Good' && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">Good</span>}
                     {item.status === 'Warning' && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-100">Warning</span>}
                     {item.status === 'Critical' && <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-100">Critical</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">Diagnosis</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
// Mock Data for Car Documents
const MOCK_CAR_DOCS = [
  { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", docName: "Insurance Policy", expiry: "10 Jan 2026", status: "Valid", type: "Insurance" },
  { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", docName: "Pollution (PUC)", expiry: "28 Dec 2025", status: "Expiring Soon", type: "PUC" },
  { id: 3, car: "Swift Dzire", reg: "PB 10 5678", docName: "Fitness Certificate", expiry: "05 May 2024", status: "Expired", type: "Fitness" },
];

export const CarDocumentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span className="text-gray-800 font-medium">Documents</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Documents</h1>
            <p className="text-gray-500 text-sm">Manage insurance, RC, PUC and other compliance docs.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            <MdFileUpload size={20} />
            Upload Document
          </button>
        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Vehicle or Document..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3">
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Type: All</option>
                 <option>Insurance</option>
                 <option>PUC</option>
                 <option>RC</option>
                 <option>Permit</option>
               </select>
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Status: All</option>
                 <option>Valid</option>
                 <option>Expiring Soon</option>
                 <option>Expired</option>
               </select>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/30 border-b border-blue-100 text-xs uppercase tracking-wider text-blue-800 font-bold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Document Details</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_CAR_DOCS.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                            <MdDescription size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{item.docName}</div>
                            <div className="text-xs text-gray-400">{item.type}</div>
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <MdDateRange size={16} className="text-gray-400" /> {item.expiry}
                     </div>
                  </td>
                  <td className="p-4">
                     {item.status === 'Valid' && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">Valid</span>}
                     {item.status === 'Expiring Soon' && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold border border-amber-100">Expiring Soon</span>}
                     {item.status === 'Expired' && <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-100">Expired</span>}
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'Valid' ? (
                        <button className="text-blue-600 hover:underline text-xs font-bold">View</button>
                    ) : (
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm">
                            Renew Now
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

// Accident Pages - Mock Data
const MOCK_ACCIDENTS = [
  { 
     id: 1, 
     car: "Toyota Innova Crysta", 
     reg: "PB 01 1234", 
     date: "26 Dec 2025", 
     location: "Delhi-Agra Hwy",
     severity: "Major", 
     status: "In Repair", 
     image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/115025/innova-crysta-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80" 
  },
  { 
     id: 2, 
     car: "Mahindra Thar", 
     reg: "PB 65 9876", 
     date: "20 Dec 2025", 
     location: "Manali, HP",
     severity: "Medium", 
     status: "Survey Pending", 
     image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=80" 
  },
  { 
     id: 3, 
     car: "Maruti Swift Dzire", 
     reg: "PB 10 5678", 
     date: "15 Dec 2025", 
     location: "Chandigarh",
     severity: "Minor", 
     status: "Reported", 
     image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg?q=80" 
  },
];

export const AccidentActivePage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const getSeverityColor = (severity) => {
        switch(severity) {
            case 'Major': return 'bg-red-50 text-red-700 border-red-200';
            case 'Medium': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Minor': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span>Accidents</span> <span>/</span> <span className="text-gray-800 font-medium">Active</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Active Accident Cases</h1>
            <p className="text-gray-500 text-sm">Track and manage ongoing accident claims and repairs.</p>
          </div>
          <button 
            onClick={() => navigate('/crm/cars/accidents/add')}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium shadow-sm hover:bg-red-700 transition-colors"
          >
            <MdAdd size={20} />
            Report New Case
          </button>
        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search car, number..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3">
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Severity: All</option>
                 <option>Major</option>
                 <option>Medium</option>
                 <option>Minor</option>
               </select>
            </div>
        </div>

        {/* Alerts */}
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
            <MdError className="text-red-500 mt-0.5 shrink-0" size={20} />
            <div>
                <h4 className="text-sm font-bold text-red-800">Critical Alerts</h4>
                <p className="text-xs text-red-600 mt-0.5">2 New claims filed today requiring immediate surveyor approval.</p>
            </div>
        </div>
  
        {/* Cards Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ACCIDENTS.map((item, index) => (
            <div 
                key={item.id} 
                onClick={() => navigate(`/crm/cars/accidents/${item.id}`)}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
            >
               {/* Car Image */}
               <div className="h-48 bg-gray-100 relative overflow-hidden">
                   <img src={item.image} alt={item.car} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-3 right-3">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getSeverityColor(item.severity)}`}>
                          {item.severity} Damage
                       </span>
                   </div>
               </div>
               
               {/* Content */}
               <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                       <div>
                           <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.car}</h3>
                           <p className="text-sm font-mono text-gray-500 font-medium">{item.reg}</p>
                       </div>
                   </div>
                   
                   <div className="space-y-3 mt-4">
                       <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                           <span className="text-gray-500">Incident Date</span>
                           <span className="font-medium text-gray-800">{item.date}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                           <span className="text-gray-500">Location</span>
                           <span className="font-medium text-gray-800">{item.location}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm pt-1">
                           <span className="text-gray-500">Current Status</span>
                           <span className="font-bold text-indigo-600">{item.status}</span>
                       </div>
                   </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
};
export const AccidentAddPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span>Accidents</span> <span>/</span> <span className="text-gray-800 font-medium">New Report</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Report New Accident</h1>
                <p className="text-gray-500 text-sm">File a detailed incident report for insurance and repairs.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Step 1: Vehicle & Incident */}
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
                        Vehicle & Incident Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Select Vehicle</label>
                             <div className="relative">
                                 <MdDirectionsCar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow appearance-none cursor-pointer">
                                     <option>Select a car...</option>
                                     <option>Toyota Innova Crysta (PB 01 1234)</option>
                                     <option>Mahindra Thar (PB 65 9876)</option>
                                 </select>
                             </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Incident Date & Time</label>
                             <div className="relative">
                                 <MdAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input type="datetime-local" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow" />
                             </div>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Incident Location</label>
                             <div className="relative">
                                 <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input type="text" placeholder="Enter exact location (e.g. NH-44 near Ambala)" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow" />
                             </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Driver Name</label>
                             <div className="relative">
                                 <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input type="text" placeholder="Driver on duty" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow" />
                             </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Driver License No.</label>
                             <div className="relative">
                                 <MdDriveEta className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input type="text" placeholder="DL Number" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Step 2: Damage Assessment */}
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
                        Damage Assessment
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Severity Level</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow appearance-none cursor-pointer">
                                     <option>Minor (Scratches/Dents)</option>
                                     <option>Major (Parts Replacement)</option>
                                     <option>Critical (Non-drivable)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Cost (Optional)</label>
                                <div className="relative">
                                    <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Approx repair cost" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow" />
                                </div>
                            </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description of Incident & Damage</label>
                             <textarea 
                                rows="4" 
                                placeholder="Describe how the accident happened and visible damages..."
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-shadow resize-none"
                             ></textarea>
                        </div>
                    </div>
                </div>

                {/* Step 3: Evidence */}
                <div className="p-6">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
                        Evidence & Photos
                    </h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MdCloudUpload size={30} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-700">Click to Upload Photos/Videos</h4>
                        <p className="text-gray-400 text-sm mt-1 max-w-xs">Upload images of all 4 sides of the car and close-ups of damaged areas.</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button 
                        onClick={() => navigate('/crm/cars/accidents')}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                         onClick={() => navigate('/crm/cars/accidents')}
                         className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2"
                    >
                        <MdWarning size={18} />
                        Alert Admin & Save Case
                    </button>
                </div>
            </div>
        </div>
    );
};
// Mock Data for Claims
const MOCK_CLAIMS = [
  { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", policy: "#POL-9988", insurer: "Tata AIG", amount: "₹ 65,000", status: "Surveyor Appointed", surveyor: "Mr. Verma" },
  { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", policy: "#POL-1122", insurer: "HDFC Ergo", amount: "₹ 25,000", status: "Approved", approvedAmt: "₹ 22,000" },
  { id: 3, car: "Maruti Swift Dzire", reg: "PB 10 5678", policy: "#POL-3344", insurer: "ICICI Lombard", amount: "₹ 10,000", status: "Rejected", reason: "Policy Expired" },
];

export const AccidentClaimsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span>Accidents</span> <span>/</span> <span className="text-gray-800 font-medium">Claims</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Insurance Claims</h1>
            <p className="text-gray-500 text-sm">Manage and track insurance claim settlements.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            <MdAdd size={20} />
            File New Claim
          </button>
        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Policy No or Car..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3">
               <select className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer">
                 <option>Status: All</option>
                 <option>Processing</option>
                 <option>Approved</option>
                 <option>Rejected</option>
               </select>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/30 border-b border-blue-100 text-xs uppercase tracking-wider text-blue-800 font-bold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Policy / Insurer</th>
                <th className="p-4">Claim Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {MOCK_CLAIMS.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                            <MdPolicy size={18} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{item.policy}</div>
                            <div className="text-xs text-gray-400">{item.insurer}</div>
                        </div>
                     </div>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        {item.amount}
                     </div>
                     {item.status === 'Approved' && (
                         <div className="text-xs text-green-600 font-medium mt-1">Approved: {item.approvedAmt}</div>
                     )}
                  </td>
                  <td className="p-4">
                     {item.status === 'Approved' && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100">Approved</span>}
                     {item.status === 'Surveyor Appointed' && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">Surveyor Appointed</span>}
                     {item.status === 'Rejected' && <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold border border-red-100">Rejected</span>}
                     
                     {item.surveyor && (
                         <div className="text-xs text-gray-400 mt-1">By: {item.surveyor}</div>
                     )}
                     {item.reason && (
                         <div className="text-xs text-red-400 mt-1">{item.reason}</div>
                     )}
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'Rejected' ? (
                        <button className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                            <MdGavel size={14} /> Appeal
                        </button>
                    ) : item.status === 'Approved' ? (
                         <button className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-green-600 text-white border border-green-600 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors shadow-sm">
                            <MdCheckCircle size={14} /> Settle
                        </button>
                    ) : (
                         <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">Track Status</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};
// Mock Data for Recovery
const MOCK_RECOVERY = [
  { id: 1, car: "Mahindra Thar", reg: "PB 65 9876", pickup: "Manali Hwy, Near Kullu", drop: "Sharma Auto Works, Delhi", vendor: "Roadside 24x7", phone: "+91 99887 76655", status: "Enroute", eta: "5 Hours" },
  { id: 2, car: "Toyota Innova Crysta", reg: "PB 01 1234", pickup: "Agra Expressway", drop: "Service Center, Agra", vendor: "Highway Towing", phone: "+91 88776 65544", status: "Arrived", eta: "-" },
];

export const AccidentRecoveryPage = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Cars</span> <span>/</span> <span>Accidents</span> <span>/</span> <span className="text-gray-800 font-medium">Recovery</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Recovery & Towing</h1>
            <p className="text-gray-500 text-sm">Track live towing operations and vendor assignments.</p>
          </div>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-medium shadow-sm hover:bg-gray-800 transition-colors"
          >
            <MdCall size={20} />
            Call Tow Truck
          </button>
        </div>
  
        {/* Active Jobs */}
        <div className="space-y-4">
             {MOCK_RECOVERY.map((item) => (
                 <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                              <MdLocalShipping size={30} className={item.status === 'Enroute' ? 'animate-pulse' : ''} />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-gray-900">{item.car}</h3>
                              <p className="text-sm font-mono text-gray-500">{item.reg}</p>
                              <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${item.status === 'Enroute' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                      {item.status}
                                  </span>
                                  {item.eta !== '-' && <span className="text-xs text-gray-500 font-medium">ETA: {item.eta}</span>}
                              </div>
                          </div>
                      </div>
                      
                      <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pickup Location</p>
                               <div className="flex gap-2">
                                  <MdLocationOn className="text-red-500 shrink-0 mt-0.5" size={16} />
                                  <p className="text-sm text-gray-800 font-medium leading-tight">{item.pickup}</p>
                               </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Drop Location</p>
                               <div className="flex gap-2">
                                  <MdLocationOn className="text-green-600 shrink-0 mt-0.5" size={16} />
                                  <p className="text-sm text-gray-800 font-medium leading-tight">{item.drop}</p>
                               </div>
                          </div>
                      </div>

                      <div className="w-full md:w-auto flex flex-col items-end gap-2">
                          <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">{item.vendor}</p>
                              <p className="text-xs text-gray-500">Contact: {item.phone}</p>
                          </div>
                          <button className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs rounded-lg transition-colors">
                              Contact Driver
                          </button>
                      </div>
                 </div>
             ))}
        </div>
      </div>
    );
};
export const AccidentClosedPage = () => <CarPlaceholder title="Closed & Settled Cases" subtitle="History of resolved accidents" isAccident={true} />;
export const AccidentSummaryPage = () => <CarPlaceholder title="Loss Recovery Summary" subtitle="Financial impact analysis" isAccident={true} />;
