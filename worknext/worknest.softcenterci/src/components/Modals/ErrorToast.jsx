import { XCircle } from "lucide-react";

export default function ErrorToast({ show, message }) {
  if (!show) return null;

  return (
    <div className="fixed right-6 top-6 z-50">
      <div className="flex items-center gap-3 rounded-xl bg-rose-600 px-5 py-3 text-white shadow-xl">
        <XCircle size={20} />
        <span>{message}</span>
      </div>
    </div>
  );
}
