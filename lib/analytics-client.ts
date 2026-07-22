"use client";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

const cleanParams = (params?: AnalyticsParams) =>
  Object.fromEntries(Object.entries(params ?? {}).filter(([, value]) => value !== undefined));

export function pushAnalyticsEvent(eventName: string, params?: AnalyticsParams) {
  const payload = { event: eventName, ...cleanParams(params) };

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, cleanParams(params));
    }
  }
}

export function trackCtaClick(label: string, href?: string, location?: string) {
  pushAnalyticsEvent("cta_click", { label, href, location });
}

export function trackLeadSubmit(type: "contact" | "download" | "recruiting", status: "success" | "error", detail?: string) {
  pushAnalyticsEvent("lead_submit", { type, status, detail });
}

export function trackPageView(path: string, title?: string) {
  pushAnalyticsEvent("page_view", { page_path: path, page_title: title });
}
