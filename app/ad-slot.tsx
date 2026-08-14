import { AdSlotRuntime } from "./ad-slot-runtime";
import siteData from "../public/site-data.json";

type AdFormat = "native" | "banner";

const ads: any = siteData.ads || {};

function placementFormat(id: string, requested?: AdFormat): AdFormat {
  if (requested) return requested;
  const configured = ads.placements?.[id]?.format;
  return configured === "banner" ? "banner" : "native";
}

export function AdSlot({ id, format }: { id: string; format?: AdFormat }) {
  const selected = placementFormat(id, format);
  const unit = ads.units?.[selected];
  const isEnabled = ads.enabled === true && ads.provider === "adsterra";

  if (!isEnabled || !unit) return null;
  if (ads.test_mode === true) {
    // Keep test mode inspectable without exposing provider/control-plane copy.
    // The slot geometry is enough for local layout QA; it is never an ad fill.
    return <aside className="ad-slot ad-slot--test" data-ad-slot={id} data-provider="adsterra" data-test-mode="true" data-ad-state="test" aria-label="Advertisement" />;
  }

  if (selected === "native") {
    const nativeMarkup = `<script async="async" data-cfasync="false" src="${unit.script_src}"></script><div id="${unit.container_id}"></div>`;
    return <aside className={`ad-slot ad-slot--${selected}`} data-ad-slot={id} data-provider="adsterra" data-ad-unit-id={String(unit.id)} data-ad-state="reserved" aria-label="Advertisement">
      <div className="ad-slot-code" dangerouslySetInnerHTML={{ __html: nativeMarkup }} />
      <AdSlotRuntime id={id} />
    </aside>;
  }

  const bannerOptions = `atOptions = { 'key' : '${unit.key}', 'format' : 'iframe', 'height' : ${unit.height}, 'width' : ${unit.width}, 'params' : {} };`;
  const bannerMarkup = `<script>${bannerOptions}</script><script data-cfasync="false" src="${unit.script_src}"></script>`;
  return <aside className={`ad-slot ad-slot--${selected}`} data-ad-slot={id} data-provider="adsterra" data-ad-unit-id={String(unit.id)} data-ad-state="reserved" aria-label="Advertisement">
    <div className="ad-slot-code" dangerouslySetInnerHTML={{ __html: bannerMarkup }} />
    <AdSlotRuntime id={id} />
  </aside>;
}
