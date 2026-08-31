// ── Recent Activity (Admin Command Center, Step 9 Part 4) ──
// Shows REAL activity only: successful hospital availability updates
// recorded by hospitalDataService. Read-only for admins — no edit,
// delete, or fake-entry controls. A backend can replace the activity
// storage behind the service without changing this component.

import { useEffect, useState } from "react";
import {
  BedDouble,
  Wind,
  Activity,
  RefreshCw,
  History,
  ArrowRight,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import hospitalDataService from "../services/hospitalDataService";
import { formatLastUpdated } from "../utils/availability";

// Icon for an entry, based on what the update touched
const entryIcon = (entry) => {
  const touchedIcu = entry.changes.some((c) => c.field.endsWith("ICUBeds"));
  const touchedVent = entry.changes.some((c) => c.field.endsWith("Ventilators"));
  if (touchedIcu && touchedVent) return Activity;
  if (touchedIcu) return BedDouble;
  if (touchedVent) return Wind;
  return RefreshCw;
};

export default function RecentActivity({ limit, refreshKey }) {
  const [entries, setEntries] = useState(null); // null until first load
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [retryCount, setRetryCount] = useState(0);

  // Load (and silently refresh when live hospital data changes — the
  // first load shows the loading state, refreshes never flash).
  useEffect(() => {
    let cancelled = false;
    hospitalDataService
      .fetchActivityLog()
      .then((list) => {
        if (cancelled) return;
        setEntries(limit ? list.slice(0, limit) : list);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [limit, refreshKey, retryCount]);

  const retry = () => {
    setStatus("loading");
    setRetryCount((c) => c + 1);
  };

  return (
    <div className="bg-white border border-navy-100 rounded-xl shadow-sm">
      <div className="p-5 pb-0">
        <h3 className="font-bold text-navy-900 flex items-center gap-2">
          <History className="w-5 h-5 text-medical-500" />
          Recent Activity
        </h3>
        <p className="text-xs text-navy-400 mt-1 mb-4">
          Successful availability updates recorded from hospital staff — demo
          data, not real-time monitoring.
        </p>
      </div>

      <div className="px-5 pb-5">
        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-navy-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading recent activity...
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <p className="text-sm font-semibold text-navy-700">
              Unable to load recent activity.
            </p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {status === "ready" && entries.length === 0 && (
          // ── Empty state — never leave the section blank ──
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-navy-500">
            <History className="w-4 h-4 shrink-0" />
            No hospital availability updates have been recorded yet.
          </div>
        )}

        {status === "ready" && entries.length > 0 && (
          <ol className="space-y-3">
            {entries.map((entry) => {
              const Icon = entryIcon(entry);
              return (
                <li
                  key={entry.id}
                  className="flex items-start gap-3 p-3 bg-navy-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-navy-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-medical-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-navy-800">
                      <span className="font-bold text-navy-900">
                        {entry.hospitalName}
                      </span>{" "}
                      {entry.summary}
                    </p>

                    {entry.changes.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {entry.changes.map((change) => (
                          <li
                            key={change.field}
                            className="text-xs text-navy-500"
                          >
                            {change.label} updated from{" "}
                            <span className="font-semibold text-navy-700">
                              {change.from}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-navy-700">
                              {change.to}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {entry.statusChange && (
                      <p className="mt-1.5">
                        <span className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {entry.statusChange.from}
                          <ArrowRight className="w-3 h-3" />
                          {entry.statusChange.to}
                        </span>
                        <span className="text-xs text-navy-500 ml-1.5">
                          status changed
                        </span>
                      </p>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs text-navy-400 mt-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {formatLastUpdated(entry.timestamp)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
