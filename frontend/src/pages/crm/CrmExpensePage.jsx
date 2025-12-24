import React from 'react';

const mockExpenses = [
  { id: 1, date: '22 Dec', type: 'Fuel', car: 'MH 02 AB 1234', amount: '₹2,500', staff: 'Raju', note: 'Full tank' },
  { id: 2, date: '21 Dec', type: 'Repair', car: 'DL 3C AB 5678', amount: '₹1,500', staff: 'Amit', note: 'Oil Change' },
  { id: 3, date: '20 Dec', type: 'Toll', car: 'KA 01 XY 9876', amount: '₹400', staff: 'Suresh', note: 'Pune Trip' },
];

const CrmExpensePage = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column: Add Expense Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Add Expense</h2>
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option>Select Type</option>
                    <option>Fuel</option>
                    <option>Repair</option>
                    <option>Toll</option>
                    <option>Maintenance</option>
                    <option>Other</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Car</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option>Select Car</option>
                    <option>MH 02 AB 1234</option>
                    <option>DL 3C AB 5678</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" placeholder="0.00" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
                <input type="text" placeholder="Staff Name / Owner" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea rows="3" placeholder="Description..." className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <button className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 transition">
                Add Expense
            </button>
        </form>
      </div>

      {/* Right Column: Expense List */}
      <div className="lg:col-span-2 space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Expense History</h2>
            <div className="text-sm font-medium text-gray-500">
                Total (Dec): <span className="text-red-600 font-bold ml-1">₹4,400</span>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Car</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Paid By</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockExpenses.map((ex) => (
                            <tr key={ex.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-900 font-medium">{ex.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        ex.type === 'Fuel' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                                    }`}>{ex.type}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-mono">{ex.car}</td>
                                <td className="px-6 py-4 text-red-600 font-bold">{ex.amount}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {ex.staff}
                                    <div className="text-xs text-gray-400">{ex.note}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CrmExpensePage;
