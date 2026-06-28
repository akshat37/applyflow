export type LocationType = "Remote" | "Hybrid" | "On-site";
export type JobType = "Internship" | "Full-Time" | "Part-Time" | "Contract";
export type ApplicationStatus =
  | "Bookmarked"
  | "Applied"
  | "Interview Scheduled"
  | "Assessment"
  | "HR Round"
  | "Technical Round"
  | "Final Round"
  | "Offer Received"
  | "Accepted"
  | "Rejected"
  | "No Response"
  | "Withdrawn";

export interface Job {
  id: string;
  companyName: string;
  role: string;
  jobUrl: string | null;
  locationType: LocationType;
  locationName: string | null;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  applied: number;
  bookmarked: number;
  interviews: number;
  rejected: number;
  offers: number;
  noResponse: number;
  thisWeek: number;
  todayCount: number;
}

export interface JobsResponse {
  data: Job[];
  stats: DashboardStats;
}

export interface JobResponse {
  data: Job;
}

export interface JobFormData {
  companyName: string;
  role: string;
  jobUrl: string;
  locationType: LocationType;
  locationName: string;
  jobType: JobType;
  status: ApplicationStatus;
  appliedDate: string;
  notes: string;
}

export interface JobFilters {
  search: string;
  status: string;
  jobType: string;
  locationType: string;
  sortBy: string;
}

export const LOCATION_TYPES: LocationType[] = ["Remote", "Hybrid", "On-site"];
export const JOB_TYPES: JobType[] = [
  "Internship",
  "Full-Time",
  "Part-Time",
  "Contract",
];
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Bookmarked",
  "Applied",
  "Interview Scheduled",
  "Assessment",
  "HR Round",
  "Technical Round",
  "Final Round",
  "Offer Received",
  "Accepted",
  "Rejected",
  "No Response",
  "Withdrawn",
];
