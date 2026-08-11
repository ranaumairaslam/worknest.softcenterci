import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SuccessToast({ show, message, type = "success" }) {
  if (!show) return null;

  const isError = type === "error";

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${isError ? "bg-rose-600" : "bg-[#016472]"}`}>
      {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      {message}
    </div>
  );
}
