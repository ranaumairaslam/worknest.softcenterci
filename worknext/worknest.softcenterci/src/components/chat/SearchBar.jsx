import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onClear,
}) {
  return (
    <div className="relative">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search conversations..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-[#016472] focus:bg-white"
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-slate-200"
        >
          <X
            size={16}
            className="text-slate-500"
          />
        </button>
      )}

    </div>
  );
}