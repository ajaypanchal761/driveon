import React from 'react';

const StatCard = ({ title, value, subtext, color, icon }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`rounded-full p-3 bg-gray-50 ${color.replace('text-', 'bg-').replace('600', '100')}`}>
        {icon}
      </div>
    </div>
    {subtext && <p className="mt-2 text-xs text-gray-400">{subtext}</p>}
  </div>
);

const ChartPlaceholder = ({ title, children }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 h-80 flex flex-col">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    <div className="flex-1 w-full flex items-end justify-center gap-4 bg-gray-50 rounded-lg p-4 relative overflow-hidden">
       {children}
    </div>
  </div>
);

const CrmDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
           <p className="text-gray-500 text-sm">Welcome back, Owner!</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Download Report
        </button>
      </div>
      
      {/* Fleet Status */}
      <h2 className="text-lg font-semibold text-gray-700">Fleet Status</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard 
            title="Total Cars" 
            value="12" 
            color="text-gray-900" 
            icon={<svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19H5V5h14v14z" /></svg>}
        />
        <StatCard 
            title="Running" 
            value="8" 
            color="text-green-600" 
            icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <StatCard 
            title="Idle" 
            value="2" 
            color="text-yellow-600"
            subtext="2 days inactive"
            icon={<svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Washing" 
            value="1" 
            color="text-blue-600" 
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Accident" 
            value="1" 
            color="text-red-600" 
            icon={<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        />
      </div>

      {/* Financial Overview */}
      <h2 className="text-lg font-semibold text-gray-700">Financial Overview</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Today Income" 
            value="₹12,450" 
            color="text-green-600" 
            subtext="+15% from yesterday"
            icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Today Expense" 
            value="₹2,100" 
            color="text-red-600" 
            subtext="Fuel & Washing"
            icon={<svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard 
            title="Monthly Profit" 
            value="₹1.4L" 
            color="text-blue-600" 
            subtext="Target: ₹2L"
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <StatCard 
            title="Pending Salaries" 
            value="₹45,000" 
            color="text-orange-600" 
            subtext="Due in 5 days"
            icon={<svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Monthly Income vs Expense">
            {/* Simple CSS Bar Chart Mocks */}
            <div className="w-8 bg-green-200 h-[60%] rounded-t relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">60k</div></div>
            <div className="w-8 bg-red-200 h-[30%] rounded-t mr-4 relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">30k</div></div>
            
            <div className="w-8 bg-green-200 h-[80%] rounded-t relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">80k</div></div>
            <div className="w-8 bg-red-200 h-[40%] rounded-t mr-4 relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">40k</div></div>
            
            <div className="w-8 bg-green-200 h-[50%] rounded-t relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">50k</div></div>
            <div className="w-8 bg-red-200 h-[20%] rounded-t mr-4 relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">20k</div></div>
            
            <div className="w-8 bg-green-200 h-[90%] rounded-t relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">90k</div></div>
            <div className="w-8 bg-red-200 h-[35%] rounded-t mr-4 relative group"><div className="absolute -top-6 left-0 text-xs font-bold opacity-0 group-hover:opacity-100">35k</div></div>
        </ChartPlaceholder>

        <ChartPlaceholder title="Car Utilization">
             <div className="flex gap-2 items-end w-full justify-around">
                <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 h-24 rounded-t relative"></div>
                    <span className="text-xs text-gray-500 mt-2">Innova</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 h-32 rounded-t relative"></div>
                    <span className="text-xs text-gray-500 mt-2">Swift</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 h-16 rounded-t relative"></div>
                    <span className="text-xs text-gray-500 mt-2">Creta</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 h-28 rounded-t relative"></div>
                    <span className="text-xs text-gray-500 mt-2">Honda</span>
                </div>
             </div>
        </ChartPlaceholder>
      </div>

       <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Profit per Car</h3>
           <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                   <thead className="border-b bg-gray-50 text-gray-500">
                       <tr>
                           <th className="px-4 py-3">Car Model</th>
                           <th className="px-4 py-3">Reg No</th>
                           <th className="px-4 py-3">Income</th>
                           <th className="px-4 py-3">Expense</th>
                           <th className="px-4 py-3">Profit</th>
                           <th className="px-4 py-3">Status</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                       <tr className="hover:bg-gray-50">
                           <td className="px-4 py-3 font-medium">Toyota Innova Crysta</td>
                           <td className="px-4 py-3 text-gray-500">MH 02 AB 1234</td>
                           <td className="px-4 py-3 text-green-600">₹45,000</td>
                           <td className="px-4 py-3 text-red-600">₹12,000</td>
                           <td className="px-4 py-3 font-bold text-blue-600">₹33,000</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Active</span></td>
                       </tr>
                       <tr className="hover:bg-gray-50">
                           <td className="px-4 py-3 font-medium">Maruti Swift</td>
                           <td className="px-4 py-3 text-gray-500">DL 3C AB 5678</td>
                           <td className="px-4 py-3 text-green-600">₹28,000</td>
                           <td className="px-4 py-3 text-red-600">₹5,000</td>
                           <td className="px-4 py-3 font-bold text-blue-600">₹23,000</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">On Trip</span></td>
                       </tr>
                       <tr className="hover:bg-gray-50">
                           <td className="px-4 py-3 font-medium">Hyundai Creta</td>
                           <td className="px-4 py-3 text-gray-500">KA 01 XY 9876</td>
                           <td className="px-4 py-3 text-green-600">₹32,000</td>
                           <td className="px-4 py-3 text-red-600">₹8,000</td>
                           <td className="px-4 py-3 font-bold text-blue-600">₹24,000</td>
                           <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">Idle</span></td>
                       </tr>
                   </tbody>
               </table>
           </div>
       </div>

    </div>
  );
};

export default CrmDashboardPage;
