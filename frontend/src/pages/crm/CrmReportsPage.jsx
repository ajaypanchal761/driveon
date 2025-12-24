import React, { useState } from 'react';

const CrmReportsPage = () => {
    const [reportType, setReportType] = useState('daily');
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = (e) => {
        e.preventDefault();
        setIsGenerated(true);
    }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Business Reports</h1>

      {/* Report Configuration */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <form onSubmit={handleGenerate} className="grid md:grid-cols-4 gap-4 items-end">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option value="daily">Daily Report</option>
                    <option value="monthly">Monthly Report</option>
                    <option value="yearly">Yearly Report</option>
                    <option value="car_wise">Car Wise Performance</option>
                    <option value="staff_wise">Staff Performance</option>
                    <option value="profit_loss">Profit / Loss Statement</option>
                </select>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                 <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                 <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm outline-none" />
            </div>

            <button type="submit" className="bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition">
                Generate Report
            </button>
        </form>
      </div>

      {/* Report Results Placeholder */}
      {isGenerated && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-800 capitalize">{reportType.replace('_', ' ')} Report Results</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export to Excel
                </button>
             </div>
             
             <div className="p-8 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p>Report generated successfully.</p>
                <p className="text-sm">Click "Export to Excel" to download detailed data.</p>
             </div>
          </div>
      )}
    </div>
  );
};

export default CrmReportsPage;
