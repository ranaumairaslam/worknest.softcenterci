import React from "react";
import { X, FileText } from "lucide-react";

export default function DeliverablesReviewModal({ items, onClose, onApprove, onReject }) {
  if (!items) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-800">Pending Deliverables Review</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto] text-xs font-medium text-slate-400 uppercase tracking-wide mb-2 px-1">
          <span>Team Member</span>
          <span>Attached</span>
        </div>

        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border-t border-slate-50 pt-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
                  {item.member.avatar}
                </div>
                <span className="text-sm text-slate-700">{item.member.name}</span>
              </div>
<div className="flex items-center gap-3">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  
                >
                  <FileText size={12} />
                  {item.linkLabel}
                </a>
                <button
                  onClick={() => onApprove?.(item)}
                  className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                >
                  APPROVE
                </button>
                <button
                  onClick={() => onReject?.(item)}
                  className="text-xs font-medium px-2 py-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100"
                >
                  REJECT
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}