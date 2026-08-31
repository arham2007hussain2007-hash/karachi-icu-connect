/*
 * ============================================================
 *  THIS IS MOCK AUTHENTICATION FOR DEVELOPMENT/DEMO PURPOSES.
 *  IT IS NOT PRODUCTION-SECURE.
 *  REAL SERVER-SIDE AUTHENTICATION AND AUTHORIZATION
 *  MUST BE IMPLEMENTED BEFORE PRODUCTION.
 * ============================================================
 *
 *  Auth service abstraction layer.
 *  Replace `mockAuthService` with a real implementation
 *  (e.g. Supabase, Firebase, custom REST API) without changing
 *  any consuming component code.
 *
 *  authService interface:
 *    login(email, password, rememberMe) → { user }
 *    signup({ fullName, email, password, phone }) → { user }
 *    logout() → void
 *    getCurrentUser() → user | null
 *    isAdmin(user) → boolean
 *    isHospitalStaff(user) → boolean
 *    canAccessHospital(user, hospitalId) → boolean
 *    requestPasswordReset(email) → { success, message }
 *    resetPassword(token, newPassword) → { success }
 *    updateProfile(userId, updates) → { user }
 *    changePassword(userId, oldPw, newPw) → { success }
 */

const STORAGE_KEY = "karachi_icu_session";

// ── Mock accounts for development/testing ───────────────────
const mockUsers = [
  {
    id: "user-public-001",
    email: "public@demo.com",
    password: "demo1234",
    fullName: "Ahmed Raza",
    phone: "+923001234567",
    role: "public",
    hospitalId: null,
    createdAt: "2024-01-15",
  },
  {
    id: "user-staff-001",
    email: "staff@demo.com",
    password: "demo1234",
    fullName: "Dr. Fatima Khan",
    phone: "+923009876543",
    role: "hospital_staff",
    hospitalId: "agh-khi-01",
    createdAt: "2024-01-10",
  },
  {
    id: "user-staff-002",
    email: "indus@demo.com",
    password: "demo1234",
    fullName: "Dr. Ali Hassan",
    phone: "+923005551234",
    role: "hospital_staff",
    hospitalId: "indus-khi-04",
    createdAt: "2024-02-20",
  },
  {
    id: "user-admin-001",
    email: "admin@demo.com",
    password: "demo1234",
    fullName: "Admin User",
    phone: "+923001112222",
    role: "admin",
    hospitalId: null,
    createdAt: "2024-01-01",
  },
];

// Store password-reset tokens in memory (demo only)
const resetTokens = {};

// ── Strip password before returning user object ─────────────
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

// ── Persist / read / clear session in localStorage ──────────
function saveSession(user, rememberMe) {
  const session = {
    user: sanitizeUser(user),
    token: `mock-token-${Date.now()}`,
    rememberMe,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.user) return null;
    return session;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Mock Auth Service ───────────────────────────────────────
const mockAuthService = {
  /**
   * Authenticate with email + password.
   * @returns {{ user: object }} sanitized user
   */
  async login(email, password, rememberMe = false) {
    await new Promise((r) => setTimeout(r, 700));

    const user = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password. Please try again.");
    }

    saveSession(user, rememberMe);
    return { user: sanitizeUser(user) };
  },

  /**
   * Register a new public account.
   * New signups ALWAYS receive role "public".
   */
  async signup({ fullName, email, password, phone }) {
    await new Promise((r) => setTimeout(r, 700));

    if (mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: `user-public-${Date.now()}`,
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone?.trim() || "",
      role: "public",
      hospitalId: null,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockUsers.push(newUser);

    // Auto-login after signup
    saveSession(newUser, false);
    return { user: sanitizeUser(newUser) };
  },

  /** Clear session and log out. */
  async logout() {
    clearSession();
  },

  /** Restore user from persisted session (on app startup). */
  getCurrentUser() {
    const session = readSession();
    return session?.user || null;
  },

  // ── Role helpers ──────────────────────────────────────────
  isAdmin(user) {
    return user?.role === "admin";
  },

  isHospitalStaff(user) {
    return user?.role === "hospital_staff";
  },

  canAccessHospital(user, hospitalId) {
    if (!user) return false;
    if (user.role === "admin") return true;
    if (user.role === "hospital_staff") return user.hospitalId === hospitalId;
    return false;
  },

  // ── Password reset (simulated) ────────────────────────────
  async requestPasswordReset(email) {
    await new Promise((r) => setTimeout(r, 700));

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      throw new Error("No account found with this email address.");
    }

    const token = `reset-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    resetTokens[token] = {
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    };

    return { success: true, _devToken: token };
  },

  async resetPassword(token, newPassword) {
    await new Promise((r) => setTimeout(r, 700));

    const entry = resetTokens[token];
    if (!entry) {
      throw new Error("This reset link is invalid or has expired.");
    }
    if (Date.now() > entry.expiresAt) {
      delete resetTokens[token];
      throw new Error("This reset link has expired. Please request a new one.");
    }

    const user = mockUsers.find((u) => u.id === entry.userId);
    if (user) user.password = newPassword;

    delete resetTokens[token];
    return { success: true };
  },

  // ── Profile management ────────────────────────────────────
  async updateProfile(userId, updates) {
    await new Promise((r) => setTimeout(r, 400));

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");

    if (updates.fullName !== undefined) user.fullName = updates.fullName;
    if (updates.phone !== undefined) user.phone = updates.phone;

    // Persist the updated user to the current session
    const session = readSession();
    if (session?.user?.id === userId) {
      saveSession(user, session.rememberMe);
    }

    return { user: sanitizeUser(user) };
  },

  async changePassword(userId, oldPassword, newPassword) {
    await new Promise((r) => setTimeout(r, 400));

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found.");
    if (user.password !== oldPassword) {
      throw new Error("Current password is incorrect.");
    }

    user.password = newPassword;
    return { success: true };
  },

  // ── Admin helpers (mock) ──────────────────────────────────
  getAllUsers() {
    return mockUsers.map(sanitizeUser);
  },
};

export default mockAuthService;
