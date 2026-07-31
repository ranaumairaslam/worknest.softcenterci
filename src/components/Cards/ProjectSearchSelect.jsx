import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export default function ProjectSearchSelect({ projects, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const selected = projects.find((p) => p.id === selectedId);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(project) {
    onSelect(project.id);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 text-lg font-semibold text-slate-800 hover:text-slate-600"
      >
        {selected?.name ?? "Select project"}
        <ChevronDown size={16} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
          <div className="relative p-2 border-b border-slate-100">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-7 pr-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">No projects found.</li>
            )}
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p.id === selectedId}
                  onClick={() => handleSelect(p)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-left text-slate-600 hover:bg-slate-50"
                >
                  {p.name}
                  {p.id === selectedId && <Check size={14} className="text-blue-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}