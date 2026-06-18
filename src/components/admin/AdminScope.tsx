"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { BoutiqueScope } from "@/lib/admin-data";

const KEY = "artigiano_admin_scope";
const listeners = new Set<() => void>();

function read(): BoutiqueScope {
  if (typeof window === "undefined") return "all";
  try {
    return (sessionStorage.getItem(KEY) as BoutiqueScope) || "all";
  } catch {
    return "all";
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== "undefined") window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", cb);
  };
}

/** Set the active gelateria scope (persisted) and notify all consumers. */
export function setAdminScope(scope: BoutiqueScope) {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(KEY, scope);
    } catch {
      /* ignore */
    }
  }
  listeners.forEach((l) => l());
}

/** Kept as a thin mount point in AdminGate; the scope itself is a global store. */
export function AdminScopeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * The active gelateria scope for the CRM, backed by sessionStorage via
 * useSyncExternalStore (server snapshot = "all", so no hydration mismatch and
 * no setState-in-effect). Persisted across admin navigation.
 */
export function useAdminScope() {
  const scope = useSyncExternalStore(subscribe, read, () => "all" as BoutiqueScope);
  const setScope = useCallback((s: BoutiqueScope) => setAdminScope(s), []);
  return { scope, setScope };
}
