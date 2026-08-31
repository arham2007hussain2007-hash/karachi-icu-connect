import { Link } from "react-router-dom";
import {
  SearchX,
  Hospital,
  Phone,
  Navigation,
  BedDouble,
  MapPin,
  Map as MapIcon,
  ArrowRight,
  MapPinOff,
  Wind,
  List,
} from "lucide-react";
import RecommendationCard from "./RecommendationCard";
import AvailabilityBadge from "./AvailabilityBadge";
import { formatLastUpdated } from "../utils/availability";

// ── Compact row for FULL hospitals (spec §16: keep them callable) ──
function UnavailableHospitalRow({ item }) {
  const h = item.hospital;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`;
  return (
    <div className="flex flex-wrap items-center gap-3 py-3 border-b border-navy-50 last:border-b-0">
      <div className="flex-1 min-w-[180px]">
        <Link
          to={`/hospital/${h.id}`}
          className="text-sm font-semibold text-navy-900 hover:text-medical-600 no-underline"
        >
          {h.name}
        </Link>
        <p className="text-xs text-navy-400 flex flex-wrap items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" />
          {h.area} · 0/{h.totalICUBeds} beds · Updated{" "}
          {formatLastUpdated(h.lastUpdated)}
        </p>
      </div>
      <AvailabilityBadge hospital={h} />
      <a
        href={`tel:${h.phone}`}
        className="flex items-center gap-1 bg-emergency-50 hover:bg-emergency-100 text-emergency-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors no-underline"
      >
        <Phone className="w-3.5 h-3.5" />
        Call
      </a>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 bg-navy-100 hover:bg-navy-200 text-navy-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors no-underline"
      >
        <Navigation className="w-3.5 h-3.5" />
        Directions
      </a>
    </div>
  );
}

// ── Section heading ──
function SectionHeading({ icon: Icon, title, desc, count }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold text-navy-900 mb-1 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-medical-500" />}
        {title}
        {typeof count === "number" && (
          <span className="text-sm font-semibold text-navy-400">({count})</span>
        )}
      </h3>
      {desc && <p className="text-sm text-navy-500">{desc}</p>}
    </div>
  );
}

/**
 * Categorized Smart Match results:
 *   Best Match → Strong Alternatives → Other Options → Currently Unavailable
 * Plus dedicated "all full" and "no strong match" states.
 */
export default function RecommendationResults({
  results,
  prefs,
  comparedIds,
  onToggleCompare,
  onRelaxArea,
  onRelaxVentilator,
}) {
  const { best, strongAlternatives, otherOptions, unavailable, allFull, noStrongMatch } =
    results;

  // ── Every hospital is FULL (spec §16) ──
  if (allFull) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-emergency-200 rounded-xl p-8 text-center">
          <BedDouble className="w-12 h-12 text-emergency-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-navy-900 mb-2">
            No currently available ICU beds found in the demo dataset.
          </h3>
          <p className="text-sm text-navy-500 mb-2 max-w-md mx-auto">
            Every hospital in the demo data is currently FULL. Call hospitals
            directly to ask about waitlists, transfers, or returning capacity.
          </p>
          <Link
            to="/hospitals"
            className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors no-underline"
          >
            <List className="w-4 h-4" />
            View All Hospitals
          </Link>
        </div>

        <div className="bg-white border border-navy-100 rounded-xl px-5 shadow-sm">
          <SectionHeading
            icon={Hospital}
            title="Full Hospitals"
            desc="Currently FULL — shown for direct contact."
            count={unavailable.length}
          />
          {unavailable.map((item) => (
            <UnavailableHospitalRow key={item.hospital.id} item={item} />
          ))}
        </div>
      </div>
    );
  }

  // ── No strong match (spec §15) ──
  if (noStrongMatch) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-navy-200 rounded-xl p-8 text-center">
          <SearchX className="w-12 h-12 text-navy-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-navy-900 mb-2">
            No strong ICU match found
          </h3>
          <p className="text-sm text-navy-500 mb-5 max-w-md mx-auto">
            We checked {results.totalCount} hospitals — none with available
            beds meets all of your requirements at once. The options below
            have beds but miss at least one requirement. Check their reasons
            and call to confirm.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {prefs.area && prefs.area !== "Any Area" && (
              <button
                onClick={onRelaxArea}
                className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <MapPinOff className="w-4 h-4" />
                Remove Area Preference
              </button>
            )}
            {prefs.ventilator === "Yes" && (
              <button
                onClick={onRelaxVentilator}
                className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <Wind className="w-4 h-4" />
                Search Without Ventilator
              </button>
            )}
            <Link
              to="/hospitals"
              className="inline-flex items-center gap-2 bg-navy-100 hover:bg-navy-200 text-navy-800 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors no-underline"
            >
              <List className="w-4 h-4" />
              View All Hospitals
            </Link>
          </div>
        </div>

        {/* Hospitals with some availability */}
        {otherOptions.length > 0 && (
          <div>
            <SectionHeading
              icon={Hospital}
              title="Hospitals With Some Availability"
              desc="Available beds, but with limitations — read the reasons before traveling."
              count={otherOptions.length}
            />
            <div className="space-y-4">
              {otherOptions.map((item) => (
                <RecommendationCard
                  key={item.hospital.id}
                  item={item}
                  variant="other"
                  isCompared={comparedIds.includes(item.hospital.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>
          </div>
        )}

        {/* Full hospitals remain reachable */}
        {unavailable.length > 0 && (
          <div className="bg-white border border-navy-100 rounded-xl px-5 shadow-sm">
            <SectionHeading
              icon={BedDouble}
              title="Currently Unavailable"
              desc="No available ICU beds right now — shown for direct contact."
              count={unavailable.length}
            />
            {unavailable.map((item) => (
              <UnavailableHospitalRow key={item.hospital.id} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Normal categorized results ──
  return (
    <div className="space-y-8">
      {/* Best Match */}
      {best && (
        <div>
          <SectionHeading
            icon={Hospital}
            title="Best Match"
            desc="The strongest option for your requirements — call to confirm before traveling."
          />
          <RecommendationCard
            item={best}
            variant="best"
            isCompared={comparedIds.includes(best.hospital.id)}
            onToggleCompare={onToggleCompare}
          />
        </div>
      )}

      {/* Strong Alternatives */}
      {strongAlternatives.length > 0 && (
        <div>
          <SectionHeading
            icon={ArrowRight}
            title="Strong Alternatives"
            desc="Also well suited — compare before you decide."
            count={strongAlternatives.length}
          />
          <div className="space-y-4">
            {strongAlternatives.map((item) => (
              <RecommendationCard
                key={item.hospital.id}
                item={item}
                variant="strong"
                isCompared={comparedIds.includes(item.hospital.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Options */}
      {otherOptions.length > 0 && (
        <div>
          <SectionHeading
            icon={List}
            title="Other Options"
            desc="May be usable, but have limitations — check the warnings on each card."
            count={otherOptions.length}
          />
          <div className="space-y-4">
            {otherOptions.map((item) => (
              <RecommendationCard
                key={item.hospital.id}
                item={item}
                variant="other"
                isCompared={comparedIds.includes(item.hospital.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Currently Unavailable */}
      {unavailable.length > 0 && (
        <div className="bg-white border border-navy-100 rounded-xl px-5 shadow-sm">
          <SectionHeading
            icon={BedDouble}
            title="Currently Unavailable"
            desc="No available ICU beds right now — shown for direct contact."
            count={unavailable.length}
          />
          {unavailable.map((item) => (
            <UnavailableHospitalRow key={item.hospital.id} item={item} />
          ))}
        </div>
      )}

      {/* Map shortcut */}
      <div className="flex justify-center">
        <Link
          to="/map"
          className="inline-flex items-center gap-2 text-sm font-semibold text-medical-600 hover:text-medical-700 no-underline"
        >
          <MapIcon className="w-4 h-4" />
          View all matches on the map
        </Link>
      </div>
    </div>
  );
}
