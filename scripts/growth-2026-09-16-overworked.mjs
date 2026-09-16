import { readFileSync, writeFileSync } from "node:fs";

const checkedAt = "2026-09-16T09:18:00+08:00";
const slug = "pax-autocratica-overworked-soldiers";
const url = `https://paxautocratica.vip/${slug}/`;

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function upsert(array, item, key = "slug") {
  const index = array.findIndex((candidate) => candidate[key] === item[key]);
  if (index >= 0) array[index] = item;
  else array.push(item);
}

function pushUnique(array, value, after) {
  if (array.includes(value)) return;
  const index = after ? array.indexOf(after) : -1;
  if (index >= 0) array.splice(index + 1, 0, value);
  else array.push(value);
}

const data = readJson("public/site-data.json");

data.home.meta.description = "A source-backed Pax Autocratica wiki with practical guides to gameplay, overworked soldiers, ST-11 patch changes, ultrawide blurry visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, roadmap status, expeditions, demo access, price checks, videos, community links, and current Early Access questions.";
data.home.hero.stats = data.home.hero.stats.map((item) => item.startsWith("Updated ") ? "Updated 2026-09-16" : item);
data.metadata.description = data.home.meta.description;
data.metadata.keywords = "Pax Autocratica wiki, Pax Autocratica guides, overworked soldiers, work hours, Unified Labor, Victory Square, stamina, ultrawide blurry, 32:9, FOV issue, save wipe, 1.0 progress, Sector 3 final boss, roadmap, Early Access, gameplay, capture mechanics, expeditions, colony, demo, price, trailer, mods, community";

const category = data.blueprint.categories.find((item) => item.name === "Guide");
const combatGroup = category.groups.find((item) => item.title === "Expeditions and squad combat");
pushUnique(combatGroup.slugs, slug, "pax-autocratica-best-troops");
upsert(category.pages, { keyword: "Pax Autocratica Overworked Soldiers", slug });

const page = {
  keyword: "Pax Autocratica Overworked Soldiers",
  slug,
  seo: {
    title: "Pax Autocratica Overworked Soldiers: Work Hours and Stamina",
    description: "A source-backed Pax Autocratica overworked soldiers guide: what current Steam and Reddit discussion signals say about work hours, stamina, exhaustion and safe testing."
  },
  direct_answer: "If Pax Autocratica soldiers or workers keep showing Overworked, treat it as a stamina and schedule warning first, not proof that the unit is broken. Current Steam discussion evidence points players toward shorter workdays, rest/social time, stamina traits, food, barracks or bathhouse support, and Victory Square / Unified Labor changes. Do not publish a fixed official formula: the useful path is to lower work hours, watch whether Overworked clears before it becomes Exhausted, and report it only when a narrow group keeps the status despite normal rest.",
  direct_answer_claim_ids: [
    "claim-overworked-status-warning-20260916",
    "claim-overworked-work-hours-20260916",
    "claim-overworked-report-boundary-20260916"
  ],
  sections: [
    {
      heading: "What the current player evidence says",
      paragraphs: [
        "The strongest Steam thread is Overworked status seems excessive. The original report says more than half the colony needed 24-hour rest days even after work hours were reduced. Replies converge around the same practical idea: long workdays create Overworked warnings, while shorter workdays and enough recovery time reduce the symptom.",
        "This is community gameplay evidence, not an official stamina table. Use it to guide safe checks: change the work schedule, observe whether the same people recover, and avoid turning one player's 12-, 15- or 16-hour preference into a universal rule."
      ],
      steps: [
        "Start by lowering the daily work window instead of replacing every worker.",
        "Watch whether Overworked clears during social hours and sleep.",
        "Separate a normal late-shift warning from a status that carries into the next day."
      ],
      claim_ids: [
        "claim-overworked-status-warning-20260916",
        "claim-overworked-work-hours-20260916"
      ]
    },
    {
      heading: "Adjust the schedule before blaming the troop",
      paragraphs: [
        "The thread includes a repeated practical route: shorter workdays can reduce or remove the status, and one reply points to Victory Square / Unified Labor for changing workday length. That matters because the fix lives in colony management, not in the soldier gear screen.",
        "If your best combat units are also assigned to long base work shifts, they may look like bad soldiers when the real issue is fatigue pressure. Change one variable at a time so you can tell whether work hours, stamina traits, food or rest facilities moved the symptom."
      ],
      steps: [
        "Open the colony schedule route you currently use for labor directives.",
        "Reduce work hours and run one full day before judging the result.",
        "If only low-stamina citizens are affected, treat it as a stamina roster issue.",
        "If everyone is affected, treat it as a colony-wide schedule issue."
      ],
      claim_ids: [
        "claim-overworked-work-hours-20260916"
      ]
    },
    {
      heading: "Check stamina, food and rest support",
      paragraphs: [
        "Several Steam replies connect Overworked to stamina, traits, meals and rest infrastructure. The safe takeaway is not a hidden threshold; it is a checklist. A soldier with weak stamina or poor recovery can trigger the warning sooner than a stronger unit under the same hours.",
        "Use food and rest support as a controlled test, especially before deciding that a favorite soldier is unusable. If a status clears after the next sleep cycle, you have a management pressure point; if it stacks into Exhausted or persists on the same workers, preserve evidence for a bug report."
      ],
      steps: [
        "Compare affected soldiers' stamina or trait situation against unaffected workers.",
        "Try stamina-supporting meals only if they do not break other food goals.",
        "Confirm barracks, bathhouse or other recovery support is actually available.",
        "Avoid sacrificing or dismissing a strong unit until schedule and recovery checks are done."
      ],
      claim_ids: [
        "claim-overworked-stamina-rest-20260916"
      ]
    },
    {
      heading: "Can overworked soldiers still go to battle?",
      paragraphs: [
        "A current Reddit hot listing shows the same user job in plain language: players want to know whether overworked soldiers can still be taken to battle and whether it affects performance or morale. The captured public page did not provide a complete official answer, so this guide should not pretend to know every combat penalty.",
        "The practical answer is to test conservatively. If Overworked clears before battle and the unit is not Exhausted, run a low-risk expedition and compare behavior. If the unit is Exhausted or still carrying stacked fatigue, keep it out of high-value fights until recovery is clear."
      ],
      steps: [
        "Do not send exhausted or persistently fatigued units into a key boss fight just to test a theory.",
        "Use a low-risk mission if you need to compare overworked versus rested behavior.",
        "Track morale, stamina and survival after the expedition before changing the whole schedule."
      ],
      claim_ids: [
        "claim-overworked-reddit-demand-20260916",
        "claim-overworked-status-warning-20260916"
      ]
    },
    {
      heading: "When to treat it as a bug report",
      paragraphs: [
        "One Steam reply near the end of the thread describes a narrower symptom: only some workers kept mining or carrying outside the base and appeared overworked while the rest of the colony did not. That is a different pattern from everyone working too many hours.",
        "Report it when the symptom is narrow, repeatable and survives normal rest. A useful report should name the day, work-hour setting, affected jobs, whether those workers were outside the base, recovery buildings, food state and whether the status persisted after sleep."
      ],
      steps: [
        "Save before changing a large schedule or dismantling facilities.",
        "Record which workers are affected and what job they were doing.",
        "Note whether rest, sleep and food cleared the status.",
        "Post a narrow report through Steam Discussions or the official support route."
      ],
      claim_ids: [
        "claim-overworked-report-boundary-20260916"
      ]
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page is a current Early Access troubleshooting route. It does not claim an official work-hour formula, an exact stamina threshold, or a guaranteed combat penalty for every Overworked soldier.",
        "Update it when Multiverse publishes a dated labor, stamina or soldier-status note, or when current discussions produce a confirmed developer answer. Until then, keep the page focused on reversible checks and clear bug-report evidence."
      ],
      steps: [
        "Use the Steam thread for schedule and recovery signals.",
        "Use Reddit only as a player-demand signal where direct capture is blocked.",
        "Use official patch notes for any future confirmed labor or stamina change."
      ],
      claim_ids: [
        "claim-overworked-status-warning-20260916",
        "claim-overworked-work-hours-20260916",
        "claim-overworked-report-boundary-20260916"
      ]
    }
  ],
  faq: [
    {
      question: "Is Overworked always a serious problem?",
      answer: "No. Current Steam replies frame it as a warning when it clears with rest. It becomes more serious when it persists, stacks into Exhausted, or affects only a narrow group in a repeatable way.",
      claim_ids: [
        "claim-overworked-status-warning-20260916"
      ]
    },
    {
      question: "What work hours should I use?",
      answer: "Do not treat any one number as official. The current discussion suggests testing shorter workdays and observing a full day before making wider changes.",
      claim_ids: [
        "claim-overworked-work-hours-20260916"
      ]
    },
    {
      question: "Should I replace overworked soldiers?",
      answer: "Not first. Check work hours, stamina, food and rest support before sacrificing, dismissing or replacing a strong unit.",
      claim_ids: [
        "claim-overworked-stamina-rest-20260916"
      ]
    },
    {
      question: "Can I take overworked soldiers to battle?",
      answer: "There is visible player demand for that exact question, but no captured official formula. Test only in low-risk fights, and avoid taking exhausted or persistently fatigued units into important battles.",
      claim_ids: [
        "claim-overworked-reddit-demand-20260916"
      ]
    }
  ],
  source_ids: [
    "src-steam-discussion-overworked-20260916",
    "src-reddit-overworked-demand-20260916",
    "src-steam-discussions-index-20260916",
    "src-steam-store-20260916"
  ],
  related_slugs: [
    "pax-autocratica-best-troops",
    "pax-autocratica-custom-colony-settings",
    "pax-autocratica-soldier-gear",
    "pax-autocratica-community"
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index"
};

upsert(data.pages, page);

data.pageProvenance[slug] = {
  intent_id: "intent-20260916-overworked-soldiers",
  intent_type: "colony_status_troubleshooting",
  user_job: "Understand whether Overworked soldiers are safe, how to reduce the status, and when to report a bug.",
  intent_evidence_ids: [
    "src-steam-discussion-overworked-20260916",
    "src-reddit-overworked-demand-20260916",
    "src-steam-discussions-index-20260916"
  ],
  answerability: "resolved_as_troubleshooting_route_without_official_formula",
  coverage: [
    {
      dimension: "schedule_and_recovery",
      status: "covered",
      claim_ids: [
        "claim-overworked-status-warning-20260916",
        "claim-overworked-work-hours-20260916"
      ],
      evidence_relation: "steam_discussion_multi_reply",
      notes: "Steam replies repeatedly connect Overworked to long work hours and recovery time."
    },
    {
      dimension: "stamina_and_rest_support",
      status: "covered",
      claim_ids: [
        "claim-overworked-stamina-rest-20260916"
      ],
      evidence_relation: "steam_discussion_player_testing",
      notes: "Replies cite stamina, meals, barracks/bathhouse support and status persistence as checks."
    },
    {
      dimension: "battle_penalty_formula",
      status: "blocked",
      claim_ids: [
        "claim-overworked-reddit-demand-20260916"
      ],
      evidence_relation: "reddit_player_demand_only",
      notes: "Reddit shows demand for the battle question, but no official combat penalty formula was captured."
    },
    {
      dimension: "bug_report_boundary",
      status: "covered",
      claim_ids: [
        "claim-overworked-report-boundary-20260916"
      ],
      evidence_relation: "steam_discussion_late_thread_bug_pattern",
      notes: "A late Steam reply describes a narrower worker-pathing style pattern that should be reported separately from normal schedule fatigue."
    }
  ],
  source_links: [
    {
      label: "Steam discussion: Overworked status seems excessive",
      url: "https://steamcommunity.com/app/1067360/discussions/0/84032037661577002/",
      source_type: "community_troubleshooting_context"
    },
    {
      label: "Reddit hot listing: Can I take overworked soldiers to battle?",
      url: "https://www.reddit.com/r/PaxAutocratica/hot/",
      source_type: "community_demand_signal"
    },
    {
      label: "Steam discussions index",
      url: "https://steamcommunity.com/app/1067360/discussions/",
      source_type: "community_context"
    },
    {
      label: "Pax Autocratica Steam store",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store"
    }
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-overworked-soldiers",
  status: "publish",
  depth_variance_reason: "The page answers a distinct colony-status troubleshooting task with current Steam evidence and Reddit demand while refusing unsupported stamina formulas or combat-penalty claims."
};

data.media.push({
  asset_id: "pax-autocratica-overworked-soldiers-20260916",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-best-troops-12.webp",
  alt: "Pax Autocratica squad scene used for the overworked soldiers guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 combat screenshot already present in the site media registry.",
  relevance_reason: "Shows the soldier and expedition context for a page about fatigue, deployment and recovery decisions."
});

data.site.version = "local-pending-overworked-soldiers";
data.generated_at = checkedAt;

writeJson("public/site-data.json", data);

const sitemapPath = "public/sitemap.xml";
let sitemap = readFileSync(sitemapPath, "utf8");
const line = `  <url><loc>${url}</loc><lastmod>2026-09-16</lastmod></url>`;
if (!sitemap.includes(url)) {
  sitemap = sitemap.replace("  <url><loc>https://paxautocratica.vip/pax-autocratica-ultrawide-blurry/</loc><lastmod>2026-09-15</lastmod></url>", `  <url><loc>https://paxautocratica.vip/pax-autocratica-ultrawide-blurry/</loc><lastmod>2026-09-15</lastmod></url>\n${line}`);
}
writeFileSync(sitemapPath, sitemap, "utf8");
