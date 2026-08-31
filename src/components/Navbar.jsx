import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Menu,
  X,
  Search,
  LogIn,
  LogOut,
  LayoutDashboard,
  User,
  UserPlus,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "Find ICU", to: "/search" },
  { label: "Hospitals", to: "/hospitals" },
  { label: "Map", to: "/map" },
  { label: "Smart Match", to: "/recommend" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, isHospitalStaff } = useAuth();
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    setProfileMenuOpen(false);
    navigate("/");
  };

  const navTo = (path) => {
    navigate(path);
    setOpen(false);
    setProfileMenuOpen(false);
  };

  // Build role-specific nav links
  const extraLinks = [];
  if (isHospitalStaff) {
    extraLinks.push({ label: "Staff Dashboard", to: "/staff", icon: LayoutDashboard });
  }
  if (isAdmin) {
    extraLinks.push({ label: "Admin Dashboard", to: "/admin", icon: LayoutDashboard });
  }
  const navLinks = [...publicLinks, ...extraLinks];

  return (
    <header className="bg-navy-950 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <HeartPulse className="w-8 h-8 text-emergency-400" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm tracking-wide text-white">
                KARACHI ICU
              </span>
              <span className="text-[10px] tracking-widest text-medical-300 font-medium">
                CONNECT
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline flex items-center gap-1.5 ${
                  isActive(link.to)
                    ? "text-white bg-navy-800"
                    : "text-navy-200 hover:text-white hover:bg-navy-800/50"
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 text-navy-200 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-medical-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {user?.fullName?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-navy-100 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-navy-100">
                      <p className="text-sm font-semibold text-navy-900 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-navy-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-medical-500">
                        {user?.role === "hospital_staff"
                          ? "Hospital Staff"
                          : user?.role === "admin"
                          ? "Admin"
                          : "Public User"}
                      </span>
                    </div>
                    <button
                      onClick={() => navTo("/profile")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer"
                    >
                      <User className="w-4 h-4" /> My Account
                    </button>
                    {isHospitalStaff && (
                      <button
                        onClick={() => navTo("/staff")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Staff Dashboard
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => navTo("/admin")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer"
                      >
                        <Settings className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}
                    <div className="border-t border-navy-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emergency-600 hover:bg-emergency-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 text-navy-300 hover:text-white text-sm transition-colors no-underline"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-medical-500 hover:bg-medical-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors no-underline"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white hover:bg-navy-800 rounded-md"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-navy-800">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium no-underline ${
                  isActive(link.to)
                    ? "text-white bg-navy-800"
                    : "text-navy-200 hover:text-white hover:bg-navy-800/50"
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-navy-800 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-medical-500 flex items-center justify-center text-white text-sm font-bold">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-navy-400">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-navy-200 hover:text-white hover:bg-navy-800/50 no-underline"
                  >
                    <User className="w-4 h-4" /> My Account
                  </Link>
                  {isHospitalStaff && (
                    <Link
                      to="/staff"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-navy-200 hover:text-white hover:bg-navy-800/50 no-underline"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Staff Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-navy-200 hover:text-white hover:bg-navy-800/50 no-underline"
                    >
                      <Settings className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-1.5 text-emergency-400 hover:text-emergency-300 text-sm py-3 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/search"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 bg-emergency-500 text-white px-4 py-3 rounded-lg text-sm font-semibold no-underline"
                  >
                    <Search className="w-4 h-4" />
                    Find ICU
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1 text-navy-300 hover:text-white text-sm py-2 no-underline"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-1 bg-medical-500 text-white px-4 py-3 rounded-lg text-sm font-semibold no-underline"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
