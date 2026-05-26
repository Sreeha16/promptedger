'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Annual Spend', Current: 5000, Optimized: 3200 },
];

export default function SavingsChart() {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Financial Impact (Annual)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Current" fill="#ef4444" /> {/* Red bar */}
          <Bar dataKey="Optimized" fill="#22c55e" /> {/* Green bar */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}