import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-crowded-ui.mdx");
const checkedAt = "2026-09-23T09:18:00+08:00";
const runDate = "2026-09-23";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-crowded-ui";

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

const claimIds = [
  "claim-crowded-ui-current-question-20260923",
  "claim-crowded-ui-moderator-response-20260923",
  "claim-crowded-ui-ag27-hide-hud-20260923",
  "claim-crowded-ui-st11-layout-20260923",
  "claim-crowded-ui-boundary-20260923",
  "claim-crowded-ui-report-path-20260923",
];

const page = {
  keyword: "Pax Autocratica Crowded UI",
  slug,
  seo: {
    title: "Pax Autocratica Crowded UI: HUD, Objectives and Clutter",
    description:
      "A source-backed Pax Autocratica crowded UI guide covering the ESC hide-HUD option, mission objective clutter, current Steam response, and what not to overclaim.",
  },
  direct_answer:
    "If Pax Autocratica's base UI feels crowded, the current source-backed answer is split: an official AG-27 patch added an ESC-menu option to temporarily hide all HUD elements for cleaner screenshots or recordings, but the captured sources do not prove a permanent per-widget toggle for the resource feed, mission objectives, or dialogue overlap. A current Steam thread asks about base UI clutter covering dialog boxes, and Gurttron replies that the State hears the issue and will look into it. Use the hide-HUD option when you need a clean screen, check the current build after ST-11's UI layout improvements, and report repeatable objective/resource-feed overlap with screenshots rather than assuming a hidden setting exists.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "Current answer",
      paragraphs: [
        "The current Steam thread is specifically about base clutter: the resource feed and mission objectives staying on screen, a long objective pushing toward the crosshair, and UI elements covering dialog boxes. That makes the player task narrower than a general performance or graphics complaint.",
        "Gurttron's reply does not publish a setting path or claim the clutter is fixed. It says the State hears the issue and will look into it. Treat that as an acknowledged feedback item, not as confirmation that every HUD element can already be individually disabled.",
      ],
      steps: [
        "Do not assume a per-widget objective or resource-feed toggle exists unless you can see it in your current build.",
        "Use the official ESC hide-HUD route when the goal is a clean screenshot or recording.",
        "If clutter blocks a dialogue or active task, capture the build, resolution, UI scale and screenshot before reporting it.",
      ],
      claim_ids: [
        "claim-crowded-ui-current-question-20260923",
        "claim-crowded-ui-moderator-response-20260923",
      ],
    },
    {
      heading: "Use the ESC hide-HUD option for clean screens",
      paragraphs: [
        "Directive AG-27 is the strongest official UI source for this specific topic. It says an ESC-menu option was added to hide all HUD elements temporarily for cleaner screenshots or recordings, and that pressing ESC again restores the normal interface.",
        "That wording matters. It supports a temporary whole-HUD hide route, not a permanent customization table for each base overlay. If you are trying to read a dialogue, record the overlap first, then test the ESC route only if it does not hide the context you need to show.",
      ],
      steps: [
        "Open the ESC menu in the current build.",
        "Look for the temporary hide-HUD option described in AG-27.",
        "Use it for screenshots or recordings where a clean interface is the goal.",
        "Press ESC again to restore the normal interface.",
      ],
      claim_ids: ["claim-crowded-ui-ag27-hide-hud-20260923"],
    },
    {
      heading: "Recheck ST-11 and the current build",
      paragraphs: [
        "The latest official Steam News item captured today is still Directive ST-11 from 2026-09-11. ST-11 includes several UI and interaction changes, including improved Influence HUD text layout and improved Trade Port Building Details layout across different resolutions.",
        "Those changes are useful context, but they are not the same as a full base HUD clutter fix. If your issue is mission objectives or resource-feed overlap, test the current build and describe that exact layer in your report instead of only saying the UI is crowded.",
      ],
      steps: [
        "Confirm your game is on the current public build.",
        "Retest the same base scene after any UI or interaction patch.",
        "Separate Influence HUD, Trade Port details, mission objectives, resource feed and dialogue boxes in your notes.",
      ],
      claim_ids: ["claim-crowded-ui-st11-layout-20260923"],
    },
    {
      heading: "When to report the clutter",
      paragraphs: [
        "Report the issue when UI elements hide important dialogue, quest text, buttons, prompts or crosshair information after you have checked the current build and the ESC hide-HUD route. A good report is more useful than a broad complaint because the developers need to know which overlay is blocking which task.",
        "Useful evidence includes resolution, aspect ratio, UI scale if available, whether it happens in base or combat, the exact mission/objective text, and a screenshot before changing settings. If the issue happens only after several hours, record the session length too.",
      ],
      steps: [
        "Take a screenshot showing the overlap.",
        "Write down resolution, aspect ratio and whether you are in base or combat.",
        "Name the overlay: resource feed, mission objectives, dialogue, Trade Port, Influence HUD or another panel.",
        "Include the build/date and whether ESC hide-HUD changes the problem.",
      ],
      claim_ids: ["claim-crowded-ui-report-path-20260923"],
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page does not claim a permanent objective-feed toggle, a UI scale slider, a confirmed next-patch fix, or a guaranteed workaround for every overlay. The official evidence supports a temporary hide-HUD option and several UI layout improvements; the current Steam thread supports an open clutter complaint acknowledged by moderation.",
        "Update this page if Multiverse publishes a patch note that directly mentions mission objectives, resource feed, UI clutter, dialogue overlap, HUD customization or a permanent per-element toggle.",
      ],
      steps: [
        "Use official directives for shipped UI features.",
        "Use Steam discussion replies as current feedback status, not as a finished fix.",
        "Keep screenshots and report details tied to the build you tested.",
      ],
      claim_ids: ["claim-crowded-ui-boundary-20260923"],
    },
  ],
  faq: [
    {
      question: "Can I hide the Pax Autocratica HUD?",
      answer:
        "Directive AG-27 says the ESC menu can temporarily hide all HUD elements for cleaner screenshots or recordings, then restore them by pressing ESC again.",
      claim_ids: ["claim-crowded-ui-ag27-hide-hud-20260923"],
    },
    {
      question: "Is there a separate toggle for mission objectives or the resource feed?",
      answer:
        "No captured source proves a permanent per-widget toggle. The current complaint is acknowledged as something to look into, not confirmed as already fixed.",
      claim_ids: [
        "claim-crowded-ui-current-question-20260923",
        "claim-crowded-ui-boundary-20260923",
      ],
    },
    {
      question: "Did ST-11 fix crowded UI?",
      answer:
        "ST-11 improved several UI layouts, including Influence HUD text and Trade Port details, but the captured text does not say it fixed mission objective or resource-feed clutter.",
      claim_ids: ["claim-crowded-ui-st11-layout-20260923"],
    },
    {
      question: "What should I include in a clutter report?",
      answer:
        "Include a screenshot, build/date, resolution, aspect ratio, whether it happened in base or combat, and which overlay blocked which task.",
      claim_ids: ["claim-crowded-ui-report-path-20260923"],
    },
  ],
  source_ids: [
    "src-steam-discussion-crowded-ui-20260923",
    "src-steam-news-ag27-hide-hud-20260923",
    "src-steam-news-st11-ui-20260923",
    "src-steam-discussions-index-20260923",
  ],
  related_slugs: [
    "pax-autocratica-st11-patch-notes",
    "pax-autocratica-performance",
    "pax-autocratica-ultrawide-blurry",
    "pax-autocratica-community",
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index",
};

replaceOrPush(data.pages, page);

for (const relatedSlug of [
  "pax-autocratica-st11-patch-notes",
  "pax-autocratica-performance",
  "pax-autocratica-ultrawide-blurry",
  "pax-autocratica-community",
]) {
  const related = data.pages.find((candidate) => candidate.slug === relatedSlug);
  if (related) {
    related.related_slugs ||= [];
    uniquePush(related.related_slugs, slug);
  }
}

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const statusGroup = guide.groups.find((group) => group.title === "Access, media and current status");
  if (statusGroup && !statusGroup.slugs.includes(slug)) {
    const index = statusGroup.slugs.indexOf("pax-autocratica-performance");
    if (index >= 0) statusGroup.slugs.splice(index + 1, 0, slug);
    else statusGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, crowded UI and HUD clutter, soldiers fighting in base, soundtrack and OST status, Linux and Proton support boundaries, revive behavior, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-23"];
}
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica crowded UI, hide HUD, mission objectives, resource feed, UI clutter, ST-11 patch, soldiers fighting in base, soundtrack, Linux support, performance, Early Access";
}
if (data.site) data.site.version = "local-pending-crowded-ui";
data.generated_at = checkedAt;

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260923-crowded-ui",
  intent_type: "ui_clutter_status_and_report_path",
  user_job:
    "Help players decide what they can do when the Pax Autocratica base HUD, objectives or resource feed clutter the screen.",
  intent_evidence_ids: [
    "src-steam-discussion-crowded-ui-20260923",
    "src-steam-news-ag27-hide-hud-20260923",
    "src-steam-news-st11-ui-20260923",
  ],
  answerability: "resolved_as_current_status_and_reporting_boundary",
  coverage: [
    {
      dimension: "player_task",
      status: "covered",
      claim_ids: ["claim-crowded-ui-current-question-20260923"],
      evidence_relation: "current_steam_discussion_question",
      notes: "The current Steam thread asks how to clean up the base UI when resource feed and mission objectives cover useful screen space.",
    },
    {
      dimension: "official_hide_hud_feature",
      status: "covered",
      claim_ids: ["claim-crowded-ui-ag27-hide-hud-20260923"],
      evidence_relation: "official_patch_note",
      notes: "AG-27 says the ESC menu can temporarily hide all HUD elements for cleaner screenshots or recordings.",
    },
    {
      dimension: "current_ui_improvements",
      status: "covered",
      claim_ids: ["claim-crowded-ui-st11-layout-20260923"],
      evidence_relation: "latest_official_patch_context",
      notes: "ST-11 includes UI layout improvements but does not claim a full objective/resource-feed clutter fix.",
    },
    {
      dimension: "permanent_widget_toggle",
      status: "blocked",
      claim_ids: ["claim-crowded-ui-boundary-20260923"],
      evidence_relation: "not_published",
      notes: "No captured source proves a permanent toggle for each base overlay or mission-objective feed.",
    },
  ],
  source_links: [
    {
      label: "Steam discussion: crowded ui",
      url: "https://steamcommunity.com/app/1067360/discussions/0/564794693657821241/",
      source_type: "community_question_with_moderator_reply",
    },
    {
      label: "Steam News API: official Pax Autocratica announcements",
      url: "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json",
      source_type: "official_steam_news",
    },
    {
      label: "Steam discussions index",
      url: "https://steamcommunity.com/app/1067360/discussions/0/",
      source_type: "community_index",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-crowded-ui",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct UI clutter and hide-HUD task, separate from ultrawide rendering, performance, and generic patch notes.",
};

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-crowded-ui-20260923",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica gameplay scene used for the crowded UI and HUD clutter guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason:
    "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason:
    "Shows the game interface context for a page about HUD visibility and UI clutter without inventing a new screenshot.",
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

- [Steam discussion: crowded ui](https://steamcommunity.com/app/1067360/discussions/0/564794693657821241/)
- [Steam News API: Pax Autocratica announcements](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=20&maxlength=0&format=json)
- [Steam discussions index](https://steamcommunity.com/app/1067360/discussions/0/)

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

console.log(JSON.stringify({
  slug,
  url: `${baseUrl}/${slug}/`,
  checkedAt,
  sitemapUrls: sitemapUrls.length,
  pages: data.pages.length,
}, null, 2));
