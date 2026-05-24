"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, BookOpen, Coffee, Compass, FlaskConical, Home, Settings, Store } from "lucide-react";
import { useLocale } from "@/lib/useLocale";

const items = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/beans", labelKey: "beans", icon: Coffee },
  { href: "/roasteries", labelKey: "roasteries", icon: Store },
  { href: "/brew-diagnosis", labelKey: "brewDiagnosis", icon: FlaskConical },
  { href: "/my-recipes", labelKey: "myRecipes", icon: BookOpen },
  { href: "/archive", labelKey: "archive", icon: Archive },
  { href: "/recommend", labelKey: "taste", icon: Compass },
  { href: "/admin", labelKey: "admin", icon: Settings }
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="safe-bottom fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-coffee-border bg-coffee-card/95 px-3 pb-2 pt-2 backdrop-blur">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex min-w-[58px] flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-semibold transition ${
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
