import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 px-6 py-10 text-center ${className}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-5.5 w-5.5 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description ? (
        <p className="max-w-[220px] text-xs leading-relaxed text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
