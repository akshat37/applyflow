import axios from "axios";
import type { JobFilters, JobFormData, JobResponse, JobsResponse } from "../types/index.ts";

const api = axios.create({ baseURL: "/api" });

export async function fetchJobs(filters: Partial<JobFilters>): Promise<JobsResponse> {
  const params: Record<string, string> = {};
  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.jobType) params.jobType = filters.jobType;
  if (filters.locationType) params.locationType = filters.locationType;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  const { data } = await api.get<JobsResponse>("/jobs", { params });
  return data;
}

export async function fetchJob(id: string): Promise<JobResponse> {
  const { data } = await api.get<JobResponse>(`/jobs/${id}`);
  return data;
}

export async function createJob(payload: JobFormData): Promise<JobResponse> {
  const { data } = await api.post<JobResponse>("/jobs", payload);
  return data;
}

export async function updateJob(id: string, payload: JobFormData): Promise<JobResponse> {
  const { data } = await api.put<JobResponse>(`/jobs/${id}`, payload);
  return data;
}

export async function deleteJob(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/jobs/${id}`);
  return data;
}

