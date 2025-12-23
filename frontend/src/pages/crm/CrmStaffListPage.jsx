import React from 'react';
import { Link } from 'react-router-dom';

const mockStaff = [
  { id: 1, name: 'Raju Singh', role: 'Driver', city: 'Mumbai', salary: '₹18,000', status: 'Active' },
  { id: 2, name: 'Suresh Patil', role: 'Service Advisor', city: 'Mumbai', salary: '₹22,000', status: 'Active' },
  { id: 3, name: 'Amit Kumar', role: 'Driver', city: 'Delhi', salary: '₹18,000', status: 'On Leave' },
  { id: 4, name: 'Vikas Dubey', role: 'Mechanic', city: 'Pune', salary: '₹20,000', status: 'Active' },
  { id: 5, name: 'John Doe', role: 'Accountant', city: 'Bangalore', salary: '₹35,000', status: 'Active' },
];

const getRoleBadge = (role) => {
    switch(role) {
        case 'Driver': return 'bg-blue-100 text-blue-700';
        case 'Accountant': return 'bg-purple-100 text-purple-700';
        case 'Mechanic': return 'bg-orange-100 text-orange-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

const CrmStaffListPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
           <p className="text-gray-500 text-sm">Manage drivers, mechanics, and office staff.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Staff
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Role</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">City</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Salary</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {staff.name.charAt(0)}
                                    </div>
                                    {staff.name}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(staff.role)}`}>
                                    {staff.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{staff.city}</td>
                            <td className="px-6 py-4 text-gray-600">{staff.salary}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                    {staff.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link 
                                    to={`/crm/staff-details/${staff.id}`} 
                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-300 bg-blue-50 px-3 py-1.5 rounded transition-all"
                                >
                                    Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CrmStaffListPage;
