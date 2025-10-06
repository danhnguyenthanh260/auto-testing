
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: '7 days ago', Passed: 400, Failed: 24 },
  { name: '6 days ago', Passed: 300, Failed: 13 },
  { name: '5 days ago', Passed: 200, Failed: 98 },
  { name: '4 days ago', Passed: 278, Failed: 39 },
  { name: '3 days ago', Passed: 189, Failed: 48 },
  { name: '2 days ago', Passed: 239, Failed: 38 },
  { name: 'Yesterday', Passed: 349, Failed: 43 },
];

const RecentRunsChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255,255, 0.8)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px"}} />
          <Line type="monotone" dataKey="Passed" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Failed" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RecentRunsChart;
