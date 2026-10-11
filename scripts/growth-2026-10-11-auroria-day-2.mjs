import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-11";
const checkedAt = "2026-10-11T09:03:38+08:00";
const nextRunAt = "2026-10-12T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-auroria-day-2-rewards";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readSource(name) {
  return fs.readFileSync(path.join(sourceDir, name), "utf8");
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

fs.mkdirSync(sourceDir, { recursive: true });

const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());
const news = JSON.parse(readSource("steam-news-api.json"));
const latest = news?.appnews?.newsitems?.[0];
const latestContents = stripHtml(latest?.contents || "");
if (!latest?.title?.includes("AURORIA DAY #2")) {
  throw new Error(`Latest official Steam News expected Auroria Day #2, got ${latest?.title || "missing"}`);
}

const allNewsText = stripHtml(readSource("steam-allnews.html"));
const discussionIndexText = stripHtml(readSource("steam-discussions-general.html"));
const sloganThreadText = stripHtml(readSource("discussion-state-propaganda-slogan-contest.html"));
const appDetails = JSON.parse(readSource("steam-appdetails-us.json"))?.["1067360"]?.data;
const price = appDetails?.price_overview;
const youtubeText = stripHtml(readSource("youtube-search-latest.html"));
const redditErrorPath = path.join(sourceDir, "reddit-auroria-day-2.html.error.txt");
const redditCaptureStatus = fs.existsSync(redditErrorPath)
  ? "unavailable_or_blocked_not_used_as_fact"
  : "captured_search_page_not_used_as_primary_fact";

for (const phrase of [
  "Auroria Day #2 will remain active for seven days",
  "NAT SMG - Aurorian Ceremonial Series",
  "select one previous Auroria Day reward",
  "1st Deployment Commemorative Set",
  "after the next update is live",
  "STATE PROPAGANDA SLOGAN CONTEST",
]) {
  if (!allNewsText.includes(phrase) && !latestContents.includes(phrase)) {
    throw new Error(`Auroria Day #2 evidence phrase missing: ${phrase}`);
  }
}

if (!sloganThreadText.includes("official Aurorian propaganda posters") || !sloganThreadText.includes("Do not submit")) {
  throw new Error("Slogan contest rules and safety boundary were not captured.");
}

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const latestHash = sha256(latest.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest.gid,
  latest_hash: latestHash,
  all_news_hash: sha256(allNewsText.slice(0, 40000)),
  slogan_thread_hash: sha256(sloganThreadText.slice(0, 20000)),
  discussion_index_hash: sha256(discussionIndexText.slice(0, 30000)),
  store_price: price || null,
  reddit_capture_status: redditCaptureStatus,
}));

const page = {
  keyword: "Pax Autocratica Auroria Day 2 Rewards",
  slug,
  seo: {
    title: "Pax Autocratica Auroria Day 2 Rewards: Claim Window and Safety",
    description:
      "A source-backed Pax Autocratica Auroria Day #2 guide covering the seven-day reward window, NAT SMG skin, previous-reward choice, early supporter set and slogan contest boundaries.",
  },
  direct_answer:
    "Auroria Day #2 is now the latest official Pax Autocratica Steam News item. The October 10, 2026 announcement says the event stays active for seven days, offers the NAT SMG - Aurorian Ceremonial Series through the Official State Loyalty Examination, enters participants into a three-key giveaway, and lets each examination select one previous Auroria Day reward not yet acquired. A separate early-supporter reward, the 1st Deployment Commemorative Set, is for backers and players who purchased before the Autumn Sale, but it is claimed only after the next update is live through the in-game account login. Treat the linked form and slogan contest as official event actions, not patch notes or guaranteed mechanics.",
  direct_answer_claim_ids: [
    "claim-auroria-day-2-official-20261011",
    "claim-auroria-day-2-rewards-20261011",
    "claim-auroria-day-2-early-supporter-set-20261011",
    "claim-auroria-day-2-boundaries-20261011",
  ],
  sections: [
    {
      heading: "What changed since Auroria Day #1",
      paragraphs: [
        "Auroria Day #2 is not just a rerun of the September event. The official Steam News feed now lists Auroria Day #2 above ST-24, and the announcement changes the practical player answer in three ways: the public window is seven days, the named participant skin is the NAT SMG - Aurorian Ceremonial Series, and the examination can be used to select one previous Auroria Day reward you missed.",
        "That makes this a separate current-event page rather than a small edit to the old Auroria Day #1 reward guide. Players need the October 2026 reward list, timing, previous-reward rule, and account-claim boundary in one place.",
      ],
      steps: [
        "Start from the Steam All News or the Steam News API item titled Auroria Day #2.",
        "Use the linked Official State Loyalty Examination only from that official source.",
        "Check the event window before submitting; the captured announcement says seven days.",
      ],
      claim_ids: ["claim-auroria-day-2-official-20261011", "claim-auroria-day-2-rewards-20261011"],
    },
    {
      heading: "What you can claim during the event",
      paragraphs: [
        "The active Auroria Day #2 participation reward is the NAT SMG - Aurorian Ceremonial Series. The announcement also says participants are automatically entered into a giveaway where three people receive Pax Autocratica Steam keys to distribute.",
        "The previous-reward choice is the important new safety valve. Beginning with Auroria Day #2, each official examination allows citizens to select one earlier Auroria Day reward they have not acquired. Do not read that as every missed reward being granted at once; the wording supports one previous reward per examination.",
      ],
      steps: [
        "Pick the current NAT SMG reward if you want the new ceremonial skin.",
        "Use the previous-reward option only for one reward you actually missed.",
        "Treat the Steam-key giveaway as random entry, not a guaranteed key.",
      ],
      claim_ids: ["claim-auroria-day-2-rewards-20261011"],
    },
    {
      heading: "Early supporter set is a separate claim",
      paragraphs: [
        "The 1st Deployment Commemorative Set is not the same as the public Auroria Day #2 examination reward. The announcement says all backers and players who bought Pax Autocratica before the Autumn Sale receive the set, which includes the 1st Deployment Arcblade, Logo and Flag.",
        "The claim timing is also different. The official wording says to claim it after the next update is live, then launch the game and register or log in from the top-left Login button on the Main Menu. If eligible, the rewards appear in the Account tab of the Backpack. Until that update is live, do not treat the set as something every player can claim immediately.",
      ],
      steps: [
        "Confirm whether you are a backer or bought the game before the Autumn Sale.",
        "Wait until the next update is live before troubleshooting the set.",
        "Use the in-game Login button and Account tab path described by the announcement.",
      ],
      claim_ids: ["claim-auroria-day-2-early-supporter-set-20261011"],
    },
    {
      heading: "Slogan contest is official, but keep it fictional",
      paragraphs: [
        "Auroria Day #2 also opens the State Propaganda Slogan Contest. The announcement links to a Steam discussion by Multiverse, and that thread says up to three winning slogans may become official Aurorian propaganda posters added directly into Pax Autocratica.",
        "The contest has a content boundary. Submissions should stay inside the fictional universe of Pax Autocratica and avoid real-world hate, extremist content, real-world political attacks, or calls for violence against real people. This page does not repost player slogans or judge entries; it only records the official participation boundary.",
      ],
      steps: [
        "Post slogans only in the official Steam discussion linked by the event.",
        "Keep submissions fictional and game-world specific.",
        "Avoid real-world targets, hate, extremist references, political attacks and real-world violence.",
      ],
      claim_ids: ["claim-auroria-day-2-slogan-contest-20261011", "claim-auroria-day-2-boundaries-20261011"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not mirror the Google Form, collect form answers, guarantee giveaway winners, promise every missed reward can be claimed in one pass, or say the 1st Deployment set is available before the next update. It also does not turn slogan-contest ideas into shipped mechanics.",
        "Update this page only when Multiverse changes the event window, posts a winner list, ships the next update with the early-supporter claim path, or publishes a newer Auroria Day event.",
      ],
      steps: [
        "Use Steam News for event facts.",
        "Use the linked Steam discussion for slogan rules.",
        "Use in-game account UI only after the announced update is live.",
      ],
      claim_ids: ["claim-auroria-day-2-boundaries-20261011"],
    },
  ],
  faq: [
    {
      question: "How long is Auroria Day #2 active?",
      answer: "The captured official announcement says Auroria Day #2 remains active for seven days.",
      claim_ids: ["claim-auroria-day-2-rewards-20261011"],
    },
    {
      question: "What is the Auroria Day #2 skin?",
      answer: "The named event reward is the NAT SMG - Aurorian Ceremonial Series.",
      claim_ids: ["claim-auroria-day-2-rewards-20261011"],
    },
    {
      question: "Can I choose a previous Auroria Day reward?",
      answer: "Yes, but the announcement says each examination allows one previous Auroria Day reward you have not acquired. It does not say every missed reward is granted at once.",
      claim_ids: ["claim-auroria-day-2-rewards-20261011", "claim-auroria-day-2-boundaries-20261011"],
    },
    {
      question: "When do early supporter rewards appear?",
      answer: "The 1st Deployment Commemorative Set is claimed after the next update is live, through the in-game Main Menu login and Backpack Account tab, if your account is eligible.",
      claim_ids: ["claim-auroria-day-2-early-supporter-set-20261011"],
    },
    {
      question: "Is the slogan contest a patch note?",
      answer: "No. It is an official event prompt. Winning slogans may become posters in the game, but other submitted ideas are not shipped mechanics.",
      claim_ids: ["claim-auroria-day-2-slogan-contest-20261011", "claim-auroria-day-2-boundaries-20261011"],
    },
  ],
  source_ids: [
    "src-steam-news-auroria-day-2-20261011",
    "src-steam-allnews-auroria-day-2-20261011",
    "src-steam-discussion-slogan-contest-20261011",
  ],
  claim_ids: [
    "claim-auroria-day-2-official-20261011",
    "claim-auroria-day-2-rewards-20261011",
    "claim-auroria-day-2-early-supporter-set-20261011",
    "claim-auroria-day-2-slogan-contest-20261011",
    "claim-auroria-day-2-boundaries-20261011",
  ],
  updated_at: checkedAt,
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-auroria-day-reward",
    "pax-autocratica-community",
    "pax-autocratica-supreme-powers-petition",
    "pax-autocratica-80-discount-mistake",
    "pax-autocratica-soldier-customization",
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
    const index = statusGroup.slugs.indexOf("pax-autocratica-auroria-day-reward");
    if (index >= 0) statusGroup.slugs.splice(index + 1, 0, slug);
    else statusGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20261011-auroria-day-2-rewards",
  intent_type: "current_official_event_reward_and_safety",
  user_job: "Understand what Auroria Day #2 rewards can be claimed, when the event is active, and what not to submit or assume.",
  intent_evidence_ids: page.source_ids,
  answerability: "strong_official_steam_news_with_linked_developer_discussion_boundary",
  coverage: [
    {
      dimension: "official_current_event",
      status: "covered",
      claim_ids: ["claim-auroria-day-2-official-20261011", "claim-auroria-day-2-rewards-20261011"],
      evidence_relation: "steam_news_api_and_allnews",
      notes: "Auroria Day #2 is the latest official Steam News item and states the reward, seven-day window, previous reward choice and giveaway entry.",
    },
    {
      dimension: "slogan_safety_boundary",
      status: "covered",
      claim_ids: ["claim-auroria-day-2-slogan-contest-20261011", "claim-auroria-day-2-boundaries-20261011"],
      evidence_relation: "developer_steam_discussion",
      notes: "Multiverse's linked Steam thread lists allowed fictional scope and prohibited real-world content categories.",
    },
  ],
  source_links: [
    {
      label: "Steam News API: Auroria Day #2",
      url: latest.url,
      source_type: "official_community",
    },
    {
      label: "Steam All News: Auroria Day #2",
      url: "https://steamcommunity.com/app/1067360/allnews/",
      source_type: "official_community",
    },
    {
      label: "Steam discussion: State Propaganda Slogan Contest",
      url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445105531/",
      source_type: "developer_discussion",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-auroria-day-2-rewards",
  boundaries: [
    "Does not mirror or collect Google Form data.",
    "Does not guarantee giveaway selection or immediate early-supporter reward delivery.",
    "Does not treat slogan submissions as shipped mechanics.",
  ],
};

data.media ||= [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-auroria-day-2-rewards-20261011",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-community-09.webp",
  alt: "Pax Autocratica community scene used for the Auroria Day 2 rewards guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Supports an official community event page without redistributing event form data or copying announcement art.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to Auroria Day 2 rewards, reducing fear stats, colony mood statuses, healing food, prison bugs, troop upgrading and current price status.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica Auroria Day 2, Pax Autocratica NAT SMG, Pax Autocratica 1st Deployment Commemorative Set, Pax Autocratica slogan contest, Pax Autocratica wiki";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(7, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "Auroria Day 2",
    description: "Check the seven-day reward window, NAT SMG skin and safe claim path.",
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
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${baseUrl}/</loc><lastmod>${runDate}</lastmod></url>\n  <url><loc>${baseUrl}/guide/</loc><lastmod>${runDate}</lastmod></url>\n${sitemapPages.map((pageSlug) => `  <url><loc>${baseUrl}/${pageSlug}/</loc><lastmod>${pageSlug === slug ? runDate : (previousLastmods.get(pageSlug) || runDate)}</lastmod></url>`).join("\n")}\n</urlset>\n`;

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

- [Steam News API: Auroria Day #2](${latest.url})
- [Steam All News: Auroria Day #2](https://steamcommunity.com/app/1067360/allnews/)
- [Steam discussion: State Propaganda Slogan Contest](https://steamcommunity.com/app/1067360/discussions/0/586188313445105531/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const heldCandidates = [
  { slug: "pax-autocratica-state-propaganda-slogan-contest", reason: "The slogan contest is covered inside the Auroria Day #2 event page because it is one event action, not a standalone mechanics guide." },
  { slug: "pax-autocratica-1st-deployment-commemorative-set", reason: "The early-supporter set is important but tied to the same official event announcement and next-update account-claim boundary; avoid a thin duplicate page." },
  { slug: "pax-autocratica-pc-shutdown", reason: "Still maps to the existing Performance page unless a direct official fix or reproducible resolution appears." },
  { slug: "pax-autocratica-cores", reason: "Current Steam thread is a feature suggestion/end-game balance idea without official implementation evidence." },
  { slug: "pax-autocratica-capturing-enemies-portraits", reason: "Still a visual-feature request and maps to Capture Mechanics/Soldier Customization until official art implementation ships." },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定今天的输入，会继续把 ST-24 或 10 月 10 日 fear 页当成最新成果，错过 Auroria Day #2。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-11 Pax Autocratica、合同 v1.5、当前站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果不处理最新官方活动，玩家会继续看到 Auroria Day #1 的旧奖励和旧时限，可能错过 #2 的七天窗口或误判早期支持者奖励。",
    evidence_refs: [
      "steam_news:latest_Auroria_Day_2",
      "steam_allnews:seven_day_window_NAT_SMG_previous_reward_choice_early_supporter_set",
      "steam_discussion:slogan_contest_developer_rules",
      `reddit:${redditCaptureStatus}`,
      youtubeText.includes("Pax Autocratica") ? "youtube:latest_search_captured_no_better_video_change" : "youtube:captured_low_signal",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Auroria Day #2 Rewards 独立页；活动内 slogan contest 和早期支持者套装不拆薄页。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新活动页没有公开 200、canonical、sitemap 和 Guide 内链，用户和搜索引擎可能看不到它。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Access, media and current status"],
    recommended_action: "本地已接入 Guide、sitemap、媒体、相关页和首页卡片；部署后验证正式路径。",
    next_review_at: "2026-10-11T11:00:00+08:00",
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
    harm_text: "如果把 slogan contest、早期支持者套装或当前讨论各自拆页，会造成重复意图和薄页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Auroria Day #2 Rewards；活动子事项合并到同一页，其他候选 HOLD 或归入既有页。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务，不能只是复制公告。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页；未改模板、广告、DNS、测量或强制收录。",
    next_review_at: "2026-10-11T11:00:00+08:00",
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
    next_review_at: "2026-10-11T11:00:00+08:00",
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
    next_review_at: "2026-10-11T11:00:00+08:00",
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
  latest_official: {
    title: latest.title,
    url: latest.url,
    date_utc: new Date(latest.date * 1000).toISOString(),
    body_sha256: latestHash,
  },
  selected_candidate: {
    slug,
    evidence: [
      "Steam News API now lists Auroria Day #2 as the latest official item.",
      "Steam All News states a seven-day window, NAT SMG reward, previous-reward choice, giveaway entry and early-supporter set.",
      "The linked Multiverse Steam discussion defines the slogan-contest submission and real-world safety boundaries.",
    ],
    boundary: "No form mirroring, no guaranteed giveaway, no immediate 1st Deployment claim before the next update, and no treating slogans as shipped mechanics.",
  },
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
  current_store_snapshot: price ? {
    currency: price.currency,
    initial: price.initial_formatted || "$29.99",
    final: price.final_formatted,
    discount_percent: price.discount_percent,
  } : { status: "price_overview_missing" },
  current_discussions: [
    { title: "STATE PROPAGANDA SLOGAN CONTEST", url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445105531/", disposition: "MERGE_INTO_EVENT_PAGE" },
    { title: "The game is shutting down the PC...", disposition: "HOLD_EXISTING_PERFORMANCE" },
    { title: "cores", disposition: "HOLD_FEATURE_REQUEST" },
    { title: "How many purchases at 80% off?", disposition: "HOLD_EXISTING_DISCOUNT_CONTEXT" },
    { title: "so capturing enemies", disposition: "HOLD_EXISTING_CAPTURE_OR_CUSTOMIZATION" },
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
      source_id: "src-steam-news-auroria-day-2-20261011",
      disposition: "CREATE_CANDIDATE",
      reason: "Latest official Steam News changes the current Auroria Day answer with a new reward, longer window and early-supporter claim boundary.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-auroria-day-reward/"],
      evidence_urls: [latest.url, "https://steamcommunity.com/app/1067360/allnews/"],
    },
    {
      source_id: "src-steam-discussion-slogan-contest-20261011",
      disposition: "UPDATE_SELECTED_CANDIDATE_SCOPE",
      reason: "Linked developer discussion provides event action and safety boundary, but should not be a separate thin mechanics page.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188313445105531/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "latest_official_steam_news_plus_linked_developer_discussion", duplicate_gate: "distinct_from_auroria_day_1_reward_page_because_rewards_window_and_claims_changed", content_gate: "direct current event checklist_with_form_and_safety_boundaries" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica Auroria Day 2", parent_query: "Pax Autocratica Auroria Day", source_type: "steam_news", source_url: latest.url, depth: 1, status: "selected" },
    { keyword: "Pax Autocratica NAT SMG Aurorian Ceremonial Series", parent_query: "Pax Autocratica Auroria Day 2 rewards", source_type: "steam_news", source_url: latest.url, depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica 1st Deployment Commemorative Set", parent_query: "Pax Autocratica early supporter rewards", source_type: "steam_news", source_url: latest.url, depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica State Propaganda Slogan Contest", parent_query: "Pax Autocratica Auroria Day 2", source_type: "developer_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445105531/", depth: 2, status: "merged_to_event_page" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Latest official event with current player action, claim timing and safety boundaries." }], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica Auroria Day 2", "Pax Autocratica NAT SMG Aurorian Ceremonial Series"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes current official event, distinct intent, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Guide access group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:8px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>今日核心证据：Steam News API 最新官方项为 Auroria Day #2；Steam All News 记录七天窗口、NAT SMG、历史奖励选择、早期支持者套装和 slogan contest。Reddit 抓取状态：${escapeHtml(redditCaptureStatus)}，未作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

今日核心证据：Steam News API 最新官方项为 Auroria Day #2；Steam All News 记录七天窗口、NAT SMG、历史奖励选择、早期支持者套装和 slogan contest。Reddit 抓取状态：${redditCaptureStatus}，未作为事实依据。

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
  "source-capture-results.json",
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

console.log(JSON.stringify({ status: "generated", slug, runDir, sourceFiles: sourceFiles.length, latest: latest.title, price: price?.final_formatted || null, discount: price?.discount_percent ?? null }, null, 2));
