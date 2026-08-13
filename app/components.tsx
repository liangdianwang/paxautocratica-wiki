import Link from "next/link";
import siteData from "../public/site-data.json";

export function Header() {
  const navigation = siteData.blueprint?.navigation || [];
  return <nav className="nav" aria-label="Primary navigation"><div className="container nav-inner">
    <Link className="brand" href="/" aria-label={`${siteData.game?.name || "Game Wiki"} home`}><span className="brand-mark" aria-hidden="true">{(siteData.game?.name || "G").slice(0, 1)}</span><strong>{siteData.game?.name || "Game Wiki"}</strong></Link>
    <div className="nav-links">{navigation.map((item: any) => <Link key={item.slug} href={`/${item.slug}`}>{item.name}</Link>)}</div>
  </div></nav>;
}

export function AdSlot({ id }: { id: string }) {
  if (!siteData.ads?.enabled) return null;
  return <aside className="ad-slot" data-ad-slot={id} data-provider={siteData.ads?.provider || "adsterra"} data-test-mode={String(siteData.ads?.test_mode !== false)} aria-label="Advertisement">
    <span>{siteData.ads?.test_mode === false ? "Advertisement" : "Adsterra test placeholder"}</span>
  </aside>;
}

export function MediaGallery({ route }: { route: string }) {
  const items = (siteData.media || []).filter((item: any) => item.status === "ready" && item.role !== "favicon" && item.page === route && item.public_path);
  if (!items.length) return null;
  return <div className="media-grid">{items.map((item: any) => <figure key={item.asset_id} className="media-card">
    <img data-asset-id={item.asset_id} src={item.public_path} alt={item.alt} width={item.width} height={item.height} loading={item.role === "hero" ? "eager" : "lazy"} />
  </figure>)}</div>;
}

export function Footer() {
  return <footer><div className="container footer-grid"><div><strong>{siteData.footer?.aboutTitle || `${siteData.game?.name || "Game"} Wiki`}</strong><p>{siteData.footer?.about || "An independent, source-backed game guide."}</p></div><div className="nav-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><div className="language-list" aria-label="Language priorities">{(siteData.languages || []).map((item: any) => <span key={item.code} lang={item.code}>{item.label}</span>)}</div></div></footer>;
}
