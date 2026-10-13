import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-13";
const checkedAt = "2026-10-13T09:30:00+08:00";
const nextRunAt = "2026-10-14T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-vsync-framerate-limit-bug";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);
const performancePath = path.join(root, "content", "en", "pax-autocratica-performance.mdx");

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
const st24 = news?.appnews?.newsitems?.find((item) => item.title?.includes("ST-24"));
const appDetails = JSON.parse(readSource("steam-appdetails-us.json"))?.["1067360"]?.data;
const price = appDetails?.price_overview;
const discussionIndexText = stripHtml(readSource("steam-discussions-general.html"));
const lagThreadText = stripHtml(readSource("discussion-after-update-game-lag.html"));
const bugThreadText = stripHtml(readSource("discussion-help-game-bugged.html"));
const socialsThreadText = stripHtml(readSource("discussion-updated-socials-october-2026.html"));
const waifuThreadText = stripHtml(readSource("discussion-any-waifu.html"));
const scourgebornThreadText = stripHtml(readSource("discussion-scourgeborn-lore.html"));
const cnLaunchThreadText = stripHtml(readSource("discussion-game-wont-open-cn.html"));
const youtubeText = stripHtml(readSource("youtube-search-latest.html"));

for (const phrase of [
  "After the update Game LAG",
  "known bug",
  "Vsync/Framerate limit",
  "will be solved in the next patch",
  "Is it happening in the base, in battle or everywhere",
]) {
  if (!lagThreadText.includes(phrase)) throw new Error(`Lag evidence phrase missing: ${phrase}`);
}
if (!bugThreadText.includes("use the K-Key in-game") || !bugThreadText.includes("Player Logs") || !bugThreadText.includes("Save Files")) {
  throw new Error("Bug-reporting support path was not captured.");
}
if (!st24?.contents?.includes("NVIDIA DLSS 4.5 Frame Generation") || !st24?.contents?.includes("overall performance")) {
  throw new Error("ST-24 performance context was not captured.");
}

const latestHash = sha256(latest?.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest?.gid,
  latest_hash: latestHash,
  lag_thread_hash: sha256(lagThreadText.slice(0, 40000)),
  discussion_index_hash: sha256(discussionIndexText.slice(0, 40000)),
  store_price: price || null,
}));

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const page = {
  keyword: "Pax Autocratica VSync Framerate Limit Bug",
  slug,
  seo: {
    title: "Pax Autocratica VSync Framerate Limit Bug: Lag After Update",
    description:
      "A source-backed Pax Autocratica guide for post-update lag, the current VSync/framerate-limit known bug, what to test, and how to report base FPS drops safely.",
  },
  direct_answer:
    "If Pax Autocratica started lagging after the latest update, first separate ordinary performance trouble from the current VSync/framerate-limit bug. In the October 2026 Steam thread, Multiverse asks whether the problem is lower FPS, more frame drops, base-only, battle-only or everywhere, then says there is a known bug that can impact performance when VSync or the framerate limit is turned on and that it will be solved in the next patch. For this specific symptom, test with VSync and the framerate limit off, capture where the drop happens, and send logs/save files through the official bug route if it repeats. Do not treat this as a universal fix, a released patch, or proof that every performance issue has the same cause.",
  direct_answer_claim_ids: [
    "claim-vsync-framerate-bug-thread-20261013",
    "claim-vsync-framerate-bug-next-patch-20261013",
    "claim-vsync-framerate-bug-reporting-20261013",
  ],
  sections: [
    {
      heading: "What the current developer reply says",
      paragraphs: [
        "The current Steam thread starts with a player saying Pax Autocratica lags after the update. Multiverse does not answer with a blanket graphics preset. Instead, the developer asks for the exact shape of the performance problem: lower frame rate than before, more frequent drops, and whether it happens in the base, battle or everywhere.",
        "The important concrete boundary is the VSync/framerate-limit note. Multiverse says players can try turning off VSync or the framerate limit because there is a known bug, planned to be solved in the next patch, that can affect performance when those options are on.",
      ],
      steps: [
        "Confirm whether the symptom is low FPS, frame drops, stutter, heat, crash or launch failure.",
        "Record whether it happens in the base, battle, loading screen or everywhere.",
        "For this current known bug, test VSync and the framerate limit off before changing unrelated settings.",
      ],
      claim_ids: ["claim-vsync-framerate-bug-thread-20261013", "claim-vsync-framerate-bug-next-patch-20261013"],
    },
    {
      heading: "How this differs from the general performance page",
      paragraphs: [
        "The broader Performance page is still the right place for GPU heat, loading problems, crashes, possible memory-leak behavior and hardware baseline checks. This page is narrower: it covers a current post-update FPS drop report where the developer names VSync or framerate limiting as a known performance risk.",
        "That narrow scope matters because older troubleshooting advice can point in more than one direction. The pinned support checklist says frame caps or VSync can be useful for some crash/stability cases, while this newer developer reply says the VSync/framerate-limit state can be the problem for this specific post-update lag case. Use the current symptom to choose which test to run.",
      ],
      steps: [
        "Use this page if the issue is post-update lag or frame drops with VSync/framerate limit enabled.",
        "Use the Performance page for hot GPU, loading, broad crashes or long-session slowdown.",
        "Use the bug form if the same save or scene keeps reproducing the drop after the reversible tests.",
      ],
      claim_ids: ["claim-vsync-framerate-bug-reporting-20261013"],
    },
    {
      heading: "A safe test order",
      paragraphs: [
        "Keep the test reversible. Start by changing only VSync and the framerate limit, then retest the same base scene. If supported, also note the DLSS/Frame Generation state because ST-24 added DLSS 4.5 Frame Generation support and says performance logic was improved; that context can help the developer understand the build and hardware path.",
        "If the issue still happens, do not keep stacking launch flags or third-party fixes. The official support route asks for logs and save files, and the current thread specifically asks for details about where the frame drop occurs.",
      ],
      steps: [
        "Update the game and graphics driver before comparing results.",
        "Write down your GPU, CPU, resolution, graphics preset, DLSS/Super Resolution, Frame Generation, VSync and framerate-limit state.",
        "Test the same base scene with VSync/framerate limit on, then off.",
        "If the result is repeatable, use the K-key report or the detailed bug form with logs and save files.",
      ],
      claim_ids: ["claim-vsync-framerate-bug-reporting-20261013"],
    },
    {
      heading: "What not to claim yet",
      paragraphs: [
        "This page does not claim the next patch has already shipped, that VSync is always bad, that framerate caps should never be used, or that every post-update lag report is the same bug. It also does not publish unofficial launch options, config edits, registry edits or third-party performance tools.",
        "Update this page when Multiverse publishes the next patch note naming this VSync/framerate-limit fix, or when the current thread receives a developer follow-up with a more specific workaround.",
      ],
      steps: [
        "Do not call the bug fixed before a patch note or live build proves it.",
        "Do not merge this with darkness vignette, ultrawide blur or generic hardware limits.",
        "Do not use community-only settings as official advice.",
      ],
      claim_ids: ["claim-vsync-framerate-bug-next-patch-20261013"],
    },
  ],
  faq: [
    {
      question: "Should I turn off VSync in Pax Autocratica after the update?",
      answer:
        "For the current post-update lag report, yes, test with VSync and the framerate limit off because Multiverse says a known bug can affect performance when those are on. That is a test, not a permanent universal rule.",
    },
    {
      question: "Is the VSync/framerate-limit bug fixed already?",
      answer:
        "No captured source says it is fixed today. The developer reply says it will be solved in the next patch.",
    },
    {
      question: "What details should I report?",
      answer:
        "Report whether the drop is in the base, battle or everywhere, plus GPU, CPU, resolution, graphics preset, DLSS/Super Resolution, Frame Generation, VSync, framerate limit, logs and save files.",
    },
    {
      question: "Is this the same as every performance issue?",
      answer:
        "No. Use the general Performance page for crashes, heat, loading and broad FPS issues. This page is for the current VSync/framerate-limit known bug boundary.",
    },
  ],
  page_status: "publish",
  index_status: "index",
  time_sensitivity: "CURRENT",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-performance",
    "pax-autocratica-st24-patch-notes",
    "pax-autocratica-darkness-vignette-screen",
    "pax-autocratica-linux-support",
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

const performance = data.pages.find((candidate) => candidate.slug === "pax-autocratica-performance");
if (performance) {
  performance.updated_at = checkedAt;
  performance.direct_answer =
    "For Pax Autocratica performance trouble, separate four cases before changing settings: launch/loading failure, low FPS or GPU heat while playing, post-session slowdown that looks like a possible memory leak, and a crash or save-specific failure. Current official patch notes say ST-24 added DLSS 4.5 Frame Generation support and improved performance logic, while a newer October 2026 developer reply says a known VSync/framerate-limit bug can affect performance when those options are on and should be solved in the next patch. Use reversible checks first, then report repeat cases through the K key or support route with logs and saves.";
  replaceOrPush(performance.sections, {
    heading: "Current VSync and framerate-limit known bug",
    paragraphs: [
      "A current Steam discussion reports post-update lag. Multiverse asks whether the issue is lower FPS, more frequent frame drops, base-only, battle-only or everywhere, then says VSync/framerate limiting has a known performance-impacting bug planned for the next patch.",
      "This is a narrower current issue than general heat, crashes or memory-leak-like slowdown. If your symptom matches post-update frame drops, test VSync and the framerate limit off and use the detailed bug route if the same scene still reproduces the issue.",
    ],
    steps: [
      "Use the dedicated VSync Framerate Limit Bug page for the current post-update lag thread.",
      "Keep the broader Performance page for hardware baseline, heat, loading and general crash checks.",
    ],
    claim_ids: ["claim-vsync-framerate-bug-thread-20261013", "claim-vsync-framerate-bug-next-patch-20261013"],
  }, (value) => value.heading);
}

const guide = data.blueprint?.categories?.find((category) => category.slug === "guide");
if (!guide) throw new Error("Guide category missing.");
replaceOrPush(guide.pages, { keyword: page.keyword, slug });
const statusGroup = guide.groups?.find((group) => group.title === "Access, media and current status");
if (statusGroup) {
  const performanceIndex = statusGroup.slugs.indexOf("pax-autocratica-performance");
  if (!statusGroup.slugs.includes(slug)) {
    if (performanceIndex >= 0) statusGroup.slugs.splice(performanceIndex + 1, 0, slug);
    else statusGroup.slugs.push(slug);
  }
}

data.pageProvenance = data.pageProvenance || {};
data.pageProvenance[slug] = {
  last_checked_at: checkedAt,
  source_links: [
    {
      label: "Steam discussion: After the update Game LAG",
      url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/",
      source_type: "developer_discussion",
    },
    {
      label: "Steam discussion: Help My Game Is Bugged/Glitched/Broken",
      url: "https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/",
      source_type: "official_community",
    },
    {
      label: "Steam News API: Directive ST-24",
      url: st24.url,
      source_type: "official_community",
    },
    {
      label: "Steam store",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
  ],
  evidence_summary:
    "Current Steam discussion captures a developer reply naming a known VSync/framerate-limit performance-impacting bug planned for the next patch; pinned bug-reporting thread provides the logs/save reporting route and ST-24 provides performance setting context.",
  boundaries: [
    "No claim that the next patch has shipped.",
    "No claim that VSync or framerate caps are always bad.",
    "No unofficial launch flags or third-party performance tools.",
  ],
};

data.media = data.media || [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-vsync-framerate-limit-bug-20261013",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica gameplay scene used for the VSync framerate limit bug guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Supports a performance troubleshooting guide without inventing benchmark imagery.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to the VSync/framerate-limit lag bug, screen vignette settings, Auroria Day 2 rewards, fear stats, colony mood, healing food and troop upgrading.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica VSync bug, Pax Autocratica framerate limit bug, Pax Autocratica lag after update, Pax Autocratica performance, Pax Autocratica wiki";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(7, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "VSync Lag Bug",
    description: "Check the current post-update FPS drop and framerate-limit boundary.",
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
const changedSlugs = new Set([slug, "pax-autocratica-performance"]);
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

- [Steam discussion: After the update Game LAG](https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/)
- [Steam discussion: Help My Game Is Bugged/Glitched/Broken](https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/)
- [Steam News API: Directive ST-24](${st24.url})
- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

let performanceMdx = fs.readFileSync(performancePath, "utf8");
if (!performanceMdx.includes("## Current VSync and framerate-limit known bug")) {
  const insert = `\n## Current VSync and framerate-limit known bug\n\nA newer October 2026 developer reply says a known VSync/framerate-limit bug can impact performance when those options are on, and that it should be solved in the next patch. If your symptom is post-update FPS drops or lag, use the dedicated [VSync Framerate Limit Bug](/pax-autocratica-vsync-framerate-limit-bug/) page before applying broad performance advice.\n\n1. Test the same base scene with VSync and the framerate limit off.\n1. Record whether the issue appears in base, battle or everywhere.\n1. Report repeat cases with logs and save files instead of stacking unofficial launch flags.\n`;
  performanceMdx = performanceMdx.replace("\n## What this guide will not claim", `${insert}\n## What this guide will not claim`);
  performanceMdx = performanceMdx.replace("Last checked: 2026-09-18T09:18:00+08:00", `Last checked: ${checkedAt}`);
  fs.writeFileSync(performancePath, performanceMdx, "utf8");
}

const heldCandidates = [
  {
    slug: "pax-autocratica-updated-socials-october-2026",
    reason: "Official links changed, but the player task is already covered by the existing Community page; update context is recorded without a thin duplicate.",
  },
  {
    slug: "pax-autocratica-waifu-backer-rewards",
    reason: "Backer/waifu discussion has Gurttron support guidance, but it overlaps Backers/Auroria early-supporter claim context and lacks a public non-backer availability answer.",
  },
  {
    slug: "pax-autocratica-scourgeborn-lore",
    reason: "Gurttron says no official lore or official wiki has been given yet; publish no lore page until official lore exists.",
  },
  {
    slug: "pax-autocratica-cant-start-game-cn",
    reason: "Chinese launch-crash thread maps to existing Performance/bug-reporting support and lacks a distinct confirmed fix.",
  },
  {
    slug: "pax-autocratica-state-propaganda-slogan-contest",
    reason: "Already covered inside the Auroria Day #2 page; standalone page would duplicate event intent.",
  },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定今天的输入，会重复昨天的暗角页或继续把 Auroria Day #2 当成今天的新成果。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-13 Pax Autocratica、合同 v1.5、现有站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果不处理当前 VSync/帧率限制已知 bug，玩家可能继续按旧性能建议打开帧率限制，反而复现更新后的掉帧。",
    evidence_refs: [
      "steam_discussion:after_update_game_lag_known_vsync_framerate_limit_bug_next_patch",
      "steam_discussion:bug_reporting_k_key_logs_save_files",
      "steam_news:ST24_D​​LSS_45_performance_logic_context",
      "steam_news:latest_official_still_auroria_day_2",
      youtubeText.includes("Pax Autocratica") ? "youtube:captured_search_page_no_better_video_change" : "youtube:captured_low_signal",
      "reddit:403_blocked_not_used_as_fact",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 VSync Framerate Limit Bug 独立页，并更新 Performance 页指向这个更窄的当前问题。",
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
    next_review_at: "2026-10-13T11:00:00+08:00",
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
    harm_text: "如果把社交链接、waifu/backer、Scourgeborn lore 或中文闪退都拆成页，会发布重复意图或官方答案不足的薄页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 VSync Framerate Limit Bug；其他候选 HOLD 或更新/归入既有页等待更强证据。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务，不能只是泛泛复述性能帖。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "content:content/en/pax-autocratica-performance.mdx", "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增 1 个 index L2 页并更新 Performance 页；未改模板、广告、DNS、测量或强制收录。",
    next_review_at: "2026-10-13T11:00:00+08:00",
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
    next_review_at: "2026-10-13T11:00:00+08:00",
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
    next_review_at: "2026-10-13T11:00:00+08:00",
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
      "Current Steam discussion reports post-update lag.",
      "Multiverse says VSync/framerate limit has a known performance-impacting bug when enabled and should be solved in the next patch.",
      "Pinned bug-reporting thread gives K-key, logs and save-file support path; ST-24 supplies current DLSS/performance context.",
    ],
    boundary: "No claim that the next patch has shipped, no universal FPS fix, and no unofficial launch/config/registry workaround.",
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
    { title: "After the update Game LAG", url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/", disposition: "CREATE_CANDIDATE" },
    { title: "Updated Socials + Links Updated October 2026", disposition: "UPDATE_EXISTING_COMMUNITY_CONTEXT" },
    { title: "any waifu?", disposition: "HOLD_BACKER_REWARD_CONTEXT" },
    { title: "So who ARE the Scourgeborn?", disposition: "HOLD_NO_OFFICIAL_LORE" },
    { title: "求助 打不开游戏", disposition: "HOLD_EXISTING_PERFORMANCE_SUPPORT" },
  ],
  reddit_capture_status: "403_blocked_not_used_as_fact",
  youtube_capture_status: youtubeText.includes("Pax Autocratica") ? "captured_search_page_no_better_video_change" : "captured_low_signal",
  support_contexts: {
    updated_socials_present: socialsThreadText.includes("Updated October 2026"),
    waifu_backer_reply_present: waifuThreadText.includes("Backer Status"),
    scourgeborn_no_official_lore_present: scourgebornThreadText.includes("no official lore has been given"),
    cn_launch_crash_support_present: cnLaunchThreadText.includes("验证文件的完整性"),
  },
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-after-update-game-lag-20261013",
      disposition: "CREATE_CANDIDATE",
      reason: "Current developer reply names a known VSync/framerate-limit performance bug and next-patch boundary.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-performance/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/"],
    },
    {
      source_id: "src-steam-discussion-updated-socials-20261013",
      disposition: "UPDATE_EXISTING",
      reason: "Official links changed, but the existing Community page already owns this player task.",
      affected_routes: ["/pax-autocratica-community/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/595152778808013174/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "current_developer_reply_plus_pinned_reporting_path_plus_ST24_context", duplicate_gate: "distinct_from_general_performance_by_vsync_framerate_known_bug", content_gate: "direct reversible test_and_report_checklist" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica VSync bug", parent_query: "Pax Autocratica lag after update", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica framerate limit bug", parent_query: "Pax Autocratica VSync bug", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica after update lag", parent_query: "Pax Autocratica performance", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188313445171566/", depth: 1, status: "covered_in_selected_page" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Current developer-confirmed setting-specific performance boundary with clear player action." }], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica VSync bug", "Pax Autocratica framerate limit bug"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes current player task, evidence, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated /pax-autocratica-performance/ with a narrower current VSync/framerate-limit note", "Updated Guide group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/pax-autocratica-performance/", "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("ad-revenue.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:8px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>今日核心证据：Steam 当前讨论记录更新后掉帧；Multiverse 明确说 VSync/帧率限制开启时有已知性能影响 bug，并计划下个补丁修复。Reddit 抓取 403，不作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

今日核心证据：Steam 当前讨论记录更新后掉帧；Multiverse 明确说 VSync/帧率限制开启时有已知性能影响 bug，并计划下个补丁修复。Reddit 抓取 403，不作为事实依据。

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
  knownBugCaptured: lagThreadText.includes("known bug") && lagThreadText.includes("Vsync/Framerate limit"),
}, null, 2));
