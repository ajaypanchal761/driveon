import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdEvent, 
  MdPerson, 
  MdDirectionsCar, 
  MdAttachMoney, 
  MdTrendingUp,
  MdTrendingDown,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdArrowForward
} from 'react-icons/md';

// MOCK DATA: BOOKINGS
const MOCK_BOOKINGS = [
  { 
    id: 'BK-2023-001', 
    user: 'Amit Sharma', 
    car: 'Toyota Innova Crysta', 
    startDate: '2023-12-25', 
    endDate: '2023-12-28', 
    status: 'Active', 
    revenue: 15000, 
    costs: { staff: 1200, fuel: 3000, vendor: 0, maintenance: 0 },
    paymentStatus: 'Paid'
  },
  { 
    id: 'BK-2023-002', 
    user: 'Priya Singh', 
    car: 'Swift Dzire', 
    startDate: '2023-12-30', 
    endDate: '2024-01-02', 
    status: 'Upcoming', 
    revenue: 12000, 
    costs: { staff: 1000, fuel: 2500, vendor: 500, maintenance: 0 },
    paymentStatus: 'Partial'
  },
  { 
    id: 'BK-2023-003', 
    user: 'Rahul Verma', 
    car: 'Mahindra XUV700', 
    startDate: '2023-12-10', 
    endDate: '2023-12-15', 
    status: 'Completed', 
    revenue: 25000, 
    costs: { staff: 2000, fuel: 5000, vendor: 0, maintenance: 1500 }, // Maintenance triggered during trip
    paymentStatus: 'Paid'
  },
  { 
    id: 'BK-2023-004', 
    user: 'Sandeep Yeole', 
    car: 'Hyundai Creta', 
    startDate: '2023-12-20', 
    endDate: '2023-12-22', 
    status: 'Cancelled', 
    revenue: 2000, // Cancellation fee
    costs: { staff: 0, fuel: 0, vendor: 0, maintenance: 0 },
    paymentStatus: 'Refunded'
  },
];

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('All'); // All, Active, Upcoming, Completed, Cancelled
  const [showProfitDetails, setShowProfitDetails] = useState(null); // ID of booking to show profit details for

  const tabs = ['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'];

  const filteredBookings = activeTab === 'All' 
    ? MOCK_BOOKINGS 
    : MOCK_BOOKINGS.filter(b => b.status === activeTab);

  // Profit Calculation Helper
  const calculateProfit = (booking) => {
    const totalCost = Object.values(booking.costs).reduce((a, b) => a + b, 0);
    const netProfit = booking.revenue - totalCost;
    const margin = ((netProfit / booking.revenue) * 100).toFixed(1);
    return { totalCost, netProfit, margin };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Bookings & Deals</h1>
           <p className="text-gray-500 text-sm">Track revenue and trip status</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-right">
           <p className="text-xs text-gray-500 uppercase font-bold">Total Revenue (Dec)</p>
           <p className="text-xl font-bold text-blue-900">Rs. 54,000</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-1 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all relative
              ${activeTab === tab 
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-2 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full text-gray-600">
                 {MOCK_BOOKINGS.filter(b => b.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const { totalCost, netProfit, margin } = calculateProfit(booking);
          const isExpanded = showProfitDetails === booking.id;

          return (
            <motion.div 
              key={booking.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden
                 ${isExpanded ? 'shadow-md border-blue-200 ring-1 ring-blue-100' : 'shadow-sm border-gray-200 hover:shadow-md'}`}
            >
              <div 
                className="p-5 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between"
                onClick={() => setShowProfitDetails(isExpanded ? null : booking.id)}
              >
                 {/* Main Details */}
                 <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0
                       ${booking.status === 'Active' ? 'bg-blue-100 text-blue-600' : 
                         booking.status === 'Completed' ? 'bg-green-100 text-green-600' :
                         booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 
                         'bg-amber-100 text-amber-600'}`}>
                       {booking.status === 'Active' && <MdDirectionsCar />}
                       {booking.status === 'Completed' && <MdCheckCircle />}
                       {booking.status === 'Cancelled' && <MdCancel />}
                       {booking.status === 'Upcoming' && <MdSchedule />}
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{booking.car}</h3>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">{booking.id}</span>
                       </div>
                       <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><MdPerson size={14} /> {booking.user}</span>
                          <span className="flex items-center gap-1"><MdEvent size={14} /> {booking.startDate} to {booking.endDate}</span>
                       </div>
                    </div>
                 </div>

                 {/* Quick Stats / Status */}
                 <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">
                    <div className="text-right"> 
                       <p className="text-xs text-gray-400 font-medium uppercase">Revenue</p>
                       <p className="font-bold text-gray-900">Rs. {booking.revenue.toLocaleString()}</p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border
                       ${booking.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                         booking.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                         booking.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                         'bg-amber-50 text-amber-700 border-amber-200'}`}>
                       {booking.status}
                    </div>
                    
                    <MdArrowForward className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                 </div>
              </div>

              {/* Expanded Profit/Loss View */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gray-50 border-t border-gray-100 px-5 py-4"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cost Breakdown */}
                        <div>
                           <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                             <MdTrendingDown className="text-red-500" /> Cost Breakdown
                           </h4>
                           <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                 <span className="text-gray-600">Staff Cost (Driver)</span>
                                 <span className="font-medium text-red-600">- Rs. {booking.costs.staff}</span>
                              </li>
                              <li className="flex justify-between">
                                 <span className="text-gray-600">Fuel</span>
                                 <span className="font-medium text-red-600">- Rs. {booking.costs.fuel}</span>
                              </li>
                              {booking.costs.vendor > 0 && (
                                <li className="flex justify-between">
                                   <span className="text-gray-600">Vendor Commission</span>
                                   <span className="font-medium text-red-600">- Rs. {booking.costs.vendor}</span>
                                </li>
                              )}
                              {booking.costs.maintenance > 0 && (
                                <li className="flex justify-between">
                                   <span className="text-gray-600">Maintenance (During Trip)</span>
                                   <span className="font-medium text-red-600">- Rs. {booking.costs.maintenance}</span>
                                </li>
                              )}
                              <li className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                                 <span>Total Cost</span>
                                 <span className="text-red-700">Rs. {totalCost.toLocaleString()}</span>
                              </li>
                           </ul>
                        </div>

                        {/* Profit Summary */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                           <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                             <MdTrendingUp className="text-green-500" /> Profit Analysis
                           </h4>
                           
                           <div className="flex justify-between items-end mb-1">
                              <span className="text-gray-600">Booking Amount</span>
                              <span className="font-semibold text-gray-900">Rs. {booking.revenue.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-end mb-3">
                              <span className="text-gray-600">Total Deductions</span>
                              <span className="font-semibold text-red-600">- Rs. {totalCost.toLocaleString()}</span>
                           </div>
                           
                           <div className={`p-3 rounded-lg flex justify-between items-center ${netProfit >= 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                              <div>
                                 <p className="text-xs font-bold uppercase opacity-70">Net Profit</p>
                                 <p className="text-xl font-bold">Rs. {netProfit.toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs font-bold uppercase opacity-70">Margin</p>
                                 <p className="text-lg font-bold">{margin}%</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingsPage;
