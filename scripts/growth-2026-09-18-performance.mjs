import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-performance.mdx");

const checkedAt = "2026-09-18T09:18:00+08:00";
const slug = "pax-autocratica-performance";
const url = `https://paxautocratica.vip/${slug}/`;

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));

function uniquePush(array, item, key = (value) => value) {
  const id = key(item);
  if (!array.some((value) => key(value) === id)) array.push(item);
}

function replaceOrPush(array, item, key = (value) => value.slug) {
  const index = array.findIndex((value) => key(value) === key(item));
  if (index >= 0) array[index] = item;
  else array.push(item);
}

const claimIds = [
  "claim-performance-official-requirements-20260918",
  "claim-performance-st11-optimizations-20260918",
  "claim-performance-reporting-path-20260918",
  "claim-performance-current-player-demand-20260918",
  "claim-performance-no-universal-fix-20260918"
];

const page = {
  keyword: "Pax Autocratica Performance",
  slug,
  seo: {
    title: "Pax Autocratica Performance: FPS, GPU Heat and Crash Checks",
    description:
      "A source-backed Pax Autocratica performance guide for FPS drops, GPU heat, loading issues and crash reporting, using current Steam requirements and official troubleshooting."
  },
  direct_answer:
    "If Pax Autocratica runs hot, drops frames, hangs on loading or crashes, start with the official baseline before chasing random fixes: compare your PC with the Steam requirements, verify game files, test Super Resolution and Frame Generation off, cap the frame rate or use VSync, then report persistent issues in-game with the K key or the official bug form. The latest captured official patch notes say ST-11 reduced VRAM usage, improved overall performance, adjusted default frame-rate behavior and fixed some crashes/loading failures, but they do not promise a universal FPS target for every GPU or base size.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "First check the hardware baseline",
      paragraphs: [
        "Steam lists Pax Autocratica as a Windows 10 64-bit Early Access game with 16 GB RAM required. The minimum graphics baseline is a GTX 1060 6 GB or RX 480 for 1080p, and a GTX 1070 8 GB or Radeon RX Vega 56 for 1440p. The recommended graphics baseline is a GTX 2060 Super or RX 5700 XT with 8 GB or more of VRAM.",
        "That matters because a current Steam discussion describes high GPU temperatures and frame drops even while using Low settings and DLSS on a 2070 Super. Treat that as a real player-demand signal, not proof that every 2070 Super system will behave the same way."
      ],
      steps: [
        "Confirm the target resolution first: 1080p and 1440p have different official GPU expectations.",
        "Check whether the GPU has the VRAM level Steam lists for your target resolution.",
        "If your system is below or near the baseline, lower resolution before assuming the save is broken."
      ],
      claim_ids: [
        "claim-performance-official-requirements-20260918",
        "claim-performance-current-player-demand-20260918"
      ]
    },
    {
      heading: "Use the official troubleshooting order",
      paragraphs: [
        "The pinned Steam troubleshooting post gives a safe order for stuck, crashing or save-read problems. It points players to Steam file verification, turning off Super Resolution if enabled, turning off Frame Generation if enabled, using VSync or an in-game maximum frame rate, restarting the PC and reinstalling only as a last resort.",
        "Use those steps because they are reversible and evidence-led. They do not require editing game files, downloading third-party tools or applying advice from unrelated Unity games."
      ],
      steps: [
        "Verify integrity of game files in Steam.",
        "Disable Super Resolution or DLSS for one test run.",
        "Disable Frame Generation for one test run.",
        "Turn VSync on or set a maximum frame rate in-game.",
        "Restart and retest the same save or same expedition scene.",
        "Only reinstall after the smaller checks fail."
      ],
      claim_ids: [
        "claim-performance-reporting-path-20260918",
        "claim-performance-no-universal-fix-20260918"
      ]
    },
    {
      heading: "What ST-11 already changed",
      paragraphs: [
        "Directive ST-11 is still the latest official Steam News item captured today. It says the team optimized loading to prevent stuck or failed starts under certain circumstances, reduced VRAM usage, improved overall performance, made the first launch use the current display refresh rate as the default frame-rate limit, and gave loading screens a separate frame-rate limit.",
        "Earlier official notes also mention improved Low graphics behavior, base performance, smoke and fire effects, model rendering and scene loading efficiency. Those notes are useful context, but they are not a promise that every hot GPU, large base or expedition firefight is fully solved."
      ],
      steps: [
        "Update to the current Steam build before testing old performance advice.",
        "Retest loading, base view and end-of-expedition firefights separately.",
        "Record whether the problem is heat, frame time spikes, loading, a crash or a save-read failure."
      ],
      claim_ids: [
        "claim-performance-st11-optimizations-20260918",
        "claim-performance-no-universal-fix-20260918"
      ]
    },
    {
      heading: "When to report instead of tweaking",
      paragraphs: [
        "A moderator reply in the current Performance discussion says ongoing performance updates are planned and asks affected players to report performance issues in-game with the K key. The pinned bug-reporting post also says detailed form reports need player logs and save files.",
        "That is the turning point: if a repeatable scene still overheats, drops frames or crashes after the safe checks, stop changing settings and send the developers the build, save, logs and scene context. A vague forum complaint is weaker than a reproducible report with files."
      ],
      steps: [
        "Open the problem save and note the exact place: main base, expedition, loading screen or final firefight.",
        "Use the K key in-game for the first report.",
        "Use the official bug form for persistent issues and attach logs plus save files when requested.",
        "Mention GPU model, resolution, Low/Medium/High setting, Super Resolution state, Frame Generation state and frame cap."
      ],
      claim_ids: [
        "claim-performance-reporting-path-20260918",
        "claim-performance-current-player-demand-20260918"
      ]
    },
    {
      heading: "What this guide will not claim",
      paragraphs: [
        "This page does not publish an FPS chart, a safe GPU-temperature target, a launch option list or a registry edit. The captured evidence supports official requirements, official patch context, official-style troubleshooting and a current player report, but it does not support a universal performance recipe.",
        "Keep ultrawide blur, Steam Deck keyboard behavior and individual crash cases separate. Use the performance page for heat, frame drops, loading and general stability; use more specific pages when the symptom has its own evidence."
      ],
      steps: [
        "Do not copy settings from a different GPU generation without testing.",
        "Do not treat one volunteer test comment as an official benchmark.",
        "Do not install third-party fix tools from community comments."
      ],
      claim_ids: [
        "claim-performance-no-universal-fix-20260918"
      ]
    }
  ],
  faq: [
    {
      question: "Does Pax Autocratica have official system requirements?",
      answer:
        "Yes. Steam lists Windows 10 64-bit, 16 GB RAM, DirectX 11, 40 GB storage, and GPU baselines for 1080p, 1440p and recommended play."
    },
    {
      question: "Did ST-11 fix all performance problems?",
      answer:
        "No. ST-11 lists loading, VRAM, frame-rate and crash improvements, but the current Performance discussion still shows players reporting hot GPU and frame-drop issues."
    },
    {
      question: "What should I try first for crashes or stuck loading?",
      answer:
        "Use Steam file verification, disable Super Resolution and Frame Generation for testing, cap the frame rate or turn VSync on, then report persistent issues with logs and saves."
    },
    {
      question: "Should I edit config files or install a third-party performance fix?",
      answer:
        "Not from the captured evidence. Start with reversible official troubleshooting and avoid untrusted downloads unless Multiverse or Steam confirms them."
    }
  ],
  source_ids: [
    "src-steam-store-20260918",
    "src-steam-news-st11-20260918",
    "src-steam-discussion-bug-reporting-20260918",
    "src-steam-discussion-performance-20260918",
    "src-steam-discussions-index-20260918"
  ],
  related_slugs: [
    "pax-autocratica-st11-patch-notes",
    "pax-autocratica-ultrawide-blurry",
    "pax-autocratica-save-wipe",
    "pax-autocratica-community"
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index"
};

replaceOrPush(data.pages, page);

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const statusGroup = guide.groups.find((group) => group.title === "Access, media and current status");
  if (statusGroup) uniquePush(statusGroup.slugs, slug, (value) => value);
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, roadmap status, expeditions, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-18"];
}
if (data.metadata) {
  data.metadata.description = data.home.meta.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica performance, FPS drops, GPU heat, crash fix, loading issue, ST-11 patch, Super Resolution, Frame Generation, VSync, Steam file verification, Early Access, gameplay, capture mechanics, expeditions, demo, price, trailer, mods, community";
}

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260918-performance",
  intent_type: "technical_troubleshooting",
  user_job:
    "Help players triage Pax Autocratica FPS drops, GPU heat, loading failures and crashes without inventing unsupported settings.",
  intent_evidence_ids: [
    "src-steam-discussion-performance-20260918",
    "src-steam-discussion-bug-reporting-20260918",
    "src-steam-news-st11-20260918",
    "src-steam-store-20260918"
  ],
  answerability: "resolved_as_reversible_troubleshooting_and_reporting_path",
  coverage: [
    {
      dimension: "hardware_baseline",
      status: "covered",
      claim_ids: ["claim-performance-official-requirements-20260918"],
      evidence_relation: "official_store_requirements",
      notes: "Steam requirements define Windows, RAM, DirectX, storage and GPU baselines."
    },
    {
      dimension: "current_patch_context",
      status: "covered",
      claim_ids: ["claim-performance-st11-optimizations-20260918"],
      evidence_relation: "official_steam_news",
      notes: "ST-11 and earlier official notes provide loading, VRAM, frame-rate and Low graphics context."
    },
    {
      dimension: "safe_user_actions",
      status: "covered",
      claim_ids: ["claim-performance-reporting-path-20260918"],
      evidence_relation: "pinned_moderator_troubleshooting_post",
      notes: "The pinned bug-reporting thread gives reversible checks and reporting requirements."
    },
    {
      dimension: "universal_fps_fix",
      status: "blocked",
      claim_ids: ["claim-performance-no-universal-fix-20260918"],
      evidence_relation: "evidence_boundary",
      notes: "No captured source provides a universal FPS target, launch options or GPU-temperature rule."
    }
  ],
  source_links: [
    {
      label: "Pax Autocratica Steam store",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store"
    },
    {
      label: "Steam News API: Directive ST-11",
      url: "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json",
      source_type: "official_announcement"
    },
    {
      label: "Steam discussion: Help My Game Is Bugged/Glitched/Broken",
      url: "https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/",
      source_type: "official_moderator_troubleshooting"
    },
    {
      label: "Steam discussion: Performance",
      url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169858415/",
      source_type: "community_demand_with_moderator_reply"
    },
    {
      label: "Steam General Discussions",
      url: "https://steamcommunity.com/app/1067360/discussions/",
      source_type: "community_context"
    }
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-performance",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct performance troubleshooting task using official requirements, official patch notes, pinned reporting guidance and a current player report, while refusing unsupported FPS or config claims."
};

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-performance-20260918",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica field guide scene used for the performance troubleshooting guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Supports a technical guide without introducing an unverified external image."
}, (item) => item.asset_id);

if (data.site) data.site.version = "local-pending-performance";
data.generated_at = checkedAt;

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const publicPages = data.pages.filter((item) => item.page_status === "publish" && item.index_status === "index");
const lastmods = new Map([
  ["", "2026-09-18"],
  ["guide", "2026-09-18"],
  [slug, "2026-09-18"]
]);
for (const item of publicPages) {
  if (!lastmods.has(item.slug)) lastmods.set(item.slug, (item.updated_at || "").slice(0, 10) || "2026-08-14");
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://paxautocratica.vip/</loc><lastmod>${lastmods.get("")}</lastmod></url>\n  <url><loc>https://paxautocratica.vip/guide/</loc><lastmod>${lastmods.get("guide")}</lastmod></url>\n${publicPages.map((item) => `  <url><loc>https://paxautocratica.vip/${item.slug}/</loc><lastmod>${lastmods.get(item.slug)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(sitemapPath, sitemap, "utf8");

const mdx = `# ${page.keyword}\n\n${page.direct_answer}\n\n${page.sections.map((section) => {
  const body = section.paragraphs.join("\n\n");
  const steps = section.steps?.length ? `\n\n${section.steps.map((step) => `1. ${step}`).join("\n")}` : "";
  return `## ${section.heading}\n\n${body}${steps}`;
}).join("\n\n")}\n\n## FAQ\n\n${page.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}\n\n## Sources\n\n- [Pax Autocratica Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)\n- [Steam News API: Directive ST-11](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json)\n- [Steam discussion: Help My Game Is Bugged/Glitched/Broken](https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/)\n- [Steam discussion: Performance](https://steamcommunity.com/app/1067360/discussions/0/564794139169858415/)\n- [Steam General Discussions](https://steamcommunity.com/app/1067360/discussions/)\n\nLast checked: ${checkedAt}\n`;
fs.writeFileSync(contentPath, mdx, "utf8");

console.log(JSON.stringify({ slug, url, checkedAt, pages: data.pages.length }, null, 2));
