
import React from 'react';
import AnalyticsCard from './AnalyticsCard';
import RecentRunsChart from './RecentRunsChart';
import RecentRunsTable from './RecentRunsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard title="Total Projects" value="12" change="+2 this month" />
        <AnalyticsCard title="Total Test Cases" value="842" change="+54 this week" />
        <AnalyticsCard title="Overall Pass Rate" value="92.1%" change="-0.5% vs last week" isNegative={true} />
        <AnalyticsCard title="Avg. Execution Time" value="2m 15s" change="+5s vs yesterday" isNegative={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Test Run Trends (Last 7 Days)</h2>
            <RecentRunsChart />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <RecentRunsTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
