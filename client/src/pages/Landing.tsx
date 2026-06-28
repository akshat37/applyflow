import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  SlidersHorizontal,
  TrendingUp,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/Button.tsx";
import { StatusBadge } from "../components/ui/Badge.tsx";
import type { ApplicationStatus } from "../types/index.ts";

const MOCK_JOBS: { company: string; role: string; status: ApplicationStatus }[] =
  [
    { company: "Google", role: "Software Engineer", status: "Technical Round" },
    { company: "Stripe", role: "Frontend Engineer", status: "Offer Received" },
    { company: "Linear", role: "Product Engineer", status: "Interview Scheduled" },
    { company: "Figma", role: "SWE Infrastructure", status: "Applied" },
    { company: "Vercel", role: "DX Engineer", status: "HR Round" },
  ];

const MOCK_STATS = [
  { label: "Total", value: 15, colorClass: "text-gray-700" },
  { label: "Applied", value: 6, colorClass: "text-blue-600" },
  { label: "Interviews", value: 4, colorClass: "text-amber-600" },
  { label: "Offers", value: 1, colorClass: "text-green-600" },
];

const FEATURES = [
  {
    icon: Target,
    title: "Track Everything",
    desc: "Log company, role, status, salary, and notes for every application — all in one place.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: SlidersHorizontal,
    title: "Filter & Search",
    desc: "Instantly find any application. Filter by status or job type, sort by date or company.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: TrendingUp,
    title: "Stay Motivated",
    desc: "Set daily targets, track this week's progress, and watch your pipeline grow.",
    color: "bg-violet-50 text-violet-600",
  },
];

const TRUST = [
  "No login required",
  "12 application statuses",
  "100% local — data never leaves your device",
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60">
      {/* Hero */}
      <section className="mx-auto max-w-screen-xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-start">
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left lg:pt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              <Zap className="h-3 w-3" />
              Free &amp; Open Source
            </span>

            <h1 className="mt-5 text-6xl font-extrabold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Apply
              </span>
              <span className="text-gray-900">flow</span>
            </h1>

            <p className="mt-3 text-xl font-semibold text-gray-500 tracking-tight">
              Your Job Search, Organised.
            </p>

            <p className="mt-4 text-base leading-relaxed text-gray-600 max-w-md mx-auto lg:mx-0">
              Track every application, interview, and offer in one clean
              dashboard — no spreadsheets, no logins, no cloud required.
            </p>

            <div className="mt-8">
              <Button
                size="md"
                onClick={() => navigate("/dashboard")}
                className="px-7 py-3 text-base shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-shadow"
              >
                Start Tracking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <ul className="mt-8 space-y-2.5">
              {TRUST.map((t) => (
                <li
                  key={t}
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Mock UI preview */}
          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <div className="relative">
              <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

              <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                {/* Mock top bar */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-5 py-3">
                  <span className="text-sm font-extrabold text-gray-900">
                    Apply
                    <span className="text-blue-600">flow</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Mock stat row */}
                <div className="grid grid-cols-4 gap-2 px-4 pt-4 pb-3">
                  {MOCK_STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-2.5 text-center"
                    >
                      <p className={`text-xl font-bold ${s.colorClass}`}>
                        {s.value}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mock table rows */}
                <div className="px-4 pb-5 space-y-2">
                  {MOCK_JOBS.map((job) => (
                    <div
                      key={job.company}
                      className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2.5 hover:bg-blue-50/50 transition-colors cursor-default"
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-900">
                          {job.company}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {job.role}
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-screen-xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Everything you need to manage your job search
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Simple, fast, and completely private.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`inline-flex rounded-xl p-3 ${f.color} mb-4 group-hover:scale-110 transition-transform`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
