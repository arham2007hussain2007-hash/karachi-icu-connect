import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";

export default function MapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-teal-500 ring-2 ring-teal-100"></span>
        <CheckCircle2 className="w-3 h-3 text-teal-600" />
        <span className="text-navy-700 font-medium">Available</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-100"></span>
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        <span className="text-navy-700 font-medium">Limited</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-emergency-500 ring-2 ring-emergency-100"></span>
        <XCircle className="w-3 h-3 text-emergency-600" />
        <span className="text-navy-700 font-medium">Full</span>
      </span>
      <span className="flex items-center gap-1.5 ml-2 border-l border-navy-200 pl-4">
        <ShieldCheck className="w-3.5 h-3.5 text-medical-500" />
        <span className="text-navy-700 font-medium">Verified</span>
      </span>
    </div>
  );
}
