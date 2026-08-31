/*
 * ============================================================
 *  HOSPITAL DATA CONTEXT
 *  Live hospital data provider backed by hospitalDataService.
 *
 *  Currently a mock/local implementation — see
 *  services/hospitalDataService.js for the development-only
 *  disclaimer. When a real backend is connected, only the
 *  service + this provider need to change; consuming pages
 *  keep using useHospitals() unchanged.
 * ============================================================
 */

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import hospitalDataService from "../services/hospitalDataService";

const HospitalDataContext = createContext(null);

export function HospitalDataProvider({ children }) {
  const { user } = useAuth();

  // Seed synchronously from the local service so public pages never
  // flash empty while the async load below runs (stale-while-revalidate).
  const [hospitals, setHospitals] = useState(() =>
    hospitalDataService.getHospitals()
  );
  // "loading" | "ready" | "error" — reflects the async fetch path that
  // a real backend service will use. Consumers that show aggregates
  // (e.g. the Admin Command Center) gate on this so they never display
  // misleading zero values while data loads.
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  // Load through the service's async fetch path. A real backend swaps
  // the service implementation — this provider and consumers unchanged.
  // (The initial status is already "loading", so no synchronous reset is
  // needed here; retry feedback is handled by the retrying UI.)
  const reload = useCallback(async () => {
    try {
      const list = await hospitalDataService.fetchHospitals();
      setHospitals(list);
      setStatus("ready");
      setError("");
    } catch (err) {
      setStatus("error");
      setError(
        err?.message || "Unable to load hospital data. Please try again."
      );
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  /**
   * Update ICU availability for one hospital.
   *
   * Authorization is enforced here as the single central choke point:
   *   - user must be logged in
   *   - user must be role "hospital_staff"
   *   - user may only update their own assigned hospital
   * Admins and public users are read-only.
   */
  const updateAvailability = useCallback(
    async (hospitalId, updates) => {
      if (
        !user ||
        user.role !== "hospital_staff" ||
        user.hospitalId !== hospitalId
      ) {
        throw new Error(
          "You are not authorized to update this hospital's availability."
        );
      }
      const updated = await hospitalDataService.updateHospitalAvailability(
        hospitalId,
        updates
      );
      setHospitals((prev) =>
        prev.map((h) => (h.id === hospitalId ? updated : h))
      );
      return updated;
    },
    [user]
  );

  const getHospitalById = useCallback(
    (id) => hospitals.find((h) => h.id === id) || null,
    [hospitals]
  );

  return (
    <HospitalDataContext.Provider
      value={{ hospitals, status, error, reload, updateAvailability, getHospitalById }}
    >
      {children}
    </HospitalDataContext.Provider>
  );
}

export const useHospitals = () => {
  const ctx = useContext(HospitalDataContext);
  if (!ctx) {
    throw new Error("useHospitals must be used within HospitalDataProvider");
  }
  return ctx;
};
