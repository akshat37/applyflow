import { Pencil, Trash2, ExternalLink, Inbox, SearchX } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./ui/Badge.tsx";
import { Badge } from "./ui/Badge.tsx";
import { Button } from "./ui/Button.tsx";
import type { Job } from "../types/index.ts";

interface JobTableProps {
  jobs: Job[];
  hasFilters: boolean;
  onRowClick: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  deleteConfirmId: string | null;
  onDeleteConfirm: (id: string | null) => void;
}

export function JobTable({
  jobs,
  hasFilters,
  onRowClick,
  onEdit,
  onDelete,
  deleteConfirmId,
  onDeleteConfirm,
}: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
        {hasFilters ? (
          <>
            <SearchX className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-600">No results match your filters</p>
            <p className="mt-1 text-xs text-gray-400">Try adjusting or clearing the filters above</p>
          </>
        ) : (
          <>
            <Inbox className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-600">No applications yet</p>
            <p className="mt-1 text-xs text-gray-400">Click "Add Job" to track your first application</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {["Company", "Role", "Status", "Type", "Location", "Applied", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => onRowClick(job)}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td
                  title={job.companyName}
                  className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap max-w-[160px] truncate"
                >
                  {job.companyName}
                </td>
                <td
                  title={job.role}
                  className="px-4 py-3 text-sm text-gray-700 max-w-[180px] truncate whitespace-nowrap"
                >
                  {job.role}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge>{job.jobType}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  <span className="text-xs">{job.locationType}</span>
                  {job.locationName && (
                    <span className="ml-1 text-xs text-gray-400">· {job.locationName}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {job.appliedDate ? format(new Date(job.appliedDate), "MMM d, yyyy") : "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {deleteConfirmId === job.id ? (
                      <>
                        <span className="text-xs text-red-600 mr-1">Delete?</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            onDelete(job.id);
                            onDeleteConfirm(null);
                          }}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDeleteConfirm(null)}
                        >
                          No
                        </Button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(job)}
                          className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteConfirm(job.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {job.jobUrl ? (
                          <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="rounded p-1.5 text-gray-200 cursor-not-allowed">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
