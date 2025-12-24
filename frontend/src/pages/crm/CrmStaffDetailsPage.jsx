import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const mockStaffDetails = {
  id: 1,
  name: 'Raju Singh',
  role: 'Driver',
  phone: '+91 98765 43210',
  joiningDate: '15 Jan 2022',
  salary: '₹18,000',
  status: 'Active',
  city: 'Mumbai',
  carsHandled: 12,
  tripsDone: 145,
};

const mockHistory = [
  { id: 1, date: '21 Dec', type: 'Trip', detail: 'Mumbai to Pune', amount: '₹1200 (Allowance)' },
  { id: 2, date: '20 Dec', type: 'Washing', detail: 'Clean Car Wash', amount: '₹200' },
];

const mockSalary = [
  { id: 1, month: 'Nov 2023', salary: '₹18,000', advance: '₹2,000', paid: '₹16,000', status: 'Paid' },
  { id: 2, month: 'Dec 2023', salary: '₹18,000', advance: '₹5,000', paid: '₹0', status: 'Pending' },
];

const CrmStaffDetailsPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/crm/staff" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </Link>
        <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {mockStaffDetails.name.charAt(0)}
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-800">{mockStaffDetails.name}</h1>
                <p className="text-gray-500 text-sm">{mockStaffDetails.role} • {mockStaffDetails.city}</p>
             </div>
        </div>
        <span className="ml-auto px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            {mockStaffDetails.status}
        </span>
      </div>

       {/* Tabs */}
       <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
            {['Profile', 'Work History', 'Salary'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())} // Note: simplified key handling for 'work history'
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
        {activeTab === 'profile' && (
             <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Personal Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">Full Name</span>
                             <span className="font-medium">{mockStaffDetails.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">Role</span>
                             <span className="font-medium">{mockStaffDetails.role}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">Phone</span>
                             <span className="font-medium">{mockStaffDetails.phone}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                             <span className="text-gray-500">Joining Date</span>
                             <span className="font-medium">{mockStaffDetails.joiningDate}</span>
                        </div>
                         <div className="flex justify-between pb-2">
                             <span className="text-gray-500">Current Salary</span>
                             <span className="font-medium">{mockStaffDetails.salary}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Performance</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-blue-600">{mockStaffDetails.tripsDone}</p>
                            <p className="text-xs text-blue-600 mt-1">Trips Completed</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-600">{mockStaffDetails.carsHandled}</p>
                            <p className="text-xs text-green-600 mt-1">Cars Handled</p>
                        </div>
                     </div>
                </div>
             </div>
        )}

        {/* Note: In real app use correct tab key matching */}
        {(activeTab === 'work history' || activeTab === 'work%20history') && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                             <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Detail</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockHistory.map((h) => (
                                <tr key={h.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">{h.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{h.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{h.detail}</td>
                                    <td className="px-6 py-4 text-gray-600">{h.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'salary' && (
             <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-orange-50 p-4 border-l-4 border-orange-500 mb-4 m-4 rounded-r">
                    <div className="flex justify-between items-center">
                        <div>
                             <p className="font-bold text-orange-800">Pending Salary</p>
                             <p className="text-sm text-orange-700">Total payable for Dec 2023</p>
                        </div>
                         <button className="px-4 py-2 bg-orange-600 text-white rounded text-sm font-bold shadow hover:bg-orange-700">
                            Mark Paid
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                             <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Month</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Base Salary</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Advance</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Paid Amount</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockSalary.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-medium">{s.month}</td>
                                    <td className="px-6 py-4 text-gray-600">{s.salary}</td>
                                    <td className="px-6 py-4 text-red-600">-{s.advance}</td>
                                    <td className="px-6 py-4 text-green-600 font-medium">{s.paid}</td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            s.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>{s.status}</span>
                                    </td>
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

export default CrmStaffDetailsPage;
