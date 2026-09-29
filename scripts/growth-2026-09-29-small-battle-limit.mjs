import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runDate = "2026-09-29";
const checkedAt = "2026-09-29T09:05:15+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-small-battle-soldier-limit";
const pageUrl = `${baseUrl}/${slug}/`;
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "sources");
const artifactDir = path.join(runDir, "artifacts");
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", `${slug}.mdx`);
const autoDefenseContentPath = path.join(root, "content", "en", "pax-autocratica-auto-defense.mdx");

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

function readJson(filePath, fallback) {
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : fallback;
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

const news = readJson(path.join(sourceDir, "steam-news-api.json"), null);
if (!news?.appnews?.newsitems?.length) throw new Error("Missing Steam News API capture.");
const latest = news.appnews.newsitems[0];
if (!latest?.title?.includes("ST-24")) throw new Error(`Latest official Steam News is not ST-24: ${latest?.title || "missing"}`);

const smallBattleHtml = fs.readFileSync(path.join(sourceDir, "discussion-14.html"), "utf8");
const baseDefenseHtml = fs.readFileSync(path.join(sourceDir, "discussion-09.html"), "utf8");
const discussionIndexHtml = fs.readFileSync(path.join(sourceDir, "steam-discussions.html"), "utf8");
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => fs.statSync(path.join(sourceDir, name)).isFile());

const smallBattleDescription = metaContent(smallBattleHtml, "Description") || metaContent(smallBattleHtml, "og:description");
const hasSmallBattleAnswerEvidence = /its a bug, currently being worked on, we found it during EA testing\.|being worked on|EA testing/i.test(smallBattleHtml);
const smallBattleAnswer =
  stripHtml((smallBattleHtml.match(/<div[^>]*class="[^"]*forumtopic_answer answer_quote[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || [])[1] || "") ||
  (hasSmallBattleAnswerEvidence
    ? "its a bug, currently being worked on, we found it during EA testing."
    : "");
if (!/10\s+soilders|10\s+soldiers|small battle/i.test(smallBattleDescription)) {
  throw new Error("Small battle soldier-limit discussion capture does not contain the expected question.");
}
if (!hasSmallBattleAnswerEvidence) {
  throw new Error("Small battle soldier-limit capture does not contain the marked-answer bug boundary.");
}

const baseDefenseDescription = metaContent(baseDefenseHtml, "Description") || metaContent(baseDefenseHtml, "og:description");
const baseDefenseDeveloperReply = stripHtml((baseDefenseHtml.match(/Leader, this has been suggested many times[\s\S]*?All Hail The State!/i) || [])[0] || "");
if (!/defend the home Base|turrets/i.test(baseDefenseDescription) || !/not planned|taken under advisement/i.test(baseDefenseDeveloperReply)) {
  throw new Error("Base Defence discussion capture does not contain the expected developer boundary.");
}

const latestUrl = latest.url;
const latestDateIso = new Date(latest.date * 1000).toISOString();
const latestHash = sha256(latest.contents || "");
const inputHash = sha256(JSON.stringify({
  latest_gid: latest.gid,
  latest_hash: latestHash,
  small_battle_description: smallBattleDescription,
  small_battle_answer: smallBattleAnswer,
  base_defense_description: baseDefenseDescription,
  base_defense_reply: baseDefenseDeveloperReply,
}));

const page = {
  keyword: "Pax Autocratica Small Battle Soldier Limit",
  slug,
  seo: {
    title: "Pax Autocratica Small Battle Soldier Limit: 10 Soldiers Bug Check",
    description:
      "A source-backed Pax Autocratica guide for the current small-battle 10-soldier limit report, what the marked Steam answer says, and what not to assume before a patch note.",
  },
  direct_answer:
    "A current Steam discussion reports that after the latest large update, a small battle map only allows 10 soldiers. The thread is marked answered, and the marked answer says it is a bug that is being worked on after being found during Early Access testing. Treat that as a current bug-report boundary, not as an official permanent squad-size rule. There is no captured official patch note that publishes a universal small-battle soldier cap, a setting to bypass it, or a release date for the fix.",
  direct_answer_claim_ids: [
    "claim-small-battle-limit-demand-20260929",
    "claim-small-battle-limit-bug-boundary-20260929",
    "claim-small-battle-limit-official-boundary-20260929",
  ],
  sections: [
    {
      heading: "What changed for the player",
      paragraphs: [
        "The current discussion asks whether a post-update small battle map being limited to 10 soldiers is intended or a bug. That is a narrow but real player task: before changing your roster, you need to know whether you missed an option or whether the limit should be treated as a reported issue.",
        "The safest answer today is not to turn the number 10 into a permanent mechanics table. Use it as a current report tied to small battles after the update, then recheck official patch notes before writing new build advice around it.",
      ],
      steps: [
        "Record the battle type, sector, map size and exact squad count shown by the deployment UI.",
        "Check whether the limit appears only on small battle maps or across all expeditions.",
        "Do not delete or rebuild squads just because this specific report exists.",
      ],
      claim_ids: ["claim-small-battle-limit-demand-20260929"],
    },
    {
      heading: "What the marked answer supports",
      paragraphs: [
        "The Steam thread has an answer marker. The marked answer says the behavior is a bug, that it is currently being worked on, and that it was found during Early Access testing. That is useful triage evidence for players who are wondering whether they missed a hidden setting.",
        "It is still not the same as a shipped fix note. Until Multiverse publishes a patch note or the current build visibly changes, write this down as a reported small-battle limit bug rather than a resolved rule.",
      ],
      steps: [
        "Use the marked answer to avoid over-explaining the limit as a design choice.",
        "Keep a save or screenshot if you plan to report your own occurrence.",
        "Update your conclusion only after an official note or current-build test confirms the behavior changed.",
      ],
      claim_ids: ["claim-small-battle-limit-bug-boundary-20260929"],
    },
    {
      heading: "How ST-24 fits, and what it does not prove",
      paragraphs: [
        "Directive ST-24 is the latest official news captured today. It adds three new battles to Sector 1 - Elysia and includes several soldier, revive, capture, battle-scene and stability fixes. That makes it relevant background for a post-update battle-limit question.",
        "ST-24 does not publish a small-battle squad-size table, does not say that 10 soldiers is the intended cap for every small map, and does not state that this exact reported limit is already fixed. The official note is context, not a direct answer to the discussion.",
      ],
      steps: [
        "Read the latest official patch note before treating a community answer as final.",
        "Separate battle additions from deployment-limit rules.",
        "If a later directive mentions deployment slots, small battles or soldier caps, recheck this page first.",
      ],
      claim_ids: ["claim-small-battle-limit-official-boundary-20260929"],
    },
    {
      heading: "What to try before filing another report",
      paragraphs: [
        "If you see the same limit, avoid vague reports like 'soldiers broken.' The useful report names the map, the battle size, the deployment screen count, whether robots and medics were included, and whether other battle sizes behave differently.",
        "The existing pinned bug-reporting thread is still the safer path for detailed save/log reports. Public discussion can identify demand, but reproducible details are what help the developer separate a UI cap, a map-specific deployment limit, and a broader squad-selection bug.",
      ],
      steps: [
        "Restart the game and reload the same save once before reporting.",
        "Try one different battle size if available, then compare the deployment count.",
        "Attach the current build context and avoid claiming it affects every battle unless you tested that.",
      ],
      claim_ids: ["claim-small-battle-limit-bug-boundary-20260929"],
    },
    {
      heading: "What this page will not claim",
      paragraphs: [
        "This page does not claim the final intended soldier cap, a hidden option to bypass small-battle limits, a guaranteed fix date, a universal 10-soldier rule, a mod workaround, or that every deployment issue after ST-24 has the same cause.",
        "For choosing roles inside whatever squad size you can deploy, use the Combat Classes guide. For troop quality and capture/upgrades, use Best Troops. For crash or performance symptoms, use Performance instead of treating the soldier limit as a graphics issue.",
      ],
      steps: [
        "Treat 10 soldiers as a reported current symptom, not a complete rules table.",
        "Use official notes for shipped fixes.",
        "Keep this topic separate from class ranking and troop-quality decisions.",
      ],
      claim_ids: ["claim-small-battle-limit-official-boundary-20260929"],
    },
  ],
  faq: [
    {
      question: "Is the 10-soldier small battle limit intended?",
      answer:
        "The current marked Steam answer says it is a bug being worked on. No captured official patch note publishes 10 as the intended small-battle cap.",
      claim_ids: ["claim-small-battle-limit-bug-boundary-20260929"],
    },
    {
      question: "Can I bypass the limit with a setting?",
      answer:
        "No captured source confirms a setting that bypasses this reported small-battle limit. Recheck the deployment UI and current patch notes before assuming there is a hidden toggle.",
      claim_ids: ["claim-small-battle-limit-official-boundary-20260929"],
    },
    {
      question: "Did ST-24 fix this exact issue?",
      answer:
        "Not from the captured official note. ST-24 is relevant because it changed battles and soldiers, but it does not directly name the small-battle 10-soldier limit.",
      claim_ids: ["claim-small-battle-limit-official-boundary-20260929"],
    },
    {
      question: "Should I change my combat class plan because of this?",
      answer:
        "Only for the affected run. If a small battle currently limits your squad, prioritize role coverage inside that limit; do not treat it as a permanent meta rule.",
      claim_ids: ["claim-small-battle-limit-demand-20260929"],
    },
  ],
  source_ids: [
    "src-steam-discussion-small-battle-limit-20260929",
    "src-steam-news-st24-20260929",
    "src-steam-discussions-index-20260929",
    "src-steam-store-20260929",
  ],
  claim_ids: [
    "claim-small-battle-limit-demand-20260929",
    "claim-small-battle-limit-bug-boundary-20260929",
    "claim-small-battle-limit-official-boundary-20260929",
  ],
  updated_at: checkedAt,
  time_sensitivity: "early_access_bug_report",
  page_status: "publish",
  index_status: "index",
  parent_category: "Guide",
  related_slugs: [
    "pax-autocratica-combat-classes",
    "pax-autocratica-best-troops",
    "pax-autocratica-sector-1-elysia-battles",
    "pax-autocratica-st24-patch-notes",
    "pax-autocratica-performance",
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

const autoDefense = data.pages.find((candidate) => candidate.slug === "pax-autocratica-auto-defense");
if (autoDefense) {
  autoDefense.updated_at = checkedAt;
  autoDefense.direct_answer =
    "Pax Autocratica has official references to an Auto-Defense affix and to combat turrets, but a current Steam base-defense request received a developer/community-manager boundary: home-base defense with bugs and turrets has been suggested many times, is not currently planned, and has been taken under advisement. Treat Auto-Defense as a combat/affix term unless a current official patch note or in-game system directly says colony raids, base-defense mode, or player-built base turrets are available.";
  autoDefense.source_ids ||= [];
  uniquePush(autoDefense.source_ids, "src-steam-discussion-base-defence-20260929");
  autoDefense.claim_ids ||= [];
  uniquePush(autoDefense.claim_ids, "claim-base-defense-not-planned-20260929");
  const alreadyHasUpdate = autoDefense.sections?.some((section) => section.heading === "2026 base-defense request update");
  if (!alreadyHasUpdate) {
    autoDefense.sections.splice(1, 0, {
      heading: "2026 base-defense request update",
      paragraphs: [
        "A current Steam discussion asks for defending the home base from bugs with turrets. Gurttron replies that this has been suggested many times, is currently not planned, and has been taken under advisement.",
        "That direct boundary strengthens the earlier evidence rule: do not turn Auto-Defense, enemy turrets or Missile Tower wording into a claim that a playable base-defense/tower-defense layer exists today.",
      ],
      steps: [
        "Use the request as demand evidence, not as feature evidence.",
        "Do not publish turret recipes, raid strategy or base-defense build orders until the game ships that system.",
        "Recheck future patch notes for direct base-defense wording before changing this answer.",
      ],
      claim_ids: ["claim-base-defense-not-planned-20260929"],
    });
  }
}

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const combatGroup = guide.groups.find((group) => group.title === "Expeditions and squad combat");
  if (combatGroup && !combatGroup.slugs.includes(slug)) {
    const index = combatGroup.slugs.indexOf("pax-autocratica-combat-classes");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

data.home.hero.stats = data.home.hero.stats.map((value) => value.startsWith("Updated ") ? `Updated ${runDate}` : value);
data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to small battle soldier limits, combat classes, ST-24 Sector 1 Elysia battles, patch changes, logistics, revive behavior, performance, Auto-Defense and Early Access questions.";
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica wiki, Pax Autocratica small battle soldier limit, Pax Autocratica 10 soldiers, Pax Autocratica combat classes, Pax Autocratica ST-24, Pax Autocratica guide";
data.generated_at = checkedAt;

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-small-battle-soldier-limit-20260929",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-best-troops-12.webp",
  alt: "Pax Autocratica combat screenshot used for the small battle soldier limit guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 combat screenshot already present in the site media registry.",
  relevance_reason: "Shows expedition combat context for a page about squad deployment limits without inventing bug-specific art.",
}, (item) => item.asset_id);

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260929-small-battle-soldier-limit",
  intent_type: "current_discussion_bug_triage_plus_official_patch_boundary",
  user_job: "Decide whether the current small-battle 10-soldier deployment limit is intended, a missed setting, or a reported bug.",
  intent_evidence_ids: page.source_ids,
  answerability: "resolved_with_marked_answer_and_patch_boundary",
  coverage: [
    {
      dimension: "player_demand",
      status: "covered",
      claim_ids: ["claim-small-battle-limit-demand-20260929"],
      evidence_relation: "steam_discussion_current",
      notes: smallBattleDescription,
    },
    {
      dimension: "bug_boundary",
      status: "covered",
      claim_ids: ["claim-small-battle-limit-bug-boundary-20260929"],
      evidence_relation: "steam_marked_answer",
      notes: smallBattleAnswer,
    },
    {
      dimension: "official_patch_boundary",
      status: "bounded",
      claim_ids: ["claim-small-battle-limit-official-boundary-20260929"],
      evidence_relation: "official_news_omission",
      notes: "ST-24 adds battles and soldier/combat changes but does not publish a small-battle squad-size table or this exact fix.",
    },
  ],
  source_links: [
    { label: "Steam discussion: Is this intended or an Bug?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759926451/", source_type: "community" },
    { label: "Steam News: Directive ST-24", url: latestUrl, source_type: "official_community" },
    { label: "Steam discussions index", url: "https://steamcommunity.com/app/1067360/discussions/", source_type: "community" },
    { label: "Steam store", url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/", source_type: "official_store" },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-small-battle-soldier-limit",
  boundaries: [
    "Does not claim the final intended soldier cap.",
    "Does not claim a hidden bypass setting.",
    "Does not claim ST-24 fixed this exact report.",
    "Does not treat a marked community answer as a full official patch note.",
  ],
};

if (data.pageProvenance["pax-autocratica-auto-defense"]) {
  data.pageProvenance["pax-autocratica-auto-defense"].last_checked_at = checkedAt;
  data.pageProvenance["pax-autocratica-auto-defense"].source_links ||= [];
  uniquePush(
    data.pageProvenance["pax-autocratica-auto-defense"].source_links,
    { label: "Steam discussion: Base Defence?!", url: "https://steamcommunity.com/app/1067360/discussions/0/586187334843630783/", source_type: "community" },
    (item) => item.url,
  );
  data.pageProvenance["pax-autocratica-auto-defense"].boundaries ||= [];
  uniquePush(data.pageProvenance["pax-autocratica-auto-defense"].boundaries, "2026-09-29 discussion says base defense with turrets is currently not planned and only taken under advisement.");
}

const pageMarkdown = `# ${page.keyword}

${page.direct_answer}

${page.sections.map((section) => `## ${section.heading}

${section.paragraphs.join("\n\n")}

${section.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`).join("\n\n")}

## FAQ

${page.faq.map((item) => `### ${item.question}

${item.answer}`).join("\n\n")}

## Sources

- [Steam discussion: Is this intended or an Bug?](https://steamcommunity.com/app/1067360/discussions/0/586187095759926451/)
- [Steam News: Directive ST-24](${latestUrl})
- [Steam discussions index](https://steamcommunity.com/app/1067360/discussions/)
- [Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, pageMarkdown, "utf8");

const autoDefenseMarkdown = `# Pax Autocratica Auto-Defense

${autoDefense.direct_answer}

${autoDefense.sections.map((section) => `## ${section.heading}

${section.paragraphs.join("\n\n")}

${section.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`).join("\n\n")}

## FAQ

${autoDefense.faq.map((item) => `### ${item.question}

${item.answer}`).join("\n\n")}

## Sources

- [Steam discussion: Base Defence?!](https://steamcommunity.com/app/1067360/discussions/0/586187334843630783/)
- [Steam community home](https://steamcommunity.com/app/1067360)
- [Steam News API: Pax Autocratica announcements](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json)
- [Steam appdetails API](https://store.steampowered.com/api/appdetails?appids=1067360&filters=basic,genres,categories,release_date,platforms)
- [Official Pax Autocratica site](https://www.paxautocratica.com/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(autoDefenseContentPath, autoDefenseMarkdown, "utf8");

const sitemapUrls = [
  { loc: `${baseUrl}/`, lastmod: runDate },
  { loc: `${baseUrl}/guide/`, lastmod: runDate },
  ...data.pages
    .filter((item) => item.page_status === "publish" && item.index_status === "index")
    .map((item) => ({ loc: `${baseUrl}/${item.slug}/`, lastmod: item.slug === slug || item.slug === "pax-autocratica-auto-defense" ? runDate : String(item.updated_at || "").slice(0, 10) || runDate })),
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
    recommended_action: "已锁定 2026-09-29 Pax Autocratica 运行目录、项目配置和来源输入。",
    next_review_at: "2026-09-30T09:00:00+08:00",
  },
  {
    finding_id: "D01-source-watch",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果把当前讨论直接写成永久规则，会误导玩家重配队伍或误报 Bug。",
    evidence_refs: [
      "discussion:Is this intended or an Bug?",
      "discussion:Base Defence?!",
      "steam_news:ST-24",
      ...sourceFiles.map((name) => `capture:${name}`),
    ],
    recommended_action: "将 10 士兵小型战斗限制转成独立 Bug 边界页；Base Defence 只更新现有 Auto-Defense 页。",
    next_review_at: "2026-09-30T09:00:00+08:00",
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
    next_review_at: "2026-09-29T10:30:00+08:00",
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
    next_review_at: "2026-09-30T09:00:00+08:00",
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
    next_review_at: "2026-09-30T09:00:00+08:00",
  },
  {
    finding_id: "D05-D08-candidate-gates",
    domain: "content_supply",
    result_state: "PASS",
    resolution_status: "RESOLVED",
    severity: "P2",
    harm_text: "如果重复发布 Base Defence、价格争议或翻译请求，会变成同意图薄页。",
    evidence_refs: [
      `candidate:selected:${slug}`,
      "candidate:update-existing:pax-autocratica-auto-defense",
      "held:price-review-existing-intent",
      "held:translations-existing-language",
      "held:final-boss-existing-sector-3",
      "held:memory-leak-existing-performance",
      "held:female-body-model-roadmap-request",
    ],
    recommended_action: "仅新增 Small Battle Soldier Limit；Base Defence 归入 Auto-Defense，其他话题继续等待直接证据。",
    next_review_at: "2026-09-30T09:00:00+08:00",
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
      "content:content/en/pax-autocratica-auto-defense.mdx",
      "site-data:public/site-data.json",
      "sitemap:public/sitemap.xml",
    ],
    recommended_action: "已新增一个 index L2 页，并用直接讨论证据更新 Auto-Defense 的 base-defense 边界。",
    next_review_at: "2026-09-29T10:30:00+08:00",
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
    next_review_at: "2026-09-29T10:30:00+08:00",
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
    next_review_at: "2026-09-30T09:00:00+08:00",
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
    next_review_at: "2026-09-29T10:30:00+08:00",
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
      "Steam discussion: Is this intended or an Bug?",
      "Marked answer says the small-battle 10-soldier behavior is a bug being worked on",
      "Official ST-24 patch context for post-update battles and soldiers",
    ],
    boundary: "No final cap, bypass setting, universal 10-soldier rule, or fix date claimed.",
  },
  updated_existing_pages: [
    {
      slug: "pax-autocratica-auto-defense",
      reason: "Current Base Defence discussion received a not-currently-planned/taken-under-advisement boundary.",
    },
  ],
  held_candidates: [
    { slug: "pax-autocratica-base-defence", reason: "Existing Auto-Defense/base-defense intent; direct new reply was used to update that page instead of duplicating it." },
    { slug: "pax-autocratica-final-boss-fight", reason: "Existing Sector 3 final boss intent; no new official answer captured." },
    { slug: "pax-autocratica-memory-leak", reason: "Existing Performance page intent; no direct developer resolution captured today." },
    { slug: "pax-autocratica-price-value", reason: "Existing Price/Review intent and opinion-heavy discussion." },
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
  input_hash: inputHash,
  source_capture_count: sourceFiles.length,
});
writeJson("source-watch.json", {
  schema_version: 1,
  captured_at: checkedAt,
  latest_official: report.latest_official,
  current_discussions: [
    { title: "Is this intended or an Bug?", url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759926451/", description: smallBattleDescription, marked_answer: smallBattleAnswer },
    { title: "Base Defence?!", url: "https://steamcommunity.com/app/1067360/discussions/0/586187334843630783/", description: baseDefenseDescription, developer_reply: baseDefenseDeveloperReply },
  ],
  discussion_index_excerpt_hash: sha256(discussionIndexHtml.slice(0, 20000)),
  sources: sourceFiles.map((name) => ({ name, path: `sources/${name}`, sha256: sha256File(path.join(sourceDir, name)) })),
});
writeJson("source-content-actions.json", {
  schema_version: 1,
  captured_at: checkedAt,
  actions: [
    {
      source_id: "src-steam-discussion-small-battle-limit-20260929",
      disposition: "CREATE_CANDIDATE",
      reason: "Current answered discussion gives a distinct player task around small-battle deployment limits after the update.",
      affected_routes: [`/${slug}/`],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187095759926451/"],
    },
    {
      source_id: "src-steam-discussion-base-defence-20260929",
      disposition: "UPDATE_EXISTING",
      reason: "Current reply directly changes the evidence boundary for the existing Auto-Defense/base-defense page.",
      affected_routes: ["/pax-autocratica-auto-defense/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/0/586187334843630783/"],
    },
    {
      source_id: "src-other-discussions-20260929",
      disposition: "NO_ACTION_OR_HOLD",
      reason: "Final boss, memory leak, price, translations and female-model topics were duplicate, opinion-heavy or lacked implementation evidence.",
      affected_routes: ["/pax-autocratica-sector-3-final-boss/", "/pax-autocratica-performance/", "/pax-autocratica-price/", "/pax-autocratica-language-patches/"],
      evidence_urls: ["https://steamcommunity.com/app/1067360/discussions/"],
    },
  ],
});
writeJson("opportunity-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { slug, keyword: page.keyword, status: "PASS", evidence_gate: "current_steam_thread_plus_official_patch_context", duplicate_gate: "distinct_from_combat_classes_and_best_troops", content_gate: "bug_boundary_not_permanent_rule" },
    { slug: "pax-autocratica-base-defence", status: "UPDATE_EXISTING", reason: "Same Auto-Defense/base-defense intent; update existing page." },
    ...report.held_candidates.filter((item) => item.slug !== "pax-autocratica-base-defence").map((item) => ({ slug: item.slug, status: "HOLD", reason: item.reason })),
  ],
});
writeJson("derivative-keyword-candidates.json", {
  schema_version: 1,
  captured_at: checkedAt,
  candidates: [
    { keyword: "Pax Autocratica small battle soldier limit", parent_query: "Pax Autocratica soldiers", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759926451/", depth: 1, status: "selected" },
    { keyword: "Pax Autocratica 10 soldiers", parent_query: "Pax Autocratica small battle", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187095759926451/", depth: 2, status: "covered_in_selected_page" },
    { keyword: "Pax Autocratica base defence turrets", parent_query: "Pax Autocratica auto defense", source_type: "steam_discussion", source_url: "https://steamcommunity.com/app/1067360/discussions/0/586187334843630783/", depth: 1, status: "update_existing_auto_defense" },
  ],
});
writeJson("opportunity-shortlist.json", { schema_version: 1, selected: [{ slug, keyword: page.keyword, priority: 1, reason: "Distinct bug-triage task with current answered discussion and official patch boundary." }], updates: report.updated_existing_pages, held: report.held_candidates });
writeJson("webcafe-plan.json", { schema_version: 1, status: "DEFERRED_NO_AUTHENTICATED_EXPORT", reason: "No authenticated Web.Cafe export/API evidence was available; no forced query was attempted.", planned_queries: ["Pax Autocratica small battle soldier limit"] });
writeJson("webcafe-results.json", { schema_version: 1, status: "unavailable_no_authenticated_export" });
writeJson("page-decisions.json", { schema_version: 1, decisions: [{ slug, decision: "CREATE_L2_DETAIL", reason: "Passes distinct intent, evidence, duplicate, content and production gates." }, { slug: "pax-autocratica-auto-defense", decision: "UPDATE_EXISTING", reason: "New direct base-defense boundary evidence." }, ...report.held_candidates.map((item) => ({ slug: item.slug, decision: "HOLD", reason: item.reason }))] });
writeJson("change-manifest.json", { schema_version: 1, content_changes: [`Added /${slug}/`, "Updated /pax-autocratica-auto-defense/ base-defense boundary", "Updated Guide group, source provenance, media registry, related links, home metadata and sitemap"], site_changes: [], no_change_site_reason: report.no_change_site_reason });
writeJson("site-health.json", { schema_version: 1, status: "PENDING_ONLINE_VERIFY", checked_at: checkedAt, checked_paths: ["/", `/${slug}/`, "/pax-autocratica-auto-defense/", "/guide/", "/sitemap.xml", "/robots.txt"], no_change_site_reason: report.no_change_site_reason });
writeJson("search-performance.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated GSC export/connector was available." });
writeJson("measurement-health.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated analytics/measurement export was available; no tracking change made." });
writeJson("external-benchmark.json", { schema_version: 1, similarweb: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", web_cafe: "UNKNOWN_DEFERRED_NO_AUTHENTICATED_EXPORT", aitdk: "UNKNOWN_DEFERRED_NO_BROWSER_EXPORT" });
writeJson("aitdk-compatibility.json", { schema_version: 1, status: "UNKNOWN", features: [{ feature_id: "page_meta", status: "OWN_RULES" }, { feature_id: "traffic_estimate", status: "EXTERNAL_ESTIMATE_ONLY" }, { feature_id: "pagespeed", status: "UNKNOWN" }] });
writeJson("revenue-metrics.json", { schema_version: 1, status: "UNKNOWN_DEFERRED", reason: "No authenticated ad revenue export was available; no ad placement change made." });
writeJson("health-findings.raw.jsonl", findings.map((finding) => JSON.stringify(finding)).join("\n") + "\n");
writeJson("daily-report.json", report);

const rows = findings.map((finding) => `<tr><td>${escapeHtml(finding.result_state)}</td><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.domain)}</td><td>${escapeHtml(finding.finding_id)}</td><td>${escapeHtml(finding.harm_text)}</td><td><details><summary>Evidence</summary>${escapeHtml(finding.evidence_refs.join(" | "))}</details><code>${escapeHtml(finding.finding_hash)}</code></td><td>${escapeHtml(finding.recommended_action)}</td><td>${escapeHtml(finding.resolution_status)}<br>${escapeHtml(finding.next_review_at)}</td></tr>`).join("\n");
const reportHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pax Autocratica 每日增长 ${runDate}</title><style>body{margin:0;background:#f6f8fb;color:#172033;font:14px/1.5 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}main{max-width:1600px;margin:auto;padding:24px}.summary,.table-wrap{background:#fff;border:1px solid #d9e0ea;border-radius:12px;padding:16px;margin-bottom:16px}h1{margin:0 0 6px}table{width:100%;border-collapse:collapse;min-width:1100px}caption{text-align:left;font-weight:700;padding:12px}th,td{border-top:1px solid #d9e0ea;padding:10px 12px;text-align:left;vertical-align:top}th{background:#eef3f9}.table-wrap{overflow:auto}.metric{font-weight:700}code{display:block;margin-top:6px;color:#5b6575;word-break:break-all}</style></head><body><main><h1>Pax Autocratica 每日增长体检</h1><div class="summary"><p class="metric">运行状态：${escapeHtml(report.run_status)} · 新 index 页：1 · 外部发布：0</p><p>新增页面：<a href="${pageUrl}">${pageUrl}</a></p><p>更新旧页：<a href="${baseUrl}/pax-autocratica-auto-defense/">${baseUrl}/pax-autocratica-auto-defense/</a></p><p>最新官方证据：<a href="${latestUrl}">${escapeHtml(latest.title)}</a></p></div><div class="table-wrap"><table id="health-findings"><caption>所有体检结果、实际危害、证据、整改动作与解决状态</caption><thead><tr><th scope="col">结果</th><th scope="col">风险</th><th scope="col">体检域</th><th scope="col">对象</th><th scope="col">不处理的危害</th><th scope="col">证据与哈希</th><th scope="col">动作/负责人</th><th scope="col">解决状态/下次复核</th></tr></thead><tbody>${rows}</tbody></table></div></main></body></html>\n`;
fs.writeFileSync(path.join(runDir, "daily-report.html"), reportHtml, "utf8");

const reportMd = `# Pax Autocratica 每日增长报告 - ${runDate}

状态：${report.run_status}

新增 index 页：${pageUrl}

更新旧页：${baseUrl}/pax-autocratica-auto-defense/

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
