// ── Impact Storytelling (Step 10 Part 3) ──
// Reusable presentation layer: Problem → Solution → Impact, Before/After,
// How It Connects ecosystem, and Impact Statements. Uses careful wording
// ("designed to help", "can support") and never claims medical outcomes,
// guaranteed results, real-time production data, or AI autonomy.

import {
  AlertCircle,
  Sparkles,
  Activity,
  ArrowRight,
  ArrowDown,
  Users,
  Search,
  Phone,
  Hospital,
  BarChart3,
  Database,
  Quote,
} from "lucide-react";

const problemText =
  "In a critical emergency, families may need to contact multiple hospitals while trying to determine where ICU capacity may be available. Information can be difficult to access quickly. Time matters.";

const solutionText =
  "Karachi ICU Connect brings hospital availability information, search, comparison, and decision-support tools into one platform.";

const impactItems = [
  "Find relevant hospital options faster",
  "Compare ICU availability",
  "Check ventilator availability",
  "Explore hospital locations",
  "Contact hospitals quickly",
  "Help hospitals manage availability updates",
  "Give administrators a network-level overview",
];

const beforeSteps = [
  "Emergency",
  "Family contacts hospitals individually",
  "Availability information may be difficult to compare",
  "More time spent searching",
  "Decision process can become stressful",
];

const withSteps = [
  "Emergency",
  "Search hospital options",
  "View availability",
  "Use Smart Match as decision support",
  "Compare hospitals",
  "Contact hospital to confirm",
];

const statements = [
  "Every minute matters in a critical emergency.",
  "Finding information faster can support faster decision-making.",
  "One connected view of hospital capacity.",
  "From hospital updates to public discovery.",
  "Technology should help reduce information friction when time is critical.",
  "Decision support — not autonomous medical decisions.",
];

// ── Problem / Solution / Impact card ──
function PsiCard({ icon: Icon, tone, title, children }) {
  const tones = {
    problem: {
      wrap: "bg-amber-50 border-amber-200",
      icon: "bg-amber-100 text-amber-700",
    },
    solution: {
      wrap: "bg-medical-50 border-medical-200",
      icon: "bg-medical-100 text-medical-700",
    },
    impact: {
      wrap: "bg-teal-50 border-teal-200",
      icon: "bg-teal-100 text-teal-700",
    },
  };
  const t = tones[tone];
  return (
    <div className={`rounded-xl border ${t.wrap} p-5 h-full`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${t.icon} p-2.5 rounded-lg shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-navy-900 text-lg">{title}</h3>
      </div>
      <div className="text-sm text-navy-700 leading-relaxed">{children}</div>
    </div>
  );
}

// ── Before / After flow ──
function FlowList({ steps, tone }) {
  const tones = {
    before: { dot: "bg-amber-400" },
    with: { dot: "bg-teal-500" },
  };
  const t = tones[tone];
  return (
    <ol className="space-y-2.5">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            className={`mt-1.5 w-1.5 h-1.5 rounded-full ${t.dot} shrink-0`}
          />
          <span className="text-sm text-navy-700 leading-relaxed">
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

// ── How It Connects ecosystem (full variant) ──
function HowItConnects() {
  const publicFlow = [
    { icon: Users, label: "Public / Family" },
    { icon: Search, label: "Find & Compare" },
    { icon: Sparkles, label: "Smart Match" },
    { icon: Phone, label: "Contact Hospital" },
  ];
  const sourceFlow = [
    {
      icon: Hospital,
      label: "Hospital Staff",
      wrap: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
    },
    {
      icon: BarChart3,
      label: "Admin Command Center",
      wrap: "bg-navy-50 border-navy-200",
      iconColor: "text-navy-600",
    },
  ];
  return (
    <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-navy-900 mb-2">How It Connects</h3>
      <p className="text-sm text-navy-500 mb-6">
        Availability updates propagate across the demo application, from
        hospital staff to public discovery and admin monitoring — live within
        the demo environment.
      </p>
      <div className="flex flex-col gap-2.5">
        {/* Public layer */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2">
          {publicFlow.map((c, i, arr) => (
            <div key={c.label} className="flex items-center gap-2">
              <div className="bg-medical-50 border border-medical-200 rounded-lg px-3 py-2 flex items-center gap-2 flex-1 sm:flex-none">
                <c.icon className="w-4 h-4 text-medical-600 shrink-0" />
                <span className="text-xs font-bold text-navy-800 whitespace-nowrap">
                  {c.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-navy-300 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Up arrow: data feeds public */}
        <div className="flex flex-col items-center text-medical-500 -my-1">
          <ArrowDown className="w-4 h-4 rotate-180" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center">
            Live availability data feeds public discovery
          </span>
        </div>

        {/* Data hub */}
        <div className="flex justify-center">
          <div className="bg-navy-900 border-2 border-medical-500 rounded-xl px-5 py-3 flex items-center gap-3 shadow-md">
            <Database className="w-5 h-5 text-medical-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">
                Live Availability Data
              </span>
              <span className="text-[10px] text-medical-300 font-semibold">
                within the demo environment
              </span>
            </div>
          </div>
        </div>

        {/* Down arrow: staff update · admin monitor */}
        <div className="flex flex-col items-center text-teal-600 -my-1">
          <ArrowDown className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-center">
            Hospital staff update · Admin monitors
          </span>
        </div>

        {/* Source layer */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2">
          {sourceFlow.map((c) => (
            <div
              key={c.label}
              className={`${c.wrap} border rounded-lg px-3 py-2 flex items-center gap-2 flex-1 sm:flex-none`}
            >
              <c.icon
                className={`w-4 h-4 ${c.iconColor} shrink-0`}
              />
              <span className="text-xs font-bold text-navy-800 whitespace-nowrap">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Impact Statements (full variant) ──
function ImpactStatements() {
  return (
    <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-navy-900 mb-2">
        Why It Matters
      </h3>
      <p className="text-sm text-navy-500 mb-5">
        Designed to help — and grounded in honesty about what a decision-support
        platform can and cannot do.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statements.map((s) => (
          <div
            key={s}
            className="bg-navy-50 border border-navy-100 rounded-lg p-4"
          >
            <Quote className="w-4 h-4 text-medical-500 mb-2" />
            <p className="text-sm text-navy-800 font-semibold leading-relaxed">
              {s}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main reusable component ──
export default function ImpactStorytelling({ variant = "full" }) {
  const isCompact = variant === "compact";
  return (
    <div className="space-y-8">
      {/* Problem / Solution / Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PsiCard icon={AlertCircle} tone="problem" title="The Problem">
          <p>{problemText}</p>
        </PsiCard>
        <PsiCard icon={Sparkles} tone="solution" title="The Solution">
          <p>{solutionText}</p>
        </PsiCard>
        <PsiCard
          icon={Activity}
          tone="impact"
          title="The Impact"
        >
          <p className="mb-2">
            The platform is designed to help people:
          </p>
          <ul className="space-y-1.5">
            {impactItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PsiCard>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-navy-900">Before</h3>
          </div>
          <p className="text-xs text-navy-500 mb-3 leading-relaxed">
            Qualitative experience in a critical moment.
          </p>
          <FlowList steps={beforeSteps} tone="before" />
        </div>
        <div className="bg-white border border-teal-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-teal-100 text-teal-700 p-2 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-navy-900">
              With Karachi ICU Connect
            </h3>
          </div>
          <p className="text-xs text-navy-500 mb-3 leading-relaxed">
            Same moment, with the platform as decision support.
          </p>
          <FlowList steps={withSteps} tone="with" />
        </div>
      </div>

      {/* Full-only sections */}
      {!isCompact && (
        <>
          <HowItConnects />
          <ImpactStatements />
        </>
      )}
    </div>
  );
}
