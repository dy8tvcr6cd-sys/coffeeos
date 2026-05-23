"use client";

import { useEffect, useMemo, useState } from "react";
import type { LocalizedText } from "@/lib/i18n";
import type { LogoStatus } from "@/types/roastery";
import { getLocalizedText } from "@/lib/i18n";
import { useLocale } from "@/lib/useLocale";

type RoasteryLogoProps = {
  name: LocalizedText | string;
  logoUrl?: string | null;
  logoAlt?: string;
  logoStatus?: LogoStatus;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-xl"
};

const initialsMap: Record<string, string> = {
  "MOMOS COFFEE": "M",
  "KOOK COFFEE ROASTERS": "K",
  "ON ROASTERY": "ON",
  "NEW WAVE COFFEE ROASTERS": "NW",
  "COFFEE TEMPLE": "CT",
  "FRITZ COFFEE COMPANY": "F",
  "CENTER COFFEE": "C",
  "NAMUSAIRO COFFEE": "N",
  "COFFEE LIBRE": "CL",
  "BEAN BROTHERS": "BB"
};

function getInitials(name: string) {
  const normalized = name.replace(/[가-힣]/g, "").trim().toUpperCase();
  if (initialsMap[normalized]) {
    return initialsMap[normalized];
  }

  const compact = normalized || name;
  const words = compact.split(/\s+/).filter(Boolean);
  if (!words.length) {
    return "OS";
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function RoasteryLogo({ name, logoUrl, logoAlt, logoStatus = "placeholder", size = "md" }: RoasteryLogoProps) {
  const { locale } = useLocale();
  const [failed, setFailed] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const label = getLocalizedText(name, locale);
  const initials = useMemo(() => getInitials(getLocalizedText(name, "en") || label), [label, name]);
  const showImage = Boolean(logoUrl) && imageReady && !failed;

  useEffect(() => {
    setFailed(false);
    setImageReady(false);

    if (!logoUrl) {
      return;
    }

    let active = true;
    const testImage = new window.Image();
    testImage.onload = () => {
      if (active) {
        setImageReady(true);
      }
    };
    testImage.onerror = () => {
      if (active) {
        setFailed(true);
      }
    };
    testImage.src = logoUrl;

    return () => {
      active = false;
    };
  }, [logoUrl]);

  return (
    <div
      className={`${sizeClass[size]} relative grid shrink-0 place-items-center overflow-hidden rounded-lg border border-coffee-border bg-coffee-card text-center font-bold text-coffee-primary shadow-sm`}
      title={logoStatus === "local_test_only" ? "로컬 테스트 로고 자산" : label}
    >
      {showImage ? (
        <img
          src={logoUrl!}
          alt={logoAlt ?? `${label} logo`}
          className="h-full w-full object-contain p-2"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
