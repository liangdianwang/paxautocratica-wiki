import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-revive-player.mdx");
const checkedAt = "2026-09-19T09:11:00+08:00";
const runDate = "2026-09-19";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-revive-player";

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

const reviveClaimIds = [
  "claim-revive-pathfinding-next-version-20260919",
  "claim-revive-design-may-change-with-coop-20260919",
  "claim-revive-report-video-evidence-20260919",
  "claim-revive-community-loyalty-observation-20260919",
  "claim-revive-no-guaranteed-ai-rescue-20260919",
];

const revivePage = {
  keyword: "Pax Autocratica Revive Player",
  slug,
  seo: {
    title: "Pax Autocratica Revive Player: NPC Revive and Pathfinding",
    description:
      "A source-backed Pax Autocratica revive guide: what the current Steam developer reply says about NPC revive pathfinding, reporting evidence and the future co-op boundary.",
  },
  direct_answer:
    "If a Pax Autocratica NPC or soldier fails to revive you, treat it as a current pathfinding and design-boundary issue, not as a guaranteed player mistake. A current Steam thread has a developer reply saying there were map-related pathfinding issues and that they will be patched in the next version; the same reply says the soldier-revive design may change because co-op will affect the feature. Until a dated patch note ships, play defensively: keep rescuers alive and nearby, do not rely on an NPC crossing a bad route during a key fight, and report repeat failures with a video, map context and save/log evidence.",
  direct_answer_claim_ids: reviveClaimIds,
  sections: [
    {
      heading: "What the current developer reply confirms",
      paragraphs: [
        "The strongest source is the Steam thread Assigning NPCs to revive player is a bad design choice. The player report includes a video-backed complaint that an NPC moved away instead of reviving the downed player.",
        "A developer reply says the captured case included map pathfinding issues and that those pathfinding issues will be patched in the next version. That is enough to explain why the behavior can be real without turning every failed revive into the same bug.",
      ],
      steps: [
        "Update after the next version lands before retesting the exact same route.",
        "If the failure repeats, note the map, room, obstacle layout and whether soldiers were alive nearby.",
        "Keep the report tied to one reproducible revive failure instead of mixing it with every combat complaint.",
      ],
      claim_ids: [
        "claim-revive-pathfinding-next-version-20260919",
        "claim-revive-report-video-evidence-20260919",
      ],
    },
    {
      heading: "How to play around it before the patch",
      paragraphs: [
        "Do not build a high-risk run around a guaranteed NPC rescue. The captured evidence supports a safer temporary route: prevent the downed state where possible, keep your squad from scattering, and avoid testing revive behavior for the first time inside an important boss or end-of-expedition fight.",
        "A community reply in the same thread suggests revive behavior may depend on which soldiers are alive and close enough to act. Treat that as player observation, not an official formula about loyalty, morale or exact selection priority.",
      ],
      steps: [
        "Keep at least one capable soldier alive and reasonably close during dangerous pushes.",
        "Avoid pulling the squad through narrow or confusing terrain right before you take a lethal risk.",
        "If every escort is down or unreachable, assume the revive may fail and preserve the save/video evidence.",
      ],
      claim_ids: [
        "claim-revive-community-loyalty-observation-20260919",
        "claim-revive-no-guaranteed-ai-rescue-20260919",
      ],
    },
    {
      heading: "Why co-op matters to revive",
      paragraphs: [
        "The same developer reply says the team will discuss the revive design internally and that the feature may change because co-op will affect it. This does not mean co-op is playable today, and it does not publish a new revive rule.",
        "Use the multiplayer page for the current co-op availability boundary. Use this revive page for the downed-player rescue behavior, pathfinding issue and reporting route.",
      ],
      steps: [
        "Do not infer a current co-op revive mode from the discussion.",
        "Recheck official patch notes when a co-op or revive-specific update appears.",
        "Update this page only when the new build changes the actual revive behavior or public explanation.",
      ],
      claim_ids: [
        "claim-revive-design-may-change-with-coop-20260919",
      ],
    },
    {
      heading: "What to include in a useful report",
      paragraphs: [
        "The pinned bug-reporting thread asks players to use the in-game K key and provide files when needed. For revive failures, the useful evidence is very specific: video, map context, whether escort NPCs were alive, where they were pathing, and whether the same path fails again after reload.",
        "A narrow report helps the team separate map pathfinding from balance, AI priority, co-op design and ordinary combat risk.",
      ],
      steps: [
        "Use the K key in-game for the first report.",
        "Attach or link the short video clip if you have one.",
        "Name the map or expedition context and the obstacle/path that looked wrong.",
        "Mention whether soldiers were alive, close, loyal or stuck somewhere else.",
        "Save logs and save files if the team asks for them through the support route.",
      ],
      claim_ids: [
        "claim-revive-report-video-evidence-20260919",
        "claim-revive-pathfinding-next-version-20260919",
      ],
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page does not claim an exact revive priority formula, a loyalty threshold, a co-op release date, or that the next version will solve every downed-player case. It records the current developer explanation and the safest practical response.",
        "If the next patch changes revive behavior, replace this boundary with the dated patch note. If only more player anecdotes appear, keep them as demand or troubleshooting context until a developer reply or official note confirms the rule.",
      ],
      steps: [
        "Use the Steam thread for the current pathfinding and design-boundary evidence.",
        "Use the pinned bug-reporting thread for the reporting route.",
        "Use Steam News for the future patch or co-op confirmation, not guesses.",
      ],
      claim_ids: [
        "claim-revive-no-guaranteed-ai-rescue-20260919",
        "claim-revive-design-may-change-with-coop-20260919",
      ],
    },
  ],
  faq: [
    {
      question: "Is failed NPC revive a confirmed bug?",
      answer:
        "For the captured Steam report, the developer says there were map-related pathfinding issues and that they will be patched in the next version. That does not prove every failed revive has the same cause.",
      claim_ids: ["claim-revive-pathfinding-next-version-20260919"],
    },
    {
      question: "Can I force a specific soldier to revive me?",
      answer:
        "No official selection formula was captured. Community discussion suggests nearby or surviving soldiers matter, but the page should not publish a loyalty or morale rule as fact.",
      claim_ids: ["claim-revive-community-loyalty-observation-20260919"],
    },
    {
      question: "Does this mean co-op revive is coming now?",
      answer:
        "No. The developer says co-op will affect revive design, but the captured sources do not confirm current co-op availability or a released co-op revive mode.",
      claim_ids: ["claim-revive-design-may-change-with-coop-20260919"],
    },
    {
      question: "What should I do until the next patch?",
      answer:
        "Play defensively, keep rescuers alive and close, avoid relying on a long NPC path during key fights, and report repeat failures with video, map context and files if requested.",
      claim_ids: [
        "claim-revive-report-video-evidence-20260919",
        "claim-revive-no-guaranteed-ai-rescue-20260919",
      ],
    },
  ],
  source_ids: [
    "src-steam-discussion-npc-revive-20260919",
    "src-steam-discussion-bug-reporting-20260919",
    "src-steam-discussions-index-20260919",
    "src-steam-news-st11-20260919",
    "src-steam-store-20260919",
  ],
  related_slugs: [
    "pax-autocratica-best-troops",
    "pax-autocratica-f1-commands",
    "pax-autocratica-sector-3-final-boss",
    "pax-autocratica-multiplayer",
    "pax-autocratica-community",
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index",
};

replaceOrPush(data.pages, revivePage);

const overworked = data.pages.find((page) => page.slug === "pax-autocratica-overworked-soldiers");
if (overworked) {
  overworked.direct_answer =
    "If Pax Autocratica soldiers or workers keep showing Overworked, treat it as a stamina, schedule and current-status-display issue first, not proof that the unit is broken. Current Steam evidence points players toward shorter workdays, rest/social time, stamina traits, food, barracks or bathhouse support, and Victory Square / Unified Labor changes. A newer developer reply also says there are issues in how Overworked and Exhausted are used and displayed, that the problem has been pinpointed, and that it will be fixed in the next update. Do not publish a fixed official formula: lower work hours, watch whether the status clears, and report narrow repeat cases with evidence.";
  overworked.direct_answer_claim_ids = Array.from(new Set([...(overworked.direct_answer_claim_ids || []), "claim-overworked-display-fix-next-update-20260919"]));
  overworked.updated_at = checkedAt;
  overworked.sections = overworked.sections || [];
  const fixSection = {
    heading: "Current developer fix status",
    paragraphs: [
      "A newer Steam Overworked thread adds an important official boundary. Multiverse says there are issues in the way Overworked and Exhausted statuses are used and displayed, that the problem has already been pinpointed, and that it will be fixed in the next update.",
      "That changes the troubleshooting tone: schedule and recovery checks still matter, but players should not overread a status label that may currently be displayed or applied incorrectly.",
    ],
    steps: [
      "Keep using shorter work hours and rest checks as reversible tests.",
      "Do not dismiss a useful soldier only because one status label looks wrong.",
      "After the next update, retest the same colony day and compare whether Overworked or Exhausted appears differently.",
    ],
    claim_ids: ["claim-overworked-display-fix-next-update-20260919"],
  };
  const existing = overworked.sections.findIndex((section) => section.heading === fixSection.heading);
  if (existing >= 0) overworked.sections[existing] = fixSection;
  else overworked.sections.splice(Math.max(0, overworked.sections.length - 1), 0, fixSection);
  overworked.source_ids = Array.from(new Set([...(overworked.source_ids || []), "src-steam-discussion-overworked-20260919"]));
  overworked.related_slugs = Array.from(new Set([...(overworked.related_slugs || []), slug]));
}

const multiplayer = data.pages.find((page) => page.slug === "pax-autocratica-multiplayer");
if (multiplayer) {
  multiplayer.updated_at = checkedAt;
  multiplayer.direct_answer =
    "A currently released Pax Autocratica multiplayer or co-op mode is still not confirmed by the captured current sources. A current Steam suggestion thread says co-op is planned on the roadmap, and a developer revive-thread reply says co-op will affect the revive feature, but neither source gives a released mode, player count, matchmaking flow or date. Plan around the verified single-player colony-and-frontier loop until a dated official update says otherwise.";
  multiplayer.direct_answer_claim_ids = Array.from(new Set([...(multiplayer.direct_answer_claim_ids || []), "claim-coop-planned-not-released-20260919"]));
  multiplayer.source_ids = Array.from(new Set([...(multiplayer.source_ids || []), "src-steam-discussion-coop-suggestion-20260919", "src-steam-discussion-npc-revive-20260919"]));
  multiplayer.related_slugs = Array.from(new Set([...(multiplayer.related_slugs || []), slug]));
}

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const squadGroup = guide.groups.find((group) => group.title === "Expeditions and squad combat");
  if (squadGroup) {
    const after = "pax-autocratica-save-during-expedition";
    if (!squadGroup.slugs.includes(slug)) {
      const index = squadGroup.slugs.indexOf(after);
      if (index >= 0) squadGroup.slugs.splice(index + 1, 0, slug);
      else squadGroup.slugs.push(slug);
    }
  }
  replaceOrPush(guide.pages, { keyword: revivePage.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, revive behavior, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, roadmap status, expeditions, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-19"];
}
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica revive player, NPC revive, pathfinding, co-op revive, downed player, Pax Autocratica performance, overworked soldiers, ST-11 patch, Early Access, gameplay, capture mechanics, expeditions, demo, price, trailer, mods, community";
}

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260919-revive-player",
  intent_type: "combat_troubleshooting",
  user_job:
    "Understand what to do when a Pax Autocratica NPC fails to revive the downed player, and what is confirmed versus still changing.",
  intent_evidence_ids: [
    "src-steam-discussion-npc-revive-20260919",
    "src-steam-discussion-bug-reporting-20260919",
    "src-steam-discussions-index-20260919",
    "src-steam-store-20260919",
  ],
  answerability: "resolved_as_current_pathfinding_boundary_and_reporting_path",
  coverage: [
    {
      dimension: "pathfinding_failure",
      status: "covered",
      claim_ids: ["claim-revive-pathfinding-next-version-20260919"],
      evidence_relation: "developer_reply_current_thread",
      notes: "The developer reply ties the captured revive failure to map pathfinding issues and says the next version will patch them.",
    },
    {
      dimension: "future_design_boundary",
      status: "covered",
      claim_ids: ["claim-revive-design-may-change-with-coop-20260919"],
      evidence_relation: "developer_reply_current_thread",
      notes: "The revive design may change because co-op affects it, but no current co-op mode is confirmed.",
    },
    {
      dimension: "player_action",
      status: "covered",
      claim_ids: ["claim-revive-report-video-evidence-20260919"],
      evidence_relation: "developer_reply_plus_pinned_bug_route",
      notes: "The page gives defensive play and reporting steps without claiming a guaranteed workaround.",
    },
    {
      dimension: "revive_formula",
      status: "blocked",
      claim_ids: ["claim-revive-no-guaranteed-ai-rescue-20260919"],
      evidence_relation: "evidence_boundary",
      notes: "No captured source provides exact soldier selection, loyalty or morale thresholds for revive behavior.",
    },
  ],
  source_links: [
    {
      label: "Steam discussion: Assigning NPCs to revive player is a bad design choice",
      url: "https://steamcommunity.com/app/1067360/discussions/0/500617547938443235/",
      source_type: "developer_reply_and_community_report",
    },
    {
      label: "Steam discussion: Help My Game Is Bugged/Glitched/Broken",
      url: "https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/",
      source_type: "official_moderator_troubleshooting",
    },
    {
      label: "Steam discussion: This game is perfect and I'm genuinely enjoying it. suggestion",
      url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169895454/",
      source_type: "co_op_context",
    },
    {
      label: "Steam News API",
      url: "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json",
      source_type: "official_announcement_index",
    },
    {
      label: "Pax Autocratica Steam store",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-revive-player",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct downed-player revive troubleshooting task with a current developer reply, reporting route and co-op design boundary, while refusing unsupported revive formulas or current co-op claims.",
};

if (data.pageProvenance["pax-autocratica-overworked-soldiers"]) {
  data.pageProvenance["pax-autocratica-overworked-soldiers"].last_checked_at = checkedAt;
  uniquePush(
    data.pageProvenance["pax-autocratica-overworked-soldiers"].source_links,
    {
      label: "Steam discussion: Overworked",
      url: "https://steamcommunity.com/app/1067360/discussions/0/500617547938418996/",
      source_type: "developer_reply_current_status",
    },
    (item) => item.url,
  );
}

if (data.pageProvenance["pax-autocratica-multiplayer"]) {
  data.pageProvenance["pax-autocratica-multiplayer"].last_checked_at = checkedAt;
  uniquePush(
    data.pageProvenance["pax-autocratica-multiplayer"].source_links,
    {
      label: "Steam discussion: co-op suggestion thread",
      url: "https://steamcommunity.com/app/1067360/discussions/0/564794139169895454/",
      source_type: "community_suggestion_with_moderator_context",
    },
    (item) => item.url,
  );
  uniquePush(
    data.pageProvenance["pax-autocratica-multiplayer"].source_links,
    {
      label: "Steam discussion: revive design and co-op boundary",
      url: "https://steamcommunity.com/app/1067360/discussions/0/500617547938443235/",
      source_type: "developer_reply_current_context",
    },
    (item) => item.url,
  );
}

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`);

const mdx = `# Pax Autocratica Revive Player

If a Pax Autocratica NPC or soldier fails to revive you, treat it as a current pathfinding and design-boundary issue, not as a guaranteed player mistake. A current Steam thread has a developer reply saying there were map-related pathfinding issues and that they will be patched in the next version; the same reply says the soldier-revive design may change because co-op will affect the feature. Until a dated patch note ships, play defensively: keep rescuers alive and nearby, do not rely on an NPC crossing a bad route during a key fight, and report repeat failures with a video, map context and save/log evidence.

## What the current developer reply confirms

The strongest source is the Steam thread Assigning NPCs to revive player is a bad design choice. The player report includes a video-backed complaint that an NPC moved away instead of reviving the downed player.

A developer reply says the captured case included map pathfinding issues and that those pathfinding issues will be patched in the next version. That is enough to explain why the behavior can be real without turning every failed revive into the same bug.

1. Update after the next version lands before retesting the exact same route.
1. If the failure repeats, note the map, room, obstacle layout and whether soldiers were alive nearby.
1. Keep the report tied to one reproducible revive failure instead of mixing it with every combat complaint.

## How to play around it before the patch

Do not build a high-risk run around a guaranteed NPC rescue. The captured evidence supports a safer temporary route: prevent the downed state where possible, keep your squad from scattering, and avoid testing revive behavior for the first time inside an important boss or end-of-expedition fight.

A community reply in the same thread suggests revive behavior may depend on which soldiers are alive and close enough to act. Treat that as player observation, not an official formula about loyalty, morale or exact selection priority.

1. Keep at least one capable soldier alive and reasonably close during dangerous pushes.
1. Avoid pulling the squad through narrow or confusing terrain right before you take a lethal risk.
1. If every escort is down or unreachable, assume the revive may fail and preserve the save/video evidence.

## Why co-op matters to revive

The same developer reply says the team will discuss the revive design internally and that the feature may change because co-op will affect it. This does not mean co-op is playable today, and it does not publish a new revive rule.

Use the multiplayer page for the current co-op availability boundary. Use this revive page for the downed-player rescue behavior, pathfinding issue and reporting route.

## What to include in a useful report

The pinned bug-reporting thread asks players to use the in-game K key and provide files when needed. For revive failures, the useful evidence is very specific: video, map context, whether escort NPCs were alive, where they were pathing, and whether the same path fails again after reload.

1. Use the K key in-game for the first report.
1. Attach or link the short video clip if you have one.
1. Name the map or expedition context and the obstacle/path that looked wrong.
1. Mention whether soldiers were alive, close, loyal or stuck somewhere else.
1. Save logs and save files if the team asks for them through the support route.

## Evidence boundary

This page does not claim an exact revive priority formula, a loyalty threshold, a co-op release date, or that the next version will solve every downed-player case. It records the current developer explanation and the safest practical response.

Update this page when Multiverse publishes a dated patch note or another developer reply changes the revive rule.

## Sources

- [Steam discussion: Assigning NPCs to revive player is a bad design choice](https://steamcommunity.com/app/1067360/discussions/0/500617547938443235/)
- [Steam discussion: Help My Game Is Bugged/Glitched/Broken](https://steamcommunity.com/app/1067360/discussions/0/585056732983840454/)
- [Steam discussion: co-op suggestion thread](https://steamcommunity.com/app/1067360/discussions/0/564794139169895454/)
- [Steam News API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json)
- [Pax Autocratica Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)

Last checked: ${checkedAt}
`;

fs.writeFileSync(contentPath, mdx);

const publicPages = (data.pages || []).filter((page) => page.page_status === "publish" && page.index_status === "index");
const sitemapUrls = [
  { loc: `${baseUrl}/`, lastmod: runDate },
  { loc: `${baseUrl}/guide/`, lastmod: runDate },
  ...publicPages.map((page) => ({
    loc: `${baseUrl}/${page.slug}/`,
    lastmod: String(page.updated_at || checkedAt).slice(0, 10),
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
  .map((item) => `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod></url>`)
  .join("\n")}\n</urlset>\n`;
fs.writeFileSync(sitemapPath, sitemap);

console.log(`Updated ${slug} and refreshed sitemap with ${sitemapUrls.length} URLs.`);
