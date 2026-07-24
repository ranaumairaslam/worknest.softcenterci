import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", tasks: 22 },
  { month: "Feb", tasks: 34 },
  { month: "Mar", tasks: 41 },
  { month: "Apr", tasks: 38 },
  { month: "May", tasks: 52 },
  { month: "Jun", tasks: 61 },
];

export default function TaskTrendChart() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Task Progress Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="month" stroke="#CBD5E1" />

            <YAxis stroke="#CBD5E1" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#06b6d4"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}