import type { BrewRecipe } from "@/types/brew";
import { formatTime } from "@/lib/format";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

type BrewStepListProps = {
  recipe: BrewRecipe;
  currentStepIndex: number;
};

export function BrewStepList({ recipe, currentStepIndex }: BrewStepListProps) {
  const { locale } = useLocale();

  return (
    <div className="space-y-3">
      {recipe.steps.map((step, index) => {
        const active = index === currentStepIndex;
        const complete = index < currentStepIndex;
        return (
          <div
            key={step.id}
            aria-current={active ? "step" : undefined}
            className={`rounded-lg border p-4 transition ${
              active
                ? "border-coffee-dark bg-coffee-dark text-white"
                : complete
                  ? "border-coffee-border bg-coffee-background text-coffee-secondary"
                  : "border-coffee-border bg-coffee-card text-coffee-primary"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`text-xs font-semibold ${active ? "text-coffee-accent" : "text-coffee-secondary"}`}>
                  {formatTime(step.at)} / {step.water}
                </p>
                <h3 className="mt-1 text-base font-semibold">{getLocalizedText(step.title, locale)}</h3>
              </div>
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                  active ? "bg-white text-coffee-dark" : "bg-coffee-background text-coffee-secondary"
                }`}
              >
                {index + 1}
              </div>
            </div>
            <p className={`mt-3 text-sm leading-6 ${active ? "text-white/82" : "text-coffee-secondary"}`}>
              {getLocalizedText(step.instruction, locale)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
