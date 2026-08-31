import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HeartPulse,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-emergency-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-medical-500" };
  return { score, label: "Strong", color: "bg-teal-500" };
}

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match";
    if (form.phone && !/^[+]?[\d\s-]{7,}$/.test(form.phone))
      errs.phone = "Enter a valid phone number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, phone: true });
    const errs = validate();
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);
  const fieldErrors = touched ? validate() : {};

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Account Created!</h2>
            <p className="text-navy-500 text-sm">
              Welcome to Karachi ICU Connect. Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HeartPulse className="w-10 h-10 text-emergency-500" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Create Account</h1>
          <p className="text-sm text-navy-500 mt-1">
            Join Karachi ICU Connect to access your account.
          </p>
        </div>

        <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 bg-emergency-50 border border-emergency-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-emergency-500 mt-0.5 shrink-0" />
                <p className="text-sm text-emergency-700">{error}</p>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={set("fullName")}
                onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 ${
                  fieldErrors.fullName ? "border-emergency-400" : "border-navy-200"
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-xs text-emergency-600 mt-1">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="Enter your email"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 ${
                  fieldErrors.email ? "border-emergency-400" : "border-navy-200"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-emergency-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Create a password"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 pr-10 ${
                    fieldErrors.password ? "border-emergency-400" : "border-navy-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= strength.score ? strength.color : "bg-navy-100"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-navy-500">
                    Strength: <span className="font-medium">{strength.label}</span>
                  </p>
                </div>
              )}
              {fieldErrors.password && (
                <p className="text-xs text-emergency-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 ${
                  fieldErrors.confirmPassword ? "border-emergency-400" : "border-navy-200"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-emergency-600 mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Phone <span className="text-navy-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder="+92XXXXXXXXXX"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 ${
                  fieldErrors.phone ? "border-emergency-400" : "border-navy-200"
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-emergency-600 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 disabled:bg-medical-300 text-white font-bold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-navy-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-medical-500 hover:text-medical-600 font-semibold no-underline"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="mt-4 bg-navy-50 rounded-lg px-4 py-3">
            <p className="text-xs text-navy-500 text-center">
              New accounts are created with <strong>Public</strong> access.
              Hospital Staff and Admin roles are assigned by administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
