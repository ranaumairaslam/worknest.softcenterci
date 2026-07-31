import { CheckCircle2 } from "lucide-react";

export default function SuccessToast({ show, message }) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#016472] px-5 py-3 text-sm font-medium text-white shadow-lg">
      <CheckCircle2 size={18} />
      {message}
    </div>
  );
}
