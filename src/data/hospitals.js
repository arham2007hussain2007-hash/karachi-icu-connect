// DEMO DATA — These values are for demonstration purposes only.
// They do not represent real-time hospital availability.
// All ICU numbers are sample data for the hackathon prototype.
// Availability updates made by hospital staff (demo) are merged on top of
// this dataset by services/hospitalDataService.js.

const hospitals = [
  {
    id: "agh-khi-01",
    name: "Aga Khan University Hospital",
    area: "Stadium Road",
    address: "Stadium Road, P.O. Box 3500, Karachi 74800",
    phone: "+9221111911911",
    latitude: 24.8933,
    longitude: 67.0752,
    icuTypes: ["General ICU", "Cardiac ICU", "Surgical ICU"],
    totalICUBeds: 52,
    availableICUBeds: 18,
    totalVentilators: 24,
    availableVentilators: 10,
    specialties: ["Cardiology", "Neurology", "Trauma", "Oncology", "Critical Care"],
    lastUpdated: "25 minutes ago",
    verified: true,
  },
  {
    id: "lnh-khi-02",
    name: "Liaquat National Hospital",
    area: "Stadium Road",
    address: "Stadium Road, Liaquat National Hospital, Karachi 74800",
    phone: "+922199262400",
    latitude: 24.8916,
    longitude: 67.0734,
    icuTypes: ["General ICU", "Surgical ICU", "Neonatal ICU"],
    totalICUBeds: 38,
    availableICUBeds: 5,
    totalVentilators: 18,
    availableVentilators: 6,
    specialties: ["General Surgery", "Orthopedics", "Nephrology", "Critical Care"],
    lastUpdated: "1 hour ago",
    verified: true,
  },
  {
    id: "jpmc-khi-03",
    name: "Jinnah Postgraduate Medical Centre",
    area: "Rafiqui Shaheed Road",
    address: "Rafiqui Shaheed Road, JPMC, Karachi 75510",
    phone: "+922199201701",
    latitude: 24.8600,
    longitude: 67.0530,
    icuTypes: ["General ICU", "Pediatric ICU", "Surgical ICU"],
    totalICUBeds: 60,
    availableICUBeds: 2,
    totalVentilators: 30,
    availableVentilators: 3,
    specialties: ["Emergency", "Pediatrics", "General Medicine", "Trauma"],
    lastUpdated: "45 minutes ago",
    verified: true,
  },
  {
    id: "indus-khi-04",
    name: "Indus Hospital",
    area: "Korangi",
    address: "Plot 42-43, Sector 31/5, Korangi Crossing, Karachi 74900",
    phone: "+9221111463874",
    latitude: 24.8349,
    longitude: 67.1813,
    icuTypes: ["General ICU", "Pediatric ICU", "Neonatal ICU"],
    totalICUBeds: 34,
    availableICUBeds: 14,
    totalVentilators: 16,
    availableVentilators: 9,
    specialties: ["Pediatrics", "Oncology", "General Surgery", "Critical Care"],
    lastUpdated: "30 minutes ago",
    verified: true,
  },
  {
    id: "south-city-khi-05",
    name: "South City Hospital",
    area: "Clifton",
    address: "Block 4, Shahrah-e-Ghalib, Clifton, Karachi 75600",
    phone: "+922135832921",
    latitude: 24.8105,
    longitude: 67.0357,
    icuTypes: ["General ICU", "Cardiac ICU"],
    totalICUBeds: 18,
    availableICUBeds: 8,
    totalVentilators: 10,
    availableVentilators: 5,
    specialties: ["Cardiology", "Internal Medicine", "Critical Care"],
    lastUpdated: "1 hour ago",
    verified: false,
  },
  {
    id: "ziauddin-khi-06",
    name: "Dr. Ziauddin Hospital",
    area: "North Nazimabad",
    address: "Block B, North Nazimabad, Karachi 74700",
    phone: "+922136648866",
    latitude: 24.9602,
    longitude: 67.0257,
    icuTypes: ["General ICU", "Neonatal ICU", "Cardiac ICU"],
    totalICUBeds: 28,
    availableICUBeds: 12,
    totalVentilators: 14,
    availableVentilators: 8,
    specialties: ["Neonatology", "General Surgery", "Gynecology", "Cardiology"],
    lastUpdated: "2 hours ago",
    verified: true,
  },
  {
    id: "civil-khi-07",
    name: "Dr. Ruth K.M. Pfau Civil Hospital Karachi",
    area: "Mission Road",
    address: "Mission Road, Civil Hospital, Karachi 75510",
    phone: "+922199215740",
    latitude: 24.8654,
    longitude: 67.0318,
    icuTypes: ["General ICU", "Surgical ICU", "Pediatric ICU"],
    totalICUBeds: 55,
    availableICUBeds: 0,
    totalVentilators: 25,
    availableVentilators: 0,
    specialties: ["Emergency", "Trauma", "Burns", "Critical Care"],
    lastUpdated: "20 minutes ago",
    verified: true,
  },
  {
    id: "patel-khi-08",
    name: "Patel Hospital",
    area: "Gulshan-e-Iqbal",
    address: "Block 7, Main University Road, Gulshan-e-Iqbal, Karachi 75300",
    phone: "+922134964111",
    latitude: 24.9204,
    longitude: 67.0901,
    icuTypes: ["General ICU", "Cardiac ICU", "Pediatric ICU"],
    totalICUBeds: 30,
    availableICUBeds: 9,
    totalVentilators: 15,
    availableVentilators: 7,
    specialties: ["Cardiology", "Pediatrics", "Neurology", "Critical Care"],
    lastUpdated: "1 hour ago",
    verified: true,
  },
  {
    id: "dow-khi-09",
    name: "Dow University Hospital",
    area: "Gulzar-e-Hijri",
    address: "Sector 32, Scheme 33, Gulzar-e-Hijri, Karachi 75300",
    phone: "+922199214560",
    latitude: 24.9452,
    longitude: 67.1369,
    icuTypes: ["General ICU", "Surgical ICU", "Neonatal ICU"],
    totalICUBeds: 40,
    availableICUBeds: 15,
    totalVentilators: 20,
    availableVentilators: 11,
    specialties: ["General Surgery", "Internal Medicine", "Neonatology", "Critical Care"],
    lastUpdated: "1.5 hours ago",
    verified: true,
  },
  {
    id: "abbasi-khi-10",
    name: "Abbasi Shaheed Hospital",
    area: "Nazimabad",
    address: "Block 2, Nazimabad, Karachi 74600",
    phone: "+922199243241",
    latitude: 24.9350,
    longitude: 67.0350,
    icuTypes: ["General ICU", "Surgical ICU"],
    totalICUBeds: 25,
    availableICUBeds: 3,
    totalVentilators: 12,
    availableVentilators: 2,
    specialties: ["General Surgery", "Orthopedics", "Emergency", "Critical Care"],
    lastUpdated: "3 hours ago",
    verified: true,
  },
  {
    id: "pns-shifa-khi-11",
    name: "PNS Shifa Hospital",
    area: "DHA",
    address: "Shara-e-Faisal, DHA Phase 1, Karachi 75500",
    phone: "+922135644001",
    latitude: 24.8167,
    longitude: 67.0667,
    icuTypes: ["General ICU", "Cardiac ICU", "Surgical ICU"],
    totalICUBeds: 20,
    availableICUBeds: 7,
    totalVentilators: 10,
    availableVentilators: 4,
    specialties: ["Cardiology", "General Surgery", "Emergency"],
    lastUpdated: "2 hours ago",
    verified: true,
  },
  {
    id: "nicvd-khi-12",
    name: "National Institute of Cardiovascular Diseases",
    area: "Abassi Shaheed Road",
    address: "Abassi Shaheed Road, NICVD, Karachi 74600",
    phone: "+922199201271",
    latitude: 24.9200,
    longitude: 67.0350,
    icuTypes: ["Cardiac ICU", "Surgical ICU"],
    totalICUBeds: 45,
    availableICUBeds: 0,
    totalVentilators: 20,
    availableVentilators: 0,
    specialties: ["Cardiology", "Cardiac Surgery", "Critical Care"],
    lastUpdated: "3 hours ago",
    verified: true,
  },
  {
    id: "medicare-khi-13",
    name: "Medicare Cardiac & General Hospital",
    area: "Gulshan-e-Iqbal",
    address: "Block 13-A, Gulshan-e-Iqbal, Karachi 75300",
    phone: "+922134986400",
    latitude: 24.9190,
    longitude: 67.1020,
    icuTypes: ["General ICU", "Cardiac ICU"],
    totalICUBeds: 16,
    availableICUBeds: 6,
    totalVentilators: 8,
    availableVentilators: 3,
    specialties: ["Cardiology", "General Medicine", "Critical Care"],
    lastUpdated: "4 hours ago",
    verified: false,
  },
  {
    id: "memon-khi-14",
    name: "Memon Medical Institute Hospital",
    area: "Saddar",
    address: "Bai Virbai Jeevanji Street, Saddar, Karachi 74400",
    phone: "+922132720141",
    latitude: 24.8567,
    longitude: 67.0200,
    icuTypes: ["General ICU", "Neonatal ICU"],
    totalICUBeds: 16,
    availableICUBeds: 4,
    totalVentilators: 8,
    availableVentilators: 2,
    specialties: ["Maternity", "Neonatology", "General Surgery"],
    lastUpdated: "3 hours ago",
    verified: false,
  },
  {
    id: "national-mc-khi-15",
    name: "National Medical Centre",
    area: "PECHS",
    address: "Shahrah-e-Faisal, PECHS Block 6, Karachi 75400",
    phone: "+922134555111",
    latitude: 24.8750,
    longitude: 67.0600,
    icuTypes: ["General ICU", "Surgical ICU", "Neonatal ICU"],
    totalICUBeds: 24,
    availableICUBeds: 1,
    totalVentilators: 12,
    availableVentilators: 0,
    specialties: ["General Surgery", "Neonatology", "Orthopedics", "Critical Care"],
    lastUpdated: "6 hours ago",
    verified: true,
  },
];

export default hospitals;

// ── Helper: Get all unique areas sorted alphabetically ──
export const getAreas = () =>
  [...new Set(hospitals.map((h) => h.area))].sort();

// ── Helper: Get all unique ICU types sorted ──
export const getICUTypes = () => {
  const types = new Set();
  hospitals.forEach((h) => h.icuTypes.forEach((t) => types.add(t)));
  return [...types].sort();
};

// ── Helper: Get all unique specialties sorted ──
export const getSpecialties = () => {
  const specs = new Set();
  hospitals.forEach((h) => h.specialties.forEach((s) => specs.add(s)));
  return [...specs].sort();
};

// ── Helper: Calculate platform-wide statistics ──
// Accepts an optional list so callers can compute stats over live data
// (see context/HospitalDataContext). Defaults to the base dataset.
export const getPlatformStats = (list = hospitals) => {
  const totalHospitals = list.length;
  const totalBeds = list.reduce((sum, h) => sum + h.totalICUBeds, 0);
  const availableBeds = list.reduce((sum, h) => sum + h.availableICUBeds, 0);
  const totalVentilators = list.reduce((sum, h) => sum + h.totalVentilators, 0);
  const availableVentilators = list.reduce((sum, h) => sum + h.availableVentilators, 0);
  const areas = new Set(list.map((h) => h.area)).size;
  return { totalHospitals, totalBeds, availableBeds, totalVentilators, availableVentilators, areas };
};

// ── Helper: Get hospitals sorted by availability (best first), limited to N ──
// Accepts an optional list so callers can rank live data (see
// context/HospitalDataContext). Defaults to the base dataset.
export const getFeaturedHospitals = (count = 6, list = hospitals) =>
  [...list]
    .sort((a, b) => {
      const pctA = a.totalICUBeds ? a.availableICUBeds / a.totalICUBeds : 0;
      const pctB = b.totalICUBeds ? b.availableICUBeds / b.totalICUBeds : 0;
      return pctB - pctA;
    })
    .slice(0, count);
