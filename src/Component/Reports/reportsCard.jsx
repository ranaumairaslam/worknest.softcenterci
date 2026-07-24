import { TrendingDown, TrendingUp } from "lucide-react";


export default function RevenueCard() {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="w-[280px] bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Monthly Revenue (MRR)</p>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">+$24,500</h2>
        <div className="flex items-center gap-2 mt-2">
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
            <path d="M0 110L50 80L100 88L170 55L230 60L300 20L300 120L0 120Z"  fill="url(#gradient)"/>
            <path d="M0 110L50 80L100 88L170 55L230 60L300 20" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 w-[280px]">
        <h3 className="text-sm font-bold uppercase text-gray-700 mb-5">Subscription Plan Distribution</h3>
        <div className="flex items-center justify-between">
          <div className="relative w-30 h-30 mr-2 rounded-full bg-[conic-gradient(#3b82f6_0deg_72deg,#5cc8c8_72deg_306deg,#f5c04a_306deg_360deg)]">
            <div className="absolute inset-5 bg-white rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span className="text-sm text-gray-700">Free Tier (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400"></span>
              <span className="text-sm text-gray-700">Pro Tier (65%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-yellow-400"></span>
              <span className="text-sm text-gray-700">Enterprise (15%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[280px] bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">New Company Onboarding</p>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">+128</h2>
        <div className="flex items-center gap-2 mt-2">
          <TrendingUp size={16} className="text-green-600" />
          <span className="text-green-600 font-semibold">+100</span>
          <span className="text-gray-500">vs Target</span>
        </div>
        <div className="mt-6">
          <svg viewBox="0 0 300 120" className="w-full h-28">
              <rect x="20"  y="70" width="30" height="50" fill="#3B82F6" rx="4"/>
              <rect x="70"  y="45" width="30" height="75" fill="#3B82F6" rx="4"/>
              <rect x="120" y="25" width="30" height="95" fill="#3B82F6" rx="4"/>
              <rect x="170" y="55" width="30" height="65" fill="#3B82F6" rx="4"/>
              <rect x="220" y="15" width="30" height="105" fill="#3B82F6" rx="4"/>
            </svg>
        </div>
      </div>

      <div className="w-[280px] bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-lg transition">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current Rate(last 30days)</p>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">+$24,500</h2>
        <div className="flex items-center gap-2 mt-2">
          <TrendingDown size={16} className="text-[red]" />
          <span className="text-[red] font-semibold">Down from 2.5%</span>
          
        </div>
        <div className="mt-6">
          <svg viewBox="0 0 300 120" className="w-full h-28" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 20 L50 60 L100 55 L170 88 L230 80 L300 110 L300 120 L0 120 Z" fill="url(#gradient3)"/>
            <path d="M0 20 L50 60 L100 55 L170 88 L230 80 L300 110" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
      </div>
    </div>
  );
}