
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { HospitalDataProvider } from "./context/HospitalDataContext";
import { ProtectedRoute, RoleGuard } from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import HospitalListPage from "./pages/HospitalListPage";
import HospitalDetailPage from "./pages/HospitalDetailPage";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import HospitalDashboardPage from "./pages/HospitalDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";

import UnauthorizedPage from "./pages/UnauthorizedPage";
import AboutPage from "./pages/AboutPage";
import MapPage from "./pages/MapPage";
import RecommendationPage from "./pages/RecommendationPage";
import ImpactPage from "./pages/ImpactPage";
import NotFoundPage from "./pages/NotFoundPage";

import { DemoModeProvider } from "./context/DemoModeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import DemoOverlay from "./components/DemoOverlay";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HospitalDataProvider>
        <BrowserRouter basename="/karachi-icu-connect">
          <DemoModeProvider>
            <Layout>
              <ErrorBoundary>
                <Routes>

                  {/* ── Public routes (no login required) ── */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/hospitals" element={<HospitalListPage />} />
                  <Route path="/hospital/:id" element={<HospitalDetailPage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/recommend" element={<RecommendationPage />} />
                  <Route path="/impact" element={<ImpactPage />} />
                  <Route path="/about" element={<AboutPage />} />

                  {/* ── Auth routes ── */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* ── Unauthorized page ── */}
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />

                  {/* ── Protected: any authenticated user ── */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Protected: hospital staff only ── */}
                  <Route
                    path="/staff"
                    element={
                      <ProtectedRoute>
                        <RoleGuard roles={["hospital_staff"]}>
                          <HospitalDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Protected: admin only ── */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <RoleGuard roles={["admin"]}>
                          <AdminDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/hospitals"
                    element={
                      <ProtectedRoute>
                        <RoleGuard roles={["admin"]}>
                          <AdminDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute>
                        <RoleGuard roles={["admin"]}>
                          <AdminDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute>
                        <RoleGuard roles={["admin"]}>
                          <AdminDashboardPage />
                        </RoleGuard>
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Catch-all 404 ── */}
                  <Route path="*" element={<NotFoundPage />} />

                </Routes>
              </ErrorBoundary>
            </Layout>

            <DemoOverlay />

          </DemoModeProvider>
        </BrowserRouter>
      </HospitalDataProvider>
    </AuthProvider>
  );
}
