"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { BrewRecipe } from "@/types/brew";
import { formatTime } from "@/lib/format";
import { BrewStepList } from "@/components/BrewStepList";
import { SectionCard } from "@/components/SectionCard";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

type BrewTimerProps = {
  recipe: BrewRecipe;
};

export function BrewTimer({ recipe }: BrewTimerProps) {
  const { locale, t } = useLocale();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current >= recipe.totalTimeSeconds) {
          window.clearInterval(timer);
          return recipe.totalTimeSeconds;
        }
        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [recipe.totalTimeSeconds, running]);

  useEffect(() => {
    if (elapsed >= recipe.totalTimeSeconds) {
      setRunning(false);
    }
  }, [elapsed, recipe.totalTimeSeconds]);

  const currentStepIndex = useMemo(() => {
    const index = recipe.steps.findLastIndex((step) => elapsed >= step.at);
    return Math.max(index, 0);
  }, [elapsed, recipe.steps]);

  const currentStep = recipe.steps[currentStepIndex];
  const nextStep = recipe.steps[currentStepIndex + 1];
  const progress = Math.min(100, (elapsed / recipe.totalTimeSeconds) * 100);

  return (
    <div className="space-y-5">
      <SectionCard eyebrow={t("timer")} title={currentStep ? getLocalizedText(currentStep.title, locale) : t("start")}>
        <div className="rounded-lg bg-coffee-dark p-5 text-white">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/64">{t("timer")}</p>
              <p className="mt-1 text-5xl font-semibold tabular-nums">{formatTime(elapsed)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/64">{t("totalTime")}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{formatTime(recipe.totalTimeSeconds)}</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-lg bg-white/16">
            <div className="h-full rounded-lg bg-coffee-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRunning(true)}
            disabled={running || elapsed >= recipe.totalTimeSeconds}
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Play size={16} />
            {t("start")}
          </button>
          <button
            type="button"
            onClick={() => setRunning(false)}
            disabled={!running}
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Pause size={16} />
            {t("pause")}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setElapsed(0);
            }}
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-3 text-sm font-semibold text-coffee-primary"
          >
            <RotateCcw size={16} />
            {t("reset")}
          </button>
        </div>
      </SectionCard>

      <SectionCard title={t("nowBrewing")}>
        <div className="rounded-lg bg-coffee-background p-4">
          <p className="text-sm font-semibold text-coffee-primary">{currentStep?.water}</p>
          <p className="mt-2 text-sm leading-6 text-coffee-secondary">
            {getLocalizedText(currentStep?.instruction, locale)}
          </p>
        </div>
        <div className="mt-3 rounded-lg border border-dashed border-coffee-border p-4">
          <p className="text-xs font-semibold uppercase text-coffee-accent">{t("next")}</p>
          <p className="mt-1 text-sm font-semibold text-coffee-primary">
            {nextStep
              ? `${formatTime(nextStep.at)} ${getLocalizedText(nextStep.title, locale)}`
              : t("sensoryRecord")}
          </p>
        </div>
      </SectionCard>

      <SectionCard title={t("pouringGuide")}>
        <BrewStepList recipe={recipe} currentStepIndex={currentStepIndex} />
      </SectionCard>
    </div>
  );
}
