import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-soundtrack.mdx");
const checkedAt = "2026-09-21T09:20:00+08:00";
const runDate = "2026-09-21";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-soundtrack";

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
  "claim-soundtrack-request-forwarded-20260921",
  "claim-soundtrack-probably-later-unsure-20260921",
  "claim-soundtrack-steam-search-zero-results-20260921",
  "claim-soundtrack-dlc-page-no-ost-item-20260921",
  "claim-soundtrack-repeat-player-demand-20260921",
  "claim-soundtrack-no-download-link-boundary-20260921",
];

const soundtrackPage = {
  keyword: "Pax Autocratica Soundtrack",
  slug,
  seo: {
    title: "Pax Autocratica Soundtrack: OST Status and Where to Check",
    description:
      "A source-backed Pax Autocratica soundtrack and OST status guide: current Steam search/DLC checks, community requests, and the boundary around future music releases.",
  },
  direct_answer:
    "No public Pax Autocratica soundtrack or OST purchase page was captured today. A Steam store search for Pax Autocratica Soundtrack returned 0 matching results, and the Steam DLC page for App ID 1067360 did not expose a soundtrack item in the captured page. Community demand is real: multiple Steam discussions ask whether the soundtrack or BGM will be released on Steam, streaming services, or as an OST. Gurttron replied that one request would be forwarded for review and, in an older OST question, said it would probably be released later but was unsure. Treat that as interest and an unconfirmed future possibility, not a release date, a store listing, or permission to download ripped tracks.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "Current availability",
      paragraphs: [
        "The safest current answer is no captured official soundtrack listing. The Steam store search page for Pax Autocratica Soundtrack returned 0 matching results, and the Steam DLC page for Pax Autocratica did not show an OST item in the captured page.",
        "That does not prove a soundtrack will never exist. It only means players should not rely on old comments, uploads or search snippets as if an official purchase page is live today.",
      ],
      steps: [
        "Check the Pax Autocratica Steam store page first.",
        "Open the Steam DLC page for App ID 1067360 and look for an actual soundtrack item.",
        "Search Steam for Pax Autocratica Soundtrack before trusting a third-party download.",
        "If the Steam search still returns 0 results, treat the OST as not publicly listed on Steam.",
      ],
      claim_ids: [
        "claim-soundtrack-steam-search-zero-results-20260921",
        "claim-soundtrack-dlc-page-no-ost-item-20260921",
      ],
    },
    {
      heading: "What the Steam discussions show",
      paragraphs: [
        "There are repeated player requests rather than one isolated mention. A current Steam discussion titled Soundtrack asks whether the soundtrack or BGM could be released on Steam. Another thread says the full soundtrack should go up on streaming. An older OST question asks where to get the soundtrack.",
        "This supports a real player task: people want to know whether the music can be bought, streamed or safely found. It does not support inventing track names, composer credits, prices or a release schedule.",
      ],
      steps: [
        "Use these threads as demand evidence and status context.",
        "Do not quote player praise as a factual release announcement.",
        "Recheck official Steam News before saying the OST has launched.",
      ],
      claim_ids: [
        "claim-soundtrack-repeat-player-demand-20260921",
        "claim-soundtrack-no-download-link-boundary-20260921",
      ],
    },
    {
      heading: "What Gurttron's replies mean",
      paragraphs: [
        "In the current Soundtrack thread, Gurttron replies that the request is being forwarded for further review. In an older OST request, Gurttron says the soundtrack would probably be released later, but was unsure.",
        "Those replies are useful because they explain why the status is not simply no interest. They are still not a dated official release plan. A cautious page should say forwarded or possible later, not coming soon.",
      ],
      steps: [
        "Treat forwarded for review as a request status, not approval.",
        "Treat probably later, unsure as uncertainty, not a promise.",
        "Only update the page to released when a Steam store, Steam News or official channel publishes a concrete soundtrack link.",
      ],
      claim_ids: [
        "claim-soundtrack-request-forwarded-20260921",
        "claim-soundtrack-probably-later-unsure-20260921",
      ],
    },
    {
      heading: "Safe ways to follow the OST",
      paragraphs: [
        "The safe route is boring but important: use official store, Steam News and Steam Community links. Avoid uploads or download packs that do not identify a rights holder, because a soundtrack request does not create redistribution permission.",
        "If Multiverse publishes a soundtrack later, this page should switch from status tracking to a buyer checklist: store link, platform, included tracks, price, region, and whether it is separate DLC or a bundle item.",
      ],
      steps: [
        "Wishlist or follow the base game on Steam if you want release notifications.",
        "Watch the Steam discussion thread for moderator or developer follow-up.",
        "Avoid unofficial OST downloads unless the rights holder clearly published them.",
        "Save the store page URL rather than reposting music files.",
      ],
      claim_ids: [
        "claim-soundtrack-no-download-link-boundary-20260921",
        "claim-soundtrack-steam-search-zero-results-20260921",
      ],
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page does not claim an official Pax Autocratica OST is available, does not list tracks, does not name a composer, does not publish extracted files, and does not promise Steam or streaming release timing.",
        "The current evidence supports only a status answer: no captured public listing today, repeated player demand, and an acknowledged request that may be reviewed in the future.",
      ],
      steps: [
        "Update this page when a concrete official soundtrack page appears.",
        "Keep player requests separate from official release evidence.",
        "Use the trailer page for official video and music-adjacent media until an OST source exists.",
      ],
      claim_ids: [
        "claim-soundtrack-no-download-link-boundary-20260921",
        "claim-soundtrack-repeat-player-demand-20260921",
      ],
    },
  ],
  faq: [
    {
      question: "Is the Pax Autocratica soundtrack available on Steam?",
      answer:
        "No public soundtrack listing was captured today. The Steam search capture returned 0 results for Pax Autocratica Soundtrack, and the captured DLC page did not expose an OST item.",
      claim_ids: [
        "claim-soundtrack-steam-search-zero-results-20260921",
        "claim-soundtrack-dlc-page-no-ost-item-20260921",
      ],
    },
    {
      question: "Did the team say the OST is coming?",
      answer:
        "Not as a dated commitment. Gurttron said a current request would be forwarded for review, and an older answer said probably later but unsure.",
      claim_ids: [
        "claim-soundtrack-request-forwarded-20260921",
        "claim-soundtrack-probably-later-unsure-20260921",
      ],
    },
    {
      question: "Can I download the music from a third-party upload?",
      answer:
        "Do not treat third-party uploads as official. The captured evidence does not grant redistribution permission or identify a safe download source.",
      claim_ids: ["claim-soundtrack-no-download-link-boundary-20260921"],
    },
    {
      question: "Where should I check next?",
      answer:
        "Check Steam News, the Pax Autocratica Steam store, the Steam DLC page for App ID 1067360, and the current Soundtrack discussion thread.",
      claim_ids: [
        "claim-soundtrack-steam-search-zero-results-20260921",
        "claim-soundtrack-request-forwarded-20260921",
      ],
    },
  ],
  source_ids: [
    "src-steam-discussion-soundtrack-20260921",
    "src-steam-discussion-loving-music-20260921",
    "src-steam-discussion-ost-request-20260921",
    "src-steam-search-soundtrack-20260921",
    "src-steam-dlc-page-20260921",
  ],
  related_slugs: [
    "pax-autocratica-trailer",
    "pax-autocratica-community",
    "pax-autocratica-demo",
    "pax-autocratica-price",
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index",
};

replaceOrPush(data.pages, soundtrackPage);

const performance = data.pages.find((page) => page.slug === "pax-autocratica-performance");
if (performance) {
  performance.updated_at = checkedAt;
  performance.direct_answer =
    "For Pax Autocratica performance trouble, separate four cases before changing settings: launch/loading failure, low FPS or GPU heat while playing, post-session slowdown that looks like a possible memory leak, and a crash or save-specific failure. Current official patch notes say ST-11 reduced VRAM usage and improved performance, while Steam discussions still include player reports about base/end-of-expedition performance and a newer memory leak thread. Use reversible checks first: restart the game, verify the issue after closing Pax Autocratica, lower settings or frame limits, capture hardware and build details, and report repeat cases through the K key or support route. Do not publish unsafe registry edits, forced launch flags or third-party fix tools as solutions.";
  performance.direct_answer_claim_ids = Array.from(new Set([
    ...(performance.direct_answer_claim_ids || []),
    "claim-performance-memory-leak-report-20260921",
  ]));
  performance.sections = performance.sections || [];
  const memorySection = {
    heading: "Post-session slowdown and memory leak reports",
    paragraphs: [
      "A current Steam thread titled memory leak reports that after a couple of hours of play, other applications slowed down even after Pax Autocratica was closed. The poster was not completely certain it was specific to the game, so this is useful symptom evidence, not proof of a universal leak.",
      "Because the report happens after closing the game, players should capture before/after system memory, VRAM and process state instead of only changing in-game graphics settings. This also helps separate game memory retention from drivers, overlays, browser tabs or other background software.",
    ],
    steps: [
      "After a long session, close Pax Autocratica and wait a few minutes.",
      "Check whether the Pax Autocratica process is gone and whether RAM or VRAM remains unusually high.",
      "Restart Steam or the PC only after recording the symptom if you plan to report it.",
      "Attach session length, graphics settings, GPU/driver, overlays and whether the slowdown affects other apps.",
      "Use the K key or official support route for repeatable cases.",
    ],
    claim_ids: ["claim-performance-memory-leak-report-20260921"],
  };
  const existing = performance.sections.findIndex((section) => section.heading === memorySection.heading);
  if (existing >= 0) performance.sections[existing] = memorySection;
  else performance.sections.splice(Math.max(0, performance.sections.length - 1), 0, memorySection);
  performance.source_ids = Array.from(new Set([
    ...(performance.source_ids || []),
    "src-steam-discussion-memory-leak-20260921",
  ]));
  performance.related_slugs = Array.from(new Set([
    ...(performance.related_slugs || []),
    slug,
  ]));
}

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const statusGroup = guide.groups.find((group) => group.title === "Access, media and current status");
  if (statusGroup && !statusGroup.slugs.includes(slug)) {
    const index = statusGroup.slugs.indexOf("pax-autocratica-trailer");
    if (index >= 0) statusGroup.slugs.splice(index + 1, 0, slug);
    else statusGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: soundtrackPage.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, soundtrack and OST status, Linux and Proton support boundaries, revive behavior, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-21"];
}
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica soundtrack, Pax Autocratica OST, Pax Autocratica BGM, music, Steam soundtrack, Pax Autocratica performance, memory leak, Linux support, ST-11 patch, Early Access, gameplay, demo, price, trailer, community";
}
if (data.site) data.site.version = "local-pending-soundtrack";
data.generated_at = checkedAt;

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260921-soundtrack",
  intent_type: "media_availability_status",
  user_job:
    "Help players understand whether Pax Autocratica has an official soundtrack or OST listing and where to check safely.",
  intent_evidence_ids: [
    "src-steam-discussion-soundtrack-20260921",
    "src-steam-discussion-loving-music-20260921",
    "src-steam-discussion-ost-request-20260921",
    "src-steam-search-soundtrack-20260921",
    "src-steam-dlc-page-20260921",
  ],
  answerability: "resolved_as_current_availability_boundary",
  coverage: [
    {
      dimension: "current_store_availability",
      status: "covered",
      claim_ids: [
        "claim-soundtrack-steam-search-zero-results-20260921",
        "claim-soundtrack-dlc-page-no-ost-item-20260921",
      ],
      evidence_relation: "steam_store_search_and_dlc_page",
      notes: "Steam search returned 0 results for Pax Autocratica Soundtrack, and the captured DLC page did not expose a soundtrack item.",
    },
    {
      dimension: "player_demand",
      status: "covered",
      claim_ids: ["claim-soundtrack-repeat-player-demand-20260921"],
      evidence_relation: "multiple_steam_discussion_threads",
      notes: "Multiple Steam discussions ask for soundtrack, BGM, streaming or OST availability.",
    },
    {
      dimension: "future_release_boundary",
      status: "covered",
      claim_ids: [
        "claim-soundtrack-request-forwarded-20260921",
        "claim-soundtrack-probably-later-unsure-20260921",
      ],
      evidence_relation: "gurttron_replies",
      notes: "Replies acknowledge/forward interest but do not create a dated release plan.",
    },
    {
      dimension: "safe_download_source",
      status: "blocked",
      claim_ids: ["claim-soundtrack-no-download-link-boundary-20260921"],
      evidence_relation: "no_official_listing_captured",
      notes: "No captured source grants permission to download or redistribute extracted tracks.",
    },
  ],
  source_links: [
    {
      label: "Steam discussion: Soundtrack",
      url: "https://steamcommunity.com/app/1067360/discussions/0/500617547938299403/",
      source_type: "community_request_with_moderator_reply",
    },
    {
      label: "Steam discussion: Loving the music in game",
      url: "https://steamcommunity.com/app/1067360/discussions/0/581680338186728682/",
      source_type: "community_request",
    },
    {
      label: "Steam discussion: OST request",
      url: "https://steamcommunity.com/app/1067360/discussions/0/574921762383444439/",
      source_type: "community_request_with_moderator_reply",
    },
    {
      label: "Steam search: Pax Autocratica Soundtrack",
      url: "https://store.steampowered.com/search/?term=Pax%20Autocratica%20Soundtrack",
      source_type: "store_search_status",
    },
    {
      label: "Steam DLC page: Pax Autocratica",
      url: "https://store.steampowered.com/dlc/1067360/Pax_Autocratica/",
      source_type: "store_dlc_status",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-soundtrack",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct OST availability task with repeated Steam demand, store/DLC availability checks and clear no-download/no-release-date boundaries.",
};

if (data.pageProvenance["pax-autocratica-performance"]) {
  data.pageProvenance["pax-autocratica-performance"].last_checked_at = checkedAt;
  uniquePush(
    data.pageProvenance["pax-autocratica-performance"].source_links,
    {
      label: "Steam discussion: memory leak",
      url: "https://steamcommunity.com/app/1067360/discussions/0/564794422009615257/",
      source_type: "current_player_performance_report",
    },
    (item) => item.url,
  );
}

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-soundtrack-20260921",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-trailer-01.webp",
  alt: "Pax Autocratica official media scene used for the soundtrack status guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason:
    "Reuses an existing verified Steam App ID 1067360 media asset already present in the site registry.",
  relevance_reason:
    "Supports a music and media availability page without inventing soundtrack cover art.",
}, (item) => item.asset_id);

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const mdx = `# ${soundtrackPage.keyword}

${soundtrackPage.direct_answer}

${soundtrackPage.sections.map((section) => {
  const body = section.paragraphs.join("\n\n");
  const steps = section.steps?.length ? `\n\n${section.steps.map((step) => `1. ${step}`).join("\n")}` : "";
  return `## ${section.heading}\n\n${body}${steps}`;
}).join("\n\n")}

## FAQ

${soundtrackPage.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Sources

- [Steam discussion: Soundtrack](https://steamcommunity.com/app/1067360/discussions/0/500617547938299403/)
- [Steam discussion: Loving the music in game](https://steamcommunity.com/app/1067360/discussions/0/581680338186728682/)
- [Steam discussion: OST request](https://steamcommunity.com/app/1067360/discussions/0/574921762383444439/)
- [Steam search: Pax Autocratica Soundtrack](https://store.steampowered.com/search/?term=Pax%20Autocratica%20Soundtrack)
- [Steam DLC page: Pax Autocratica](https://store.steampowered.com/dlc/1067360/Pax_Autocratica/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const publicPages = (data.pages || []).filter((page) => page.page_status === "publish" && page.index_status === "index");
const sitemapUrls = [
  { loc: `${baseUrl}/`, lastmod: runDate },
  { loc: `${baseUrl}/guide/`, lastmod: runDate },
  ...publicPages.map((page) => ({
    loc: `${baseUrl}/${page.slug}/`,
    lastmod: String(page.updated_at || checkedAt).slice(0, 10),
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
  .map((item) => `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
fs.writeFileSync(sitemapPath, sitemap, "utf8");

console.log(JSON.stringify({
  slug,
  url: `${baseUrl}/${slug}/`,
  checkedAt,
  sitemapUrls: sitemapUrls.length,
  pages: data.pages.length,
}, null, 2));
