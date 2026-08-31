import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BedDouble,
  Wind,
  Activity,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Save,
  AlertTriangle,
  XCircle,
  Building2,
  Loader2,
  RotateCcw,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  StatCard,
  SectionHeader,
  DashboardHeader,
} from "../components/DashboardUI";
import {
  getMockUpdateHistory,
  getAvailabilityStatus,
  getAvailabilityPercentage,
  getStatusColor,
  formatLastUpdated,
} from "../utils/availability";
import { useAuth } from "../context/AuthContext";
import { useHospitals } from "../context/HospitalDataContext";
import { useDemoMode } from "../context/DemoModeContext";

// ── Availability form field definitions ─────────────────────
// Occupied beds/ventilators are NEVER editable — always calculated
// as total − available.
const AVAILABILITY_FIELDS = [
  {
    key: "availableICUBeds",
    label: "Available ICU Beds",
    pairedTotal: "totalICUBeds",
    pairError: "Available beds cannot exceed total beds.",
  },
  { key: "totalICUBeds", label: "Total ICU Beds" },
  {
    key: "availableVentilators",
    label: "Available Ventilators",
    pairedTotal: "totalVentilators",
    pairError: "Available ventilators cannot exceed total ventilators.",
  },
  { key: "totalVentilators", label: "Total Ventilators" },
];

const statusIcons = {
  AVAILABLE: CheckCircle2,
  LIMITED: AlertTriangle,
  FULL: XCircle,
};

function StatusChip({ status }) {
  const colors = getStatusColor(status);
  const Icon = statusIcons[status] || XCircle;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

export default function HospitalDashboardPage() {
  const { user } = useAuth();
  const { hospitals, updateAvailability } = useHospitals();
  const { reportDemoEvent } = useDemoMode();

  // The hospital comes from the authenticated staff account — never selectable.
  const hospital = hospitals.find((h) => h.id === user?.hospitalId);

  // ── Availability form state (strings for controlled number inputs) ──
  const [form, setForm] = useState(() => ({
    totalICUBeds: hospital ? String(hospital.totalICUBeds) : "",
    availableICUBeds: hospital ? String(hospital.availableICUBeds) : "",
    totalVentilators: hospital ? String(hospital.totalVentilators) : "",
    availableVentilators: hospital ? String(hospital.availableVentilators) : "",
  }));
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  // ── Update history (mock seed + real entries from this session) ──
  const [history, setHistory] = useState(getMockUpdateHistory());

  // ── Hospital profile (simulated editing — not persisted) ──
  const [profile, setProfile] = useState(() => ({
    name: hospital?.name ?? "",
    address: hospital?.address ?? "",
    phone: hospital?.phone ?? "",
    area: hospital?.area ?? "",
    emergencyContact: hospital?.phone ?? "",
    specialties: hospital?.specialties?.join(", ") ?? "",
    icuTypes: hospital?.icuTypes?.join(", ") ?? "",
  }));
  const [profileMsg, setProfileMsg] = useState("");

  // ── Guard: staff account without a valid hospital assignment ──
  if (!hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-emergency-50 border border-emergency-200 rounded-xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-emergency-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-900 mb-2">
            No Hospital Assigned
          </h2>
          <p className="text-sm text-navy-500">
            Your account is not linked to any hospital. Contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  // ── Current availability (live from hospital data) ──
  const status = getAvailabilityStatus(hospital);
  const colors = getStatusColor(status);
  const availabilityPct = getAvailabilityPercentage(hospital);
  const occupiedBeds = hospital.totalICUBeds - hospital.availableICUBeds;
  const occupiedVentilators =
    hospital.totalVentilators - hospital.availableVentilators;

  // ── Validation ──
  const validateField = (key) => {
    const raw = String(form[key] ?? "").trim();
    if (raw === "") return "Please enter a valid number.";
    const num = Number(raw);
    if (!Number.isFinite(num)) return "Please enter a valid number.";
    if (num < 0) return "Cannot be negative.";
    if (!Number.isInteger(num)) return "Must be a whole number.";

    // Cross-field: available cannot exceed its paired total
    const field = AVAILABILITY_FIELDS.find((f) => f.key === key);
    if (field?.pairedTotal) {
      const totalRaw = String(form[field.pairedTotal] ?? "").trim();
      const totalNum = Number(totalRaw);
      if (totalRaw !== "" && Number.isFinite(totalNum) && num > totalNum) {
        return field.pairError;
      }
    }
    return "";
  };

  const validateAll = () => {
    const errs = {};
    AVAILABILITY_FIELDS.forEach(({ key }) => {
      const err = validateField(key);
      if (err) errs[key] = err;
    });
    return errs;
  };

  // Errors shown inline only after a field is touched (or on save attempt)
  const fieldErrors = {};
  AVAILABILITY_FIELDS.forEach(({ key }) => {
    if (touched[key]) {
      const err = validateField(key);
      if (err) fieldErrors[key] = err;
    }
  });

  // ── Draft values for live preview ──
  const draftValues = {};
  let draftValid = true;
  AVAILABILITY_FIELDS.forEach(({ key }) => {
    const raw = String(form[key] ?? "").trim();
    const num = Number(raw);
    if (raw === "" || !Number.isFinite(num)) draftValid = false;
    draftValues[key] = num;
  });
  if (draftValid) {
    if (
      draftValues.availableICUBeds < 0 ||
      draftValues.totalICUBeds < 0 ||
      draftValues.availableVentilators < 0 ||
      draftValues.totalVentilators < 0 ||
      draftValues.availableICUBeds > draftValues.totalICUBeds ||
      draftValues.availableVentilators > draftValues.totalVentilators
    ) {
      draftValid = false;
    }
  }

  const previewStatus = draftValid ? getAvailabilityStatus(draftValues) : null;
  const previewPct = draftValid ? getAvailabilityPercentage(draftValues) : null;

  // ── Unsaved changes detection ──
  const hasUnsavedChanges = AVAILABILITY_FIELDS.some(
    ({ key }) => String(form[key]).trim() !== String(hospital[key])
  );

  // ── Handlers ──
  const handleSave = async () => {
    setTouched({
      totalICUBeds: true,
      availableICUBeds: true,
      totalVentilators: true,
      availableVentilators: true,
    });
    const errs = validateAll();
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setSaveError("");
    setSaveMsg("");
    try {
      const updated = await updateAvailability(hospital.id, {
        totalICUBeds: Number(form.totalICUBeds),
        availableICUBeds: Number(form.availableICUBeds),
        totalVentilators: Number(form.totalVentilators),
        availableVentilators: Number(form.availableVentilators),
      });

      // Record the real update in this session's history
      const now = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      setHistory((prev) => [
        {
          id: Date.now(),
          action: "ICU availability updated",
          detail: `${updated.availableICUBeds}/${updated.totalICUBeds} ICU beds · ${updated.availableVentilators}/${updated.totalVentilators} ventilators`,
          time: `Today, ${now}`,
          user: user?.fullName || "Staff",
        },
        ...prev,
      ]);

      setSaveMsg("Availability updated successfully.");
      // Notify the Demo Mode (no-op when demo is off) so scenarios
      // like "Hospital Staff Update" can advance to the next step.
      reportDemoEvent("availability-updated");
      setTimeout(() => setSaveMsg(""), 4000);
    } catch (err) {
      setSaveError(
        err.message || "Failed to update availability. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm({
      totalICUBeds: String(hospital.totalICUBeds),
      availableICUBeds: String(hospital.availableICUBeds),
      totalVentilators: String(hospital.totalVentilators),
      availableVentilators: String(hospital.availableVentilators),
    });
    setTouched({});
    setSaveMsg("");
    setSaveError("");
  };

  const handleSaveProfile = () => {
    setProfileMsg(
      "Profile changes are simulated in this demo and are not persisted."
    );
    setTimeout(() => setProfileMsg(""), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <DashboardHeader
        title="Hospital Staff Portal"
        subtitle={hospital.name}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {hospital.verified && (
          <span className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED HOSPITAL
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 bg-navy-50 border border-navy-200 text-navy-700 text-xs font-bold px-3 py-1 rounded-full">
          STAFF ACCOUNT
        </span>
        <Link
          to={`/hospital/${hospital.id}`}
          className="ml-auto inline-flex items-center gap-1.5 text-sm text-medical-500 hover:text-medical-600 font-medium no-underline"
        >
          <Eye className="w-4 h-4" />
          View public profile
        </Link>
      </div>

      {/* ═══════════════ CURRENT AVAILABILITY ═══════════════ */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-medical-500" />
            Current Availability
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip status={status} />
            <span className="text-xs text-navy-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Last updated: {formatLastUpdated(hospital.lastUpdated)}
            </span>
          </div>
        </div>

        {/* Availability progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-navy-600 font-medium">
              {hospital.availableICUBeds} of {hospital.totalICUBeds} ICU beds
              available
            </span>
            <span className={`font-bold ${colors.text}`}>{availabilityPct}%</span>
          </div>
          <div className="w-full bg-navy-100 rounded-full h-3.5">
            <div
              className={`${colors.progress} h-3.5 rounded-full transition-all`}
              style={{ width: `${availabilityPct}%` }}
            />
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total ICU Beds" value={hospital.totalICUBeds} icon={BedDouble} color="text-medical-500" bg="bg-medical-50" />
          <StatCard label="Available ICU Beds" value={hospital.availableICUBeds} icon={Activity} color="text-teal-600" bg="bg-teal-50" />
          <StatCard label="Occupied ICU Beds" value={occupiedBeds} icon={BedDouble} color="text-emergency-500" bg="bg-emergency-50" />
          <StatCard label="Total Ventilators" value={hospital.totalVentilators} icon={Wind} color="text-navy-600" bg="bg-navy-50" />
          <StatCard label="Available Ventilators" value={hospital.availableVentilators} icon={Wind} color="text-teal-600" bg="bg-teal-50" />
          <StatCard label="In-Use Ventilators" value={occupiedVentilators} icon={Wind} color="text-emergency-500" bg="bg-emergency-50" />
        </div>

        {/* ICU types (read-only) */}
        <div>
          <p className="text-xs text-navy-400 uppercase tracking-wide mb-2">
            ICU Types
          </p>
          <div className="flex flex-wrap gap-2">
            {hospital.icuTypes.map((type) => (
              <span
                key={type}
                className="bg-navy-50 text-navy-700 text-xs px-2.5 py-1 rounded-md font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ UPDATE AVAILABILITY ═══════════════ */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-medical-500" />
            Update Availability
          </h2>
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Unsaved changes
            </span>
          )}
        </div>

        {/* Live preview of the resulting status */}
        <div className="bg-navy-50 border border-navy-100 rounded-lg px-4 py-3 mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {draftValid ? (
            <>
              <span className="text-navy-500">Preview:</span>
              <span className="font-bold text-navy-900">
                {draftValues.availableICUBeds}/{draftValues.totalICUBeds} beds
              </span>
              <span className="text-navy-500">{previewPct}% available</span>
              <span className="text-navy-500">
                {draftValues.totalICUBeds - draftValues.availableICUBeds} occupied
              </span>
              <StatusChip status={previewStatus} />
            </>
          ) : (
            <span className="text-navy-400 text-xs">
              Enter valid values to preview the resulting status.
            </span>
          )}
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {AVAILABILITY_FIELDS.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="block text-sm font-medium text-navy-700 mb-1.5"
              >
                {field.label}
              </label>
              <input
                id={field.key}
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={form[field.key]}
                disabled={saving}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                onBlur={() =>
                  setTouched((t) => ({ ...t, [field.key]: true }))
                }
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 disabled:bg-navy-50 disabled:text-navy-400 ${
                  fieldErrors[field.key]
                    ? "border-emergency-400"
                    : "border-navy-200"
                }`}
              />
              {fieldErrors[field.key] && (
                <p className="text-xs text-emergency-600 mt-1">
                  {fieldErrors[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Feedback */}
        {saveMsg && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-4">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-sm text-teal-700">{saveMsg}</span>
          </div>
        )}
        {saveError && (
          <div className="flex items-start gap-2 bg-emergency-50 border border-emergency-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 text-emergency-500 mt-0.5 shrink-0" />
            <span className="text-sm text-emergency-700">{saveError}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 disabled:bg-medical-300 text-white font-bold py-3 rounded-lg transition-colors text-sm cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "SAVING..." : "SAVE AVAILABILITY"}
          </button>
          {hasUnsavedChanges && !saving && (
            <button
              onClick={handleDiscard}
              className="flex items-center justify-center gap-2 bg-white border border-navy-200 hover:bg-navy-50 text-navy-700 font-semibold px-5 py-3 rounded-lg transition-colors text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Discard Changes
            </button>
          )}
        </div>

        <p className="text-xs text-navy-400 mt-4 text-center">
          Updates are stored locally in this demo — no data is sent to a real
          server. Occupied counts are calculated automatically (total −
          available).
        </p>
      </div>

      {/* ═══════════════ RECENT UPDATES ═══════════════ */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm mb-6">
        <SectionHeader title="Recent Availability Updates" icon={Clock} />
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-navy-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-medical-400 rounded-full mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-navy-800">{item.action}</p>
                {item.detail && (
                  <p className="text-xs text-navy-500">{item.detail}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-navy-400">
                  <span>{item.user}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ HOSPITAL PROFILE ═══════════════ */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
        <SectionHeader title="Hospital Profile" icon={Building2} />
        <p className="text-xs text-navy-400 mb-5">
          Profile editing is simulated in this demo — only availability
          updates are saved locally.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Hospital Name", key: "name" },
            { label: "Address", key: "address" },
            { label: "Phone", key: "phone" },
            { label: "Area", key: "area" },
            { label: "Emergency Contact", key: "emergencyContact" },
            { label: "Specialties (comma-separated)", key: "specialties" },
            { label: "ICU Types (comma-separated)", key: "icuTypes" },
          ].map((field) => (
            <div key={field.key} className={field.key === "address" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                {field.label}
              </label>
              <input
                type="text"
                value={profile[field.key]}
                onChange={(e) =>
                  setProfile({ ...profile, [field.key]: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveProfile}
          className="mt-5 flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          SAVE CHANGES
        </button>

        {profileMsg && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mt-4">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span className="text-sm text-teal-700">{profileMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
