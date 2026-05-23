import type { CupNoteStage } from "@/types/bean";
import { customerText } from "@/lib/customerDisplay";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

type CupNoteTimelineProps = {
  moments: CupNoteStage[];
};

export function CupNoteTimeline({ moments }: CupNoteTimelineProps) {
  const { locale, t } = useLocale();

  return (
    <div className="space-y-4">
      {moments.map((moment, index) => (
        <div key={moment.stage} className="grid grid-cols-[52px_1fr] gap-3">
          <div className="relative flex justify-center">
            <div className="z-10 grid h-11 w-11 place-items-center rounded-lg border border-coffee-border bg-coffee-background text-xs font-bold text-coffee-primary">
              {moment.stage}
            </div>
            {index < moments.length - 1 && (
              <div className="absolute top-11 h-[calc(100%+1rem)] w-px bg-coffee-border" />
            )}
          </div>
          <div className="rounded-lg border border-coffee-border bg-coffee-background p-4">
            <h3 className="text-base font-semibold text-coffee-primary">{moment.stage}</h3>
            <p className="mt-1 text-sm leading-6 text-coffee-secondary">
              {customerText(getLocalizedText(moment.description, locale), t("registeredSoon"))}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {moment.notes.map((note) => (
                <span
                  key={getLocalizedText(note.name, "ko")}
                  className="rounded-lg border px-3 py-2 text-sm font-medium text-coffee-secondary"
                  style={{ borderColor: note.color, backgroundColor: `${note.color}1A` }}
                >
                  {customerText(getLocalizedText(note.name, locale), t("registeredSoon"))}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
