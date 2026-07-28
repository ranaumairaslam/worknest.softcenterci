import { ArrowDown, Download } from "lucide-react";
import { companyCards } from "./companyCardData";
import { Link } from "react-router-dom";

export default function CompanyCards() {
  return (
    <div className="w-full p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-8">
        
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Company Management
          </h2>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage all registered companies across the platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/AddCompany">
          
          <button className="w-full sm:w-auto bg-[#016472] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#01535e] transition">
            + Add Company
          </button>
          </Link>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border px-5 py-2.5 rounded-lg hover:bg-gray-50 transition">
            <ArrowDown size={18} />
            Import
          </button>

         

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        
        {companyCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#016472] transition-all duration-300"
            >

              <div className="flex justify-between items-start gap-3">
                
                <div className="min-w-0">
                  
                  <h4 className="text-gray-500 text-xs sm:text-sm font-semibold uppercase tracking-wide truncate">
                    {card.title}
                  </h4>

                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
                    {card.value}
                  </h1>

                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    {card.subTitle}
                  </p>

                </div>
                <div
                  className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
                >
                  <Icon
                    size={22}
                    className="text-white sm:hidden"
                  />

                  <Icon
                    size={26}
                    className="text-white hidden sm:block"
                  />
                </div>

              </div>
              <div className="mt-6 flex items-center justify-between">
                
                <span
                  className={`${card.trendColor} font-semibold text-sm sm:text-base`}
                >
                  {card.trend}
                </span>

                <span className="text-xs sm:text-sm text-gray-400">
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