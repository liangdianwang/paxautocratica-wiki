import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-supreme-powers-petition.mdx");

const checkedAt = "2026-09-17T09:18:00+08:00";
const slug = "pax-autocratica-supreme-powers-petition";
const url = `https://paxautocratica.vip/${slug}/`;

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
  "claim-supreme-powers-official-petition-20260917",
  "claim-supreme-powers-feedback-boundary-20260917",
  "claim-supreme-powers-safety-rules-20260917",
  "claim-supreme-powers-community-ideas-20260917",
  "claim-supreme-powers-not-shipped-20260917"
];

const page = {
  keyword: "Pax Autocratica Supreme Powers Petition",
  slug,
  seo: {
    title: "Pax Autocratica Supreme Powers Petition: What It Means",
    description: "A source-backed guide to the Pax Autocratica Supreme Powers petition: what Multiverse is asking for, how to submit useful ideas, and what is not confirmed yet."
  },
  direct_answer:
    "The Pax Autocratica Supreme Powers petition is an official Multiverse feedback thread asking players what extra policies, interactions, re-education methods, buildings, traits or absurd State mechanisms they want to see. It is a live Early Access suggestion channel, not a shipped feature list. Use it to submit fictional, game-world ideas and to understand what the community is asking for, but do not treat player comments as confirmed roadmap items until a dated official update turns them into playable content.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "What the Supreme Powers petition is",
      paragraphs: [
        "Multiverse opened the Steam discussion as a developer post and the discussion index currently keeps it pinned. The same prompt also appears inside the official Auroria Day #1 Steam announcement, which makes the feedback request a first-party source rather than a random forum thread.",
        "The useful player answer is simple: this is where the team is collecting ideas for future authority, policy and colony-control systems. It does not mean those ideas are already in your current save, and it does not replace patch notes when you need to know what is actually playable."
      ],
      steps: [
        "Open the pinned Steam discussion before posting or quoting the prompt.",
        "Read the original developer text, not just replies or reposts.",
        "Check later Steam News posts before calling any suggestion a confirmed feature."
      ],
      claim_ids: [
        "claim-supreme-powers-official-petition-20260917",
        "claim-supreme-powers-not-shipped-20260917"
      ]
    },
    {
      heading: "What ideas the team is asking for",
      paragraphs: [
        "The prompt asks for additional powers that would help players become the Leader they want to be. It names policies, interactions, re-education methods, buildings, traits and unreasonable State mechanisms as examples, and it explicitly invites satirical, bureaucratic and authoritarian fiction inside the game's universe.",
        "That scope is broader than a normal bug report. A useful suggestion should describe the player action, the in-game cost or tradeoff, the kind of citizen or soldier it affects, and why it fits the colony sim or expedition loop."
      ],
      steps: [
        "State the proposed power or policy in one clear sentence.",
        "Explain where it would live: colony building, decree, soldier management, expedition, trait, crisis or reward.",
        "Add the tradeoff so it does not read like a pure cheat button.",
        "Tie the idea back to Pax Autocratica's satire rather than real-world politics."
      ],
      claim_ids: [
        "claim-supreme-powers-feedback-boundary-20260917"
      ]
    },
    {
      heading: "What players are already suggesting",
      paragraphs: [
        "The first visible comment page shows a wide spread of community ideas: recruitable bosses or heroes with progression, planet-scale consequences, bureaus or ethics presets, unit archives, faction-targeted propaganda, production-enhancer changes, pillories, soldier uniforms, arenas, trait-editing or re-education systems, advisors, shooting ranges and ways to send soldiers to other fronts.",
        "Use those replies as demand signals, not proof. They show which fantasies and pain points players are bringing to the table, but every specific mechanic still needs official confirmation before it belongs in a mechanics guide."
      ],
      steps: [
        "Look for repeated themes such as progression, more control, soldier identity, re-education and base politics.",
        "Do not copy another player's full pitch into your own post.",
        "Do not describe a reply as planned unless Multiverse answers or later ships it."
      ],
      claim_ids: [
        "claim-supreme-powers-community-ideas-20260917",
        "claim-supreme-powers-not-shipped-20260917"
      ]
    },
    {
      heading: "Rules and safety boundary",
      paragraphs: [
        "The developer post draws a clear line around the fiction. Ideas should stay inside the fictional universe of Pax Autocratica. The post says not to submit real-world hate, extremist content, real-world political attacks or calls for violence against real people.",
        "That boundary matters because the game's premise is intentionally authoritarian satire. A good post can be absurd and cruel to fictional citizens while still avoiding real groups, current politics or real violence."
      ],
      steps: [
        "Keep the idea about fictional citizens, factions, enemies, disasters or bureaucracy.",
        "Avoid real-world groups, parties, movements and identities.",
        "Write the mechanic as a game system with limits, cost and player-facing consequence.",
        "If the idea needs a disclaimer to be safe, simplify it or do not post it."
      ],
      claim_ids: [
        "claim-supreme-powers-safety-rules-20260917"
      ]
    },
    {
      heading: "How this differs from the roadmap",
      paragraphs: [
        "The roadmap page tracks future-facing features that have a stronger official planning boundary. The Supreme Powers petition is earlier in the funnel: it is a listening post for ideas. The team may read, combine, reject or later adapt suggestions, and the Auroria Day announcement says some previous Core Fragment ideas may eventually become real Core Fragments.",
        "So the right mental model is pipeline, not promise. Feedback can influence future design, but the page should only change from petition status to feature status when a dated official post, patch note or store update confirms it."
      ],
      steps: [
        "Use this page for the active suggestion thread.",
        "Use the roadmap page for future feature expectations.",
        "Use patch-note pages for features that are already shipped."
      ],
      claim_ids: [
        "claim-supreme-powers-feedback-boundary-20260917",
        "claim-supreme-powers-not-shipped-20260917"
      ]
    },
    {
      heading: "When to recheck",
      paragraphs: [
        "Recheck the petition when the pinned thread closes, when Multiverse posts a follow-up, when a later maintenance directive references one of the suggested systems, or when the comment count changes enough to reveal a new repeated theme.",
        "Until then, the page should stay narrow: official prompt, safe posting rules, visible community themes and the promise boundary. It should not rank every suggestion or publish a fake list of upcoming Supreme Powers."
      ],
      steps: [
        "Update only from Steam News, the pinned developer thread, or a clear developer reply.",
        "Keep player replies grouped as themes rather than confirmed systems.",
        "Remove stale wording if the thread is unpinned or replaced by a new event."
      ],
      claim_ids: [
        "claim-supreme-powers-official-petition-20260917",
        "claim-supreme-powers-not-shipped-20260917"
      ]
    }
  ],
  faq: [
    {
      question: "Are Supreme Powers already in the game?",
      answer: "Not from this petition alone. The thread is an official suggestion request, not proof that the listed ideas are playable.",
      claim_ids: [
        "claim-supreme-powers-not-shipped-20260917"
      ]
    },
    {
      question: "Who posted the petition?",
      answer: "The captured Steam thread is posted by Multiverse with a developer badge, and the discussion is pinned on the Steam discussion index.",
      claim_ids: [
        "claim-supreme-powers-official-petition-20260917"
      ]
    },
    {
      question: "What kind of ideas should I submit?",
      answer: "Submit fictional in-universe systems such as policies, interactions, buildings, traits, re-education methods or absurd bureaucracy, with a clear cost and gameplay role.",
      claim_ids: [
        "claim-supreme-powers-feedback-boundary-20260917"
      ]
    },
    {
      question: "Can I post real political content?",
      answer: "No. The developer rules say to keep ideas inside the fictional Pax Autocratica universe and avoid real-world hate, extremist content, political attacks or calls for real violence.",
      claim_ids: [
        "claim-supreme-powers-safety-rules-20260917"
      ]
    }
  ],
  source_ids: [
    "src-steam-discussion-supreme-powers-20260917",
    "src-steam-news-auroria-day-20260917",
    "src-steam-discussions-index-20260917",
    "src-steam-store-20260917"
  ],
  related_slugs: [
    "pax-autocratica-roadmap",
    "pax-autocratica-auroria-day-reward",
    "pax-autocratica-custom-colony-settings",
    "pax-autocratica-community"
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index"
};

replaceOrPush(data.pages, page);

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const statusGroup = guide.groups.find((group) => group.title === "Access, media and current status");
  if (statusGroup) {
    uniquePush(statusGroup.slugs, slug, (value) => value);
  }
  replaceOrPush(guide.pages, { keyword: page.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, roadmap status, expeditions, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-17"];
}
if (data.metadata) {
  data.metadata.description = data.home.meta.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica guides, Supreme Powers petition, policies, re-education, buildings, traits, Early Access feedback, overworked soldiers, work hours, ultrawide blurry, save wipe, Sector 3 final boss, roadmap, gameplay, capture mechanics, expeditions, demo, price, trailer, mods, community";
}

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260917-supreme-powers-petition",
  intent_type: "official_feedback_event",
  user_job: "Understand the official Supreme Powers petition, submit useful safe ideas, and avoid mistaking suggestions for shipped features.",
  intent_evidence_ids: [
    "src-steam-discussion-supreme-powers-20260917",
    "src-steam-news-auroria-day-20260917",
    "src-steam-discussions-index-20260917"
  ],
  answerability: "resolved_as_official_feedback_prompt_with_feature_boundary",
  coverage: [
    {
      dimension: "official_prompt",
      status: "covered",
      claim_ids: [
        "claim-supreme-powers-official-petition-20260917"
      ],
      evidence_relation: "developer_thread_and_official_news",
      notes: "The developer post is pinned in Steam Discussions and linked from the official Auroria Day Steam announcement."
    },
    {
      dimension: "submission_scope",
      status: "covered",
      claim_ids: [
        "claim-supreme-powers-feedback-boundary-20260917"
      ],
      evidence_relation: "official_prompt_text",
      notes: "The prompt names policies, interactions, re-education methods, buildings, traits and absurd State mechanisms."
    },
    {
      dimension: "community_demand_themes",
      status: "covered",
      claim_ids: [
        "claim-supreme-powers-community-ideas-20260917"
      ],
      evidence_relation: "visible_comment_page",
      notes: "The first visible comment page shows repeated demands around progression, control, soldier identity, re-education, arenas, trait editing and base politics."
    },
    {
      dimension: "feature_confirmation",
      status: "blocked",
      claim_ids: [
        "claim-supreme-powers-not-shipped-20260917"
      ],
      evidence_relation: "official_boundary",
      notes: "No current patch note confirms these suggestions as shipped features."
    }
  ],
  source_links: [
    {
      label: "Steam discussion: PETITION FOR ADDITIONAL SUPREME POWERS",
      url: "https://steamcommunity.com/app/1067360/discussions/0/500617242799544257/",
      source_type: "official_developer_thread"
    },
    {
      label: "Steam News API: Auroria Day #1 announcement",
      url: "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=10&maxlength=0&format=json",
      source_type: "official_announcement"
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
  quality_review_id: "q01-pax-autocratica-supreme-powers-petition",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct official feedback-event task with same-day developer thread and Steam News evidence while refusing to convert player suggestions into confirmed mechanics."
};

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-supreme-powers-petition-20260917",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-community-09.webp",
  alt: "Pax Autocratica community scene used for the Supreme Powers petition guide",
  width: 1920,
  height: 1080,
  status: "ready",
  source_page: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
  source_type: "official_store_screenshot",
  captured_at: checkedAt,
  identity_check: "pass",
  identity_check_reason: "Reuses an existing verified Steam App ID 1067360 screenshot already present in the site media registry.",
  relevance_reason: "Shows community-facing game context for a page about official feedback and future feature suggestions."
}, (item) => item.asset_id);

if (data.site) data.site.version = "local-pending-supreme-powers-petition";
data.generated_at = checkedAt;

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const publicPages = data.pages.filter((item) => item.page_status === "publish" && item.index_status === "index");
const lastmods = new Map([
  ["", "2026-09-17"],
  ["guide", "2026-09-17"],
  [slug, "2026-09-17"]
]);
for (const item of publicPages) {
  if (!lastmods.has(item.slug)) lastmods.set(item.slug, (item.updated_at || "").slice(0, 10) || "2026-08-14");
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://paxautocratica.vip/</loc><lastmod>${lastmods.get("")}</lastmod></url>\n  <url><loc>https://paxautocratica.vip/guide/</loc><lastmod>${lastmods.get("guide")}</lastmod></url>\n${publicPages.map((item) => `  <url><loc>https://paxautocratica.vip/${item.slug}/</loc><lastmod>${lastmods.get(item.slug)}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(sitemapPath, sitemap, "utf8");

const mdx = `# ${page.keyword}\n\n${page.direct_answer}\n\n${page.sections.map((section) => {
  const body = section.paragraphs.join("\n\n");
  const steps = section.steps?.length ? `\n\n${section.steps.map((step) => `1. ${step}`).join("\n")}` : "";
  return `## ${section.heading}\n\n${body}${steps}`;
}).join("\n\n")}\n\n## FAQ\n\n${page.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}\n\n## Sources\n\n- [Steam discussion: PETITION FOR ADDITIONAL SUPREME POWERS](https://steamcommunity.com/app/1067360/discussions/0/500617242799544257/)\n- [Steam News API: Auroria Day #1 announcement](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=1067360&count=10&maxlength=0&format=json)\n- [Steam General Discussions](https://steamcommunity.com/app/1067360/discussions/)\n- [Pax Autocratica Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)\n\nLast checked: ${checkedAt}\n`;
fs.writeFileSync(contentPath, mdx, "utf8");

console.log(JSON.stringify({ slug, url, checkedAt, pages: data.pages.length }, null, 2));
