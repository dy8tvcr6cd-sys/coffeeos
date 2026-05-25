"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { useLocale } from "@/lib/useLocale";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const path = pathname || "/";
    const search = window.location.search;
    const returnTo = `${path}${search}`;
    const user = getCurrentUser();

    if (path === "/login" && user) {
      setAllowed(false);
      router.replace("/");
      return;
    }

    if (isPublicRoute(path)) {
      setAllowed(true);
      return;
    }

    if (path.startsWith("/roastery-admin") && !user) {
      setAllowed(false);
      router.replace(`/roastery-admin/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    if (!user) {
      setAllowed(false);
      router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  if (!allowed) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-center">
        <div>
          <p className="text-sm font-semibold text-coffee-accent">CoffeeOS</p>
          <p className="mt-3 text-base font-semibold text-coffee-primary">{t("redirectingAfterLogin")}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function isPublicRoute(pathname: string) {
  if (pathname === "/login" || pathname === "/signup") {
    return true;
  }

  if (pathname === "/roastery-admin/login" || pathname === "/roastery-admin/signup") {
    return true;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "beans") {
    return (
      segments.length === 1 ||
      segments.length === 2 ||
      (segments.length === 3 && segments[2] === "brew")
    );
  }

  if (segments[0] === "roasteries") {
    return segments.length === 1 || segments.length === 2;
  }

  return false;
}
