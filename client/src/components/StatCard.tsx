import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils.ts";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  iconClass?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function StatCard({ icon: Icon, label, value, iconClass, onClick, isActive }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-white px-4 py-4 shadow-sm transition-all duration-150",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-px select-none",
        isActive
          ? "border-blue-500 ring-2 ring-blue-400 ring-offset-1"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 leading-tight">
          {label}
        </p>
        <div className={cn("shrink-0 rounded-lg p-1.5", iconClass ?? "bg-blue-50")}>
          <Icon className={cn("h-3.5 w-3.5", iconClass ? "text-current" : "text-blue-600")} />
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-gray-900 leading-none">
        {value}
      </p>
    </div>
  );
}
