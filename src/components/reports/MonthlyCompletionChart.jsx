import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", completed: 5 },
  { month: "Feb", completed: 8 },
  { month: "Mar", completed: 6 },
  { month: "Apr", completed: 11 },
  { month: "May", completed: 9 },
  { month: "Jun", completed: 13 },
];

export default function MonthlyCompletionChart() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Monthly Completion
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="month" stroke="#CBD5E1" />

            <YAxis stroke="#CBD5E1" />

            <Tooltip />

            <Bar
              dataKey="completed"
              fill="#06b6d4"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}