import React, { useState } from 'react';

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num) => {
    setDisplay(display === '0' ? num.toString() : display + num);
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(equation + display);
      setDisplay(result.toString());
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-50"
        title="Open Calculator"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-72 bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-3 bg-gray-900 border-b border-gray-700">
        <span className="text-white font-medium text-sm">Calculator</span>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      {/* Basic Display */}
      <div className="p-4 bg-gray-900 text-right">
        <div className="text-gray-400 text-xs h-4">{equation}</div>
        <div className="text-white text-3xl font-light truncate">{display}</div>
      </div>

      {/* Keys */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-gray-800">
        <button onClick={handleClear} className="col-span-3 bg-gray-700 text-white p-3 rounded hover:bg-gray-600 text-sm">AC</button>
        <button onClick={() => handleOperator('/')} className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">÷</button>
        
        {[7, 8, 9].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className="bg-gray-700 text-white p-3 rounded hover:bg-gray-600">{n}</button>
        ))}
        <button onClick={() => handleOperator('*')} className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">×</button>

         {[4, 5, 6].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className="bg-gray-700 text-white p-3 rounded hover:bg-gray-600">{n}</button>
        ))}
        <button onClick={() => handleOperator('-')} className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">-</button>

         {[1, 2, 3].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className="bg-gray-700 text-white p-3 rounded hover:bg-gray-600">{n}</button>
        ))}
        <button onClick={() => handleOperator('+')} className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">+</button>

        <button onClick={() => handleNumber(0)} className="col-span-2 bg-gray-700 text-white p-3 rounded hover:bg-gray-600">0</button>
        <button onClick={() => handleNumber('.')} className="bg-gray-700 text-white p-3 rounded hover:bg-gray-600">.</button>
        <button onClick={handleEqual} className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">=</button>
      </div>
    </div>
  );
};

export default Calculator;
