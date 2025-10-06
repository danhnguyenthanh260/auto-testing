
import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change, isNegative = false }) => {
  const changeColor = isNegative ? 'text-red-500' : 'text-green-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>
    </div>
  );
};

export default AnalyticsCard;
