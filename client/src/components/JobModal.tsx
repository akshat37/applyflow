import { useEffect, useState } from "react";
import { Modal } from "./ui/Modal.tsx";
import { Input } from "./ui/Input.tsx";
import { Textarea } from "./ui/Textarea.tsx";
import { Select } from "./ui/Select.tsx";
import { Button } from "./ui/Button.tsx";
import { useCreateJob, useUpdateJob } from "../hooks/useJobs.ts";
import type { Job, JobFormData, ApplicationStatus, LocationType, JobType } from "../types/index.ts";
import {
  APPLICATION_STATUSES,
  LOCATION_TYPES,
  JOB_TYPES,
} from "../types/index.ts";

interface JobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editJob?: Job | null;
}

const emptyForm: JobFormData = {
  companyName: "",
  role: "",
  jobUrl: "",
  locationType: "Remote",
  locationName: "",
  jobType: "Full-Time",
  status: "Applied",
  appliedDate: "",
  notes: "",
};

function toFormData(job: Job): JobFormData {
  return {
    companyName: job.companyName,
    role: job.role,
    jobUrl: job.jobUrl ?? "",
    locationType: job.locationType,
    locationName: job.locationName ?? "",
    jobType: job.jobType,
    status: job.status,
    appliedDate: job.appliedDate ? job.appliedDate.split("T")[0] : "",
    notes: job.notes ?? "",
  };
}

interface FieldErrors {
  companyName?: string;
  role?: string;
  jobUrl?: string;
}

export function JobModal({ open, onOpenChange, editJob }: JobModalProps) {
  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  const create = useCreateJob();
  const update = useUpdateJob();
  const isPending = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setForm(editJob ? toFormData(editJob) : emptyForm);
      setErrors({});
    }
  }, [open, editJob]);

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.companyName.trim()) next.companyName = "Company name is required";
    if (!form.role.trim()) next.role = "Role is required";
    if (form.jobUrl && !/^https?:\/\/.+/.test(form.jobUrl)) {
      next.jobUrl = "Enter a valid URL (https://...)";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: JobFormData = {
      ...form,
      appliedDate: form.appliedDate
        ? new Date(form.appliedDate).toISOString()
        : "",
    };

    if (editJob) {
      update.mutate(
        { id: editJob.id, data: payload },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      create.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  }

  function set<K extends keyof JobFormData>(key: K, val: JobFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={editJob ? "Edit Application" : "Add Application"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company *"
            id="companyName"
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            error={errors.companyName}
            placeholder="e.g. Stripe"
          />
          <Input
            label="Role *"
            id="role"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            error={errors.role}
            placeholder="e.g. Software Engineer"
          />
        </div>

        <Input
          label="Job URL"
          id="jobUrl"
          value={form.jobUrl}
          onChange={(e) => set("jobUrl", e.target.value)}
          onBlur={validate}
          error={errors.jobUrl}
          placeholder="https://..."
          type="url"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Status"
            value={form.status}
            onValueChange={(v) => set("status", v as ApplicationStatus)}
            options={APPLICATION_STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <Select
            label="Job Type"
            value={form.jobType}
            onValueChange={(v) => set("jobType", v as JobType)}
            options={JOB_TYPES.map((t) => ({ value: t, label: t }))}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Location Type"
            value={form.locationType}
            onValueChange={(v) => set("locationType", v as LocationType)}
            options={LOCATION_TYPES.map((l) => ({ value: l, label: l }))}
          />
          <Input
            label="Location Name"
            id="locationName"
            value={form.locationName}
            onChange={(e) => set("locationName", e.target.value)}
            placeholder="e.g. New York, NY"
          />
        </div>

        <Input
          label="Applied Date"
          id="appliedDate"
          type="date"
          value={form.appliedDate}
          onChange={(e) => set("appliedDate", e.target.value)}
        />

        <Textarea
          label="Notes"
          id="notes"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any notes about this application…"
          rows={3}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : editJob ? "Save Changes" : "Add Job"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
