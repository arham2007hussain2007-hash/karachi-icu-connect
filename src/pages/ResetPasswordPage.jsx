import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  HeartPulse,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
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

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo-token";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken] = useState(false);
  const [touched, setTouched] = useState(false);

  const { resetPassword } = useAuth();

  const validate = () => {
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (confirmPassword !== password) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched(true);
    const errs = validate();
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);
  const fieldErrors = touched ? validate() : {};

  if (invalidToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
            <XCircle className="w-16 h-16 text-emergency-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Invalid Link</h2>
            <p className="text-navy-500 text-sm mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold px-6 py-3 rounded-lg text-sm no-underline"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Password Reset!</h2>
            <p className="text-navy-500 text-sm mb-6">
              Your password has been updated. You can now sign in.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white font-semibold px-6 py-3 rounded-lg text-sm no-underline"
            >
              Go to Login
            </Link>
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
          <h1 className="text-2xl font-bold text-navy-900">Reset Password</h1>
          <p className="text-sm text-navy-500 mt-1">Create a new password for your account.</p>
        </div>

        <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 bg-emergency-50 border border-emergency-200 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-emergency-500 mt-0.5 shrink-0" />
                <p className="text-sm text-emergency-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Enter new password"
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
              {password && (
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

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 ${
                  fieldErrors.confirmPassword ? "border-emergency-400" : "border-navy-200"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-emergency-600 mt-1">
                  {fieldErrors.confirmPassword}
                </p>
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
                <Lock className="w-4 h-4" />
              )}
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="text-sm text-medical-500 hover:text-medical-600 font-medium no-underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
