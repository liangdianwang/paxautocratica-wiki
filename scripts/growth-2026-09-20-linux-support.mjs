import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataPath = path.join(root, "public", "site-data.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const contentPath = path.join(root, "content", "en", "pax-autocratica-linux-support.mdx");
const checkedAt = "2026-09-20T09:18:00+08:00";
const runDate = "2026-09-20";
const baseUrl = "https://paxautocratica.vip";
const slug = "pax-autocratica-linux-support";

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
  "claim-linux-not-officially-supported-20260920",
  "claim-linux-community-submissions-20260920",
  "claim-linux-five-valid-submissions-guide-20260920",
  "claim-steam-store-windows-requirements-20260920",
  "claim-steamos-deck-compatibility-boundary-20260920",
  "claim-protondb-reference-available-20260920",
];

const linuxPage = {
  keyword: "Pax Autocratica Linux Support",
  slug,
  seo: {
    title: "Pax Autocratica Linux Support: Proton, SteamOS and Deck Boundary",
    description:
      "A source-backed Pax Autocratica Linux support guide explaining the current unofficial Proton/Wine status, SteamOS and Steam Deck checks, and what not to treat as official support.",
  },
  direct_answer:
    "Pax Autocratica does not currently have official Linux support in the captured sources. The current Steam store system requirements list Windows 10 64-bit, while a pinned Steam discussion says Linux players may be running the game through Proton, Wine or other workarounds and asks them to submit setups. Treat Linux, Proton and SteamOS guidance as community-submitted and used at your own risk until Multiverse publishes a dated official Linux support statement or a verified guide. Use the Steam store, Steam Deck/SteamOS compatibility notes, ProtonDB, and the pinned Steam thread as checkpoints, not as a promise that every command or workaround is safe.",
  direct_answer_claim_ids: claimIds,
  sections: [
    {
      heading: "Current support status",
      paragraphs: [
        "The strongest current boundary is the pinned Steam discussion titled Unofficial Linux Support is LIVE. It says Linux is not officially supported and frames Proton, Wine and other workarounds as community territory.",
        "The Steam store capture still provides Windows system requirements rather than a native Linux requirement table. That means a Linux player should not read community success reports as a formal platform guarantee.",
      ],
      steps: [
        "Check the live Steam store first for the official platform and system requirement baseline.",
        "Use the pinned Steam thread for the current community submission route.",
        "Do not treat a Proton command, Wine prefix or launch option as official unless it appears in a dated official note.",
      ],
      claim_ids: [
        "claim-linux-not-officially-supported-20260920",
        "claim-steam-store-windows-requirements-20260920",
      ],
    },
    {
      heading: "How to verify before you buy or troubleshoot",
      paragraphs: [
        "The safe path is to separate three questions: whether Steam says your device can start the game, whether ProtonDB or the community has reports for App ID 1067360, and whether your own setup reproduces those reports.",
        "The store page exposes Steam Deck and SteamOS compatibility metadata, but the captured page does not turn that into official Linux support. Use compatibility notes to decide what to test, not to skip testing.",
      ],
      steps: [
        "Confirm Pax Autocratica App ID 1067360 on Steam.",
        "Check the Steam Deck or SteamOS compatibility panel in your own Steam client or store page.",
        "Open ProtonDB for App ID 1067360 and look for recent reports, not just old ratings.",
        "If you already own the game, test a clean launch, text input, controller behavior and one short expedition before applying workaround commands.",
      ],
      claim_ids: [
        "claim-steamos-deck-compatibility-boundary-20260920",
        "claim-protondb-reference-available-20260920",
      ],
    },
    {
      heading: "What to submit to the community thread",
      paragraphs: [
        "The pinned thread asks Linux players to share their setup, workarounds and issues. It also says the author will not test or verify submitted commands, fixes, configurations or workarounds.",
        "That makes specificity important. A useful report should let another Linux user judge whether the workaround applies to their device without copying a risky command blindly.",
      ],
      steps: [
        "List distribution, kernel, desktop/session, GPU, driver branch and Steam runtime details.",
        "Name the Proton or Wine version and whether you used a clean prefix.",
        "Say whether the game launched, loaded a save, accepted text input, handled controller input and survived one expedition.",
        "Describe issues separately: launch failure, unreadable text, keyboard input, controller config, performance, crash or save problem.",
        "Avoid sharing private logs, account tokens, credentials or commands you do not understand.",
      ],
      claim_ids: [
        "claim-linux-community-submissions-20260920",
      ],
    },
    {
      heading: "When an unofficial guide may appear",
      paragraphs: [
        "The pinned Steam post says an unofficial Linux guide may be compiled after at least five valid, unique submissions arrive. It also says the guide should be treated as community-maintained, not official Linux support.",
        "Until that guide exists and can be checked, this page should stay conservative: point players to the submission route, record the support boundary, and avoid publishing unverified shell commands.",
      ],
      steps: [
        "Watch the pinned Steam thread for the unofficial guide announcement.",
        "Prefer reports that include device, distro and Proton version details.",
        "Recheck the page after any official update, SteamOS compatibility change or published community guide.",
      ],
      claim_ids: [
        "claim-linux-five-valid-submissions-guide-20260920",
      ],
    },
    {
      heading: "Evidence boundary",
      paragraphs: [
        "This page does not certify Linux compatibility, Steam Deck Playable status, a Proton version, a launch option, a performance target or a safe workaround command. The captured evidence supports only a current official-store Windows baseline, a community Linux collection effort and a ProtonDB reference.",
        "If Multiverse publishes native Linux support, a verified Proton recommendation or an official troubleshooting article, replace this boundary with the dated official source.",
      ],
      steps: [
        "Use this page as a decision checklist, not a command recipe.",
        "Use the performance page for FPS, heat, crash and loading issues.",
        "Use the community page when you need the official hub or broader support routes.",
      ],
      claim_ids: [
        "claim-linux-not-officially-supported-20260920",
        "claim-protondb-reference-available-20260920",
      ],
    },
  ],
  faq: [
    {
      question: "Does Pax Autocratica officially support Linux right now?",
      answer:
        "Not in the captured sources. The pinned Steam thread says Linux is not officially supported, while the Steam store capture still lists Windows requirements.",
      claim_ids: [
        "claim-linux-not-officially-supported-20260920",
        "claim-steam-store-windows-requirements-20260920",
      ],
    },
    {
      question: "Can Proton or Wine still work?",
      answer:
        "Possibly for some users, but the captured source frames Proton, Wine and other workarounds as community-submitted. Check recent reports and test your own setup carefully.",
      claim_ids: [
        "claim-linux-community-submissions-20260920",
        "claim-protondb-reference-available-20260920",
      ],
    },
    {
      question: "Is there an official Linux guide?",
      answer:
        "No official Linux guide was captured. The pinned Steam thread says an unofficial community guide may be compiled after five valid, unique submissions.",
      claim_ids: [
        "claim-linux-five-valid-submissions-guide-20260920",
      ],
    },
    {
      question: "Should I copy commands from comments?",
      answer:
        "No. The thread explicitly says submitted commands and configurations will not be verified by the collector. Treat them as risk-bearing community notes, not official fixes.",
      claim_ids: [
        "claim-linux-community-submissions-20260920",
      ],
    },
  ],
  source_ids: [
    "src-steam-discussion-linux-support-20260920",
    "src-steam-store-20260920",
    "src-protondb-20260920",
    "src-steam-discussions-index-20260920",
  ],
  related_slugs: [
    "pax-autocratica-performance",
    "pax-autocratica-community",
    "pax-autocratica-demo",
    "pax-autocratica-mods",
  ],
  parent_category: "Guide",
  updated_at: checkedAt,
  time_sensitivity: "changing",
  page_status: "publish",
  index_status: "index",
};

replaceOrPush(data.pages, linuxPage);

const guide = data.blueprint.categories.find((category) => category.slug === "guide");
if (guide) {
  const statusGroup = guide.groups.find((group) => group.title === "Access, media and current status");
  if (statusGroup) {
    const after = "pax-autocratica-performance";
    if (!statusGroup.slugs.includes(slug)) {
      const index = statusGroup.slugs.indexOf(after);
      if (index >= 0) statusGroup.slugs.splice(index + 1, 0, slug);
      else statusGroup.slugs.push(slug);
    }
  }
  replaceOrPush(guide.pages, { keyword: linuxPage.keyword, slug });
}

if (data.home?.meta) {
  data.home.meta.description =
    "A source-backed Pax Autocratica wiki with practical guides to gameplay, Linux and Proton support boundaries, revive behavior, performance checks, Supreme Powers petition status, overworked soldiers, ST-11 patch changes, ultrawide visuals, save wipe and 1.0 progress, Sector 3 final boss prep, capture mechanics, demo access, price checks, videos, community links, and current Early Access questions.";
}
if (data.home?.hero?.stats) {
  data.home.hero.stats = ["Windows on Steam", "Steam App ID 1067360", "Updated 2026-09-20"];
}
if (data.metadata) {
  data.metadata.description = data.home?.meta?.description || data.metadata.description;
  data.metadata.keywords =
    "Pax Autocratica wiki, Pax Autocratica Linux support, Proton, Wine, SteamOS, Steam Deck, ProtonDB, unofficial Linux guide, Pax Autocratica performance, ST-11 patch, Early Access, gameplay, demo, price, trailer, mods, community";
}
if (data.site) data.site.version = "local-pending-linux-support";
data.generated_at = checkedAt;

data.pageProvenance ||= {};
data.pageProvenance[slug] = {
  intent_id: "intent-20260920-linux-support",
  intent_type: "platform_compatibility_boundary",
  user_job:
    "Help Linux, Proton and Steam Deck users understand what is official, what is community-submitted, and how to verify Pax Autocratica safely.",
  intent_evidence_ids: [
    "src-steam-discussion-linux-support-20260920",
    "src-steam-store-20260920",
    "src-protondb-20260920",
    "src-steam-discussions-index-20260920",
  ],
  answerability: "resolved_as_support_boundary_and_verification_checklist",
  coverage: [
    {
      dimension: "official_linux_status",
      status: "covered",
      claim_ids: [
        "claim-linux-not-officially-supported-20260920",
        "claim-steam-store-windows-requirements-20260920",
      ],
      evidence_relation: "pinned_steam_thread_plus_store_requirements",
      notes:
        "The Steam thread says Linux is not officially supported; the Steam store still exposes Windows requirements.",
    },
    {
      dimension: "community_submission_route",
      status: "covered",
      claim_ids: [
        "claim-linux-community-submissions-20260920",
        "claim-linux-five-valid-submissions-guide-20260920",
      ],
      evidence_relation: "pinned_steam_thread",
      notes:
        "The collector asks for Linux setups and says an unofficial guide may be compiled after five valid unique submissions.",
    },
    {
      dimension: "steam_deck_steamos_boundary",
      status: "covered",
      claim_ids: ["claim-steamos-deck-compatibility-boundary-20260920"],
      evidence_relation: "steam_store_hardwarecompatibility_metadata",
      notes:
        "The store page contains Steam Deck and SteamOS compatibility metadata, but this does not become official Linux support.",
    },
    {
      dimension: "verified_workaround_commands",
      status: "blocked",
      claim_ids: ["claim-linux-community-submissions-20260920"],
      evidence_relation: "explicit_unverified_boundary",
      notes:
        "The pinned thread says submitted commands, fixes and configurations will not be verified by the collector.",
    },
  ],
  source_links: [
    {
      label: "Steam discussion: Unofficial Linux Support is LIVE",
      url: "https://steamcommunity.com/app/1067360/discussions/0/84031737849528194/",
      source_type: "official_community_boundary",
    },
    {
      label: "Pax Autocratica Steam store",
      url: "https://store.steampowered.com/app/1067360/Pax_Autocratica/",
      source_type: "official_store",
    },
    {
      label: "ProtonDB: Pax Autocratica",
      url: "https://www.protondb.com/app/1067360",
      source_type: "community_compatibility_reference",
    },
    {
      label: "Steam General Discussions",
      url: "https://steamcommunity.com/app/1067360/discussions/",
      source_type: "community_context",
    },
  ],
  last_checked_at: checkedAt,
  quality_review_id: "q01-pax-autocratica-linux-support",
  status: "publish",
  depth_variance_reason:
    "The page answers a distinct platform compatibility and risk-boundary task using a pinned Steam thread, live Steam store platform evidence and ProtonDB reference without publishing unverified commands.",
};

replaceOrPush(data.media, {
  asset_id: "pax-autocratica-linux-support-20260920",
  page: `/${slug}`,
  role: "hero",
  public_path: "/media/pax-autocratica-guide-02.webp",
  alt: "Pax Autocratica gameplay scene used for the Linux and Proton support boundary guide",
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
    "Supports a platform compatibility guide without inventing a Linux-specific screenshot.",
}, (item) => item.asset_id);

fs.writeFileSync(siteDataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

const mdx = `# ${linuxPage.keyword}

${linuxPage.direct_answer}

${linuxPage.sections.map((section) => {
  const body = section.paragraphs.join("\n\n");
  const steps = section.steps?.length ? `\n\n${section.steps.map((step) => `1. ${step}`).join("\n")}` : "";
  return `## ${section.heading}\n\n${body}${steps}`;
}).join("\n\n")}

## FAQ

${linuxPage.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}

## Sources

- [Steam discussion: Unofficial Linux Support is LIVE](https://steamcommunity.com/app/1067360/discussions/0/84031737849528194/)
- [Pax Autocratica Steam store](https://store.steampowered.com/app/1067360/Pax_Autocratica/)
- [ProtonDB: Pax Autocratica](https://www.protondb.com/app/1067360)
- [Steam General Discussions](https://steamcommunity.com/app/1067360/discussions/)

Last checked: ${checkedAt}
`;
fs.writeFileSync(contentPath, mdx, "utf8");

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
fs.writeFileSync(sitemapPath, sitemap, "utf8");

console.log(JSON.stringify({
  slug,
  url: `${baseUrl}/${slug}/`,
  checkedAt,
  sitemapUrls: sitemapUrls.length,
  pages: data.pages.length,
}, null, 2));
