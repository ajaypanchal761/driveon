import React from 'react';

const CrmPlaceholderPage = ({ title }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-blue-50 p-6">
        <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">{title || 'Under Construction'}</h2>
      <p className="text-gray-500">This module is currently being built. Check back soon!</p>
    </div>
  );
};

export default CrmPlaceholderPage;
