import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  LogOut,
  Edit3,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useHospitals } from "../context/HospitalDataContext";

const roleLabels = {
  public: "Public User",
  hospital_staff: "Hospital Staff",
  admin: "Administrator",
};

const roleBadge = {
  public: "bg-medical-50 text-medical-700 border-medical-200",
  hospital_staff: "bg-teal-50 text-teal-700 border-teal-200",
  admin: "bg-navy-50 text-navy-700 border-navy-200",
};

export default function ProfilePage() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { hospitals } = useHospitals();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [pwForm, setPwForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [error, setError] = useState("");
  const [pwError, setPwError] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const assignedHospital =
    user?.role === "hospital_staff" && user?.hospitalId
      ? hospitals.find((h) => h.id === user.hospitalId)
      : null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSaveProfile = async () => {
    setError("");
    setSaving(true);
    try {
      await updateProfile(editForm);
      setMsg("Profile updated successfully.");
      setEditing(false);
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwMsg("");

    if (pwForm.newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError("Passwords do not match.");
      return;
    }

    setChangingPw(true);
    try {
      await changePassword(pwForm.current, pwForm.newPassword);
      setPwMsg("Password changed successfully.");
      setPwForm({ current: "", newPassword: "", confirm: "" });
      setTimeout(() => setPwMsg(""), 4000);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setChangingPw(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
        My Account
      </h1>
      <p className="text-navy-500 text-sm mb-8">
        Manage your profile and account settings.
      </p>

      {/* ── Profile Card ── */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <User className="w-5 h-5 text-medical-500" />
            Profile Information
          </h2>
          {!editing ? (
            <button
              onClick={() => {
                setEditing(true);
                setEditForm({
                  fullName: user.fullName || "",
                  phone: user.phone || "",
                });
              }}
              className="flex items-center gap-1.5 text-sm text-medical-500 hover:text-medical-600 font-medium cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-600 font-medium cursor-pointer"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {msg && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-4">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span className="text-sm text-teal-700">{msg}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-emergency-50 border border-emergency-200 rounded-lg px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 text-emergency-500" />
            <span className="text-sm text-emergency-700">{error}</span>
          </div>
        )}

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Email{" "}
                <span className="text-navy-400 font-normal">(read-only)</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm bg-navy-50 text-navy-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-navy-400 mt-1" />
              <div>
                <p className="text-xs text-navy-400">Full Name</p>
                <p className="text-sm text-navy-900 font-medium">
                  {user.fullName}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-navy-400 mt-1" />
              <div>
                <p className="text-xs text-navy-400">Email</p>
                <p className="text-sm text-navy-900 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-navy-400 mt-1" />
              <div>
                <p className="text-xs text-navy-400">Phone</p>
                <p className="text-sm text-navy-900 font-medium">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-navy-400 mt-1" />
              <div>
                <p className="text-xs text-navy-400">Role</p>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    roleBadge[user.role]
                  }`}
                >
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-navy-400 mt-1" />
              <div>
                <p className="text-xs text-navy-400">Account Status</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-teal-50 text-teal-700 border-teal-200">
                  Active
                </span>
              </div>
            </div>
            {user.createdAt && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-navy-400 mt-1" />
                <div>
                  <p className="text-xs text-navy-400">Member Since</p>
                  <p className="text-sm text-navy-900 font-medium">
                    {user.createdAt}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Assigned Hospital (staff only, read-only) ── */}
      {assignedHospital && (
        <div className="bg-white border border-teal-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-teal-600" />
            Assigned Hospital
          </h2>
          <p className="text-xs text-navy-400 mb-3">
            Hospital affiliation is assigned by administrators and cannot be
            changed here.
          </p>
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
            <p className="font-semibold text-navy-900">
              {assignedHospital.name}
            </p>
            <p className="text-sm text-navy-500 mt-1">
              {assignedHospital.address}
            </p>
            <p className="text-sm text-navy-500">{assignedHospital.phone}</p>
            <Link
              to={`/hospital/${assignedHospital.id}`}
              className="text-sm text-medical-500 hover:text-medical-600 font-medium mt-2 inline-block no-underline"
            >
              View Hospital Profile →
            </Link>
          </div>
        </div>
      )}

      {/* ── Change Password ── */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2 mb-5">
          <Lock className="w-5 h-5 text-medical-500" />
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {pwMsg && (
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-teal-700">{pwMsg}</span>
            </div>
          )}
          {pwError && (
            <div className="flex items-center gap-2 bg-emergency-50 border border-emergency-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 text-emergency-500" />
              <span className="text-sm text-emergency-700">{pwError}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pwForm.current}
                onChange={(e) =>
                  setPwForm({ ...pwForm, current: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={(e) =>
                setPwForm({ ...pwForm, newPassword: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) =>
                setPwForm({ ...pwForm, confirm: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-navy-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400"
            />
          </div>
          <button
            type="submit"
            disabled={changingPw}
            className="flex items-center gap-2 bg-medical-500 hover:bg-medical-600 disabled:bg-medical-300 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
          >
            {changingPw ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {changingPw ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* ── Logout ── */}
      <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900">Sign Out</h3>
            <p className="text-sm text-navy-500">
              End your session and return to the public site.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-navy-100 hover:bg-navy-200 text-navy-700 font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
