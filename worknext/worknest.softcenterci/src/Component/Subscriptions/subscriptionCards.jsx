import {
  Building2,
  DollarSign,
  Clock3,
  CalendarClock,
  TrendingUp,
  Ban,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "TOTAL ACTIVE COMPANIES",
    value: "128",
    subText: "Companies",
    icon: <Building2 size={26} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    line1: "Paid Companies",
    percent1: "102 (80%)",
    color1: "text-green-600",
    dot1: "bg-green-500",
    line2: "Free Companies",
    percent2: "26 (20%)",
    color2: "text-yellow-500",
    dot2: "bg-yellow-400",
  },
  {
    title: "MONTHLY REVENUE",
    value: "$24,500",
    subText: "/Month",
    icon: <DollarSign size={26} />,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    line1: "Growth Rate",
    percent1: "+8.5%",
    color1: "text-green-600",
  },
  {
    title: "UPGRADE REQUESTS",
    value: "12",
    subText: "Pending",
    icon: <Clock3 size={26} />,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    button: "Review Queue",
  },
  {
    title: "EXPIRING SUBSCRIPTIONS",
    value: "18",
    subText: "Next 7 Days",
    icon: <CalendarClock size={26} />,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    line1: "Renewal Rate",
    percent1: "92%",
    color1: "text-green-600",
  },
  {
    title: "NEW SUBSCRIPTIONS",
    value: "34",
    subText: "This Month",
    icon: <TrendingUp size={26} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    line1: "Growth",
    percent1: "+12%",
    color1: "text-green-600",
  },
  {
    title: "CANCELLED SUBSCRIPTIONS",
    value: "5",
    subText: "This Month",
    icon: <Ban size={26} />,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    line1: "Cancellation Rate",
    percent1: "-2%",
    color1: "text-red-500",
  },
];

export default function SubscriptionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {stats.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#016472] transition-all duration-300 h-full"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500">
                {card.title}
              </h4>

              <div className="flex items-end gap-2 mt-3 flex-wrap">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 break-words">
                  {card.value}
                </h2>

                <span className="text-sm text-gray-500">
                  {card.subText}
                </span>
              </div>
            </div>

            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
            >
              <span className={card.iconColor}>{card.icon}</span>
            </div>
          </div>

          {card.line2 ? (
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2 flex-wrap">
                <span>{card.line1}</span>
                <span className={`w-2 h-2 rounded-full ${card.dot1}`}></span>
                <span className={card.color1}>{card.percent1}</span>
              </p>

              <p className="flex items-center gap-2 flex-wrap">
                <span>{card.line2}</span>
                <span className={`w-2 h-2 rounded-full ${card.dot2}`}></span>
                <span className={card.color2}>{card.percent2}</span>
              </p>
            </div>
          ) : (
            card.line1 && (
              <p className="mt-5 text-sm flex flex-wrap gap-1">
                <span>{card.line1}</span>
                <span className={card.color1}>{card.percent1}</span>
              </p>
            )
          )}

          {card.button && (
            <Link to="/pending">
              <button className="mt-6 w-full py-2.5 rounded-lg bg-[#016472] text-white font-medium hover:bg-[#014f59] transition">
                {card.button}
              </button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}