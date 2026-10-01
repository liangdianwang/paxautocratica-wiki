import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-10-01";
const checkedAt = "2026-10-01T09:02:30+08:00";
const nextRunAt = "2026-10-02T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-soldier-customization";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
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

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\\\//g, "/")
    .replace(/\s+/g, " ")
    .trim();
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

const news = JSON.parse(fs.readFileSync(path.join(sourceDir, "steam-news-api.json"), "utf8"));
const latest = news?.appnews?.newsitems?.[0];
const stateOfFrontline = news?.appnews?.newsitems?.find((item) => /STATE OF THE FRONTLINE/i.test(item.title || ""));
if (!latest?.title?.includes("ST-24")) throw new Error(`Latest official Steam News is not ST-24: ${latest?.title || "missing"}`);
if (!stateOfFrontline) throw new Error("State of the Frontline official news item is missing from Steam News capture.");

const storeData = JSON.parse(fs.readFileSync(path.join(sourceDir, "steam-appdetails.json"), "utf8"));
const soldierThread = fs.readFileSync(path.join(sourceDir, "discussion-soldier-customization.html"), "utf8");
const endgameThread = fs.readFileSync(path.join(sourceDir, "discussion-end-game-content.html"), "utf8");
const crashThread = fs.readFileSync(path.join(sourceDir, "discussion-pc-crashes.html"), "utf8");
const baseDefenseThread = fs.readFileSync(path.join(sourceDir, "discussion-base-defence.html"), "utf8");
const discussionIndex = fs.readFileSync(path.join(sourceDir, "steam-discussions.html"), "utf8");
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());

const soldierQuestion = "I would like to change what they wear.";
const soldierDevReply = stripHtml((soldierThread.match(/Leader, this has been suggested[\s\S]*?All Hail The State!/i) || [])[0] || "");
const frontlineText = stripHtml(stateOfFrontline.contents || "");
const storeDescription = stripHtml(storeData?.["1067360"]?.data?.short_description || "");

if (!soldierThread.includes(soldierQuestion)) throw new Error("Soldier customization thread is missing the current player request.");
if (!/under review\/consideration/i.test(soldierDevReply)) throw new Error("Soldier customization thread is missing the developer boundary reply.");
if (!/visual differences between male and female soldiers/i.test(frontlineText) || !/more customizations/i.test(frontlineText)) {
  throw new Error("State of the Frontline capture is missing the official customization investigation boundary.");
}

const latestUrl = latest.url;
const latestDateIso = new Date(latest.date * 1000).toISOString();
const latestHash = sha256(latest.contents || "");
const frontlineUrl = stateOfFrontline.url;
const frontlineDateIso = new Date(stateOfFrontline.date * 1000).toISOString();
const inputHash = sha256(JSON.stringify({
  latest_gid: latest.gid,
  latest_hash: latestHash,
  frontline_gid: stateOfFrontline.gid,
  soldier_question: soldierQuestion,
  soldier_dev_reply: soldierDevReply,
  store_description: storeDescription,
  discussion_index_hash: sha256(discussionIndex.slice(0, 20000)),
}));

const page = {
  keyword: "Pax Autocratica Soldier Customization",
  slug,
  seo: {
    title: "Pax Autocratica Soldier Customization: Outfits, Gender and Gear Boundaries",
    description:
      "A source-backed Pax Autocratica soldier customization guide for outfit requests, gender/model differences, gear boundaries and what is only under review during Early Access.",
  },
  direct_answer:
    "Pax Autocratica does not currently have a captured official feature that lets players freely change every soldier's outfit, armor appearance, body model or uniform. The current public boundary is narrower: a Sept. 29 Steam discussion asks to change what soldiers wear, and Gurttron replies that this has been suggested many times and is under review or consideration for later additions. An earlier official State of the Frontline post also says requests such as visual differences between male and female soldiers, stylized avatars and more customizations are being worked on or investigated. Treat soldier customization as a watched Early Access request, not a shipped wardrobe system or confirmed roadmap date.",
  direct_answer_claim_ids: [
    "claim-soldier-customization-current-request-20261001",
    "claim-soldier-customization-official-investigation-20261001",
    "claim-soldier-customization-boundary-20261001",
  ],
  sections: [
    {
      heading: "What players are asking for now",
      paragraphs: [
        "The current Steam thread is direct: the player wants to change what soldiers wear. A community reply expands that into outfits, gender, weapons and armor, but that expansion is not the same as a shipped system.",
        "Use the thread as demand evidence. It proves players are looking for appearance control, not that a full wardrobe, armor-transmog system, Steam Workshop clothing support, or character creator is already in the game.",
      ],
      steps: [
        "Separate cosmetic outfit requests from combat class and gear-stat questions.",
        "Check whether the latest patch notes mention clothing, soldier models, avatars, armor visuals or customization before assuming a feature exists.",
        "Do not follow a community workaround unless it cites the current build and avoids save or account risk.",
      ],
      claim_ids: ["claim-soldier-customization-current-request-20261001"],
    },
    {
      heading: "What the developer reply actually confirms",
      paragraphs: [
        "Gurttron's current reply confirms that the request has been suggested and brought up many times, and that it is under review or consideration for down-the-road additions. That is a useful official-community boundary because it answers the status question without pretending the feature has shipped.",
        "It does not confirm a release window, a clothing slot list, armor skin behavior, paid cosmetic plans, mod support, body sliders, or whether existing soldiers will be retroactively editable.",
      ],
      steps: [
        "Treat the answer as under consideration, not promised.",
        "Watch later Steam News first; discussion replies should be rechecked against dated patch notes.",
        "If you only need stronger soldiers, use gear/class pages rather than waiting for appearance customization.",
      ],
      claim_ids: ["claim-soldier-customization-boundary-20261001"],
    },
    {
      heading: "How it connects to the official roadmap boundary",
      paragraphs: [
        "The official State of the Frontline post already names several related requests: visual differences between male and female soldiers, stylized avatars and more customizations are among items being worked on or investigated. That makes today's discussion stronger than a lone suggestion.",
        "The same wording is still cautious. Worked on or investigated does not equal released, dated, guaranteed, or fully scoped. Early Access pages should preserve that distinction so players do not plan a colony around missing customization controls.",
      ],
      steps: [
        "Use the official post to justify watching customization, avatars and soldier-model changes.",
        "Use later patch notes to confirm any actual implementation.",
        "Avoid combining unrelated requests into one promised feature bundle.",
      ],
      claim_ids: ["claim-soldier-customization-official-investigation-20261001"],
    },
    {
      heading: "Gear stats and visual customization are separate",
      paragraphs: [
        "Pax Autocratica already has many soldier-facing systems: class roles, special soldiers, weapon and armor drops, Trade Port goods, traits and combat balance. Those systems affect what soldiers can do. They do not automatically prove that the player can change how every soldier looks.",
        "That matters because a player searching for soldier customization may be asking a cosmetic question, while a player searching for soldier gear may need build, drop or stat advice. Mixing them creates a thin and misleading page.",
      ],
      steps: [
        "Use Soldier Gear for equipment and stat progression.",
        "Use Combat Classes for squad role coverage.",
        "Use this page only for appearance, outfit, avatar and model customization status.",
      ],
      claim_ids: ["claim-soldier-customization-boundary-20261001"],
    },
    {
      heading: "What not to claim yet",
      paragraphs: [
        "This page does not claim a current clothing editor, a confirmed transmog system, exact outfit slots, armor-skin rules, Steam Workshop clothing support, paid cosmetic plans, body sliders, gender-selection mechanics or a release date.",
        "It also does not claim that today's request is rejected. The best current answer is that customization is a known player request under review or investigation, and that actual implementation needs a later dated source.",
      ],
      steps: [
        "Recheck Steam News after each directive before updating the answer.",
        "Do not turn discussion optimism into a confirmed roadmap.",
        "Only add a build-specific how-to once the game exposes the relevant controls.",
      ],
      claim_ids: ["claim-soldier-customization-boundary-20261001"],
    },
  ],
  faq: [
    {
      question: "Can I change what soldiers wear in Pax Autocratica?",
      answer:
        "No captured official source confirms a current full outfit editor. The current developer reply says the request has been raised many times and is under review or consideration for later additions.",
      claim_ids: ["claim-soldier-customization-current-request-20261001", "claim-soldier-customization-boundary-20261001"],
    },
    {
      question: "Are gender or body model options confirmed?",
      answer:
        "The official State of the Frontline post says visual differences between male and female soldiers and more customizations are being worked on or investigated. It does not confirm exact options, controls or timing.",
      claim_ids: ["claim-soldier-customization-official-investigation-20261001"],
    },
    {
      question: "Is this the same as soldier gear?",
      answer:
        "No. Gear affects equipment and combat value. This page is about appearance, outfits, avatars and model customization status.",
      claim_ids: ["claim-soldier-customization-boundary-20261001"],
    },
    {
      question: "Should I wait for customization before building a roster?",
      answer:
        "Probably not. Use current class, gear, trait and squad-role systems for gameplay decisions, and treat appearance customization as a watched Early Access request.",
      claim_ids: ["claim-soldier-customization-boundary-20261001"],
    },
  ],
  source_ids: [
    "src-steam-discussion-soldier-customization-20261001",
    "src-steam-news-state-frontline-20261001",
    "src-steam-appdetails-20261001",
    "src-steam-discussions-index-20261001",
  ],
  claim_ids: [
    "claim-soldier-customization-current-request-20261001",
    "claim-soldier-customization-official-investigation-20261001",
    "claim-soldier-customization-boundary-20261001",
  ],
  updated_at: checkedAt,
  time_sensitivity: "early_access_current_build",
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-soldier-gear",
    "pax-autocratica-combat-classes",
    "pax-autocratica-best-troops",
    "pax-autocratica-roadmap",
    "pax-autocratica-supreme-powers-petition",
    "pax-autocratica-st24-patch-notes",
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
    const index = combatGroup.slugs.indexOf("pax-autocratica-soldier-gear");
    if (index >= 0) combatGroup.slugs.splice(index, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to soldier customization status, base building, colony logistics, combat classes, ST-24 patch changes, performance and Early Access questions.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica wiki, Pax Autocratica soldier customization, Pax Autocratica outfits, Pax Autocratica soldier gear, Pax Autocratica guide";
data.generated_at = checkedAt;

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-soldier-customization-20261001",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-best-troops-12.webp",
  alt: "Pax Autocratica soldier roster scene used for the soldier customization status guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 soldier-focused image already present in the site media registry.",
  relevance_reason: "The page explains soldier appearance, model and outfit customization boundaries.",
}, (item) => item.asset_id);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20261001-soldier-customization",
  intent_type: "current_soldier_appearance_customization_status",
  user_job: "Find out whether Pax Autocratica currently lets players customize soldier outfits, models or appearance.",
  intent_evidence_ids: page.source_ids,
  answerability: "resolved_with_current_developer_reply_and_official_roadmap_boundary",
  coverage: [
    {
      dimension: "current_player_request",
      status: "covered",
      claim_ids: ["claim-soldier-customization-current-request-20261001"],
      evidence_relation: "current_steam_discussion",
      notes: soldierQuestion,
    },
    {
      dimension: "developer_status_boundary",
      status: "covered",
      claim_ids: ["claim-soldier-customization-boundary-20261001"],
      evidence_relation: "current_steam_discussion_developer_reply",
      notes: soldierDevReply,
    },
    {
      dimension: "official_related_roadmap_boundary",
      status: "covered",
      claim_ids: ["claim-soldier-customization-official-investigation-20261001"],
      evidence_relation: "official_news",
      notes: "State of the Frontline lists visual differences between male and female soldiers, stylized avatars and more customizations as being worked on or investigated.",
    },
  ],
  source_links: [
    { label: "Steam discussion: Would like to see customization option's for my soldire's", url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308754556/", source_type: "community_developer_reply" },
    { label: "Steam News: State of the Frontline", url: frontlineUrl, source_type: "official_community" },
    { label: "Steam store", url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", source_type: "official_store" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-soldier-customization",
  boundaries: [
    "Does not claim a current outfit editor or clothing slot list.",
    "Does not claim armor transmog, paid cosmetics, Workshop clothing support or body sliders.",
    "Does not publish a release date or treat under review as promised.",
  ],
  depth_variance_reason: "The page answers a distinct cosmetic/status intent that is separate from gear stats, combat classes and roadmap suggestion pages.",
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

- [Steam discussion: Would like to see customization option's for my soldire's](https://steamcommunity.com/app/1067360/discussions/0/586187435308754556/) (community/developer reply)
- [Steam News: State of the Frontline](${frontlineUrl}) (official community announcement)
- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/) (official platform)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, markdown, "utf8");

const sitemapUrls = [
  { loc: `${baseUrl}/`, lastmod: runDate },
  { loc: `${baseUrl}/guide/`, lastmod: runDate },
  ...data.pages
    .filter((item) => item.page_status === "publish" && item.index_status === "index")
    .map((item) => ({ loc: `${baseUrl}/${item.slug}/`, lastmod: item.slug === slug ? runDate : String(item.updated_at || "").slice(0, 10) || runDate })),
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
  { slug: "pax-autocratica-end-game-content", reason: "Current thread has a developer forwarding reply but no shipped feature, date, mode, or concrete answer beyond existing Roadmap/Sector pages." },
  { slug: "pax-autocratica-base-defence", reason: "Already handled in Auto-Defense boundary; still not currently planned." },
  { slug: "pax-autocratica-pc-crashes", reason: "Existing Performance/ST-24 intent; current thread repeats verify/DLSS/frame-generation/log guidance without a new fix." },
  { slug: "pax-autocratica-price-value", reason: "Existing Price/Review intent and opinion-heavy discussion." },
  { slug: "pax-autocratica-translations", reason: "Existing Language Patches intent; no shipped editable-language-file implementation today." },
];

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "避免重复运行或把其他站点状态混进 Pax Autocratica。",
    evidence_refs: [`run_dir:${runDir}`, `latest_steam_gid:${latest.gid}`, `input_hash:${inputHash}`],
    recommended_action: "已锁定 2026-10-01 Pax Autocratica 运行目录、项目配置和来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把 under review 写成已上线功能，玩家会误以为现在能改士兵服装或模型。",
    evidence_refs: [
      "steam_news:ST-24_latest",
      "steam_news:State_of_the_Frontline",
      "discussion:Soldier customization",
      "discussion:End-game content",
      "discussion:Base Defence",
      "discussion:Pc Crashes",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "将士兵外观自定义转成谨慎边界页；其他重复或证据不足话题保持不新增。",
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
    recommended_action: "本地已接入 Guide、sitemap、媒体与相关页面；部署后验证正式路径。",
    next_review_at: "2026-10-01T10:30:00+08:00",
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
    recommended_action: "记录不可用；候选判断使用官方 Steam 证据和公开讨论证据。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D05-D08-candidate-gates",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把 End-game、Base Defence、崩溃、价格或翻译重复建页，会变成同意图薄页。",
    evidence_refs: [`candidate:selected:${slug}`, ...heldCandidates.map((item) => `held:${item.slug}`)],
    recommended_action: "仅新增 Soldier Customization；其余话题归档到既有页面或研究积压。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D09-content-production",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "内容必须是可索引新页，并能帮助玩家完成独立任务。",
    evidence_refs: [
      `content:content/en/${slug}.mdx`,
      "site-data:public/site-data.json",
      "sitemap:public/sitemap.xml",
    ],
    recommended_action: "已新增一个 index L2 页，并保留官方/社区/补丁边界，未改模板、广告、DNS 或测量。",
    next_review_at: "2026-10-01T10:30:00+08:00",
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
    next_review_at: "2026-10-01T10:30:00+08:00",
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
    next_review_at: "2026-10-01T10:30:00+08:00",
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
  latest_official: { title: latest.title, url: latestUrl, date_utc: latestDateIso, body_sha256: latestHash },
  selected_candidate: {
    slug,
    evidence: [
      "Current Steam discussion asks to change soldier clothing",
      "Gurttron replies the request has been suggested many times and is under review/consideration",
      "Official State of the Frontline lists male/female visual differences, stylized avatars and more customizations as worked on or investigated",
      "Steam appdetails confirms the current public game identity and Early Access status",
    ],
    boundary: "No current outfit editor, clothing slots, transmog, body sliders, paid cosmetic plan, Workshop clothing support or release date claimed.",
  },
  updated_existing_pages: [],
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
  official_supporting: { title: stateOfFrontline.title, url: frontlineUrl, date_utc: frontlineDateIso, body_sha256: sha256(stateOfFrontline.contents || "") },
  current_discussions: [
    { title: "Would like to see customization option's for my soldire's", url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308754556/", player_request: soldierQuestion, developer_reply: soldierDevReply },
    { title: "Can we please get some end-game content while we wait?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308796194/", disposition: "hold_roadmap_context", evidence_sha256: sha256(stripHtml(endgameThread)) },
    { title: "Base Defence?!", url: "https://steamcommunity.com/app/1067360/discussions/0/586187334843630783/", disposition: "existing_auto_defense_boundary", evidence_sha256: sha256(stripHtml(baseDefenseThread)) },
    { title: "Pc Crashes", url: "https://steamcommunity.com/app/1067360/discussions/0/586187095760083261/", disposition: "existing_performance_boundary", evidence_sha256: sha256(stripHtml(crashThread)) },
  ],
  discussion_index_excerpt_hash: sha256(discussionIndex.slice(0, 20000)),
  sources: sourceFiles.map((name) => ({ name, path: `sources/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-soldier-customization-20261001",
      disposition: "CREATE_CANDIDATE",
      reason: "Current player task asks whether soldiers can be visually customized; developer reply gives a current status boundary.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187435308754556/"],
    },
    {
      source_id: "src-steam-news-state-frontline-20261001",
      disposition: "CREATE_CANDIDATE",
      reason: "Official news independently supports customization as a watched Early Access request under work/investigation.",
      affected_routes: [`/${slug}/`],
      evidence_urls: [frontlineUrl],
    },
    {
      source_id: "src-other-discussions-20261001",
      disposition: "NO_ACTION_OR_HOLD",
      reason: "End-game, Base Defence, PC crashes, price and translations map to existing pages or lack direct implementation evidence.",
      affected_routes: ["/pax-autocratica-roadmap/", "/pax-autocratica-auto-defense/", "/pax-autocratica-performance/", "/pax-autocratica-price/", "/pax-autocratica-language-patches/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "current_developer_reply_plus_official_news_boundary", duplicate_gate: "distinct_from_soldier_gear_combat_classes_and_roadmap", content_gate: "actionable_status_boundary_not_feature_promise" },
    ...heldCandidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica soldier customization", parent_query: "Pax Autocratica guide", source_type: "steam_discussion_developer_reply", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308754556/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica outfits", parent_query: "Pax Autocratica soldier customization", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187435308754556/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica gender models", parent_query: "Pax Autocratica soldier customization", source_type: "official_news", source_url: frontlineUrl, depth: 2, status: "covered_as_roadmap_boundary" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct appearance/status intent with current developer reply and official roadmap-context evidence." }], updates: [], held: heldCandidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica soldier customization"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, evidence, duplicate, content and production gates." }, ...heldCandidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Guide expedition group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>最新官方证据：<a href="${latestUrl}">${escapeHtml(latest.title)}</a></p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
fs.writeFileSync(path.join(runDir, "daily-report.html"), reportHtml, "utf8");

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

最新官方证据：${latest.title} (${latestUrl})

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
  "health-findings.raw.jsonl",
  "daily-report.json",
  "daily-report.html",
  "daily-report.md",
  ...sourceFiles.map((name) => `sources/${name}`),
];
fs.writeFileSync(path.join(runDir, "checksums.sha256"), `${checksumTargets.filter((file) => fs.existsSync(path.join(runDir, file))).map((file) => `${sha256File(path.join(runDir, file))}  ${file}`).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ status: "generated", slug, runDir, latest: latest.title, sourceFiles: sourceFiles.length }, null, 2));
