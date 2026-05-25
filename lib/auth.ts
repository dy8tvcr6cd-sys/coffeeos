import type { RoasteryAccessRequest, UserProfile, UserRole } from "@/types/user";

const USERS_KEY = "coffeeos_user_profiles";
const SESSION_KEY = "coffeeos_current_user_id";
const ROASTERY_REQUESTS_KEY = "coffeeos_roastery_access_requests";

type AuthResult =
  | { ok: true; user: UserProfile }
  | { ok: false; error: string };

type CustomerSignupInput = {
  email: string;
  password: string;
  confirmPassword: string;
  displayName?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type RoasterySignupInput = {
  roasteryName: string;
  managerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact?: string;
  officialWebsite?: string;
  instagram?: string;
  roleInRoastery: RoasteryAccessRequest["roleInRoastery"];
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("coffeeos:auth-change"));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateEmailAndPassword(email: string, password: string, confirmPassword?: string) {
  if (!normalizeEmail(email)) {
    return "emailRequired";
  }
  if (!password) {
    return "passwordRequired";
  }
  if (password.length < 8) {
    return "passwordTooShort";
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return "passwordsDoNotMatch";
  }
  return "";
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getUserProfiles() {
  return readJson<UserProfile[]>(USERS_KEY, []);
}

export function getRoasteryAccessRequests() {
  return readJson<RoasteryAccessRequest[]>(ROASTERY_REQUESTS_KEY, []);
}

export function getCurrentUser() {
  if (!canUseStorage()) {
    return null;
  }

  const id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    return null;
  }

  return getUserProfiles().find((user) => user.id === id) ?? null;
}

export function createCustomerAccount(input: CustomerSignupInput): AuthResult {
  const error = validateEmailAndPassword(input.email, input.password, input.confirmPassword);
  if (error) {
    return { ok: false, error };
  }

  const email = normalizeEmail(input.email);
  const users = getUserProfiles();
  const existing = users.find((user) => user.email === email);

  const user: UserProfile = existing
    ? {
        ...existing,
        displayName: input.displayName?.trim() || existing.displayName,
        updatedAt: new Date().toISOString()
      }
    : {
        id: `user-${Date.now()}`,
        email,
        displayName: input.displayName?.trim() || undefined,
        role: "customer",
        createdAt: new Date().toISOString()
      };

  writeJson(USERS_KEY, [user, ...users.filter((item) => item.id !== user.id)]);
  setCurrentUser(user.id);
  return { ok: true, user };
}

export function login(input: LoginInput): AuthResult {
  const error = validateEmailAndPassword(input.email, input.password);
  if (error) {
    return { ok: false, error };
  }

  const email = normalizeEmail(input.email);
  const user = getUserProfiles().find((item) => item.email === email);
  if (!user) {
    return { ok: false, error: "accountNotFound" };
  }

  setCurrentUser(user.id);
  return { ok: true, user };
}

export function createRoasterySignupRequest(input: RoasterySignupInput): AuthResult {
  const authError = validateEmailAndPassword(input.email, input.password, input.confirmPassword);
  if (authError) {
    return { ok: false, error: authError };
  }
  if (!input.roasteryName.trim()) {
    return { ok: false, error: "roasteryNameRequired" };
  }
  if (!input.managerName.trim()) {
    return { ok: false, error: "managerNameRequired" };
  }

  const email = normalizeEmail(input.email);
  const users = getUserProfiles();
  const existing = users.find((user) => user.email === email);
  const now = new Date().toISOString();
  const user: UserProfile = existing
    ? { ...existing, role: existing.role === "customer" ? "pending_roastery" : existing.role, updatedAt: now }
    : {
        id: `user-${Date.now()}`,
        email,
        displayName: input.managerName.trim(),
        role: "pending_roastery",
        createdAt: now
      };

  const request: RoasteryAccessRequest = {
    id: `roastery-request-${Date.now()}`,
    userId: user.id,
    roasteryName: input.roasteryName.trim(),
    managerName: input.managerName.trim(),
    email,
    contact: input.contact?.trim() || undefined,
    officialWebsite: input.officialWebsite?.trim() || undefined,
    instagram: input.instagram?.trim() || undefined,
    roleInRoastery: input.roleInRoastery,
    status: "pending",
    createdAt: now
  };

  writeJson(USERS_KEY, [user, ...users.filter((item) => item.id !== user.id)]);
  writeJson(ROASTERY_REQUESTS_KEY, [request, ...getRoasteryAccessRequests()]);
  setCurrentUser(user.id);
  return { ok: true, user };
}

export function setCurrentUser(userId: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, userId);
  window.dispatchEvent(new CustomEvent("coffeeos:auth-change"));
}

export function logout() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("coffeeos:auth-change"));
}

export function canAccessRoasteryAdmin(role: UserRole | null | undefined) {
  return role === "roastery_owner" || role === "roastery_staff" || role === "admin";
}
