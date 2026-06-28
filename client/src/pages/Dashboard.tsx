import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Send,
  Bookmark,
  CalendarClock,
  XCircle,
  PartyPopper,
  Clock,
  Plus,
  AlertTriangle,
  Home,
  CalendarDays,
} from "lucide-react";
import { useJobs, useDeleteJob } from "../hooks/useJobs.ts";
import { JobModal } from "../components/JobModal.tsx";
import { JobDetailModal } from "../components/JobDetailModal.tsx";
import { JobTable } from "../components/JobTable.tsx";
import { StatCard } from "../components/StatCard.tsx";
import { FilterBar } from "../components/FilterBar.tsx";
import { RecentActivity } from "../components/RecentActivity.tsx";
import { DailyTarget } from "../components/DailyTarget.tsx";
import { Button } from "../components/ui/Button.tsx";
import type { Job, JobFilters, ApplicationStatus } from "../types/index.ts";

type TileKey =
  | "total"
  | "applied"
  | "bookmarked"
  | "interviews"
  | "rejected"
  | "offers"
  | "noResponse";

const TILE_STATUSES: Partial<Record<TileKey, ApplicationStatus[]>> = {
  applied: ["Applied"],
  bookmarked: ["Bookmarked"],
  interviews: ["Interview Scheduled", "Assessment", "HR Round", "Technical Round", "Final Round"],
  rejected: ["Rejected"],
  offers: ["Offer Received", "Accepted"],
  noResponse: ["No Response"],
};

const defaultFilters: JobFilters = {
  search: "",
  status: "",
  jobType: "",
  locationType: "",
  sortBy: "newest",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [activeTile, setActiveTile] = useState<TileKey | null>(null);

  useEffect(() => {
    const t = setTimeout(
      () => setFilters((prev) => ({ ...prev, search: searchInput })),
      300
    );
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isError, isLoading } = useJobs(filters);
  const deleteMutation = useDeleteJob();

  const jobs = data?.data ?? [];
  const stats = data?.stats;

  const displayedJobs =
    activeTile && TILE_STATUSES[activeTile]
      ? jobs.filter((j) => (TILE_STATUSES[activeTile!] as string[]).includes(j.status))
      : jobs;

  const hasFilters =
    !!filters.search ||
    !!filters.status ||
    !!filters.jobType ||
    !!filters.locationType ||
    (!!filters.sortBy && filters.sortBy !== "newest") ||
    !!activeTile;

  function handleTileClick(tile: TileKey) {
    setActiveTile((prev) => (prev === tile ? null : tile));
    setFilters((prev) => ({ ...prev, status: "" }));
  }

  function handleFilterChange(next: JobFilters) {
    setFilters(next);
    if (next.status) setActiveTile(null);
  }

  const handleRowClick = useCallback((job: Job) => {
    setDetailJob(job);
    setDetailOpen(true);
  }, []);

  const handleEdit = useCallback((job: Job) => {
    setEditJob(job);
    setModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                title="Back to home"
              >
                <Home className="h-4 w-4" />
              </button>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">
                  Apply<span className="text-blue-600">flow</span>
                </span>
                <span className="hidden sm:inline text-xs text-gray-400">
                  Job search tracker
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DailyTarget todayCount={stats?.todayCount ?? 0} />
              <Button onClick={() => { setEditJob(null); setModalOpen(true); }}>
                <Plus className="h-4 w-4" />
                Add Job
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
        {/* Error Banner */}
        {isError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Could not connect to the server. Make sure the backend is running on port 3001.
            </span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={BriefcaseBusiness}
            label="Total Applications"
            value={stats?.total ?? 0}
            iconClass="bg-gray-100 text-gray-500"
            onClick={() => handleTileClick("total")}
            isActive={activeTile === "total"}
          />
          <StatCard
            icon={Send}
            label="Applied"
            value={stats?.applied ?? 0}
            iconClass="bg-blue-50 text-blue-600"
            onClick={() => handleTileClick("applied")}
            isActive={activeTile === "applied"}
          />
          <StatCard
            icon={Bookmark}
            label="Bookmarked"
            value={stats?.bookmarked ?? 0}
            iconClass="bg-slate-100 text-slate-500"
            onClick={() => handleTileClick("bookmarked")}
            isActive={activeTile === "bookmarked"}
          />
          <StatCard
            icon={CalendarClock}
            label="Interviews"
            value={stats?.interviews ?? 0}
            iconClass="bg-amber-50 text-amber-600"
            onClick={() => handleTileClick("interviews")}
            isActive={activeTile === "interviews"}
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats?.rejected ?? 0}
            iconClass="bg-red-50 text-red-500"
            onClick={() => handleTileClick("rejected")}
            isActive={activeTile === "rejected"}
          />
          <StatCard
            icon={PartyPopper}
            label="Offers"
            value={stats?.offers ?? 0}
            iconClass="bg-green-50 text-green-600"
            onClick={() => handleTileClick("offers")}
            isActive={activeTile === "offers"}
          />
          <StatCard
            icon={Clock}
            label="No Response"
            value={stats?.noResponse ?? 0}
            iconClass="bg-gray-100 text-gray-500"
            onClick={() => handleTileClick("noResponse")}
            isActive={activeTile === "noResponse"}
          />
          <StatCard
            icon={CalendarDays}
            label="Applied This Week"
            value={stats?.thisWeek ?? 0}
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* Active tile label */}
        {activeTile && activeTile !== "total" && (
          <div className="flex items-center gap-2 text-sm -mt-1">
            <span className="text-blue-600 font-medium">Showing:</span>
            <span className="text-gray-700">
              {activeTile === "noResponse"
                ? "No Response"
                : activeTile.charAt(0).toUpperCase() + activeTile.slice(1)}
            </span>
            <button
              onClick={() => setActiveTile(null)}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
        />

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Loading…
          </div>
        ) : (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="flex-1 min-w-0">
              <JobTable
                jobs={displayedJobs}
                hasFilters={hasFilters}
                onRowClick={handleRowClick}
                onEdit={handleEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                deleteConfirmId={deleteConfirmId}
                onDeleteConfirm={setDeleteConfirmId}
              />
            </div>
            <div className="lg:w-60 shrink-0">
              <RecentActivity jobs={displayedJobs} onEdit={handleEdit} />
            </div>
          </div>
        )}
      </main>

      <JobModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditJob(null);
        }}
        editJob={editJob}
      />

      <JobDetailModal
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setDetailJob(null);
        }}
        job={detailJob}
      />
    </div>
  );
}
