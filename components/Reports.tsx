import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800">Reports</h2>
      <p className="mt-4 text-gray-600">
        This section will contain detailed reports of test runs, including pass/fail trends, performance metrics, and historical data.
      </p>
      <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
        <p className="text-gray-400">Content coming soon...</p>
      </div>
    </div>
  );
};

export default Reports;