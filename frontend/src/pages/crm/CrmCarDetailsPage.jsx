import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const mockCarDetails = {
  id: 1,
  carNo: 'MH 02 AB 1234',
  model: 'Toyota Innova Crysta',
  purchaseDate: '12 Jan 2023',
  totalEarnings: '₹8,45,000',
  totalExpense: '₹2,10,000',
  netProfit: '₹6,35,000',
  currentLocation: 'Mumbai Airport T2',
  lastUpdated: '10 mins ago',
  status: 'Available',
};

const mockMovement = [
  { id: 1, date: '21 Dec', from: 'Andheri', to: 'Airport', purpose: 'Booking', staff: 'Raju', cost: '₹500' },
  { id: 2, date: '20 Dec', from: 'Airport', to: 'Pune', purpose: 'Booking', staff: 'Raju', cost: '₹1200' },
  { id: 3, date: '19 Dec', from: 'Pune', to: 'Workshop', purpose: 'Repair', staff: 'Suresh', cost: '₹5000' },
];

const mockExpenses = [
  { id: 1, date: '21 Dec', type: 'Fuel', amount: '₹3000', paidBy: 'Raju' },
  { id: 2, date: '19 Dec', type: 'Repair', amount: '₹5000', paidBy: 'Owner' },
];

const mockWashing = [
  { id: 1, date: '18 Dec', location: 'Clean Car Wash', takenBy: 'Suresh', cost: '₹400' },
  { id: 2, date: '10 Dec', location: 'In-house', takenBy: 'Raju', cost: '₹0' },
];

const CrmCarDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/crm/cars" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{mockCarDetails.carNo}</h1>
            <p className="text-gray-500 text-sm">{mockCarDetails.model}</p>
        </div>
        <span className="ml-auto px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            {mockCarDetails.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-6 min-w-max">
            {['Overview', 'Movement', 'Expenses', 'Washing'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.toLowerCase()
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Key Stats */}
                <div className="col-span-full grid gap-4 md:grid-cols-3">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{mockCarDetails.totalEarnings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{mockCarDetails.totalExpense}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-sm text-gray-500">Net Profit</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{mockCarDetails.netProfit}</p>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div className="text-gray-500">Purchase Date</div>
                        <div className="font-medium">{mockCarDetails.purchaseDate}</div>
                        
                        <div className="text-gray-500">Validation</div>
                        <div className="font-medium">Valid until Dec 2025</div>

                        <div className="text-gray-500">Insurance</div>
                        <div className="font-medium">HDFC Ergo (Exp: Jan 2024)</div>

                        <div className="text-gray-500">FASTag Balance</div>
                        <div className="font-medium text-orange-600">₹450 (Low)</div>
                    </div>
                </div>

                {/* Location Card */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Live Location</h3>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                        Map Placeholder
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{mockCarDetails.currentLocation}</p>
                            <p className="text-xs text-gray-500">Updated {mockCarDetails.lastUpdated}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'movement' && (
             <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">From</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">To</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Purpose</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Staff</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockMovement.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">{item.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.from}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.to}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            item.purpose === 'Booking' ? 'bg-blue-100 text-blue-700' : 
                                            item.purpose === 'Repair' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                        }`}>{item.purpose}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.staff}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium text-right">{item.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'expenses' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-end">
                    <button className="text-sm text-blue-600 font-medium hover:underline">+ Add Expense</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Paid By</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockExpenses.map((expert) => (
                                <tr key={expert.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">{expert.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{expert.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{expert.paidBy}</td>
                                    <td className="px-6 py-4 text-red-600 font-medium text-right">-{expert.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'washing' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Taken By</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockWashing.map((wash) => (
                                <tr key={wash.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">{wash.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{wash.location}</td>
                                    <td className="px-6 py-4 text-gray-600">{wash.takenBy}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium text-right">{wash.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CrmCarDetailsPage;
