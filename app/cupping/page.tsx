"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { SectionCard } from "@/components/SectionCard";
import { cuppingEvents } from "@/data/cuppingEvents";
import { getRoasteryById } from "@/data/roasteries";
import { getLocalizedText } from "@/lib/i18n";
import { getCuppingRsvps, toggleCuppingRsvp } from "@/lib/storage";
import { useLocale } from "@/lib/useLocale";

export default function CuppingPage() {
  const { locale, t } = useLocale();
  const [rsvps, setRsvps] = useState<string[]>([]);

  useEffect(() => {
    setRsvps(getCuppingRsvps());
  }, []);

  function handleRsvp(eventId: string) {
    setRsvps(toggleCuppingRsvp(eventId));
  }

  return (
    <>
      <PageHeader
        title={t("cupping")}
        eyebrow={t("culture")}
        description={t("homeDescription")}
      />
      <div className="space-y-5 px-5">
        <SectionCard title="CoffeeOS">
          <div className="grid gap-2">
            {[
              t("cupNoteTimeline"),
              t("saveSensoryRecord"),
              t("getRecommendations")
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg bg-coffee-background p-3 text-sm text-coffee-secondary">
                <Check size={16} className="mt-0.5 shrink-0 text-coffee-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <section className="space-y-4">
          {cuppingEvents.map((event) => {
            const joined = rsvps.includes(event.id);
            const roastery = getRoasteryById(event.roasteryId);
            return (
              <article key={event.id} className="rounded-lg border border-coffee-border bg-coffee-card p-5 shadow-soft">
                <div className="flex items-start gap-4">
                  {roastery && (
                    <RoasteryLogo
                      name={roastery.name}
                      logoUrl={roastery.logoUrl}
                      logoAlt={roastery.logoAlt}
                      logoStatus={roastery.logoStatus}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-coffee-accent">
                      {getLocalizedText(roastery?.name, locale) || "CoffeeOS"}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-coffee-primary">
                      {getLocalizedText(event.title, locale)}
                    </h2>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-coffee-secondary">{getLocalizedText(event.focus, locale)}</p>
                <div className="mt-4 grid gap-2">
                  <p className="inline-flex items-center gap-2 text-sm text-coffee-secondary">
                    <CalendarDays size={16} />
                    {event.date}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-coffee-secondary">
                    <MapPin size={16} />
                    {getLocalizedText(event.location, locale)}
                  </p>
                  <p className="inline-flex items-center gap-2 text-sm text-coffee-secondary">
                    <Users size={16} />
                    {event.seats}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRsvp(event.id)}
                  className={`focus-ring mt-5 inline-flex h-12 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold ${
                    joined
                      ? "border border-coffee-border bg-coffee-card text-coffee-primary"
                      : "bg-coffee-dark text-white"
                  }`}
                >
                  {joined ? t("cancelRsvp") : t("reserveSeat")}
                </button>
              </article>
            );
          })}
        </section>

        <Link
          href="/archive"
          className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg border border-coffee-border bg-coffee-card text-sm font-semibold text-coffee-primary"
        >
          {t("viewArchive")}
        </Link>
      </div>
    </>
  );
}
