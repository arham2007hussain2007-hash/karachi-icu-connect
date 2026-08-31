import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Hospital,
  Clock,
  BedDouble,
  Activity,
  UserCog,
  BarChart3,
  Wind,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useHospitals } from "../context/HospitalDataContext";
import { getAvailabilityStatus } from "../utils/availability";
import { getPlatformStats } from "../data/hospitals";
import HospitalMonitoring from "../components/HospitalMonitoring";
import AttentionRequired from "../components/AttentionRequired";
import RecentActivity from "../components/RecentActivity";
import NetworkInsights from "../components/NetworkInsights";
import {
  StatCard,
  StatusBadge,
  DashboardHeader,
  DemoModeBanner,
} from "../components/DashboardUI";

// Mock users for user management
const MOCK_USERS = [
  { id: 1, name: "Dr. Ahmed Khan", email: "ahmed@agh.edu.pk", role: "HOSPITAL_STAFF", status: "ACTIVE", lastActive: "2 hours ago" },
  { id: 2, name: "Nurse Fatima Ali", email: "fatima@indus.edu.pk", role: "HOSPITAL_STAFF", status: "ACTIVE", lastActive: "30 min ago" },
  { id: 3, name: "Dr. Zainab Shah", email: "zainab@ziauddin.pk", role: "HOSPITAL_STAFF", status: "PENDING", lastActive: "1 day ago" },
  { id: 4, name: "Raza Hussain", email: "raza@gmail.com", role: "PUBLIC", status: "ACTIVE", lastActive: "10 min ago" },
  { id: 5, name: "Ayesha Malik", email: "ayesha@gmail.com", role: "PUBLIC", status: "ACTIVE", lastActive: "1 hour ago" },
  { id: 6, name: "Admin User", email: "admin@karachi-icu.pk", role: "ADMIN", status: "ACTIVE", lastActive: "5 min ago" },
  { id: 7, name: "Bilal Raza", email: "bilal@civil.pk", role: "HOSPITAL_STAFF", status: "SUSPENDED", lastActive: "2 weeks ago" },
];

const tabs = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "hospitals", label: "Monitoring", icon: Hospital },
  { key: "users", label: "Users", icon: UserCog },
  { key: "analytics", label: "Analytics", icon: Activity },
  { key: "activity", label: "Activity", icon: Clock },
];

export default function AdminDashboardPage() {
  const { hospitals, status, error, reload } = useHospitals();
  const [activeTab, setActiveTab] = useState("overview");
  const [hospitalStatuses, setHospitalStatuses] = useState(() => {
    const map = {};
    hospitals.forEach((h) => {
      map[h.id] = h.verified ? "VERIFIED" : "PENDING";
    });
    return map;
  });
  const [userStatuses, setUserStatuses] = useState(() => {
    const map = {};
    MOCK_USERS.forEach((u) => { map[u.id] = u.status; });
    return map;
  });

  const verifiedCount = Object.values(hospitalStatuses).filter((s) => s === "VERIFIED").length;
  const pendingCount = Object.values(hospitalStatuses).filter((s) => s === "PENDING").length;
  const rejectedCount = Object.values(hospitalStatuses).filter((s) => s === "REJECTED").length;

  const setHospitalStatus = (id, newStatus) => {
    setHospitalStatuses({ ...hospitalStatuses, [id]: newStatus });
  };

  const setUserStatus = (id, newStatus) => {
    setUserStatuses({ ...userStatuses, [id]: newStatus });
  };

  // ── Network aggregates — ALL computed from the live hospital list ──
  // (useHospitals → HospitalDataContext), so staff availability updates
  // (Step 7) are reflected here immediately. Reuses getPlatformStats and
  // getAvailabilityStatus instead of duplicating that logic.
  const stats = useMemo(() => {
    const platform = getPlatformStats(hospitals);
    const statusCounts = { AVAILABLE: 0, LIMITED: 0, FULL: 0 };
    hospitals.forEach((h) => {
      statusCounts[getAvailabilityStatus(h)] += 1;
    });
    return {
      ...platform,
      statusCounts,
      occupiedBeds: platform.totalBeds - platform.availableBeds,
      ventilatorsInUse: platform.totalVentilators - platform.availableVentilators,
      overallAvailabilityPct:
        platform.totalBeds > 0
          ? Math.round((platform.availableBeds / platform.totalBeds) * 100)
          : 0,
    };
  }, [hospitals]);

  // Analytics data
  const areaDistribution = {};
  hospitals.forEach((h) => {
    areaDistribution[h.area] = (areaDistribution[h.area] || 0) + 1;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardHeader
        title="Admin Command Center"
        subtitle="Karachi ICU Connect — Hospital Network Overview"
      />

      <DemoModeBanner message="DEMO DATA — please call to confirm. Availability shown is mock/local data, not real-time monitoring." />

      {/* Quick Actions — navigation shortcuts to existing routes only (Step 9 Part 5) */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-bold text-navy-400 uppercase tracking-wider mr-1">
          Quick Actions
        </span>
        <Link
          to="/hospitals"
          className="inline-flex items-center gap-1.5 bg-white border border-navy-200 hover:border-medical-400 hover:bg-medical-50 text-navy-700 hover:text-medical-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
        >
          View All Hospitals
        </Link>
        <Link
          to="/recommend"
          className="inline-flex items-center gap-1.5 bg-white border border-navy-200 hover:border-medical-400 hover:bg-medical-50 text-navy-700 hover:text-medical-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
        >
          Open Smart Match
        </Link>
        <Link
          to="/map"
          className="inline-flex items-center gap-1.5 bg-white border border-navy-200 hover:border-medical-400 hover:bg-medical-50 text-navy-700 hover:text-medical-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
        >
          View Map
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-navy-100 p-1 rounded-lg mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.key ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-700"
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview: Network Availability (Command Center) ── */}
      {activeTab === "overview" && (
        <div>
          {status === "loading" && <NetworkLoadingState />}

          {status === "error" && (
            <NetworkErrorState message={error} onRetry={reload} />
          )}

          {status === "ready" && (
            <div>
              {/* Section heading */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-medical-500" />
                  Network Availability Overview
                </h2>
                <p className="text-sm text-navy-500 mt-1">
                  Reported availability across {stats.totalHospitals} hospitals —
                  demo data, not real-time monitoring.
                </p>
              </div>

              {/* ATTENTION REQUIRED — flags from live data only (Step 9 Part 3);
                  gated behind status === "ready" so no false all-clear shows
                  while hospital data is loading */}
              <AttentionRequired hospitals={hospitals} />

              {/* HOSPITAL OVERVIEW */}
              <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-3">
                Hospital Overview
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Hospitals" value={stats.totalHospitals} icon={Hospital} color="text-navy-600" bg="bg-navy-50" />
                <StatCard label="Available Hospitals" value={stats.statusCounts.AVAILABLE} icon={CheckCircle2} color="text-teal-600" bg="bg-teal-50" />
                <StatCard label="Limited Hospitals" value={stats.statusCounts.LIMITED} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" />
                <StatCard label="Full Hospitals" value={stats.statusCounts.FULL} icon={XCircle} color="text-emergency-600" bg="bg-emergency-50" />
              </div>

              {/* ICU CAPACITY */}
              <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-3">
                ICU Capacity
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard label="Total ICU Beds" value={stats.totalBeds} icon={BedDouble} color="text-navy-600" bg="bg-navy-50" />
                <StatCard label="Available ICU Beds" value={stats.availableBeds} icon={BedDouble} color="text-teal-600" bg="bg-teal-50" />
                <StatCard label="Occupied ICU Beds" value={stats.occupiedBeds} icon={BedDouble} color="text-amber-600" bg="bg-amber-50" />
                <StatCard label="Overall ICU Availability" value={`${stats.overallAvailabilityPct}%`} icon={Activity} color="text-medical-600" bg="bg-medical-50" />
              </div>
              <div className="bg-white border border-navy-100 rounded-xl p-4 shadow-sm mb-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-navy-700">
                    Network ICU Availability
                  </span>
                  <span className="text-xs text-navy-500">
                    {stats.availableBeds} of {stats.totalBeds} ICU beds reported available
                  </span>
                </div>
                <div className="w-full bg-navy-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      stats.overallAvailabilityPct > 30
                        ? "bg-teal-500"
                        : stats.overallAvailabilityPct > 0
                        ? "bg-amber-500"
                        : "bg-emergency-500"
                    }`}
                    style={{ width: `${stats.overallAvailabilityPct}%` }}
                  ></div>
                </div>
              </div>

              {/* VENTILATOR CAPACITY */}
              <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-3">
                Ventilator Capacity
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Ventilators" value={stats.totalVentilators} icon={Wind} color="text-navy-600" bg="bg-navy-50" />
                <StatCard label="Available Ventilators" value={stats.availableVentilators} icon={Wind} color="text-teal-600" bg="bg-teal-50" />
                <StatCard label="Ventilators In Use" value={stats.ventilatorsInUse} icon={Wind} color="text-amber-600" bg="bg-amber-50" />
              </div>

              {/* NETWORK STATUS */}
              <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm mb-8">
                <h3 className="font-bold text-navy-900 mb-1">Network Status</h3>
                <p className="text-xs text-navy-400 mb-4">
                  Current reported status of all {stats.totalHospitals} hospitals.
                </p>
                {[
                  {
                    key: "AVAILABLE",
                    count: stats.statusCounts.AVAILABLE,
                    icon: CheckCircle2,
                    iconColor: "text-teal-600",
                    barColor: "bg-teal-500",
                    desc: "More than 30% of ICU beds available",
                  },
                  {
                    key: "LIMITED",
                    count: stats.statusCounts.LIMITED,
                    icon: AlertTriangle,
                    iconColor: "text-amber-600",
                    barColor: "bg-amber-500",
                    desc: "ICU beds available, but 30% or less",
                  },
                  {
                    key: "FULL",
                    count: stats.statusCounts.FULL,
                    icon: XCircle,
                    iconColor: "text-emergency-600",
                    barColor: "bg-emergency-500",
                    desc: "No ICU beds currently available",
                  },
                ].map((row) => {
                  const pct =
                    stats.totalHospitals > 0
                      ? Math.round((row.count / stats.totalHospitals) * 100)
                      : 0;
                  return (
                    <div key={row.key} className="py-3 border-b border-navy-50 last:border-b-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="flex items-center gap-2 text-sm font-bold text-navy-900">
                          <row.icon className={`w-4 h-4 ${row.iconColor}`} />
                          {row.key} — {row.count} Hospital{row.count === 1 ? "" : "s"}
                        </span>
                        <span className="text-xs text-navy-400">{pct}% of network</span>
                      </div>
                      <div className="w-full bg-navy-100 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${row.barColor} transition-all`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-navy-400 mt-1">{row.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* QUICK NETWORK INSIGHTS — derived from live data (Step 9 Part 5);
                  reuses stats + centralized attention/freshness utilities */}
              <NetworkInsights hospitals={hospitals} stats={stats} />

              {/* RECENT ACTIVITY — real recorded updates only (Step 9 Part 4);
                  refreshes silently when live hospital data changes */}
              <RecentActivity limit={5} refreshKey={hospitals} />

              {/* Hospitals by Area (live) */}
              <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-navy-900 mb-4">Hospitals by Area</h3>
                {Object.entries(areaDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([area, count]) => (
                    <div key={area} className="flex items-center gap-3 mb-3">
                      <span className="w-28 text-sm text-navy-600 truncate">{area}</span>
                      <div className="flex-1 bg-navy-100 rounded-full h-4">
                        <div className="h-4 rounded-full bg-medical-400 transition-all"
                          style={{ width: `${stats.totalHospitals > 0 ? (count / stats.totalHospitals) * 100 : 0}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-navy-800 w-8 text-right">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Hospital Monitoring (Step 9 Part 2) — live, read-only; keeps
          the Step 6 verification actions ── */}
      {activeTab === "hospitals" && (
        <div>
          {status === "loading" && <NetworkLoadingState />}

          {status === "error" && (
            <NetworkErrorState message={error} onRetry={reload} />
          )}

          {status === "ready" && (
            <HospitalMonitoring
              hospitals={hospitals}
              statuses={hospitalStatuses}
              onSetHospitalStatus={setHospitalStatus}
            />
          )}
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === "users" && (
        <div className="bg-white border border-navy-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-50 border-b border-navy-100">
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">Last Active</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u) => (
                  <tr key={u.id} className="border-b border-navy-50 hover:bg-navy-50/50">
                    <td className="px-5 py-3 font-medium text-navy-900">{u.name}</td>
                    <td className="px-5 py-3 text-navy-500">{u.email}</td>
                    <td className="px-5 py-3"><StatusBadge status={u.role} /></td>
                    <td className="px-5 py-3"><StatusBadge status={userStatuses[u.id]} /></td>
                    <td className="px-5 py-3 text-navy-500">{u.lastActive}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {userStatuses[u.id] === "SUSPENDED" ? (
                          <button onClick={() => setUserStatus(u.id, "ACTIVE")}
                            className="text-xs font-medium text-teal-600 hover:text-teal-700 px-2 py-1 rounded bg-teal-50 hover:bg-teal-100">
                            Activate
                          </button>
                        ) : (
                          <button onClick={() => setUserStatus(u.id, "SUSPENDED")}
                            className="text-xs font-medium text-emergency-600 hover:text-emergency-700 px-2 py-1 rounded bg-emergency-50 hover:bg-emergency-100">
                            Suspend
                          </button>
                        )}
                        <button className="text-xs font-medium text-navy-600 hover:text-navy-700 px-2 py-1 rounded bg-navy-50 hover:bg-navy-100">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Total Searches Today", value: 342, change: "+12%" },
            { label: "Hospitals Updated Today", value: 9, change: "+3" },
            { label: "Avg. Response Time", value: "4.2 min", change: "-18%" },
            { label: "Active Sessions", value: 47, change: "+8" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-navy-500 mb-2">{stat.label}</p>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-navy-900">{stat.value}</p>
                <span className="text-sm text-teal-600 font-medium mb-1">{stat.change}</span>
              </div>
            </div>
          ))}

          {/* Verified vs Pending visual */}
          <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm md:col-span-2">
            <h3 className="font-bold text-navy-900 mb-4">Hospital Verification Status</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex h-8 rounded-lg overflow-hidden">
                  <div className="bg-teal-500 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${hospitals.length > 0 ? (verifiedCount / hospitals.length) * 100 : 0}%` }}>
                    {verifiedCount > 0 && `${verifiedCount}`}
                  </div>
                  <div className="bg-amber-400 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${hospitals.length > 0 ? (pendingCount / hospitals.length) * 100 : 0}%` }}>
                    {pendingCount > 0 && `${pendingCount}`}
                  </div>
                  <div className="bg-emergency-400 flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${hospitals.length > 0 ? (rejectedCount / hospitals.length) * 100 : 0}%` }}>
                    {rejectedCount > 0 && `${rejectedCount}`}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-500 rounded-sm"></span> Verified ({verifiedCount})</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded-sm"></span> Pending ({pendingCount})</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emergency-400 rounded-sm"></span> Rejected ({rejectedCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Activity — REAL recorded availability updates (Step 9 Part 4) ── */}
      {activeTab === "activity" && <RecentActivity refreshKey={hospitals} />}
    </div>
  );
}

// ── Loading state — shown instead of aggregates while the hospital data
// layer loads, so misleading zero values are never displayed ──
function NetworkLoadingState() {
  return (
    <div className="bg-white border border-navy-100 rounded-xl p-16 shadow-sm flex flex-col items-center text-center">
      <Loader2 className="w-9 h-9 text-medical-500 animate-spin mb-4" />
      <p className="text-sm font-bold text-navy-800">
        Loading network availability...
      </p>
      <p className="text-xs text-navy-400 mt-1">
        Reading the latest reported hospital data.
      </p>
    </div>
  );
}

// ── Error state with retry — never leaves the dashboard blank ──
function NetworkErrorState({ message, onRetry }) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="bg-white border border-emergency-200 rounded-xl p-16 shadow-sm flex flex-col items-center text-center">
      <AlertTriangle className="w-10 h-10 text-emergency-500 mb-4" />
      <p className="text-sm font-bold text-navy-900 mb-1">
        Unable to load network availability. Please try again.
      </p>
      {message && <p className="text-xs text-navy-400 mb-5">{message}</p>}
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        {retrying ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {retrying ? "Retrying..." : "Try Again"}
      </button>
    </div>
  );
}
