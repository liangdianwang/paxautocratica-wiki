"use client";

import { useEffect } from "react";

type AnalyticsParams = Record<string, string | number>;

type YouTubePlayer = {
  destroy: () => void;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (element: HTMLIFrameElement, options: {
        events: { onStateChange: (event: { data: number }) => void };
      }) => YouTubePlayer;
      PlayerState: { PLAYING: number };
    };
  }
}

const productionHostname = "paxautocratica.vip";

function sendEvent(name: string, params: AnalyticsParams) {
  if (window.location.hostname !== productionHostname || typeof window.gtag !== "function") return;
  window.gtag("event", name, { page_path: window.location.pathname, ...params });
}

export function AnalyticsEvents() {
  useEffect(() => {
    if (window.location.hostname !== productionHostname) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-analytics-event]") : null;
      if (!target || target.closest("[data-ad-slot]")) return;

      const eventName = target.dataset.analyticsEvent;
      if (eventName === "internal_recommendation_click") {
        const destination = new URL(target.href, window.location.href);
        if (destination.origin !== window.location.origin) return;
        sendEvent(eventName, {
          link_path: destination.pathname,
          placement: target.dataset.analyticsPlacement || "unknown",
        });
      }

      if (eventName === "outbound_source_click") {
        const destination = new URL(target.href, window.location.href);
        if (destination.origin === window.location.origin) return;
        sendEvent(eventName, {
          destination_host: destination.hostname,
          destination_path: destination.pathname,
          destination_type: target.dataset.analyticsDestination || "source",
          placement: target.dataset.analyticsPlacement || "unknown",
        });
      }
    };

    let sentScrollDepth = false;
    const handleScroll = () => {
      if (sentScrollDepth) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= 0.5) {
        sentScrollDepth = true;
        sendEvent("page_task_complete", { task: "scroll_50" });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}

export function YouTubeAnalytics({ iframeId }: { iframeId: string }) {
  useEffect(() => {
    if (window.location.hostname !== productionHostname) return;
    const iframe = document.getElementById(iframeId);
    if (!(iframe instanceof HTMLIFrameElement)) return;

    let player: YouTubePlayer | undefined;
    let sentPlayStart = false;
    let observer: IntersectionObserver | undefined;
    const previousReady = window.onYouTubeIframeAPIReady;

    const createPlayer = () => {
      if (!window.YT?.Player || player) return;
      player = new window.YT.Player(iframe, {
        events: {
          onStateChange: (event) => {
            if (!sentPlayStart && event.data === window.YT?.PlayerState.PLAYING) {
              sentPlayStart = true;
              sendEvent("youtube_play_start", { placement: "homepage_video" });
            }
          },
        },
      });
    };

    const loadApi = () => {
      if (window.YT?.Player) {
        createPlayer();
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer?.disconnect();
          loadApi();
        }
      }, { rootMargin: "200px" });
      observer.observe(iframe);
    } else {
      loadApi();
    }

    return () => {
      observer?.disconnect();
      player?.destroy();
      if (window.onYouTubeIframeAPIReady !== previousReady) window.onYouTubeIframeAPIReady = previousReady;
    };
  }, [iframeId]);

  return null;
}
