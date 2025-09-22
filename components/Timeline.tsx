// components/Timeline.tsx
"use client";

import React, { useEffect, useState } from "react";

interface ApiTask {
  _id?: string;
  id?: string;
  title?: string;
  startDate?: string | null;
  start?: string | null;
  dueDate?: string | null;
  endDate?: string | null;
  due?: string | null;
  [k: string]: any;
}

interface NormalizedTask {
  id: string;
  title: string;
  startISO: string; // YYYY-MM-DD (local)
  dueISO: string;   // YYYY-MM-DD (local)
}

/** Convert Date object -> YYYY-MM-DD using local timezone */
function formatDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Convert various input date strings into YYYY-MM-DD (local).
 * If input already is YYYY-MM-DD it returns it unchanged.
 * Returns null if not parseable.
 */
function toLocalYMD(input?: string | null): string | null {
  if (!input) return null;
  // if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return formatDateLocal(d);
}

/** Build inclusive date range from startYMD to endYMD (both YYYY-MM-DD). */
function buildDateRangeFromYMD(startYMD: string, endYMD: string) {
  const [sy, sm, sd] = startYMD.split("-").map((x) => parseInt(x, 10));
  const [ey, em, ed] = endYMD.split("-").map((x) => parseInt(x, 10));
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const out: string[] = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  while (cur <= end) {
    out.push(formatDateLocal(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export default function Timeline({ projectId }: { projectId?: string | null }) {
  const [tasks, setTasks] = useState<NormalizedTask[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sample fallback to preview the UI when projectId not provided or no tasks
  const sample: NormalizedTask[] = [
    {
      id: "sample-1",
      title: "Sample Task",
      startISO: formatDateLocal(new Date()),
      dueISO: formatDateLocal(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
    },
  ];

  useEffect(() => {
    if (!projectId) {
      // show sample preview if no projectId passed
      setTasks(sample);
      setDates(buildDateRangeFromYMD(sample[0].startISO, sample[0].dueISO));
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects/${projectId}/tasks`, {
          credentials: "include",
        });
        const json = await res.json();

        const rawTasks: ApiTask[] =
          (Array.isArray(json) && json) ||
          (Array.isArray(json?.data) && json.data) ||
          (Array.isArray(json?.tasks) && json.tasks) ||
          (Array.isArray(json?.results) && json.results) ||
          [];

        const normalized: NormalizedTask[] = rawTasks
          .map((t) => {
            // Prefer common fields in order: startDate / start / start_date
            const start = toLocalYMD(t.startDate ?? t.start ?? t["start_date"]);
            const due =
              toLocalYMD(
                t.dueDate ??
                  t.due ??
                  t.endDate ??
                  t["due_date"] ??
                  t.end ??
                  t["deadline"]
              ) ?? start; // fallback due -> start
            const safeStart = start ?? toLocalYMD(new Date().toString())!;
            const safeDue = due ?? safeStart;
            return {
              id: (t._id ?? t.id ?? Math.random().toString(36).slice(2)).toString(),
              title: t.title ?? "Untitled",
              startISO: safeStart,
              dueISO: safeDue,
            } as NormalizedTask;
          })
          .filter((nt) => {
            // remove invalid dates
            const s = new Date(nt.startISO);
            const e = new Date(nt.dueISO);
            return !Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime());
          });

        if (!mounted) return;

        if (normalized.length === 0) {
          setTasks(sample);
          setDates(buildDateRangeFromYMD(sample[0].startISO, sample[0].dueISO));
        } else {
          setTasks(normalized);

          // compute min start and max due
          let min: string | null = null;
          let max: string | null = null;
          normalized.forEach((nt) => {
            if (!min || new Date(nt.startISO) < new Date(min)) min = nt.startISO;
            if (!max || new Date(nt.dueISO) > new Date(max)) max = nt.dueISO;
          });

          // safety fallback
          if (!min) min = formatDateLocal(new Date());
          if (!max) {
            const tmp = new Date(min);
            tmp.setDate(tmp.getDate() + 3);
            max = formatDateLocal(tmp);
          }

          const dr = buildDateRangeFromYMD(min, max);
          setDates(dr);
        }
      } catch (err: any) {
        console.error("Timeline fetch error:", err);
        setError(err?.message ?? "Failed to load tasks");
        setTasks(sample);
        setDates(buildDateRangeFromYMD(sample[0].startISO, sample[0].dueISO));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  /**
   * Calculate gridColumn for the yellow bar inside the nested date-grid.
   * Each column in the nested grid corresponds to one date cell.
   * We want the bar to start at (startIndex + 1) and end at (endIndex + 2)
   * because CSS grid end index is exclusive.
   */
  const getNestedGridColumn = (t: NormalizedTask) => {
    if (dates.length === 0) return "1 / 2";
    let startIndex = dates.indexOf(t.startISO);
    let endIndex = dates.indexOf(t.dueISO);

    // clamp indexes if the task dates fall outside the computed range
    if (startIndex === -1) {
      // try to find nearest date > startISO, otherwise 0
      startIndex = 0;
    }
    if (endIndex === -1) {
      endIndex = Math.max(startIndex, dates.length - 1);
    }

    // ensure endIndex >= startIndex
    endIndex = Math.max(startIndex, endIndex);

    // grid columns are 1-based and end is exclusive: startIndex+1 .. endIndex+2
    return `${startIndex + 1} / ${endIndex + 2}`;
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Timeline</h2>
        <div className="text-sm text-gray-500">{loading ? "Loading…" : null}</div>
      </div>

      <div className="overflow-x-auto">
        {/* Header row: fixed left column + nested date header */}
        <div
          className="grid items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          style={{ gridTemplateColumns: "150px 1fr" }}
        >
          <div className="p-3 text-sm font-medium text-gray-600 dark:text-gray-300">
            Tasks
          </div>

          <div className="px-2">
            {dates.length === 0 ? (
              <div className="text-sm text-gray-500 p-3">No date range</div>
            ) : (
              <div
                className="grid gap-0"
                style={{
                  gridTemplateColumns: `repeat(${dates.length}, minmax(120px, 1fr))`,
                }}
              >
                {dates.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs sm:text-sm py-3 text-gray-500 dark:text-gray-400"
                  >
                    {new Date(d).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-4 mt-4">
          {error && <div className="text-red-600 text-sm px-4">{error}</div>}

          {tasks.map((t) => (
            <div
              key={t.id}
              className="grid items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              style={{ gridTemplateColumns: "150px 1fr" }}
            >
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {t.title?.charAt(0)?.toUpperCase() ?? "T"}
                </div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {t.title}
                </div>
              </div>

              <div className="p-3">
                {dates.length === 0 ? (
                  <div className="text-sm text-gray-500">No date range available</div>
                ) : (
                  <div
                    className="relative"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${dates.length}, minmax(120px, 1fr))`,
                      gap: "0px", // important: no gap so bar stretches continuously
                      alignItems: "center",
                    }}
                  >
                    {/* background cells (subtle vertical separators) */}
                    {dates.map((d, idx) => (
                      <div
                        key={d}
                        className={`h-6 ${idx < dates.length - 1 ? "border-r border-gray-200 dark:border-gray-700" : ""
                          }`}
                      />
                    ))}

                    {/* Yellow bar (spans start -> due) */}
                    <div
                      className="h-8 flex items-center px-3 rounded-full text-xs font-semibold text-white shadow"
                      style={{
                        background: "linear-gradient(180deg, #d48700, #c97700)",
                        gridColumn: getNestedGridColumn(t),
                         justifySelf: "stretch",  // <— spans full width of its grid cell(s)
                        alignSelf: "center", 
                        zIndex: 10,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      title={`${t.title} • ${t.startISO} → ${t.dueISO}`}
                    >
                      {t.title}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {tasks.length === 0 && !loading && (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg text-gray-500">
              No tasks found for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
