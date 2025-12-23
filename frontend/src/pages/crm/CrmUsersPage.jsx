import React from 'react';

const mockUsers = [
  { id: 1, name: 'Rahul Sharma', phone: '9876543210', city: 'Mumbai', code: 'PROMO50', referrer: 'Raju (Driver)' },
  { id: 2, name: 'Priya Verma', phone: '9123456780', city: 'Pune', code: 'NEWUSER', referrer: 'App' },
];

const CrmUsersPage = () => {
  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-800">Users & Referrals</h1>

       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">User Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">City</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Promo Code</th>
                         <th className="px-6 py-4 font-semibold text-gray-700">Referred By</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockUsers.map((user) => (
                         <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                            <td className="px-6 py-4 text-gray-600">{user.city}</td>
                            <td className="px-6 py-4 text-gray-600 font-mono text-xs"><span className="bg-gray-100 px-2 py-1 rounded">{user.code}</span></td>
                             <td className="px-6 py-4 text-blue-600">{user.referrer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CrmUsersPage;
