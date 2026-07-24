import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from "recharts";

const data = [
  { team: "Frontend", score: 95 },
  { team: "Backend", score: 88 },
  { team: "QA", score: 84 },
  { team: "UI/UX", score: 91 },
  { team: "DevOps", score: 97 },
];

export default function TeamPerformanceChart() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Team Performance
      </h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis type="number" stroke="#CBD5E1" />

            <YAxis
              type="category"
              dataKey="team"
              stroke="#CBD5E1"
            />

            <Tooltip />

            <Bar
              dataKey="score"
              fill="#22c55e"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}