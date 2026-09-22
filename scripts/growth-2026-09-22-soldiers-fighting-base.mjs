import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-soldiers-fighting-base.mdx");
const checkedAt = "2026-09-22T09:18:00+08:00";
const runDate = "2026-09-22";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-soldiers-fighting-base";

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
  "claim-base-fighting-player-task-20260922",
  "claim-base-fighting-traits-reply-20260922",
  "claim-base-fighting-fear-loyalty-boundary-20260922",
  "claim-base-fighting-official-social-systems-20260922",
  "claim-base-fighting-no-hidden-formula-20260922",
  "claim-base-fighting-report-boundary-20260922",
];

const page = {
  keyword: "Pax Autocratica Soldiers Fighting In Base",
  slug,
  seo: {
    title: "Pax Autocratica Soldiers Fighting In Base: Traits and Fear Checks",
    description:
      "A source-backed Pax Autocratica guide for soldiers fighting in base: traits, fear, loyalty, work schedules, and when to treat it as a bug report.",
  },
  direct_answer:
    "When Pax Autocratica soldiers keep fighting in base, start with colony management checks rather than assuming the save is broken. A current Steam thread asks exactly how to stop soldiers injuring each other, and Gurttron replies that certain traits can cause more fights, so players should inspect soldier traits and remove people with traits they find displeasing. Other replies discuss fear, loyalty, free time and work assignment as likely pressure points. The official Steam store supports the broad system boundary because it says citizens are shaped by fears, loyalties, bonds and feuds, but no captured source publishes a hidden fight formula, exact fear threshold or guaranteed discipline setting.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "Start with traits",
      paragraphs: [
        "The strongest current answer comes from the Steam thread itself. The original question is not about combat AI in an expedition; it is about soldiers in the colony getting into fights, injuring each other, and whether the player is missing a discipline layer.",
        "Gurttron's reply points first to traits: certain traits can cause soldiers to get into more fights, and the player should look over those traits and remove people with traits they find displeasing. That makes traits the first reversible check before you rebuild facilities or punish half the base.",
      ],
      steps: [
        "Open the roster for the soldiers who keep starting or receiving fights.",
        "Compare their negative traits against calmer soldiers in the same colony.",
        "Separate repeat offenders from one-off incidents.",
        "Remove, reassign or avoid recruiting citizens with traits that repeatedly map to base fights.",
      ],
      claim_ids: ["claim-base-fighting-traits-reply-20260922"],
    },
    {
      heading: "Check fear and loyalty without inventing a threshold",
      paragraphs: [
        "Several community replies point toward fear, loyalty and social relationships, but the thread does not prove an exact number such as fear 60 or fear 80. One player reports heavy loyalty focus and short workdays yet still sees fighting, while another argues that fear can reduce discipline issues but can also backfire with some traits.",
        "Use those comments as a test route, not a formula. Pax Autocratica's official store copy says citizens can become grateful, afraid, loyal or rebellious, and that choices shape society. That supports fear and loyalty as real system language, but not a public fight equation.",
      ],
      steps: [
        "Record your fear and loyalty state before changing it.",
        "Change one pressure point at a time: fear, work hours, assignments or roster traits.",
        "Run at least one comparable colony day before judging the result.",
        "If a higher fear setup creates other problems, roll back instead of forcing it.",
      ],
      claim_ids: [
        "claim-base-fighting-fear-loyalty-boundary-20260922",
        "claim-base-fighting-official-social-systems-20260922",
      ],
    },
    {
      heading: "Use work schedule and free time as a second layer",
      paragraphs: [
        "The same discussion includes player observations about strict work windows, free time, friendships and locked work stations. Those are not official rules, but they make sense as practical tests because fights happen in the base layer, not only during expeditions.",
        "If soldiers fight at night or during idle windows, test schedule and assignment changes after checking traits. If the same worker is also Overworked or Exhausted, use the Overworked guide first so you do not mix a social conflict problem with a fatigue-status problem.",
      ],
      steps: [
        "Note when fights happen: work hours, free time, night, or immediately after expeditions.",
        "Compare locked-station workers with citizens who roam or socialize more often.",
        "Avoid changing every schedule setting at once.",
        "If fatigue statuses are present, retest after rest before blaming discipline.",
      ],
      claim_ids: [
        "claim-base-fighting-fear-loyalty-boundary-20260922",
        "claim-base-fighting-no-hidden-formula-20260922",
      ],
    },
    {
      heading: "When to report it as a bug",
      paragraphs: [
        "A fight every so often may be part of the colony social simulation; constant injury loops on supposedly compatible soldiers are different. Treat it as a bug report when the same pattern survives trait checks, schedule changes and rest, or when the same pair fights repeatedly for no readable reason.",
        "A useful report should include the build, day, involved traits, fear/loyalty level, work schedule, whether the soldiers were assigned or idle, and whether the behavior changes after reloading. That gives the team more than a broad complaint that everyone keeps fighting.",
      ],
      steps: [
        "Save before major roster or schedule changes.",
        "Capture the names, traits and current assignments of the fighters.",
        "Record the colony day, fear/loyalty situation and work-hour setup.",
        "Retest after reload or after one rest cycle.",
        "Use the Steam discussion/support route when the pattern is repeatable.",
      ],
      claim_ids: ["claim-base-fighting-report-boundary-20260922"],
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page does not claim a secret discipline formula, exact fear target, universal trait ban list, guaranteed punishment path or confirmed bug. It only turns the current evidence into a safe checklist: inspect traits first, test fear and schedule carefully, keep fatigue separate, and report repeatable patterns.",
        "Update this page if Multiverse publishes a dated patch note about base fights, traits, social conflict, citizen behavior or discipline systems. Until then, treat the guide as an Early Access troubleshooting path rather than a final mechanics table.",
      ],
      steps: [
        "Use the Steam thread for the current trait-focused answer.",
        "Use the Steam store for the broad social-system boundary.",
        "Use official patch notes for future confirmed changes.",
      ],
      claim_ids: ["claim-base-fighting-no-hidden-formula-20260922"],
    },
  ],
  faq: [
    {
      question: "Why do my soldiers keep fighting in the base?",
      answer:
        "The current best supported answer is to inspect traits first. Gurttron says certain traits can cause more fights, while community replies also point to fear, loyalty and schedule pressure.",
      claim_ids: ["claim-base-fighting-traits-reply-20260922"],
    },
    {
      question: "What fear level stops fights?",
      answer:
        "No captured source gives an exact safe threshold. Test fear changes carefully and watch for side effects, because some traits may react badly to high fear.",
      claim_ids: ["claim-base-fighting-fear-loyalty-boundary-20260922"],
    },
    {
      question: "Should I punish or remove fighting soldiers?",
      answer:
        "Do not start with punishment. First compare traits, schedules, assignments, fatigue and repeated offenders. Remove or reassign only after you can see a pattern.",
      claim_ids: ["claim-base-fighting-traits-reply-20260922"],
    },
    {
      question: "Is this definitely a bug?",
      answer:
        "Not automatically. Report it as a bug when it is repeatable after trait, schedule and rest checks, especially if supposedly compatible soldiers fight constantly.",
      claim_ids: ["claim-base-fighting-report-boundary-20260922"],
    },
  ],
  source_ids: [
    "src-steam-discussion-soldiers-fighting-base-20260922",
    "src-steam-store-social-systems-20260922",
    "src-steam-discussions-index-20260922",
  ],
  related_slugs: [
    "pax-autocratica-overworked-soldiers",
    "pax-autocratica-custom-colony-settings",
    "pax-autocratica-best-troops",
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
  "pax-autocratica-overworked-soldiers",
  "pax-autocratica-custom-colony-settings",
  "pax-autocratica-best-troops",
]) {
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
    const index = combatGroup.slugs.indexOf("pax-autocratica-overworked-soldiers");
    if (index >= 0) combatGroup.slugs.splice(index + 1, 0, slug);
    else combatGroup.slugs.push(slug);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, soldiers fighting in base, soundtrack and OST status, Linux and Proton support boundaries, revive behavior, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-22"];
}
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica soldiers fighting in base, soldier traits, fear, loyalty, overworked soldiers, soundtrack, OST, Linux support, ST-11 patch, Early Access, gameplay, demo, price, trailer, community";
}
if (data.site) data.site.version = "local-pending-soldiers-fighting-base";
data.generated_at = checkedAt;

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260922-soldiers-fighting-base",
  intent_type: "colony_social_conflict_troubleshooting",
  user_job:
    "Help players decide what to check when soldiers fight and injure each other inside the base.",
  intent_evidence_ids: [
    "src-steam-discussion-soldiers-fighting-base-20260922",
    "src-steam-store-social-systems-20260922",
  ],
  answerability: "resolved_as_current_troubleshooting_boundary",
  coverage: [
    {
      dimension: "player_task",
      status: "covered",
      claim_ids: ["claim-base-fighting-player-task-20260922"],
      evidence_relation: "current_steam_discussion_question",
      notes: "The current Steam thread asks how to keep soldiers from fighting and injuring each other in base.",
    },
    {
      dimension: "trait_check",
      status: "covered",
      claim_ids: ["claim-base-fighting-traits-reply-20260922"],
      evidence_relation: "gurttron_reply",
      notes: "Gurttron points to traits as a cause of more fights and says players should inspect/remove disliked traits.",
    },
    {
      dimension: "social_system_boundary",
      status: "covered",
      claim_ids: ["claim-base-fighting-official-social-systems-20260922"],
      evidence_relation: "steam_store_description",
      notes: "The official store describes citizens' fears, loyalties, bonds and feuds as part of the colony simulation.",
    },
    {
      dimension: "exact_formula",
      status: "blocked",
      claim_ids: ["claim-base-fighting-no-hidden-formula-20260922"],
      evidence_relation: "not_published",
      notes: "No captured source publishes exact fear thresholds, fight probabilities or a universal trait table.",
    },
  ],
  source_links: [
    {
      label: "Steam discussion: Soldiers Keep Fighting In Base",
      url: "https://steamcommunity.com/app/1067360/discussions/0/582807520276496982/",
      source_type: "community_question_with_moderator_reply",
    },
    {
      label: "Steam store: Pax Autocratica",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
    {
      label: "Steam discussions index",
      url: "https://steamcommunity.com/app/1067360/discussions/0/",
      source_type: "community_index",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-soldiers-fighting-base",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct base-management conflict task, not a troop tier, overwork or combat-control task.",
};

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-soldiers-fighting-base-20260922",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-home-01.webp",
  alt: "Pax Autocratica colony management scene used for the soldiers fighting in base guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason:
    "Reuses an existing verified Steam App ID 1067360 colony-management screenshot already present in the site media registry.",
  relevance_reason:
    "Shows the colony/base context where citizen traits, fear, loyalty and conflict management belong.",
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

- [Steam discussion: Soldiers Keep Fighting In Base](https://steamcommunity.com/app/1067360/discussions/0/582807520276496982/)
- [Steam store: Pax Autocratica](https://store.steampowered.com/app/1067360/Pax_Autocratica/)
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
