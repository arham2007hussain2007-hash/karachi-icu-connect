import { HeartPulse, Phone, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-y border-amber-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>IMPORTANT:</strong> Availability is based on the latest
            information provided by participating hospitals. Please call the
            hospital to confirm availability before traveling.{" "}
            <span className="font-semibold text-amber-600">
              — DEMO DATA
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse className="w-6 h-6 text-emergency-400" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm text-white">
                  KARACHI ICU
                </span>
                <span className="text-[10px] tracking-widest text-medical-300">
                  CONNECT
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Find ICU availability faster. Save critical time in emergencies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="hover:text-white no-underline text-navy-300">
                  Find ICU
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-white no-underline text-navy-300">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white no-underline text-navy-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white no-underline text-navy-300">
                  Impact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white no-underline text-navy-300">
                  Hospital Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              Emergency
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emergency-400" />
                <span>Rescue 1122: 1122</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emergency-400" />
                <span>Edhi: 115</span>
              </div>
              <p className="text-xs text-navy-400 mt-2">
                In a life-threatening emergency, always call emergency services
                first.
              </p>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              Platform Status
            </h4>
            <div className="inline-flex items-center gap-2 bg-navy-900 px-3 py-1.5 rounded-md text-xs">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span>DEMO MODE — Mock Data</span>
            </div>
            <p className="text-xs text-navy-400 mt-3 leading-relaxed">
              This platform is in development. Data shown is for demonstration
              purposes only and does not represent real-time availability.
            </p>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-8 pt-6 text-center text-xs text-navy-500">
          <p>
            &copy; {new Date().getFullYear()} Karachi ICU Connect. Built for
            emergency response. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
