import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import Companiesdata from "../Company/companyTable.js";

const STORAGE_KEY = "worknest_companies";

export default function RevenueCard() {
  const [companies, setCompanies] = useState([]);

  const loadCompanies = () => {
    try {
      const savedCompanies = localStorage.getItem(STORAGE_KEY);

      if (savedCompanies === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Companiesdata));
        setCompanies(Companiesdata);
        return;
      }

      const parsedCompanies = JSON.parse(savedCompanies);

      if (Array.isArray(parsedCompanies)) {
        setCompanies(parsedCompanies);
        return;
      }

      setCompanies(Companiesdata);
    } catch (error) {
      console.error("Error loading companies:", error);
      setCompanies(Companiesdata);
    }
  };

  useEffect(() => {
    loadCompanies();

    const handleCompaniesUpdated = (event) => {
      if (event.detail) {
        setCompanies(event.detail);
      } else {
        loadCompanies();
      }
    };

    window.addEventListener("companiesUpdated", handleCompaniesUpdated);
    window.addEventListener("storage", loadCompanies);

    return () => {
      window.removeEventListener("companiesUpdated", handleCompaniesUpdated);
      window.removeEventListener("storage", loadCompanies);
    };
  }, []);

  const getRevenueNumber = (company) => {
    const revenue = String(company.revenue || "0");
    const numbers = revenue.match(/\d+(\.\d+)?/g);
    return numbers && numbers.length > 0 ? Number(numbers[0]) : 0;
  };

  const totalCompanies = companies.length;

  const monthlyRevenue = companies.reduce(
    (total, company) => total + getRevenueNumber(company),
    0
  );

  let freeCount = 0;
  let proCount = 0;
  let enterpriseCount = 0;

  companies.forEach((company) => {
    const amount = getRevenueNumber(company);

    if (amount < 150) {
      freeCount++;
    } else if (amount < 300) {
      proCount++;
    } else {
      enterpriseCount++;
    }
  });

  const freePercent = totalCompanies > 0 ? Math.round((freeCount / totalCompanies) * 100) : 0;
  const proPercent = totalCompanies > 0 ? Math.round((proCount / totalCompanies) * 100) : 0;
  const enterprisePercent = totalCompanies > 0 ? 100 - freePercent - proPercent : 0;

  const freeDeg = (freePercent / 100) * 360;
  const proDeg = freeDeg + (proPercent / 100) * 360;

  const failedCount = companies.filter(
    (company) => company.status === "Failed"
  ).length;

  const currentRate = totalCompanies > 0
    ? ((failedCount / totalCompanies) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Monthly Revenue (MRR)
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          +${monthlyRevenue}
        </h2>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-green-600 font-semibold">+8.5%</span>
          <span className="text-gray-500">vs May</span>
        </div>

        <div className="mt-6">
          <svg viewBox="0 0 300 120" className="w-full h-28" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 110L50 80L100 88L170 55L230 60L300 20L300 120L0 120Z" fill="url(#gradient)"/>
            <path d="M0 110L50 80L100 88L170 55L230 60L300 20" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-5">
          Subscription Plan Distribution
        </h3>
        <div className="flex flex-col items-center gap-5 text-center min-w-0">
          <div
            className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full"
            style={{
              background: `conic-gradient(#3b82f6 0deg ${freeDeg}deg, #5cc8c8 ${freeDeg}deg ${proDeg}deg, #f5c04a ${proDeg}deg 360deg)`,
            }}
          >
            <div className="absolute inset-4 sm:inset-5 bg-white rounded-full"></div>
          </div>
          <div className="space-y-2 w-full min-w-0">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500 shrink-0"></span>
              <span className="text-xs sm:text-sm text-gray-700">
                Free Tier ({freePercent}%)
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400 shrink-0"></span>
              <span className="text-xs sm:text-sm text-gray-700">
                Pro Tier ({proPercent}%)
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded bg-yellow-400 shrink-0"></span>
              <span className="text-xs sm:text-sm text-gray-700">
                Enterprise ({enterprisePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          New Company Onboarding
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          +{totalCompanies}
        </h2>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-green-600 font-semibold">+100</span>
          <span className="text-gray-500">vs Target</span>
        </div>

        <div className="mt-6">
          <svg viewBox="0 0 300 120" className="w-full h-28" preserveAspectRatio="none">
            <rect x="20" y="70" width="30" height="50" fill="#3B82F6" rx="4"/>
            <rect x="70" y="45" width="30" height="75" fill="#3B82F6" rx="4"/>
            <rect x="120" y="25" width="30" height="95" fill="#3B82F6" rx="4"/>
            <rect x="170" y="55" width="30" height="65" fill="#3B82F6" rx="4"/>
            <rect x="220" y="15" width="30" height="105" fill="#3B82F6" rx="4"/>
          </svg>
        </div>
      </div>

      <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Current Rate (Last 30 Days)
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          {currentRate}%
        </h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TrendingDown size={16} className="text-red-600" />
          <span className="text-red-600 font-semibold">
            Failed Companies
          </span>
        </div>

        <div className="mt-6">
          <svg viewBox="0 0 300 120" className="w-full h-28" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 20L50 60L100 55L170 88L230 80L300 110L300 120L0 120Z" fill="url(#gradient3)"/>
            <path d="M0 20L50 60L100 55L170 88L230 80L300 110" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

    </div>
  );
}