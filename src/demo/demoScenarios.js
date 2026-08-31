// ── Controlled Demo Scenarios (Step 10 Part 4) ──
// Single source of truth for every guided demo scenario. Each scenario
// is a self-contained guided tour that reuses existing real pages and
// features (no fake/duplicate screens). The DemoModeContext reads the
// selected scenario and drives the overlay.
//
// Every step carries:
//   - title, description, recommendedAction { label, route } | null
//   - whyItMatters: the contextual "Why this matters" line (Part 3)
//   - advanceOnRoutes: pathnames (or path prefixes ending in "/") that
//     monotonically advance the step when the user navigates to them.
//
// `events` maps a page-reported event name to a target step number —
// the only way to advance a step that has no matching route (e.g.
// opening the comparison view, completing a staff availability save).
// `completion.demonstrated` is the list shown on the completion card.

import { Siren, Search, Hospital, BarChart3 } from "lucide-react";

export const SCENARIOS = [
  {
    id: "critical-icu",
    title: "Critical ICU Emergency",
    shortLabel: "Critical ICU",
    description:
      "Demonstrate how Smart Match helps prioritize available hospital options based on ICU requirements, ventilator needs, area preference, and emergency priority.",
    icon: Siren,
    focus: [
      "Critical priority",
      "ICU requirement",
      "Ventilator required",
      "Smart Match",
      "Availability prioritization",
      "Contact hospital",
    ],
    steps: [
      {
        title: "Emergency begins",
        description:
          "Someone needs urgent ICU care. Every minute matters. Let's find the strongest available option across the Karachi hospital network.",
        recommendedAction: {
          label: "Start Emergency Journey",
          route: "/search",
        },
        whyItMatters:
          "In critical emergencies, families often need to contact multiple hospitals while trying to determine where ICU capacity may be available. This platform brings that information together in one place.",
        advanceOnRoutes: ["/"],
      },
      {
        title: "Find available ICU",
        description:
          "Search hospitals and filter available ICU capacity across the network.",
        recommendedAction: {
          label: "Search Available ICUs",
          route: "/search",
        },
        whyItMatters:
          "Centralized search and filtering can support faster exploration of available options across the network.",
        advanceOnRoutes: ["/search", "/map"],
      },
      {
        title: "View hospital options",
        description:
          "Compare availability, ICU capacity, ventilators, and hospital information side by side.",
        recommendedAction: {
          label: "View Available Hospitals",
          route: "/hospitals",
        },
        whyItMatters:
          "Reviewing availability, capacity, ventilators, and hospital information together helps put options into context before deciding.",
        advanceOnRoutes: ["/hospitals"],
      },
      {
        title: "Smart Match",
        description:
          "Smart Match analyzes ICU requirements, availability, ventilator needs, preferred area, and emergency priority to help prioritize available options. This is a decision-support tool — always call to confirm before traveling.",
        recommendedAction: {
          label: "Open Smart Match",
          route: "/recommend",
        },
        whyItMatters:
          "Explainable decision support can help prioritize options based on reported availability and requirements. Smart Match is decision support — it does not make autonomous medical decisions.",
        advanceOnRoutes: ["/recommend"],
      },
      {
        title: "Compare and decide",
        description:
          "Review available options side by side before making a decision.",
        recommendedAction: {
          label: "Compare Options",
          route: "/recommend",
        },
        whyItMatters:
          "Side-by-side comparison helps surface the differences that matter before a decision is made.",
        advanceOnRoutes: [],
      },
      {
        title: "Contact the hospital",
        description:
          "Once an appropriate option is identified, contact the hospital immediately to confirm availability. Please call to confirm — Smart Match is decision support, not a booking system.",
        recommendedAction: null,
        whyItMatters:
          "Availability should always be confirmed directly with the hospital before traveling — the platform is decision support, not a booking system.",
        advanceOnRoutes: ["/hospital/"],
      },
    ],
    events: { "compare-opened": 5 },
    completion: {
      demonstrated: [
        "Connected hospital availability workflow",
        "Public discovery tools",
        "Explainable Smart Match",
        "Side-by-side hospital comparison",
        "Direct hospital contact and details",
      ],
    },
  },

  {
    id: "find-compare",
    title: "Find and Compare Options",
    shortLabel: "Find & Compare",
    description:
      "Demonstrate network-wide search, filtering, hospital comparison, and reviewing details before contacting a hospital.",
    icon: Search,
    focus: [
      "Search hospitals",
      "Filter results",
      "Compare multiple hospitals",
      "Review details",
      "Contact hospital",
    ],
    steps: [
      {
        title: "Search and filter the network",
        description:
          "Use the existing search to find hospitals across the network. Apply area, ICU type, ventilator, and availability filters to narrow down options.",
        recommendedAction: {
          label: "Open ICU Search",
          route: "/search",
        },
        whyItMatters:
          "Centralized search across the network can support faster exploration of available options.",
        advanceOnRoutes: ["/search", "/hospitals"],
      },
      {
        title: "Review hospital options",
        description:
          "Browse the hospital list to see availability, ICU capacity, ventilators, and hospital information together.",
        recommendedAction: {
          label: "View Hospitals",
          route: "/hospitals",
        },
        whyItMatters:
          "Reviewing availability, capacity, ventilators, and hospital information together helps put options into context.",
        advanceOnRoutes: ["/hospitals", "/recommend"],
      },
      {
        title: "Open Smart Match and compare",
        description:
          "Use Smart Match to rank options, then add hospitals to compare them side by side.",
        recommendedAction: {
          label: "Open Smart Match",
          route: "/recommend",
        },
        whyItMatters:
          "Explainable ranking plus side-by-side comparison helps surface the differences that matter before deciding.",
        advanceOnRoutes: ["/recommend"],
      },
      {
        title: "Compare and decide",
        description:
          "Open the comparison view to review selected hospitals side by side.",
        recommendedAction: {
          label: "Compare Options",
          route: "/recommend",
        },
        whyItMatters:
          "Side-by-side comparison helps you see the differences at a glance before deciding.",
        advanceOnRoutes: [],
      },
      {
        title: "View hospital details and contact",
        description:
          "Open a hospital to review full details and contact the hospital directly to confirm availability.",
        recommendedAction: null,
        whyItMatters:
          "Availability should always be confirmed directly with the hospital before traveling.",
        advanceOnRoutes: ["/hospital/"],
      },
    ],
    events: { "compare-opened": 4 },
    completion: {
      demonstrated: [
        "Network-wide search and filtering",
        "Hospital list with availability context",
        "Explainable Smart Match ranking",
        "Side-by-side hospital comparison",
        "Direct hospital contact and details",
      ],
    },
  },

  {
    id: "staff-update",
    title: "Hospital Staff Update",
    shortLabel: "Staff Update",
    description:
      "Demonstrate how hospital staff update availability and how those updates propagate through the shared data layer.",
    icon: Hospital,
    focus: [
      "Hospital staff login",
      "Assigned hospital only",
      "Update availability",
      "Validation",
      "Save",
      "Public-side data propagation",
    ],
    steps: [
      {
        title: "Login as Hospital Staff",
        description:
          "Log in with the demo Hospital Staff account. Staff authorization is scoped to the assigned hospital — the system directs staff to their dashboard only.",
        recommendedAction: { label: "Go to Login", route: "/login" },
        whyItMatters:
          "Hospital staff authorization is scoped to the assigned hospital — staff can only manage their own facility.",
        advanceOnRoutes: ["/", "/login"],
      },
      {
        title: "Update availability on your dashboard",
        description:
          "On the assigned hospital dashboard, change ICU or ventilator availability, validate, and save. The form validates available vs. total and updates the timestamp.",
        recommendedAction: null,
        whyItMatters:
          "Validation prevents impossible states (e.g., available > total) and a fresh timestamp is recorded on every successful save.",
        advanceOnRoutes: ["/staff"],
      },
      {
        title: "See the update propagate",
        description:
          "Open the public hospital list or home page to see your update reflected across the shared demo data — availability, capacity, and freshness all update.",
        recommendedAction: {
          label: "View Hospital List",
          route: "/hospitals",
        },
        whyItMatters:
          "Updates flow through the shared data layer, so the public view, Smart Match, and Admin Command Center all reflect the latest reported availability.",
        advanceOnRoutes: ["/hospitals"],
      },
    ],
    events: { "availability-updated": 3 },
    completion: {
      demonstrated: [
        "Role-based hospital staff authentication",
        "Assigned-hospital authorization (scoped access)",
        "Validation of availability values",
        "Live updates propagate across the demo environment",
      ],
    },
  },

  {
    id: "command-center",
    title: "Network Command Center",
    shortLabel: "Command Center",
    description:
      "Tour the Admin Command Center: network capacity, hospital monitoring, attention flags, data freshness, activity, and quick insights. Read-only.",
    icon: BarChart3,
    focus: [
      "Admin login",
      "Network overview",
      "Capacity monitoring",
      "Attention Required",
      "Recent Activity",
      "Quick Network Insights",
    ],
    steps: [
      {
        title: "Login as Admin",
        description:
          "Log in with the demo Admin account to access the Command Center. The platform is read-only for admins.",
        recommendedAction: { label: "Go to Login", route: "/login" },
        whyItMatters:
          "Admin access is gated to authorized roles only, and the Command Center is read-only — admins monitor and oversee, they do not edit hospital data.",
        advanceOnRoutes: ["/", "/login"],
      },
      {
        title: "Network overview & capacity",
        description:
          "The Overview tab shows network-wide hospital counts, ICU capacity, ventilator capacity, and network status — all derived from the live shared data.",
        recommendedAction: null,
        whyItMatters:
          "A single network-level view helps understand capacity across the city rather than hospital by hospital.",
        advanceOnRoutes: ["/admin"],
      },
      {
        title: "Hospital monitoring",
        description:
          "Open the Monitoring tab to see every hospital with filters (availability, area, verification), sorting, and freshness badges — all live.",
        recommendedAction: null,
        whyItMatters:
          "Live filters, sorting, and freshness let admins inspect specific facilities and spot what needs attention.",
        advanceOnRoutes: [],
      },
      {
        title: "Attention Required, Activity & Insights",
        description:
          "Return to the Overview tab to see Attention Required (flagged by live rules), Quick Network Insights (tie-safe highlights), and the Recent Activity feed. The Activity tab shows the full log of recorded updates.",
        recommendedAction: null,
        whyItMatters:
          "Attention rules, tie-safe insights, and the real activity feed make the network state legible at a glance.",
        advanceOnRoutes: [],
      },
    ],
    events: {},
    completion: {
      demonstrated: [
        "Admin-only access control",
        "Read-only Command Center",
        "Live network capacity overview",
        "Hospital monitoring with filters, sorting, and freshness",
        "Attention rules and tie-safe network insights",
        "Real recorded activity feed",
      ],
    },
  },
];
