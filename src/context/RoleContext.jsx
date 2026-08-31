import { createContext, useContext, useState } from "react";

// Demo-only role state — NOT real authentication.
// Real auth will be implemented in a later phase.

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [demoRole, setDemoRole] = useState("public"); // "public" | "hospital_staff" | "admin"

  const login = (role) => setDemoRole(role);
  const logout = () => setDemoRole("public");

  return (
    <RoleContext.Provider value={{ demoRole, login, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
