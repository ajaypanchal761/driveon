import React, { useState } from 'react';

const CrmSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="grid md:grid-cols-4 gap-6">
         {/* Sidebar Navigation */}
         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-fit">
            <nav className="flex flex-col">
                {['General', 'Cities', 'Staff Roles', 'Expense Categories', 'Salary Rules'].map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item.toLowerCase())}
                        className={`text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${
                            activeTab === item.toLowerCase() 
                                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                : 'border-transparent text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </nav>
         </div>

         {/* Settings Content */}
         <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
            {activeTab === 'general' && (
                <div>
                     <h2 className="text-lg font-bold text-gray-800 mb-4">General Settings</h2>
                     <p className="text-gray-500 text-sm">Configure basic application settings here.</p>
                </div>
            )}
             {activeTab === 'cities' && (
                <div>
                     <h2 className="text-lg font-bold text-gray-800 mb-4">Manage Cities</h2>
                     <div className="flex gap-2 mb-4">
                         <input type="text" placeholder="Add new city" className="border rounded px-3 py-2 text-sm outline-none" />
                         <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">Add</button>
                     </div>
                     <div className="space-y-2">
                        {['Mumbai', 'Pune', 'Delhi', 'Bangalore'].map(city => (
                            <div key={city} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                <span className="text-gray-700">{city}</span>
                                <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                            </div>
                        ))}
                     </div>
                </div>
            )}
             {activeTab === 'staff roles' && (
                 <div>
                     <h2 className="text-lg font-bold text-gray-800 mb-4">Staff Roles</h2>
                     <p className="text-gray-500 mb-4">Define roles and permissions.</p>
                      <div className="space-y-2">
                        {['Driver', 'Manager', 'Accountant', 'Mechanic'].map(role => (
                            <div key={role} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                <span className="text-gray-700">{role}</span>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit Permissions</button>
                            </div>
                        ))}
                     </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default CrmSettingsPage;
