import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  backHref?: string;
  action?: ReactNode;
};

export function PageHeader({ title, eyebrow, description, backHref, action }: PageHeaderProps) {
  return (
    <header className="px-5 pb-4 pt-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="뒤로"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-coffee-border bg-coffee-card text-coffee-primary"
          >
            <ArrowLeft size={18} />
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-coffee-dark text-sm font-bold text-white">
              OS
            </div>
            <span className="text-sm font-semibold text-coffee-secondary">CoffeeOS</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {action}
        </div>
      </div>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase text-coffee-accent">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold leading-tight text-coffee-primary">{title}</h1>
      {description && <p className="mt-3 text-base leading-7 text-coffee-secondary">{description}</p>}
    </header>
  );
}
