"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Check, ShoppingBag, Timer, Waves } from "lucide-react";
import { BeanCard } from "@/components/BeanCard";
import { CupNoteTimeline } from "@/components/CupNoteTimeline";
import { PageHeader } from "@/components/PageHeader";
import { RoasteryLogo } from "@/components/RoasteryLogo";
import { SectionCard } from "@/components/SectionCard";
import { getFarmById } from "@/data/farms";
import { getRoasteryById } from "@/data/roasteries";
import { customerText } from "@/lib/customerDisplay";
import { formatPrice, formatTime } from "@/lib/format";
import { addPurchaseIntent, getAllBeansClient, getBeanByIdClient, getRecipeByBeanIdClient } from "@/lib/storage";
import type { Bean } from "@/types/bean";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

export default function BeanDetailPage() {
  const { locale, t } = useLocale();
  const params = useParams<{ id: string }>();
  const [bean, setBean] = useState<Bean | undefined>();
  const [allBeans, setAllBeans] = useState<Bean[]>([]);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    setBean(getBeanByIdClient(params.id));
    setAllBeans(getAllBeansClient());
  }, [params.id]);

  const roastery = bean ? getRoasteryById(bean.roasteryId) : undefined;
  const farm = bean?.farmId ? getFarmById(bean.farmId) : undefined;
  const recipe = bean ? getRecipeByBeanIdClient(bean.id) : undefined;
  const similarBeans = useMemo(() => {
    if (!bean) {
      return [];
    }
    return bean.similarBeanIds
      .map((id) => allBeans.find((candidate) => candidate.id === id))
      .filter(Boolean) as Bean[];
  }, [allBeans, bean]);

  if (!bean) {
    return (
      <>
        <PageHeader title={t("pageNotFound")} backHref="/beans" />
        <div className="px-5">
          <Link
            href="/beans"
            className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
          >
            {t("beans")}
          </Link>
        </div>
      </>
    );
  }

  const details = [
    [t("roastery"), getLocalizedText(roastery?.name, locale) || "CoffeeOS"],
    [t("country"), customerText(getLocalizedText(bean.country, locale), t("registeredSoon"))],
    [t("region"), customerText(getLocalizedText(bean.region, locale), t("registeredSoon"))],
    [t("farm"), customerText(getLocalizedText(bean.farm, locale), t("registeredSoon"))],
    [t("producer"), customerText(getLocalizedText(bean.producer, locale), t("registeredSoon"))],
    [t("variety"), bean.variety],
    [t("altitude"), bean.altitude],
    [t("process"), customerText(getLocalizedText(bean.process, locale), t("registeredSoon"))],
    [t("roastLevel"), customerText(bean.roastLevel, t("registeredSoon"))],
    [t("harvest"), bean.harvestPeriod],
    [t("moisture"), bean.moisture],
    [t("density"), bean.density]
  ];

  function purchase(currentBean: Bean) {
    addPurchaseIntent({
      id: `${currentBean.id}-${Date.now()}`,
      beanId: currentBean.id,
      beanName: getLocalizedText(currentBean.name, locale),
      price: currentBean.price,
      createdAt: new Date().toISOString()
    });
    setPurchased(true);
  }

  const beanName = getLocalizedText(bean.name, locale);
  const roasteryName = getLocalizedText(roastery?.name, locale) || "CoffeeOS";
  const description = [
    customerText(getLocalizedText(bean.country, locale), ""),
    customerText(getLocalizedText(bean.region, locale), ""),
    customerText(getLocalizedText(bean.process, locale), "")
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <>
      <PageHeader
        title={beanName}
        eyebrow={roasteryName}
        description={description}
        backHref="/beans"
      />
      <div className="space-y-5 px-5">
        <SectionCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-coffee-secondary">{t("currentPrice")}</p>
              <p className="mt-1 text-2xl font-semibold text-coffee-primary">
                {bean.price ? formatPrice(bean.price) : t("registeredSoon")}
              </p>
            </div>
            <div className="rounded-lg bg-coffee-background px-3 py-2 text-sm font-semibold text-coffee-secondary">
              {customerText(bean.roastLevel, t("registeredSoon"))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => purchase(bean)}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-coffee-dark px-2 text-sm font-semibold text-white"
            >
              {purchased ? <Check size={16} /> : <ShoppingBag size={16} />}
              {purchased ? t("saved") : t("buy")}
            </button>
            <Link
              href={`/beans/${bean.id}/brew`}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-2 text-sm font-semibold text-coffee-primary"
            >
              <Timer size={16} />
              {t("brew")}
            </Link>
            <Link
              href={`/beans/${bean.id}/sensory`}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-coffee-border bg-coffee-card px-2 text-sm font-semibold text-coffee-primary"
            >
              <Waves size={16} />
              {t("record")}
            </Link>
          </div>
        </SectionCard>

        {roastery && (
          <SectionCard title={t("roastery")}>
            <div className="flex items-center gap-4">
              <RoasteryLogo
                name={roastery.name}
                logoUrl={roastery.logoUrl}
                logoAlt={roastery.logoAlt}
                logoStatus={roastery.logoStatus}
                size="lg"
              />
              <div>
                <h2 className="text-lg font-semibold text-coffee-primary">{roasteryName}</h2>
                <p className="mt-1 text-sm leading-6 text-coffee-secondary">
                  {getLocalizedText(roastery.description, locale)}
                </p>
              </div>
            </div>
          </SectionCard>
        )}

        <SectionCard title={t("beanIdentity")}>
          <div className="grid grid-cols-2 gap-2">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-coffee-background p-3">
                <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">
                  {customerText(value, t("registeredSoon"))}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t("cupNoteTimeline")}>
          <CupNoteTimeline moments={bean.cupNotes} />
        </SectionCard>

        <SectionCard title={t("roastingIntent")}>
          <p className="text-base leading-7 text-coffee-secondary">
            {customerText(getLocalizedText(bean.roastingIntent, locale), t("registeredSoon"))}
          </p>
        </SectionCard>

        <SectionCard
          title={t("farmStory")}
          eyebrow={
            customerText(getLocalizedText(farm?.producer ?? bean.producer, locale), "") ||
            customerText(getLocalizedText(bean.farm, locale), "")
          }
        >
          <p className="text-base leading-7 text-coffee-secondary">
            {customerText(getLocalizedText(farm?.story ?? bean.farmStory, locale), t("registeredSoon"))}
          </p>
        </SectionCard>

        {recipe && (
          <SectionCard
            title={t("recommendedRecipe")}
            action={
              <Link
                href={`/beans/${bean.id}/brew`}
                className="focus-ring inline-flex h-9 items-center justify-center rounded-lg bg-coffee-dark px-3 text-sm font-semibold text-white"
              >
                {t("start")}
              </Link>
            }
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                [t("brewer"), recipe.brewer],
                [t("grindSize"), recipe.grindSize],
                [t("waterTemperature"), recipe.waterTemperature],
                [t("coffeeAmount"), `${recipe.coffeeAmount} / ${recipe.waterAmount}`],
                [t("ratio"), recipe.ratio],
                [t("totalTime"), formatTime(recipe.totalTimeSeconds)]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-coffee-background p-3">
                  <p className="text-xs font-semibold uppercase text-coffee-secondary">{label}</p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-coffee-primary">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 inline-flex items-start gap-2 text-sm leading-6 text-coffee-secondary">
              <BookOpen className="mt-0.5 shrink-0" size={16} />
              {customerText(getLocalizedText(recipe.intent, locale), t("registeredSoon"))}
            </p>
          </SectionCard>
        )}

        {bean.purchaseUrl && (
          <SectionCard title={t("purchaseUrl")}>
            <a
              href={bean.purchaseUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex h-12 w-full items-center justify-center rounded-lg bg-coffee-dark px-4 text-sm font-semibold text-white"
            >
              {t("buy")}
            </a>
          </SectionCard>
        )}

        <section>
          <h2 className="mb-3 text-lg font-semibold text-coffee-primary">{t("similarBeans")}</h2>
          <div className="space-y-3">
            {similarBeans.map((similarBean) => (
              <BeanCard key={similarBean.id} bean={similarBean} compact />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
