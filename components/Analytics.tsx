"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { ANALYTICS } from "@/lib/analytics";
import { trackPageView } from "@/lib/analytics-client";

export default function Analytics() {
  const { gtmId, ga4Id, clarityId, cloudflareToken } = ANALYTICS;
  const hasGtm = Boolean(gtmId);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  return (
    <>
      {hasGtm ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
            `}
          </Script>
          <Script
            id="gtm-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : ga4Id ? (
        <>
          <Script
            id="ga4-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                send_page_view: false
              });
            `}
          </Script>
        </>
      ) : null}

      {clarityId ? (
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r); t.async=1; t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      ) : null}

      {cloudflareToken ? (
        <Script
          id="cloudflare-web-analytics"
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: cloudflareToken })}
        />
      ) : null}
    </>
  );
}
