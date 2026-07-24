import { Building2, Users, TrendingUp, UserCheck,ArrowDown } from "lucide-react";

export default function CompanyCards() {
  const cards = [
    {
      title: "Total Companies",
      value: "128",
      subTitle: "Companies",
      icon: Building2,
      gradient: "from-[#6366f1] to-[#8b5cf6]",
      bg: "bg-[#eef0ff]",
    },
    {
      title: "Active Account",
      value: "895",
      subTitle: "Account",
      icon: UserCheck,
      gradient: "from-[#0ea5e9] to-[#06b6d4]",
      bg: "bg-[#e6f6fd]",
    },
    {
      title: "New This Month",
      value: "35",
      subTitle: "Companies",
      icon: TrendingUp,
      gradient: "from-[#10b981] to-[#34d399]",
      bg: "bg-[#e7f8f1]",
    },
    {
      title: "Avrg Company Size",
      value: "240",
      subTitle: "Employees",
      icon: Users,
      gradient: "from-[#f43f5e] to-[#fb7185]",
      bg: "bg-[#fdeaee]",
    },
    
  ];

  return (
    <div className="w-full p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-semibold text-gray-800 tracking-wide">
                Companies
            </h2>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-0">
                <button className="bg-[#016472] text-white sm:mr-[20px] text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md shadow-indigo-200 w-full sm:w-auto whitespace-nowrap">
                + Add New Company
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#016472] text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-md shadow-indigo-200 w-full sm:w-auto whitespace-nowrap">
                <ArrowDown size={16} className="shrink-0" />
                Import Data
                </button>
            </div>
            </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-5 lg:p-[22px] min-h-[160px] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-[black] text-[16px] sm:text-[19px] font-medium">
                  {card.title}
                </h4>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient}`}
                >
                  <Icon size={18} className="text-white" />
                </div>
              </div>

              <h1 className="text-gray-900 text-[32px] sm:text-[40px] lg:text-[44px] mb-2 font-bold tracking-tight">
                {card.value}
              </h1>

              <p className="text-[#2c2a2a] text-[13px] sm:text-[14px]">
                {card.subTitle}
              </p>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}