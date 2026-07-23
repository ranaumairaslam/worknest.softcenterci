import { Link } from "react-router-dom";  
const stats = [
  {
    title: "TOTAL ACTIVE COMPANIES",
    value: "128",
    subText: "companies",
    line1: "Upgraded (Paid): 102",
    percent1: "(80%)",
    color1: "text-green-600",
    dot1: "bg-green-500",
    line2: "Active Free: 26",
    percent2: "(20%)",
    color2: "text-yellow-500",
    dot2: "bg-yellow-400",
  },
  {
    title: "REVENUE OVERVIEW",
    value: "$24,500",
    subText: "/mo",
    line1: "Upgrade Conversion Rate:",
    percent1: "+8.5%",
    color1: "text-green-600",
  },
  {
    title: "UPGRADE REQUEST QUEUE",
    value: "12",
    subText: "companies waiting",
    button: "Review Queue",
  },
];

export default function SubscriptionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
        
          <h4 className="text-xs font-semibold text-black uppercase tracking-wide">
            {card.title}
          </h4>
          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-4xl font-bold text-black">
              {card.value}
            </h2>
            <span className="text-gray-600 mb-1">
              {card.subText}
            </span>
          </div>
          {card.line2 && (
            <div className="mt-4 text-sm">
              <p className="flex items-center gap-2 text-black">
                {card.line1}
                <span
                  className={`w-2 h-2 rounded-full ${card.dot1}`}
                ></span>
                <span className={card.color1}>{card.percent1}</span>
              </p>

              <p className="flex items-center gap-2 mt-2 text-black">
                {card.line2}
                <span
                  className={`w-2 h-2 rounded-full ${card.dot2}`}
                ></span>
                <span className={card.color2}>{card.percent2}</span>
              </p>
            </div>
          )}
          {!card.line2 && card.line1 && (
            <p className="mt-4 text-sm text-black">
              {card.line1}{" "}
              <span className={card.color1}>
                {card.percent1}
              </span>
            </p>
          )}
          {card.button && (
            <Link to="/pending" className="mt-[20px] px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            <button >
              {card.button}
            </button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}