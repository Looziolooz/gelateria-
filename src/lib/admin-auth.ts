// ============================================================
// Admin auth — client-side demo only (no real security)
// ============================================================
import { DEMO_CREDENTIALS } from "@/lib/admin-data";

const KEY = "crema_admin_session";
const EVENT = "crema-auth-change";

export interface AdminSession {
  email: string;
  name: string;
  role: string;
}

export function login(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    const session: AdminSession = {
      email: DEMO_CREDENTIALS.email,
      name: DEMO_CREDENTIALS.name,
      role: DEMO_CREDENTIALS.role,
    };
    sessionStorage.setItem(KEY, JSON.stringify(session));
    window.dispatchEvent(new Event(EVENT));
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export const AUTH_EVENT = EVENT;
