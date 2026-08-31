import { Hospital, BedDouble, Activity, MapPin, Wind } from "lucide-react";
import { getPlatformStats } from "../data/hospitals";
import { useHospitals } from "../context/HospitalDataContext";

export default function StatsBar() {
  // Live data from context so stats reflect staff availability updates
  const { hospitals } = useHospitals();
  const stats = getPlatformStats(hospitals);

  const statItems = [
    {
      icon: Hospital,
      label: "Hospitals",
      value: `${stats.totalHospitals}+`,
      color: "text-medical-500",
      bg: "bg-medical-50",
    },
    {
      icon: BedDouble,
      label: "Total ICU Beds",
      value: stats.totalBeds.toString(),
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      icon: Activity,
      label: "Available Now",
      value: stats.availableBeds.toString(),
      color: "text-emergency-500",
      bg: "bg-emergency-50",
    },
    {
      icon: Wind,
      label: "Ventilators",
      value: stats.availableVentilators.toString(),
      color: "text-navy-600",
      bg: "bg-navy-50",
    },
    {
      icon: MapPin,
      label: "Areas Covered",
      value: stats.areas.toString(),
      color: "text-medical-700",
      bg: "bg-medical-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-navy-100 rounded-xl p-5 flex items-center gap-4 shadow-sm"
        >
          <div className={`${stat.bg} p-3 rounded-lg`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-xs text-navy-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
