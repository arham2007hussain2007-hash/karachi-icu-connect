import { getAvailabilityStatus, getStatusColor } from "../utils/availability";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const statusIcons = {
  AVAILABLE: CheckCircle2,
  LIMITED: AlertTriangle,
  FULL: XCircle,
};

export default function AvailabilityBadge({ hospital }) {
  const status = getAvailabilityStatus(hospital);
  const colors = getStatusColor(status);
  const Icon = statusIcons[status] || XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
