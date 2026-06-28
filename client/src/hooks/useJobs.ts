import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../lib/api.ts";
import type { JobFilters, JobFormData } from "../types/index.ts";

const JOBS_KEY = "jobs";

export function useJobs(filters: Partial<JobFilters>) {
  return useQuery({
    queryKey: [JOBS_KEY, filters],
    queryFn: () => fetchJobs(filters),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: JobFormData) => createJob(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [JOBS_KEY] });
      toast.success("Job added successfully");
    },
    onError: () => toast.error("Failed to add job"),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: JobFormData }) =>
      updateJob(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [JOBS_KEY] });
      toast.success("Job updated successfully");
    },
    onError: () => toast.error("Failed to update job"),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [JOBS_KEY] });
      toast.success("Job deleted");
    },
    onError: () => toast.error("Failed to delete job"),
  });
}

