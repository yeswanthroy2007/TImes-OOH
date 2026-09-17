export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
          TO
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold text-slate-900">
            Times<span className="text-blue-600">OOH</span>
          </p>
          <p className="text-[11px] text-slate-500">DND Site Selector</p>
        </div>
        <span className="ml-2 hidden rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 sm:inline">
          Delhi–Noida Direct corridor
        </span>
      </div>
    </header>
  );
}
