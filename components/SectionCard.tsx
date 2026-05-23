import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ title, eyebrow, action, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-lg border border-coffee-border bg-coffee-card p-5 shadow-soft ${className}`}>
      {(title || eyebrow || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-1 text-xs font-semibold uppercase text-coffee-accent">{eyebrow}</p>
            )}
            {title && <h2 className="text-lg font-semibold text-coffee-primary">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

