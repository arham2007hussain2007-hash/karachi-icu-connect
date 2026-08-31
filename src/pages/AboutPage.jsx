import {
  HeartPulse,
  Search,
  BarChart3,
  Phone,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <HeartPulse className="w-10 h-10 text-emergency-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
          About Karachi ICU Connect
        </h1>
        <p className="text-navy-500 mt-3 max-w-lg mx-auto">
          An emergency-focused platform to help people locate ICU availability
          across Karachi hospitals.
        </p>
      </div>

      {/* What */}
      <section className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-navy-900 mb-3 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-medical-500" />
          What is Karachi ICU Connect?
        </h2>
        <p className="text-navy-600 leading-relaxed">
          Karachi ICU Connect is a platform designed to help people quickly
          locate hospitals and reported ICU availability in Karachi. During
          medical emergencies, every minute counts — and finding the right
          hospital with available ICU resources can make the difference.
        </p>
        <p className="text-navy-600 leading-relaxed mt-3">
          Our goal is to centralize ICU availability information from
          participating hospitals, making it easier for families, medical
          professionals, and emergency responders to find the right care
          quickly.
        </p>
      </section>

      {/* Why */}
      <section className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-navy-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Why?
        </h2>
        <p className="text-navy-600 leading-relaxed">
          During emergencies, finding appropriate ICU resources can consume
          valuable time. Families may need to call multiple hospitals, travel
          to locations only to find no beds available, or rely on incomplete
          information.
        </p>
        <p className="text-navy-600 leading-relaxed mt-3">
          Karachi ICU Connect aims to reduce this burden by providing a
          centralized search platform where reported ICU availability is
          visible at a glance — helping people make faster, more informed
          decisions.
        </p>
      </section>

      {/* How */}
      <section className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-navy-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          How?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          {[
            { icon: Search, label: "Search", desc: "Find hospitals by area, ICU type, or requirement" },
            { icon: BarChart3, label: "Compare", desc: "View reported availability across hospitals" },
            { icon: Phone, label: "Call", desc: "Contact the hospital directly to confirm" },
            { icon: ShieldCheck, label: "Confirm", desc: "Verify availability before traveling" },
          ].map((step, i) => (
            <div key={step.label} className="text-center">
              <div className="bg-medical-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <step.icon className="w-6 h-6 text-medical-600" />
              </div>
              <p className="font-bold text-navy-900 text-sm">{step.label}</p>
              <p className="text-xs text-navy-500 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-8">
        <h2 className="text-lg font-bold text-amber-800 mb-3">
          Important Disclaimer
        </h2>
        <ul className="space-y-2 text-sm text-amber-700">
          <li>
            Karachi ICU Connect does <strong>not</strong> guarantee hospital
            admission or bed availability.
          </li>
          <li>
            Availability information is based on the latest data provided by
            participating hospitals and may not reflect real-time conditions.
          </li>
          <li>
            Always call the hospital directly to confirm ICU availability
            before traveling.
          </li>
          <li>
            In a life-threatening emergency, call emergency services (Rescue
            1122 / Edhi 115) immediately.
          </li>
          <li>
            This version uses <strong>demonstration data only</strong>. The
            numbers shown do not represent actual hospital availability.
          </li>
        </ul>
      </section>
    </div>
  );
}
