import React from 'react';

const mockSalaries = [
  { id: 1, staff: 'Raju Singh', role: 'Driver', month: 'Dec 2023', salary: '₹18,000', paid: '₹10,000', pending: '₹8,000' },
  { id: 2, staff: 'Suresh Patil', role: 'Advisor', month: 'Dec 2023', salary: '₹22,000', paid: '₹22,000', pending: '₹0' },
  { id: 3, staff: 'Amit Kumar', role: 'Driver', month: 'Dec 2023', salary: '₹18,000', paid: '₹0', pending: '₹18,000' },
];

const CrmSalaryPage = () => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Process Payroll
        </button>
      </div>

       {/* Salary Dashboard Widgets */}
       <div className="grid gap-6 md:grid-cols-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Total Salary (Dec)</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">₹2,45,000</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-2xl font-bold text-green-600 mt-1">₹1,80,000</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">₹65,000</p>
            </div>
       </div>

       {/* Salary Table */}
       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Staff Member</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Month</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Total Salary</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Paid</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Pending</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockSalaries.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{item.staff}</p>
                                <p className="text-xs text-gray-500">{item.role}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{item.month}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{item.salary}</td>
                            <td className="px-6 py-4 text-green-600">{item.paid}</td>
                            <td className="px-6 py-4 text-orange-600">{item.pending}</td>
                            <td className="px-6 py-4 text-right">
                                {item.pending !== '₹0' ? (
                                    <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100">
                                        Pay Now
                                    </button>
                                ) : (
                                    <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">Completed</span>
                                )}
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

export default CrmSalaryPage;
