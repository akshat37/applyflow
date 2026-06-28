import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "./ui/Badge.tsx";
import type { Job } from "../types/index.ts";

interface RecentActivityProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
}

export function RecentActivity({ jobs, onEdit }: RecentActivityProps) {
  const recent = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm h-fit">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Recent Activity
        </h2>
      </div>
      {recent.length === 0 ? (
        <div className="px-4 py-8 text-center text-xs text-gray-400">
          No activity yet
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {recent.map((job) => (
            <li
              key={job.id}
              onClick={() => onEdit(job)}
              className="flex flex-col gap-1.5 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-xs font-semibold text-gray-900 leading-tight">
                  {job.companyName}
                </p>
                <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(new Date(job.updatedAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[11px] text-gray-400">{job.role}</p>
                <StatusBadge status={job.status} className="shrink-0 text-[10px] px-2 py-0" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
