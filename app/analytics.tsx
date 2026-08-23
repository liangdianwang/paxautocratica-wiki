import Script from "next/script";
import siteData from "../public/site-data.json";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
const plausibleScript = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT?.trim();
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
const productionHostname = new URL(siteData.site?.base_url || "https://paxautocratica.vip").hostname;

export function AnalyticsScripts() {
  if (!gaId && !plausibleScript && !plausibleDomain && !clarityId) return null;

  return <Script id="production-analytics" strategy="afterInteractive">
    {`(function(w,d,host,gaId,plausibleScript,plausibleDomain,clarityId){
if(w.location.hostname!==host)return;
function load(src,attrs){var s=d.createElement('script');s.async=true;s.src=src;Object.keys(attrs||{}).forEach(function(key){s.setAttribute(key,attrs[key]);});d.head.appendChild(s);return s;}
if(gaId){w.dataLayer=w.dataLayer||[];w.gtag=w.gtag||function(){w.dataLayer.push(arguments);};load('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(gaId));w.gtag('js',new Date());w.gtag('config',gaId);}
if(plausibleScript||plausibleDomain){w.plausible=w.plausible||function(){(w.plausible.q=w.plausible.q||[]).push(arguments);};w.plausible.init=w.plausible.init||function(i){w.plausible.o=i||{};};w.plausible.init();load(plausibleScript||'https://plausible.io/js/script.js',plausibleScript?{}:{'data-domain':plausibleDomain});}
if(clarityId){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(w,d,'clarity','script',clarityId);}
})(window,document,${JSON.stringify(productionHostname)},${JSON.stringify(gaId || "")},${JSON.stringify(plausibleScript || "")},${JSON.stringify(plausibleDomain || "")},${JSON.stringify(clarityId || "")});`}
  </Script>;
}
