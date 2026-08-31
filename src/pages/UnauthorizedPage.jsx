import { Link, useNavigate } from "react-router-dom";
import {
  ShieldX,
  Home,
  ArrowLeft,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "hospital_staff"
      ? "Hospital Staff"
      : user?.role === "public"
      ? "Public User"
      : "Not Logged In";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white border border-navy-100 rounded-xl p-10 shadow-sm">
          <div className="bg-emergency-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-emergency-500" />
          </div>

          <h1 className="text-3xl font-bold text-navy-900 mb-3">Access Denied</h1>
          <p className="text-navy-500 text-base mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-navy-400 mb-8">
            If you believe this is an error, contact your system administrator.
          </p>

          {user && (
            <div className="bg-navy-50 border border-navy-100 rounded-lg px-4 py-3 mb-8 inline-block">
              <div className="flex items-center gap-2 justify-center">
                <User className="w-4 h-4 text-navy-400" />
                <span className="text-sm text-navy-700">
                  <strong>{user.fullName}</strong> — {roleLabel}
                </span>
              </div>
              {user.role === "hospital_staff" && user.hospitalId && (
                <p className="text-xs text-navy-500 mt-1">
                  Assigned Hospital: {user.hospitalId}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors no-underline"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 bg-navy-100 hover:bg-navy-200 text-navy-700 font-semibold px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 bg-white border border-navy-200 hover:bg-navy-50 text-navy-700 font-semibold px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
