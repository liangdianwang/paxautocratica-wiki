import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-10";
const checkedAt = "2026-10-10T09:25:00+08:00";
const nextRunAt = "2026-10-11T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-reduce-fear-stats";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);

fs.mkdirSync(sourceDir, { recursive: true });

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

const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());
const news = JSON.parse(readSource("steam-news-api.json"));
const latest = news?.appnews?.newsitems?.[0];
if (!latest?.title?.includes("ST-24")) {
  throw new Error(`Latest official Steam News expected ST-24, got ${latest?.title || "missing"}`);
}

const appDetails = JSON.parse(readSource("steam-appdetails-us.json"))?.["1067360"]?.data;
const price = appDetails?.price_overview;
const storeText = stripHtml(`${appDetails?.short_description || ""} ${appDetails?.detailed_description || ""}`);
if (!price || price.final !== 2999 || price.discount_percent !== 0) {
  throw new Error(`Expected current Steam store to show $29.99 / 0%, got ${JSON.stringify(price)}`);
}

const discussionIndexText = stripHtml(readSource("steam-discussions-general.html"));
const fearText = stripHtml(readSource("discussion-fear-stats-soldiers.html"));
const pcShutdownText = stripHtml(readSource("discussion-pc-shutdown-current.html"));
const optimisationText = stripHtml(readSource("discussion-big-need-optimisation.html"));
const coresText = stripHtml(readSource("discussion-cores-current.html"));
const captureText = stripHtml(readSource("discussion-capturing-enemies-current.html"));
const youtubeText = stripHtml(readSource("youtube-search-latest.html"));
const redditErrorPath = path.join(sourceDir, "reddit-search.html.error.txt");
const redditCaptureStatus = fs.existsSync(redditErrorPath)
  ? "unavailable_or_blocked_not_used_as_fact"
  : "captured_search_page_not_used_as_primary_fact";

if (!/reduce fear stats/i.test(fearText) || !/40 soldiers as upgrade materials/i.test(fearText)) {
  throw new Error("Fear-stat current player demand was not captured.");
}
if (!/Care, Leader's Clemency/i.test(fearText) || !/Gifting item and Cooking food that reduces fear level/i.test(fearText)) {
  throw new Error("Fear-stat attempted fixes and community recovery suggestions were not captured.");
}
if (!/fears, loyalties, bonds, and feuds/i.test(storeText) || !/Sacrifice the weak/i.test(storeText)) {
  throw new Error("Official store fear/sacrifice/social-system boundary was not captured.");
}

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const latestHash = sha256(latest.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest.gid,
  latest_hash: latestHash,
  store_price: price,
  discussion_index_hash: sha256(discussionIndexText.slice(0, 30000)),
  fear_thread_hash: sha256(fearText.slice(0, 20000)),
  reddit_capture_status: redditCaptureStatus,
}));

const page = {
  keyword: "Pax Autocratica Reduce Fear Stats",
  slug,
  seo: {
    title: "Pax Autocratica Reduce Fear Stats: Soldier Fear Checklist",
    description:
      "A source-backed Pax Autocratica guide to reducing high soldier fear after mass upgrades or sacrifices, with safe food, gift, building and reporting boundaries.",
  },
  direct_answer:
    "If Pax Autocratica fear stats jump after mass-upgrading soldiers, stop spending more people first and treat it as a colony-state problem, not a hidden upgrade formula. The current Steam thread reports fear rising to 76-90% after using more than 40 soldiers as upgrade material, and community replies point to removing permanent fear sources, waiting for fear to fall over time, and using gifts or cooked food that explicitly reduce fear. The official Steam store supports the broad boundary because fear, loyalty, bonds, feuds and sacrifice are real colony systems, but no captured source publishes an exact fear-decay formula, safe percentage, or guaranteed instant reset.",
  direct_answer_claim_ids: [
    "claim-fear-stat-current-demand-20261010",
    "claim-store-fear-sacrifice-boundary-20261010",
    "claim-boundary-no-fear-formula-20261010",
  ],
  sections: [
    {
      heading: "Why fear can spike after mass upgrades",
      paragraphs: [
        "The current Steam thread is useful because it gives a concrete failure mode: the player used more than 40 soldiers as upgrade materials to raise several Chief soldiers into purple tiers, then saw total fear sit around 76-90%. They also tried Care, Leader's Clemency, zero work hours and steam showers without seeing the number drop quickly.",
        "That is enough to justify a separate player-task page. It is not the same question as a generic mood status or soldiers fighting in base. The problem is how to bring a high fear stat back down after a costly upgrade/sacrifice sequence.",
      ],
      steps: [
        "Stop doing additional mass upgrades or sacrifices until the fear trend is readable.",
        "Record the current fear percentage, recent upgrade actions, work schedule and active buildings.",
        "Separate fear from loyalty, fatigue and Humiliated/Resentful/Agitated labels so you do not change the wrong system.",
      ],
      claim_ids: ["claim-fear-stat-current-demand-20261010"],
    },
    {
      heading: "Remove permanent fear sources first",
      paragraphs: [
        "One community reply points first to removing buildings that carry permanent fear values, then letting time reduce the remaining fear. The original player says they had not built obvious fear-inducing buildings such as turrets or Guiding Light, which makes this a checklist rather than a guaranteed fix.",
        "Use that evidence carefully: dismantling or disabling a fear source can make sense if your current colony has one, but the captured thread does not prove every fear spike comes from buildings or that a building change instantly resets the colony.",
      ],
      steps: [
        "Inspect buildings, decrees and facilities that explicitly add fear or punishment pressure.",
        "Remove or pause only one fear source at a time so you can see whether the percentage moves.",
        "Let at least a normal in-game cycle pass before declaring that the change failed.",
        "Do not dismantle production-critical buildings just to chase a number unless you can afford the disruption.",
      ],
      claim_ids: ["claim-fear-community-building-time-20261010", "claim-boundary-no-fear-formula-20261010"],
    },
    {
      heading: "Use explicit fear-reducing items or food",
      paragraphs: [
        "Another current reply gives the most direct player action: gifting items and cooking food that reduce fear level. A separate reply also mentions that some of the faster items may come from traders or levels, while some foods and skills have fear as a cost.",
        "That means the safe advice is to read the item and food text before using it. A guide should not list invented item names or pretend that every comfort action lowers fear. Use only things your current build labels as lowering fear, and avoid foods or skills that trade one problem for another.",
      ],
      steps: [
        "Check trader goods, level rewards and inventory items for text that explicitly reduces fear.",
        "Cook or gift only the options that say they lower fear in your current build.",
        "Avoid foods, skills or decrees that add fear as a cost while you are trying to reduce the stat.",
        "Test the effect on a small group or one cycle before spending rare goods across the colony.",
      ],
      claim_ids: ["claim-fear-community-food-gift-20261010"],
    },
    {
      heading: "What zero work hours and showers can prove",
      paragraphs: [
        "The original poster already tried setting work hours to zero and pushing soldiers toward steam showers, but fear stayed high in the captured snapshot. That does not prove rest and comfort never matter. It only proves they were not an instant answer in that reported situation.",
        "Use rest as support, not as the only fix. If fear came from recent sacrifice or upgrade choices, the colony may need time and explicit fear-reducing actions rather than another schedule change.",
      ],
      steps: [
        "Keep recovery time available while you test item, food or building changes.",
        "Do not assume zero work hours alone will clear fear caused by mass-upgrade decisions.",
        "If fear stays high after multiple cycles, preserve the save and report the exact sequence.",
      ],
      claim_ids: ["claim-fear-stat-current-demand-20261010", "claim-boundary-no-fear-formula-20261010"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not publish an exact fear-decay formula, a safe fear threshold, a guaranteed below-20% route, a permanent best food list, or a promise that Care, Leader's Clemency, showers, gifts or specific buildings always work. The current evidence supports a practical recovery checklist, not a mechanics table.",
        "Update this page when Multiverse publishes a dated patch note or developer reply about fear decay, soldier upgrades, sacrifice cost, gifts, food effects or fear-inducing buildings. Until then, keep the answer reversible and source-bound.",
      ],
      steps: [
        "Use the current Steam thread for demand and observed recovery ideas.",
        "Use the official store for the broad fear/sacrifice system boundary.",
        "Use future patch notes for exact values or confirmed fixes.",
      ],
      claim_ids: ["claim-boundary-no-fear-formula-20261010"],
    },
  ],
  faq: [
    {
      question: "Why did my fear stat rise after upgrading soldiers?",
      answer:
        "The current thread reports a fear spike after using more than 40 soldiers as upgrade materials. That points to mass-upgrade or sacrifice pressure as a plausible cause in that run, but no captured source gives an exact formula.",
      claim_ids: ["claim-fear-stat-current-demand-20261010"],
    },
    {
      question: "What should I try first?",
      answer:
        "Stop further mass upgrades, remove any explicit permanent fear sources if your colony has them, then look for gifts or cooked food that explicitly reduce fear in the current build.",
      claim_ids: ["claim-fear-community-building-time-20261010", "claim-fear-community-food-gift-20261010"],
    },
    {
      question: "Do Care, Leader's Clemency or steam showers always reduce fear?",
      answer:
        "No captured source proves they always work. The original poster tried those routes and still had high fear, so treat them as support checks rather than a guaranteed reset.",
      claim_ids: ["claim-fear-stat-current-demand-20261010", "claim-boundary-no-fear-formula-20261010"],
    },
    {
      question: "Is there an exact safe fear percentage?",
      answer:
        "No. The thread asks about lowering fear below 10-20%, but current public evidence does not publish an official safe threshold or decay table.",
      claim_ids: ["claim-boundary-no-fear-formula-20261010"],
    },
  ],
  source_ids: [
    "src-steam-discussion-fear-stats-20261010",
    "src-steam-store-fear-sacrifice-20261010",
    "src-steam-news-st24-20261010",
  ],
  claim_ids: [
    "claim-fear-stat-current-demand-20261010",
    "claim-fear-community-building-time-20261010",
    "claim-fear-community-food-gift-20261010",
    "claim-store-fear-sacrifice-boundary-20261010",
    "claim-boundary-no-fear-formula-20261010",
  ],
  updated_at: checkedAt,
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-troop-upgrading",
    "pax-autocratica-soldiers-fighting-base",
    "pax-autocratica-humiliated-resentful-agitated-status",
    "pax-autocratica-overworked-soldiers",
    "pax-autocratica-healing-food",
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
    const index = combatGroup.slugs.indexOf("pax-autocratica-troop-upgrading");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20261010-reduce-fear-stats",
  intent_type: "colony_fear_recovery_after_mass_upgrades",
  user_job: "Reduce high soldier fear after mass upgrades or sacrifices without inventing a hidden formula.",
  intent_evidence_ids: page.source_ids,
  answerability: "partial_with_current_community_recovery_clues_and_official_fear_system_boundary",
  coverage: [
    {
      dimension: "current_player_problem",
      status: "covered",
      claim_ids: ["claim-fear-stat-current-demand-20261010"],
      evidence_relation: "steam_discussion",
      notes: "Current Steam thread reports fear rising to 76-90% after more than 40 soldiers were used as upgrade materials.",
    },
    {
      dimension: "official_system_boundary",
      status: "covered",
      claim_ids: ["claim-store-fear-sacrifice-boundary-20261010"],
      evidence_relation: "official_store",
      notes: "Steam store describes fears, loyalties, bonds, feuds and sacrifice as real systems.",
    },
  ],
  source_links: [
    {
      label: "Steam discussion: reduce fear stats for soldiers",
      url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/",
      source_type: "community_discussion",
    },
    {
      label: "Steam store: Pax Autocratica",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
    {
      label: "Steam News API: latest official update remains ST-24",
      url: latest.url,
      source_type: "official_community",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-reduce-fear-stats",
  boundaries: [
    "Does not publish exact fear-decay formulas, thresholds or item tables.",
    "Does not treat community replies as official mechanics documentation.",
    "Does not claim Care, Leader's Clemency, showers, gifts or food always work.",
  ],
};

data.media ||= [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-reduce-fear-stats-20261010",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-home-01.webp",
  alt: "Pax Autocratica colony scene used for the reduce fear stats guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Shows colony-management context for fear, sacrifice and recovery guidance without inventing a fear-specific image.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to reducing fear stats, colony mood statuses, healing food, prison bugs, troop upgrading, price status and base logistics.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica reduce fear stats, Pax Autocratica fear, Pax Autocratica soldier fear, Pax Autocratica troop upgrading fear, Pax Autocratica wiki";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(7, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "Reduce Fear",
    description: "Lower high soldier fear after mass upgrades without inventing hidden formulas.",
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

- [Steam discussion: reduce fear stats for soldiers](https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/)
- [Steam store: Pax Autocratica](https://store.steampowered.com/app/1067360/Pax_Autocratica/)
- [Steam News API: ST-24 remains the latest official update](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844751498221781)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const heldCandidates = [
  { slug: "pax-autocratica-pc-shutdown", reason: "Current thread has developer troubleshooting advice, but the existing Performance page already covers crashes, DLSS, frame generation, VSync, framerate caps, logs and K-key reporting." },
  { slug: "pax-autocratica-optimisation", reason: "Current optimisation thread duplicates the existing Performance page and only strengthens that page's follow-up queue." },
  { slug: "pax-autocratica-cores", reason: "Current cores thread is a feature suggestion/end-game balance idea without an official implementation boundary." },
  { slug: "pax-autocratica-capturing-enemies-portraits", reason: "Current capture-model thread is a visual placeholder/commentary item and maps to Capture Mechanics/Soldier Customization unless official art implementation ships." },
  { slug: "pax-autocratica-third-person-view", reason: "Still a feature-status/request topic; not stronger than existing Roadmap/Soldier Customization style boundaries." },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定站点、日期和输入，会把 10 月 9 日情绪状态页或价格状态重复当成今天成果。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-10 Pax Autocratica、合同 v1.5、当前站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果只沿用昨天状态页，玩家仍不知道 mass-upgrade 后 fear 飙升该怎么安全处理。",
    evidence_refs: [
      "steam_news:latest_ST-24_no_new_directive",
      "steam_store:us_price_29_99_discount_0",
      "discussion:reduce_fear_stats_after_mass_upgrades",
      "discussion:pc_shutdown_and_optimisation_held_existing_performance",
      "discussion:cores_and_capture_models_held_feature_or_duplicate",
      `reddit:${redditCaptureStatus}`,
      "youtube:latest_search_captured_no_video_change",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Reduce Fear Stats 独立页；PC shutdown/optimisation 合并到 Performance 观察，cores/capture models HOLD。",
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
    recommended_action: "本地已接入 Guide、sitemap、媒体、相关页和首页卡片；部署后验证正式路径。",
    next_review_at: "2026-10-10T11:00:00+08:00",
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
    harm_text: "如果把 PC shutdown、optimisation、cores 或 capture model 另建页，会造成重复页、薄页或未发布功能页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Reduce Fear Stats；其他候选记录 HOLD 或合并到既有页观察。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务，不能只是社区帖改写。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页；未改模板、广告、DNS、测量或强制收录。",
    next_review_at: "2026-10-10T11:00:00+08:00",
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
    next_review_at: "2026-10-10T11:00:00+08:00",
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
    next_review_at: "2026-10-10T11:00:00+08:00",
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
      "Current Steam discussion asks how to reduce soldier fear after using more than 40 soldiers as upgrade materials.",
      "The thread records failed attempts with Care, Leader's Clemency, zero work hours and steam showers.",
      "Community replies suggest removing permanent fear-source buildings over time and using gifts or cooked food that explicitly reduce fear.",
      "Official Steam store supports the broad system boundary around fears, loyalties, bonds, feuds and sacrifice.",
    ],
    boundary: "No exact fear-decay formula, safe threshold, permanent item list, or guaranteed instant reset is published.",
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
  current_store_snapshot: {
    currency: price.currency,
    initial: price.initial_formatted || "$29.99",
    final: price.final_formatted,
    discount_percent: price.discount_percent,
    discount_notice: "no active US discount captured today",
  },
  current_discussions: [
    { title: "What are the most effective ways to reduce fear stats for my soldiers?", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/", disposition: "CREATE_CANDIDATE" },
    { title: "The game is shutting down the PC...", disposition: "HOLD_EXISTING_PERFORMANCE" },
    { title: "big need for optimisation", disposition: "HOLD_EXISTING_PERFORMANCE" },
    { title: "cores", disposition: "HOLD_FEATURE_REQUEST" },
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
      source_id: "src-steam-discussion-fear-stats-20261010",
      disposition: "CREATE_CANDIDATE",
      reason: "Current thread shows a distinct player task around reducing high fear after mass upgrades/sacrifices.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/"],
    },
    {
      source_id: "src-other-current-discussions-20261010",
      disposition: "HOLD_OR_MERGE_EXISTING",
      reason: "PC shutdown and optimisation map to Performance; cores and capture models are feature/status ideas without enough official implementation evidence.",
      affected_routes: ["/pax-autocratica-performance/", "/pax-autocratica-capture-mechanics/", "/pax-autocratica-soldier-customization/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "current_player_thread_plus_official_store_fear_sacrifice_boundary", duplicate_gate: "distinct_from_troop_upgrading_mood_status_and_soldiers_fighting_base", content_gate: "direct recovery checklist_with_clear_formula_boundary" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica reduce fear stats", parent_query: "Pax Autocratica fear", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica soldier fear", parent_query: "Pax Autocratica soldiers", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica fear food gift", parent_query: "Pax Autocratica reduce fear", source_type: "community_reply", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723697991/", depth: 2, status: "covered_in_selected_page" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct fear-recovery task with current demand and official system boundary." }], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica reduce fear stats", "Pax Autocratica soldier fear"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, current evidence, official boundary, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
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
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:8px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>今日核心证据：Steam fear stats 线程、Steam 商店 fear/sacrifice 系统边界、Steam News ST-24 仍为最新官方更新。Reddit 抓取状态：${escapeHtml(redditCaptureStatus)}，未作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

今日核心证据：Steam fear stats 线程、Steam 商店 fear/sacrifice 系统边界、Steam News ST-24 仍为最新官方更新。Reddit 抓取状态：${redditCaptureStatus}，未作为事实依据。

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
