import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protects a route so only authenticated users can access it.
 * Redirects to /login (with return-url) when the user is not logged in.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-medical-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-navy-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Restricts a route to users with specific role(s).
 * Must be nested inside <ProtectedRoute>.
 *
 *   <ProtectedRoute>
 *     <RoleGuard roles={["admin"]}>
 *       <AdminPage />
 *     </RoleGuard>
 *   </ProtectedRoute>
 *
 * An optional `hospitalId` prop enforces hospital-scoped access
 * for hospital_staff users.
 */
export function RoleGuard({ children, roles = [], hospitalId }) {
  const { user, canAccessHospital } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Role check
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Hospital-scoped check for staff
  if (hospitalId && user.role === "hospital_staff") {
    if (!canAccessHospital(hospitalId)) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return children;
}
