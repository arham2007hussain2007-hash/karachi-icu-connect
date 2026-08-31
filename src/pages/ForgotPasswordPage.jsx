import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const { requestPasswordReset } = useAuth();

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTouched(true);
    const err = validate();
    if (err) return;

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldError = touched ? validate() : "";

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-navy-100 rounded-xl p-8 shadow-sm">
            <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">Check Your Email</h2>
            <p className="text-navy-500 text-sm mb-6">
              If an account exists for <strong>{email}</strong>, a password reset
              link has been prepared.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-medical-500 hover:text-medical-600 font-semibold text-sm no-underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
          <p className="text-xs text-navy-400 mt-4">
            This is a demo — no actual email is sent. Use the reset link in the
            development console.
          </p>
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
          <h1 className="text-2xl font-bold text-navy-900">Forgot Password</h1>
          <p className="text-sm text-navy-500 mt-1">
            Enter your email and we'll help you reset your password.
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

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Enter your registered email"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-medical-400 ${
                  fieldError ? "border-emergency-400" : "border-navy-200"
                }`}
              />
              {fieldError && (
                <p className="text-xs text-emergency-600 mt-1">{fieldError}</p>
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
                <Mail className="w-4 h-4" />
              )}
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm text-medical-500 hover:text-medical-600 font-medium no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-xs text-amber-700 text-center">
            <strong>DEMO:</strong> This simulates the password reset flow. No
            actual email is sent.
          </p>
        </div>
      </div>
    </div>
  );
}
