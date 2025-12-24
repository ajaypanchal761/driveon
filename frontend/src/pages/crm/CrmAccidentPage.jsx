import React from 'react';

const mockAccidents = [
  { id: 1, car: 'MH 12 CD 2468', date: '20 Dec', loc: 'Pune Highway', driver: 'Vikas', status: 'Insurance Claim', step: 3 },
];

const RecoverySteps = ({ currentStep }) => {
    const steps = ['Accident Reported', 'Police Case', 'Insurance Claim', 'Repair', 'Recovered'];
    return (
        <div className="flex items-center justify-between w-full text-xs md:text-sm mt-4 relative">
             <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
            {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center bg-white px-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        index + 1 <= currentStep ? 'bg-red-600 text-white border-red-600' : 'bg-gray-100 text-gray-400 border-gray-300'
                    }`}>
                        {index + 1}
                    </div>
                    <span className={`mt-1 ${index + 1 <= currentStep ? 'text-red-700 font-medium' : 'text-gray-400'}`}>{step}</span>
                </div>
            ))}
        </div>
    )
}

const CrmAccidentPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Accident & Recovery</h1>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
            Report Accident
        </button>
      </div>

      <div className="grid gap-6">
        {mockAccidents.map((acc) => (
            <div key={acc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{acc.car}</h3>
                        <p className="text-sm text-gray-500">Driver: {acc.driver} • {acc.date} • {acc.loc}</p>
                    </div>
                    <div className="text-right">
                         <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium border border-red-200">
                            {acc.status}
                         </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 mb-4">
                    Car skidded on highway. Front bumper and left door damaged. Police FIR lodged (FIR-1122).
                </div>
                
                <RecoverySteps currentStep={acc.step} />
            </div>
        ))}

        {mockAccidents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
                No active accident cases. Safe driving!
            </div>
        )}
      </div>
    </div>
  );
};

export default CrmAccidentPage;
