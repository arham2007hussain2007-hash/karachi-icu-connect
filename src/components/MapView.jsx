import { useRef, useState, useLayoutEffect } from "react";
import {
  getAvailabilityStatus,
  getAvailabilityPercentage,
} from "../utils/availability";

// Karachi bounding box for normalizing coordinates
const BOUNDS = {
  minLat: 24.75,
  maxLat: 25.05,
  minLng: 66.95,
  maxLng: 67.25,
};

function toXY(lat, lng, width, height) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * width;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * height;
  return { x: Math.max(12, Math.min(width - 12, x)), y: Math.max(12, Math.min(height - 12, y)) };
}

const statusMarker = {
  AVAILABLE: { fill: "#27ab83", ring: "#c6f7e2" },
  LIMITED: { fill: "#f59e0b", ring: "#fef3c7" },
  FULL: { fill: "#e53e3e", ring: "#fed7d7" },
};

export default function MapView({
  hospitals,
  selectedId,
  onSelect,
  height = 500,
}) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: height });

  // Measure the container synchronously before the first paint so the
  // SVG does not overflow with its initial 800px state. The
  // ResizeObserver keeps it correct on subsequent resizes.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setDims({ w: el.clientWidth, h: height });
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  const { w, h } = dims;

  // Road-like grid lines for visual texture
  const gridLines = [];
  for (let i = 0; i < 12; i++) {
    const y = (h / 12) * (i + 0.5);
    gridLines.push(
      <line key={`h${i}`} x1={0} y1={y} x2={w} y2={y} stroke="#e2e8f0" strokeWidth={0.5} />
    );
  }
  for (let i = 0; i < 16; i++) {
    const x = (w / 16) * (i + 0.5);
    gridLines.push(
      <line key={`v${i}`} x1={x} y1={0} x2={x} y2={h} stroke="#e2e8f0" strokeWidth={0.5} />
    );
  }

  // "Road" lines to give a map feel
  const roads = [
    // Shahrah-e-Faisal (roughly diagonal)
    { x1: w * 0.15, y1: h * 0.85, x2: w * 0.75, y2: h * 0.15 },
    // University Road
    { x1: w * 0.2, y1: h * 0.3, x2: w * 0.9, y2: h * 0.4 },
    // Coastal
    { x1: w * 0.05, y1: h * 0.95, x2: w * 0.95, y2: h * 0.92 },
  ];

  // Area labels (approximate positions)
  const areaLabels = [
    { label: "Clifton", x: w * 0.2, y: h * 0.78 },
    { label: "DHA", x: w * 0.25, y: h * 0.65 },
    { label: "Saddar", x: w * 0.35, y: h * 0.55 },
    { label: "Nazimabad", x: w * 0.35, y: h * 0.3 },
    { label: "Gulshan", x: w * 0.7, y: h * 0.38 },
    { label: "Korangi", x: w * 0.85, y: h * 0.6 },
    { label: "PECHS", x: w * 0.5, y: h * 0.5 },
    { label: "Stadium Rd", x: w * 0.55, y: h * 0.42 },
  ];

  return (
    <div ref={containerRef} className="w-full relative" role="img" aria-label="Hospital map of Karachi">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="rounded-xl border border-navy-200 bg-[#f0f4f2]"
        style={{ display: "block" }}
      >
        {/* Background texture */}
        <defs>
          <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#dde4df" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width={w} height={h} fill="url(#mapgrid)" />

        {/* Grid lines */}
        {gridLines}

        {/* Major roads */}
        {roads.map((r, i) => (
          <line
            key={`road${i}`}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="#cbd5e0"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={i === 2 ? "8 4" : "none"}
          />
        ))}

        {/* Area labels */}
        {areaLabels.map((a) => (
          <text
            key={a.label}
            x={a.x}
            y={a.y}
            textAnchor="middle"
            className="fill-navy-300 text-[10px] font-medium select-none pointer-events-none"
            style={{ fontFamily: "system-ui" }}
          >
            {a.label}
          </text>
        ))}

        {/* Karachi label */}
        <text x={16} y={24} className="fill-navy-400 text-xs font-bold select-none pointer-events-none" style={{ fontFamily: "system-ui" }}>
          KARACHI
        </text>

        {/* Hospital markers */}
        {hospitals.map((hospital) => {
          const { x, y } = toXY(hospital.latitude, hospital.longitude, w, h);
          const status = getAvailabilityStatus(hospital);
          const colors = statusMarker[status] || statusMarker.FULL;
          const isSelected = selectedId === hospital.id;
          const pct = getAvailabilityPercentage(hospital);

          return (
            <g
              key={hospital.id}
              className="cursor-pointer"
              onClick={() => onSelect(hospital)}
              role="button"
              tabIndex={0}
              aria-label={`${hospital.name} — ${status} — ${hospital.availableICUBeds} beds available`}
              onKeyDown={(e) => { if (e.key === "Enter") onSelect(hospital); }}
            >
              {/* Pulse ring for selected */}
              {isSelected && (
                <>
                  <circle cx={x} cy={y} r={22} fill="none" stroke={colors.fill} strokeWidth={2} opacity={0.3}>
                    <animate attributeName="r" from="14" to="28" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Outer ring */}
              <circle cx={x} cy={y} r={isSelected ? 16 : 13} fill={colors.ring} stroke={colors.fill} strokeWidth={isSelected ? 3 : 2} />

              {/* Inner dot */}
              <circle cx={x} cy={y} r={5} fill={colors.fill} />

              {/* Cross icon inside */}
              <line x1={x - 3} y1={y} x2={x + 3} y2={y} stroke="white" strokeWidth={1.5} strokeLinecap="round" />
              <line x1={x} y1={y - 3} x2={x} y2={y + 3} stroke="white" strokeWidth={1.5} strokeLinecap="round" />

              {/* Label below marker */}
              {isSelected && (
                <g>
                  <rect x={x - 50} y={y + 18} width={100} height={20} rx={4} fill="white" stroke={colors.fill} strokeWidth={1} />
                  <text x={x} y={y + 31} textAnchor="middle" className="text-[9px] font-bold select-none pointer-events-none" style={{ fontFamily: "system-ui", fill: "#102a43" }}>
                    {hospital.availableICUBeds}/{hospital.totalICUBeds} beds · {pct}%
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
