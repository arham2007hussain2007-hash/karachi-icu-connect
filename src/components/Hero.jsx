import { Link } from "react-router-dom";
import {
  Search,
  Hospital,
  HeartPulse,
  Siren,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useDemoMode } from "../context/DemoModeContext";

export default function Hero() {
  const { startDemo } = useDemoMode();
  return (
    <section className="relative bg-navy-950 overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            {/* Emergency indicator */}
            <div className="inline-flex items-center gap-2 bg-emergency-500/10 border border-emergency-500/30 rounded-full px-4 py-1.5 mb-6">
              <Siren className="w-4 h-4 text-emergency-400" />
              <span className="text-emergency-300 text-xs font-semibold tracking-wide uppercase">
                Emergency ICU Finder
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Find ICU Availability
              <span className="text-medical-400"> Faster.</span>
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-teal-300 mt-2">
              Save Critical Time.
            </p>

            <p className="mt-5 text-navy-300 text-base md:text-lg max-w-xl leading-relaxed">
              Search hospitals across Karachi, check reported ICU availability,
              compare options, and quickly contact the hospital to confirm.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center gap-4 justify-center md:justify-start">
              <Link
                to="/search"
                className="flex items-center gap-2 bg-emergency-500 hover:bg-emergency-600 text-white font-bold px-8 py-3.5 rounded-lg text-base transition-colors shadow-lg shadow-emergency-500/25 no-underline"
              >
                <Search className="w-5 h-5" />
                Find ICU Beds
              </Link>
              <Link
                to="/hospitals"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-lg text-base transition-colors no-underline"
              >
                <Hospital className="w-5 h-5" />
                View Hospitals
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={startDemo}
                className="flex items-center gap-2 bg-transparent hover:bg-medical-500/15 border border-medical-400/50 text-medical-300 hover:text-medical-200 font-semibold px-8 py-3.5 rounded-lg text-base transition-colors cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                Start Guided Demo
              </button>
            </div>
          </div>

          {/* Visual Element */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-52 h-52 rounded-full border-2 border-medical-500/20 animate-ping" style={{ animationDuration: "3s" }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border border-teal-400/20 animate-ping" style={{ animationDuration: "4s" }}></div>
              </div>

              {/* Central icon */}
              <div className="relative w-44 h-44 bg-navy-800/80 border-2 border-medical-500/40 rounded-full flex items-center justify-center">
                <HeartPulse className="w-20 h-20 text-emergency-400" />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-2 -right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ICU
              </div>
              <div className="absolute -bottom-2 -left-4 bg-medical-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                24/7
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
