import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-09-30";
const checkedAt = "2026-09-30T09:30:00+08:00";
const nextRunAt = "2026-10-01T09:00:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-base-building";
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

function stripHtml(value) {
  return String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<meta\\s+(?:name|property)=["']${escaped}["']\\s+content=["']([^"']*)["']`, "i"));
  return match ? stripHtml(match[1]) : "";
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
if (!latest?.title?.includes("ST-24")) throw new Error(`Latest official Steam News is not ST-24: ${latest?.title || "missing"}`);

const storeHtml = fs.readFileSync(path.join(sourceDir, "steam-store.html"), "utf8");
const discussionBaseHtml = fs.readFileSync(path.join(sourceDir, "discussion-07.html"), "utf8");
const discussionSuggestHtml = fs.readFileSync(path.join(sourceDir, "discussion-03.html"), "utf8");
const discussionsIndexHtml = fs.readFileSync(path.join(sourceDir, "steam-discussions.html"), "utf8");
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());

const latestUrl = latest.url;
const latestDateIso = new Date(latest.date * 1000).toISOString();
const latestHash = sha256(latest.contents || "");
const storeHasBaseLoop = /Turn a handful of survivors into a vast[\s\S]*?mine, gather, haul, research, and manufacture weapons, armor, food, and supplies/i.test(storeHtml);
const discussionDescription = metaContent(discussionBaseHtml, "Description") || metaContent(discussionBaseHtml, "og:description");
const baseReply = stripHtml((discussionBaseHtml.match(/The base building elements are well worth it[\s\S]*?More content coming soon\./i) || [])[0] || "");
const designChatReply = stripHtml((discussionBaseHtml.match(/Join the pax designs chat[\s\S]*?Fortress\/Trade Port[\s\S]*?Wish you luck!/i) || [])[0] || "");
const suggestionReply = stripHtml((discussionSuggestHtml.match(/Thanks for the feedback[\s\S]*?sent to the team[\s\S]*?enjoying your time!/i) || [])[0] || "");

if (!storeHasBaseLoop) throw new Error("Steam store capture does not contain the official base-building loop.");
if (!/base building elements are well worth it/i.test(baseReply)) throw new Error("Base-building discussion capture does not contain the expected current reply.");
if (!/sent to the team/i.test(suggestionReply)) throw new Error("Suggestion discussion capture does not contain the expected team-forwarding boundary.");

const inputHash = sha256(JSON.stringify({
  latest_gid: latest.gid,
  latest_hash: latestHash,
  store_base_loop: storeHasBaseLoop,
  discussion_description: discussionDescription,
  base_reply: baseReply,
  design_chat_reply: designChatReply,
  suggestion_reply: suggestionReply,
}));

const page = {
  keyword: "Pax Autocratica Base Building",
  slug,
  seo: {
    title: "Pax Autocratica Base Building: Current Colony Priorities",
    description:
      "A source-backed Pax Autocratica base building guide for colony jobs, hauling, Trade Port context, current player feedback, and what not to assume during Early Access.",
  },
  direct_answer:
    "Pax Autocratica base building is a real current-game pillar, not only decoration. The official Steam store describes turning survivors into a self-sustaining colony where citizens mine, gather, haul, research, and manufacture weapons, armor, food, and supplies. The safest current priority is to treat the base as the preparation layer for expeditions: stabilize production and hauling first, then use Trade Port, research, soldier management, settings, and layout changes to support a specific next run. A current Steam discussion praises fortress-style base building and mentions Trade Port inspiration, while another suggestion thread was acknowledged as feedback sent to the team. Those are demand and direction signals, not proof of a complete base-layout meta, a shipped base-defense mode, or a guaranteed next-feature list.",
  direct_answer_claim_ids: [
    "claim-base-building-official-loop-20260930",
    "claim-base-building-current-demand-20260930",
    "claim-base-building-feedback-boundary-20260930",
    "claim-base-building-st24-logistics-20260930",
  ],
  sections: [
    {
      heading: "What base building is responsible for",
      paragraphs: [
        "The official store wording makes the base more than scenery: citizens are assigned to mining, gathering, hauling, research, and manufacturing weapons, armor, food, and supplies. Those jobs are the state layer that lets the expedition layer keep moving.",
        "Use that source as the boundary. This page can explain priorities and recheck points, but it should not invent building unlock tables, ideal room blueprints, decoration scores, or exact production math that the captured official sources do not publish.",
      ],
      steps: [
        "Identify the production job that is actually blocking your next expedition.",
        "Fix hauling and storage visibility before rebuilding the whole settlement.",
        "Tie each building change to a next-run goal: supplies, gear, research, money, recovery, or troop quality.",
      ],
      claim_ids: ["claim-base-building-official-loop-20260930"],
    },
    {
      heading: "Current priority route",
      paragraphs: [
        "Start with the chain that fails fastest when ignored: resource production, hauling, Warehouse flow, research or crafting, then expedition preparation. ST-24 is current official evidence that logistics are still actively maintained: it changes temporary assignment, auto-assignment, Resource Transport Station behavior, Warehouse transfer timing, interrupted hauling, Trade Port goods, and Victory Square slots.",
        "That means a good base plan in this build is not a static floorplan copied from an old screenshot. It is a short checklist that asks which part of the colony-to-frontier loop is slowing the next battle.",
      ],
      steps: [
        "If buildings fill up, recheck Resource Transport Station and Warehouse behavior.",
        "If soldiers drift from important work, recheck temporary assignment and auto-assignment outcomes.",
        "If Trade Port purchases hurt soldiers or clutter decisions, recheck current ST-24 goods changes before buying around an old table.",
      ],
      claim_ids: ["claim-base-building-st24-logistics-20260930"],
    },
    {
      heading: "What today's community evidence adds",
      paragraphs: [
        "A current discussion says the player is moving through the game quickly but sees the long-term vision. In replies, base building is called worth investing in, fortress or town preparation is framed as a highlight, and Trade Port/base design inspiration is mentioned.",
        "That supports a real reader task: players want to know whether fixing up the base is worth time after the first rush. It does not turn a community reply into an official layout guide, and it does not prove co-op, future buildings, or an exact content schedule.",
      ],
      steps: [
        "Use community base-design talk as inspiration, not as a rules source.",
        "Treat fortress/Trade Port references as examples of player goals, not mandatory progression.",
        "Keep co-op hopes on the Multiplayer page until a dated official update confirms a released mode.",
      ],
      claim_ids: ["claim-base-building-current-demand-20260930"],
    },
    {
      heading: "Suggestion threads are not patch notes",
      paragraphs: [
        "Another current thread collects suggestions around soldier portraits, aerial inspection, readability, elite visuals, unit classes, factions, and art direction. Multiverse replies that the feedback has been noted and sent to the team.",
        "That is useful for deciding what to watch next, but it is not a shipped feature. For base building, it means future-facing feedback can influence priorities while the public guide must still separate confirmed systems from ideas under review.",
      ],
      steps: [
        "Record the suggestion theme and the reply, but do not promise implementation.",
        "Update this page only when a dated patch note changes a base, layout, logistics, Trade Port, or construction fact.",
        "Use the Supreme Powers and Roadmap pages for idea-submission context instead of making each suggestion a thin page.",
      ],
      claim_ids: ["claim-base-building-feedback-boundary-20260930"],
    },
    {
      heading: "What not to claim yet",
      paragraphs: [
        "This page does not claim a best base blueprint, a full building unlock order, exact work-speed values, complete Trade Port goods tables, a base-defense/turret system, co-op base sharing, or an official schedule for more base content.",
        "When a player needs a narrower answer, use the dedicated pages: Resource Transport Station/Warehouse for hauling, Trade Port for buying and selling boundaries, Custom Colony Settings for difficulty tuning, Overworked Soldiers for schedule pressure, and Soldiers Fighting In Base for social conflict.",
      ],
      steps: [
        "Do not rebuild the whole base from a single discussion reply.",
        "Do not treat decoration or fortress inspiration as mechanical optimization unless the current build proves it.",
        "Recheck ST-24 and later directives before copying any base advice into a permanent guide.",
      ],
      claim_ids: ["claim-base-building-feedback-boundary-20260930"],
    },
  ],
  faq: [
    {
      question: "Is base building actually important in Pax Autocratica?",
      answer:
        "Yes. The official store describes base and colony jobs as part of the core loop: mining, gathering, hauling, research, manufacturing gear, food, and supplies. Treat the base as expedition preparation, not just decoration.",
      claim_ids: ["claim-base-building-official-loop-20260930"],
    },
    {
      question: "What should I fix first in the base?",
      answer:
        "Fix the current bottleneck: resource production, hauling/Warehouse flow, research/crafting, or soldier recovery. ST-24 makes hauling and assignment behavior a current-build recheck point.",
      claim_ids: ["claim-base-building-st24-logistics-20260930"],
    },
    {
      question: "Does a fortress layout or Trade Port build have an official best plan?",
      answer:
        "Not from the captured sources. Current discussion shows player interest and inspiration, while official sources confirm systems and patch changes rather than a best blueprint.",
      claim_ids: ["claim-base-building-current-demand-20260930"],
    },
    {
      question: "Does this prove base defense is coming?",
      answer:
        "No. Base building is confirmed, but home-base defense with bugs and turrets remains a separate topic with a not-currently-planned boundary on the Auto-Defense page.",
      claim_ids: ["claim-base-building-feedback-boundary-20260930"],
    },
  ],
  source_ids: [
    "src-steam-store-base-loop-20260930",
    "src-steam-discussion-base-building-20260930",
    "src-steam-discussion-suggestions-20260930",
    "src-steam-news-st24-20260930",
    "src-steam-discussions-index-20260930",
  ],
  claim_ids: [
    "claim-base-building-official-loop-20260930",
    "claim-base-building-current-demand-20260930",
    "claim-base-building-feedback-boundary-20260930",
    "claim-base-building-st24-logistics-20260930",
  ],
  updated_at: checkedAt,
  time_sensitivity: "early_access_current_build",
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-gameplay",
    "pax-autocratica-resource-transport-station-warehouse",
    "pax-autocratica-trade-port",
    "pax-autocratica-custom-colony-settings",
    "pax-autocratica-overworked-soldiers",
    "pax-autocratica-soldiers-fighting-base",
    "pax-autocratica-auto-defense",
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
  const colonyGroup = guide.groups.find((group) => group.title === "Colony logistics and live settings");
  if (colonyGroup && !colonyGroup.slugs.includes(slug)) {
    const index = colonyGroup.slugs.indexOf("pax-autocratica-resource-transport-station-warehouse");
    if (index >= 0) colonyGroup.slugs.splice(index, 0, slug);
    else colonyGroup.slugs.unshift(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to base building, colony logistics, small battle soldier limits, combat classes, ST-24 patch changes, revive behavior, performance, Auto-Defense and Early Access questions.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica wiki, Pax Autocratica base building, Pax Autocratica colony guide, Pax Autocratica Trade Port, Pax Autocratica ST-24, Pax Autocratica guide";
data.generated_at = checkedAt;

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-base-building-20260930",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-home-01.webp",
  alt: "Pax Autocratica colony management scene used for the base building guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 colony-management screenshot already present in the site media registry.",
  relevance_reason: "Shows the colony/base context for a page about production, hauling, Trade Port and base-building priorities.",
}, (item) => item.asset_id);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260930-base-building",
  intent_type: "current_base_building_priority_guide",
  user_job: "Decide whether base building is worth investing in and what current-build base systems to check first.",
  intent_evidence_ids: page.source_ids,
  answerability: "resolved_with_official_store_loop_plus_current_discussion_and_patch_boundaries",
  coverage: [
    {
      dimension: "official_base_loop",
      status: "covered",
      claim_ids: ["claim-base-building-official-loop-20260930"],
      evidence_relation: "steam_store_current",
      notes: "Store confirms colony jobs: mining, gathering, hauling, research, weapons, armor, food and supplies.",
    },
    {
      dimension: "current_player_demand",
      status: "covered",
      claim_ids: ["claim-base-building-current-demand-20260930"],
      evidence_relation: "current_steam_discussion",
      notes: discussionDescription,
    },
    {
      dimension: "patch_boundary",
      status: "covered",
      claim_ids: ["claim-base-building-st24-logistics-20260930"],
      evidence_relation: "official_news",
      notes: "ST-24 changes hauling, assignment, Warehouse flow, Trade Port goods and Victory Square slots.",
    },
    {
      dimension: "future_suggestion_boundary",
      status: "bounded",
      claim_ids: ["claim-base-building-feedback-boundary-20260930"],
      evidence_relation: "current_steam_discussion_reply",
      notes: "Multiverse says feedback was noted and sent to the team, not that suggestions are shipped.",
    },
  ],
  source_links: [
    { label: "Steam store", url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", source_type: "official_store" },
    { label: "Steam discussion: This game is amazing, when they have time to finish it WOW!", url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169956456/", source_type: "community" },
    { label: "Steam discussion: A few suggestions etc", url: "https://steamcommunity.com/app/1067360/discussions/0/586187334843645686/", source_type: "community_developer_reply" },
    { label: "Steam News: Directive ST-24", url: latestUrl, source_type: "official_community" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-base-building",
  boundaries: [
    "Does not claim a best base blueprint.",
    "Does not publish building unlock or production-value tables.",
    "Does not claim a shipped base-defense/turret mode.",
    "Does not promise co-op base sharing or a release schedule for future base content.",
  ],
  depth_variance_reason: "The page narrows the existing broad gameplay loop into a current-build base-building priority guide, using official colony-loop evidence plus fresh discussion and ST-24 logistics boundaries.",
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

- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/) (official platform)
- [Steam discussion: This game is amazing, when they have time to finish it WOW!](https://steamcommunity.com/app/1067360/discussions/0/564794139169956456/) (community)
- [Steam discussion: A few suggestions etc](https://steamcommunity.com/app/1067360/discussions/0/586187334843645686/) (community/developer reply)
- [Steam News: Directive ST-24](${latestUrl}) (official community announcement)

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

const findings = [
  {
    finding_id: "D00-run-lock-input",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P3",
    harm_text: "避免重复运行或把其他站点状态混进 Pax Autocratica。",
    evidence_refs: [`run_dir:${runDir}`, `latest_steam_gid:${latest.gid}`, `input_hash:${inputHash}`],
    recommended_action: "已锁定 2026-09-30 Pax Autocratica 运行目录、项目配置和来源输入。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把社区基地灵感写成官方机制，会误导玩家重建基地或期待未发布功能。",
    evidence_refs: [
      "steam_news:ST-24",
      "steam_store:base_loop",
      "discussion:This game is amazing, when they have time to finish it WOW!",
      "discussion:A few suggestions etc",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "将基地建设转成当前构建优先级页；崩溃、翻译、价格、基地防御、小战斗限制等重复意图不新增。",
    next_review_at: nextRunAt,
  },
  {
    finding_id: "D02-site-health",
    domain: "crawl_index",
    result_state: "PASS_PENDING_ONLINE_VERIFY",
    resolution_status: "RESOLVED_PENDING_VERIFY",
    severity: "P2",
    harm_text: "如果新页没有公开 200、canonical、sitemap 和内链，用户和搜索引擎可能看不到它。",
    evidence_refs: [`new_page:${pageUrl}`, "sitemap:public/sitemap.xml", "guide_group:Colony logistics and live settings"],
    recommended_action: "本地已接入 Guide、sitemap、媒体与相关页面；部署后验证正式路径。",
    next_review_at: "2026-09-30T10:30:00+08:00",
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
    harm_text: "如果重复发布崩溃、翻译、价格、Base Defence 或小战斗限制，会变成同意图薄页。",
    evidence_refs: [
      `candidate:selected:${slug}`,
      "held:pc-crashes-existing-performance",
      "held:translation-existing-language-patches",
      "held:price-existing-price-review",
      "held:base-defence-existing-auto-defense",
      "held:small-battle-existing-page",
      "held:suggestions-existing-supreme-powers-roadmap",
    ],
    recommended_action: "仅新增 Base Building Guide；其余话题更新或归档到现有意图边界。",
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
    next_review_at: "2026-09-30T10:30:00+08:00",
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
    next_review_at: "2026-09-30T10:30:00+08:00",
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
    next_review_at: "2026-09-30T10:30:00+08:00",
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
      "Official Steam store confirms colony jobs and base-building identity",
      "Current Steam discussion says base building / fortress preparation is a highlight",
      "Current suggestion thread received a Multiverse reply noting feedback was sent to the team",
      "Official ST-24 patch context changes hauling, assignment, Trade Port and Victory Square behavior",
    ],
    boundary: "No best blueprint, full unlock table, base-defense system, co-op base sharing, or future content schedule claimed.",
  },
  updated_existing_pages: [],
  held_candidates: [
    { slug: "pax-autocratica-pc-crashes", reason: "Existing Performance/ST-24 intent; no distinct crash-fix page without direct new resolution evidence." },
    { slug: "pax-autocratica-translations", reason: "Existing Language Patches intent; current thread is a suggestion about editable language files, not a shipped feature." },
    { slug: "pax-autocratica-price-value", reason: "Existing Price/Review intent and opinion-heavy discussion." },
    { slug: "pax-autocratica-base-defence", reason: "Existing Auto-Defense/base-defense boundary; do not duplicate." },
    { slug: "pax-autocratica-small-battle-soldier-limit", reason: "Already published 2026-09-29; no new official fix note today." },
    { slug: "pax-autocratica-suggestions-feedback", reason: "Suggestion thread maps to Supreme Powers/Roadmap context unless a dated feature ships." },
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
  input_hash: inputHash,
  source_capture_count: sourceFiles.length,
});
writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: report.latest_official,
  current_discussions: [
    { title: "This game is amazing, when they have time to finish it WOW!", url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169956456/", description: discussionDescription, base_reply: baseReply, design_chat_reply: designChatReply },
    { title: "A few suggestions etc", url: "https://steamcommunity.com/app/1067360/discussions/0/586187334843645686/", disposition: "feedback_boundary", reply: suggestionReply },
  ],
  discussion_index_excerpt_hash: sha256(discussionsIndexHtml.slice(0, 20000)),
  sources: sourceFiles.map((name) => ({ name, path: `sources/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-store-base-loop-20260930",
      disposition: "CREATE_CANDIDATE",
      reason: "Official store confirms the base-building/colony jobs needed for a focused base-building guide.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://store.steampowered.com/app/1067360/Pax_Autocratica/"],
    },
    {
      source_id: "src-steam-discussion-base-building-20260930",
      disposition: "CREATE_CANDIDATE",
      reason: "Current discussion provides player demand around investing in base building, fortress/town preparation and Trade Port inspiration.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/564794139169956456/"],
    },
    {
      source_id: "src-steam-discussion-suggestions-20260930",
      disposition: "DRAFT_RESEARCH",
      reason: "Multiverse acknowledges feedback, but suggestions are not shipped facts; use only as future-boundary evidence.",
      affected_routes: ["/pax-autocratica-supreme-powers-petition/", "/pax-autocratica-roadmap/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187334843645686/"],
    },
    {
      source_id: "src-other-discussions-20260930",
      disposition: "NO_ACTION_OR_HOLD",
      reason: "Crashes, translations, price/value, Base Defence and small-battle soldier limits map to existing pages or lack direct shipped-feature evidence.",
      affected_routes: ["/pax-autocratica-performance/", "/pax-autocratica-language-patches/", "/pax-autocratica-price/", "/pax-autocratica-auto-defense/", "/pax-autocratica-small-battle-soldier-limit/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "official_store_plus_current_discussion_plus_st24", duplicate_gate: "distinct_from_gameplay_overview_and_logistics_leaf_pages", content_gate: "actionable_base_priority_guide_not_blueprint_table" },
    ...report.held_candidates.map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica base building", parent_query: "Pax Autocratica guide", source_type: "steam_store_and_current_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169956456/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica colony guide", parent_query: "Pax Autocratica base building", source_type: "official_store", source_url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", depth: 1, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica fortress Trade Port", parent_query: "Pax Autocratica base building", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169956456/", depth: 2, status: "covered_as_inspiration_not_rules" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct base-building priority task with official current-game support and fresh community demand." }], updates: [], held: report.held_candidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica base building"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, evidence, duplicate, content and production gates." }, ...report.held_candidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated Guide colony logistics group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
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
  ...fs.readdirSync(artifactDir).filter((name) => fs.statSync(path.join(artifactDir, name)).isFile()).map((name) => `artifacts/${name}`),
];
fs.writeFileSync(path.join(runDir, "checksums.sha256"), `${checksumTargets.filter((file) => fs.existsSync(path.join(runDir, file))).map((file) => `${sha256File(path.join(runDir, file))}  ${file}`).join("\n")}\n`, "utf8");

console.log(JSON.stringify({ status: "generated", slug, runDir, latest: latest.title, sourceFiles: sourceFiles.length }, null, 2));
