import { Search, X } from "lucide-react";
import { Select } from "./ui/Select.tsx";
import { Button } from "./ui/Button.tsx";
import type { JobFilters } from "../types/index.ts";
import { APPLICATION_STATUSES, JOB_TYPES, LOCATION_TYPES } from "../types/index.ts";

interface FilterBarProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
}

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "company", label: "Company A–Z" },
  { value: "appliedDate", label: "Applied date" },
];

export function FilterBar({ filters, onChange, searchValue, onSearchChange }: FilterBarProps) {
  const hasActiveFilters =
    !!filters.status ||
    !!filters.jobType ||
    !!filters.locationType ||
    (!!filters.sortBy && filters.sortBy !== "newest") ||
    !!filters.search;

  function clearAll() {
    onSearchChange("");
    onChange({ search: "", status: "", jobType: "", locationType: "", sortBy: "newest" });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company, role, location…"
          className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(v) => onChange({ ...filters, status: v })}
        placeholder="All statuses"
        options={[
          { value: "", label: "All statuses" },
          ...APPLICATION_STATUSES.map((s) => ({ value: s, label: s })),
        ]}
      />

      <Select
        value={filters.jobType}
        onValueChange={(v) => onChange({ ...filters, jobType: v })}
        placeholder="All types"
        options={[
          { value: "", label: "All types" },
          ...JOB_TYPES.map((t) => ({ value: t, label: t })),
        ]}
      />

      <Select
        value={filters.locationType}
        onValueChange={(v) => onChange({ ...filters, locationType: v })}
        placeholder="All locations"
        options={[
          { value: "", label: "All locations" },
          ...LOCATION_TYPES.map((l) => ({ value: l, label: l })),
        ]}
      />

      <Select
        value={filters.sortBy}
        onValueChange={(v) => onChange({ ...filters, sortBy: v })}
        placeholder="Sort by"
        options={sortOptions}
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
