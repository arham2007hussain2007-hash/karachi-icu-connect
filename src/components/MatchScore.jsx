export default function MatchScore({ score, label = "MATCH" }) {
  const pct = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 75
      ? "text-teal-500"
      : pct >= 50
      ? "text-amber-500"
      : "text-navy-400";
  const bgColor =
    pct >= 75
      ? "bg-teal-50"
      : pct >= 50
      ? "bg-amber-50"
      : "bg-navy-50";

  return (
    <div className={`flex flex-col items-center ${bgColor} rounded-xl px-4 py-3`}>
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${pct}% match`}>
        <circle cx="36" cy="36" r="28" fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle
          cx="36"
          cy="36"
          r="28"
          fill="none"
          className={color}
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          className="text-sm font-bold fill-navy-800"
          style={{ fontFamily: "system-ui" }}
        >
          {pct}%
        </text>
      </svg>
      <span className="text-[10px] font-semibold text-navy-500 mt-1">{label}</span>
    </div>
  );
}
