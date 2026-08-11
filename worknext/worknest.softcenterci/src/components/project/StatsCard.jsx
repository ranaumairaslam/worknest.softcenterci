import React from "react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "bg-cyan-500",
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition hover:shadow-lg">
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="text-white" size={28} />
        </div>

      </div>
    </div>
  );
}