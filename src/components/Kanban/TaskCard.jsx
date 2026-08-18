import { useState } from "react";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function TaskCard({ task, onClick, onEdit, onDelete, onDragStart, onDragEnd }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const showMenu = Boolean(onEdit || onDelete);

  function handleCardClick() {
    if (isDragging) return;
    onClick?.(task);
  }

  function handleMenuToggle(e) {
    e.stopPropagation();
    setMenuOpen((open) => !open);
  }

  function handleEditClick(e) {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit?.(task);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(task);
  }

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    onDragStart?.(task);
  }

  function handleDragEnd() {
    setIsDragging(false);
    onDragEnd?.();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick();
      }}
      className={`relative w-full text-left bg-white rounded-xl border border-slate-100 shadow-sm p-3 transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40" : "hover:shadow-md"
      }`}
    >
      {showMenu && (
        <div className="absolute top-2 right-2">
          <button
            type="button"
            onClick={handleMenuToggle}
            aria-label="Task actions"
            className="text-slate-300 hover:text-slate-500 p-1 rounded-md hover:bg-slate-50"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-start gap-2 mb-3 pr-5">
        <FileText size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-sm font-medium text-slate-700 leading-snug">{task.title}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
          {task.assignee.avatar}
        </div>
        <span className="text-xs text-slate-500">{task.assignee.name}</span>
      </div>
    </div>
  );
}