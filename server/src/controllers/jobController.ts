import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";

const LOCATION_TYPES = ["Remote", "Hybrid", "On-site"] as const;
const JOB_TYPES = ["Internship", "Full-Time", "Part-Time", "Contract"] as const;
const STATUSES = [
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
] as const;

const jobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  jobUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  locationType: z.enum(LOCATION_TYPES).default("Remote"),
  locationName: z.string().optional(),
  jobType: z.enum(JOB_TYPES).default("Full-Time"),
  status: z.enum(STATUSES).default("Applied"),
  appliedDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable()
    .transform((v) => (v ? new Date(v) : null)),
  notes: z.string().optional(),
});

type FilteredStats = {
  total: number;
  applied: number;
  bookmarked: number;
  interviews: number;
  rejected: number;
  offers: number;
  noResponse: number;
};

type DashboardStats = FilteredStats & {
  thisWeek: number;
  todayCount: number;
};

function computeFilteredStats(jobs: { status: string }[]): FilteredStats {
  return {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    bookmarked: jobs.filter((j) => j.status === "Bookmarked").length,
    interviews: jobs.filter((j) =>
      [
        "Interview Scheduled",
        "Assessment",
        "HR Round",
        "Technical Round",
        "Final Round",
      ].includes(j.status)
    ).length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
    offers: jobs.filter((j) =>
      ["Offer Received", "Accepted"].includes(j.status)
    ).length,
    noResponse: jobs.filter((j) => j.status === "No Response").length,
  };
}

export async function getJobs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, status, jobType, locationType, sortBy } = req.query as Record<
      string,
      string | undefined
    >;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { role: { contains: search } },
        { locationName: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (jobType) where.jobType = jobType;
    if (locationType) where.locationType = locationType;

    type OrderBy =
      | { createdAt: "desc" }
      | { createdAt: "asc" }
      | { companyName: "asc" }
      | { appliedDate: "desc" };

    let orderBy: OrderBy = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    else if (sortBy === "company") orderBy = { companyName: "asc" };
    else if (sortBy === "appliedDate") orderBy = { appliedDate: "desc" };

    const jobs = await prisma.job.findMany({ where, orderBy });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    weekStart.setHours(0, 0, 0, 0);

    const [todayCount, thisWeek] = await Promise.all([
      prisma.job.count({ where: { createdAt: { gte: today } } }),
      prisma.job.count({ where: { appliedDate: { gte: weekStart } } }),
    ]);

    const stats: DashboardStats = {
      ...computeFilteredStats(jobs),
      todayCount,
      thisWeek,
    };

    res.json({ data: jobs, stats });
  } catch (err) {
    next(err);
  }
}

export async function getJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const job = await prisma.job.findUniqueOrThrow({
      where: { id: req.params.id },
    });
    res.json({ data: job });
  } catch (err) {
    next(err);
  }
}

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = jobSchema.parse(req.body);
    const job = await prisma.job.create({
      data: { ...data, jobUrl: data.jobUrl || null },
    });
    res.status(201).json({ data: job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = jobSchema.parse(req.body);
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { ...data, jobUrl: data.jobUrl || null },
    });
    res.json({ data: job });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await prisma.job.delete({ where: { id: req.params.id } });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
}
