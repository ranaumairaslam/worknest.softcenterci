import {
  Building2,
  CalendarDays,
  Clock3,
  CreditCard,
  BadgeCheck,
  Hash,
  Download,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InvoiceCard() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-6">

        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
          <X size={22} className="text-gray-600" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              ABC Technologies
            </h2>

            <p className="text-gray-500 mt-1">
              Payment Invoice
            </p>
          </div>

          <div className="w-14 h-14 rounded-full bg-[#016472]/10 flex items-center justify-center">
            <Building2 className="text-[#016472]" size={28} />
          </div>
        </div>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span className="text-gray-500">Invoice ID</span>

            <span className="flex items-center gap-1 font-semibold">
              <Hash size={16} />
              INV-1001
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Transaction ID
            </span>

            <span className="font-semibold">
              TXN985421
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Payment Method
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <CreditCard size={16} />
              Bank Transfer
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">
              Amount
            </span>

            <span className="text-3xl font-bold text-black">
              100$
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Received Date
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <CalendarDays size={16} />
              24 Jul 2026
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Received Time
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <Clock3 size={16} />
              10:35 AM
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Status
            </span>

            <span className="flex items-center gap-1 text-green-600 font-semibold">
              <BadgeCheck size={18} />
              Paid
            </span>
          </div>

        </div>

        <button className="mt-8 w-full bg-[#016472] hover:bg-[#01515c] text-white py-3 rounded-xl flex items-center justify-center gap-2 transition">
          <Download size={18} />
          Download Invoice
        </button>

      </div>
    </div>
  );
}