import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const day = '2026-10-18';
const capturedAt = '2026-10-18T09:06:00+08:00';
const slug = 'pax-autocratica-camera-height-setting';
const url = `https://paxautocratica.vip/${slug}/`;
const run = path.resolve(root, '..', '..', 'growth-runs', day);
const source = path.join(run, 'sources');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(run, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', 'utf8');
const unique = (items, entry, key = x => x.slug) => { const i = items.findIndex(x => key(x) === key(entry)); if (i < 0) items.push(entry); else items[i] = entry; };

fs.mkdirSync(source, { recursive: true });
const announcement = `Steam Community, Oct 16 2026: DIRECTIVE OT-16: STATE MAINTENANCE. Added a First-Person Camera Height setting, allowing Leaders to customize the height of the first-person viewpoint for a visual experience better suited to their preferences.`;
const discussion = `Steam discussion “Camera too low?”: player asks “Can we raise our viewpoint please”. The moderator-marked answer says a feature is being tested that will allow players to adjust camera view in-game. The thread has 26 posts and was active again Oct 16.`;
fs.writeFileSync(path.join(source, 'steam-news-ot16.txt'), announcement + '\nSource: https://steamcommunity.com/app/1067360/allnews/\n', 'utf8');
fs.writeFileSync(path.join(source, 'steam-discussion-camera-too-low.txt'), discussion + '\nSource: https://steamcommunity.com/app/1067360/discussions/0/585056732983829915/\n', 'utf8');

const dataPath = path.join(root, 'public', 'site-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const page = {
  keyword: 'Pax Autocratica Camera Height Setting', slug,
  seo: { title: 'Pax Autocratica Camera Height Setting: Raise First-Person View', description: 'How to use the current First-Person Camera Height setting in Pax Autocratica, with the official patch boundary and the player problem it answers.' },
  direct_answer: 'Pax Autocratica now has a First-Person Camera Height setting. The October 16 OT-16 patch says it lets Leaders customize first-person viewpoint height. If the view feels too low, open the in-game settings and look for that named setting; change only that control, then retest the same scene. The public patch note does not state a numeric range, a default value, or a universal best height.',
  direct_answer_claim_ids: ['claim-ot16-camera-height-20261018'],
  sections: [
    { heading: 'Why this setting exists', paragraphs: ['Players have repeatedly described the first-person view as too low in the Steam discussion “Camera too low?”. That thread has a moderator-marked answer about testing an adjustable camera view. OT-16 now confirms the shipped First-Person Camera Height setting.', 'The official patch says the control customizes viewpoint height. It does not document whether it changes FOV, third-person camera, aiming behavior, collision, movement, or accessibility presets.'], steps: ['Update Pax Autocratica to the current build.', 'Open Settings while in-game and find First-Person Camera Height.', 'Change that one setting and revisit the same base or expedition scene.', 'Keep the result that makes the view comfortable without treating it as a required competitive setting.'], claim_ids: ['claim-ot16-camera-height-20261018'] },
    { heading: 'A safe way to test it', paragraphs: ['Use a repeatable scene so that UI scale, brightness, FOV, vignette and camera height are not all changed at once. If the result still feels wrong, record the scene and the setting state for a focused report instead of installing an unverified mod or editing files.', 'This is separate from the darkness-vignette page. OT-16 also adds a Vignette setting, but the patch gives no basis to say that camera height fixes edge darkening, ultrawide blur, performance, or every accessibility concern.'], steps: ['Note your current camera height before changing it.', 'Test in one stationary scene, then one combat/expedition scene.', 'If the problem remains, report the build and scene through the official support route.'], claim_ids: ['claim-ot16-camera-height-20261018'] },
    { heading: 'What this guide does not claim', paragraphs: ['This page does not invent slider values, keybinds, a preset name, a camera mod recommendation, or a guarantee that all players can remove the low-view feeling. It only records the setting named in OT-16 and the player task that prompted it.', 'Recheck this page if Multiverse publishes a more detailed control description or a later patch changes the setting.'], steps: ['Do not assume a number is optimal for every display or player.', 'Do not treat old discussion replies as newer than the live OT-16 patch.', 'Do not use this page as evidence about field of view or third-person camera.'], claim_ids: ['claim-ot16-camera-height-20261018'] }
  ],
  faq: [
    { question: 'Can I raise the first-person camera in Pax Autocratica?', answer: 'OT-16 adds a First-Person Camera Height setting. Open in-game settings and adjust that named control.' },
    { question: 'What is the best camera height?', answer: 'No official source captured today gives a recommended value or range. Test it in the same scene and use the height that is comfortable for you.' },
    { question: 'Does camera height fix the dark vignette?', answer: 'No. OT-16 names both settings, but does not say one fixes the other.' }
  ],
  page_status: 'publish', index_status: 'index', time_sensitivity: 'CURRENT', parent_category: 'Guide',
  related_slugs: ['pax-autocratica-darkness-vignette-screen', 'pax-autocratica-performance', 'pax-autocratica-crowded-ui'], updated_at: capturedAt
};
unique(data.pages, page);
const guide = data.blueprint.categories.find(x => x.slug === 'guide');
unique(guide.pages, { keyword: page.keyword, slug });
const group = guide.groups.find(x => x.title === 'Access, media and current status'); if (!group.slugs.includes(slug)) group.slugs.push(slug);
for (const relatedSlug of page.related_slugs) { const related = data.pages.find(x => x.slug === relatedSlug); if (related) { related.related_slugs ||= []; if (!related.related_slugs.includes(slug)) related.related_slugs.push(slug); } }
data.pageProvenance ||= {}; data.pageProvenance[slug] = { last_checked_at: capturedAt, source_links: [{ label: 'Steam Community: DIRECTIVE OT-16', url: 'https://steamcommunity.com/app/1067360/allnews/', source_type: 'official_announcement' }, { label: 'Steam discussion: Camera too low?', url: 'https://steamcommunity.com/app/1067360/discussions/0/585056732983829915/', source_type: 'community_demand' }], evidence_summary: 'OT-16 confirms the shipped First-Person Camera Height setting; a moderator-marked Steam thread independently documents the player task.', boundaries: ['No numeric range or keybind claimed.', 'No FOV, third-person, vignette, or performance claim.'] };
data.media ||= []; unique(data.media, { asset_id: 'pax-autocratica-camera-height-20261018', page: `/${slug}`, role: 'hero', public_path: '/media/pax-autocratica-guide-02.webp', alt: 'Pax Autocratica gameplay scene for the first-person camera height setting guide', width: 1920, height: 1080, status: 'ready', source_page: 'https://store.steampowered.com/app/1067360/Pax_Autocratica/', source_type: 'official_store_screenshot', captured_at: capturedAt, identity_check: 'pass', identity_check_reason: 'Reuses an existing verified Steam App ID 1067360 screenshot.', relevance_reason: 'Supports a camera-settings guide without inventing an in-game UI image.' }, x => x.asset_id);
data.home.hero.stats = data.home.hero.stats.map(x => x.startsWith('Updated ') ? 'Updated 2026-10-18' : x);
data.generated_at = capturedAt;
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
const mdx = `# ${page.keyword}\n\n${page.direct_answer}\n\n${page.sections.map(s => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}\n\n${s.steps.map((x,i) => `${i+1}. ${x}`).join('\n')}`).join('\n\n')}\n\n## FAQ\n\n${page.faq.map(x => `### ${x.question}\n\n${x.answer}`).join('\n\n')}\n\n## Sources\n\n- [Steam Community: DIRECTIVE OT-16](https://steamcommunity.com/app/1067360/allnews/)\n- [Steam discussion: Camera too low?](https://steamcommunity.com/app/1067360/discussions/0/585056732983829915/)\n\nLast checked: ${capturedAt}\n`;
fs.writeFileSync(path.join(root, 'content', 'en', `${slug}.mdx`), mdx, 'utf8');
const sitemap = [...data.pages].filter(x => x.page_status === 'publish' && x.index_status === 'index').map(x => `<url><loc>https://paxautocratica.vip/${x.slug}/</loc><lastmod>${x.slug === slug ? day : (x.updated_at || day).slice(0,10)}</lastmod></url>`);
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://paxautocratica.vip/</loc><lastmod>${day}</lastmod></url>\n<url><loc>https://paxautocratica.vip/guide/</loc><lastmod>${day}</lastmod></url>\n${sitemap.join('\n')}\n</urlset>\n`, 'utf8');
const sources = fs.readdirSync(source).sort().map(name => ({ name: `sources/${name}`, sha256: sha(fs.readFileSync(path.join(source,name))) }));
const base = { schema_version: 1, run_id: `pax-autocratica-${day}`, site_id: 'PaxAutocratica', captured_at: capturedAt, new_index_page_count: 1, new_index_pages: [{slug,url,title:page.keyword}], external_publication_count: 0 };
write('daily-state.json', {...base, timezone:'Asia/Shanghai', operator_enabled:true, status:'CONTENT_GENERATED_PENDING_BUILD_DEPLOY'});
write('source-watch.json', {...base, sources: [{source:'Steam official news', status:'PASS', action:'CREATE_CANDIDATE', url:'https://steamcommunity.com/app/1067360/allnews/'}, {source:'Steam discussion', status:'PASS', action:'CREATE_CANDIDATE', url:'https://steamcommunity.com/app/1067360/discussions/0/585056732983829915/'}, {source:'Reddit',status:'BLOCKED',reason:'403; not used as fact'}, {source:'YouTube',status:'NO_ACTION',reason:'No verified directly useful new video captured'}]});
write('source-content-actions.json', {captured_at:capturedAt,actions:[{source_id:'steam-news-ot16',disposition:'CREATE_CANDIDATE',affected_routes:[`/${slug}/`],evidence_urls:['https://steamcommunity.com/app/1067360/allnews/']},{source_id:'steam-discussion-camera-low',disposition:'CREATE_CANDIDATE',affected_routes:[`/${slug}/`],evidence_urls:['https://steamcommunity.com/app/1067360/discussions/0/585056732983829915/']} ]});
write('opportunity-candidates.json', {captured_at:capturedAt,candidates:[{slug,decision:'PASS',reason:'Distinct player task; official OT-16 claim plus independent recurring community demand; direct safe setting test.'}]});
write('opportunity-shortlist.json',{captured_at:capturedAt,selected:[slug]}); write('webcafe-plan.json',{status:'NOT_RUN_NO_AUTHENTICATED_EXPORT',reason:'No authenticated Web.Cafe evidence; no quota consumed.'}); write('page-decisions.json',{decisions:[{slug,action:'CREATE_L2_DETAIL',indexable:true}]});
write('change-manifest.json',{content_changes:[`Added /${slug}/`, 'Added Guide and related internal links, provenance and sitemap entry'],site_changes:[],no_change_site_reason:'No direct evidence justified template, measurement, ad, DNS, or forced-indexing changes.'});
write('search-performance.json',{status:'UNKNOWN',reason:'No authenticated GSC/analytics/Clarity export.'}); write('external-benchmark.json',{status:'UNKNOWN',providers:{similarweb:'UNAUTHENTICATED',webcafe:'UNAUTHENTICATED',aitdk:'UNAVAILABLE'},ad_revenue:'UNAUTHENTICATED'}); write('selected-backlink-targets.json',{targets:[],reason:'No user-approved external platform list.'});
write('source-capture-results.json',{captured_at:capturedAt,sources});
console.log(JSON.stringify({status:'generated',slug,run},null,2));
