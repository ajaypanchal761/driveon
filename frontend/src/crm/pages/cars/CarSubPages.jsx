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
  MdCall,
  MdAutorenew,
  MdFolderOff,
  MdClose
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

const SimpleModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <MdClose size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AllCarsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');


  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">Active</span>;
      case 'Maintenance': return <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Maintenance</span>;
      case 'Idle': return <span className="px-2 py-1 rounded bg-gray-50 text-gray-600 text-xs font-bold border border-gray-100">Idle</span>;
      default: return <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">{status}</span>;
    }
  };

  const filteredCars = MOCK_CARS_DATA.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || car.status === statusFilter;
    const matchesType = typeFilter === 'All' || car.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
              <span>/</span> 
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/cars/all')}>Cars</span> 
              <span>/</span> 
              <span className="text-gray-800 font-medium">All Cars</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
            <p className="text-gray-500 text-sm">Manage your entire fleet and viewing details.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium shadow-sm transition-colors hover:opacity-90 active:scale-95"
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
                 <option value="All">Status: All</option>
                 <option value="Active">Active</option>
                 <option value="Maintenance">Maintenance</option>
                 <option value="Idle">Idle</option>
               </select>
               <select 
                  className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer min-w-[120px]"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
               >
                 <option value="All">Type: All</option>
                 <option value="SUV">SUV</option>
                 <option value="Sedan">Sedan</option>
                 <option value="Hatchback">Hatchback</option>
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
              {filteredCars.map((car) => (
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
          
          {filteredCars.length === 0 && (
             <div className="p-10 text-center text-gray-500">No cars found matching your filters.</div>
          )}
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
  const [locationFilter, setLocationFilter] = useState('All');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const getConditionBadge = (condition) => {
    switch (condition) {
      case 'Good': return <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">Good</span>;
      case 'Needs Wash': return <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">Needs Wash</span>;
      case 'Fuel Low': return <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Fuel Low</span>;
      default: return <span className="px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">{condition}</span>;
    }
  };

  const filteredIdleCars = MOCK_IDLE_CARS.filter(item => {
    const matchesSearch = item.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'All' || item.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
              <span>/</span> 
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/cars/all')}>Cars</span> 
              <span>/</span> 
              <span className="text-gray-800 font-medium">Idle Cars</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Idle Inventory</h1>
            <p className="text-gray-500 text-sm">Vehicles available for immediate booking.</p>
          </div>
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
               <select 
                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer"
                 value={locationFilter}
                 onChange={(e) => setLocationFilter(e.target.value)}
               >
                 <option value="All">Location: All</option>
                 <option value="Office HQ">Office HQ</option>
                 <option value="Airport Yard">Airport Yard</option>
                 <option value="Sector 17">Sector 17</option>
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
              {filteredIdleCars.map((item) => (
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
                    <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-indigo-600 text-white border border-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <MdPlayArrow size={16} /> Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredIdleCars.length === 0 && (
             <div className="p-10 text-center text-gray-500">No idle cars found matching your filters.</div>
          )}
        </div>

      {/* Booking Modal */}
      <SimpleModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Create Fast Booking">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100">
              <option>Walk-in Customer</option>
              <option>Rahul Sharma (Returning)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100">
              {MOCK_IDLE_CARS.map(car => <option key={car.id}>{car.car} - {car.reg}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
          </div>
          <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors" style={{ backgroundColor: premiumColors.primary.DEFAULT }}>
            Confirm Booking
          </button>
        </div>
      </SimpleModal>
    </div>
  );
};

// Mock Data for Profit/Loss
const MOCK_PROFIT_DATA = {
  'Last 90 Days': {
    stats: { earnings: "₹ 5,00,000", expenses: "₹ 1,50,000", profit: "₹ 3,50,000", earningsTrend: "+15% vs last period", expenseTrend: "Fuel costs increased by 5%", profitComment: "Healthy Margin (70%)" },
    table: [
      { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 2,00,000", expense: "₹ 50,000", profit: "₹ 1,50,000", roi: "15%", status: "High Profit" },
      { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", revenue: "₹ 1,00,000", expense: "₹ 80,000", profit: "₹ 20,000", roi: "2%", status: "Low Margin" },
      { id: 3, car: "Swift Dzire", reg: "PB 10 5678", revenue: "₹ 50,000", expense: "₹ 10,000", profit: "₹ 40,000", roi: "20%", status: "Excellent" },
    ]
  },
  'This Month': {
    stats: { earnings: "₹ 1,80,000", expenses: "₹ 60,000", profit: "₹ 1,20,000", earningsTrend: "+8% vs last month", expenseTrend: "Maintenance high", profitComment: "Good Margin (66%)" },
    table: [
      { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 80,000", expense: "₹ 20,000", profit: "₹ 60,000", roi: "12%", status: "High Profit" },
      { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", revenue: "₹ 40,000", expense: "₹ 35,000", profit: "₹ 5,000", roi: "1%", status: "Low Margin" },
      { id: 3, car: "Swift Dzire", reg: "PB 10 5678", revenue: "₹ 30,000", expense: "₹ 5,000", profit: "₹ 25,000", roi: "18%", status: "Excellent" },
    ]
  },
  'Last Quarter': {
    stats: { earnings: "₹ 4,50,000", expenses: "₹ 1,20,000", profit: "₹ 3,30,000", earningsTrend: "+10% vs prev quarter", expenseTrend: "Stable", profitComment: "Strong Performance" },
    table: [
      { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 1,80,000", expense: "₹ 40,000", profit: "₹ 1,40,000", roi: "14%", status: "High Profit" },
      { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", revenue: "₹ 90,000", expense: "₹ 70,000", profit: "₹ 20,000", roi: "3%", status: "Low Margin" },
      { id: 3, car: "Swift Dzire", reg: "PB 10 5678", revenue: "₹ 60,000", expense: "₹ 10,000", profit: "₹ 50,000", roi: "22%", status: "Excellent" },
    ]
  },
  'This Year': {
    stats: { earnings: "₹ 22,00,000", expenses: "₹ 6,50,000", profit: "₹ 15,50,000", earningsTrend: "+25% YOY", expenseTrend: "Inflation adjusted", profitComment: "Record Highs" },
    table: [
      { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", revenue: "₹ 8,00,000", expense: "₹ 2,00,000", profit: "₹ 6,00,000", roi: "18%", status: "High Profit" },
      { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", revenue: "₹ 4,00,000", expense: "₹ 3,00,000", profit: "₹ 1,00,000", roi: "5%", status: "Low Margin" },
      { id: 3, car: "Swift Dzire", reg: "PB 10 5678", revenue: "₹ 3,00,000", expense: "₹ 50,000", profit: "₹ 2,50,000", roi: "25%", status: "Excellent" },
    ]
  }
};

export const CarProfitLossPage = () => {
  const [timeRange, setTimeRange] = useState('Last 90 Days');
  const currentData = MOCK_PROFIT_DATA[timeRange] || MOCK_PROFIT_DATA['Last 90 Days'];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
              <span>/</span> 
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/cars/all')}>Cars</span> 
              <span>/</span> 
              <span className="text-gray-800 font-medium">Profit & Loss</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Financial Analysis</h1>
            <p className="text-gray-500 text-sm">Revenue vs Expenses per vehicle breakdown.</p>
          </div>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium cursor-pointer shadow-sm"
          >
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
                <h3 className="text-3xl font-extrabold text-green-600 mt-2">{currentData.stats.earnings}</h3>
                <div className="mt-2 text-xs font-semibold text-green-700 flex items-center gap-1">
                   <MdTrendingUp /> {currentData.stats.earningsTrend}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MdTrendingDown size={80} className="text-red-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Expenses</p>
                <h3 className="text-3xl font-extrabold text-red-500 mt-2">{currentData.stats.expenses}</h3>
                <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                   <MdWarning /> {currentData.stats.expenseTrend}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MdDirectionsCar size={80} className="text-indigo-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Net Profit</p>
                <h3 className="text-3xl font-extrabold text-indigo-900 mt-2">{currentData.stats.profit}</h3>
                <div className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                   {currentData.stats.profitComment}
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
              {currentData.table.map((item) => (
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

// Mock Data for Car Documents
const MOCK_CAR_DOCS = [
  { id: 1, car: "Toyota Innova Crysta", reg: "PB 01 1234", docName: "Insurance Policy", expiry: "10 Jan 2026", status: "Valid", type: "Insurance" },
  { id: 2, car: "Mahindra Thar", reg: "PB 65 9876", docName: "Pollution (PUC)", expiry: "28 Dec 2025", status: "Expiring Soon", type: "PUC" },
  { id: 3, car: "Swift Dzire", reg: "PB 10 5678", docName: "Fitness Certificate", expiry: "05 May 2024", status: "Expired", type: "Fitness" },
  { id: 4, car: "Toyota Fortuner", reg: "CH 01 9999", docName: "Registration Certificate (RC)", expiry: "15 Aug 2030", status: "Valid", type: "RC" },
  { id: 5, car: "Honda City", reg: "HR 26 5555", docName: "All India Permit", expiry: "12 Mar 2025", status: "Expiring Soon", type: "Permit" },
];

export const CarDocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [docs, setDocs] = useState(MOCK_CAR_DOCS);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  // Form States
  const [newDocData, setNewDocData] = useState({
    vehicle: 'Toyota Innova Crysta (PB 01 1234)',
    type: 'Insurance Policy',
    expiry: ''
  });

  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSaveDocument = () => {
    if (!selectedFile || !newDocData.expiry) {
      alert("Please select a file and expiry date.");
      return;
    }

    const vehicleParts = newDocData.vehicle.split(' (');
    const carName = vehicleParts[0];
    const regNumber = vehicleParts[1].replace(')', '');

    // Create a URL for the file to preview/download
    const fileUrl = URL.createObjectURL(selectedFile);

    const newDoc = {
      id: docs.length + 1,
      car: carName,
      reg: regNumber,
      docName: newDocData.type,
      expiry: newDocData.expiry.split('-').reverse().join(' '), // Simple formatting
      status: 'Valid', // Defaulting to valid for new docs
      type: newDocData.type.split(' ')[0], // Simple type extraction
      fileUrl: fileUrl,
      fileName: selectedFileName,
      mimeType: selectedFile.type
    };

    setDocs([newDoc, ...docs]);

    // Reset and Close
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setSelectedFileName('');
    setNewDocData({
      vehicle: 'Toyota Innova Crysta (PB 01 1234)',
      type: 'Insurance Policy',
      expiry: ''
    });
  };

  // Filter Logic
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.reg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || doc.type === filterType;
    const matchesStatus = filterStatus === 'All' || doc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setIsViewModalOpen(true);
  };



    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
              <span>/</span> 
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/cars/all')}>Cars</span> 
              <span>/</span> 
              <span className="text-gray-800 font-medium">Documents</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Documents</h1>
            <p className="text-gray-500 text-sm">Manage insurance, RC, PUC and other compliance docs.</p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
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
                    placeholder="Search Vehicle, Reg No or Document..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3">
               <select 
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer hover:border-indigo-300 transition-colors"
               >
                 <option value="All">Type: All</option>
                 <option value="Insurance">Insurance</option>
                 <option value="PUC">PUC</option>
                 <option value="RC">RC</option>
                 <option value="Fitness">Fitness</option>
                 <option value="Permit">Permit</option>
               </select>
               <select 
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
                 className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none text-sm font-medium cursor-pointer hover:border-indigo-300 transition-colors"
               >
                 <option value="All">Status: All</option>
                 <option value="Valid">Valid</option>
                 <option value="Expiring Soon">Expiring Soon</option>
                 <option value="Expired">Expired</option>
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
              {filteredDocs.length > 0 ? (
                filteredDocs.map((item) => (
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
                          <button 
                            onClick={() => handleView(item)}
                            className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1 ml-auto"
                          >
                              <MdVisibility size={14} /> View
                          </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                            <MdFolderOff size={40} className="text-gray-300 mb-2" />
                            <p className="font-medium">No documents found matching the criteria.</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Upload Modal */}
      <SimpleModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload New Document">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
            <select
              value={newDocData.vehicle}
              onChange={(e) => setNewDocData({ ...newDocData, vehicle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              <option>Toyota Innova Crysta (PB 01 1234)</option>
              <option>Mahindra Thar (PB 65 9876)</option>
              <option>Swift Dzire (PB 10 5678)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={newDocData.type}
              onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              <option>Insurance Policy</option>
              <option>Pollution Certificate (PUC)</option>
              <option>Registration Certificate (RC)</option>
              <option>Fitness Certificate</option>
              <option>Permit</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={newDocData.expiry}
              onChange={(e) => setNewDocData({ ...newDocData, expiry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MdCloudUpload size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                {selectedFileName ? selectedFileName : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
            </div>
          </div>
          <button
            onClick={handleSaveDocument}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            style={{ backgroundColor: premiumColors.primary.DEFAULT }}
          >
            Save Document
          </button>
        </div>
      </SimpleModal>

      {/* View Document Modal */}
      <SimpleModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Document">
        {selectedDoc && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900">{selectedDoc.docName}</h4>
              <p className="text-sm text-gray-500">{selectedDoc.car} ({selectedDoc.reg})</p>
            </div>
            <div className="aspect-[4/3] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden relative">
              {selectedDoc.fileUrl ? (
                selectedDoc.mimeType?.startsWith('image/') ? (
                  <img src={selectedDoc.fileUrl} alt="Document" className="w-full h-full object-contain" />
                ) : (
                  <iframe src={selectedDoc.fileUrl} title="Document" className="w-full h-full" />
                )
              ) : (
                /* Placeholder for mocked documents without real files */
                <div className="text-center text-gray-400">
                  <MdDescription size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Preview Not Available for Mock Data</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <span className="font-medium">Expiry Date:</span>
              <span className="font-bold text-blue-700">{selectedDoc.expiry}</span>
            </div>
            {selectedDoc.fileUrl ? (
              <a
                href={selectedDoc.fileUrl}
                download={selectedDoc.fileName || "document"}
                className="block w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors text-center"
              >
                Download Document
              </a>
            ) : (
              <button
                className="w-full py-2.5 bg-gray-300 text-gray-500 rounded-xl font-bold cursor-not-allowed"
                disabled
              >
                Download Not Available
              </button>
            )}
          </div>
        )}
      </SimpleModal>


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
    switch (severity) {
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
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/dashboard')}>Home</span> 
              <span>/</span> 
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/cars/all')}>Cars</span> 
              <span>/</span> 
              <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/crm/cars/accidents/active')}>Accidents</span> 
              <span>/</span> 
              <span className="text-gray-800 font-medium">Active</span>
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




export const AccidentClosedPage = () => <CarPlaceholder title="Closed & Settled Cases" subtitle="History of resolved accidents" isAccident={true} />;
export const AccidentSummaryPage = () => <CarPlaceholder title="Loss Recovery Summary" subtitle="Financial impact analysis" isAccident={true} />;
