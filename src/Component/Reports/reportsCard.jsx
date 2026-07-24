import { TrendingDown, TrendingUp } from "lucide-react";

export default function RevenueCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Monthly Revenue (MRR)</p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">+$24,500</h2>
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
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[conic-gradient(#3b82f6_0deg_72deg,#5cc8c8_72deg_306deg,#f5c04a_306deg_360deg)]">
            <div className="absolute inset-5 bg-white rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span className="text-sm text-gray-700">
                Free Tier (20%)
              </span>
            </div>
              <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400"></span>
              <span className="text-sm text-gray-700">
                Pro Tier (65%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-yellow-400"></span>
              <span className="text-sm text-gray-700">
                Enterprise (15%)
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
          +128
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
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">+$24,500</h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TrendingDown size={16} className="text-red-600" />
          <span className="text-red-600 font-semibold">
            Down from 2.5%
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