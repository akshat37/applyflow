import { cn } from "../../lib/utils.ts";
import { statusColor } from "../../lib/utils.ts";
import type { ApplicationStatus } from "../../types/index.ts";

interface BadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
}

interface PlainBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: PlainBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
}
