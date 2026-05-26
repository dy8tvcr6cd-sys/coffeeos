const localHostnames = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const temporaryTunnelDomains = ["trycloudflare.com", "loca.lt", "ngrok-free.app", "ngrok.io"];

export function normalizeBaseUrl(value: string | null | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, "");

  if (!trimmed) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const pathname = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname === "/" ? "" : pathname}`;
  } catch {
    return "";
  }
}

export function getPublicSiteBaseUrl() {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL
  );
}

export function getCurrentBaseUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return normalizeBaseUrl(window.location.origin);
}

export function getShareBaseUrl() {
  return getPublicSiteBaseUrl() || getCurrentBaseUrl();
}

export function buildBeanShareUrl(beanId: string) {
  const baseUrl = getShareBaseUrl();

  if (!baseUrl) {
    return "";
  }

  return `${baseUrl}/beans/${encodeURIComponent(beanId)}`;
}

export function hasPublicSiteBaseUrl() {
  return Boolean(getPublicSiteBaseUrl());
}

export function isLocalUrl(value: string) {
  try {
    const hostname = new URL(value).hostname;
    return localHostnames.has(hostname) || hostname.endsWith(".local");
  } catch {
    return false;
  }
}

export function isTemporaryTunnelUrl(value: string) {
  try {
    const hostname = new URL(value).hostname;
    return temporaryTunnelDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}
