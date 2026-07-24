import {
  Users,
  DollarSign,
  KeyRound,
  Ticket,
  Building2,
  UserCheck,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function DashboardCards() {
  const cards = [
    {
      title: "Total Active Users",
      value: "500K",
      change: "+0.9%",
      color: "text-green-500",
      icon: <Users size={22} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "$275K",
      change: "+1.7%",
      color: "text-green-500",
      icon: <DollarSign size={22} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "API Token Usage",
      value: "347K",
      change: "-2.1%",
      color: "text-red-500",
      icon: <KeyRound size={22} />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Open Tickets",
      value: "120",
      change: "+0.9%",
      color: "text-green-500",
      icon: <Ticket size={22} />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Total Companies",
      value: "48",
      change: "+3",
      color: "text-green-500",
      icon: <Building2 size={22} />,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Active Employees",
      value: "2,560",
      change: "+5%",
      color: "text-green-500",
      icon: <UserCheck size={22} />,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Today's Logins",
      value: "1,245",
      change: "+8%",
      color: "text-green-500",
      icon: <Activity size={22} />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Healthy",
      color: "text-green-500",
      icon: <ShieldCheck size={22} />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {card.title}
              </h3>

              <h2 className="text-3xl font-bold text-gray-900 mt-3">
                {card.value}
              </h2>

              <div className="flex items-center gap-2 mt-3">
                <span className={`text-sm font-semibold ${card.color}`}>
                  {card.change}
                </span>

                <span className="text-xs text-gray-500">
                  Last Month
                </span>
              </div>
            </div>

            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${card.iconBg}`}
            >
              <span className={card.iconColor}>
                {card.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}