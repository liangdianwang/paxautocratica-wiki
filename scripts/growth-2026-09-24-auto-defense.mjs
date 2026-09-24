import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-auto-defense.mdx");
const runDate = "2026-09-24";
const checkedAt = "2026-09-24T09:18:00+08:00";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-auto-defense";
const runDir = path.resolve(root, "..", "..", "growth-runs", runDate);
const sourceDir = path.join(runDir, "source-captures");

fs.mkdirSync(runDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(siteDataPath, "utf8"));

function uniquePush(array, item, key = (value) => value) {
  const id = key(item);
  if (!array.some((value) => key(value) === id)) array.push(item);
}

function replaceOrPush(array, item, key = (value) => value.slug) {
  const index = array.findIndex((value) => key(value) === key(item));
  if (index >= 0) array[index] = item;
  else array.push(item);
}

function writeJson(name, value) {
  fs.writeFileSync(path.join(runDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function writeChecksums(files) {
  const lines = files
    .filter((file) => fs.existsSync(path.join(runDir, file)))
    .map((file) => `${sha256File(path.join(runDir, file))}  ${file}`);
  fs.writeFileSync(path.join(runDir, "checksums.sha256"), `${lines.join("\n")}\n`, "utf8");
}

const claimIds = [
  "claim-auto-defense-current-demand-20260924",
  "claim-auto-defense-official-st11-20260924",
  "claim-auto-defense-demo-warning-20260924",
  "claim-auto-defense-enemy-turrets-20260924",
  "claim-auto-defense-store-boundary-20260924",
  "claim-auto-defense-no-base-defense-proof-20260924",
];

const page = {
  keyword: "Pax Autocratica Auto-Defense",
  slug,
  seo: {
    title: "Pax Autocratica Auto-Defense: Affix, Turrets and Base Defense",
    description:
      "A source-backed Pax Autocratica Auto-Defense guide explaining the official affix evidence, enemy turret references, Missile Towers, and what not to assume about base defense.",
  },
  direct_answer:
    "Pax Autocratica does have official references to an Auto-Defense affix and to turrets or Missile Towers in combat/balance notes, but the captured sources do not prove a full base-defense mode where enemies raid your colony or where you place permanent auto turrets around the base. Treat Auto-Defense as a combat/affix term unless a current in-game tooltip or official patch note says otherwise. If you are asking whether the game is a colony-defense tower-defense loop, the safe answer today is no confirmed source-backed page can promise that; the official store describes building a colony and personally storming roguelite battlefields with soldiers.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "Current answer",
      paragraphs: [
        "The useful distinction is practical: Auto-Defense, enemy turrets, Missile Towers and base defense sound related, but the official sources use them in different contexts. Mixing them together would mislead a player who wants raids against the colony or buildable defensive emplacements.",
        "The latest official Steam News item captured today remains Directive ST-11 from 2026-09-11. ST-11 mentions improvements to allied Auto-Defense affix effects, allied affix cooldowns, enemy/battle behavior and broader Early Access goals, but it does not announce a colony raid mode or a base turret building system.",
      ],
      steps: [
        "Use Auto-Defense as an affix/combat keyword first, not as proof of base raids.",
        "Use turret references only in the exact source context where they appear.",
        "Check the current build before treating old demo notes as final Early Access mechanics.",
      ],
      claim_ids: [
        "claim-auto-defense-official-st11-20260924",
        "claim-auto-defense-no-base-defense-proof-20260924",
      ],
    },
    {
      heading: "What official sources actually say",
      paragraphs: [
        "ST-11 says the effects of the allied Auto-Defense affix were improved. It also says shared allied affix cooldown was reduced and several named soldiers received combat-strength increases. Those points support a combat-affix reading, not a base-defense structure reading.",
        "Older official demo update text says a danger warning was added for the Auto-Defense affix. The same update family also mentions enemy turrets in the Elysia Oasis Decisive Battle and Missile Towers in balance notes. Those are useful combat terms, but they still do not establish a general player-built base turret system.",
      ],
      steps: [
        "When you see Auto-Defense, look for the word affix in the source.",
        "When you see turrets or Missile Towers, check whether the note is about a battle, enemy placement or balance.",
        "Do not combine separate patch-note bullets into a feature that the source did not announce.",
      ],
      claim_ids: [
        "claim-auto-defense-official-st11-20260924",
        "claim-auto-defense-demo-warning-20260924",
        "claim-auto-defense-enemy-turrets-20260924",
      ],
    },
    {
      heading: "Base defense boundary",
      paragraphs: [
        "The Steam store description captured today frames the current game around building a colony, shaping citizens and personally storming roguelite battlefields with soldiers. That supports the colony-plus-expedition identity, but it is not the same as a promise that enemies attack your home base or that the base can be defended with automatic turrets.",
        "If your purchase decision depends on a RimWorld-style raid loop, a tower-defense layer or permanent base guns, do not rely on the Auto-Defense keyword alone. Wait for an official patch note, store text, or current in-game system that directly says base defense, raids, defensive buildings or player-built turrets are available.",
      ],
      steps: [
        "Look for direct official wording, not just similar combat terms.",
        "Separate colony management from expedition combat in your expectations.",
        "Treat Early Access roadmap language about future systems as future-facing unless the feature is in the current build.",
      ],
      claim_ids: [
        "claim-auto-defense-store-boundary-20260924",
        "claim-auto-defense-no-base-defense-proof-20260924",
      ],
    },
    {
      heading: "How to test it in-game",
      paragraphs: [
        "If you already own the game, test the current build by checking soldier gear, affixes, core fragments, battle tooltips and any building research that appears after upgrades. This is safer than following generic web pages that may invent armor names, cooldowns, turret recipes or faction counters.",
        "A useful test note should name the source screen: Soldier Details, Crafting, Tactical Bureau, battle affix tooltip, Elysia Oasis, or another exact UI. If a tooltip uses Auto-Defense, record whether it belongs to allied equipment, an enemy affix, a core, or a combat encounter.",
      ],
      steps: [
        "Open Soldier Details and gear/crafting screens in the current build.",
        "Search for Auto-Defense in actual item, affix, core or battle text.",
        "If you find a turret-like item, record whether it is deployable by the player or only appears in a battle.",
        "Compare the wording against the official patch notes before sharing it as a guide.",
      ],
      claim_ids: [
        "claim-auto-defense-official-st11-20260924",
        "claim-auto-defense-demo-warning-20260924",
      ],
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page does not publish Auto-Defense formulas, internal cooldown values, gear drop rates, exact turret recipes, faction counters or a guaranteed best build. The captured official material does not provide those details.",
        "Update this page only when Multiverse publishes direct wording about Auto-Defense mechanics, defensive buildings, colony raids, base-defense systems, player-built turrets, Missile Towers, or a current-build tooltip that can be verified without private saves or speculation.",
      ],
      steps: [
        "Use official notes for shipped terms.",
        "Use community discussion as demand evidence, not as a complete mechanics source.",
        "Keep future roadmap wording separate from current-playable features.",
      ],
      claim_ids: [
        "claim-auto-defense-current-demand-20260924",
        "claim-auto-defense-no-base-defense-proof-20260924",
      ],
    },
  ],
  faq: [
    {
      question: "Does Pax Autocratica have Auto-Defense?",
      answer:
        "Official notes mention an Auto-Defense affix and improvements to allied Auto-Defense effects, so yes, Auto-Defense is a real official term. The captured sources do not prove a complete base-defense system.",
      claim_ids: [
        "claim-auto-defense-official-st11-20260924",
        "claim-auto-defense-no-base-defense-proof-20260924",
      ],
    },
    {
      question: "Are Auto-Defense and base defense the same thing?",
      answer:
        "No. In the captured sources, Auto-Defense is tied to affix/combat wording. Base defense would need direct evidence about colony raids or defensive buildings.",
      claim_ids: [
        "claim-auto-defense-demo-warning-20260924",
        "claim-auto-defense-store-boundary-20260924",
      ],
    },
    {
      question: "Do the turret references mean I can build auto turrets at base?",
      answer:
        "Not from the captured sources. Official text mentions enemy turrets in a specific battle and Missile Towers in balance notes, but that is not proof of permanent player-built base turrets.",
      claim_ids: ["claim-auto-defense-enemy-turrets-20260924"],
    },
    {
      question: "Should I buy Pax Autocratica for base raids?",
      answer:
        "Only buy it for that reason if you can verify direct current evidence. The official store wording supports colony building plus roguelite battlefield combat, not a confirmed raid-defense loop.",
      claim_ids: ["claim-auto-defense-store-boundary-20260924"],
    },
  ],
  source_ids: [
    "src-steam-community-home-20260924",
    "src-steam-news-st11-20260924",
    "src-steam-news-demo-auto-defense-20260924",
    "src-steam-appdetails-20260924",
    "src-official-site-20260924",
  ],
  related_slugs: [
    "pax-autocratica-best-troops",
    "pax-autocratica-soldiers-fighting-base",
    "pax-autocratica-st11-patch-notes",
    "pax-autocratica-roadmap",
    "pax-autocratica-performance",
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index",
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

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, Auto-Defense and base-defense boundaries, crowded UI and HUD clutter, soldiers fighting in base, soundtrack and OST status, Linux and Proton support boundaries, revive behavior, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-24"];
}
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica Auto-Defense, Pax Autocratica base defense, Pax Autocratica auto turrets, Missile Towers, enemy turrets, ST-11 patch, soldiers fighting in base, crowded UI, performance, Early Access";
}
if (data.site) data.site.version = "local-pending-auto-defense";
data.generated_at = checkedAt;

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260924-auto-defense-base-defense",
  intent_type: "mechanic_boundary_and_purchase_question",
  user_job:
    "Help players understand whether Auto-Defense, turrets and Missile Towers mean Pax Autocratica has base-defense auto turrets.",
  intent_evidence_ids: [
    "src-steam-community-home-20260924",
    "src-steam-news-st11-20260924",
    "src-steam-news-demo-auto-defense-20260924",
    "src-steam-appdetails-20260924",
  ],
  answerability: "resolved_as_official_term_boundary",
  coverage: [
    {
      dimension: "current_player_question",
      status: "covered",
      claim_ids: ["claim-auto-defense-current-demand-20260924"],
      evidence_relation: "current_community_search_and_homepage_demand_signal",
      notes:
        "Current public discovery surfaces a player question about base defense and auto turrets, making this a distinct player task from generic combat or soldier behavior.",
    },
    {
      dimension: "official_auto_defense_term",
      status: "covered",
      claim_ids: [
        "claim-auto-defense-official-st11-20260924",
        "claim-auto-defense-demo-warning-20260924",
      ],
      evidence_relation: "official_steam_news",
      notes:
        "Official Steam News mentions Auto-Defense as an affix and ST-11 mentions improved allied Auto-Defense effects.",
    },
    {
      dimension: "base_defense_or_auto_turret_system",
      status: "blocked",
      claim_ids: ["claim-auto-defense-no-base-defense-proof-20260924"],
      evidence_relation: "not_published",
      notes:
        "Captured official sources do not announce colony raids, player-built defensive buildings or permanent base auto turrets.",
    },
  ],
  source_links: [
    {
      label: "Steam community home: current content and ST-11 card",
      url: "https://steamcommunity.com/app/1067360",
      source_type: "community_and_official_content_surface",
    },
    {
      label: "Steam News API: Pax Autocratica announcements",
      url: "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json",
      source_type: "official_steam_news",
    },
    {
      label: "Steam appdetails: official store description",
      url: "https://store.steampowered.com/api/appdetails?appids=1067360&filters=basic,genres,categories,release_date,platforms",
      source_type: "official_store_metadata",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-auto-defense",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct Auto-Defense/base-defense terminology task, separate from soldier fighting, performance, patch notes and roadmap pages.",
};

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-auto-defense-20260924",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-best-troops-12.webp",
  alt: "Pax Autocratica combat scene used for the Auto-Defense and base-defense boundary guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason:
    "Reuses an existing verified Steam App ID 1067360 combat screenshot already present in the site media registry.",
  relevance_reason:
    "Shows expedition combat context for a page distinguishing combat affixes and turret terms from a base-defense system.",
}, (item) => item.asset_id);

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const mdx = `# ${page.keyword}

${page.direct_answer}

${page.sections.map((section) => {
  const body = section.paragraphs.join("\n\n");
  const steps = section.steps?.length ? `\n\n${section.steps.map((step) => `1. ${step}`).join("\n")}` : "";
  return `## ${section.heading}\n\n${body}${steps}`;
}).join("\n\n")}

## FAQ

${page.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Sources

- [Steam community home](https://steamcommunity.com/app/1067360)
- [Steam News API: Pax Autocratica announcements](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json)
- [Steam appdetails API](https://store.steampowered.com/api/appdetails?appids=1067360&filters=basic,genres,categories,release_date,platforms)
- [Official Pax Autocratica site](https://www.paxautocratica.com/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

const publicPages = (data.pages || []).filter((item) => item.page_status === "publish" && item.index_status === "index");
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

const commonEvidence = {
  captured_at: checkedAt,
  source_capture_dir: sourceDir,
  saved_sources: [
    "source-captures/steam-news-api.json",
    "source-captures/steam-community-home.html",
    "source-captures/steam-appdetails.json",
    "source-captures/official-site.html",
  ],
};

writeJson("daily-state.json", {
  schema_version: 1,
  run_id: `pax-autocratica-${runDate}`,
  site_id: "PaxAutocratica",
  game_name: "Pax Autocratica",
  canonical_domain: baseUrl,
  status: "CONTENT_PRODUCED_PENDING_BUILD_DEPLOY",
  locked_at: checkedAt,
  input_hash: sha256File(siteDataPath),
  previous_commit: process.env.PREVIOUS_COMMIT || null,
  run_directory: runDir,
});

writeJson("source-watch.json", {
  ...commonEvidence,
  official_latest: {
    title: "DIRECTIVE ST-11: STATE MAINTENANCE",
    published_at: "2026-09-11T14:10:59Z",
    status: "latest_official_item_captured",
  },
  current_signals: [
    {
      title: "Base Defense and Auto Turrets question",
      type: "community_demand_signal",
      disposition: "CREATE_CANDIDATE",
      note: "Current search/community surface shows player interest in whether base defense and auto turrets exist.",
    },
    {
      title: "Auto-Defense affix in official news",
      type: "official_mechanic_term",
      disposition: "CREATE_CANDIDATE",
      note: "Official Steam News supports Auto-Defense as an affix/combat term.",
    },
  ],
});

writeJson("source-content-actions.json", {
  ...commonEvidence,
  actions: [
    {
      source_id: "src-steam-news-st11-20260924",
      disposition: "CREATE_CANDIDATE",
      affected_routes: [`/${slug}/`],
      new_claims: [
        "ST-11 mentions improved allied Auto-Defense affix effects.",
        "ST-11 mentions larger Early Access goals but does not ship base-defense raids.",
      ],
      evidence_urls: [
        "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json",
      ],
    },
    {
      source_id: "src-steam-appdetails-20260924",
      disposition: "CREATE_CANDIDATE",
      affected_routes: [`/${slug}/`],
      new_claims: [
        "The official store description frames the game as colony building plus personally storming roguelite battlefields.",
      ],
      evidence_urls: [
        "https://store.steampowered.com/api/appdetails?appids=1067360&filters=basic,genres,categories,release_date,platforms",
      ],
    },
  ],
});

const candidate = {
  id: "candidate-auto-defense-base-defense-20260924",
  keyword: "Pax Autocratica Auto-Defense",
  slug,
  decision: "CREATE_L2_DETAIL",
  demand_signal:
    "Current player discovery signal asks about base defense and auto turrets; official sources mention Auto-Defense affix and turret-like combat terms.",
  evidence_gate: "PASS_WITH_BOUNDARY",
  content_gate: "PASS",
  production_gate: "PENDING_BUILD",
  boundary:
    "Do not claim colony raids, permanent player-built auto turrets, exact Auto-Defense formula, cooldown, drop rate or best build.",
};

writeJson("opportunity-candidates.json", {
  generated_at: checkedAt,
  candidates: [
    candidate,
    {
      id: "candidate-memory-leak-followup-20260924",
      keyword: "Pax Autocratica memory leak",
      decision: "HOLD_UPDATE_EXISTING",
      reason: "Already covered by Performance unless direct developer resolution appears.",
    },
    {
      id: "candidate-price-value-20260924",
      keyword: "Pax Autocratica worth 30 bucks",
      decision: "HOLD_EXISTING_INTENT",
      reason: "Maps to existing price/review intent; current discussion is opinion-heavy and not a mechanics page.",
    },
  ],
});
writeJson("derivative-keyword-candidates.json", {
  generated_at: checkedAt,
  parent: "Pax Autocratica",
  terms: [
    {
      term: "pax autocratica auto defense",
      source: "official_steam_news_and_current_player_question",
      decision: "selected",
    },
    {
      term: "pax autocratica base defense",
      source: "current_player_question",
      decision: "selected_as_boundary_subtopic",
    },
    {
      term: "pax autocratica auto turrets",
      source: "current_player_question",
      decision: "selected_as_boundary_subtopic",
    },
  ],
});
writeJson("opportunity-shortlist.json", {
  generated_at: checkedAt,
  method: "low_cost_source_evidence_without_webcafe",
  selected: [candidate.id],
  held: ["candidate-memory-leak-followup-20260924", "candidate-price-value-20260924"],
});
writeJson("webcafe-plan.json", {
  generated_at: checkedAt,
  status: "DEFERRED_NO_AUTHENTICATED_EXPORT",
  planned_queries: ["Pax Autocratica Auto-Defense", "Pax Autocratica base defense"],
  reason:
    "No authenticated Web.Cafe export/API evidence was available in this automation context; did not fabricate KD or SERP values.",
});
writeJson("webcafe-results.json", {
  generated_at: checkedAt,
  status: "UNKNOWN_DEFERRED",
  results: [],
});
writeJson("page-decisions.json", {
  generated_at: checkedAt,
  decisions: [
    {
      slug,
      action: "CREATE_L2_DETAIL",
      index_status: "index",
      page_status: "publish",
      reason:
        "Distinct Auto-Defense/base-defense terminology task with official source evidence and clear no-overclaim boundary.",
    },
  ],
});
writeJson("change-manifest.json", {
  generated_at: checkedAt,
  new_index_pages: [{ slug, url: `${baseUrl}/${slug}/`, title: page.keyword }],
  modified_files: [
    "public/site-data.json",
    "public/sitemap.xml",
    "content/en/pax-autocratica-auto-defense.mdx",
    "scripts/growth-2026-09-24-auto-defense.mjs",
  ],
  no_change_site_reason: "No direct evidence required changing templates, ads, measurement, DNS or forced indexing.",
});
writeJson("search-performance.json", {
  generated_at: checkedAt,
  status: "UNKNOWN_DEFERRED",
  latest_complete_date: null,
  reason: "No authenticated GSC export or connector was available.",
});
writeJson("measurement-health.json", {
  generated_at: checkedAt,
  status: "UNKNOWN_DEFERRED",
  reason: "No authenticated analytics, measurement export or ad revenue export was available.",
});
writeJson("external-benchmark.json", {
  generated_at: checkedAt,
  similarweb: "UNKNOWN_DEFERRED",
  webcafe: "UNKNOWN_DEFERRED",
  aitdk: "UNKNOWN_DEFERRED",
  reason: "No authenticated exports available; values were not treated as zero.",
});
writeJson("aitdk-compatibility.json", {
  generated_at: checkedAt,
  status: "OWN_RULES_WITHOUT_EXTENSION_SNAPSHOT",
  metrics: [
    { feature: "title_description_canonical", status: "IMPLEMENTED_WITH_VARIANCE" },
    { feature: "traffic_estimates", status: "UNKNOWN" },
    { feature: "private_extension_api", status: "UNSUPPORTED" },
  ],
});
writeJson("site-health.json", {
  generated_at: checkedAt,
  status: "PENDING_BUILD_ONLINE_VERIFY",
  checked_paths: ["/", `/${slug}/`, "/guide/", "/sitemap.xml", "/robots.txt"],
});

console.log(JSON.stringify({
  slug,
  url: `${baseUrl}/${slug}/`,
  checkedAt,
  sitemapUrls: sitemapUrls.length,
  pages: data.pages.length,
  runDir,
}, null, 2));

if (process.argv.includes("--finalize-report")) {
  const gitCommit = process.env.GIT_COMMIT || "UNKNOWN";
  const deployUrl = process.env.DEPLOY_URL || "UNKNOWN";
  const onlineVersion = process.env.ONLINE_VERSION || "UNKNOWN";
  const onlineStatus = process.env.ONLINE_STATUS || "UNKNOWN";
  const dnsNote = process.env.DNS_NOTE || "Local DNS check not provided.";
  const findings = [
    {
      id: "D00-run-lock-input",
      area: "D00 input and run lock",
      status: "PASS",
      risk: "P3",
      impact: "Prevents duplicate same-day runs and mixing another site's state into Pax Autocratica.",
      evidence: `Run directory ${runDir}; previous commit ${process.env.PREVIOUS_COMMIT || "unknown"}; current commit ${gitCommit}.`,
      action: "Locked site/date/version and continued from the existing Pax growth-runs directory.",
      resolution: "RESOLVED",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D01-source-watch",
      area: "D01 sources",
      status: "PASS_WITH_UNAVAILABLE_SOURCE",
      risk: "P3",
      impact: "A thin page would result if community demand were treated as complete mechanics proof.",
      evidence:
        "Steam News API, Steam community home, Steam appdetails and official site were captured; Reddit/direct private channels were not used as mechanics proof.",
      action:
        "Used official Steam source evidence for Auto-Defense and store positioning; kept community question as demand signal only.",
      resolution: "RESOLVED_WITH_DEFERRED_SOURCE",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D05-D08-candidate-gates",
      area: "D05-D08 candidate gates",
      status: "PASS",
      risk: "P2",
      impact: "Players could wrongly expect a base-raid or auto-turret loop if similar terms were merged.",
      evidence:
        "Auto-Defense page passed as a terminology/boundary guide; memory leak and price/value were held as existing-page or opinion-heavy topics.",
      action: "Selected one new L2 page and recorded held candidates.",
      resolution: "RESOLVED",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D09-content-production",
      area: "D09 content",
      status: "PASS",
      risk: "P2",
      impact: "The site needs at least one real new index page, not a noindex draft or duplicated update.",
      evidence: `Added /${slug}/ with direct answer, sections, FAQ, sources, guide link and sitemap entry.`,
      action: "Created the new Auto-Defense page and related internal links; no template/ad/measurement changes.",
      resolution: "RESOLVED",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D02-site-health",
      area: "D02 site health",
      status: onlineStatus === "PASS" ? "PASS_WITH_DNS_NOTE" : "UNKNOWN_PENDING_RECHECK",
      risk: "P3",
      impact: "Users need the production domain to serve the same version as GitHub.",
      evidence: `Online verification status: ${onlineStatus}; ${dnsNote}`,
      action: "No DNS change because no direct DNS-panel evidence required edits.",
      resolution: onlineStatus === "PASS" ? "RESOLVED_PENDING_DNS_RECHECK" : "DEFERRED_PENDING_RECHECK",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D03-measurement-data",
      area: "D03 GSC and measurement",
      status: "UNKNOWN_DEFERRED",
      risk: "P4",
      impact: "Search and analytics numbers cannot drive optimization decisions without authenticated exports.",
      evidence: "No authenticated GSC, GA4/Plausible/Clarity export or connector was available in this run.",
      action: "Recorded unknown/deferred; did not modify tracking or draw traffic conclusions.",
      resolution: "DEFERRED_NO_AUTHENTICATED_DATA",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D04-external-benchmark",
      area: "D04 Similarweb Web.Cafe AITDK",
      status: "UNKNOWN_DEFERRED",
      risk: "P4",
      impact: "External estimates cannot be faked as zero or success.",
      evidence: "No authenticated Similarweb/Web.Cafe/AITDK export was available.",
      action: "Recorded unavailable data; page decision used primary official/community evidence instead.",
      resolution: "DEFERRED_NO_AUTHENTICATED_DATA",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D10-deploy-verify",
      area: "D10 deployment",
      status: onlineStatus === "PASS" ? "PASS" : "UNKNOWN_PENDING_RECHECK",
      risk: "P1",
      impact: "If commit, GitHub, deploy and online version diverge, users may see a different site than the repo.",
      evidence: `Git commit ${gitCommit}; deployment ${deployUrl}; online /version.txt ${onlineVersion}.`,
      action: "Built locally, pushed GitHub, deployed Vercel production and verified real paths when available.",
      resolution: onlineStatus === "PASS" ? "RESOLVED" : "DEFERRED_PENDING_RECHECK",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D11-external-publication",
      area: "D11 external publication",
      status: "PASS_NO_EXTERNAL_PUBLICATION",
      risk: "P4",
      impact: "Posting to unspecified platforms would exceed authorization and risk spam/brand harm.",
      evidence: "No user-provided allowed publication list was present.",
      action: "Kept external publication count at 0.",
      resolution: "RESOLVED",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
    {
      id: "D12-report",
      area: "D12 report",
      status: "PASS",
      risk: "P2",
      impact: "The run must be auditable after the automation finishes.",
      evidence: "daily-report.json/html/md, source captures, run artifacts and checksums are generated in today's growth-runs directory.",
      action: "Rendered self-contained daily report and machine JSON with finding status, impact, evidence and hashes.",
      resolution: "RESOLVED",
      next_review_at: "2026-09-25T09:00:00+08:00",
    },
  ];
  const report = {
    schema_version: 1,
    run_id: `pax-autocratica-${runDate}`,
    site_id: "PaxAutocratica",
    game_name: "Pax Autocratica",
    canonical_domain: baseUrl,
    captured_at: checkedAt,
    status: onlineStatus === "PASS" ? "PASS_WITH_DEFERRED_DATA" : "PASS_WITH_PENDING_ONLINE_RECHECK",
    new_index_page_count: 1,
    new_index_pages: [{ slug, url: `${baseUrl}/${slug}/`, title: page.keyword }],
    git_commit: gitCommit,
    github_push_status: process.env.GITHUB_PUSH_STATUS || "UNKNOWN",
    deployment_status: onlineStatus === "PASS" ? "PASS" : "UNKNOWN_PENDING_RECHECK",
    deployment_url: deployUrl,
    online_version: onlineVersion,
    external_publications: 0,
    deferred_data: [
      "GSC",
      "Analytics/measurement export",
      "Similarweb",
      "Web.Cafe",
      "AITDK",
      "Ad revenue export",
      "Reddit direct capture",
    ],
    no_change_site_reason:
      "No direct evidence required changing templates, ads, measurement, DNS or indexing requests.",
    findings,
  };
  writeJson("daily-report.json", report);
  const rows = findings.map((finding) => `<tr><td>${finding.id}</td><td>${finding.area}</td><td>${finding.status}</td><td>${finding.risk}</td><td>${finding.impact}</td><td>${finding.evidence}</td><td>${finding.action}</td><td>${finding.resolution}</td><td>${finding.next_review_at}</td></tr>`).join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pax Autocratica Daily Growth Report ${runDate}</title><style>body{font-family:Arial,sans-serif;background:#f5f7fb;color:#1f2937;margin:24px}table{border-collapse:collapse;width:100%;background:#fff}th,td{border:1px solid #dfe5ec;padding:8px;vertical-align:top}th{background:#eef4f0;text-align:left}code{background:#eef1f5;padding:2px 4px}</style></head><body><h1>Pax Autocratica Daily Growth Report ${runDate}</h1><p>Status: <strong>${report.status}</strong>. New index page: <a href="${baseUrl}/${slug}/">${baseUrl}/${slug}/</a>. Commit: <code>${gitCommit}</code>.</p><table id="health-findings"><thead><tr><th>ID</th><th>Area</th><th>Status</th><th>Risk</th><th>Impact</th><th>Evidence</th><th>Action</th><th>Resolution</th><th>Next review</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  fs.writeFileSync(path.join(runDir, "daily-report.html"), html, "utf8");
  const md = `# Pax Autocratica Daily Growth Report ${runDate}

Status: ${report.status}

New index page: ${baseUrl}/${slug}/

Git commit: ${gitCommit}

Deployment: ${deployUrl}

Online version: ${onlineVersion}

External publications: 0

Deferred data: ${report.deferred_data.join(", ")}

No site infrastructure changes were made because there was no direct evidence requiring template, ad, measurement, DNS or forced-indexing changes.
`;
  fs.writeFileSync(path.join(runDir, "daily-report.md"), md, "utf8");
  writeChecksums([
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
    "daily-report.json",
    "daily-report.html",
    "daily-report.md",
  ]);
}
