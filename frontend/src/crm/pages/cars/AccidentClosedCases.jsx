import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MdSearch, 
  MdDownload, 
  MdCheckCircle,
  MdAttachMoney
} from 'react-icons/md';
import ThemedDropdown from '../../../components/common/ThemedDropdown';
import { premiumColors } from '../../../theme/colors';
import { rgba } from 'polished';

// Mock Data for Closed Cases
const MOCK_CLOSED_CASES = [
  { 
      id: 1, 
      car: "Maruti Swift Dzire", 
      reg: "PB 10 5678", 
      date: "10 Aug 2025", 
      insurer: "ICICI Lombard",
      finalCost: "₹ 40,000", 
      recovered: "₹ 35,000", 
      netLoss: "₹ 5,000",
      status: "Settled"
  },
  { 
      id: 2, 
      car: "Toyota Innova Crysta", 
      reg: "PB 01 1234", 
      date: "12 Feb 2025", 
      insurer: "Tata AIG",
      finalCost: "₹ 1,20,000", 
      recovered: "₹ 1,00,000", 
      netLoss: "₹ 20,000",
      status: "Settled"
  },
  { 
      id: 3, 
      car: "Mahindra Thar", 
      reg: "PB 65 9876", 
      date: "05 Jan 2025", 
      insurer: "HDFC Ergo",
      finalCost: "₹ 15,000", 
      recovered: "₹ 15,000", 
      netLoss: "₹ 0",
      status: "Full Recovery"
  },
];

const AccidentClosedCases = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('All');
    const [insurerFilter, setInsurerFilter] = useState('All');
    
    const [cases, setCases] = useState(MOCK_CLOSED_CASES);

    useEffect(() => {
        if (location.state?.newClosedCase) {
             const newCase = location.state.newClosedCase;
             setCases(prev => {
                 // Prevent duplicate additions in case of multiple re-renders
                 if (prev.some(c => c.originalId === newCase.originalId)) {
                     return prev;
                 }
                 return [newCase, ...prev];
             });
             
             // Clear state so refresh doesn't re-add
             window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filteredCases = cases.filter(item => {
        const matchesSearch = item.car.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.reg.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesYear = yearFilter === 'All' || item.date.includes(yearFilter);
        const matchesInsurer = insurerFilter === 'All' || item.insurer === insurerFilter;

        return matchesSearch && matchesYear && matchesInsurer;
    });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/dashboard')}>Home</span> 
              <span>/</span> 
              <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/cars/all')}>Cars</span> 
              <span>/</span> 
              <span className="cursor-pointer transition-colors hover:opacity-80" style={{ color: premiumColors.primary.DEFAULT }} onClick={() => navigate('/crm/cars/accidents/active')}>Accidents</span> 
              <span>/</span> 
              <span className="text-gray-800 font-medium">Closed Cases</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Closed & Settled Cases</h1>
            <p className="text-gray-500 text-sm">History of resolved accidents and financial settlements.</p>
          </div>

        </div>
  
        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search Vehicle or Reg No..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': rgba(premiumColors.primary.DEFAULT, 0.2) }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <div className="w-full md:w-40">
                   <ThemedDropdown 
                        options={[
                            { value: 'All', label: 'Year: All' },
                            { value: '2025', label: 'Year: 2025' },
                            { value: '2024', label: 'Year: 2024' }
                        ]}
                        value={yearFilter}
                        onChange={setYearFilter}
                   />
               </div>
               <div className="w-full md:w-48">
                   <ThemedDropdown 
                        options={[
                            { value: 'All', label: 'Insurer: All' },
                            { value: 'Tata AIG', label: 'Tata AIG' },
                            { value: 'HDFC Ergo', label: 'HDFC Ergo' },
                            { value: 'ICICI Lombard', label: 'ICICI Lombard' }
                        ]}
                        value={insurerFilter}
                        onChange={setInsurerFilter}
                   />
               </div>
            </div>
        </div>
  
        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Incident Date</th>
                <th className="p-4">Final Cost</th>
                <th className="p-4">Recovered</th>
                <th className="p-4">Net Loss</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCases.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.car}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.reg}</div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                     {item.date}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                     {item.finalCost}
                  </td>
                  <td className="p-4 font-bold text-green-600">
                     {item.recovered}
                  </td>
                  <td className="p-4">
                     <span className={`font-bold ${item.netLoss === '₹ 0' ? 'text-gray-400' : 'text-red-600'}`}>
                         {item.netLoss}
                     </span>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-1.5">
                         <MdCheckCircle className="text-green-500" />
                         <span className="font-medium text-gray-700">{item.status}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <div className="p-10 text-center text-gray-500">
                No closed cases found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    );
};

export default AccidentClosedCases;
