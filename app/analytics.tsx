import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
const plausibleScript = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT?.trim() || "https://plausible.io/js/script.js";
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();

export function AnalyticsScripts() {
  return <>
    {gaId ? <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});`}
      </Script>
    </> : null}
    {plausibleDomain ? <Script
      id="plausible-analytics"
      strategy="afterInteractive"
      src={plausibleScript}
      data-domain={plausibleDomain}
    /> : null}
    {clarityId ? <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", ${JSON.stringify(clarityId)});`}
    </Script> : null}
  </>;
}
