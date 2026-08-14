"use client";

import { useEffect, useRef } from "react";
import siteData from "../public/site-data.json";

type AdFormat = "native" | "banner";

const ads: any = siteData.ads || {};

function placementFormat(id: string, requested?: AdFormat): AdFormat {
  if (requested) return requested;
  const configured = ads.placements?.[id]?.format;
  return configured === "banner" ? "banner" : "native";
}

export function AdSlot({ id, format }: { id: string; format?: AdFormat }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const selected = placementFormat(id, format);
  const unit = ads.units?.[selected];
  const isEnabled = ads.enabled === true && ads.provider === "adsterra";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isEnabled || ads.test_mode === true || !unit) return;

    root.replaceChildren();
    root.dataset.adState = "loading";
    const markReady = () => { root.dataset.adState = "ready"; };
    const markEmpty = () => { root.dataset.adState = "empty"; };

    if (selected === "native") {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = unit.script_src;
      script.addEventListener("load", markReady, { once: true });
      script.addEventListener("error", markEmpty, { once: true });
      const container = document.createElement("div");
      container.id = unit.container_id;
      root.append(script, container);
    } else {
      const options = document.createElement("script");
      options.text = `atOptions = ${JSON.stringify({
        key: unit.key,
        format: "iframe",
        height: unit.height,
        width: unit.width,
        params: {}
      })};`;
      const script = document.createElement("script");
      script.src = unit.script_src;
      script.addEventListener("load", markReady, { once: true });
      script.addEventListener("error", markEmpty, { once: true });
      root.append(options, script);
    }

    return () => { root.replaceChildren(); };
  }, [isEnabled, selected, unit]);

  if (!isEnabled || !unit) return null;
  if (ads.test_mode === true) {
    return <aside className="ad-slot ad-slot--test" data-ad-slot={id} data-provider="adsterra" data-test-mode="true" aria-label="Advertisement"><span>Adsterra test placeholder</span></aside>;
  }

  return <aside ref={rootRef} className={`ad-slot ad-slot--${selected}`} data-ad-slot={id} data-provider="adsterra" data-ad-unit-id={String(unit.id)} data-ad-state="reserved" aria-label="Advertisement" />;
}
