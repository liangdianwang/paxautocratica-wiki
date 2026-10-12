import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-12";
const checkedAt = "2026-10-12T09:35:00+08:00";
const nextRunAt = "2026-10-13T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-darkness-vignette-screen";
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
const st24 = news?.appnews?.newsitems?.find((item) => item.title?.includes("ST-24"));
const st11 = news?.appnews?.newsitems?.find((item) => item.title?.includes("ST-11"));
const appDetails = JSON.parse(readSource("steam-appdetails-us.json"))?.["1067360"]?.data;
const price = appDetails?.price_overview;
const discussionIndexText = stripHtml(readSource("steam-discussions-general.html"));
const storeText = stripHtml(readSource("steam-store.html"));
const visionThreadHtml = readSource("discussion-vision-effect.html");
const visionThreadText = stripHtml(visionThreadHtml);
const ptoThreadText = stripHtml(readSource("discussion-paid-time-off.html"));
const blueprintThreadText = stripHtml(readSource("discussion-blueprints-worth-selling.html"));
const pcCrashThreadText = stripHtml(readSource("discussion-pc-hard-crash-streaming.html"));
const youtubeText = stripHtml(readSource("youtube-search-latest.html"));

for (const phrase of [
  "Darkness vignette around the screen",
  "I do not believe there is a way currently to turn that off",
  "I will forward this to the Devz for further review",
  "depth of field",
]) {
  if (!visionThreadText.includes(phrase)) throw new Error(`Vision evidence phrase missing: ${phrase}`);
}
if (!st24?.contents?.includes("Disabled Panini correction by default")) {
  throw new Error("ST-24 visual settings boundary was not captured.");
}
if (!st11?.contents?.includes("Added the option to cancel Paid Time Off")) {
  throw new Error("ST-11 Paid Time Off boundary was not captured for held candidate comparison.");
}
if (!storeText.includes("flashing lights") || !storeText.includes("Player discretion is advised")) {
  throw new Error("Steam store visual safety warning was not captured.");
}

const latestHash = sha256(latest?.contents || "");
const inputHash = sha256(JSON.stringify({
  runDate,
  latest_gid: latest?.gid,
  latest_hash: latestHash,
  discussion_index_hash: sha256(discussionIndexText.slice(0, 40000)),
  vision_thread_hash: sha256(visionThreadText.slice(0, 30000)),
  st24_hash: sha256(st24?.contents || ""),
  store_price: price || null,
}));

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));
const page = {
  keyword: "Pax Autocratica Darkness Vignette Screen",
  slug,
  seo: {
    title: "Pax Autocratica Darkness Vignette: Can You Turn It Off?",
    description:
      "A source-backed Pax Autocratica guide for the dark vignette or oval edge shadow around the screen, current setting limits, what Gurttron said, and how to report it safely.",
  },
  direct_answer:
    "There is no captured official toggle that turns off the dark vignette or oval shadow around the edge of the Pax Autocratica screen. In the current Steam thread, Gurttron first says the effect sounds like the map-edge warning and says he does not believe there is a way to turn it off; after the player explains it appears at the base and shares a screenshot, he says he will forward it to the developers for review. Treat it as an unresolved visual-readability report, not a confirmed bug fix, depth-of-field setting, or shipped accessibility option.",
  direct_answer_claim_ids: [
    "claim-darkness-vignette-thread-20261012",
    "claim-darkness-vignette-no-toggle-20261012",
    "claim-darkness-vignette-report-boundary-20261012",
  ],
  sections: [
    {
      heading: "What the current thread actually says",
      paragraphs: [
        "The player report describes a dark oval or vignette around the screen and asks whether it can be turned off because it obscures peripheral vision. That is a different player task from hiding the HUD, fixing ultrawide blur, or improving performance: the question is whether a visible edge-darkening effect has a setting.",
        "Gurttron's public reply gives the current boundary. He says the last time he recalled that kind of effect, it happened near a map edge as a warning, and he did not believe there was currently a way to turn it off. When the player says the effect is constant at the base and provides a screenshot, he says he is not seeing an issue but will forward it to the developers for review.",
      ],
      steps: [
        "Do not assume the effect is already fixed or user-configurable.",
        "Check whether it appears only near map edges or also in the base.",
        "If it is constant, treat it as a reportable visual-readability case.",
      ],
      claim_ids: ["claim-darkness-vignette-thread-20261012", "claim-darkness-vignette-no-toggle-20261012"],
    },
    {
      heading: "Check nearby graphics settings without inventing a fix",
      paragraphs: [
        "ST-24 is useful background because it names visual settings and image-quality changes: Panini correction was disabled by default and became an option, volumetric light performance was improved, and several projectile or scene visual issues were touched. None of that is a direct darkness-vignette toggle.",
        "That means the safest checklist is limited. Recheck graphics settings, FOV, Panini correction, brightness/monitor calibration, and whether the effect changes by scene, but do not publish a guaranteed fix unless a later official note or in-game setting names this exact effect.",
      ],
      steps: [
        "Update to the current build before testing.",
        "Compare the base, map edge, tutorial area and a combat scene.",
        "Record whether FOV, Panini correction or other visual settings change the symptom.",
      ],
      claim_ids: ["claim-darkness-vignette-report-boundary-20261012"],
    },
    {
      heading: "How to send a useful report",
      paragraphs: [
        "The pinned bug-reporting route and prior support replies ask players to use the in-game K-key path when possible. For this symptom, a useful report should show where the effect appears, whether it is tied to a map boundary, and which graphics options were tested.",
        "Avoid framing the report as proof that the game is broken for everyone. The public thread shows disagreement about whether the screenshot is visibly wrong, so the strongest evidence is a repeatable before-and-after test with current settings and build information.",
      ],
      steps: [
        "Attach a screenshot or short clip from the exact scene where the edge shadow appears.",
        "List resolution, FOV, Panini correction, graphics preset and display mode.",
        "Say whether it appears at the base, near map edges, in combat, or everywhere.",
        "Use the K-key or the official Steam bug thread instead of scattering reports across unrelated topics.",
      ],
      claim_ids: ["claim-darkness-vignette-report-boundary-20261012"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not claim that the darkness vignette is a confirmed defect, a depth-of-field effect, an accessibility option, a monitor problem, or a setting that can always be disabled. It also does not reuse the player's external screenshot as proof of a visual fact we did not independently validate.",
        "Update this page when Multiverse publishes a patch note, setting label, known-issue note, or developer reply that names the vignette, darkness overlay, depth of field, peripheral darkening, map-edge warning, or related visual-readability behavior.",
      ],
      steps: [
        "Keep the answer narrow: no captured toggle, forwarded for review.",
        "Do not merge this into performance unless a later source ties it to graphics load.",
        "Do not merge this into ultrawide unless the symptom becomes resolution-specific.",
      ],
      claim_ids: ["claim-darkness-vignette-no-toggle-20261012"],
    },
  ],
  faq: [
    {
      question: "Can I turn off the dark vignette around the screen?",
      answer:
        "No current captured source gives a confirmed toggle. Gurttron says he does not believe there is a way to turn it off and later says the report will be forwarded for developer review.",
    },
    {
      question: "Is it definitely depth of field?",
      answer:
        "No. A player suggests depth of field, but that is not confirmed by the developer or patch notes. Treat it as a hypothesis to test, not the official cause.",
    },
    {
      question: "Is this the same as the ultrawide blurry issue?",
      answer:
        "Not based on today's evidence. ST-24 has Panini and ultrawide-related visual context, but this thread describes a darkness or oval edge effect that can appear outside a pure ultrawide report.",
    },
    {
      question: "What should I include in a bug report?",
      answer:
        "Include a screenshot or clip, location, build date, resolution, FOV, Panini correction state, graphics preset, and whether the effect appears only near map edges or constantly.",
    },
  ],
  page_status: "publish",
  index_status: "index",
  time_sensitivity: "CURRENT",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-crowded-ui",
    "pax-autocratica-ultrawide-blurry",
    "pax-autocratica-performance",
    "pax-autocratica-st24-patch-notes",
  ],
  updated_at: checkedAt,
};

replaceOrPush(data.pages, page);

const guide = data.blueprint?.categories?.find((category) => category.slug === "guide");
if (!guide) throw new Error("Guide category missing.");
replaceOrPush(guide.pages, { keyword: page.keyword, slug });
const accessGroup = guide.groups?.find((group) => group.title === "Access, media and current status");
if (accessGroup) uniquePush(accessGroup.slugs, slug);

data.pageProvenance = data.pageProvenance || {};
data.pageProvenance[slug] = {
  last_checked_at: checkedAt,
  source_links: [
    {
      label: "Steam discussion: Darkness vignette around the screen",
      url: "https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/",
      source_type: "official_community",
    },
    {
      label: "Steam News API: Directive ST-24 visual settings context",
      url: st24.url,
      source_type: "official_community",
    },
    {
      label: "Steam store: visual warning and game page",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
    {
      label: "Steam discussion: Help My Game Is Bugged/Glitched/Broken",
      url: "https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/",
      source_type: "official_community",
    },
  ],
  evidence_summary:
    "Current Steam thread captures the player task, Gurttron's no-current-toggle boundary, and developer-forwarding status; official patch/store sources provide graphics-setting and visual-safety context.",
  boundaries: [
    "No confirmed toggle.",
    "No confirmed depth-of-field cause.",
    "No confirmed patch fix.",
    "No claim that every player sees the same issue.",
  ],
};

data.media = data.media || [];
replaceOrPush(data.media, {
  asset_id: "pax-autocratica-darkness-vignette-20261012",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica gameplay scene used for the darkness vignette and visual readability guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Supports a visual-readability guide without copying an unverified player screenshot.",
}, (value) => value.asset_id);

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to screen vignette settings, Auroria Day 2 rewards, fear stats, colony mood, healing food, prison bugs and troop upgrading.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica darkness vignette, Pax Autocratica screen edge shadow, Pax Autocratica visual settings, Pax Autocratica Auroria Day 2, Pax Autocratica wiki";
data.generated_at = checkedAt;

const startCards = data.home.start.cards || [];
if (!startCards.some((item) => item.href === `/${slug}/`)) {
  startCards.splice(Math.min(6, startCards.length), 0, {
    number: String(startCards.length + 1),
    title: "Screen Vignette",
    description: "Check whether the dark edge shadow has a confirmed toggle or fix.",
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

- [Steam discussion: Darkness vignette around the screen](https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/)
- [Steam News API: Directive ST-24 visual settings context](${st24.url})
- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)
- [Steam discussion: Help My Game Is Bugged/Glitched/Broken](https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const heldCandidates = [
  {
    slug: "pax-autocratica-cancel-paid-time-off",
    reason: "Current thread asks about recalling soldiers after stamina recovery, and ST-11 confirms cancel Paid Time Off exists, but no captured official answer confirms penalty/no-penalty behavior.",
  },
  {
    slug: "pax-autocratica-blueprints-sellable",
    reason: "Blueprint selling question has player replies but no official table or developer answer; keep as Trade Port / crafting follow-up.",
  },
  {
    slug: "pax-autocratica-scourgeborn-sacrifice-compatibility",
    reason: "Scourgeborn lore and species-sacrifice question overlaps Troop Upgrading and lacks an official species formula.",
  },
  {
    slug: "pax-autocratica-pc-hard-crash-streaming",
    reason: "Maps to existing Performance/stability page unless a direct official OBS-specific fix appears.",
  },
  {
    slug: "pax-autocratica-soldier-standardization",
    reason: "Feature suggestion with moderator acknowledgement, not an implemented mechanic or player-action guide.",
  },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "如果不锁定今天的输入，会把 10 月 11 日 Auroria Day #2 当成今天的新成果，或者重复写性能/价格旧问题。",
    evidence_refs: [`run_dir:${runDir}`, `input_hash:${inputHash}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-10-12 Pax Autocratica、合同 v1.5、现有站点配置和本轮来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果不处理当前视觉可读性线程，玩家会继续把暗角当成已解决设置、性能问题或 ultrawide 问题，排错方向会跑偏。",
    evidence_refs: [
      "steam_discussion:darkness_vignette_no_current_toggle_forwarded_to_devs",
      "steam_news:ST24_visual_settings_context_panini_volumetric_light",
      "steam_store:visual_warning_captured",
      "steam_news:latest_official_still_auroria_day_2",
      "youtube:captured_search_page_no_better_video_change",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "新增 Darkness Vignette Screen 独立页；明确无捕获到的关闭开关、未确认原因、已转给开发者复核。",
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
    next_review_at: "2026-10-12T11:00:00+08:00",
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
    harm_text: "如果把休假、蓝图、物种牺牲或标准化建议拆成页，会发布官方答案不足或重复意图的薄页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Darkness Vignette Screen；其他候选 HOLD 或归入既有页等待更强证据。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务，不能只是改写讨论串。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增 1 个 index L2 页；未改模板、广告、DNS、测量或强制收录。",
    next_review_at: "2026-10-12T11:00:00+08:00",
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
    next_review_at: "2026-10-12T11:00:00+08:00",
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
    next_review_at: "2026-10-12T11:00:00+08:00",
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
      "Current Steam discussion asks how to turn off the darkness vignette around the screen.",
      "Gurttron says he does not believe there is currently a way to turn it off and later says it was forwarded to the developers for review.",
      "ST-24 provides official visual-settings context while not naming a vignette toggle; the Steam store visual warning confirms visual comfort is relevant.",
    ],
    boundary: "No confirmed toggle, no confirmed depth-of-field cause, no confirmed fix, and no claim that every player sees the issue.",
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
  } : { status: "price_overview_missing" },
  current_discussions: [
    { title: "Darkness vignette around the screen", url: "https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/", disposition: "CREATE_CANDIDATE" },
    { title: "One day off", disposition: "HOLD_INSUFFICIENT_OFFICIAL_ANSWER" },
    { title: "Blueprints supposed to be sellable?", disposition: "HOLD_TRADE_PORT_CRAFTING_FOLLOWUP" },
    { title: "So who ARE the Scourgeborn?", disposition: "HOLD_DUPLICATE_TROOP_UPGRADING" },
    { title: "Game hard crashes PC when streaming with OBS", disposition: "HOLD_EXISTING_PERFORMANCE" },
  ],
  youtube_capture_status: youtubeText.includes("Pax Autocratica") ? "captured_search_page_no_better_video_change" : "captured_low_signal",
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-darkness-vignette-20261012",
      disposition: "CREATE_CANDIDATE",
      reason: "Current player task has a moderator boundary: no captured current toggle and forwarded for developer review.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-crowded-ui/", "/pax-autocratica-ultrawide-blurry/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/"],
    },
    {
      source_id: "src-st24-visual-settings-context",
      disposition: "SUPPORT_SELECTED_CANDIDATE",
      reason: "Official patch context mentions graphics/visual settings but not a darkness-vignette fix.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-st24-patch-notes/"],
      evidence_urls: [st24.url],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "current_steam_thread_plus_moderator_reply_plus_official_visual_context", duplicate_gate: "distinct_from_crowded_ui_ultrawide_and_performance", content_gate: "direct visual-readability answer_and_report_checklist" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica darkness vignette", parent_query: "Pax Autocratica visual settings", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica screen edge shadow", parent_query: "Pax Autocratica darkness vignette", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica depth of field option", parent_query: "Pax Autocratica darkness vignette", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586188528590790449/", depth: 2, status: "covered_as_unconfirmed_hypothesis" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Current visual-readability player task with moderator boundary and official visual-settings context." }], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica darkness vignette", "Pax Autocratica screen edge shadow"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes current player task, evidence, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Guide access group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("ad-revenue.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:8px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>今日核心证据：Steam 当前讨论记录暗角/边缘变暗问题，Gurttron 表示没有捕获到关闭开关并已转给开发者复核；ST-24 只提供视觉设置背景，不证明已有修复。</p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
writeText("daily-report.html", reportHtml);

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

今日核心证据：Steam 当前讨论记录暗角/边缘变暗问题，Gurttron 表示没有捕获到关闭开关并已转给开发者复核；ST-24 只提供视觉设置背景，不证明已有修复。

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
  ptoEvidenceObserved: ptoThreadText.includes("stamina has been restored"),
  blueprintEvidenceObserved: blueprintThreadText.includes("free 150 credits"),
  pcCrashEvidenceObserved: pcCrashThreadText.includes("hard crashes my PC"),
}, null, 2));
