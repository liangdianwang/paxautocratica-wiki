import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-04";
const checkedAt = "2026-10-04T09:20:00+08:00";
const nextRunAt = "2026-10-05T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-troop-upgrading";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentDir = path.join(root, "content", "en");
const contentPath = path.join(contentDir, `${slug}.mdx`);
const priceContentPath = path.join(contentDir, "pax-autocratica-price.mdx");
const discountContentPath = path.join(contentDir, "pax-autocratica-80-discount-mistake.mdx");

fs.mkdirSync(sourceDir, { recursive: true });

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(runDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(name, value) {
  fs.writeFileSync(path.join(runDir, name), value, "utf8");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function capture(name, url, options = {}) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; CodexDailyGrowth/1.0)",
      ...(options.headers || {}),
    },
  });
  const body = await response.text();
  fs.writeFileSync(path.join(sourceDir, name), body, "utf8");
  return { name, url, status: response.status, body };
}

function replaceOrPush(array, item, key = (value) => value.slug) {
  const id = key(item);
  const index = array.findIndex((value) => key(value) === id);
  if (index >= 0) array[index] = item;
  else array.push(item);
}

function uniquePush(array, item, key = (value) => value) {
  const id = key(item);
  if (!array.some((value) => key(value) === id)) array.push(item);
}

function findingHash(finding) {
  return sha256(JSON.stringify({
    finding_id: finding.finding_id,
    result_state: finding.result_state,
    resolution_status: finding.resolution_status,
    evidence_refs: finding.evidence_refs,
    recommended_action: finding.recommended_action,
  }));
}

const sources = [];
sources.push(await capture("steam-news-api.json", "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=30&maxlength=50000&format=json"));
sources.push(await capture("steam-appdetails.json", "https://store.steampowered.com/api/appdetails?appids=1067360&cc=us&l=en"));
sources.push(await capture("steam-discussions.html", "https://steamcommunity.com/app/1067360/discussions/"));
sources.push(await capture("discussion-troop-upgrading.html", "https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/"));
sources.push(await capture("reddit-fodder-units.html", "https://www.reddit.com/r/PaxAutocratica/comments/1vtcjtm/whats_your_goto_for_fodder_units_for_tiering/"));
sources.push(await capture("reddit-grindy-upgrading.html", "https://www.reddit.com/r/PaxAutocratica/comments/1vq6iyf/is_it_just_me_or_is_this_game_really_grindy/"));
sources.push(await capture("youtube-search-troop-upgrading.html", "https://www.youtube.com/results?search_query=Pax+Autocratica+troop+upgrading"));
sources.push(await capture("official-site.html", "https://www.paxautocratica.com/"));

const news = JSON.parse(sources.find((item) => item.name === "steam-news-api.json").body);
const latest = news?.appnews?.newsitems?.[0];
const ag12 = news.appnews.newsitems.find((item) => item.title.includes("AG-12"));
const st24 = news.appnews.newsitems.find((item) => item.title.includes("ST-24"));
if (!latest?.title?.includes("ST-24")) {
  throw new Error(`Latest official Steam News expected ST-24, got ${latest?.title || "missing"}`);
}
if (!ag12?.contents?.includes("Improved Soldier Upgrade progression")) {
  throw new Error("AG-12 official Soldier Upgrade progression evidence missing from Steam News API.");
}
if (!st24?.contents?.includes("Special soldiers")) {
  throw new Error("ST-24 special-soldier evidence missing from Steam News API.");
}

const storeData = JSON.parse(sources.find((item) => item.name === "steam-appdetails.json").body);
const appDetails = storeData?.["1067360"]?.data;
const price = appDetails?.price_overview;
const storeText = stripHtml(appDetails?.detailed_description || "");
if (!price || price.discount_percent !== 20 || price.final !== 2399 || !/mistake has now been fixed/i.test(storeText)) {
  throw new Error(`Expected current Steam store to show fixed 20% discount and notice, got ${JSON.stringify(price)} / ${storeText.slice(0, 200)}`);
}

const discussionIndexText = stripHtml(sources.find((item) => item.name === "steam-discussions.html").body);
const troopThreadText = stripHtml(sources.find((item) => item.name === "discussion-troop-upgrading.html").body);
const redditFodderText = stripHtml(sources.find((item) => item.name === "reddit-fodder-units.html").body);
const redditGrindText = stripHtml(sources.find((item) => item.name === "reddit-grindy-upgrading.html").body);
const redditCaptureStatus = /blocked|network security|whoa there/i.test(`${redditFodderText} ${redditGrindText}`)
  ? "blocked_by_network_security_not_used_as_fact"
  : "captured_but_not_used_as_primary_fact";

if (!/So how does troop upgrading work/i.test(discussionIndexText) && !/troop upgrading/i.test(troopThreadText)) {
  throw new Error("Current Steam discussion evidence for troop upgrading is missing.");
}
if (!/same species|same race|sacrifice species|choose soldier|square slot/i.test(troopThreadText)) {
  throw new Error("Steam troop upgrading discussion did not contain expected compatibility or workflow evidence.");
}

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());
const latestHash = sha256(latest.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest.gid,
  latest_hash: latestHash,
  store_price: price,
  store_notice_hash: sha256(storeText.slice(0, 2000)),
  discussion_hash: sha256(discussionIndexText.slice(0, 20000)),
  troop_thread_hash: sha256(troopThreadText.slice(0, 20000)),
  reddit_capture_status: redditCaptureStatus,
}));

const page = {
  keyword: "Pax Autocratica Troop Upgrading",
  slug,
  seo: {
    title: "Pax Autocratica Troop Upgrading: Fodder, Rarity and Boundaries",
    description:
      "A source-backed Pax Autocratica guide to troop upgrading, same-species sacrifice rules, rarity decisions, official upgrade patch context, and what not to overclaim.",
  },
  direct_answer:
    "Pax Autocratica troop upgrading is best treated as a soldier-investment decision, not a universal checklist. Official patch notes confirm that Soldier Upgrade progression has been adjusted and that special-soldier trait issues have received fixes, while the current Steam troop-upgrading discussion explains a same-species sacrifice rule and click-based upgrade workflow. Use the upgrade screen as the final in-game authority: if a captured or spare unit does not appear as upgrade material, do not force the assumption that it is bugged. Recheck species compatibility, whether the unit is eligible, and whether using that unit is worth the colony cost.",
  direct_answer_claim_ids: [
    "claim-official-upgrade-progression-ag12",
    "claim-steam-same-species-sacrifice",
    "claim-current-troop-upgrading-demand",
  ],
  sections: [
    {
      heading: "What official sources actually confirm",
      paragraphs: [
        "The strongest official upgrade-specific source is AG-12, where Multiverse says Soldier Upgrade progression was improved by reducing the points required to upgrade regular soldiers, elites and bosses. That proves troop upgrading is a maintained system, but it does not publish a full XP table, fodder formula, rarity chart or best upgrade route.",
        "ST-24 adds a later soldier-quality boundary: special soldiers such as IntelliExplorer A20 and Miralisse Novarin should no longer randomly get negative general and combat traits. That is useful context when deciding whether to invest in special soldiers, but it still does not turn every named soldier into an automatic best upgrade target.",
      ],
      steps: [
        "Treat AG-12 as proof that Soldier Upgrade progression is official and has been tuned.",
        "Treat ST-24 as a special-soldier trait fix, not a full upgrade-meta guide.",
        "Do not invent exact upgrade point costs, drop rates or rank breakpoints from patch-note wording.",
      ],
      claim_ids: ["claim-official-upgrade-progression-ag12", "claim-st24-special-soldier-trait-fix"],
    },
    {
      heading: "Why some units do not appear as fodder",
      paragraphs: [
        "The current Steam troop-upgrading discussion points to compatibility as the first thing to check: the detailed answer says the sacrifice species has to match the target soldier, and that players should click the square sacrifice slot and then choose soldiers rather than dragging a batch blindly.",
        "Because this compatibility explanation comes from player discussion rather than a formal official table, the safe wording is: check species compatibility first, then check whether the unit is locked, assigned, unavailable, too valuable or otherwise ineligible in the current build. If the in-game upgrade panel does not accept a unit, that live panel wins over any guide wording.",
      ],
      steps: [
        "Open the upgrade interface and confirm the target soldier you are upgrading.",
        "Try sacrifice material from the same species before assuming the interface is broken.",
        "Avoid sacrificing rare, named or useful workers until you know the upgrade result is worth the loss.",
        "If units still do not appear, capture the build version and report the exact target and fodder types.",
      ],
      claim_ids: ["claim-steam-same-species-sacrifice", "claim-current-troop-upgrading-demand"],
    },
    {
      heading: "When upgrading is worth the investment",
      paragraphs: [
        "The official AG-12 patch note proves upgrade progression was important enough to tune, and the current Steam discussion proves players still get stuck on the practical workflow. That makes the decision less about maxing everything and more about choosing a small set of soldiers that actually solve your current bottleneck.",
        "A good priority order is to protect proven squad roles first: medics and other support that keep the Leader alive, front-line units that consistently survive, and high-rarity soldiers whose base work speed or combat value you actually use. The page should not claim a permanent tier list, because balance, rarity and drops can change with updates.",
      ],
      steps: [
        "Upgrade a few proven squad members before trying to raise every captured unit.",
        "Favor soldiers whose role you already use in expeditions or base work.",
        "Stop before the grind blocks your sector progress; core choices, weapons and ship capacity also matter.",
      ],
      claim_ids: ["claim-official-upgrade-progression-ag12", "claim-st24-special-soldier-trait-fix"],
    },
    {
      heading: "Fear, aging and colony side effects",
      paragraphs: [
        "Troop upgrading overlaps with the colony sim because upgrade material, captured units, sacrifice choices and workforce pressure all affect which people remain available. Official store text also frames citizens as people who can become grateful, afraid, loyal or rebellious, so upgrading should not be described as a pure stat spreadsheet detached from the colony.",
        "That does not mean this page should publish a fear formula. It should tell players the safer workflow: check the colony state before mass sacrifices or conversions, watch whether the upgrade action affects unrest or fear in your current build, and avoid using core workers or near-term expedition members as disposable material unless you are prepared for the knock-on effects.",
      ],
      steps: [
        "Check fear, loyalty and workforce pressure before mass-upgrading.",
        "Use prisoners or spare captured units only when the game accepts them and the colony can absorb the decision.",
        "Consider turning soldier aging off only if you knowingly want to change that part of the experience.",
      ],
      claim_ids: ["claim-store-fear-loyalty-colony", "claim-steam-same-species-sacrifice"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not claim a complete XP table, hidden formula, guaranteed best fodder farm, exact color-to-color cost, best class tier list, species-by-species ranking or a permanent meta. It also does not treat a Steam discussion comment as official formula documentation.",
        "Its job is narrower: connect the current player question to official upgrade-related patch context, show the compatibility boundary reported in the current Steam thread, and help readers avoid wasting rare units or mistaking every rejected fodder unit for a bug.",
      ],
      steps: [
        "Use official patch notes for what changed.",
        "Use the current Steam discussion for demand and workflow clues.",
        "Use the current in-game upgrade panel as the final eligibility check.",
      ],
      claim_ids: ["claim-boundary-no-hidden-formulas"],
    },
  ],
  faq: [
    {
      question: "Why can I not use some captured units to upgrade?",
      answer:
        "The current Steam thread points first to compatibility: the detailed answer says sacrifice species has to match the target soldier. Because this is not an official formula table, confirm it in the live upgrade panel before treating it as a bug.",
      claim_ids: ["claim-steam-same-species-sacrifice"],
    },
    {
      question: "Did the developer change troop upgrading?",
      answer:
        "Yes. AG-12 says Soldier Upgrade progression was improved by reducing the points required to upgrade regular soldiers, elites and bosses. It does not publish a full cost table.",
      claim_ids: ["claim-official-upgrade-progression-ag12"],
    },
    {
      question: "Should I upgrade every soldier to the highest rarity?",
      answer:
        "No. Official sources confirm the upgrade system was tuned, but they do not say every soldier should be maxed. Upgrade the soldiers that solve your current combat or base-work bottleneck before trying to raise everyone.",
      claim_ids: ["claim-official-upgrade-progression-ag12"],
    },
    {
      question: "Does upgrading have fear or colony consequences?",
      answer:
        "It can overlap with fear, aging, sacrifice and captured-unit decisions, but no captured official source gives a precise fear formula. Watch the live colony state before mass-upgrading.",
      claim_ids: ["claim-store-fear-loyalty-colony", "claim-boundary-no-hidden-formulas"],
    },
  ],
  source_ids: [
    "src-steam-news-ag12-upgrade-20261004",
    "src-steam-news-st24-special-soldiers-20261004",
    "src-steam-discussion-troop-upgrading-20261004",
    "src-steam-store-fear-loyalty-20261004",
  ],
  claim_ids: [
    "claim-official-upgrade-progression-ag12",
    "claim-st24-special-soldier-trait-fix",
    "claim-current-troop-upgrading-demand",
    "claim-steam-same-species-sacrifice",
    "claim-store-fear-loyalty-colony",
    "claim-boundary-no-hidden-formulas",
  ],
  updated_at: checkedAt,
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-best-troops",
    "pax-autocratica-combat-classes",
    "pax-autocratica-soldier-gear",
    "pax-autocratica-capture-mechanics",
    "pax-autocratica-overworked-soldiers",
    "pax-autocratica-save-wipe",
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
  const combatGroup = guide.groups.find((group) => group.title === "Expeditions and squad combat");
  if (combatGroup && !combatGroup.slugs.includes(slug)) {
    const index = combatGroup.slugs.indexOf("pax-autocratica-combat-classes");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

function addOrReplaceSection(pageSlug, section) {
  const target = data.pages.find((candidate) => candidate.slug === pageSlug);
  if (!target) return;
  target.updated_at = checkedAt;
  target.sections ||= [];
  const index = target.sections.findIndex((item) => item.heading === section.heading);
  if (index >= 0) target.sections[index] = section;
  else target.sections.splice(Math.min(1, target.sections.length), 0, section);
  target.related_slugs ||= [];
  uniquePush(target.related_slugs, slug);
}

addOrReplaceSection("pax-autocratica-80-discount-mistake", {
  heading: "October 4 status: the 80% mistake is fixed",
  paragraphs: [
    "The Steam appdetails snapshot captured on 2026-10-04 now shows the Autumn Sale at $23.99, a 20% discount from $29.99. The Steam store description also displays an Important Notice saying the first-day Autumn Sale discount was set incorrectly and has now been fixed.",
    "That changes the current answer from '80% is visible in the live snapshot' to '80% was the mistake; the current official US snapshot is 20%'. Keep the older 80% context as history, not as a live buying instruction.",
  ],
  steps: [
    "Use the current Steam checkout for your region.",
    "Treat screenshots of the 80% price as historical unless the live checkout shows that price again.",
    "Do not infer abandonment from the corrected sale state.",
  ],
  claim_ids: ["claim-discount-fixed-20261004"],
});

addOrReplaceSection("pax-autocratica-price", {
  heading: "October 4 discount correction",
  paragraphs: [
    "The 2026-10-04 US Steam appdetails snapshot shows Pax Autocratica at $23.99, a 20% discount from $29.99, and the store description says the incorrect Autumn Sale discount has now been fixed.",
    "This means the Price page should no longer describe the 80% discount as the current live price. It remains relevant only as a short-lived pricing mistake that was corrected.",
  ],
  steps: [
    "Check the live Steam listing before purchasing.",
    "Use the 80% discount mistake page only for context about what happened.",
    "Do not rely on cached sale screenshots or third-party deal pages for today's price.",
  ],
  claim_ids: ["claim-discount-fixed-20261004"],
});

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to troop upgrading, discount correction status, live Steam price, soldier customization, base building, colony logistics, combat classes, ST-24 patch changes and Early Access questions.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica wiki, Pax Autocratica troop upgrading, Pax Autocratica upgrade soldiers, Pax Autocratica fodder units, Pax Autocratica price fixed, Pax Autocratica guide";
data.generated_at = checkedAt;

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-troop-upgrading-20261004",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-best-troops-12.webp",
  alt: "Pax Autocratica squad scene used for the troop upgrading guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 squad screenshot already present in the site media registry.",
  relevance_reason: "The page explains soldier upgrade decisions, fodder and rarity, so a squad-focused game image is appropriate.",
}, (item) => item.asset_id);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20261004-troop-upgrading",
  intent_type: "soldier_upgrade_fodder_and_rarity_decision",
  user_job: "Understand how to approach troop upgrading, why fodder may not appear, and what official sources do or do not confirm.",
  intent_evidence_ids: page.source_ids,
  answerability: "partial_with_official_patch_context_and_current_community_demand",
  coverage: [
    {
      dimension: "official_upgrade_progression",
      status: "covered",
      claim_ids: ["claim-official-upgrade-progression-ag12"],
      evidence_relation: "official_patch_note",
      notes: "AG-12 says Soldier Upgrade progression was improved by reducing required points for regular soldiers, elites and bosses.",
    },
    {
      dimension: "fodder_compatibility",
      status: "steam_discussion_reported",
      claim_ids: ["claim-steam-same-species-sacrifice"],
      evidence_relation: "steam_discussion",
      notes: "A current Steam discussion reports that sacrifice species has to match the target soldier; no official formula table captured.",
    },
  ],
  source_links: [
    { label: "Steam News API: AG-12 Soldier Upgrade progression", url: ag12.url, source_type: "official_patch_note" },
    { label: "Steam News API: ST-24 special soldier trait fix", url: st24.url, source_type: "official_patch_note" },
    { label: "Steam discussion: So how does troop upgrading work?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/", source_type: "community_discussion" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-troop-upgrading",
  boundaries: [
    "Does not publish exact XP tables, hidden formulas or drop rates.",
    "Does not treat Steam discussion comments as official formula documentation.",
    "Does not rank every class or soldier as a permanent meta.",
  ],
};

const markdown = `# ${page.keyword}

${page.direct_answer}

${page.sections.map((section) => `## ${section.heading}

${section.paragraphs.join("\n\n")}

${section.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`).join("\n\n")}

## FAQ

${page.faq.map((item) => `### ${item.question}

${item.answer}`).join("\n\n")}

## Sources

- [Steam News API: AG-12 Soldier Upgrade progression](${ag12.url}) (official patch note)
- [Steam News API: ST-24 special-soldier trait fix](${st24.url}) (official patch note)
- [Steam discussion: So how does troop upgrading work?](https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/) (current community demand)
- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/) (official store mechanics and current discount notice)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, markdown, "utf8");

function appendMdxSection(filePath, heading, body) {
  let value = fs.readFileSync(filePath, "utf8");
  const section = `\n## ${heading}\n\n${body}\n`;
  const regex = new RegExp(`\\n## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?(?=\\n## |\\nLast checked:|$)`);
  if (regex.test(value)) value = value.replace(regex, section.trimEnd());
  else value = value.replace(/\nLast checked:/, `${section}\nLast checked:`);
  value = value.replace(/Last checked: .+$/m, `Last checked: ${checkedAt}`);
  fs.writeFileSync(filePath, value, "utf8");
}

appendMdxSection(
  discountContentPath,
  "October 4 status: the 80% mistake is fixed",
  "The 2026-10-04 US Steam appdetails snapshot now shows Pax Autocratica at $23.99, a 20% discount from $29.99, and the Steam store description says the incorrect Autumn Sale discount has now been fixed.\n\n1. Use the current Steam checkout for your region.\n2. Treat screenshots of the 80% price as historical unless the live checkout shows that price again.\n3. Keep the old 80% context as a mistake explanation, not a current buying instruction."
);

appendMdxSection(
  priceContentPath,
  "October 4 discount correction",
  "The 2026-10-04 US Steam appdetails snapshot shows Pax Autocratica at $23.99, a 20% discount from $29.99. The store description also says the first-day Autumn Sale discount was set incorrectly and has now been fixed.\n\n1. Check the live Steam listing before purchasing.\n2. Use the 80% discount mistake page only for context about what happened.\n3. Do not rely on cached sale screenshots or third-party deal pages for today's price."
);

const sitemapUrls = [
  { loc: `${baseUrl}/`, lastmod: runDate },
  { loc: `${baseUrl}/guide/`, lastmod: runDate },
  ...data.pages
    .filter((item) => item.page_status !== "draft" && item.index_status !== "noindex")
    .map((item) => ({
      loc: `${baseUrl}/${item.slug}/`,
      lastmod: [slug, "pax-autocratica-price", "pax-autocratica-80-discount-mistake"].includes(item.slug)
        ? runDate
        : String(item.updated_at || "").slice(0, 10) || runDate,
    })),
];
const seenUrls = new Set();
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.filter((item) => {
  if (seenUrls.has(item.loc)) return false;
  seenUrls.add(item.loc);
  return true;
}).map((item) => `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod></url>`).join("\n")}\n</urlset>\n`;

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
fs.writeFileSync(sitemapPath, sitemapXml, "utf8");

const heldCandidates = [
  { slug: "pax-autocratica-food-plans-and-lists", reason: "Current Steam discussion shows wishlist-style demand, but no official implementation, mechanics table or direct answer evidence was captured." },
  { slug: "pax-autocratica-unit-card-activity-labels", reason: "Maps to existing Crowded UI / HUD intent; update only if developer ships a label-placement option." },
  { slug: "pax-autocratica-random-item-drops-effects", reason: "Current Steam thread is feedback/suggestion only; no official setting, fix or direct player task answer captured." },
  { slug: "pax-autocratica-fear-system-formula", reason: "Fear demand is real, but exact formulas and merge consequences lack official confirmation; covered cautiously inside Troop Upgrading rather than a formula page." },
  { slug: "pax-autocratica-discount-fixed", reason: "Important current fact, but same intent as existing 80% Discount Mistake and Price pages; updated existing pages instead of making a duplicate thin page." },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定站点、日期和输入，会把 10 月 2 日折扣错误或其他站点状态误当成今天结果。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-04 Pax Autocratica、合同 v1.5、当前站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果只沿用 10 月 2 日结论，用户会误以为 80% 折扣仍是当前价格，也会漏掉当前 troop-upgrading 需求。",
    evidence_refs: [
      "steam_news:latest_ST-24_no_new_directive",
      "steam_store:discount_fixed_20_percent",
      "discussion:So_how_does_troop_upgrading_work",
      `reddit:${redditCaptureStatus}`,
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Troop Upgrading 独立页；更新折扣错误页和 Price 页为当前 20% / mistake fixed 边界。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新页没有公开 200、canonical、sitemap 和内链，用户和搜索引擎可能看不到它。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Expeditions and squad combat"],
    recommended_action: "本地已接入 Guide、sitemap、媒体、相关页面和旧页更新；部署后验证正式路径。",
    next_review_at: "2026-10-04T10:30:00+08:00",
  },
  {
    finding_id: "D03-gsc-measurement",
    domain: "search_measurement",
    result_state: "UNKNOWN",
    resolution_status: "DEFERRED",
    severity: "P4",
    harm_text: "没有授权数据时不能把曝光、点击或访问量当作 0，也不能据此改标题、模板或广告。",
    evidence_refs: ["no_authenticated_gsc_or_analytics_export"],
    recommended_action: "保留未知状态，不做基于流量的优化判断。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D04-external-benchmark",
    domain: "external_benchmark",
    result_state: "UNKNOWN",
    resolution_status: "DEFERRED",
    severity: "P4",
    harm_text: "第三方估算不可用时，不能伪装成 Similarweb、AITDK 或 Web.Cafe 结论。",
    evidence_refs: ["no_authenticated_similarweb_webcafe_aitdk_export"],
    recommended_action: "记录不可用；候选判断使用 Steam 官方、商店、Steam 公开讨论和本地确定性检查。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D05-D08-candidate-gates",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把折扣修复、UI 标签或食物计划分别硬建页，会造成重复意图或无官方答案的薄页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Troop Upgrading；折扣修复更新旧页；其他候选 HOLD。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "content:content/en/pax-autocratica-price.mdx", "content:content/en/pax-autocratica-80-discount-mistake.mdx", "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页并更新两个价格相关旧页；未改模板、广告、DNS 或测量。",
    next_review_at: "2026-10-04T10:30:00+08:00",
  },
  {
    finding_id: "D10-deploy-verify",
    domain: "crawl_index",
    result_state: "PENDING",
    resolution_status: "IN_PROGRESS",
    severity: "P1",
    harm_text: "如果本地、GitHub 和线上版本不一致，用户看到的不是这次审核过的内容。",
    evidence_refs: ["pending_build_commit_push_deploy"],
    recommended_action: "完成 build、commit、push、Vercel 部署和线上 version/new-page 检查后更新。",
    next_review_at: "2026-10-04T10:30:00+08:00",
  },
  {
    finding_id: "D11-external-publication",
    domain: "backlink_referral",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P4",
    harm_text: "未授权平台发帖会带来垃圾推广和账号/域名信誉风险。",
    evidence_refs: ["selected_platform_ids:empty"],
    recommended_action: "没有发布清单，外部发布保持 0。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D12-report",
    domain: "measurement",
    result_state: "PASS_PENDING_FINAL_HASH",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "日报必须能回溯每项结果、证据、整改和状态。",
    evidence_refs: ["daily-report.json", "daily-report.html", "daily-report.md", "checksums.sha256"],
    recommended_action: "已生成初版日报；部署证据和最终哈希将在上线验证后回写。",
    next_review_at: "2026-10-04T10:30:00+08:00",
  },
].map((finding) => ({ ...finding, finding_hash: findingHash(finding) }));

const report = {
  schema_version: 1,
  run_id: `pax-autocratica-${runDate}`,
  site_id: "PaxAutocratica",
  game_name: "Pax Autocratica",
  canonical_domain: baseUrl,
  captured_at: checkedAt,
  run_status: "PASS_CONTENT_PENDING_DEPLOY",
  new_index_page_count: 1,
  new_index_pages: [{ slug, url: pageUrl, title: page.keyword }],
  latest_official: { title: latest.title, url: latest.url, date_utc: new Date(latest.date * 1000).toISOString(), body_sha256: latestHash },
  selected_candidate: {
    slug,
    evidence: [
      "Current Steam discussion asks how troop upgrading works and why batches cannot be placed.",
      "Current Steam discussion answer reports same-species sacrifice material and a click-based upgrade workflow.",
      "Official AG-12 patch notes confirm Soldier Upgrade progression was adjusted.",
      "Official ST-24 patch notes confirm special soldier trait fixes relevant to upgrade investment decisions.",
    ],
    boundary: "No exact XP table, hidden formula, drop-rate claim, permanent tier list or official same-species formula is published.",
  },
  updated_existing_pages: [
    { slug: "pax-autocratica-80-discount-mistake", reason: "Updated current status: 80% mistake fixed; live US snapshot now shows 20% / $23.99." },
    { slug: "pax-autocratica-price", reason: "Updated current price boundary from 80% warning to corrected 20% sale snapshot." },
  ],
  held_candidates: heldCandidates,
  external_publications: 0,
  deferred_data: ["GSC", "Analytics/measurement export", "Similarweb", "Web.Cafe", "AITDK", "Ad revenue export"],
  no_change_site_reason: "No direct evidence required changing templates, ads, measurement, DNS or forced indexing.",
  findings,
};

writeJson("daily-state.json", {
  schema_version: 1,
  run_id: report.run_id,
  site_id: "PaxAutocratica",
  date: runDate,
  timezone: "Asia/Shanghai",
  status: "content_generated_pending_build_deploy",
  locked_at: checkedAt,
  input_hash: inputHash,
  source_capture_count: sourceFiles.length,
});
writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: report.latest_official,
  current_store_snapshot: {
    currency: price.currency,
    initial: price.initial_formatted,
    final: price.final_formatted,
    discount_percent: price.discount_percent,
    discount_notice: "incorrect Autumn Sale discount fixed",
  },
  current_discussions: [
    { title: "So how does troop upgrading work?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/", disposition: "CREATE_CANDIDATE" },
    { title: "The fear system makes this game bad", url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184621984/", disposition: "MERGE_CONTEXT_INTO_SELECTED_PAGE" },
    { title: "Food plans and lists", url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184657223/", disposition: "HOLD" },
    { title: "Unit Card Suggestion", url: "https://steamcommunity.com/app/1067360/discussions/0/586187800873806288/", disposition: "UPDATE_EXISTING_CROWDED_UI_IF_SHIPPED" },
  ],
  reddit_capture_status: redditCaptureStatus,
  sources: sourceFiles.map((name) => ({ name, path: `sources/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-troop-upgrading-20261004",
      disposition: "CREATE_CANDIDATE",
      reason: "Current Steam thread shows live player confusion around troop upgrading placement.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/"],
    },
    {
      source_id: "src-steam-store-discount-fixed-20261004",
      disposition: "UPDATE_EXISTING",
      reason: "Current official store snapshot says the incorrect discount has been fixed and shows 20% / $23.99.",
      affected_routes: ["/pax-autocratica-80-discount-mistake/", "/pax-autocratica-price/"],
      evidence_urls: ["https://store.steampowered.com/app/1067360/Pax_Autocratica/"],
    },
    {
      source_id: "src-other-current-discussions-20261004",
      disposition: "HOLD_OR_UPDATE_EXISTING",
      reason: "Food plans, unit card labels, item drops/effects and fear formula do not independently pass source/content gates today.",
      affected_routes: ["/pax-autocratica-crowded-ui/", `/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "official_patch_context_plus_current_repeated_community_demand", duplicate_gate: "distinct_from_best_troops_combat_classes_soldier_gear", content_gate: "direct decision guide_with_boundaries" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica troop upgrading", parent_query: "Pax Autocratica troops", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica sacrifice species", parent_query: "Pax Autocratica troop upgrading", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica upgrade soldiers same species", parent_query: "Pax Autocratica troop upgrading", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187704184611019/", depth: 2, status: "covered_as_community_report" },
    { keyword: "Pax Autocratica discount fixed", parent_query: "Pax Autocratica price", source_type: "official_store", source_url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", depth: 1, status: "update_existing" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct soldier-upgrade decision intent with official patch context and repeated community demand." }], updates: ["pax-autocratica-price", "pax-autocratica-80-discount-mistake"], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica troop upgrading", "Pax Autocratica upgrade soldiers"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, official/community evidence, duplicate, content and production gates." }, { slug: "pax-autocratica-price", decision: "UPDATE_EXISTING", reason: "Current official store snapshot changed from 80% mistake to fixed 20% discount." }, { slug: "pax-autocratica-80-discount-mistake", decision: "UPDATE_EXISTING", reason: "Current-status boundary changed after Steam fixed the incorrect discount." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Price page with corrected 20% sale snapshot", "Updated 80% Discount Mistake page with fixed-status boundary", "Updated Guide access group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/pax-autocratica-price/", "/pax-autocratica-80-discount-mistake/", "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>同步更新：<a href="${baseUrl}/pax-autocratica-price/">${baseUrl}/pax-autocratica-price/</a> · <a href="${baseUrl}/pax-autocratica-80-discount-mistake/">${baseUrl}/pax-autocratica-80-discount-mistake/</a></p><p>今日核心证据：AG-12 Soldier Upgrade progression、当前 Steam troop-upgrading 讨论、Steam 商店 20% corrected discount。Reddit 抓取状态：${escapeHtml(redditCaptureStatus)}，未作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

同步更新：${baseUrl}/pax-autocratica-price/ 和 ${baseUrl}/pax-autocratica-80-discount-mistake/

今日核心证据：AG-12 Soldier Upgrade progression、当前 Steam troop-upgrading 讨论，以及 Steam 商店 20% corrected discount。Reddit 抓取状态：${redditCaptureStatus}，未作为事实依据。

外部发布：0。原因：用户未提供本次允许发布平台清单。

延后数据：${report.deferred_data.join(", ")}。

${findings.map((finding) => `## ${finding.finding_id}

- 结果：${finding.result_state}
- 危害：${finding.harm_text}
- 证据：${finding.evidence_refs.join("; ")}
- 动作：${finding.recommended_action}
- 状态：${finding.resolution_status}
- 哈希：${finding.finding_hash}`).join("\n\n")}
`;
writeText("daily-report.md", reportMd);

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
  "site-health.json",
  "search-performance.json",
  "measurement-health.json",
  "external-benchmark.json",
  "aitdk-compatibility.json",
  "revenue-metrics.json",
  "health-findings.raw.jsonl",
  "daily-report.json",
  "daily-report.html",
  "daily-report.md",
  ...sourceFiles.map((name) => `sources/${name}`),
];
writeText("checksums.sha256", `${checksumTargets.filter((file) => fs.existsSync(path.join(runDir, file))).map((file) => `${sha256File(path.join(runDir, file))}  ${file}`).join("\n")}\n`);

console.log(JSON.stringify({ status: "generated", slug, runDir, sourceFiles: sourceFiles.length, price: price.final_formatted, discount: price.discount_percent }, null, 2));
