import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-09-28";
const checkedAt = "2026-09-28T09:36:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-combat-classes";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const artifactDir = path.join(runDir, "artifacts");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);

fs.mkdirSync(runDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

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

function readJson(filePath, fallback) {
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : fallback;
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const news = readJson(path.join(sourceDir, "steam-news-api.json"), null);
if (!news?.appnews?.newsitems?.length) throw new Error("Missing Steam News API capture.");
const latest = news.appnews.newsitems[0];
if (!latest?.title?.includes("ST-24")) throw new Error(`Latest official Steam News is not ST-24: ${latest?.title || "missing"}`);

const discussionMeta = readJson(path.join(artifactDir, "discussion-meta-extracts.json"), []);
const combatDiscussion = discussionMeta.find((item) => /Favorite Combat Classes/i.test(item.title || ""));
if (!combatDiscussion?.description) throw new Error("Missing Favorite Combat Classes discussion capture.");

const newsText = news.appnews.newsitems.map((item) => `${item.title}\n${item.contents}`).join("\n\n");
for (const required of ["class details", "class-based sorting", "combat strength"]) {
  if (!new RegExp(required, "i").test(newsText)) throw new Error(`Official news capture missing required class evidence: ${required}`);
}

const latestUrl = latest.url;
const latestDateIso = new Date(latest.date * 1000).toISOString();
const latestHash = sha256(latest.contents || "");
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());

const page = {
  keyword: "Pax Autocratica Combat Classes",
  slug,
  seo: {
    title: "Pax Autocratica Combat Classes: Medics, Shields and Squad Roles",
    description:
      "A source-backed Pax Autocratica combat classes guide for reading class roles, medics, shield units and shotgun troops without inventing a fixed tier list.",
  },
  direct_answer:
    "Pax Autocratica does not publish an official combat-class tier list. The safer current-build answer is to use combat classes as squad roles: keep a recovery layer such as Medics, protect key soldiers with shield or front-line roles when the build supports it, use burst-damage troops for fast threats, and recheck class details inside the Soldier Details interface after every major patch. Current player discussion names Medics, shieldmasters and cluster shotgunners as obvious favorites, while official updates confirm class UI support, class-based sorting and repeated soldier/combat balance changes. That is enough for a role-based guide, but not enough to claim exact best classes, hidden formulas, DPS rankings or a permanent meta.",
  direct_answer_claim_ids: ["claim-combat-classes-demand-20260928", "claim-combat-classes-official-ui-20260928", "claim-combat-classes-boundary-20260928"],
  sections: [
    {
      heading: "Start with roles, not a tier list",
      paragraphs: [
        "The current Steam discussion asks where the post-patch class meta stands and specifically calls out Medics, shieldmasters and cluster shotgunners. That is useful demand evidence: players are trying to decide which roles deserve roster space after several patches.",
        "The official sources do not publish class tables or role rankings. They do, however, confirm that the Soldier Details interface can show class details, that Soldier Management and inventory gained class-based sorting, and that soldier balance, affixes, collision and combat readability have been repeatedly adjusted. Read classes as current-build roles, not as permanent spreadsheet entries.",
      ],
      steps: [
        "Open Soldier Details and read the class detail before deploying a soldier.",
        "Sort or group soldiers by class when checking the roster, then decide what role the next expedition lacks.",
        "Avoid copying a tier list that does not cite the current build or the latest patch notes.",
      ],
      claim_ids: ["claim-combat-classes-demand-20260928", "claim-combat-classes-official-ui-20260928"],
    },
    {
      heading: "Keep a recovery layer",
      paragraphs: [
        "Community discussion treats Medics as essential because they answer a basic expedition risk: keeping the squad and Leader alive long enough to finish the fight or retreat. ST-24 also changes revive responder speed, so any class advice involving recovery should be checked in the latest build rather than copied from older revive complaints.",
        "The boundary is important. No captured official source says one Medic count is optimal, that every map requires the same healer ratio, or that Medics solve pathing, co-op or downed-player design issues by themselves.",
      ],
      steps: [
        "Bring recovery when the run is failing from attrition rather than damage output.",
        "Retest revive and healing behavior after ST-24 before trusting old advice.",
        "Record map, distance, squad spacing and blocked paths if recovery still fails.",
      ],
      claim_ids: ["claim-combat-classes-demand-20260928", "claim-combat-classes-boundary-20260928"],
    },
    {
      heading: "Use shields and burst troops for different failures",
      paragraphs: [
        "The same discussion praises shield-style soldiers for defensive value and cluster shotgunners as shock troops. Treat those as role hints, not proof of a final meta. Shields answer survivability and pressure problems; burst troops answer fast clear or dangerous target problems.",
        "Official updates support this role-based framing because they repeatedly touch soldier collision, allied affix cooldowns, named combat-strength changes, enemy affixes and interface clarity. Those changes can move the value of a role without making any one class permanently best.",
      ],
      steps: [
        "If soldiers die before dealing value, test more protection or spacing before adding more damage.",
        "If enemies survive long enough to overwhelm the squad, test burst damage or a more focused target plan.",
        "Change one squad role at a time so the next failed expedition teaches you what improved.",
      ],
      claim_ids: ["claim-combat-classes-official-ui-20260928"],
    },
    {
      heading: "What to recheck after patches",
      paragraphs: [
        "ST-11 and ST-24 both show that soldier behavior and combat balance are still moving. ST-11 mentions soldier class details in the Soldier Details interface and improves several soldier/combat systems; ST-24 changes special-soldier trait outcomes, combat gender ratio, Trade Port goods and revive response speed.",
        "That means combat-class guidance should be dated. If a patch mentions soldiers, affixes, revive, capture, class UI, Trade Port goods or expedition balance, revisit class choices before assuming yesterday's squad plan still holds.",
      ],
      steps: [
        "Check the latest official Steam News before changing your roster around a class claim.",
        "Separate named special soldiers from general class advice.",
        "Do not convert Trade Port or trait changes into a class ranking unless the source actually supports it.",
      ],
      claim_ids: ["claim-combat-classes-official-ui-20260928", "claim-combat-classes-boundary-20260928"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not claim a best combat class, a fixed healer count, exact DPS values, class unlock requirements, hidden class formulas, a ranked list of every soldier, or a guaranteed build for every sector. The current evidence supports a practical decision route, not a math table.",
        "For troop quality, captures and upgrades, use the Best Troops guide. For commands and spacing, use the F1 Commands guide. Combat classes sit between those pages: they help decide what role the squad lacks once you know the mission problem.",
      ],
      steps: [
        "Use class advice to choose a test, not to skip testing.",
        "Keep patch date and build context attached to any class claim.",
        "Update this page only when official notes or current high-quality evidence change the role boundary.",
      ],
      claim_ids: ["claim-combat-classes-boundary-20260928"],
    },
  ],
  faq: [
    {
      question: "What are the best combat classes in Pax Autocratica?",
      answer:
        "There is no official fixed class ranking. Use classes by role: recovery, protection, burst damage, control and squad support, then retest after patches that touch soldiers or combat.",
      claim_ids: ["claim-combat-classes-boundary-20260928"],
    },
    {
      question: "Are Medics essential?",
      answer:
        "Current player discussion treats Medics as an obvious favorite, but the safe answer is role-based: bring recovery when attrition or downed-player situations are the real failure point.",
      claim_ids: ["claim-combat-classes-demand-20260928"],
    },
    {
      question: "Did the developer publish class stats or DPS tables?",
      answer:
        "No captured official source publishes a full combat-class stat table, DPS ranking or best-build formula. Official notes confirm class UI and soldier/combat changes, not a tier list.",
      claim_ids: ["claim-combat-classes-official-ui-20260928", "claim-combat-classes-boundary-20260928"],
    },
    {
      question: "How is this different from the Best Troops guide?",
      answer:
        "Best Troops covers upgrade, capture and force-quality decisions. Combat Classes focuses on squad role coverage: healing, shielding, burst damage and current-build class checks.",
      claim_ids: ["claim-combat-classes-boundary-20260928"],
    },
  ],
  source_ids: ["src-steam-discussion-combat-classes-20260928", "src-steam-news-st11-20260928", "src-steam-news-aug28-20260928", "src-steam-news-st24-20260928", "src-steam-store-20260928"],
  claim_ids: ["claim-combat-classes-demand-20260928", "claim-combat-classes-official-ui-20260928", "claim-combat-classes-boundary-20260928"],
  updated_at: checkedAt,
  time_sensitivity: "early_access_balance",
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: ["pax-autocratica-best-troops", "pax-autocratica-f1-commands", "pax-autocratica-revive-player", "pax-autocratica-st24-patch-notes", "pax-autocratica-sector-1-elysia-battles"],
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
    const index = combatGroup.slugs.indexOf("pax-autocratica-best-troops");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-combat-classes-20260928",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-best-troops-12.webp",
  alt: "Pax Autocratica combat scene used for the combat classes guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 combat screenshot already present in the site media registry.",
  relevance_reason: "Shows squad combat context for a guide about combat class roles without inventing class-specific art.",
}, (item) => item.asset_id);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260928-combat-classes",
  intent_type: "community_demand_plus_official_ui_boundary",
  user_job: "Decide how to think about Pax Autocratica combat classes after recent patches without relying on an unsupported tier list.",
  intent_evidence_ids: page.source_ids,
  answerability: "resolved_with_role_based_boundary",
  coverage: [
    {
      dimension: "player_demand",
      status: "covered",
      claim_ids: ["claim-combat-classes-demand-20260928"],
      evidence_relation: "steam_discussion_current",
      notes: combatDiscussion.description,
    },
    {
      dimension: "official_class_support",
      status: "covered",
      claim_ids: ["claim-combat-classes-official-ui-20260928"],
      evidence_relation: "official_patch_notes",
      notes: "Official news captures mention Soldier Details class details, class-based sorting, soldier combat-strength changes, allied affix cooldown and ST-24 soldier balance boundaries.",
    },
    {
      dimension: "tier_list_boundary",
      status: "bounded",
      claim_ids: ["claim-combat-classes-boundary-20260928"],
      evidence_relation: "official_omission",
      notes: "No captured official source publishes a full combat-class stat table or permanent ranking.",
    },
  ],
  source_links: [
    { label: "Steam discussion: Favorite Combat Classes", url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759969121/", source_type: "community" },
    { label: "Steam News: Directive ST-24", url: latestUrl, source_type: "official_community" },
    { label: "Steam Community all news", url: "https://steamcommunity.com/app/1067360/allnews/", source_type: "official_community" },
    { label: "Pax Autocratica Steam store", url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", source_type: "official_store" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-combat-classes",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct role-composition task and explicitly avoids an unsupported class tier list, DPS table or fixed meta.",
};

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to combat classes, ST-24 Sector 1 Elysia battles, patch changes, logistics, revive behavior, performance, Auto-Defense, crowded UI, soldiers fighting in base, soundtrack status, Linux support and Early Access questions.";
}
if (data.home?.hero?.stats) data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-28"];
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica combat classes, Pax Autocratica best classes, Pax Autocratica medics, Pax Autocratica shieldmasters, Pax Autocratica ST-24, Pax Autocratica guide";
}
if (data.site) data.site.version = "local-pending-combat-classes";
data.generated_at = checkedAt;

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
    evidence_refs: [`run_dir:${runDir}`, `latest_steam_gid:${latest.gid}`, `input_hash:${sha256(JSON.stringify({ latest_gid: latest.gid, combat_discussion: combatDiscussion.description }))}`],
    recommended_action: "已锁定 2026-09-28 Pax Autocratica 运行目录、项目配置和来源输入。",
    next_review_at: "2026-09-29T09:00:00+08:00",
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把玩家职业偏好直接写成排行榜，会造成误导和薄页。",
    evidence_refs: ["discussion:Favorite Combat Classes", "steam_news:ST-11 class details", "steam_news:class-based sorting", "steam_news:ST-24 soldier boundary", ...sourceFiles.map((name) => `capture:${name}`)],
    recommended_action: "将当前讨论转成 Combat Classes 角色判断页；崩溃、翻译、Base fighting 等重复话题仅记录或归入已有页。",
    next_review_at: "2026-09-29T09:00:00+08:00",
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新页没有公开 200、canonical、sitemap 和内链，用户和搜索引擎可能看不到它。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Expeditions and squad combat"],
    recommended_action: "本地已接入 Guide、sitemap、媒体与相关页面；部署后验证正式路径。",
    next_review_at: "2026-09-28T10:30:00+08:00",
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
    next_review_at: "2026-09-29T09:00:00+08:00",
  },
  {
    finding_id: "D04-external-benchmark",
    domain: "external_benchmark",
    result_state: "UNKNOWN",
    resolution_status: "DEFERRED",
    severity: "P4",
    harm_text: "第三方估算不可用时，不能伪装成 Similarweb、AITDK 或 Web.Cafe 结论。",
    evidence_refs: ["no_authenticated_similarweb_webcafe_aitdk_export"],
    recommended_action: "记录不可用；候选判断使用官方 Steam 证据和公开讨论证据。",
    next_review_at: "2026-09-29T09:00:00+08:00",
  },
  {
    finding_id: "D05-D08-candidate-gates",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把 10 人小图限制、PC 崩溃或翻译请求单独硬写，会缺少证据或与旧页重复。",
    evidence_refs: ["candidate:selected:pax-autocratica-combat-classes", "held:pc-crashes-existing-performance", "held:translations-existing-language", "held:small-battle-limit-insufficient-official-answer"],
    recommended_action: "仅发布 Combat Classes 角色页；其他话题继续归档或等待直接证据。",
    next_review_at: "2026-09-29T09:00:00+08:00",
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务。",
    evidence_refs: [`content:content/en/${slug}.mdx`, "site-data:public/site-data.json", "sitemap:public/sitemap.xml"],
    recommended_action: "已新增一个 index L2 页，提供职业角色判断、补丁复核和边界 FAQ。",
    next_review_at: "2026-09-28T10:30:00+08:00",
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
    next_review_at: "2026-09-28T10:30:00+08:00",
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
    next_review_at: "2026-09-29T09:00:00+08:00",
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
    next_review_at: "2026-09-28T10:30:00+08:00",
  },
];

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
  latest_official: { title: latest.title, url: latestUrl, date_utc: latestDateIso, body_sha256: latestHash },
  selected_candidate: {
    slug,
    evidence: ["Steam discussion: Favorite Combat Classes", "Official Steam News: class details/class sorting/soldier balance", "Steam store identity"],
    boundary: "No class tier list, DPS table, fixed healer count, unlock table, or permanent meta claimed.",
  },
  held_candidates: [
    { slug: "pax-autocratica-pc-crashes", reason: "Existing Performance page intent; no direct developer resolution captured." },
    { slug: "pax-autocratica-translations", reason: "Existing Language Patches page intent; no official implementation change captured." },
    { slug: "pax-autocratica-small-battle-soldier-limit", reason: "Single community question without official/current answer evidence." },
    { slug: "pax-autocratica-female-body-model", reason: "Feature request/roadmap candidate without dated implementation evidence." },
  ],
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
  input_hash: sha256(JSON.stringify({ latest_gid: latest.gid, latest_hash: latestHash, combat_discussion: combatDiscussion.description })),
  source_capture_count: sourceFiles.length,
});
writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: report.latest_official,
  discussion_meta: discussionMeta,
  sources: sourceFiles.map((name) => ({ name, path: `sources/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-combat-classes-20260928",
      disposition: "CREATE_CANDIDATE",
      reason: "Current discussion shows a distinct player task around post-patch combat class roles.",
      affected_routes: [`/${slug}/`, "/pax-autocratica-best-troops/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187095759969121/"],
    },
    {
      source_id: "src-steam-news-api-20260928",
      disposition: "SUPPORT_CANDIDATE",
      reason: "Official notes provide class UI/sorting and soldier-combat balance boundaries, but no tier list.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/allnews/"],
    },
    {
      source_id: "src-other-discussions-20260928",
      disposition: "DRAFT_RESEARCH_OR_UPDATE_EXISTING",
      reason: "PC crashes, translations, small battle limit and female body model did not pass a new index-page gate today.",
      affected_routes: ["/pax-autocratica-performance/", "/pax-autocratica-language-patches/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "community_demand_plus_official_patch_context", duplicate_gate: "distinct_from_best_troops", content_gate: "role_guide_not_tier_list" },
    { slug: "pax-autocratica-pc-crashes", status: "HOLD_UPDATE_EXISTING", reason: "Performance page already covers crash/performance troubleshooting; no developer resolution captured." },
    { slug: "pax-autocratica-translations", status: "HOLD_UPDATE_EXISTING", reason: "Language page already covers translation boundary; no official editable-language-file change captured." },
    { slug: "pax-autocratica-small-battle-soldier-limit", status: "HOLD_EVIDENCE_INSUFFICIENT", reason: "Single current discussion question without direct official answer." },
    { slug: "pax-autocratica-female-body-model", status: "HOLD_ROADMAP_REQUEST", reason: "Feature request lacks dated implementation evidence." },
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica combat classes", parent_query: "Pax Autocratica best troops", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759969121/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica Medics", parent_query: "Pax Autocratica combat classes", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759969121/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica shieldmasters", parent_query: "Pax Autocratica combat classes", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759969121/", depth: 2, status: "covered_in_selected_page" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct role-composition intent with current discussion demand and official class UI/balance context." }], held: report.held_candidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica combat classes"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, evidence, duplicate, content and production gates." }, ...report.held_candidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Guide group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>最新官方证据：<a href="${latestUrl}">${escapeHtml(latest.title)}</a></p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
fs.writeFileSync(path.join(runDir, "daily-report.html"), reportHtml, "utf8");

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

最新官方证据：${latest.title} (${latestUrl})

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
  "source-fetch-manifest.json",
  ...sourceFiles.map((name) => `sources/${name}`),
  ...fs.readdirSync(artifactDir).filter((name) => fs.statSync(path.join(artifactDir, name)).isFile()).map((name) => `artifacts/${name}`),
];
fs.writeFileSync(path.join(runDir, "checksums.sha256"), `${checksumTargets.filter((file) => fs.existsSync(path.join(runDir, file))).map((file) => `${sha256File(path.join(runDir, file))}  ${file}`).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ status: "generated", slug, runDir, latest: latest.title, sourceFiles: sourceFiles.length }, null, 2));
