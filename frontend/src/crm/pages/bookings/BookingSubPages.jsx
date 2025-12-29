import React, { useState } from 'react';
import { 
  MdSearch, 
  MdFilterList, 
  MdMoreVert, 
  MdDirectionsCar, 
  MdPerson, 
  MdCalendarToday, 
  MdAccessTime, 
  MdAttachMoney, 
  MdCheckCircle, 
  MdCancel, 
  MdWarning,
  MdTrendingUp,
  MdTrendingDown,
  MdLocalGasStation,
  MdReceipt
} from 'react-icons/md';
import { motion } from 'framer-motion';

// --- Shared Components ---

const BookingStatusBadge = ({ status }) => {
  const styles = {
    'Ongoing': 'bg-blue-50 text-blue-700 border-blue-200',
    'Starting': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Completed': 'bg-green-50 text-green-700 border-green-200',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    'Pending': 'bg-orange-50 text-orange-700 border-orange-200',
    'Confirmed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
    const styles = {
        'Paid': 'bg-green-50 text-green-700 border-green-200',
        'Partial': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'Due': 'bg-red-50 text-red-700 border-red-200',
        'Refunded': 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600'}`}>
          {status}
        </span>
    );
};

const BookingCard = ({ booking, type, actions }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
         <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden">
            <img src={booking.vehicleImage} alt={booking.vehicle} className="w-full h-full object-cover" />
         </div>
         <div>
            <h3 className="font-bold text-gray-800 text-sm">{booking.vehicle}</h3>
            <p className="text-xs text-gray-500 font-medium">{booking.regNumber}</p>
         </div>
      </div>
      <BookingStatusBadge status={booking.status} />
    </div>

    <div className="space-y-3 mb-4">
       <div className="flex items-center gap-2 text-sm text-gray-600">
           <MdPerson className="text-gray-400" />
           <span className="font-medium text-gray-900">{booking.customer}</span>
           <span className="text-xs text-gray-400">({booking.phone})</span>
       </div>
       <div className="flex items-center gap-2 text-sm text-gray-600">
           <MdCalendarToday className="text-gray-400" />
           <span>{booking.dateRange}</span>
       </div>
       {type === 'active' && (
           <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-lg">
               <MdAccessTime />
               <span>{booking.timeLeft}</span>
           </div>
       )}
       {type === 'upcoming' && (
           <div className="flex items-center gap-2 text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg">
               <MdAccessTime />
               <span>Starts in {booking.startsIn}</span>
           </div>
       )}
    </div>

    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
       <div>
           <p className="text-xs text-gray-400 font-bold uppercase">Amount</p>
           <p className="font-bold text-gray-900">₹ {booking.amount}</p>
       </div>
       <div className="flex gap-2">
           {actions}
       </div>
    </div>
  </motion.div>
);


// --- Mock Data ---

const MOCK_ACTIVE = [
    { id: 1, vehicle: "Toyota Innova Crysta", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/115025/innova-crysta-exterior-right-front-three-quarter-3.jpeg?isig=0&q=80", regNumber: "PB 01 1234", customer: "Rahul Sharma", phone: "+91 98765...", dateRange: "27 Dec - 30 Dec", status: "Ongoing", timeLeft: "3 Days Left", amount: "15,000" },
    { id: 2, vehicle: "Mahindra Thar", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=80", regNumber: "PB 65 9876", customer: "Amit Verma", phone: "+91 99887...", dateRange: "26 Dec - 29 Dec", status: "Ongoing", timeLeft: "2 Days Left", amount: "18,500" },
];

const MOCK_UPCOMING = [
    { id: 3, vehicle: "Maruti Swift Dzire", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/45691/dzire-exterior-right-front-three-quarter-3.jpeg?q=80", regNumber: "PB 10 5678", customer: "Sneha Gupta", phone: "+91 88776...", dateRange: "28 Dec - 31 Dec", status: "Confirmed", startsIn: "2 Hours", amount: "8,000" },
    { id: 4, vehicle: "Hyundai Creta", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80", regNumber: "HR 26 1122", customer: "Vikram Singh", phone: "+91 77665...", dateRange: "30 Dec - 02 Jan", status: "Confirmed", startsIn: "2 Days", amount: "12,000" },
];

const MOCK_COMPLETED = [
    { id: 5, vehicle: "Toyota Fortuner", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/44777/fortuner-exterior-right-front-three-quarter-19.jpeg?q=80", regNumber: "PB 11 2233", customer: "Arjun Rampal", phone: "+91 99988...", dateRange: "20 Dec - 25 Dec", status: "Completed", amount: "45,000" },
    { id: 6, vehicle: "Honda City", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/134287/city-exterior-right-front-three-quarter-77.jpeg?isig=0&q=80", regNumber: "CH 01 4455", customer: "Priya Mehta", phone: "+91 88877...", dateRange: "22 Dec - 24 Dec", status: "Completed", amount: "10,000" },
];

const MOCK_CANCELLED = [
    { id: 7, vehicle: "Kia Seltos", vehicleImage: "https://imgd.aeplcdn.com/370x208/n/cw/ec/174323/seltos-exterior-right-front-three-quarter.jpeg?isig=0&q=80", regNumber: "PB 65 3322", customer: "Rajeev Kumar", phone: "+91 77766...", dateRange: "24 Dec - 26 Dec", status: "Cancelled", reason: "Customer Request", amount: "0" },
];

const MOCK_PAYMENTS = [
    { id: 101, bookingId: "BK-2025-001", customer: "Rahul Sharma", amount: 15000, paid: 5000, pending: 10000, status: "Partial", method: "UPI" },
    { id: 102, bookingId: "BK-2025-003", customer: "Sneha Gupta", amount: 8000, paid: 8000, pending: 0, status: "Paid", method: "Cash" },
    { id: 103, bookingId: "BK-2025-004", customer: "Vikram Singh", amount: 12000, paid: 0, pending: 12000, status: "Due", method: "N/A" },
];

const MOCK_PROFIT = [
    { id: 201, vehicle: "Toyota Innova Crysta", revenue: 45000, fuel: 8000, maintenance: 2000, driver: 5000, profit: 30000, margin: 66 },
    { id: 202, vehicle: "Mahindra Thar", revenue: 38000, fuel: 12000, maintenance: 3000, driver: 0, profit: 23000, margin: 60 },
    { id: 203, vehicle: "Maruti Swift", revenue: 20000, fuel: 5000, maintenance: 1000, driver: 0, profit: 14000, margin: 70 },
];

// --- Pages ---

export const ActiveBookingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
         <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>Home</span> <span>/</span> <span>Bookings</span> <span>/</span> <span className="text-gray-800 font-medium">Active</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Active Bookings</h1>
            <p className="text-gray-500 text-sm">Monitor live trips and ongoing rentals.</p>
         </div>
         <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 font-medium text-gray-700 flex items-center gap-2">
                 <MdFilterList /> Filter
             </button>
             <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 font-bold">
                 + Create Booking
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ACTIVE.map(item => (
              <BookingCard 
                 key={item.id} 
                 booking={item} 
                 type="active"
                 actions={
                    <>
                       <button className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">Track GPS</button>
                       <button className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Extend</button>
                    </>
                 } 
               />
          ))}
      </div>
    </div>
  );
};

export const UpcomingBookingsPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
           <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Home</span> <span>/</span> <span>Bookings</span> <span>/</span> <span className="text-gray-800 font-medium">Upcoming</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Upcoming Trips</h1>
              <p className="text-gray-500 text-sm">Scheduled bookings ready for dispatch.</p>
           </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_UPCOMING.map(item => (
                <BookingCard 
                   key={item.id} 
                   booking={item} 
                   type="upcoming"
                   actions={
                      <>
                         <button className="px-3 py-1.5 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg">Dispatch</button>
                         <button className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg">Cancel</button>
                      </>
                   } 
                 />
            ))}
        </div>
      </div>
    );
};

export const CompletedBookingsPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
           <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Home</span> <span>/</span> <span>Bookings</span> <span>/</span> <span className="text-gray-800 font-medium">Completed</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
              <p className="text-gray-500 text-sm">Archive of all completed trips.</p>
           </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COMPLETED.map(item => (
                <BookingCard 
                   key={item.id} 
                   booking={item} 
                   type="completed"
                   actions={
                      <>
                         <button className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"><MdReceipt /> Invoice</button>
                      </>
                   } 
                 />
            ))}
        </div>
      </div>
    );
};

export const CancelledBookingsPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
           <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Home</span> <span>/</span> <span>Bookings</span> <span>/</span> <span className="text-gray-800 font-medium">Cancelled</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Cancelled Bookings</h1>
              <p className="text-gray-500 text-sm">Trips cancelled by customers or admin.</p>
           </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CANCELLED.map(item => (
                <BookingCard 
                   key={item.id} 
                   booking={item} 
                   type="cancelled"
                   actions={
                      <>
                         <span className="text-xs font-bold text-red-500">Refund Processed</span>
                      </>
                   } 
                 />
            ))}
        </div>
      </div>
    );
};

export const BookingPaymentStatusPage = () => {
    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
                    <p className="text-gray-500 text-sm">Track payments collection.</p>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                     <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                         <tr>
                             <th className="px-6 py-4">Booking ID</th>
                             <th className="px-6 py-4">Customer</th>
                             <th className="px-6 py-4">Total Amount</th>
                             <th className="px-6 py-4">Received</th>
                             <th className="px-6 py-4">Pending</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4 text-right">Action</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-sm">
                         {MOCK_PAYMENTS.map((payment) => (
                             <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-indigo-600">{payment.bookingId}</td>
                                 <td className="px-6 py-4 font-medium text-gray-900">{payment.customer}</td>
                                 <td className="px-6 py-4 text-gray-600">₹ {payment.amount.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-green-600 font-medium">₹ {payment.paid.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-red-500 font-medium">₹ {payment.pending.toLocaleString()}</td>
                                 <td className="px-6 py-4">
                                     <PaymentStatusBadge status={payment.status} />
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <button className="text-gray-400 hover:text-gray-600"><MdMoreVert size={20} /></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    );
};

export const BookingProfitViewPage = () => {
    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profitability Analysis</h1>
                    <p className="text-gray-500 text-sm">Net profit margins per vehicle booking.</p>
                </div>
             </div>
             
             {/* Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center justify-between">
                     <div>
                         <p className="text-green-800 text-xs font-bold uppercase">Total Revenue</p>
                         <h3 className="text-2xl font-bold text-green-700 mt-1">₹ 8.5L</h3>
                     </div>
                     <MdAttachMoney size={40} className="text-green-300" />
                 </div>
                 <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between">
                     <div>
                         <p className="text-red-800 text-xs font-bold uppercase">Total Costs</p>
                         <h3 className="text-2xl font-bold text-red-700 mt-1">₹ 2.1L</h3>
                     </div>
                     <MdLocalGasStation size={40} className="text-red-300" />
                 </div>
                 <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center justify-between">
                     <div>
                         <p className="text-indigo-800 text-xs font-bold uppercase">Net Profit</p>
                         <h3 className="text-2xl font-bold text-indigo-700 mt-1">₹ 6.4L</h3>
                     </div>
                     <MdTrendingUp size={40} className="text-indigo-300" />
                 </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                     <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                         <tr>
                             <th className="px-6 py-4">Vehicle</th>
                             <th className="px-6 py-4">Total Revenue</th>
                             <th className="px-6 py-4 text-red-500">Fuel Costs</th>
                             <th className="px-6 py-4 text-red-500">Maintenance</th>
                             <th className="px-6 py-4 text-green-600">Net Profit</th>
                             <th className="px-6 py-4">Margin</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 text-sm">
                         {MOCK_PROFIT.map((row) => (
                             <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-gray-800">{row.vehicle}</td>
                                 <td className="px-6 py-4 text-gray-600">₹ {row.revenue.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-red-400">- ₹ {row.fuel.toLocaleString()}</td>
                                 <td className="px-6 py-4 text-red-400">- ₹ {row.maintenance.toLocaleString()}</td>
                                 <td className="px-6 py-4 font-bold text-green-600">₹ {row.profit.toLocaleString()}</td>
                                 <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-md text-xs font-bold ${row.margin > 50 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                         {row.margin}%
                                     </span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
    );
};
