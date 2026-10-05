import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-05";
const checkedAt = "2026-10-05T20:35:00+08:00";
const nextRunAt = "2026-10-06T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-prison-interrogation-freeze";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentDir = path.join(root, "content", "en");
const contentPath = path.join(contentDir, `${slug}.mdx`);

fs.mkdirSync(sourceDir, { recursive: true });

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readText(file) {
  return fs.readFileSync(path.join(sourceDir, file), "utf8");
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
const news = JSON.parse(readText("steam-news-api.json"));
const latest = news?.appnews?.newsitems?.[0];
if (!latest?.title?.includes("ST-24")) {
  throw new Error(`Latest official Steam News expected ST-24, got ${latest?.title || "missing"}`);
}

const appDetails = JSON.parse(readText("steam-appdetails.json"))?.["1067360"]?.data;
const price = appDetails?.price_overview;
if (!price || price.discount_percent !== 20 || price.final !== 2399) {
  throw new Error(`Expected current Steam store to remain 20% / $23.99, got ${JSON.stringify(price)}`);
}

const discussionIndexText = stripHtml(readText("steam-discussions.html"));
const prisonText = stripHtml(readText("prison-interrogation-freeze.html"));
const irritatingBugText = stripHtml(readText("irritating-bug.html"));
const bugPinnedText = stripHtml(readText("steam-discussions.html"));
const youtubeText = stripHtml(readText("youtube-search-latest.html"));
const redditIdeasText = readText("reddit-pax-ideas.html");
const redditDiscountText = readText("reddit-discount-mistake.html");
const redditCaptureStatus = /UNAVAILABLE|blocked|network security|403|429/i.test(`${redditIdeasText} ${redditDiscountText}`)
  ? "unavailable_or_blocked_not_used_as_fact"
  : "captured_but_not_used_as_primary_fact";

if (!/监狱审讯每次都卡死/.test(discussionIndexText) || !/really irritating bug/i.test(discussionIndexText)) {
  throw new Error("Current discussion index does not contain the prison interrogation / camera bug cluster.");
}
if (!/K键反馈|K-key feedback|submit a K-key feedback|Player Logs|Save File/i.test(`${prisonText} ${irritatingBugText}`)) {
  throw new Error("Developer or support-reporting boundary for the prison bug was not captured.");
}
if (!/interrogate someone|审讯完|camera.+snaps back|卡在监狱界面/i.test(`${prisonText} ${irritatingBugText}`)) {
  throw new Error("Prison interrogation freeze symptoms were not captured.");
}

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const latestHash = sha256(latest.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest.gid,
  latest_hash: latestHash,
  store_price: price,
  discussion_index_hash: sha256(discussionIndexText.slice(0, 30000)),
  prison_thread_hash: sha256(prisonText.slice(0, 20000)),
  irritating_bug_hash: sha256(irritatingBugText.slice(0, 20000)),
  reddit_capture_status: redditCaptureStatus,
}));

const page = {
  keyword: "Pax Autocratica Prison Interrogation Freeze",
  slug,
  seo: {
    title: "Pax Autocratica Prison Interrogation Freeze: Camera Bug Help",
    description:
      "A source-backed Pax Autocratica guide for prison interrogation freezes, camera snap-back after interrogation, K-key feedback reports, and safe temporary workarounds.",
  },
  direct_answer:
    "If Pax Autocratica freezes on the prison screen after interrogation, or the camera snaps back to the prison after you leave, treat it as a current bug-reporting case rather than a solved prisoner mechanic. Two current Steam threads describe the same prison/interrogation camera failure pattern. Multiverse asks affected players to submit K-key in-game feedback so the team can inspect logs, while the pinned bug-reporting guidance asks for player logs and save files. Use only temporary workarounds such as re-entering/exiting the interrogation state, moving after leaving, verifying files, or starting an expedition if that restores the camera; do not edit saves or assume there is a hidden prison timing rule.",
  direct_answer_claim_ids: [
    "claim-prison-freeze-current-thread-20261005",
    "claim-prison-camera-snap-current-thread-20261005",
    "claim-k-key-feedback-developer-20261005",
  ],
  sections: [
    {
      heading: "What the current bug looks like",
      paragraphs: [
        "The strongest current signal is not a new official patch note, but a cluster of Steam discussion reports. One Chinese thread says interrogation can leave the player stuck on the prison interface while people still move. Another thread says that after interrogating someone and leaving, the player's camera can snap back to the prison while the character keeps moving.",
        "Those two descriptions are close enough to treat as one troubleshooting cluster: prison interrogation can desynchronize the camera or UI from the player's actual movement. The page should not call it a hidden prisoner mechanic, because the developer reply asks for logs rather than explaining a gameplay rule.",
      ],
      steps: [
        "If the prison view freezes after interrogation, avoid repeating the interrogation action until you have a recovery path.",
        "If the camera snaps back after leaving the prison, record exactly when the snap happens and whether your character can still move.",
        "Keep the build date, save state and affected prisoner context with the report.",
      ],
      claim_ids: ["claim-prison-freeze-current-thread-20261005", "claim-prison-camera-snap-current-thread-20261005"],
    },
    {
      heading: "Temporary recovery steps to try first",
      paragraphs: [
        "A player in the Chinese thread reports that re-entering interrogation, exiting again and walking afterward helped them recover. Another player reports that holding Escape and starting an expedition fixed the camera after the snap-back. These are player workarounds, not official fixes, so treat them as low-risk recovery attempts rather than guaranteed steps.",
        "The safest order is to avoid destructive actions: try leaving and re-entering the interaction, move away, save only if the game is responsive and you are confident the state is not corrupted, then restart or verify files if the issue repeats.",
      ],
      steps: [
        "Try exiting and re-entering the interrogation interaction once, then walk away from the prison area.",
        "If the character moves but the camera is stuck, try opening a normal menu or starting an expedition only if you are comfortable leaving the current base state.",
        "Restart the game and verify Steam files if the prison camera bug repeats across sessions.",
        "Do not edit save files or delete local data unless the developer or support thread specifically asks for it.",
      ],
      claim_ids: ["claim-prison-player-workaround-20261005", "claim-pinned-bug-reporting-thread"],
    },
    {
      heading: "When to submit K-key feedback",
      paragraphs: [
        "Multiverse replies in the current prison-interrogation thread that if the issue happens again, the player should submit K-key feedback in-game so the team can locate the specific unit/problem more easily. That is the most important current action because the issue is stateful: the team needs logs and a save context, not just a forum description.",
        "The older pinned bug/glitch thread points in the same direction by asking for player logs and save files for issues that are stuck, crashing or hard to reproduce. That gives this page a direct reporting path without inventing a fix.",
      ],
      steps: [
        "Press K in-game when the bug is present or immediately after recovering.",
        "Mention that the issue happened after prison interrogation.",
        "Include whether the UI froze, whether the camera snapped back, and whether your character could still move.",
        "Add any repeatable workaround you tried, such as re-entering interrogation or starting an expedition.",
      ],
      claim_ids: ["claim-k-key-feedback-developer-20261005", "claim-pinned-bug-reporting-thread"],
    },
    {
      heading: "What not to overclaim",
      paragraphs: [
        "This page does not claim the prison bug is fixed, does not publish a permanent workaround, and does not say every prisoner or interrogation state can trigger it. It also does not turn a temporary player workaround into an official support instruction.",
        "Update the page only when Multiverse publishes a dated patch note or a clearer developer reply that changes the answer. Until then, the page exists to help players recognize the bug, recover safely, and send a report with useful evidence.",
      ],
      steps: [
        "Use dated Steam threads as current evidence, not as a final mechanics table.",
        "Keep prisoner conversion and capture strategy separate from this camera/UI bug.",
        "Prefer K-key logs over repeated forum-only comments when the bug can be reproduced.",
      ],
      claim_ids: ["claim-boundary-no-permanent-prison-fix-20261005"],
    },
  ],
  faq: [
    {
      question: "Is the prison interrogation freeze a known current issue?",
      answer:
        "Yes, it is at least a current reported issue. Two Steam threads describe prison interrogation leaving the UI or camera stuck, and Multiverse asks affected players to submit K-key in-game feedback if it happens again.",
      claim_ids: ["claim-prison-freeze-current-thread-20261005", "claim-k-key-feedback-developer-20261005"],
    },
    {
      question: "Is there a guaranteed fix?",
      answer:
        "No guaranteed fix was captured. Player comments mention re-entering/exiting interrogation or starting an expedition as temporary recovery attempts, but the developer request is to submit K-key feedback with logs.",
      claim_ids: ["claim-prison-player-workaround-20261005", "claim-k-key-feedback-developer-20261005"],
    },
    {
      question: "Should I change save files?",
      answer:
        "No. The current evidence supports reporting through K-key feedback and using low-risk recovery attempts. Do not edit saves unless official support asks for a specific file action.",
      claim_ids: ["claim-pinned-bug-reporting-thread", "claim-boundary-no-permanent-prison-fix-20261005"],
    },
  ],
  source_ids: [
    "src-steam-discussion-prison-freeze-20261005",
    "src-steam-discussion-camera-snap-20261005",
    "src-steam-discussion-bug-reporting-20261005",
    "src-steam-news-st24-20261005",
  ],
  claim_ids: [
    "claim-prison-freeze-current-thread-20261005",
    "claim-prison-camera-snap-current-thread-20261005",
    "claim-k-key-feedback-developer-20261005",
    "claim-prison-player-workaround-20261005",
    "claim-pinned-bug-reporting-thread",
    "claim-boundary-no-permanent-prison-fix-20261005",
  ],
  updated_at: checkedAt,
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-capture-mechanics",
    "pax-autocratica-performance",
    "pax-autocratica-menu-bugged",
    "pax-autocratica-prologue-bug",
    "pax-autocratica-troop-upgrading",
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
    const index = combatGroup.slugs.indexOf("pax-autocratica-capture-mechanics");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  last_checked_at: checkedAt,
  source_links: [
    {
      label: "Steam discussion: prison interrogation freeze",
      url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308943761/",
      source_type: "steam_discussion",
    },
    {
      label: "Steam discussion: camera snap after interrogation",
      url: "https://steamcommunity.com/app/1067360/discussions/0/84031737849571307/",
      source_type: "steam_discussion",
    },
    {
      label: "Steam pinned bug/glitch reporting thread",
      url: "https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/",
      source_type: "steam_discussion",
    },
    {
      label: "Steam News API: latest official update remains ST-24",
      url: latest.url,
      source_type: "official_community",
    },
  ],
};

data.media ||= [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-prison-interrogation-freeze-20261005",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-home-01.webp",
  alt: "Pax Autocratica colony scene used for the prison interrogation freeze guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Shows colony/prison-management context for a bug guide without inventing a bug-specific screenshot.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to prison interrogation freezes, troop upgrading, discount correction status, live Steam price, soldier customization, base building, colony logistics and Early Access questions.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica prison interrogation freeze, Pax Autocratica camera bug, Pax Autocratica K-key feedback, Pax Autocratica wiki, Pax Autocratica troop upgrading";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(5, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "Fix Prison Freeze",
    description: "Recover from prison interrogation camera/UI lockups and send useful K-key feedback.",
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

- [Steam discussion: prison interrogation freeze](https://steamcommunity.com/app/1067360/discussions/0/586187435308943761/)
- [Steam discussion: camera snap after interrogation](https://steamcommunity.com/app/1067360/discussions/0/84031737849571307/)
- [Steam pinned bug/glitch reporting thread](https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/)
- [Steam News API: ST-24 remains the latest official update](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1844751498221781)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const heldCandidates = [
  { slug: "pax-autocratica-law-of-the-lash-quest-bug", reason: "Developer confirmed a bug in one thread, but it is narrower than the prison/camera cluster and can be handled later if repeated." },
  { slug: "pax-autocratica-smoke-drink-soldiers", reason: "Current thread gives a community answer about unlocking a gift decree through square upgrades, but no official implementation boundary was captured." },
  { slug: "pax-autocratica-undisclosed-genai", reason: "A new thread title exists, but no answer or direct evidence was captured; not enough for a public factual page." },
  { slug: "pax-autocratica-ai-vehicles-air-support", reason: "Feature request only; maps to Roadmap/Supreme Powers style feedback until an official feature ships." },
  { slug: "pax-autocratica-charity-pledge", reason: "Developer says charity updates will come as soon as possible; this is not a player task guide and lacks a final donation detail." },
  { slug: "pax-autocratica-80-percent-purchases", reason: "Interest is high, but no official sales count was provided; existing 80% Discount Mistake page covers the factual boundary." },
  { slug: "pax-autocratica-efas-rebrand", reason: "Current thread confirms EFAS is dead / Pax Autocratica is the current identity, but it is mostly background and not stronger than current player-support pages." },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定站点、日期和输入，会把昨天的 troop-upgrading 结论或其他站点状态误当成今天结果。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-05 Pax Autocratica、合同 v1.5、当前站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果只记录链接不做页面动作，玩家会继续不知道监狱审讯卡死时该怎么恢复和提交有效日志。",
    evidence_refs: [
      "steam_news:latest_ST-24_no_new_directive",
      "steam_store:discount_fixed_20_percent",
      "discussion:prison_interrogation_freeze",
      "discussion:really_irritating_camera_bug",
      "discussion:developer_K_key_feedback",
      `reddit:${redditCaptureStatus}`,
      "youtube:latest_search_captured_no_embedded_video_change",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Prison Interrogation Freeze 独立页；其他愿望、背景或无答案讨论 HOLD。",
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
    recommended_action: "本地已接入 Guide、sitemap、媒体、相关页面和首页索引；部署后验证正式路径。",
    next_review_at: "2026-10-05T21:30:00+08:00",
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
    harm_text: "如果把 AI vehicles、GenAI、销售数量或公益承诺分别硬建页，会造成无官方答案的薄页或非玩家任务页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Prison Interrogation Freeze；其他候选记录 HOLD 或更新既有页边界。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页；未改模板、广告、DNS 或测量。",
    next_review_at: "2026-10-05T21:30:00+08:00",
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
    next_review_at: "2026-10-05T21:30:00+08:00",
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
    next_review_at: "2026-10-05T21:30:00+08:00",
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
      "Current Steam discussion in Chinese reports prison interrogation leaving the view stuck while units still move.",
      "Current Steam discussion in English reports camera snapping back to the prison after interrogation.",
      "Multiverse developer reply asks affected players to submit K-key feedback so logs can be inspected.",
      "Pinned bug/glitch thread provides the player logs/save-file reporting boundary for stuck or crashing issues.",
    ],
    boundary: "No permanent fix, hidden prison formula, universal workaround, save edit, or patch-resolution claim is published.",
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
    initial: price.initial_formatted,
    final: price.final_formatted,
    discount_percent: price.discount_percent,
    discount_notice: "incorrect Autumn Sale discount fixed",
  },
  current_discussions: [
    { title: "监狱审讯每次都卡死", url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308943761/", disposition: "CREATE_CANDIDATE" },
    { title: "really irritating bug", url: "https://steamcommunity.com/app/1067360/discussions/0/84031737849571307/", disposition: "CREATE_CANDIDATE_SUPPORT" },
    { title: "Whip a striking soldier?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187800873887377/", disposition: "HOLD_NARROW_BUG" },
    { title: "怎么让士兵抽烟喝酒/how to smoke&drink", url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308932871/", disposition: "HOLD_COMMUNITY_ONLY" },
    { title: "This has undisclosed GenAI right?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187800873897295/", disposition: "HOLD_NO_ANSWER" },
    { title: "AI Vehicles & Maybe air support please!", url: "https://steamcommunity.com/app/1067360/discussions/0/586187800873837199/", disposition: "HOLD_FEATURE_REQUEST" },
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
      source_id: "src-steam-discussion-prison-freeze-20261005",
      disposition: "CREATE_CANDIDATE",
      reason: "Current thread reports prison interrogation lockup and developer asks for K-key feedback.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187435308943761/"],
    },
    {
      source_id: "src-steam-discussion-camera-snap-20261005",
      disposition: "CREATE_CANDIDATE_SUPPORT",
      reason: "Separate current thread reports camera snapping back to prison after interrogation.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/84031737849571307/"],
    },
    {
      source_id: "src-other-current-discussions-20261005",
      disposition: "HOLD_OR_UPDATE_EXISTING",
      reason: "Feature requests, sales-count discussion, GenAI question and charity follow-up do not independently pass today's source/content gates.",
      affected_routes: ["/pax-autocratica-80-discount-mistake/", "/pax-autocratica-supreme-powers-petition/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "two_current_steam_threads_plus_developer_K_key_feedback_and_pinned_bug_reporting_boundary", duplicate_gate: "distinct_from_capture_mechanics_and_performance", content_gate: "direct troubleshooting_and_reporting_path" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica prison interrogation freeze", parent_query: "Pax Autocratica prison", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308943761/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica camera snaps back to prison", parent_query: "Pax Autocratica prison interrogation", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/84031737849571307/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica K-key feedback", parent_query: "Pax Autocratica bug report", source_type: "steam_developer_reply", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308943761/", depth: 2, status: "covered_in_selected_page" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct current bug/help intent with repeated reports and developer K-key feedback boundary." }], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica prison interrogation freeze", "Pax Autocratica camera bug"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, repeated-current-evidence, developer-reporting, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
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
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>今日核心证据：两个当前 Steam prison/interrogation bug 线程、Multiverse K-key feedback 回复、Pinned bug reporting thread。Reddit 抓取状态：${escapeHtml(redditCaptureStatus)}，未作为事实依据。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

今日核心证据：两个当前 Steam prison/interrogation bug 线程、Multiverse K-key feedback 回复、Pinned bug reporting thread。Reddit 抓取状态：${redditCaptureStatus}，未作为事实依据。

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
