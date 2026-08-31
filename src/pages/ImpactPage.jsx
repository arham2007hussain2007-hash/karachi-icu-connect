// ── Impact Page (Step 10 Part 3) ──
// The presentation centerpiece: the full Problem → Solution → Impact
// story, the Before/After comparison, the How It Connects ecosystem,
// Live Demo Facts, and the Impact Statements — all in one page.

import SectionTitle from "../components/SectionTitle";
import ImpactStorytelling from "../components/ImpactStorytelling";
import LiveDemoFacts from "../components/LiveDemoFacts";

export default function ImpactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SectionTitle
        title="Impact & Why It Matters"
        subtitle="The problem, the solution, the system, and the potential impact — presented honestly."
        center
      />

      <ImpactStorytelling variant="full" />

      <div className="mt-10">
        <LiveDemoFacts />
      </div>

      <p className="text-xs text-navy-400 mt-8 text-center max-w-2xl mx-auto leading-relaxed">
        Karachi ICU Connect is a decision-support platform designed to help
        during critical moments. It does not replace direct communication with
        hospitals or emergency services, and it does not make autonomous
        medical decisions. Availability should always be confirmed directly
        with the hospital before traveling.
      </p>
    </div>
  );
}
