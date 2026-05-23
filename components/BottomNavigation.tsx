"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Coffee, Compass, Home, Store } from "lucide-react";
import { useLocale } from "@/lib/useLocale";

const items = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/beans", labelKey: "beans", icon: Coffee },
  { href: "/roasteries", labelKey: "roasteries", icon: Store },
  { href: "/archive", labelKey: "archive", icon: Archive },
  { href: "/recommend", labelKey: "taste", icon: Compass }
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="safe-bottom fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-coffee-border bg-coffee-card/95 px-3 pb-2 pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition ${
                active ? "bg-coffee-dark text-white" : "text-coffee-secondary"
              }`}
            >
              <Icon size={18} />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
