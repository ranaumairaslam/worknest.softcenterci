import {Building2,Users,TrendingUp,UserCheck, ArrowDown, Search,Download,Clock3,Ban,} from "lucide-react";

export default function CompanyCards() {
  const cards = [
    {
      title: "Total Companies",
      value: "128",
      subTitle: "Registered Companies",
      trend: "+12%",
      trendColor: "text-green-600",
      icon: Building2,
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      title: "Active Companies",
      value: "102",
      subTitle: "Currently Active",
      trend: "+8%",
      trendColor: "text-green-600",
      icon: UserCheck,
      gradient: "from-sky-500 to-cyan-500",
    },
    {
      title: "New This Month",
      value: "35",
      subTitle: "New Registrations",
      trend: "+15%",
      trendColor: "text-green-600",
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Employees",
      value: "2,540",
      subTitle: "Across Companies",
      trend: "+6%",
      trendColor: "text-green-600",
      icon: Users,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Pending Approval",
      value: "08",
      subTitle: "Waiting Review",
      trend: "-2%",
      trendColor: "text-yellow-600",
      icon: Clock3,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Suspended",
      value: "05",
      subTitle: "Inactive Companies",
      trend: "-1%",
      trendColor: "text-red-600",
      icon: Ban,
      gradient: "from-red-500 to-pink-500",
    },
  ];

  return (
    <div className="w-full p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-8">
      <div>
          <h2 className="text-3xl font-bold text-gray-800">Company Management</h2>
          <p className="text-gray-500 mt-1"> Manage all registered companies across the platform.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
         <button className="bg-[#016472] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#01535e] transition">
            + Add Company</button>

          <button className="flex items-center gap-2 bg-white border px-5 py-2.5 rounded-lg hover:bg-gray-50 transition">
            <ArrowDown size={18} />Import</button>

          <button className="flex items-center gap-2 bg-white border px-5 py-2.5 rounded-lg hover:bg-gray-50 transition">
            <Download size={18} />Export</button>

        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#016472] transition-all duration-300">
               <div className="flex justify-between items-start"><div>
                 <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                    {card.title}
                  </h4>
                    <h1 className="text-4xl font-bold text-gray-900 mt-3">
                    {card.value}
                  </h1>

                  <p className="text-gray-500 mt-1">
                    {card.subTitle}
                  </p>

                </div>

                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
                >
                  <Icon size={26} className="text-white" />
                </div>

              </div>

              <div className="mt-6 flex items-center justify-between">

                <span className={`${card.trendColor} font-semibold`}>
                  {card.trend}
                </span>

                <span className="text-sm text-gray-400">
                  vs Last Month
                </span>

              </div>
              <div className="mt-4">
                <div className="w-full h-2 rounded-full bg-gray-200">

                  <div className="w-[75%] h-2 rounded-full bg-[#016472]"></div>

                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}