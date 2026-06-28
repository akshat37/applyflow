import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Modal } from "./ui/Modal.tsx";
import { StatusBadge } from "./ui/Badge.tsx";
import { Badge } from "./ui/Badge.tsx";
import type { Job } from "../types/index.ts";

interface JobDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

export function JobDetailModal({ open, onOpenChange, job }: JobDetailModalProps) {
  if (!job) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Application Details">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Company</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-900">{job.companyName}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Role</p>
          <p className="mt-0.5 text-base font-medium text-gray-800">{job.role}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Status</p>
            <StatusBadge status={job.status} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">Job Type</p>
            <Badge>{job.jobType}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Location</p>
            <p className="mt-0.5 text-sm text-gray-700">{job.locationType}</p>
            {job.locationName && (
              <p className="text-xs text-gray-500">{job.locationName}</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Applied Date</p>
            <p className="mt-0.5 text-sm text-gray-700">
              {job.appliedDate
                ? format(new Date(job.appliedDate), "MMM d, yyyy")
                : "—"}
            </p>
          </div>
        </div>

        {job.jobUrl && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">
              Job URL
            </p>
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Job Posting
            </a>
          </div>
        )}

        {job.notes && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</p>
            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
              {job.notes}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400">Added</p>
            <p className="text-xs font-medium text-gray-500">
              {format(new Date(job.createdAt), "MMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Last updated</p>
            <p className="text-xs font-medium text-gray-500">
              {format(new Date(job.updatedAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
