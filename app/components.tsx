import Link from "next/link";
import siteData from "../public/site-data.json";
export { AdSlot } from "./ad-slot";

export function Header() {
  const navigation = siteData.blueprint?.navigation || [];
  const icon = siteData.site?.favicon_path || "/favicon.svg";
  return <nav className="nav" aria-label="Primary navigation"><div className="container nav-inner">
    <Link className="brand" href="/" aria-label={`${siteData.game?.name || "Game Wiki"} home`}>
      <span className="brand-mark"><img src={icon} alt="" aria-hidden="true" /></span>
      <span className="brand-copy"><strong>{siteData.game?.name || "Game Wiki"}</strong><small>FIELD DOSSIER / SOURCE-BACKED</small></span>
    </Link>
    <div className="nav-right"><div className="nav-links">{navigation.map((item: any) => <Link key={item.slug} href={`/${item.slug}`}>{item.name}</Link>)}</div><span className="nav-status"><i aria-hidden="true" />EARLY ACCESS LOG</span></div>
  </div></nav>;
}

function ExternalOrText({ value, label }: { value: string; label?: string }) {
  const text = label || value;
  return /^https?:\/\//i.test(value) ? <a href={value} target="_blank" rel="noreferrer">{text}</a> : <span>{value}</span>;
}

export function MediaGallery({ route }: { route: string }) {
  const items = (siteData.media || []).filter((item: any) => item.status === "ready" && item.role !== "favicon" && item.page === route && item.public_path);
  if (!items.length) return null;
  return <div className="media-grid">{items.map((item: any) => <figure key={item.asset_id} className="media-card">
    <img data-asset-id={item.asset_id} src={item.public_path} alt={item.alt} width={item.width} height={item.height} loading={item.role === "hero" ? "eager" : "lazy"} />
  </figure>)}</div>;
}

export function Footer() {
  const footer = siteData.footer || {};
  return <footer><div className="container footer-grid"><div><div className="footer-kicker">INDEPENDENT GUIDE / CHECK LIVE SOURCES</div><strong>{footer.aboutTitle || `${siteData.game?.name || "Game"} Guide`}</strong><p>{footer.about || "An independent, source-backed game guide."}</p><p>{(footer as any).description || ""}</p></div><div className="footer-links"><ExternalOrText value={footer.playGame || siteData.game?.official_url || "Official game"} label="Official site ↗" /><ExternalOrText value={footer.officialDiscord || "Official community"} label="Community links ↗" /><ExternalOrText value={footer.officialYoutube || "Official YouTube"} label="Official media ↗" /><ExternalOrText value={footer.communityTool || "Community resources"} label="Steam hub ↗" /><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><div className="language-list" aria-label="Published languages">{(siteData.languages || []).map((item: any) => <span key={item.code} lang={item.code}>{item.label}</span>)}</div></div></footer>;
}

function sourceTypeLabel(sourceType: string) {
  const labels: Record<string, string> = {
    official_store: "Official store",
    official_website: "Official website",
    official_video: "Official video",
    official_community: "Official community",
    community: "Community reference",
    review: "Review / hands-on",
  };
  return labels[sourceType] || "Reference";
}

export function Sources({ slug }: { slug: string }) {
  const provenance: any = ((siteData as any).pageProvenance || {})[slug];
  const links = provenance?.source_links || [];
  if (!links.length && !provenance?.last_checked_at) return null;
  return <section className="sources" aria-label="Sources"><div className="section-kicker">SOURCES</div><h2>Check the live references</h2><ul>{links.map((item: any) => <li key={`${item.url}-${item.label}`}><a href={item.url} target="_blank" rel="noreferrer">{item.label || item.source_type || "Source"}</a> <span className="muted">({sourceTypeLabel(item.source_type || "")})</span></li>)}</ul>{provenance?.last_checked_at ? <p className="last-checked">Last checked: {provenance.last_checked_at}</p> : null}</section>;
}

export function EvidenceRail({ slug }: { slug: string }) {
  const provenance: any = ((siteData as any).pageProvenance || {})[slug];
  const links = provenance?.source_links || [];
  const page: any = (siteData.pages || []).find((item: any) => item.slug === slug);
  const isIndexed = page?.page_status === "publish" && page?.index_status === "index";
  return <aside className="evidence-rail" aria-label="Guide status"><div className="section-kicker">GUIDE STATUS</div><div className={`status-stamp ${isIndexed ? "status-publish" : "status-draft"}`}>{isIndexed ? "VERIFIED GUIDE" : "NEEDS CONFIRMATION"}</div><p>{links.length || 0} source references checked.</p>{provenance?.last_checked_at ? <p className="rail-date">Checked {provenance.last_checked_at}</p> : null}<div className="rail-rule" /><span className="rail-note">Volatile details stay linked to live primary pages.</span></aside>;
}
