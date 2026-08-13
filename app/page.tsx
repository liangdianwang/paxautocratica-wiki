import Link from "next/link";
import siteData from "../public/site-data.json";
import { AdSlot, Footer, Header, MediaGallery } from "./components";

const home: any = siteData.home;
const pages: any[] = siteData.pages || [];

export default function Home() {
  const finalPrimary = home.finalCta.primary;
  const finalSecondary = home.finalCta.secondary;
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.game?.name || "Game Wiki",
    url: siteData.site?.base_url || "http://localhost:3000",
    description: siteData.metadata?.description || "Evidence-backed game guides."
  }).replace(/</g, "\\u003c");
  return <main className="shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    <Header />
    <section className="hero"><div className="container hero-grid"><div>
      <div className="eyebrow">{home.hero.eyebrow}</div><h1>{home.hero.title}</h1><p className="hero-copy">{home.hero.description}</p>
      <div className="actions"><Link className="button" href={home.start.cards?.[0]?.href || "/guide"}>{home.hero.primaryCta}</Link><a className="button secondary" href={siteData.game?.official_url || "#about"}>{home.hero.secondaryCta || "Play / official site"}</a></div>
      <div className="stats">{(home.hero.stats || []).map((stat: string) => <div className="stat" key={stat}>{stat}</div>)}</div>
    </div><MediaGallery route="/" /></div></section>
    <section className="section"><div className="container"><div className="eyebrow">{home.start.eyebrow}</div><h2>{home.start.title}</h2><div className="cards">{home.start.cards.map((card: any) => <Link className="card" href={card.href || "#"} key={card.number}><strong>{card.number}. {card.title}</strong><p>{card.description}</p></Link>)}</div><AdSlot id="home-1" /></div></section>
    <section className="section section-tint" id="about"><div className="container grid"><div><h2>{home.aboutGame.title}</h2>{home.aboutGame.paragraphs.map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}</div><div className="stats">{home.aboutGame.stats.map((stat: any) => <div className="stat" key={stat.label}><small className="muted">{stat.label}</small><br/><strong>{stat.value}</strong></div>)}</div></div></section>
    <section className="section"><div className="container"><h2>Latest guides</h2><div className="cards">{pages.filter((page: any) => page.page_status === "publish").slice(0, 6).map((page: any) => <Link className="card" href={`/${page.slug}`} key={page.slug}><strong>{page.keyword}</strong><p>{page.direct_answer}</p></Link>)}</div><AdSlot id="home-2" /></div></section>
    <section className="section final-cta"><div className="container"><h2>{home.finalCta.title}</h2><p>{home.finalCta.description}</p><div className="actions"><Link className="button" href={(typeof finalPrimary === "object" && finalPrimary?.href) || home.start.cards?.[0]?.href || "/guide"}>{typeof finalPrimary === "string" ? finalPrimary : finalPrimary?.label || "Start with the guide"}</Link><a className="button secondary" href={(typeof finalSecondary === "object" && finalSecondary?.href) || siteData.game?.official_url || "#about"}>{typeof finalSecondary === "string" ? finalSecondary : finalSecondary?.label || "Official game page"}</a></div></div></section>
    <Footer />
  </main>;
}
