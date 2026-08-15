"use client";

import { useEffect } from "react";

function findSlot(id: string): HTMLElement | null {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-ad-slot]"))
    .find((element) => element.dataset.adSlot === id) || null;
}

export function AdSlotRuntime({ id }: { id: string }) {
  useEffect(() => {
    const root = findSlot(id);
    if (!root) return;

    const hasCreative = () => Boolean(root.querySelector("iframe, img, video, canvas, [data-ad], [data-adsterra]"));
    const markFilled = () => {
      if (hasCreative()) {
        root.dataset.adState = "filled";
        root.dispatchEvent(new CustomEvent("adsterra:filled", { bubbles: true }));
      }
    };
    const markScriptLoaded = () => {
      if (root.dataset.adState !== "filled") root.dataset.adState = "script_loaded";
      window.setTimeout(markFilled, 250);
    };
    const markEmpty = () => {
      if (root.dataset.adState === "filled") return;
      root.dataset.adState = "empty";

      // Never remove provider markup after a timeout/error. The ad network may
      // respond later, and removing the scripts makes the live page impossible
      // to inspect or recover without a full navigation.
      if (!root.querySelector(".ad-slot-fallback")) {
        const label = document.createElement("span");
        label.className = "ad-slot-fallback";
        label.textContent = "Advertisement space reserved";
        root.append(label);
      }
    };

    root.dataset.adState = hasCreative() ? "filled" : "loading";
    const observer = new MutationObserver(markFilled);
    observer.observe(root, { childList: true, subtree: true, attributes: true });

    const scripts = Array.from(root.querySelectorAll<HTMLScriptElement>("script[src]"));
    scripts.forEach((script) => {
      script.addEventListener("load", markScriptLoaded, { once: true });
      script.addEventListener("error", markEmpty, { once: true });
    });

    const emptyTimer = window.setTimeout(() => {
      if (hasCreative()) markFilled();
      else markEmpty();
    }, 8000);

    return () => {
      window.clearTimeout(emptyTimer);
      observer.disconnect();
      scripts.forEach((script) => {
        script.removeEventListener("load", markScriptLoaded);
        script.removeEventListener("error", markEmpty);
      });
    };
  }, [id]);

  return null;
}
