import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Hero from "../components/Hero";
import SearchPanel from "../components/SearchPanel";
import StatsBar from "../components/StatsBar";
import HospitalList from "../components/HospitalList";
import HospitalCard from "../components/HospitalCard";
import SectionTitle from "../components/SectionTitle";
import ImpactStorytelling from "../components/ImpactStorytelling";
import LiveDemoFacts from "../components/LiveDemoFacts";
import { getFeaturedHospitals } from "../data/hospitals";
import { useHospitals } from "../context/HospitalDataContext";
import { filterHospitals, getAvailabilityStatus } from "../utils/availability";
import {
  Siren,
  Search,
  BarChart3,
  Sparkles,
  Phone,
  RefreshCw,
  ArrowDown,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Wand2,
} from "lucide-react";

const howItWorksSteps = [
  { num: "01", icon: Siren, title: "Emergency", desc: "Need an ICU bed urgently" },
  { num: "02", icon: Search, title: "Search", desc: "Search by area, ICU type, or requirement" },
  { num: "03", icon: BarChart3, title: "View Results", desc: "Compare hospitals and reported availability" },
  { num: "04", icon: Sparkles, title: "Smart Match", desc: "Ranked ICU options with clear reasons" },
  { num: "05", icon: Phone, title: "Call Hospital", desc: "Call and confirm availability" },
  { num: "06", icon: RefreshCw, title: "Hospital Updates", desc: "Hospital staff update availability" },
];

const userRoles = [
  {
    icon: User,
    title: "Public User",
    desc: "Search ICU beds, view hospitals, call and get directions.",
    color: "text-medical-500",
    bg: "bg-medical-50",
    border: "border-medical-200",
  },
  {
    icon: Building2,
    title: "Hospital Staff",
    desc: "Update availability and manage hospital information.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    icon: ShieldCheck,
    title: "Admin",
    desc: "Verify hospitals, manage users, and monitor the platform.",
    color: "text-navy-600",
    bg: "bg-navy-50",
    border: "border-navy-200",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { hospitals } = useHospitals();
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const featured = getFeaturedHospitals(6, hospitals);

  const handleSearch = (filters) => {
    const results = filterHospitals(hospitals, filters);
    setFilteredHospitals(results);
  };

  const handleClearFilters = () => {
    setFilteredHospitals(hospitals);
  };

  return (
    <div>
      {/* Hero */}
      <Hero />

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <SearchPanel
          onSearch={handleSearch}
          resultCount={filteredHospitals.length}
        />
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <StatsBar />
      </section>

      {/* Featured Hospitals — highest availability */}
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-navy-900">
              ICU Availability Near You
            </h2>
            <p className="text-navy-500 text-sm mt-1">
              Hospitals with the highest reported available ICU beds.
            </p>
          </div>
          <Link
            to="/hospitals"
            className="text-medical-500 hover:text-medical-600 text-sm font-semibold flex items-center gap-1 mt-2 sm:mt-0 no-underline"
          >
            View All Hospitals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </section>

      {/* Full Search Results (filtered) */}
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <HospitalList
          hospitals={filteredHospitals}
          title="All Hospitals with ICU Availability"
          subtitle="Check reported availability and contact the hospital before traveling."
          onClearFilters={handleClearFilters}
        />
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle
          title="How Karachi ICU Connect Works"
          subtitle="A streamlined process to find ICU availability during emergencies."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, index) => (
            <div key={step.num} className="relative">
              <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-navy-100">
                    {step.num}
                  </span>
                  <div className="bg-medical-50 p-2.5 rounded-lg">
                    <step.icon className="w-5 h-5 text-medical-600" />
                  </div>
                </div>
                <h3 className="font-bold text-navy-900 text-lg mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-navy-500">{step.desc}</p>
              </div>
              {index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 text-navy-200">
                  <ArrowDown className="w-5 h-5 rotate-[-90deg]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why It Matters — compact impact storytelling (Step 10 Part 3) */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle
          title="Why It Matters"
          subtitle="The problem, the solution, and the potential impact — presented honestly."
          center
        />
        <ImpactStorytelling variant="compact" />
        <div className="mt-10">
          <LiveDemoFacts />
        </div>
        <div className="text-center mt-8">
          <Link
            to="/impact"
            className="inline-flex items-center gap-2 text-medical-500 hover:text-medical-600 font-bold text-sm no-underline"
          >
            See the full impact story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* User Roles */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle
          title="Who Is This For?"
          subtitle="Karachi ICU Connect serves three key user groups."
          center
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userRoles.map((role) => (
            <div
              key={role.title}
              className={`bg-white border ${role.border} rounded-xl p-6 text-center shadow-sm`}
            >
              <div
                className={`${role.bg} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <role.icon className={`w-7 h-7 ${role.color}`} />
              </div>
              <h3 className="font-bold text-navy-900 text-lg mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-navy-500">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <SectionTitle
          title="Find Hospitals Across Karachi"
          subtitle="Explore ICU hospitals by location."
          center
        />
        <div className="bg-white border border-navy-200 rounded-xl p-6 shadow-sm">
          {/* Compact mini-map preview */}
          <div className="relative h-64 bg-[#f0f4f2] rounded-lg overflow-hidden mb-5 border border-navy-100">
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <pattern id="hmapgrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dde4df" strokeWidth="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hmapgrid)" />
            </svg>
            {/* Sample markers */}
            {featured.slice(0, 6).map((h, i) => {
              const status = getAvailabilityStatus(h);
              const color = status === "AVAILABLE" ? "bg-teal-500" : status === "LIMITED" ? "bg-amber-500" : "bg-emergency-500";
              const positions = [
                { top: "20%", left: "15%" },
                { top: "35%", left: "40%" },
                { top: "50%", left: "65%" },
                { top: "25%", left: "75%" },
                { top: "60%", left: "25%" },
                { top: "70%", left: "55%" },
              ];
              const pos = positions[i % positions.length];
              return (
                <div
                  key={h.id}
                  className={`absolute w-5 h-5 ${color} rounded-full border-2 border-white shadow-md flex items-center justify-center`}
                  style={{ top: pos.top, left: pos.left }}
                  title={h.name}
                >
                  <span className="text-white text-[8px] font-bold">+</span>
                </div>
              );
            })}
            <div className="absolute top-3 left-3 text-xs font-bold text-navy-400">KARACHI</div>
          </div>
          <div className="text-center">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors no-underline"
            >
              <MapPin className="w-4 h-4" />
              Explore Map
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Match CTA */}
      <section className="mt-20 bg-gradient-to-br from-medical-600 to-medical-800 rounded-2xl mx-4 md:mx-auto max-w-7xl overflow-hidden">
        <div className="px-8 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            SMART RECOMMENDATION
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Not Sure Where to Start?
          </h2>
          <p className="text-medical-100 mb-8 max-w-lg mx-auto">
            Tell us what you need and find the best matching ICU options across Karachi hospitals.
          </p>
          <button
            onClick={() => navigate("/recommend")}
            className="inline-flex items-center gap-2 bg-white hover:bg-medical-50 text-medical-700 font-bold px-8 py-3.5 rounded-lg text-base transition-colors shadow-lg"
          >
            <Wand2 className="w-5 h-5" />
            Smart ICU Match
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Need an ICU Bed Right Now?
          </h2>
          <p className="text-navy-300 mb-8 max-w-lg mx-auto">
            Search available ICU beds across Karachi hospitals and call
            directly to confirm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/search")}
              className="flex items-center justify-center gap-2 bg-emergency-500 hover:bg-emergency-600 text-white font-bold px-8 py-3.5 rounded-lg text-base transition-colors"
            >
              <Search className="w-5 h-5" />
              Emergency ICU Search
            </button>
            <button
              onClick={() => navigate("/hospitals")}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-colors"
            >
              Browse All Hospitals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
