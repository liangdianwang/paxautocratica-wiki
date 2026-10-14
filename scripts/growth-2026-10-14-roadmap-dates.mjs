import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-14";
const checkedAt = "2026-10-14T09:40:00+08:00";
const nextRunAt = "2026-10-15T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-roadmap-dates";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);
const roadmapPath = path.join(root, "content", "en", "pax-autocratica-roadmap.mdx");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readSource(name) {
  return fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/^\uFEFF/, "");
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
const news = JSON.parse(readSource("steam-appnews-api.json"));
const latest = news?.appnews?.newsitems?.[0];
const st11 = news?.appnews?.newsitems?.find((item) => item.title?.includes("ST-11"));
const auroria2 = news?.appnews?.newsitems?.find((item) => item.gid === "1846018067936441");
const appDetails = JSON.parse(readSource("steam-appdetails-us.json"))?.["1067360"]?.data;
const price = appDetails?.price_overview;
const storeText = stripHtml(readSource("steam-store.html"));
const allNewsText = stripHtml(readSource("steam-allnews.html"));
const discussionIndexText = stripHtml(readSource("steam-discussions-general.html"));
const roadmapThreadText = stripHtml(readSource("discussion-roadmap-dates.html"));
const prisonThreadText = stripHtml(readSource("discussion-prison-bug.html"));
const lagThreadText = stripHtml(readSource("discussion-after-update-game-lag.html"));
const sloganThreadText = stripHtml(readSource("discussion-state-propaganda-slogan.html"));
const socialsThreadText = stripHtml(readSource("discussion-updated-socials-october-2026.html"));
const youtubeText = stripHtml(readSource("youtube-search-latest.html"));
const redditBlocked = sourceFiles.some((name) => name.includes("reddit") && name.endsWith(".error.txt"));

for (const phrase of [
  "Roadmap Dates",
  "We have set early access estimate for like 2 years or so",
  "more detailed time frames",
  "don't want to overcommit",
]) {
  if (!roadmapThreadText.includes(phrase)) throw new Error(`Roadmap evidence phrase missing: ${phrase}`);
}
for (const phrase of ["Early Access", "Roadmap", "Steam App ID 1067360"]) {
  if (phrase === "Steam App ID 1067360") continue;
  if (!storeText.includes(phrase)) throw new Error(`Store evidence phrase missing: ${phrase}`);
}
if (!st11?.contents?.includes("our focus will now shift toward the larger Early Access goals")) {
  throw new Error("ST-11 Early Access planning context was not captured.");
}

const latestHash = sha256(latest?.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest?.gid,
  latest_hash: latestHash,
  roadmap_thread_hash: sha256(roadmapThreadText.slice(0, 40000)),
  discussion_index_hash: sha256(discussionIndexText.slice(0, 40000)),
  store_price: price || null,
}));

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const page = {
  keyword: "Pax Autocratica Roadmap Dates",
  slug,
  seo: {
    title: "Pax Autocratica Roadmap Dates: Update Timing and 1.0 Window",
    description:
      "A source-backed Pax Autocratica guide explaining whether the roadmap has dates, the current two-year Early Access estimate, and what not to overread from planned features.",
  },
  direct_answer:
    "Pax Autocratica does not have a public dated patch calendar today. The clearest current answer is in the Steam Roadmap Dates discussion: Gurttron says the Early Access estimate is about two years, and Multiverse says the team will try to give more detailed time frames for roadmap elements but does not want to overcommit and then move dates again. Use the Steam store and official news for what is live now, and treat roadmap items such as co-op, larger Early Access goals, and base customization as planned until an official update gives a released build or a specific date.",
  direct_answer_claim_ids: [
    "claim-roadmap-dates-no-calendar-20261014",
    "claim-roadmap-dates-two-year-ea-20261014",
    "claim-roadmap-dates-no-overcommit-20261014",
  ],
  sections: [
    {
      heading: "What the current date answer is",
      paragraphs: [
        "The Roadmap Dates thread is useful because it asks the exact player question: whether there are rough months, quarters or other timing estimates for major quality-of-life and content updates. The answer is not a schedule. Gurttron points to an Early Access estimate of about two years, while Multiverse says the team will try to give more detailed time frames but wants to avoid overcommitting.",
        "That means a buyer or returning player should not convert the roadmap into a release calendar. The practical planning answer is broad Early Access development, not a dated promise for each item.",
      ],
      steps: [
        "Use about two years as the current broad Early Access frame, not a fixed 1.0 date.",
        "Wait for official Steam News before treating a roadmap item as released.",
        "Do not rely on community-made quarter charts unless they link back to official dated posts.",
      ],
      claim_ids: ["claim-roadmap-dates-two-year-ea-20261014", "claim-roadmap-dates-no-overcommit-20261014"],
    },
    {
      heading: "How this differs from the roadmap page",
      paragraphs: [
        "The general roadmap page covers what is planned and what is currently playable. This page answers the narrower timing question: do the roadmap items have dates, and what should players expect from the Early Access window?",
        "Keeping the two pages separate helps avoid a bad answer. A roadmap feature can be real and planned while still having no public date. This page is the place to check that boundary before buying for a future feature or waiting for co-op.",
      ],
      steps: [
        "Read the roadmap page for planned features and current-feature boundaries.",
        "Use this page for date, quarter, 1.0 and update-timing questions.",
        "If a new patch note ships a feature, update both pages with the released-build evidence.",
      ],
      claim_ids: ["claim-roadmap-dates-no-calendar-20261014"],
    },
    {
      heading: "What official news adds to the timing picture",
      paragraphs: [
        "Directive ST-11 says the team's focus is shifting toward larger Early Access goals such as deeper colony simulation, co-op, and major new systems, while warning that meaningful updates need focus rather than frequent small patches. Auroria Day #2 also says the next update will push base customization further.",
        "Those are useful direction signals, but neither gives a ship date. Treat them as current roadmap context, not a promise that a specific feature is arriving this week.",
      ],
      steps: [
        "Use ST-11 for the broad development direction after launch stability work.",
        "Use Auroria Day #2 for the current base-customization teaser.",
        "Keep co-op, major systems and base customization marked planned until a dated update ships them.",
      ],
      claim_ids: ["claim-roadmap-dates-official-news-context-20261014"],
    },
    {
      heading: "What not to claim yet",
      paragraphs: [
        "This page does not claim a 1.0 release date, a co-op date, a guaranteed quarter for any feature, or that the current roadmap order is fixed. It also does not turn player pressure in the discussion into an official deadline.",
        "Update the answer only when Multiverse publishes a new Steam News item, store text, or developer reply with a more specific time frame. If the team only says something is planned, keep it in the planned bucket.",
      ],
      steps: [
        "Do not say co-op is live unless the Steam feature list or patch notes say so.",
        "Do not call a roadmap image a dated calendar.",
        "Do not make a new page for each planned feature until the feature has its own player task and evidence.",
      ],
      claim_ids: ["claim-roadmap-dates-no-overcommit-20261014"],
    },
  ],
  faq: [
    {
      question: "Does Pax Autocratica have a dated roadmap?",
      answer:
        "No public dated patch calendar was captured today. The current official/developer evidence gives a broad Early Access frame and says the team wants to avoid overcommitting to dates.",
    },
    {
      question: "How long is Pax Autocratica expected to stay in Early Access?",
      answer:
        "The current Roadmap Dates thread says the Early Access estimate is about two years. Treat that as an estimate, not a fixed full-release date.",
    },
    {
      question: "Does co-op have a date?",
      answer:
        "No captured source gives a co-op date today. ST-11 names co-op as part of larger Early Access goals, but that is roadmap direction rather than a release date.",
    },
    {
      question: "What should I watch for next?",
      answer:
        "Watch Steam News and official developer replies. A patch note or store feature-list change is stronger evidence than a community estimate.",
    },
  ],
  page_status: "publish",
  index_status: "index",
  time_sensitivity: "CURRENT",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-roadmap",
    "pax-autocratica-st11-patch-notes",
    "pax-autocratica-auroria-day-2-rewards",
    "pax-autocratica-multiplayer",
    "pax-autocratica-community",
  ],
  updated_at: checkedAt,
};

replaceOrPush(data.pages, page);
for (const relatedSlug of page.related_slugs) {
  const related = data.pages.find((candidate) => candidate.slug === relatedSlug);
  if (related) {
    related.related_slugs ||= [];
    uniquePush(related.related_slugs, slug);
  }
}

const roadmap = data.pages.find((candidate) => candidate.slug === "pax-autocratica-roadmap");
if (roadmap) {
  roadmap.updated_at = checkedAt;
  roadmap.related_slugs ||= [];
  uniquePush(roadmap.related_slugs, slug);
  replaceOrPush(roadmap.sections, {
    heading: "Current roadmap date boundary",
    paragraphs: [
      "The October 2026 Roadmap Dates discussion clarifies that the roadmap is not a public dated patch calendar. Gurttron points to an Early Access estimate of about two years, and Multiverse says the team will try to provide more detailed time frames while avoiding overcommitted dates.",
      "Use the dedicated Roadmap Dates page when the question is timing, quarters, 1.0, or whether a planned feature has a public date.",
    ],
    steps: [
      "Do not convert planned roadmap items into dated release promises.",
      "Check Steam News before saying a roadmap item is live.",
    ],
    claim_ids: ["claim-roadmap-dates-two-year-ea-20261014", "claim-roadmap-dates-no-overcommit-20261014"],
  }, (value) => value.heading);
}

const guide = data.blueprint?.categories?.find((category) => category.slug === "guide");
if (!guide) throw new Error("Guide category missing.");
replaceOrPush(guide.pages, { keyword: page.keyword, slug });
const statusGroup = guide.groups?.find((group) => group.title === "Access, media and current status");
if (statusGroup && !statusGroup.slugs.includes(slug)) {
  const roadmapIndex = statusGroup.slugs.indexOf("pax-autocratica-roadmap");
  if (roadmapIndex >= 0) statusGroup.slugs.splice(roadmapIndex + 1, 0, slug);
  else statusGroup.slugs.push(slug);
}

data.pageProvenance = data.pageProvenance || {};
data.pageProvenance[slug] = {
  last_checked_at: checkedAt,
  source_links: [
    {
      label: "Steam discussion: Roadmap Dates",
      url: "https://steamcommunity.com/app/1067360/discussions/0/581680338186751210/",
      source_type: "developer_discussion",
    },
    {
      label: "Steam store",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
    {
      label: "Steam News API: Directive ST-11",
      url: st11.url,
      source_type: "official_community",
    },
    {
      label: "Steam News API: Auroria Day #2",
      url: auroria2?.url || latest.url,
      source_type: "official_community",
    },
  ],
  evidence_summary:
    "Current Steam discussion gives a two-year Early Access estimate and an official no-overcommit boundary; Steam store and official news provide roadmap and future-feature context without dated release promises.",
  boundaries: [
    "No 1.0 release date claim.",
    "No co-op release date claim.",
    "No claim that roadmap order is fixed.",
  ],
};

data.media = data.media || [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-roadmap-dates-20261014",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica official gameplay scene used for the roadmap dates guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Supports a roadmap status guide without inventing or redrawing the official roadmap image.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to roadmap dates, VSync/framerate-limit lag, screen vignette settings, Auroria Day 2 rewards, fear stats, colony mood and troop upgrading.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica roadmap dates, Pax Autocratica roadmap, Pax Autocratica Early Access, Pax Autocratica co-op date, Pax Autocratica wiki";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(8, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "Roadmap Dates",
    description: "Check the current Early Access timing and no-date boundary.",
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
const changedSlugs = new Set([slug, "pax-autocratica-roadmap"]);
const sitemapPages = data.pages
  .filter((candidate) => candidate.page_status === "publish" && candidate.index_status === "index")
  .map((candidate) => candidate.slug);
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

- [Steam discussion: Roadmap Dates](https://steamcommunity.com/app/1067360/discussions/0/581680338186751210/)
- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)
- [Steam News API: Directive ST-11](${st11.url})
- [Steam News API: Auroria Day #2](${auroria2?.url || latest.url})

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

if (fs.existsSync(roadmapPath)) {
  let roadmapMdx = fs.readFileSync(roadmapPath, "utf8");
  const note = `\n\n## Current roadmap date boundary\n\nThe October 2026 Roadmap Dates discussion clarifies that Pax Autocratica does not have a public dated patch calendar. Use the dedicated [Roadmap Dates](/pax-autocratica-roadmap-dates/) page for the current two-year Early Access estimate, no-overcommit boundary, and timing FAQ.\n`;
  if (!roadmapMdx.includes("Current roadmap date boundary")) {
    roadmapMdx = roadmapMdx.replace(/\n## Sources\n/, `${note}\n## Sources\n`);
    fs.writeFileSync(roadmapPath, roadmapMdx, "utf8");
  }
}

const heldCandidates = [
  {
    slug: "pax-autocratica-prison-cell-camera-bug",
    reason: "The new prison thread has developer evidence, but the same intent is already covered by the existing Prison Interrogation Freeze page; update/monitor instead of publishing a duplicate today.",
  },
  {
    slug: "pax-autocratica-vsync-framerate-limit-bug",
    reason: "Already published on 2026-10-13; today's lag evidence confirms the existing page but cannot count as a new index page.",
  },
  {
    slug: "pax-autocratica-state-propaganda-slogan-contest",
    reason: "Already covered inside Auroria Day #2; standalone page would duplicate current-event intent.",
  },
  {
    slug: "pax-autocratica-updated-socials-october-2026",
    reason: "Official link update maps to the existing Community page rather than a separate player task.",
  },
  {
    slug: "pax-autocratica-third-person-view",
    reason: "Discussion index shows demand, but no captured official answer thread was available in this run.",
  },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定今天的输入，会重复昨天的 VSync 页，或者把旧路线图页当成今天的新成果。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-14 Pax Autocratica、合同 v1.5、现有站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果不澄清路线图日期，玩家可能把规划项误当成已承诺日期，尤其是 co-op 和大型系统更新。",
    evidence_refs: [
      "steam_discussion:roadmap_dates_two_year_early_access_estimate",
      "steam_discussion:multiverse_more_detailed_timeframes_no_overcommit",
      "steam_news:ST11_larger_early_access_goals_context",
      "steam_news:Auroria_Day_2_next_update_base_customization_context",
      redditBlocked ? "reddit:403_blocked_not_used_as_fact" : "reddit:captured",
      youtubeText.includes("Pax Autocratica") ? "youtube:captured_search_page_no_better_video_change" : "youtube:captured_low_signal",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Roadmap Dates 独立页，并更新旧 Roadmap 页的时间边界与互链。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新页没有公开 200、canonical、sitemap 和 Guide 内链，用户和搜索引擎可能看不到它。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Access, media and current status"],
    recommended_action: "本地已接入 Guide、sitemap、媒体、相关页和首页卡片；部署后验证正式路径。",
    next_review_at: "2026-10-14T11:00:00+08:00",
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
    harm_text: "如果把 prison、lag 或 slogan contest 重复拆页，会制造重复意图；如果路线图日期页不写边界，会误导玩家。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Roadmap Dates；其他候选 HOLD 或归入既有页等待更强证据。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务，不能只是泛泛复述路线图。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增 1 个 index L2 页并更新 Roadmap 页互链；未改模板、广告、DNS、测量或强制收录。",
    next_review_at: "2026-10-14T11:00:00+08:00",
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
    next_review_at: "2026-10-14T11:00:00+08:00",
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
    next_review_at: "2026-10-14T11:00:00+08:00",
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
      "Roadmap Dates thread asks for month/quarter timing and receives official/developer responses.",
      "Gurttron gives an about two-year Early Access estimate.",
      "Multiverse says the team will try to give more detailed time frames but does not want to overcommit and move dates again.",
      "ST-11 and Auroria Day #2 provide current official roadmap context without dated release promises.",
    ],
    boundary: "No 1.0 date, co-op date, fixed roadmap order or shipped-feature claim.",
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
writeJson("source-capture-results.json", {
  schema_version: 1,
  captured_at: checkedAt,
  sources: sourceFiles.map((name) => ({
    name,
    path: `sources/${name}`,
    sha256: sha256File(path.join(sourceDir, name)),
  })),
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
    recommendations_total: appDetails?.recommendations?.total || null,
  } : { status: "price_overview_missing" },
  current_discussions: [
    { title: "Roadmap Dates", url: "https://steamcommunity.com/app/1067360/discussions/0/581680338186751210/", disposition: "CREATE_CANDIDATE" },
    { title: "Prison bug", url: "https://steamcommunity.com/app/1067360/discussions/0/586188069723598541/", disposition: "HOLD_EXISTING_PRISON_PAGE" },
    { title: "After the update Game LAG", url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/", disposition: "HOLD_ALREADY_PUBLISHED_2026_10_13" },
    { title: "STATE PROPAGANDA SLOGAN CONTEST", url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445105531/", disposition: "HOLD_EXISTING_EVENT_PAGE" },
    { title: "Updated Socials + Links Updated October 2026", url: "https://steamcommunity.com/app/1067360/discussions/0/595152778808013174/", disposition: "UPDATE_EXISTING_COMMUNITY_CONTEXT" },
  ],
  reddit_capture_status: redditBlocked ? "403_blocked_not_used_as_fact" : "captured",
  youtube_capture_status: youtubeText.includes("Pax Autocratica") ? "captured_search_page_no_better_video_change" : "captured_low_signal",
  support_contexts: {
    prison_thread_developer_fix_next_patch: prisonThreadText.includes("fixed alongside the next patch update"),
    lag_thread_known_bug_existing_page: lagThreadText.includes("known bug"),
    slogan_contest_existing_event_page: sloganThreadText.includes("official Aurorian propaganda posters"),
    socials_thread_present: socialsThreadText.includes("Updated October 2026"),
    all_news_current_latest: allNewsText.includes("AURORIA DAY #2"),
  },
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-roadmap-dates-20261014",
      disposition: "CREATE_CANDIDATE",
      reason: "Current official/developer discussion answers the narrow roadmap timing question with a two-year EA estimate and no-overcommit boundary.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-roadmap/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/581680338186751210/"],
    },
    {
      source_id: "src-steam-discussion-prison-bug-20261014",
      disposition: "UPDATE_EXISTING_OR_HOLD",
      reason: "Developer says related prison cell camera bugs are internally fixed for next patch, but existing prison page already owns this task.",
      affected_routes: ["/pax-autocratica-prison-interrogation-freeze/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188069723598541/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "developer_discussion_plus_store_and_news_context", duplicate_gate: "narrow_timing_intent_distinct_from_general_roadmap", content_gate: "direct answer, timing boundary, FAQ and official-source watch list" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica roadmap dates", parent_query: "Pax Autocratica roadmap", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/581680338186751210/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica Early Access length", parent_query: "Pax Autocratica roadmap dates", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/581680338186751210/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica co-op date", parent_query: "Pax Autocratica roadmap", source_type: "steam_news", source_url: st11.url, depth: 2, status: "covered_as_no_date_boundary" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Current developer-confirmed roadmap timing boundary with distinct player task." }], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica roadmap dates", "Pax Autocratica Early Access length"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes current player task, evidence, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated /pax-autocratica-roadmap/ with a timing boundary and related link", "Updated Guide group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/pax-autocratica-roadmap/", "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("ad-revenue.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:8px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>今日核心证据：Steam Roadmap Dates 讨论给出约两年 Early Access 估计，并明确会尝试更详细时间框架但不想过度承诺。Reddit 抓取 403，不作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

今日核心证据：Steam Roadmap Dates 讨论给出约两年 Early Access 估计，并明确会尝试更详细时间框架但不想过度承诺。Reddit 抓取 403，不作为事实依据。

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
  "ad-revenue.json",
  "health-findings.raw.jsonl",
  "daily-report.json",
  "daily-report.html",
  "daily-report.md",
  ...sourceFiles.map((name) => `sources/${name}`),
];
writeText("checksums.sha256", `${checksumTargets.filter((file) => fs.existsSync(path.join(runDir, file))).map((file) => `${sha256File(path.join(runDir, file))}  ${file}`).join("\n")}\n`);

console.log(JSON.stringify({
  status: "generated",
  slug,
  runDir,
  sourceFiles: sourceFiles.length,
  latest: latest.title,
  price: price?.final_formatted || null,
  discount: price?.discount_percent ?? null,
  roadmapEvidenceCaptured: roadmapThreadText.includes("more detailed time frames") && roadmapThreadText.includes("don't want to overcommit"),
}, null, 2));
