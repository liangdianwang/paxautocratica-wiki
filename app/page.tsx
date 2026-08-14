import Link from "next/link";
import type { CSSProperties } from "react";
import siteData from "../public/site-data.json";
import { AdSlot, Footer, Header, MediaGallery } from "./components";

const home: any = siteData.home;
const homeProvenance: any = (siteData as any).homeProvenance || {};
const pages: any[] = siteData.pages || [];
const visiblePages = pages.filter((page: any) => page.page_status === "publish" && page.index_status === "index");
const appId = siteData.game?.app_ids?.find((item: any) => item.provider === "steam")?.value || "";
const favicon = siteData.site?.favicon_path || "/favicon.svg";
const homepageVideo = homeProvenance.homepage_video;
const heroBackground = (siteData.media || []).find((item: any) => item.page === "/" && item.role === "hero_background" && item.status === "ready" && item.public_path)?.public_path || "";
const steamUrl = appId ? `https://store.steampowered.com/app/${appId}/` : "";

function ctaHref(value: any, fallback: string) {
  if (value && typeof value === "object" && value.href) return value.href;
  const label = String(value || "").toLowerCase();
  if (/(steam|store|buy|purchase)/.test(label) && steamUrl) return steamUrl;
  if (/(youtube|trailer|video)/.test(label) && homepageVideo?.url) return homepageVideo.url;
  return fallback;
}

export default function Home() {
  const finalPrimary = home.finalCta.primary;
  const finalSecondary = home.finalCta.secondary;
  const heroStyle = heroBackground ? ({ "--hero-image": `url("${heroBackground}")` } as CSSProperties) : undefined;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.game?.name || "Game Wiki",
    url: siteData.site?.base_url || "http://localhost:3000",
    description: siteData.metadata?.description || "Evidence-backed game guides."
  }).replace(/</g, "\\u003c");
  return <main className="shell home-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    <Header />
    <section className="hero" style={heroStyle} data-hero-background={heroBackground || undefined}><div className="hero-grid container"><div className="hero-copy-block">
      <div className="eyebrow"><span className="eyebrow-signal" aria-hidden="true" />{home.hero.eyebrow}</div><h1><span>{home.hero.title}</span><em>STATE / FRONTIER / RECORD</em></h1><p className="hero-lede">{home.hero.description}</p>
      <div className="actions"><Link className="button" href={home.start.cards?.[0]?.href || "/guide"}>{home.hero.primaryCta}</Link><a className="button secondary" href={ctaHref(home.hero.secondaryCta, siteData.game?.official_url || "#about")} target="_blank" rel="noreferrer">{home.hero.secondaryCta || "Play / official site"}</a><Link className="button ghost" href="/guide">{home.hero.tertiaryCta || "Browse guides"}</Link></div>
      <div className="hero-source-row"><span>PRIMARY RECORD</span><a href={siteData.game?.official_url || "#about"} target="_blank" rel="noreferrer">OFFICIAL SITE ↗</a>{appId ? <a href={steamUrl} target="_blank" rel="noreferrer">STEAM APP {appId} ↗</a> : null}</div>
      <div className="stats hero-stats">{(home.hero.stats || []).map((stat: string) => <div className="stat" key={stat}><span className="stat-line" />{stat}</div>)}</div>
    </div><div className="hero-dossier"><div className="dossier-top"><span>FIELD DOSSIER</span><span>PA / {appId || "OPEN"}</span></div><img className="hero-seal" src={favicon} alt="" aria-hidden="true" /><div className="dossier-title">STATE APPARATUS<br /><span>FRONTIER LOG</span></div><MediaGallery route="/" /><div className="dossier-grid">{(home.aboutGame.stats || []).slice(0, 4).map((stat: any) => <div className="dossier-stat" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div><div className="dossier-foot"><span>LIVE SOURCE CHECKS</span><span>UPDATED {String(home.hero.stats?.[2] || "CURRENT").replace("Updated ", "")}</span></div></div></div></section>
    <section className="section home-video-section"><div className="container"><div className="section-head"><div><div className="section-kicker">WATCH THE GAME</div><h2>{home.hero.videoLabel || "Game video"}</h2></div><p>{homepageVideo?.title || "A game video selected for this site."}</p></div>{homepageVideo?.embed_url ? <div className="home-video-frame"><iframe data-home-video="true" src={homepageVideo.embed_url} title={homepageVideo.title || `${siteData.game?.name || "Game"} video`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : null}</div></section>
    <section className="section file-selector"><div className="container"><div className="section-head"><div><div className="section-kicker">SELECT A GUIDE</div><h2>{home.start.title}</h2></div><p>Start with the question you brought in. Each guide keeps its evidence boundary visible.</p></div><div className="cards file-cards">{home.start.cards.map((card: any) => <Link className="card file-card" href={card.href || "#"} key={card.number}><div className="file-card-top"><span>GUIDE {card.number}</span><span className="file-arrow" aria-hidden="true">↗</span></div><strong>{card.title}</strong><p>{card.description}</p><span className="file-card-link">OPEN GUIDE</span></Link>)}</div><AdSlot id="home-1" /></div></section>
    <section className="section briefing" id="about"><div className="container briefing-grid"><div className="briefing-copy"><div className="section-kicker">BRIEFING NOTE / 01</div><h2>{home.aboutGame.title}</h2>{home.aboutGame.paragraphs.map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}{home.aboutGame.cta ? <Link className="button ghost" href="/guide">{home.aboutGame.cta} ↗</Link> : null}</div><div className="briefing-ledger"><div className="ledger-label">IDENTITY CHECK</div>{home.aboutGame.stats.map((stat: any) => <div className="ledger-row" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div></div></section>
    <section className="section archive-section"><div className="container"><div className="section-head"><div><div className="section-kicker">THE GUIDE INDEX</div><h2>All published guides</h2></div><p>{visiblePages.length} focused guides are ready to use. Pick the question that matches what you want to do next.</p></div><div className="archive-grid">{visiblePages.map((page: any) => <Link className="archive-card" href={`/${page.slug}`} key={page.slug}><div className="archive-card-top"><span className="archive-card-route">PLAYER TOPIC</span><span className="file-arrow" aria-hidden="true">↗</span></div><strong>{page.keyword}</strong><p>{page.direct_answer}</p></Link>)}</div><AdSlot id="home-2" /></div></section>
    <section className="section final-cta"><div className="container final-cta-inner"><div><div className="section-kicker">NEXT ACTION</div><h2>{home.finalCta.title}</h2><p>{home.finalCta.description}</p></div><div className="actions"><Link className="button" href={(typeof finalPrimary === "object" && finalPrimary?.href) || home.start.cards?.[0]?.href || "/guide"}>{typeof finalPrimary === "string" ? finalPrimary : finalPrimary?.label || "Start with the guide"}</Link><a className="button secondary" href={ctaHref(finalSecondary, siteData.game?.official_url || "#about")} target="_blank" rel="noreferrer">{typeof finalSecondary === "string" ? finalSecondary : finalSecondary?.label || "Official game page"}</a></div></div></section>
    <Footer />
  </main>;
}
