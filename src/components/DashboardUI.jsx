// Shared reusable dashboard components

import { Shield, AlertTriangle } from "lucide-react";

// ── StatCard ──
export function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white border border-navy-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className={`${bg || "bg-navy-50"} p-2.5 rounded-lg`}>
            <Icon className={`w-5 h-5 ${color || "text-navy-500"}`} />
          </div>
        )}
        <span className="text-sm text-navy-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-navy-900">{value}</p>
    </div>
  );
}

// ── StatusBadge ──
const statusConfig = {
  VERIFIED: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", icon: Shield },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertTriangle },
  REJECTED: { bg: "bg-emergency-50", text: "text-emergency-700", border: "border-emergency-200", icon: null },
  ACTIVE: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  SUSPENDED: { bg: "bg-emergency-50", text: "text-emergency-700", border: "border-emergency-200" },
  AVAILABLE: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  LIMITED: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  FULL: { bg: "bg-emergency-50", text: "text-emergency-700", border: "border-emergency-200" },
  PUBLIC: { bg: "bg-medical-50", text: "text-medical-700", border: "border-medical-200" },
  HOSPITAL_STAFF: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  ADMIN: { bg: "bg-navy-50", text: "text-navy-700", border: "border-navy-200" },
};

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {status}
    </span>
  );
}

// ── DashboardHeader ──
export function DashboardHeader({ title, subtitle, badge }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900">{title}</h1>
        {subtitle && <p className="text-navy-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {badge && (
        <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1.5 rounded-full mt-3 md:mt-0">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          {badge}
        </span>
      )}
    </div>
  );
}

// ── SectionHeader ──
export function SectionHeader({ title, icon: Icon, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-medical-500" />}
        {title}
      </h2>
      {action}
    </div>
  );
}

// ── DemoModeBanner ──
export function DemoModeBanner({ message }) {
  return (
    <div className="flex items-start gap-2 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <p className="text-xs text-amber-700">
        <strong>DEMO MODE</strong> —{" "}
        {message ||
          "Changes are currently stored locally and are not connected to a live hospital database."}
      </p>
    </div>
  );
}
