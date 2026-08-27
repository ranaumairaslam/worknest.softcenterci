import { useState } from "react";
import { X, FileText } from "lucide-react";

export default function DeliverablesReviewModal({
  items,
  onClose,
  onApprove,
  onReject,
  onViewTask,
}) {
  const [activeAction, setActiveAction] = useState(null);
  const [comment, setComment] = useState("");

  if (!items) {
    return null;
  }

  function openAction(itemId, type) {
    if (activeAction && activeAction.id === itemId && activeAction.type === type) {
      setActiveAction(null);
      setComment("");
    } else {
      setActiveAction({ id: itemId, type: type });
      setComment("");
    }
  }

  function confirmAction(item) {
    if (activeAction.type === "approve") {
      onApprove?.(item, comment);
    } else {
      onReject?.(item, comment);
    }
    setActiveAction(null);
    setComment("");
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Pending Deliverables Review
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">
            No pending deliverables.
          </p>
        )}

        <ul className="space-y-3">
          {items.map(function (item) {
            const isActive = activeAction && activeAction.id === item.id;

            return (
              <li key={item.id} className="border-t border-slate-50 pt-3">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
                      {item.member.avatar}
                    </div>
                    <span className="text-sm text-slate-700">
                      {item.member.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">

                  <button
  type="button"
  onClick={() => {
    console.log("========== VIEW TASK ==========");
    console.log("ITEM:", item);
    console.log("ITEM TASK:", item?.task);
    console.log("ITEM TASK ID:", item?.taskId);

    onViewTask?.(item);
  }}
  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
>
  <FileText size={12} />
  View task
</button>

                    <button
                      onClick={function () {
                        openAction(item.id, "approve");
                      }}
                      className="text-xs font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    >
                      APPROVE
                    </button>

                    <button
                      onClick={function () {
                        openAction(item.id, "reject");
                      }}
                      className="text-xs font-medium px-2 py-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      REJECT
                    </button>

                  </div>

                </div>

                {isActive && (
                  <div className="mt-2 pl-9 space-y-2">

                    <textarea
                      value={comment}
                      onChange={function (e) {
                        setComment(e.target.value);
                      }}
                      rows={2}
                      placeholder={
                        activeAction.type === "approve"
                          ? "Add a note (optional)"
                          : "Reason for sending back (optional)"
                      }
                      className={
                        activeAction.type === "approve"
                          ? "w-full text-xs border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          : "w-full text-xs border border-rose-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      }
                    />

                    <div className="flex gap-2">

                      <button
                        onClick={function () {
                          confirmAction(item);
                        }}
                        className={
                          activeAction.type === "approve"
                            ? "text-xs font-medium px-3 py-1 rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                            : "text-xs font-medium px-3 py-1 rounded-md text-white bg-rose-600 hover:bg-rose-700"
                        }
                      >
                        {activeAction.type === "approve" ? "Confirm Approve" : "Confirm Send Back"}
                      </button>

                      <button
                        onClick={function () {
                          setActiveAction(null);
                        }}
                        className="text-xs font-medium px-3 py-1 rounded-md text-slate-500 hover:bg-slate-100"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                )}

              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
}