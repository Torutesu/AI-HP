const trimOrUndefined = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

// Analytics / SEO verification identifiers are read at build time in this
// static-export project. Keep them in one place so we can switch tools without
// touching the layout again.
export const ANALYTICS = {
  gtmId: trimOrUndefined(process.env.NEXT_PUBLIC_GTM_ID),
  ga4Id: trimOrUndefined(process.env.NEXT_PUBLIC_GA4_ID),
  clarityId: trimOrUndefined(process.env.NEXT_PUBLIC_CLARITY_ID),
  cloudflareToken: trimOrUndefined(process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN),
};

export const SITE_VERIFICATION = {
  google: trimOrUndefined(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
  bing: trimOrUndefined(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION),
};
