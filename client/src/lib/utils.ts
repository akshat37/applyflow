import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApplicationStatus } from "../types/index.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function statusColor(status: ApplicationStatus): string {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-700";
    case "Bookmarked":
    case "No Response":
    case "Withdrawn":
      return "bg-gray-100 text-gray-700";
    case "Interview Scheduled":
    case "Assessment":
    case "HR Round":
    case "Technical Round":
    case "Final Round":
      return "bg-amber-100 text-amber-700";
    case "Offer Received":
    case "Accepted":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
