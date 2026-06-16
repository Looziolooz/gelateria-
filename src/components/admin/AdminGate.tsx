"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, AUTH_EVENT } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { Emblem } from "@/components/icons";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setAuthed(!!getSession());
    check();
    window.addEventListener(AUTH_EVENT, check);
    return () => window.removeEventListener(AUTH_EVENT, check);
  }, []);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (authed === false && !isLogin) {
      router.replace("/admin/login");
    }
  }, [authed, isLogin, router]);

  // The login page renders its own full-screen layout.
  if (isLogin) return <>{children}</>;

  if (authed === null || authed === false) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#f4f0e4]">
        <div className="flex flex-col items-center gap-3 text-secondary/70">
          <Emblem className="h-12 w-auto text-primary animate-pulse" />
          <p className="text-sm">Caricamento…</p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
