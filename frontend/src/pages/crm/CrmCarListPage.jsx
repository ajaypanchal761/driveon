import React from 'react';
import { Link } from 'react-router-dom';

const mockCars = [
  { id: 1, carNo: 'MH 02 AB 1234', model: 'Toyota Innova Crysta', status: 'Available', location: 'Mumbai HQ', driver: 'Raju Singh', expense: '₹12,000' },
  { id: 2, carNo: 'DL 3C AB 5678', model: 'Maruti Swift Dzire', status: 'On Trip', location: 'Gurgaon', driver: 'Amit Kumar', expense: '₹5,000' },
  { id: 3, carNo: 'KA 01 XY 9876', model: 'Hyundai Creta', status: 'Idle', location: 'Bangalore Depot', driver: 'Not Assigned', expense: '₹2,000' },
  { id: 4, carNo: 'MH 04 XY 4321', model: 'Honda City', status: 'Washing', location: 'Worli Service Center', driver: 'Suresh Patil', expense: '₹1,500' },
  { id: 5, carNo: 'MH 12 CD 2468', model: 'Tata Nexon', status: 'Accident', location: 'Pune Garage', driver: 'Vikas Dubey', expense: '₹25,000' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Available': return 'bg-green-100 text-green-700';
    case 'On Trip': return 'bg-blue-100 text-blue-700';
    case 'Washing': return 'bg-yellow-100 text-yellow-700';
    case 'Accident': return 'bg-red-100 text-red-700';
    case 'Idle': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const CrmCarListPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">My Cars</h1>
           <p className="text-gray-500 text-sm">Manage your fleet and track status.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Car
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Car No</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Model</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Current Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Driver</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Total Expense</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockCars.map((car) => (
                        <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{car.carNo}</td>
                            <td className="px-6 py-4 text-gray-600">{car.model}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                                    {car.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {car.location}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{car.driver}</td>
                            <td className="px-6 py-4 text-gray-600">{car.expense}</td>
                            <td className="px-6 py-4 text-right">
                                <Link 
                                    to={`/crm/car-details/${car.id}`} 
                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-300 bg-blue-50 px-3 py-1.5 rounded transition-all"
                                >
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing 1 to 5 of 12 Entries</span>
            <div className="flex gap-1">
                <button className="px-2 py-1 border rounded text-xs text-gray-500 disabled:opacity-50" disabled>Prev</button>
                <button className="px-2 py-1 border rounded text-xs bg-blue-600 text-white">1</button>
                <button className="px-2 py-1 border rounded text-xs text-gray-500 hover:bg-gray-50">2</button>
                <button className="px-2 py-1 border rounded text-xs text-gray-500 hover:bg-gray-50">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CrmCarListPage;
