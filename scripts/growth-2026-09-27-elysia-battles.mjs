import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-09-27";
const checkedAt = "2026-09-27T09:20:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-sector-1-elysia-battles";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "source-captures");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);

fs.mkdirSync(runDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(runDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
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

function readCapture(name) {
  const filePath = path.join(sourceDir, name);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

const newsRaw = readCapture("steam_news_api.raw");
if (!newsRaw) throw new Error("Missing Steam News API capture for 2026-09-27.");
const news = JSON.parse(newsRaw);
const latest = news.appnews.newsitems[0];
if (!latest?.title?.includes("ST-24")) throw new Error(`Latest official Steam News is not ST-24: ${latest?.title || "missing"}`);
if (!/Sector 1\s*-\s*Elysia/i.test(latest.contents || "")) throw new Error("ST-24 capture does not include Sector 1 - Elysia evidence.");

const st24Url = latest.url;
const st24DateIso = new Date(latest.date * 1000).toISOString();
const st24Hash = sha256(latest.contents || "");
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => !name.endsWith(".error.txt"));

const page = {
  keyword: "Pax Autocratica Sector 1 Elysia Battles",
  slug,
  seo: {
    title: "Pax Autocratica Sector 1 Elysia Battles: ST-24 Recheck",
    description: "A source-backed Pax Autocratica Sector 1 Elysia guide for the three ST-24 new battles, what to recheck, and what the official patch does not reveal.",
  },
  direct_answer:
    "Directive ST-24 officially adds three new battles to Sector 1 - Elysia. Use that as a current-build recheck signal: update the game, revisit Elysia from the expedition map, treat new combat nodes as part of the first-sector route, and record what changed before relying on older Elysia walkthroughs. The official note does not publish the battle names, spawn rules, reward tables, difficulty numbers, boss order, Core Fragment odds, or a complete walkthrough, so this page keeps the answer to preparation and verification rather than inventing a route.",
  direct_answer_claim_ids: ["claim-elysia-st24-new-battles-20260927", "claim-elysia-boundary-20260927"],
  sections: [
    {
      heading: "What ST-24 confirms",
      paragraphs: [
        "The current official Steam News capture for Pax Autocratica still returns Directive ST-24 as the newest official update, dated September 24, 2026 UTC. In the New Content / Combat section, the directive says three new battles were added to Sector 1 - Elysia.",
        "That is enough to update the old Elysia answer: first-sector routes and older videos may now be missing encounters. It is not enough to name the battles, rank them, publish their rewards, or claim a fixed progression threshold.",
      ],
      steps: [
        "Update through Steam before comparing any old Elysia guide or video.",
        "Open Sector 1 - Elysia in the current build and look for battle nodes that were not present in your older route.",
        "Keep notes by build date, sector, node label and result instead of copying pre-ST-24 battle order as permanent.",
      ],
      claim_ids: ["claim-elysia-st24-new-battles-20260927"],
    },
    {
      heading: "How to prepare without a fake walkthrough",
      paragraphs: [
        "Sector 1 is still the player's first expedition proving ground, so the safest advice is practical preparation rather than exact routing. Bring a weapon and squad state you can afford to test, bank valuable Core Fragments or resources before greed turns the run bad, and compare Expedition Progress with Enemy Strength before chaining another unknown fight.",
        "The page deliberately avoids a complete battle-by-battle script because the current official source only says that three battles were added. If a video or guide names a specific new encounter, treat it as footage evidence for that build, not an official universal list.",
      ],
      steps: [
        "Enter Elysia with a clear return condition: low ammo, wounded squad, valuable haul, objective done or enemy strength too high.",
        "Treat a new battle as a scouting fight first; do not risk the whole expedition to identify a node.",
        "After returning, turn the result into one specific upgrade, gear or roster change before re-entering.",
      ],
      claim_ids: ["claim-elysia-prep-route-20260927"],
    },
    {
      heading: "What to recheck in older Elysia content",
      paragraphs: [
        "Older Prologue or Early Access Elysia material can still explain the broad loop, but ST-24 creates a hard freshness boundary. Any page that says exactly how many battles Elysia contains, which optional fights to skip, or how the first decisive route should unfold needs a current-build check.",
        "This applies especially to pages about Core Fragments, decisive battles and early expedition pacing. The new official fact is the addition of battles; the unknowns are the detailed pathing, reward and difficulty outcomes.",
      ],
      steps: [
        "Check whether a source was recorded before September 24, 2026.",
        "Keep Prologue-era Elysia battle names separate from current full-game Sector 1 evidence.",
        "Prefer current official patch notes plus current-build footage when deciding whether old routing advice is stale.",
      ],
      claim_ids: ["claim-elysia-boundary-20260927"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "The ST-24 note does not publish a battle list, map coordinates, drop tables, enemy rosters, Core Fragment probabilities, best loadouts, new boss names, or a promise that Elysia difficulty is now easier or harder. Those would need direct current-build footage, repeat testing or another official note.",
        "It also does not prove a new sector, a co-op milestone, a full roadmap delivery, or a changed Sector 2 or Sector 3 answer. Keep this page scoped to the first-sector content addition and the player's verification path.",
      ],
      steps: [
        "Do not rewrite old guides with invented battle names.",
        "Do not convert one player's first run into a universal optimal route.",
        "Recheck this page when the next maintenance directive names Elysia, battles, expedition progress or rewards.",
      ],
      claim_ids: ["claim-elysia-boundary-20260927"],
    },
  ],
  faq: [
    {
      question: "Did ST-24 add new battles to Pax Autocratica Sector 1 - Elysia?",
      answer: "Yes. The latest official Steam News capture for September 27, 2026 still shows Directive ST-24 as the newest update, and that update says three new battles were added to Sector 1 - Elysia.",
      claim_ids: ["claim-elysia-st24-new-battles-20260927"],
    },
    {
      question: "Does the patch name the three new Elysia battles?",
      answer: "No. The official note confirms the count and sector, but it does not publish battle names, node locations, enemy rosters or reward tables.",
      claim_ids: ["claim-elysia-boundary-20260927"],
    },
    {
      question: "Should I still trust old Elysia walkthroughs?",
      answer: "Use them only as broad loop context if they predate September 24, 2026. For exact routing, battle count or rewards, recheck against the current build because ST-24 changed Sector 1 content.",
      claim_ids: ["claim-elysia-boundary-20260927"],
    },
    {
      question: "Does this prove Elysia is harder now?",
      answer: "No. Three new battles are confirmed, but the official note does not say whether first-sector difficulty, rewards or progression thresholds were raised or lowered.",
      claim_ids: ["claim-elysia-boundary-20260927"],
    },
  ],
  source_ids: ["src-steam-news-st24-20260927", "src-steam-appdetails-20260927", "src-steam-allnews-serp-20260927", "src-youtube-search-20260927"],
  claim_ids: ["claim-elysia-st24-new-battles-20260927", "claim-elysia-prep-route-20260927", "claim-elysia-boundary-20260927"],
  updated_at: checkedAt,
  time_sensitivity: "official_patch_recheck",
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: ["pax-autocratica-st24-patch-notes", "pax-autocratica-sector-2-difficulty", "pax-autocratica-capture-mechanics", "pax-autocratica-performance", "pax-autocratica-best-troops"],
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
    const index = combatGroup.slugs.indexOf("pax-autocratica-sector-2-difficulty");
    if (index >= 0) combatGroup.slugs.splice(index, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-sector-1-elysia-battles-20260927",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-sector-2-difficulty-11.jpg",
  alt: "Pax Autocratica expedition scene used for the Sector 1 Elysia battles guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 expedition screenshot already present in the site media registry.",
  relevance_reason: "Shows the expedition context for a current-build page about Sector 1 Elysia battle additions.",
}, (item) => item.asset_id);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260927-sector-1-elysia-battles",
  intent_type: "official_patch_content_recheck",
  user_job: "Understand what the ST-24 addition of three Sector 1 - Elysia battles means, and how to recheck older first-sector routing advice without relying on invented battle details.",
  intent_evidence_ids: ["src-steam-news-st24-20260927", "src-steam-appdetails-20260927", "src-steam-allnews-serp-20260927"],
  answerability: "resolved_with_official_boundary_only",
  coverage: [
    {
      dimension: "official_new_content",
      status: "covered",
      claim_ids: ["claim-elysia-st24-new-battles-20260927"],
      evidence_relation: "steam_news_api",
      notes: `Steam news item ${latest.gid} is dated ${st24DateIso}; body hash ${st24Hash}.`,
    },
    {
      dimension: "walkthrough_boundary",
      status: "bounded",
      claim_ids: ["claim-elysia-boundary-20260927"],
      evidence_relation: "official_patch_omission_plus_existing_search_context",
      notes: "The official note confirms three new battles but omits names, route, rewards and difficulty; the page therefore gives a recheck path, not a fabricated walkthrough.",
    },
  ],
  source_links: [
    { label: "Steam announcement: Directive ST-24", url: st24Url, source_type: "official_community" },
    { label: "Pax Autocratica Steam store", url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", source_type: "official_store" },
    { label: "Steam Community all news", url: "https://steamcommunity.com/app/1067360/allnews/", source_type: "official_community" },
    { label: "Pax Autocratica Steam discussions", url: "https://steamcommunity.com/app/1067360/discussions/", source_type: "community" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-sector-1-elysia-battles",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct first-sector content freshness task created by ST-24 while explicitly refusing unsupported battle names, route order, drops or difficulty numbers.",
};

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to ST-24 Sector 1 Elysia battles, patch changes, logistics, revive behavior, performance, Auto-Defense and base-defense boundaries, crowded UI, soldiers fighting in base, soundtrack and OST status, Linux support, Supreme Powers, overworked soldiers, ultrawide visuals, save wipe and Early Access questions.";
}
if (data.home?.hero?.stats) data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-27"];
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica Sector 1 Elysia, Pax Autocratica ST-24, Pax Autocratica patch notes, Pax Autocratica Elysia battles, Pax Autocratica guide";
}
if (data.site) data.site.version = "local-pending-elysia-battles";
data.generated_at = checkedAt;

const st24Page = data.pages.find((candidate) => candidate.slug === "pax-autocratica-st24-patch-notes");
if (st24Page) {
  st24Page.related_slugs ||= [];
  uniquePush(st24Page.related_slugs, slug);
}

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

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "避免重复运行或把其他站点状态混进 Pax Autocratica。",
    evidence_refs: [`run_dir:${runDir}`, `latest_steam_gid:${latest.gid}`],
    recommended_action: "已锁定 2026-09-27 Pax Autocratica 运行目录和输入。",
    next_review_at: "2026-09-28T09:00:00+08:00",
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果只复述补丁而不转成玩家任务，会产出薄页。",
    evidence_refs: [`steam_news:${st24Url}`, ...sourceFiles.map((name) => `capture:${name}`)],
    recommended_action: "已把 ST-24 的 Elysia 新战斗转成当前构建复查页；讨论、视频和其他重复话题仅记录或保留。",
    next_review_at: "2026-09-28T09:00:00+08:00",
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新页没有公开 200、canonical、sitemap 和内链，用户和搜索引擎可能看不到它。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Expeditions and squad combat"],
    recommended_action: "本地已接入 Guide 与 sitemap；部署后验证公开路径。",
    next_review_at: "2026-09-27T10:30:00+08:00",
  },
  {
    finding_id: "D03-gsc-measurement",
    domain: "search_measurement",
    result_state: "UNKNOWN",
    resolution_status: "DEFERRED",
    severity: "P4",
    harm_text: "没有授权数据时不能把曝光、点击或访问量当作 0，也不能据此改标题和模板。",
    evidence_refs: ["no_authenticated_gsc_or_analytics_export"],
    recommended_action: "保留未知状态，不做基于流量的优化判断。",
    next_review_at: "2026-09-28T09:00:00+08:00",
  },
  {
    finding_id: "D04-external-benchmark",
    domain: "external_benchmark",
    result_state: "UNKNOWN",
    resolution_status: "DEFERRED",
    severity: "P4",
    harm_text: "第三方估算不可用时，不能伪装成 Similarweb、AITDK 或 Web.Cafe 结论。",
    evidence_refs: ["no_authenticated_similarweb_webcafe_aitdk_export"],
    recommended_action: "记录不可用；候选判断使用官方 Steam 证据和已抓取公开搜索证据。",
    next_review_at: "2026-09-28T09:00:00+08:00",
  },
  {
    finding_id: "D05-D08-candidate-gates",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把 DLSS、Trade Port 表格或 Elysia 精确路线单独硬写，会缺少证据变成薄页。",
    evidence_refs: ["candidate:selected:pax-autocratica-sector-1-elysia-battles", "held:dlss-only", "held:trade-port-goods-table"],
    recommended_action: "仅发布 Elysia 当前构建复查页；其他子话题继续保留。",
    next_review_at: "2026-09-28T09:00:00+08:00",
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页，提供官方确认、准备步骤、旧内容复查和边界 FAQ。",
    next_review_at: "2026-09-27T10:30:00+08:00",
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
    next_review_at: "2026-09-27T10:30:00+08:00",
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
    next_review_at: "2026-09-28T09:00:00+08:00",
  },
  {
    finding_id: "D12-report",
    domain: "measurement",
    result_state: "PASS_PENDING_FINAL_HASH",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "日报必须能回溯每项结果、证据、整改和状态。",
    evidence_refs: ["daily-report.json", "daily-report.html", "daily-report.md"],
    recommended_action: "已生成初版日报；部署证据和最终哈希将在上线验证后回写。",
    next_review_at: "2026-09-27T10:30:00+08:00",
  },
];

writeJson("daily-state.json", {
  schema_version: 1,
  run_id: `pax-autocratica-${runDate}`,
  site_id: "PaxAutocratica",
  date: runDate,
  timezone: "Asia/Shanghai",
  status: "content_generated_pending_build_deploy",
  locked_at: checkedAt,
  input_hash: sha256(JSON.stringify({ latest_gid: latest.gid, latest_title: latest.title, latest_hash: st24Hash })),
  source_capture_count: sourceFiles.length,
});
writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: { gid: latest.gid, title: latest.title, date_utc: st24DateIso, url: st24Url, body_sha256: st24Hash },
  sources: sourceFiles.map((name) => ({ name, path: `source-captures/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-news-st24-20260927",
      disposition: "CREATE_CANDIDATE",
      reason: "ST-24 officially adds three Sector 1 - Elysia battles and creates a distinct current-build recheck task.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-st24-patch-notes/"],
      evidence_urls: [st24Url, "https://steamcommunity.com/app/1067360/allnews/"],
    },
    {
      source_id: "src-steam-discussions-20260927",
      disposition: "NO_ACTION_OR_DUPLICATE",
      reason: "Current visible discussion/homepage evidence is either already covered or not enough to support another distinct public index page.",
      affected_routes: [],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
    {
      source_id: "src-youtube-search-20260927",
      disposition: "NO_ACTION",
      reason: "YouTube search was captured for monitoring, but no new official embeddable video with direct Elysia battle proof was verified.",
      affected_routes: [],
      evidence_urls: ["https://www.youtube.com/results?search_query=Pax+Autocratica&sp=CAI%253D"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "official_patch_plus_platform_context", duplicate_gate: "distinct_from_st24_patch_overview", content_gate: "recheck_guide_not_walkthrough" },
    { slug: "pax-autocratica-dlss-45", status: "HOLD_DUPLICATE_SUBTOPIC", reason: "Covered by ST-24 and Performance until independent intent appears." },
    { slug: "pax-autocratica-trade-port-goods-table", status: "HOLD_EVIDENCE_INSUFFICIENT", reason: "ST-24 says goods changed but does not publish a table." },
    { slug: "pax-autocratica-special-soldiers-traits", status: "HOLD_DUPLICATE_SUBTOPIC", reason: "Covered by ST-24 and Best Troops without enough independent demand for a new page." },
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica Sector 1 Elysia battles", parent_query: "Pax Autocratica", source_type: "official_steam_news", source_url: st24Url, depth: 1, status: "selected" },
    { keyword: "Pax Autocratica Elysia walkthrough ST-24", parent_query: "Pax Autocratica Sector 1", source_type: "search_result", source_url: "https://steamcommunity.com/app/1067360/allnews/", depth: 1, status: "selected_boundary" },
    { keyword: "Pax Autocratica DLSS 4.5", parent_query: "Pax Autocratica ST-24", source_type: "official_steam_news", source_url: st24Url, depth: 1, status: "deferred_existing_page" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Latest official patch creates a distinct current-build Elysia recheck intent." }], held: ["pax-autocratica-dlss-45", "pax-autocratica-trade-port-goods-table"] });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica Sector 1 Elysia battles"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Official ST-24 Sector 1 new-battle evidence, distinct player task, safe answer boundary, indexable guide value." }, { slug: "pax-autocratica-st24-patch-notes", decision: "UPDATE_EXISTING_RELATED_LINKS", reason: "New page expands one ST-24 subtopic without duplicating patch overview." }] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Guide group, source provenance, media registry, related links and sitemap"], site_changes: [], no_change_site_reason: "No direct evidence required changing templates, ads, measurement, DNS or forced indexing." });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: "Content-only change; non-content areas frozen." });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });

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
  latest_official: { title: latest.title, url: st24Url, date_utc: st24DateIso, body_sha256: st24Hash },
  external_publications: 0,
  deferred_data: ["GSC", "Analytics/measurement export", "Similarweb", "Web.Cafe", "AITDK", "Ad revenue export"],
  no_change_site_reason: "No direct evidence required changing templates, ads, measurement, DNS or forced indexing.",
  findings,
};
writeJson("daily-report.json", report);

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>最新官方证据：<a href="${st24Url}">${escapeHtml(latest.title)}</a></p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
fs.writeFileSync(path.join(runDir, "daily-report.html"), reportHtml, "utf8");

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

最新官方证据：${latest.title} (${st24Url})

外部发布：0。原因：用户未提供本次允许发布平台清单。

延后数据：${report.deferred_data.join(", ")}。

${findings.map((finding) => `## ${finding.finding_id}\n\n- 结果：${finding.result_state}\n- 危害：${finding.harm_text}\n- 证据：${finding.evidence_refs.join("; ")}\n- 动作：${finding.recommended_action}\n- 状态：${finding.resolution_status}`).join("\n\n")}
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
  "site-health.json",
  "search-performance.json",
  "measurement-health.json",
  "external-benchmark.json",
  "aitdk-compatibility.json",
  "revenue-metrics.json",
  "daily-report.json",
  "daily-report.html",
  "daily-report.md",
  ...sourceFiles.map((name) => `source-captures/${name}`),
];
fs.writeFileSync(path.join(runDir, "checksums.sha256"), `${checksumTargets.filter((file) => fs.existsSync(path.join(runDir, file))).map((file) => `${sha256File(path.join(runDir, file))}  ${file}`).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ status: "generated", slug, runDir, latest: latest.title, sourceFiles: sourceFiles.length }, null, 2));
