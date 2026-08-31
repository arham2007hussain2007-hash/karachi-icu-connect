import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  HeartPulse,
  Eye,
  EyeOff,
  LogIn,
  User,
  Building2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  {
    label: "Public User",
    email: "public@demo.com",
    password: "demo1234",
    icon: User,
    desc: "Search hospitals, use map & smart match",
    color: "text-medical-500",
    bg: "bg-medical-50",
    border: "border-medical-200 hover:border-medical-400",
  },
  {
    label: "Hospital Staff",
    email: "staff@demo.com",
    password: "demo1234",
    icon: Building2,
    desc: "Manage Aga Khan University Hospital",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200 hover:border-teal-400",
  },
  {
    label: "Admin",
    email: "admin@demo.com",
    password: "demo1234",
    icon: ShieldCheck,
    desc: "Full platform management access",
    color: "text-navy-600",
    bg: "bg-navy-50",
    border: "border-navy-200 hover:border-navy-400",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Redirect already-authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else if (user.role === "hospital_staff") navigate("/staff", { replace: true });
      else navigate("/profile", { replace: true });
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });
    const errs = validate();
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const loggedInUser = await login(email, password, remember);
      const dest = location.state?.from?.pathname ||
        (loggedInUser.role === "admin" ? "/admin" :
         loggedInUser.role === "hospital_staff" ? "/staff" : "/");
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  };

  const fieldErrors = {};
  if (touched.email || touched.password) {
    Object.assign(fieldErrors, validate());
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HeartPulse className="w-10 h-10 text-emergency-500" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Welcome Back</h1>
          <p className="text-sm text-navy-500 mt-1">
            Sign in to your Karachi ICU Connect account.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 bg-emergency-50 border border-emergency-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-emergency-500 mt-0.5 shrink-0" />
                <p className="text-sm text-emergency-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 pr-10 ${
                    fieldErrors.password ? "border-emergency-400" : "border-navy-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-emergency-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-navy-300"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-medical-500 hover:text-medical-600 font-medium no-underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-medical-500 hover:bg-medical-600 disabled:bg-medical-300 text-white font-bold py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "SIGNING IN..." : "LOGIN"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-navy-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-medical-500 hover:text-medical-600 font-semibold no-underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white border border-navy-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-navy-900 text-sm">Demo Accounts</h3>
          </div>
          <p className="text-xs text-navy-500 mb-4">
            Click to autofill credentials for testing.
          </p>
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => fillDemo(demo)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left cursor-pointer ${demo.border} bg-white`}
              >
                <div className={`${demo.bg} p-2 rounded-lg`}>
                  <demo.icon className={`w-5 h-5 ${demo.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-900 text-sm">{demo.label}</p>
                  <p className="text-xs text-navy-500">{demo.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
