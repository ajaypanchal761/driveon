import React, { useState } from 'react';

const mockWashing = [
  { id: 1, car: 'MH 02 AB 1234', date: '22 Dec', loc: 'Clean Car Wash', staff: 'Raju', amt: '₹400' },
  { id: 2, car: 'DL 3C AB 5678', date: '21 Dec', loc: 'In-house', staff: 'Amit', amt: '₹0' },
];

const mockMaintenance = [
  { id: 1, car: 'KA 01 XY 9876', issue: 'Brake Pad', garage: 'City Honda', cost: '₹2500', status: 'Done' },
];

const CrmWashingPage = () => {
  const [activeTab, setActiveTab] = useState('washing');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Service Logs</h1>
        <div className="flex border rounded-lg overflow-hidden">
             <button 
                onClick={() => setActiveTab('washing')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'washing' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
             >
                Washing Log
             </button>
             <button 
                onClick={() => setActiveTab('maintenance')}
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'maintenance' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
             >
                Maintenance Log
             </button>
        </div>
      </div>

       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        {activeTab === 'washing' ? (
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Car</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Taken By</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Amount</th>
                            </tr>
                        ) : (
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Car</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Issue</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Garage</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Cost</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {activeTab === 'washing' ? (
                            mockWashing.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">{item.date}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono">{item.car}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.loc}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.staff}</td>
                                    <td className="px-6 py-4 font-medium text-right text-gray-900">{item.amt}</td>
                                </tr>
                            ))
                        ) : (
                             mockMaintenance.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900 font-mono">{item.car}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.issue}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.garage}</td>
                                    <td className="px-6 py-4 text-green-600">{item.status}</td>
                                    <td className="px-6 py-4 font-medium text-right text-red-600">{item.cost}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
       </div>
    </div>
  );
};

export default CrmWashingPage;
