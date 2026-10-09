import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-09";
const checkedAt = "2026-10-09T10:35:00+08:00";
const nextRunAt = "2026-10-10T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-humiliated-resentful-agitated-status";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentDir = path.join(root, "content", "en");
const contentPath = path.join(contentDir, `${slug}.mdx`);
const priceContentPath = path.join(contentDir, "pax-autocratica-price.mdx");
const discountContentPath = path.join(contentDir, "pax-autocratica-80-discount-mistake.mdx");
const tradePortContentPath = path.join(contentDir, "pax-autocratica-trade-port.mdx");

fs.mkdirSync(sourceDir, { recursive: true });

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
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
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

function writeJson(name, value) {
  fs.writeFileSync(path.join(runDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(name, value) {
  fs.writeFileSync(path.join(runDir, name), value, "utf8");
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

function addOrReplaceSection(page, section, insertIndex = 1) {
  if (!page) return;
  page.updated_at = checkedAt;
  page.sections ||= [];
  const index = page.sections.findIndex((item) => item.heading === section.heading);
  if (index >= 0) page.sections[index] = section;
  else page.sections.splice(Math.min(insertIndex, page.sections.length), 0, section);
  page.related_slugs ||= [];
  uniquePush(page.related_slugs, slug);
}

function replaceMdxSection(filePath, heading, body) {
  let text = fs.readFileSync(filePath, "utf8");
  const marker = `\n## ${heading}\n`;
  const nextHeading = /\n## /g;
  const start = text.indexOf(marker);
  if (start >= 0) {
    nextHeading.lastIndex = start + marker.length;
    const next = nextHeading.exec(text);
    const end = next ? next.index : text.length;
    text = `${text.slice(0, start)}\n## ${heading}\n\n${body.trim()}\n${text.slice(end)}`;
  } else {
    text = `${text.trim()}\n\n## ${heading}\n\n${body.trim()}\n`;
  }
  fs.writeFileSync(filePath, text, "utf8");
}

const sources = [];
sources.push(await capture("steam-news-api.json", "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=30&maxlength=50000&format=json"));
sources.push(await capture("steam-appdetails-us.json", "https://store.steampowered.com/api/appdetails?appids=1067360&cc=us&l=en"));
sources.push(await capture("steam-discussions-english.html", "https://steamcommunity.com/app/1067360/discussions/0/?l=english"));
sources.push(await capture("discussion-humiliated-resentful-agitated.html", "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/"));
sources.push(await capture("discussion-trade-port-current.html", "https://steamcommunity.com/app/1067360/discussions/0/586188069723489953/"));
sources.push(await capture("discussion-prison-bug-current.html", "https://steamcommunity.com/app/1067360/discussions/0/586188069723598541/"));
sources.push(await capture("discussion-third-person-current.html", "https://steamcommunity.com/app/1067360/discussions/0/586188069723629608/"));
sources.push(await capture("discussion-rpg-mode-current.html", "https://steamcommunity.com/app/1067360/discussions/0/586188069723503770/"));
sources.push(await capture("youtube-search-latest.html", "https://www.youtube.com/results?search_query=Pax+Autocratica&sp=CAI%253D"));
sources.push(await capture("official-site.html", "https://www.paxautocratica.com/"));
sources.push(await capture("reddit-search.html", "https://www.reddit.com/search/?q=Pax%20Autocratica&sort=new"));

const news = JSON.parse(sources.find((item) => item.name === "steam-news-api.json").body);
const latest = news?.appnews?.newsitems?.[0];
const st24 = news?.appnews?.newsitems?.find((item) => item.title.includes("ST-24"));
if (!latest?.title?.includes("ST-24")) {
  throw new Error(`Latest official Steam News expected ST-24, got ${latest?.title || "missing"}`);
}
if (!st24?.contents?.includes("Reviving speed") && !st24?.contents?.includes("Trade Port")) {
  throw new Error("ST-24 official current patch-context evidence missing from Steam News API.");
}

const storeData = JSON.parse(sources.find((item) => item.name === "steam-appdetails-us.json").body);
const appDetails = storeData?.["1067360"]?.data;
const price = appDetails?.price_overview;
const storeText = stripHtml(appDetails?.detailed_description || "");
if (!price || price.final !== 2999 || price.discount_percent !== 0 || !/mistake has now been fixed/i.test(storeText)) {
  throw new Error(`Expected current Steam store to show $29.99 / 0% and fixed-discount notice, got ${JSON.stringify(price)} / ${storeText.slice(0, 200)}`);
}

const discussionIndexText = stripHtml(sources.find((item) => item.name === "steam-discussions-english.html").body);
const humiliatedText = stripHtml(sources.find((item) => item.name === "discussion-humiliated-resentful-agitated.html").body);
const tradePortText = stripHtml(sources.find((item) => item.name === "discussion-trade-port-current.html").body);
const prisonBugText = stripHtml(sources.find((item) => item.name === "discussion-prison-bug-current.html").body);
const thirdPersonText = stripHtml(sources.find((item) => item.name === "discussion-third-person-current.html").body);
const rpgModeText = stripHtml(sources.find((item) => item.name === "discussion-rpg-mode-current.html").body);
const youtubeText = stripHtml(sources.find((item) => item.name === "youtube-search-latest.html").body);
const redditText = stripHtml(sources.find((item) => item.name === "reddit-search.html").body);
const redditCaptureStatus = /blocked|network security|whoa there|login|Log In|403|429/i.test(redditText)
  ? "unavailable_or_blocked_not_used_as_fact"
  : "captured_search_page_no_primary_fact";

if (!/Humiliated, Resentful, Agitated Status/i.test(discussionIndexText) || !/Humiliated, Resentful, Agitated Status/i.test(humiliatedText)) {
  throw new Error("Current Steam discussion evidence for Humiliated/Resentful/Agitated status is missing.");
}
if (!/deepen the colony sim with more interactions/i.test(humiliatedText) || !/public bath/i.test(humiliatedText) || !/loosing a brawl|losing a brawl/i.test(humiliatedText)) {
  throw new Error("Developer boundary for social statuses was not captured.");
}
if (!/losing a brawl|loosing a brawl|not all related to the player actions/i.test(humiliatedText)) {
  throw new Error("Expected status-cause boundary is missing from the Humiliated thread.");
}
if (!/Trade Port/i.test(tradePortText) || !/rework card with a fix|todo list/i.test(tradePortText)) {
  throw new Error("Current Trade Port rework/fix developer evidence was not captured.");
}

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const latestHash = sha256(latest.contents || "");
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest.gid,
  latest_hash: latestHash,
  store_price: price,
  store_notice_hash: sha256(storeText.slice(0, 2000)),
  discussion_index_hash: sha256(discussionIndexText.slice(0, 30000)),
  humiliated_thread_hash: sha256(humiliatedText.slice(0, 30000)),
  trade_port_hash: sha256(tradePortText.slice(0, 20000)),
  reddit_capture_status: redditCaptureStatus,
}));

const page = {
  keyword: "Pax Autocratica Humiliated, Resentful and Agitated Status",
  slug,
  seo: {
    title: "Pax Autocratica Humiliated, Resentful, Agitated Status Help",
    description:
      "A source-backed Pax Autocratica guide to Humiliated, Resentful and Agitated statuses, social interactions, public bath support, brawls and reporting boundaries.",
  },
  direct_answer:
    "Humiliated, Resentful and Agitated in Pax Autocratica should be treated as colony-social status effects first, not as proof that the player personally caused every problem. In the current Steam thread, Multiverse says the team plans to deepen the colony sim with more interactions, directives and buildings, but for now some citizens simply are not friendly. The developer also says these statuses can appear when certain interactions happen, such as losing a brawl, and are not all related to player actions. Use public baths and other positive buildings as mood support, check traits and recent fights, and avoid inventing an exact loyalty or fear formula until a dated patch note publishes one.",
  direct_answer_claim_ids: [
    "claim-status-current-player-demand-20261009",
    "claim-status-developer-social-boundary-20261009",
    "claim-store-colony-social-systems-20261009",
  ],
  sections: [
    {
      heading: "What the current developer reply confirms",
      paragraphs: [
        "The strongest current source is the Steam thread titled Humiliated, Resentful, Agitated Status. The player describes seeing insults, reconciliation, low loyalty growth, and status labels that feel random when playing a benevolent-leader colony.",
        "Multiverse answers that deeper colony-sim interactions, directives and buildings are planned or considered, but also gives a current-build boundary: some people not being friendly is standard, public bath and other positive buildings can help mood, and the status labels can appear from interactions such as losing a brawl. That means the page should explain a social-system checklist, not a hidden punishment formula.",
      ],
      steps: [
        "Treat the status as a social or mood signal before assuming a broken save.",
        "Look for recent brawls, insults, hostile interactions or unfriendly traits.",
        "Use positive mood buildings such as public baths where your current build supports them.",
        "Do not claim every Humiliated or Resentful citizen was caused by one player decree.",
      ],
      claim_ids: ["claim-status-current-player-demand-20261009", "claim-status-developer-social-boundary-20261009"],
    },
    {
      heading: "How to investigate without overreacting",
      paragraphs: [
        "The safest workflow is to separate social conflict from fatigue, food, fear and base fights. A citizen can look like a management failure when the immediate cause is a social interaction, a recent brawl or a mood facility gap. Change one variable at a time so you can tell what actually helped.",
        "If the affected citizen is also Overworked or Exhausted, fix the schedule and recovery issue first. If the same citizens are also starting fights, inspect traits and conflict patterns. If the status appears after a known brawl, wait through a normal recovery window before punishing, exiling or replacing people.",
      ],
      steps: [
        "Record the status, citizen name, traits, job, schedule and recent interactions.",
        "Check whether the citizen recently lost a brawl or was involved in insults.",
        "Add or improve mood support before changing the whole colony policy.",
        "Run one comparable day before deciding the status is permanent.",
      ],
      claim_ids: ["claim-status-developer-social-boundary-20261009", "claim-store-colony-social-systems-20261009"],
    },
    {
      heading: "What positive buildings can and cannot prove",
      paragraphs: [
        "The developer specifically names public bath and other positive buildings as mood help. That is useful enough for a practical checklist, but it is not a published table of exact status-removal values. Use these buildings as support infrastructure, not as a guaranteed instant cure.",
        "If adding mood support reduces the status frequency, keep the change and document the build. If nothing changes, preserve the evidence and avoid stacking unrelated punishments that make the colony harder to diagnose.",
      ],
      steps: [
        "Confirm positive buildings are built, staffed and reachable.",
        "Watch whether the status clears after normal social and sleep cycles.",
        "Avoid assuming one public bath fixes every Resentful or Agitated case.",
      ],
      claim_ids: ["claim-status-developer-social-boundary-20261009"],
    },
    {
      heading: "When to report it",
      paragraphs: [
        "Report the issue when the same status looks repeatable, permanent or disconnected from readable interactions after normal recovery checks. A good report should give the team enough context to separate intended social simulation from a stuck status label.",
        "Include citizen names, status labels, traits, recent fights or insults, work schedule, mood buildings, fear and loyalty context, and whether the status survived reload or a full day cycle.",
      ],
      steps: [
        "Capture the build date and the exact status labels.",
        "List recent social events, brawls, public bath availability and work schedule.",
        "Mention whether the colony is benevolent, fear-heavy or mixed.",
        "Use the Steam support or in-game feedback route if the symptom is repeatable.",
      ],
      claim_ids: ["claim-status-current-player-demand-20261009"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not publish an exact mood formula, loyalty threshold, fear target, brawl probability, public-bath value, or guaranteed cure for Humiliated, Resentful and Agitated. The captured developer reply supports cause categories and a safe investigation path, not a complete mechanics database.",
        "Update this page when Multiverse publishes dated patch notes for social interactions, mood buildings, directives, citizen conflict or status display. Until then, treat it as current Early Access guidance with clear evidence boundaries.",
      ],
      steps: [
        "Use the Steam thread for current status behavior and developer boundary.",
        "Use the official store for broad colony-social system language.",
        "Use future patch notes for exact values or confirmed fixes.",
      ],
      claim_ids: ["claim-boundary-no-status-formula-20261009"],
    },
  ],
  faq: [
    {
      question: "Are Humiliated, Resentful and Agitated always my fault?",
      answer:
        "No. The current developer reply says these statuses can appear from interactions such as losing a brawl and are not all related to player actions.",
      claim_ids: ["claim-status-developer-social-boundary-20261009"],
    },
    {
      question: "What should I check first?",
      answer:
        "Check recent brawls or insults, the affected citizen's traits, schedule pressure, and whether positive mood buildings such as public baths are available.",
      claim_ids: ["claim-status-developer-social-boundary-20261009"],
    },
    {
      question: "Is there an exact loyalty or fear formula?",
      answer:
        "No captured official source gives an exact formula. Treat fear, loyalty and mood as real systems, but do not publish a hidden threshold as fact.",
      claim_ids: ["claim-store-colony-social-systems-20261009", "claim-boundary-no-status-formula-20261009"],
    },
    {
      question: "Does this mean deeper colony sim updates are confirmed?",
      answer:
        "The developer says there are plans to deepen the colony sim and that the idea will be taken into consideration. That is a direction signal, not a dated release promise.",
      claim_ids: ["claim-status-developer-social-boundary-20261009"],
    },
  ],
  source_ids: [
    "src-steam-discussion-statuses-20261009",
    "src-steam-store-social-systems-20261009",
    "src-steam-news-st24-20261009",
  ],
  claim_ids: [
    "claim-status-current-player-demand-20261009",
    "claim-status-developer-social-boundary-20261009",
    "claim-store-colony-social-systems-20261009",
    "claim-boundary-no-status-formula-20261009",
  ],
  updated_at: checkedAt,
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-soldiers-fighting-base",
    "pax-autocratica-overworked-soldiers",
    "pax-autocratica-base-building",
    "pax-autocratica-healing-food",
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
  const combatGroup = guide.groups.find((group) => group.title === "Expeditions and squad combat");
  if (combatGroup && !combatGroup.slugs.includes(slug)) {
    const index = combatGroup.slugs.indexOf("pax-autocratica-soldiers-fighting-base");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

const pricePage = data.pages.find((candidate) => candidate.slug === "pax-autocratica-price");
const discountPage = data.pages.find((candidate) => candidate.slug === "pax-autocratica-80-discount-mistake");
const tradePortPage = data.pages.find((candidate) => candidate.slug === "pax-autocratica-trade-port");

const currentPriceSection = {
  heading: "October 9 US snapshot: no active discount",
  paragraphs: [
    "The 2026-10-09 US Steam appdetails snapshot shows Pax Autocratica at $29.99 with 0% discount. The store description still displays the Important Notice saying the first-day Autumn Sale discount was set incorrectly and has now been fixed.",
    "That changes the current price boundary again: the 80% discount was the mistake, the 20% sale was a corrected sale snapshot on October 4, and today's captured US snapshot shows no active discount. Use the live Steam checkout for your region before purchasing.",
  ],
  steps: [
    "Treat both the 80% and 20% screenshots as historical unless the live listing shows them again.",
    "Use the live Steam checkout for your region and account.",
    "Do not infer abandonment or a permanent price from any cached sale screenshot.",
  ],
  claim_ids: ["claim-price-us-no-active-discount-20261009"],
};

addOrReplaceSection(pricePage, currentPriceSection, 1);
addOrReplaceSection(discountPage, currentPriceSection, 1);
addOrReplaceSection(tradePortPage, {
  heading: "October 9 recheck: Trade Port rework remains pending",
  paragraphs: [
    "A current Steam thread asks about Trade Port behavior, and a developer reply says the team has a rework card with a fix to that issue and other Trade Port improvements on the todo list.",
    "That is stronger than a random player guess, but still not a shipped patch note. Keep using this page as a caution checklist until a dated official update documents the exact Trade Port changes.",
  ],
  steps: [
    "Use the current thread as evidence that Trade Port improvements remain on the team's todo list.",
    "Do not claim the rework is already live.",
    "Recheck the next directive before publishing item tables or direct-sell advice.",
  ],
  claim_ids: ["claim-trade-port-rework-pending-20261009"],
}, 1);

replaceMdxSection(priceContentPath, currentPriceSection.heading, `${currentPriceSection.paragraphs.join("\n\n")}\n\n${currentPriceSection.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nLast checked: ${checkedAt}`);
replaceMdxSection(discountContentPath, currentPriceSection.heading, `${currentPriceSection.paragraphs.join("\n\n")}\n\n${currentPriceSection.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nLast checked: ${checkedAt}`);
replaceMdxSection(tradePortContentPath, "October 9 recheck: Trade Port rework remains pending", `A current Steam thread asks about Trade Port behavior, and a developer reply says the team has a rework card with a fix to that issue and other Trade Port improvements on the todo list.\n\nThat is stronger than a random player guess, but still not a shipped patch note. Keep using this page as a caution checklist until a dated official update documents the exact Trade Port changes.\n\n1. Use the current thread as evidence that Trade Port improvements remain on the team's todo list.\n2. Do not claim the rework is already live.\n3. Recheck the next directive before publishing item tables or direct-sell advice.\n\nLast checked: ${checkedAt}`);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  last_checked_at: checkedAt,
  source_links: [
    {
      label: "Steam discussion: Humiliated, Resentful, Agitated Status",
      url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/",
      source_type: "steam_discussion",
    },
    {
      label: "Steam store: Pax Autocratica",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_platform",
    },
    {
      label: "Steam News API: latest official update remains ST-24",
      url: latest.url,
      source_type: "official_community",
    },
  ],
};

data.pageProvenance["pax-autocratica-price"] ||= { source_links: [] };
data.pageProvenance["pax-autocratica-price"].last_checked_at = checkedAt;
replaceOrPush(data.pageProvenance["pax-autocratica-price"].source_links, {
  label: "Steam appdetails US snapshot: $29.99 / 0% discount",
  url: "https://store.steampowered.com/api/appdetails?appids=1067360&cc=us&l=en",
  source_type: "official_platform_api",
}, (value) => value.label);

data.pageProvenance["pax-autocratica-80-discount-mistake"] ||= { source_links: [] };
data.pageProvenance["pax-autocratica-80-discount-mistake"].last_checked_at = checkedAt;
replaceOrPush(data.pageProvenance["pax-autocratica-80-discount-mistake"].source_links, {
  label: "Steam appdetails US snapshot: no active discount on Oct 9",
  url: "https://store.steampowered.com/api/appdetails?appids=1067360&cc=us&l=en",
  source_type: "official_platform_api",
}, (value) => value.label);

data.pageProvenance["pax-autocratica-trade-port"] ||= { source_links: [] };
data.pageProvenance["pax-autocratica-trade-port"].last_checked_at = checkedAt;
replaceOrPush(data.pageProvenance["pax-autocratica-trade-port"].source_links, {
  label: "Steam discussion: About trade port",
  url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723489953/",
  source_type: "steam_discussion",
}, (value) => value.label);

data.media ||= [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-humiliated-status-20261009",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-home-01.webp",
  alt: "Pax Autocratica colony scene used for the Humiliated Resentful Agitated status guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Shows colony-management context for social status guidance without inventing a status-specific screenshot.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to colony mood statuses, healing food, prison interrogation freezes, troop upgrading, price correction status and base logistics.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica Humiliated status, Pax Autocratica Resentful status, Pax Autocratica Agitated status, Pax Autocratica public bath, Pax Autocratica wiki";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(6, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "Decode Mood Status",
    description: "Check Humiliated, Resentful and Agitated without inventing hidden formulas.",
    href: `/${slug}/`,
  });
  startCards.forEach((item, index) => { item.number = String(index + 1); });
}

const previousSitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
const previousLastmods = new Map();
for (const match of previousSitemap.matchAll(/<url><loc>https:\/\/paxautocratica\.vip\/([^<]*)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)) {
  const key = match[1] || "";
  previousLastmods.set(key.replace(/\/$/, ""), match[2]);
}
const sitemapPages = data.pages
  .filter((candidate) => candidate.page_status === "publish" && candidate.index_status === "index")
  .map((candidate) => candidate.slug);
const changedSlugs = new Set([slug, "pax-autocratica-price", "pax-autocratica-80-discount-mistake", "pax-autocratica-trade-port"]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${baseUrl}/</loc><lastmod>${runDate}</lastmod></url>\n  <url><loc>${baseUrl}/guide/</loc><lastmod>${runDate}</lastmod></url>\n${sitemapPages.map((pageSlug) => `  <url><loc>${baseUrl}/${pageSlug}/</loc><lastmod>${changedSlugs.has(pageSlug) ? runDate : (previousLastmods.get(pageSlug) || runDate)}</lastmod></url>`).join("\n")}\n</urlset>\n`;

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
fs.writeFileSync(sitemapPath, sitemap, "utf8");

const mdx = `# ${page.keyword}

${page.direct_answer}

${page.sections.map((section) => `## ${section.heading}

${section.paragraphs.join("\n\n")}

${section.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`).join("\n\n")}

## FAQ

${page.faq.map((item) => `### ${item.question}

${item.answer}`).join("\n\n")}

## Sources

- [Steam discussion: Humiliated, Resentful, Agitated Status](https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/)
- [Steam store: Pax Autocratica](https://store.steampowered.com/app/1067360/Pax_Autocratica/)
- [Steam News API: ST-24 remains the latest official update](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844751498221781)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const heldCandidates = [
  { slug: "pax-autocratica-third-person-view", reason: "Current thread answer says no plans as of August 2026; useful status, but thin and already overlaps current feature-status/Roadmap intent unless repeated demand grows." },
  { slug: "pax-autocratica-prison-bug-old-prisoner", reason: "Current thread appears isolated and maps to existing Prison Interrogation Freeze/Bug Reporting guidance; no separate page." },
  { slug: "pax-autocratica-next-update-plan", reason: "Chinese next-plan thread lacks enough captured official detail beyond existing Roadmap/ST-24 pages." },
  { slug: "pax-autocratica-rpg-mode", reason: "Developer/community reply says suggestion may be considered, but it is a feature request without shipped implementation." },
  { slug: "pax-autocratica-doomsday-arsenal-bug", reason: "Bug report was resolved by picking up the nuke in-thread; too narrow for a separate index page today." },
  { slug: "pax-autocratica-trade-port-rework", reason: "Direct evidence exists but same intent as existing Trade Port page; updated existing page instead of creating a duplicate." },
  { slug: "pax-autocratica-credit-cap", reason: "Suggestion thread has no direct official implementation boundary and is too speculative." },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果不锁定日期、站点和上次状态，会把 10-07 未完成目录或 10-08 调度时间误当成完整日报，导致重复或漏做。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, "previous_complete_memory:2026-10-06", "incomplete_growth_run:2026-10-07_RUNNING_only"],
    recommended_action: "已锁定 2026-10-09 Pax Autocratica、合同 v1.5、当前 HEAD 和本轮输入；10-07/10-08 状态缺口写入日报。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果只沿用 10-06 结论，用户会继续看到过期价格状态，也会漏掉当前殖民地状态困惑。",
    evidence_refs: [
      "steam_news:latest_ST-24_no_new_directive",
      "steam_store:us_price_29_99_discount_0_fixed_notice",
      "discussion:Humiliated_Resentful_Agitated_Status",
      "discussion:Trade_Port_rework_todo",
      "discussion:Prison_bug_isolated_case",
      `reddit:${redditCaptureStatus}`,
      `youtube:${youtubeText.includes("Pax Autocratica") ? "captured_search_page" : "captured_low_signal"}`,
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Humiliated/Resentful/Agitated 状态页；价格页和 80% 错误页更新为今日 0% 折扣；Trade Port 页更新为 rework 仍待发布。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新页没有 200、canonical、sitemap 和内链，用户和搜索引擎可能看不到今天新增内容。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Expeditions and squad combat"],
    recommended_action: "本地已接入 Guide、sitemap、媒体、相关页、首页卡片和来源登记；部署后验证正式路径。",
    next_review_at: "2026-10-09T12:00:00+08:00",
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
    harm_text: "如果把第三人称、RPG 模式、单例 prison bug 或 Trade Port rework 分别硬建页，会造成薄页、重复意图或未发布功能页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Humiliated/Resentful/Agitated 状态页；Trade Port 与价格事实更新既有页；其他候选 HOLD。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务，不能只是新闻改写。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "content:content/en/pax-autocratica-price.mdx", "content:content/en/pax-autocratica-80-discount-mistake.mdx", "content:content/en/pax-autocratica-trade-port.mdx", "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页并更新三个既有页事实边界；未改模板、广告、DNS、测量或强制收录。",
    next_review_at: "2026-10-09T12:00:00+08:00",
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
    next_review_at: "2026-10-09T12:00:00+08:00",
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
    harm_text: "日报必须能回溯每项结果、证据、整改和状态，否则明天会重复或丢证据。",
    evidence_refs: ["daily-report.json", "daily-report.html", "daily-report.md", "checksums.sha256"],
    recommended_action: "已生成初版日报；部署证据和最终哈希将在上线验证后回写。",
    next_review_at: "2026-10-09T12:00:00+08:00",
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
      "Current Steam discussion asks why Humiliated, Resentful and Agitated feel random.",
      "Developer reply says deeper colony-sim interactions are planned/considered.",
      "Developer reply says some people not being friendly is standard, public bath/positive buildings can help mood, and statuses can come from interactions such as losing a brawl.",
      "Official Steam store supports broad colony-social language around fear, loyalty, bonds, rebellion and choices shaping society.",
    ],
    boundary: "No exact mood formula, loyalty threshold, fear target, public-bath value, brawl probability or guaranteed cure is published.",
  },
  updated_existing_pages: [
    { slug: "pax-autocratica-price", reason: "Current US Steam appdetails snapshot now shows $29.99 / 0% discount." },
    { slug: "pax-autocratica-80-discount-mistake", reason: "Updated current status from Oct 4 corrected-sale snapshot to Oct 9 no-active-discount snapshot." },
    { slug: "pax-autocratica-trade-port", reason: "Current developer reply says Trade Port rework/fix remains on todo list; no shipped rework claim." },
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
  previous_run_gap: {
    automation_last_run_utc: "2026-10-08T09:55:28.610Z",
    latest_complete_memory_entry: "2026-10-06",
    incomplete_local_run_dir: "2026-10-07",
  },
});
writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: report.latest_official,
  current_store_snapshot: {
    currency: price.currency,
    initial: price.initial_formatted || "$29.99",
    final: price.final_formatted,
    discount_percent: price.discount_percent,
    discount_notice: "incorrect Autumn Sale discount fixed; no active US discount in current snapshot",
  },
  current_discussions: [
    { title: "Humiliated, Resentful, Agitated Status", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/", disposition: "CREATE_CANDIDATE" },
    { title: "About trade port", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723489953/", disposition: "UPDATE_EXISTING" },
    { title: "Prison bug", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723598541/", disposition: "MERGE_EXISTING_OR_HOLD" },
    { title: "Will the game have a 3rd person view?", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723629608/", disposition: "HOLD_THIN_STATUS" },
    { title: "Can we get an RPG mode?", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723503770/", disposition: "HOLD_FEATURE_REQUEST" },
  ],
  reddit_capture_status: redditCaptureStatus,
  youtube_capture_status: youtubeText.includes("Pax Autocratica") ? "captured_search_page_no_video_change" : "captured_low_signal",
  sources: sourceFiles.map((name) => ({ name, path: `sources/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-statuses-20261009",
      disposition: "CREATE_CANDIDATE",
      reason: "Current Steam thread shows a distinct player task around Humiliated/Resentful/Agitated statuses and has a developer boundary reply.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/"],
    },
    {
      source_id: "src-steam-store-price-20261009",
      disposition: "UPDATE_EXISTING",
      reason: "Current official US appdetails snapshot shows $29.99 / 0% discount, changing the current price boundary.",
      affected_routes: ["/pax-autocratica-price/", "/pax-autocratica-80-discount-mistake/"],
      evidence_urls: ["https://store.steampowered.com/api/appdetails?appids=1067360&cc=us&l=en"],
    },
    {
      source_id: "src-steam-discussion-trade-port-20261009",
      disposition: "UPDATE_EXISTING",
      reason: "Current developer reply says Trade Port rework/fix remains on todo list, but no shipped patch exists.",
      affected_routes: ["/pax-autocratica-trade-port/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188069723489953/"],
    },
    {
      source_id: "src-other-current-discussions-20261009",
      disposition: "HOLD_OR_MERGE_EXISTING",
      reason: "Third-person, RPG mode, prison bug, doomsday arsenal and credit-cap threads do not independently pass today's new-page gates.",
      affected_routes: ["/pax-autocratica-prison-interrogation-freeze/", "/pax-autocratica-supreme-powers-petition/", "/pax-autocratica-roadmap/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "current_player_thread_plus_developer_reply_plus_official_store_social_system_boundary", duplicate_gate: "distinct_from_overworked_and_soldiers_fighting_in_base", content_gate: "direct_status_diagnosis_and_reporting_path" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica Humiliated status", parent_query: "Pax Autocratica statuses", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica Resentful status", parent_query: "Pax Autocratica mood", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica Agitated status", parent_query: "Pax Autocratica mood", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica public bath mood", parent_query: "Pax Autocratica colony sim", source_type: "developer_reply", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723518147/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica price no discount", parent_query: "Pax Autocratica price", source_type: "official_store_api", source_url: "https://store.steampowered.com/api/appdetails?appids=1067360&cc=us&l=en", depth: 1, status: "update_existing" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct colony-status task with current player demand, developer boundary and official social-system support." }], updates: ["pax-autocratica-price", "pax-autocratica-80-discount-mistake", "pax-autocratica-trade-port"], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica Humiliated status", "Pax Autocratica Resentful status", "Pax Autocratica Agitated status"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, current evidence, developer boundary, duplicate, content and production gates." }, { slug: "pax-autocratica-price", decision: "UPDATE_EXISTING", reason: "Current official store snapshot changed to $29.99 / 0% discount." }, { slug: "pax-autocratica-80-discount-mistake", decision: "UPDATE_EXISTING", reason: "Current-status boundary changed after no active US discount was captured." }, { slug: "pax-autocratica-trade-port", decision: "UPDATE_EXISTING", reason: "Current developer reply confirms Trade Port rework/fix remains pending." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Price page with Oct 9 no-active-discount snapshot", "Updated 80% Discount Mistake page with Oct 9 no-active-discount boundary", "Updated Trade Port page with current rework/todo developer reply", "Updated Guide access group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/pax-autocratica-price/", "/pax-autocratica-80-discount-mistake/", "/pax-autocratica-trade-port/", "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:8px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>同步更新：<a href="${baseUrl}/pax-autocratica-price/">${baseUrl}/pax-autocratica-price/</a> · <a href="${baseUrl}/pax-autocratica-80-discount-mistake/">${baseUrl}/pax-autocratica-80-discount-mistake/</a> · <a href="${baseUrl}/pax-autocratica-trade-port/">${baseUrl}/pax-autocratica-trade-port/</a></p><p>今日核心证据：Humiliated/Resentful/Agitated Steam 线程、Multiverse 开发者回复、Steam 商店 $29.99 / 0% 折扣快照。Reddit 抓取状态：${escapeHtml(redditCaptureStatus)}，未作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

同步更新：${baseUrl}/pax-autocratica-price/、${baseUrl}/pax-autocratica-80-discount-mistake/ 和 ${baseUrl}/pax-autocratica-trade-port/

今日核心证据：Humiliated/Resentful/Agitated Steam 线程、Multiverse 开发者回复、Steam 商店 $29.99 / 0% 折扣快照。Reddit 抓取状态：${redditCaptureStatus}，未作为事实依据。

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
