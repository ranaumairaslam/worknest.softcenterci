import { SearchX } from "lucide-react";

export default function NoSearchResult() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <SearchX
          size={36}
          className="text-slate-400"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-800">
        No conversations found
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
        Try searching with a different name, project,
        role, or keyword.
      </p>

    </div>
  );
}