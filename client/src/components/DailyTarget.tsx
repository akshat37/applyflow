import { useState } from "react";
import { Target } from "lucide-react";
import { Modal } from "./ui/Modal.tsx";
import { Button } from "./ui/Button.tsx";

interface DailyTargetProps {
  todayCount: number;
}

export function DailyTarget({ todayCount }: DailyTargetProps) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<number>(() => {
    const stored = localStorage.getItem("applyflow_daily_target");
    return stored ? parseInt(stored, 10) : 0;
  });
  const [inputVal, setInputVal] = useState(target > 0 ? String(target) : "");

  const pct = target > 0 ? Math.min((todayCount / target) * 100, 100) : 0;
  const exceeded = target > 0 && todayCount > target;
  const reached = target > 0 && todayCount >= target;

  function handleSave() {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n > 0) {
      setTarget(n);
      localStorage.setItem("applyflow_daily_target", String(n));
    }
    setOpen(false);
  }

  function handleClear() {
    setTarget(0);
    setInputVal("");
    localStorage.removeItem("applyflow_daily_target");
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <Target className="h-4 w-4 text-purple-600 shrink-0" />
        {target > 0 ? (
          <div className="flex flex-col gap-0.5 min-w-[90px]">
            <span
              className={`text-xs font-semibold leading-none ${
                reached ? "text-green-600" : "text-gray-700"
              }`}
            >
              {todayCount} / {target} today
            </span>
            <div className="h-1.5 w-full rounded-full bg-gray-100 mt-0.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  exceeded ? "bg-green-500" : "bg-purple-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-gray-600 text-sm">Daily Target</span>
        )}
      </button>

      <Modal open={open} onOpenChange={setOpen} title="Daily Target">
        <div className="space-y-5">
          {target > 0 && (
            <div className="rounded-xl bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Today's Progress
                </span>
                <span
                  className={`text-2xl font-bold ${
                    reached ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {todayCount}
                  <span className="text-base font-normal text-gray-400">
                    {" "}
                    / {target}
                  </span>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-200">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    exceeded ? "bg-green-500" : "bg-purple-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {exceeded ? (
                <p className="text-xs font-medium text-green-600">
                  You've exceeded your target — great work!
                </p>
              ) : reached ? (
                <p className="text-xs font-medium text-green-600">
                  Target reached for today!
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  {target - todayCount} more job
                  {target - todayCount !== 1 ? "s" : ""} to hit your target
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {target > 0 ? "Update daily target" : "Set a daily target"}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="e.g. 5"
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-500">jobs per day</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              {target > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Clear target
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
              >
                {target > 0 ? "Update" : "Set Target"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
