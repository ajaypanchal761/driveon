import React from 'react';

const mockMovements = [
  { id: 1, date: '22 Dec 2023', car: 'MH 02 AB 1234', from: 'Mumbai HQ', to: 'Airport', purpose: 'Booking', staff: 'Raju Singh', amount: '₹500' },
  { id: 2, date: '21 Dec 2023', car: 'DL 3C AB 5678', from: 'Garage', to: 'Office', purpose: 'Repair', staff: 'Suresh Patil', amount: '₹2000' },
  { id: 3, date: '21 Dec 2023', car: 'KA 01 XY 9876', from: 'Office', to: 'Washing Center', purpose: 'Washing', staff: 'Amit Kumar', amount: '₹300' },
];

const CrmCarMovementPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Car Movement Log</h1>
        
        <div className="flex gap-2">
            <input type="date" className="border rounded-lg px-3 py-2 text-sm bg-white" />
            <select className="border rounded-lg px-3 py-2 text-sm bg-white">
                <option>All Cars</option>
                <option>MH 02 AB 1234</option>
            </select>
             <select className="border rounded-lg px-3 py-2 text-sm bg-white">
                <option>All Purposes</option>
                <option>Booking</option>
                <option>Washing</option>
                <option>Repair</option>
            </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Car</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">From</th>
                         <th className="px-6 py-4 font-semibold text-gray-700">To</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Purpose</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Staff</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {mockMovements.map((move) => (
                        <tr key={move.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900 font-medium">{move.date}</td>
                            <td className="px-6 py-4 text-gray-600 font-mono">{move.car}</td>
                            <td className="px-6 py-4 text-gray-600">{move.from}</td>
                            <td className="px-6 py-4 text-gray-600">{move.to}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    move.purpose === 'Booking' ? 'bg-blue-100 text-blue-700' :
                                    move.purpose === 'Repair' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {move.purpose}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{move.staff}</td>
                            <td className="px-6 py-4 text-gray-900 font-medium text-right">{move.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CrmCarMovementPage;
