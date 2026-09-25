import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-09-25";
const checkedAt = "2026-09-25T09:20:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-st24-patch-notes";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "source-captures");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);

fs.mkdirSync(runDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));

function replaceOrPush(array, item, key = (value) => value.slug) {
  const index = array.findIndex((value) => key(value) === key(item));
  if (index >= 0) array[index] = item;
  else array.push(item);
}

function uniquePush(array, item, key = (value) => value) {
  const id = key(item);
  if (!array.some((value) => key(value) === id)) array.push(item);
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(runDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

async function fetchText(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 Codex Pax Autocratica growth audit",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    const text = await response.text();
    return { url, ok: response.ok, status: response.status, captured_at: checkedAt, text };
  } catch (error) {
    return { url, ok: false, status: 0, captured_at: checkedAt, error: String(error?.message || error), text: "" };
  }
}

function saveCapture(name, capture) {
  const filePath = path.join(sourceDir, name);
  const payload = name.endsWith(".json") ? JSON.stringify(capture, null, 2) : capture.text;
  fs.writeFileSync(filePath, `${payload}\n`, "utf8");
  return {
    file: path.relative(runDir, filePath).replaceAll("\\", "/"),
    status: capture.status,
    ok: capture.ok,
    url: capture.url,
    sha256: sha256(payload),
    bytes: Buffer.byteLength(payload),
  };
}

const newsUrl = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=10&maxlength=12000&format=json";
const appUrl = "https://store.steampowered.com/api/appdetails?appids=1067360&filters=basic,genres,categories,release_date,price_overview,platforms,recommendations";
const discussionUrl = "https://steamcommunity.com/app/1067360/discussions/";
const announcementsUrl = "https://steamcommunity.com/games/1067360/announcements/";
const officialUrl = "https://www.paxautocratica.com/";
const youtubeSearchUrl = "https://www.youtube.com/results?search_query=Pax+Autocratica&sp=CAI%253D";

const captures = {};
for (const [name, url] of [
  ["steam-news-2026-09-25.json", newsUrl],
  ["steam-appdetails-2026-09-25.json", appUrl],
  ["steam-discussions-2026-09-25.html", discussionUrl],
  ["steam-announcements-2026-09-25.html", announcementsUrl],
  ["official-site-2026-09-25.html", officialUrl],
  ["youtube-search-2026-09-25.html", youtubeSearchUrl],
]) {
  captures[name] = saveCapture(name, await fetchText(url));
}

const newsPayload = JSON.parse(fs.readFileSync(path.join(sourceDir, "steam-news-2026-09-25.json"), "utf8"));
const news = JSON.parse(newsPayload.text);
const latest = news.appnews.newsitems[0];
if (!latest?.title?.includes("ST-24")) {
  throw new Error(`Latest official Steam News was not ST-24: ${latest?.title || "missing"}`);
}
const st24Url = latest.url;
const st24DateIso = new Date(latest.date * 1000).toISOString();
const st24Hash = sha256(latest.contents || "");

const page = {
  keyword: "Pax Autocratica ST-24 Patch Notes",
  slug,
  seo: {
    title: "Pax Autocratica ST-24 Patch Notes: Logistics, Revive and DLSS",
    description:
      "A source-backed Pax Autocratica Directive ST-24 guide covering logistics fixes, revive speed, DLSS 4.5, Sector 1 battles, capture timing and what players should recheck.",
  },
  direct_answer:
    "Directive ST-24 is the September 24, 2026 official Pax Autocratica maintenance update. The player-visible changes to recheck first are Resource Transport Station and Warehouse hauling, temporary assignment and auto-assignment logic, carried items being sent to the Warehouse after an interrupted hauling task, DLSS 4.5 Frame Generation and performance logic, faster revive responders, earlier failed-capture resolution, three new Sector 1 - Elysia battles, Medic Healing Grenade activation speed, special soldiers no longer randomly receiving negative general or combat traits, combat gender-ratio tuning, and Trade Port goods changes. Treat it as an official patch checklist, not proof that every old logistics, revive, performance, capture or balance complaint is solved.",
  direct_answer_claim_ids: [
    "claim-st24-official-20260925",
    "claim-st24-logistics-20260925",
    "claim-st24-combat-revive-20260925",
    "claim-st24-performance-20260925",
  ],
  sections: [
    {
      heading: "What to recheck first",
      paragraphs: [
        "ST-24 matters because it touches several guides that previously depended on ST-11 or player-reported workarounds. The safest use is a recheck list: update through Steam, revisit the affected system in the current build, then decide whether an older workaround still applies.",
        "For colony management, the patch changes hauling behavior around Resource Transport Stations, full producing buildings, Warehouse transfers and interrupted hauling tasks. For combat, it changes revive responder speed, failed-capture pacing, Medic Healing Grenade activation, Sector 1 battle availability and several soldier or enemy outcomes.",
      ],
      steps: [
        "Update Pax Autocratica through Steam before testing an old report.",
        "Use ST-24 for official changed areas, but keep unrelated community bugs separate.",
        "Capture build, save, sector, building level and screenshot before reporting any repeat issue.",
      ],
      claim_ids: ["claim-st24-official-20260925", "claim-st24-logistics-20260925", "claim-st24-combat-revive-20260925"],
    },
    {
      heading: "Logistics and Warehouse changes",
      paragraphs: [
        "The official note says temporary assignment and auto-assignment logic were improved so soldiers return to previous tasks after temporary work and choose better fitting idle tasks such as Mining, Logging and Gathering. It also says workers at the Resource Transport Station should spread out when resource-producing buildings are full instead of clustering together.",
        "The most important Warehouse boundary is that transporting resources from the Resource Transport Station to the Warehouse no longer requires the station to be Level 2. If a hauling task is interrupted, carried items should now go directly to the Warehouse rather than being dropped on the ground.",
      ],
      steps: [
        "Recheck any old advice that said Warehouse transport requires Resource Transport Station Level 2.",
        "Watch whether workers split across full producing buildings instead of bunching up.",
        "If a worker is interrupted, compare Warehouse inventory before assuming carried items vanished.",
      ],
      claim_ids: ["claim-st24-logistics-20260925"],
    },
    {
      heading: "Combat, revive and capture checks",
      paragraphs: [
        "ST-24 says special soldiers such as IntelliExplorer A20 and Miralisse Novarin will no longer randomly receive negative general and combat traits. It also adjusts the male and female soldier ratio in combat and changes Trade Port goods by adjusting attributes, drops and removing several goods that were especially harmful to soldiers.",
        "For downed-player cases, the patch adds a minimum revive-speed requirement for soldiers going to revive the Leader. For capture, failed attempts should more often resolve earlier, reducing time spent waiting through several capture jiggles. Explosive kills on normal enemy soldiers now trigger the same follow-up behavior as normal deaths.",
      ],
      steps: [
        "Retest revive response in the current build before citing older revive complaints.",
        "Retest failed capture timing instead of relying on pre-ST-24 wait patterns.",
        "Do not treat Trade Port goods lists, special soldier trait outcomes or combat population ratios as stable across older guides.",
      ],
      claim_ids: ["claim-st24-combat-revive-20260925"],
    },
    {
      heading: "Performance and new content scope",
      paragraphs: [
        "The official patch adds support for NVIDIA DLSS 4.5 Frame Generation and says overall performance logic was improved. That is direct evidence for a current performance recheck, but it is not a universal promise that all FPS drops, heat, crashes or memory-leak-like symptoms are gone.",
        "The content addition called out by the note is three new battles in Sector 1 - Elysia. This does not prove new sectors, co-op, a full roadmap milestone, or a changed final boss. Keep the scope tight: Sector 1 gets new battles; broader future systems still need their own official evidence.",
      ],
      steps: [
        "Update graphics drivers if you plan to test DLSS 4.5 Frame Generation.",
        "Compare performance with reversible settings first; avoid unsafe launch flags or third-party fix tools.",
        "Treat the three Sector 1 battles as a current content addition, not as proof of a wider roadmap drop.",
      ],
      claim_ids: ["claim-st24-performance-20260925", "claim-st24-sector1-20260925"],
    },
    {
      heading: "What ST-24 does not prove",
      paragraphs: [
        "ST-24 is a maintenance directive with concrete changes, not a complete mechanics manual. It does not publish exact revive formulas, capture probabilities, DLSS benchmark numbers, Trade Port item tables, new battle walkthroughs, special soldier build rankings, or a guarantee that every old discussion thread is resolved.",
        "Use this page as an official routing page. If your question is specifically about revive design, Resource Transport Station behavior, performance, capture mechanics or best troops, use the related guide after checking whether its ST-24 note applies.",
      ],
      steps: [
        "Do not copy the full patch note into community posts; link the official source.",
        "Do not mark older pages solved unless the changed behavior was actually direct.",
        "Recheck this page when Multiverse publishes the next maintenance directive.",
      ],
      claim_ids: ["claim-st24-official-20260925"],
    },
  ],
  faq: [
    {
      question: "Is ST-24 the latest official Pax Autocratica update?",
      answer: "Yes. The Steam News API captured on September 25, 2026 returned Directive ST-24 as the newest official Pax Autocratica news item, dated September 24, 2026 UTC and authored by Multiverse.",
      claim_ids: ["claim-st24-official-20260925"],
    },
    {
      question: "Does Warehouse transport still require Resource Transport Station Level 2?",
      answer: "ST-24 says transporting resources from the Resource Transport Station to the Warehouse no longer requires Level 2. Recheck old Warehouse advice against the current build.",
      claim_ids: ["claim-st24-logistics-20260925"],
    },
    {
      question: "Did ST-24 fix revive problems?",
      answer: "It directly changes revive response speed by setting a strict minimum speed for soldiers heading to revive the downed Leader. It does not prove every pathfinding, co-op or design complaint is solved.",
      claim_ids: ["claim-st24-combat-revive-20260925"],
    },
    {
      question: "Does DLSS 4.5 mean all performance issues are fixed?",
      answer: "No. ST-24 adds DLSS 4.5 Frame Generation support and says performance logic improved, but continuing hardware, heat, crash or slowdown symptoms still need normal troubleshooting evidence.",
      claim_ids: ["claim-st24-performance-20260925"],
    },
  ],
  source_ids: ["src-steam-news-st24-20260925", "src-steam-appdetails-20260925", "src-steam-discussions-20260925", "src-official-site-20260925"],
  claim_ids: [
    "claim-st24-official-20260925",
    "claim-st24-logistics-20260925",
    "claim-st24-combat-revive-20260925",
    "claim-st24-performance-20260925",
    "claim-st24-sector1-20260925",
  ],
  updated_at: checkedAt,
  time_sensitivity: "official_patch_notes",
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-st11-patch-notes",
    "pax-autocratica-resource-transport-station-warehouse",
    "pax-autocratica-revive-player",
    "pax-autocratica-performance",
    "pax-autocratica-capture-mechanics",
    "pax-autocratica-best-troops",
  ],
  ad_slot_count: 2,
};

replaceOrPush(data.pages, page);

for (const relatedSlug of page.related_slugs) {
  const related = data.pages.find((candidate) => candidate.slug === relatedSlug);
  if (related) {
    related.related_slugs ||= [];
    uniquePush(related.related_slugs, slug);
  }
}

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const statusGroup = guide.groups.find((group) => group.title === "Access, media and current status");
  if (statusGroup && !statusGroup.slugs.includes(slug)) {
    const index = statusGroup.slugs.indexOf("pax-autocratica-st11-patch-notes");
    if (index >= 0) statusGroup.slugs.splice(index + 1, 0, slug);
    else statusGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

const updateSourceLink = {
  label: "Steam announcement: Directive ST-24",
  url: st24Url,
  source_type: "official_community",
};

function addSt24Provenance(slugToUpdate) {
  data.pageProvenance ||= {};
  const existing = data.pageProvenance[slugToUpdate] || {};
  const links = existing.source_links || [];
  if (!links.some((item) => item.url === st24Url)) links.unshift(updateSourceLink);
  data.pageProvenance[slugToUpdate] = {
    ...existing,
    source_links: links,
    last_checked_at: checkedAt,
  };
}

function addSection(slugToUpdate, section) {
  const target = data.pages.find((candidate) => candidate.slug === slugToUpdate);
  if (!target) return;
  target.sections ||= [];
  if (!target.sections.some((item) => item.heading === section.heading)) target.sections.unshift(section);
  target.updated_at = checkedAt;
  target.source_ids ||= [];
  uniquePush(target.source_ids, "src-steam-news-st24-20260925");
  target.related_slugs ||= [];
  uniquePush(target.related_slugs, slug);
  addSt24Provenance(slugToUpdate);
}

addSection("pax-autocratica-resource-transport-station-warehouse", {
  heading: "ST-24 changes the Warehouse check",
  paragraphs: [
    "Directive ST-24 changes the older Warehouse advice directly: transporting resources from the Resource Transport Station to the Warehouse no longer requires the station to be Level 2. It also says interrupted hauling tasks now send carried items directly to the Warehouse instead of dropping them on the ground.",
    "That means older Mk2-only explanations should be treated as historical context. The current first check is whether the latest build has moved the resource to Warehouse inventory after a worker trip or interruption.",
  ],
  steps: [
    "Retest Warehouse transfer on the current build even if the station is not Level 2.",
    "Watch one worker cycle and compare Warehouse inventory before and after.",
    "Report only if the Warehouse does not receive the item and the route/build details are clear.",
  ],
});

addSection("pax-autocratica-revive-player", {
  heading: "ST-24 revive-speed recheck",
  paragraphs: [
    "Directive ST-24 directly changes revive behavior by setting a strict minimum speed for soldiers going to revive a downed Leader. This makes old complaints about slow responders worth retesting in the current build.",
    "The note does not prove every revive design, pathfinding or future co-op concern is solved. Use it as a speed/pathing recheck, not a universal revive guarantee.",
  ],
  steps: [
    "Update first, then reproduce the same downed-player situation if possible.",
    "Record map, distance, blocked paths and assigned helpers if revive still fails.",
    "Keep co-op speculation separate unless a new official co-op note appears.",
  ],
});

addSection("pax-autocratica-performance", {
  heading: "ST-24 DLSS and performance recheck",
  paragraphs: [
    "Directive ST-24 adds NVIDIA DLSS 4.5 Frame Generation support and says overall performance logic was improved. Players with supported hardware should update graphics drivers before judging current performance.",
    "This is direct evidence for a fresh performance test, but it does not erase every frame drop, heat, crash or memory-leak-like report. Continue using reversible settings and official reporting steps for repeat symptoms.",
  ],
  steps: [
    "Update the game and graphics driver before testing DLSS 4.5.",
    "Compare with reversible in-game settings before changing launch flags.",
    "If slowdown persists after closing the game, keep the memory-leak-style report separate.",
  ],
});

addSection("pax-autocratica-capture-mechanics", {
  heading: "ST-24 capture timing recheck",
  paragraphs: [
    "Directive ST-24 says failed capture attempts are now more likely to resolve earlier, reducing time spent waiting through multiple capture jiggles. It also says normal enemy soldiers killed by explosive damage now trigger the same follow-up behavior as normal deaths.",
    "This changes the practical test route for capture complaints, but it does not publish exact capture probabilities, hidden formulas or a full enemy table.",
  ],
  steps: [
    "Retest failed capture timing in the current build before citing old wait patterns.",
    "Separate explosive-kill follow-up behavior from ordinary Capture Rounds behavior.",
    "Do not convert the patch note into a precise probability table.",
  ],
});

addSection("pax-autocratica-best-troops", {
  heading: "ST-24 special-soldier boundary",
  paragraphs: [
    "Directive ST-24 says special soldiers, including IntelliExplorer A20 and Miralisse Novarin, should no longer randomly receive negative general and combat traits. It also adjusts the combat male/female ratio and changes Trade Port goods.",
    "That is useful for current troop evaluation, but it still does not create a universal best-soldier ranking. Retest individual soldiers, goods and traits on the current build.",
  ],
  steps: [
    "Recheck special soldier traits after updating.",
    "Do not reuse older negative-trait screenshots as current evidence without build context.",
    "Treat Trade Port goods advice as build-sensitive after ST-24.",
  ],
});

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-st24-patch-notes-20260925",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica gameplay scene used for the ST-24 maintenance update guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Supports a patch guide covering logistics, combat, revive and performance changes without inventing a patch-specific image.",
}, (item) => item.asset_id);

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to ST-24 and ST-11 patch changes, logistics, revive behavior, performance, Auto-Defense and base-defense boundaries, crowded UI, soldiers fighting in base, soundtrack and OST status, Linux support, Supreme Powers, overworked soldiers, ultrawide visuals, save wipe and Early Access questions.";
}
if (data.home?.hero?.stats) data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-25"];
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica ST-24, Pax Autocratica patch notes, Pax Autocratica Resource Transport Station, Pax Autocratica revive, Pax Autocratica DLSS, Pax Autocratica performance, Pax Autocratica capture mechanics";
}
if (data.site) data.site.version = "local-pending-st24";
data.generated_at = checkedAt;

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260925-st24-patch-notes",
  intent_type: "official_patch_notes_status_guide",
  user_job: "Understand what the ST-24 maintenance update changed and which older Pax Autocratica guide advice needs a current-build recheck.",
  intent_evidence_ids: ["src-steam-news-st24-20260925", "src-steam-appdetails-20260925", "src-steam-discussions-20260925"],
  answerability: "resolved_with_official_steam_news_and_current_site_context",
  coverage: [
    {
      dimension: "official_update_identity",
      status: "covered",
      claim_ids: ["claim-st24-official-20260925"],
      evidence_relation: "steam_news_api",
      notes: `Steam news item ${latest.gid} is authored by ${latest.author}, dated ${st24DateIso}, and body hash is ${st24Hash}.`,
    },
    {
      dimension: "player_impact_mapping",
      status: "covered",
      claim_ids: ["claim-st24-logistics-20260925", "claim-st24-combat-revive-20260925", "claim-st24-performance-20260925"],
      evidence_relation: "official_patch_bullets_plus_existing_affected_guides",
      notes: "The page maps official changes to logistics, revive, capture, performance and troop-evaluation recheck tasks without claiming every old issue is solved.",
    },
  ],
  source_links: [
    updateSourceLink,
    { label: "Pax Autocratica Steam store", url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", source_type: "official_store" },
    { label: "Pax Autocratica Steam discussions", url: discussionUrl, source_type: "community" },
    { label: "Official site", url: officialUrl, source_type: "official_website" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-st24-patch-notes",
  status: "publish",
  depth_variance_reason:
    "The page turns a broad official patch note into a player recheck guide for logistics, revive, capture, performance, special soldiers and Sector 1 content while avoiding unsupported formulas or universal-fix claims.",
};

const mdx = `# ${page.keyword}

${page.direct_answer}

${page.sections.map((section) => `## ${section.heading}

${section.paragraphs.join("\n\n")}

${section.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`).join("\n\n")}

## FAQ

${page.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const publicPages = data.pages.filter((item) => item.page_status === "publish" && item.index_status === "index");
const sitemapUrls = [
  { loc: `${baseUrl}/`, lastmod: runDate },
  { loc: `${baseUrl}/guide/`, lastmod: runDate },
  ...publicPages.map((item) => ({
    loc: `${baseUrl}/${item.slug}/`,
    lastmod: String(item.updated_at || checkedAt).slice(0, 10),
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
  .map((item) => `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
fs.writeFileSync(sitemapPath, sitemap, "utf8");

writeJson("daily-state.json", {
  schema_version: 1,
  run_id: `pax-autocratica-${runDate}`,
  site_id: "PaxAutocratica",
  date: runDate,
  timezone: "Asia/Shanghai",
  status: "content_generated_pending_build_deploy",
  locked_at: checkedAt,
  input_hash: sha256(JSON.stringify({ latest_gid: latest.gid, latest_title: latest.title, previous_head: "0e2a21f0ec39523b343727bc95df5e95adb6c598" })),
  source_capture_count: Object.keys(captures).length,
});

writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: { gid: latest.gid, title: latest.title, author: latest.author, date_utc: st24DateIso, url: st24Url, body_sha256: st24Hash },
  sources: Object.values(captures),
});

writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-news-st24-20260925",
      disposition: "CREATE_CANDIDATE",
      reason: "New official maintenance directive changes multiple current player tasks and differs from existing ST-11 page.",
      new_claims: page.claim_ids,
      affected_routes: [
        `/${slug}/`,
        "/pax-autocratica-resource-transport-station-warehouse/",
        "/pax-autocratica-revive-player/",
        "/pax-autocratica-performance/",
        "/pax-autocratica-capture-mechanics/",
        "/pax-autocratica-best-troops/",
      ],
      evidence_urls: [st24Url, "https://store.steampowered.com/app/1067360/Pax_Autocratica/"],
    },
    {
      source_id: "src-youtube-search-20260925",
      disposition: "NO_ACTION",
      reason: "No newly verified official embeddable video was captured; existing video/media entries remain unchanged.",
      affected_routes: [],
      evidence_urls: [youtubeSearchUrl],
    },
  ],
});

writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    {
      slug,
      keyword: page.keyword,
      status: "PASS",
      demand_basis: "Latest official Steam maintenance directive plus affected existing player tasks around logistics, revive, capture and performance.",
      evidence_gate: "PASS_OFFICIAL_SOURCE_PLUS_SITE_CONTEXT",
      duplicate_gate: "PASS_DISTINCT_FROM_ST11",
      content_gate: "PASS_RECHECK_GUIDE_NOT_NEWS_REWRITE",
    },
    { slug: "pax-autocratica-dlss-45", status: "HOLD_DUPLICATE_SUBTOPIC", reason: "Best handled inside ST-24 and existing Performance page until independent search intent appears." },
    { slug: "pax-autocratica-sector-1-elysia-battles", status: "HOLD_THIN", reason: "Official note confirms three new battles, but no walkthrough/mechanics evidence yet." },
    { slug: "pax-autocratica-trade-port-goods-st24", status: "HOLD_THIN", reason: "Official note confirms changed goods but does not publish a current table." },
  ],
});

writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica ST-24 patch notes", parent: "Pax Autocratica", status: "selected", source: "official_steam_news" },
    { keyword: "Pax Autocratica DLSS 4.5", parent: "Pax Autocratica ST-24", status: "deferred_existing_page", source: "official_steam_news" },
    { keyword: "Pax Autocratica Resource Transport Station Warehouse ST-24", parent: "Pax Autocratica ST-24", status: "update_existing", source: "official_steam_news" },
    { keyword: "Pax Autocratica revive speed", parent: "Pax Autocratica ST-24", status: "update_existing", source: "official_steam_news" },
  ],
});

writeJson("opportunity-shortlist.json", {
  schema_version: 1,
  selected: [{ slug, keyword: page.keyword, priority: 1, reason: "New official directive with broad player impact and a distinct patch-search intent." }],
  held: ["pax-autocratica-dlss-45", "pax-autocratica-sector-1-elysia-battles", "pax-autocratica-trade-port-goods-st24"],
});

writeJson("webcafe-plan.json", {
  schema_version: 1,
  status: "DEFERRED_NO_AUTHENTICATED_EXPORT",
  reason: "No authenticated Web.Cafe access/export was available; no forced query was attempted.",
  planned_queries: ["Pax Autocratica ST-24 patch notes"],
});
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });

writeJson("page-decisions.json", {
  schema_version: 1,
  decisions: [
    { slug, decision: "CREATE_L2_INDEX", reason: "Official ST-24 patch is current, distinct, source-backed and actionable." },
    { slug: "pax-autocratica-resource-transport-station-warehouse", decision: "UPDATE_EXISTING", reason: "ST-24 directly changes Warehouse transfer boundary." },
    { slug: "pax-autocratica-revive-player", decision: "UPDATE_EXISTING", reason: "ST-24 directly changes revive speed." },
    { slug: "pax-autocratica-performance", decision: "UPDATE_EXISTING", reason: "ST-24 directly adds DLSS 4.5/performance evidence." },
    { slug: "pax-autocratica-capture-mechanics", decision: "UPDATE_EXISTING", reason: "ST-24 directly changes failed capture pacing." },
    { slug: "pax-autocratica-best-troops", decision: "UPDATE_EXISTING", reason: "ST-24 directly changes special soldier negative-trait boundary." },
  ],
});

writeJson("change-manifest.json", {
  schema_version: 1,
  content_changes: [
    `public/site-data.json: added ${slug} and ST-24 updates to five existing pages`,
    "public/sitemap.xml: added new index route and updated changed lastmod values",
    `content/en/${slug}.mdx: audit copy of the generated guide`,
  ],
  site_changes: [],
  no_change_site_reason: "No direct evidence required changing templates, ads, measurement, DNS or indexing requests.",
});

writeJson("search-performance.json", {
  schema_version: 1,
  status: "UNKNOWN_DEFERRED",
  reason: "No authenticated GSC, GA4/Plausible/Clarity export or connector was available.",
});
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated measurement export was available." });
writeJson("external-benchmark.json", {
  schema_version: 1,
  similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT",
  web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT",
  aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT",
});
writeJson("aitdk-compatibility.json", {
  schema_version: 1,
  status: "UNKNOWN",
  compatibility_map: { title_description: "OWN_RULES", canonical: "OWN_RULES", page_speed: "UNKNOWN", keyword_density: "UNSUPPORTED_FOR_ACTION" },
});
writeJson("site-health.json", {
  schema_version: 1,
  status: "PENDING_BUILD_ONLINE_VERIFY",
  checked_at: checkedAt,
  checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"],
  no_change_site_reason: "Content-only official-patch update; no direct technical fault evidence requiring template, DNS, ad or measurement changes.",
});

const findings = [
  {
    id: "D00-run-lock-input",
    area: "D00 input and run lock",
    status: "PASS",
    risk: "P3",
    impact: "Prevents duplicate same-day runs and mixing another site's state into Pax Autocratica.",
    evidence: `Run directory ${runDir}; official latest Steam News gid ${latest.gid}.`,
    action: "Locked site/date/version and continued from the existing Pax growth-runs directory.",
    resolution: "RESOLVED",
    next_review_at: "2026-09-26T09:00:00+08:00",
  },
  {
    id: "D01-source-watch",
    area: "D01 sources",
    status: "PASS_WITH_UNAVAILABLE_SOURCE",
    risk: "P3",
    impact: "A thin page would result if ST-24 were rewritten as news without player-task mapping.",
    evidence: `Steam News API captured ${latest.title}; appdetails, discussions, announcements, official site and YouTube search were captured or recorded.`,
    action: "Mapped official ST-24 facts to a new patch guide and affected existing pages; held thin subtopics.",
    resolution: "RESOLVED_WITH_DEFERRED_SOURCE",
    next_review_at: "2026-09-26T09:00:00+08:00",
  },
  {
    id: "D05-D08-candidate-gates",
    area: "D05-D08 candidate gates",
    status: "PASS",
    risk: "P2",
    impact: "Players need current ST-24 guidance without false promises that every old issue is fixed.",
    evidence: "Candidate passed official-source, duplicate, player-task, content and production planning gates; DLSS-only, Sector-1-only and Trade-Port-table pages were held.",
    action: "Selected one new L2 page and recorded held candidates.",
    resolution: "RESOLVED",
    next_review_at: "2026-09-26T09:00:00+08:00",
  },
  {
    id: "D09-content-production",
    area: "D09 content",
    status: "PASS_PENDING_BUILD",
    risk: "P2",
    impact: "The site needs at least one real new index page and must not leave contradicted old guidance in place.",
    evidence: `Added /${slug}/ with direct answer, sections, FAQ, sources, media, guide link and sitemap entry; updated five affected existing pages with ST-24 recheck notes.`,
    action: "Generated content and reports; build/online verification follows outside this script.",
    resolution: "RESOLVED_PENDING_BUILD",
    next_review_at: "2026-09-25T10:30:00+08:00",
  },
  {
    id: "D02-site-health",
    area: "D02 site health",
    status: "PENDING_ONLINE_VERIFY",
    risk: "P2",
    impact: "Users need the production domain to serve the same version as GitHub.",
    evidence: "Local content and sitemap generated; online status will be verified after deployment.",
    action: "No DNS, template, ad or measurement change because no direct fault evidence was found.",
    resolution: "RESOLVED_PENDING_DEPLOY_VERIFY",
    next_review_at: "2026-09-25T10:30:00+08:00",
  },
  {
    id: "D03-measurement-data",
    area: "D03 GSC and measurement",
    status: "UNKNOWN_DEFERRED",
    risk: "P4",
    impact: "Search and analytics numbers cannot drive optimization decisions without authenticated exports.",
    evidence: "No authenticated GSC, GA4/Plausible/Clarity export or connector was available.",
    action: "Recorded unknown/deferred; did not modify tracking or draw traffic conclusions.",
    resolution: "DEFERRED_NO_AUTHENTICATED_DATA",
    next_review_at: "2026-09-26T09:00:00+08:00",
  },
  {
    id: "D04-external-benchmark",
    area: "D04 Similarweb Web.Cafe AITDK",
    status: "UNKNOWN_DEFERRED",
    risk: "P4",
    impact: "External estimates cannot be faked as zero or success.",
    evidence: "No authenticated Similarweb/Web.Cafe/AITDK export was available.",
    action: "Recorded unavailable data; page decision used official Steam evidence instead.",
    resolution: "DEFERRED_NO_AUTHENTICATED_DATA",
    next_review_at: "2026-09-26T09:00:00+08:00",
  },
  {
    id: "D10-deploy-verify",
    area: "D10 deployment",
    status: "PENDING",
    risk: "P1",
    impact: "If commit, GitHub, deploy and online version diverge, users may see a different site than the repo.",
    evidence: "Deployment evidence will be appended after build, commit, push and Vercel production verification.",
    action: "Pending build/deploy step.",
    resolution: "PENDING",
    next_review_at: "2026-09-25T10:30:00+08:00",
  },
  {
    id: "D11-external-publication",
    area: "D11 external publication",
    status: "PASS_NO_EXTERNAL_PUBLICATION",
    risk: "P4",
    impact: "Posting to unspecified platforms would exceed authorization and risk spam/brand harm.",
    evidence: "No user-provided allowed publication list was present.",
    action: "Kept external publication count at 0.",
    resolution: "RESOLVED",
    next_review_at: "2026-09-26T09:00:00+08:00",
  },
  {
    id: "D12-report",
    area: "D12 report",
    status: "PASS_PENDING_FINAL_HASH",
    risk: "P2",
    impact: "The run must be auditable after the automation finishes.",
    evidence: "daily-report.json/html/md, source captures and run artifacts generated in today's growth-runs directory.",
    action: "Rendered daily report; checksums will include final deployment evidence after deploy.",
    resolution: "RESOLVED_PENDING_FINAL_HASH",
    next_review_at: "2026-09-25T10:30:00+08:00",
  },
];

const report = {
  schema_version: 1,
  run_id: `pax-autocratica-${runDate}`,
  site_id: "PaxAutocratica",
  game_name: "Pax Autocratica",
  canonical_domain: baseUrl,
  captured_at: checkedAt,
  status: "PASS_CONTENT_PENDING_DEPLOY",
  new_index_page_count: 1,
  new_index_pages: [{ slug, url: pageUrl, title: page.keyword }],
  latest_official: { title: latest.title, url: st24Url, date_utc: st24DateIso, body_sha256: st24Hash },
  external_publications: 0,
  deferred_data: ["GSC", "Analytics/measurement export", "Similarweb", "Web.Cafe", "AITDK", "Ad revenue export"],
  no_change_site_reason: "No direct evidence required changing templates, ads, measurement, DNS or indexing requests.",
  findings,
};

writeJson("daily-report.json", report);

const htmlRows = findings
  .map(
    (finding) =>
      `<tr><td>${finding.id}</td><td>${finding.area}</td><td>${finding.status}</td><td>${finding.risk}</td><td>${finding.impact}</td><td>${finding.evidence}</td><td>${finding.action}</td><td>${finding.resolution}</td><td>${finding.next_review_at}</td></tr>`,
  )
  .join("\n");
const reportHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pax Autocratica Daily Growth Report ${runDate}</title><style>body{font-family:Arial,sans-serif;background:#f6f7f9;color:#18202a;margin:0;padding:24px}main{max-width:1180px;margin:auto;background:white;border:1px solid #dde3ea;padding:24px}h1{margin-top:0}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #dde3ea;padding:8px;vertical-align:top}th{background:#eef4f0;text-align:left}.status{font-weight:bold}</style></head><body><main><h1>Pax Autocratica Daily Growth Report - ${runDate}</h1><p class="status">Status: ${report.status}. New index pages: ${report.new_index_page_count}. External publications: 0.</p><p>Latest official source: <a href="${st24Url}">${latest.title}</a>.</p><table><thead><tr><th>ID</th><th>Area</th><th>Status</th><th>Risk</th><th>Impact</th><th>Evidence</th><th>Action</th><th>Resolution</th><th>Next review</th></tr></thead><tbody>${htmlRows}</tbody></table></main></body></html>\n`;
fs.writeFileSync(path.join(runDir, "daily-report.html"), reportHtml, "utf8");
const reportMd = `# Pax Autocratica Daily Growth Report - ${runDate}

Status: ${report.status}

New index page: ${pageUrl}

Latest official source: ${latest.title} (${st24Url})

External publication: 0, because no approved platform list was provided.

Deferred data: ${report.deferred_data.join(", ")}.

${findings.map((finding) => `## ${finding.id}\n\n- Status: ${finding.status}\n- Impact: ${finding.impact}\n- Evidence: ${finding.evidence}\n- Action: ${finding.action}\n- Resolution: ${finding.resolution}`).join("\n\n")}
`;
fs.writeFileSync(path.join(runDir, "daily-report.md"), reportMd, "utf8");

const checksumTargets = [
  "daily-state.json",
  "source-watch.json",
  "source-content-actions.json",
  "opportunity-candidates.json",
  "derivative-keyword-candidates.json",
  "opportunity-shortlist.json",
  "webcafe-plan.json",
  "webcafe-results.json",
  "page-decisions.json",
  "change-manifest.json",
  "search-performance.json",
  "measurement-health.json",
  "external-benchmark.json",
  "aitdk-compatibility.json",
  "site-health.json",
  "daily-report.json",
  "daily-report.html",
  "daily-report.md",
  ...Object.values(captures).map((item) => item.file),
];
fs.writeFileSync(
  path.join(runDir, "checksums.sha256"),
  `${checksumTargets
    .filter((file) => fs.existsSync(path.join(runDir, file)))
    .map((file) => `${sha256File(path.join(runDir, file))}  ${file}`)
    .join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({ status: "generated", slug, runDir, latest: latest.title }, null, 2));
