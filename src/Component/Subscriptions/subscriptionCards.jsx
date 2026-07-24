import {Building2,DollarSign,Clock3,CalendarClock,TrendingUp,Ban,} from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {stats.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300" >
          
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </h4>

              <div className="flex items-end gap-2 mt-3">
                <h2 className="text-4xl font-bold text-black">
                  {card.value}
                </h2>

                <span className="text-gray-500 mb-1">
                  {card.subText}
                </span>
              </div>
            </div>

            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${card.iconBg}`}
            >
              <span className={card.iconColor}>
                {card.icon}
              </span>
            </div>
          </div>
          {card.line2 ? (
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span>{card.line1}</span>

                <span
                  className={`w-2 h-2 rounded-full ${card.dot1}`}
                ></span>

                <span className={card.color1}>
                  {card.percent1}
                </span>
              </p>

              <p className="flex items-center gap-2">
                <span>{card.line2}</span>

                <span
                  className={`w-2 h-2 rounded-full ${card.dot2}`}
                ></span>

                <span className={card.color2}>
                  {card.percent2}
                </span>
              </p>
            </div>
          ) : (
            card.line1 && (
              <p className="mt-5 text-sm">
                {card.line1}{" "}
                <span className={card.color1}>
                  {card.percent1}
                </span>
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