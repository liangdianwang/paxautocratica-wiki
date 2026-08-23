import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import siteData from "../../public/site-data.json";
import { AdSlot, EvidenceRail, Footer, Header, MediaGallery, Sources } from "../components";
import { absoluteRoute, routeHref } from "../routes";

export function generateStaticParams() {
  const detailParams = (siteData.pages || []).filter((page: any) => page.page_status === "publish" && page.index_status === "index").map((page: any) => ({ slug: page.slug.split("/") }));
  const categoryParams = (siteData.blueprint?.categories || []).map((category: any) => ({ slug: category.slug.split("/") }));
  const seen = new Set<string>();
  return [...categoryParams, ...detailParams].filter((item: any) => { const key = item.slug.join("/"); if (seen.has(key)) return false; seen.add(key); return true; });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const category: any = (siteData.blueprint?.categories || []).find((item: any) => item.slug === slug);
  const page: any = (siteData.pages || []).find((item: any) => item.slug === slug);
  const item: any = page || category;
  const displayName = item?.display_name || item?.name || siteData.game?.name || "Game Wiki";
  const image = (siteData.media || []).find((asset: any) => asset.page === `/${slug}` && asset.status === "ready" && asset.role !== "favicon" && asset.public_path)?.public_path;
  return {
    title: item?.seo?.title || displayName,
    description: item?.seo?.description || `Guides for ${displayName}.`,
    alternates: { canonical: routeHref(slug) },
    robots: page ? (page.page_status !== "publish" || page.index_status === "noindex" ? "noindex,follow" : "index,follow") : "index,follow",
    openGraph: { type: "article", title: item?.seo?.title || displayName, description: item?.seo?.description || `Guides for ${displayName}.`, url: routeHref(slug), images: image ? [{ url: image, alt: displayName }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary", title: item?.seo?.title || displayName, description: item?.seo?.description || `Guides for ${displayName}.`, images: image ? [image] : undefined }
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join("/");
  const route = `/${slug}`;
  const category: any = (siteData.blueprint?.categories || []).find((item: any) => item.slug === slug);
  const page: any = (siteData.pages || []).find((item: any) => item.slug === slug);
  const publicPageSlugs = new Set((siteData.pages || []).filter((item: any) => item.page_status === "publish" && item.index_status === "index").map((item: any) => item.slug));
  if (category && !page) {
    const pageBySlug = new Map((siteData.pages || []).map((item: any) => [item.slug, item]));
    const publishedItems = (category.pages || []).filter((item: any) => publicPageSlugs.has(item.slug)).map((item: any) => pageBySlug.get(item.slug) || item);
    const declaredGroups = Array.isArray(category.groups) ? category.groups : [];
    const groupedSlugs = new Set<string>();
    const groups = declaredGroups.map((group: any) => {
      const items = (group.slugs || []).map((itemSlug: string) => publishedItems.find((item: any) => item.slug === itemSlug)).filter(Boolean);
      items.forEach((item: any) => groupedSlugs.add(item.slug));
      return { ...group, items };
    }).filter((group: any) => group.items.length);
    const ungrouped = publishedItems.filter((item: any) => !groupedSlugs.has(item.slug));
    if (ungrouped.length) groups.push({ title: "More guides", description: "Additional source-backed answers for current player questions.", items: ungrouped });
    if (!groups.length) groups.push({ title: "All guides", description: category.lede, items: publishedItems });

    const displayName = category.display_name || category.name;
    const baseUrl = siteData.site?.base_url || "http://localhost:3000";
    const structuredData = JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: displayName, description: category.seo?.description, url: absoluteRoute(baseUrl, slug), mainEntity: { "@type": "ItemList", itemListElement: publishedItems.map((item: any, index: number) => ({ "@type": "ListItem", position: index + 1, name: item.keyword, url: absoluteRoute(baseUrl, item.slug) })) } }).replace(/</g, "\\u003c");
    return <main className="shell">
      <Header />
      <section className="section category-page"><div className="container">
        <div className="section-kicker">PAX AUTOCRATICA / WIKI GUIDES</div>
        <h1>{displayName}</h1>
        <p className="category-lede">{category.lede || "Browse focused, source-backed guides. Each route keeps its evidence boundary visible."}</p>
        <MediaGallery route={route} />
        <AdSlot id="aggregate-1" />
        <div className="category-groups">{groups.map((group: any) => <section className="category-group" key={group.title}>
          <div className="category-group-head"><div><div className="section-kicker">PLAYER TASKS</div><h2>{group.title}</h2></div><p>{group.description}</p></div>
          <div className="cards category-cards">{group.items.map((item: any, index: number) => <Link className="card file-card" href={routeHref(item.slug)} key={item.slug} data-analytics-event="internal_recommendation_click" data-analytics-placement="guide_hub"><div className="file-card-top"><span>GUIDE {String(index + 1).padStart(2, "0")}</span><span className="file-arrow" aria-hidden="true">↗</span></div><h3>{item.keyword}</h3><p>{item.seo?.description || item.direct_answer || "Read the focused answer and supporting steps."}</p><span className="file-card-link">OPEN GUIDE</span></Link>)}</div>
        </section>)}</div>
        <AdSlot id="aggregate-2" />
      </div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <Footer />
    </main>;
  }
  if (!page || page.page_status !== "publish" || page.index_status !== "index") notFound();
  const structuredData = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: page.keyword, description: page.seo?.description, dateModified: page.updated_at, mainEntityOfPage: absoluteRoute(siteData.site?.base_url || "http://localhost:3000", slug) }).replace(/</g, "\\u003c");
  const parent = (siteData.blueprint?.categories || []).find((item: any) => item.name === page.parent_category);
  return <main className="shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} /><Header /><section className="section detail-page"><div className="container detail-grid"><article className="prose"><div className="breadcrumbs"><Link href="/">Home</Link>{parent ? <> <span>/</span> <Link href={routeHref(parent.slug)}>{parent.display_name || parent.name}</Link></> : null}<span>/</span><span>{page.slug}</span></div><div className="detail-title-row"><div><div className="section-kicker">GUIDE / {page.time_sensitivity || "CURRENT"}</div><h1>{page.keyword}</h1></div></div><div className="direct-answer"><h3 className="answer-label">DIRECT ANSWER</h3><strong>{page.direct_answer}</strong></div><MediaGallery route={route} /><AdSlot id="detail-1" />{page.sections.map((section: any, index: number) => <section className="detail-section" key={section.heading}><div className="section-kicker">NOTE {String(index + 1).padStart(2, "0")}</div><h2>{section.heading}</h2>{(section.paragraphs || []).map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}{section.steps?.length ? <ol>{section.steps.map((step: string) => <li key={step}>{step}</li>)}</ol> : null}</section>)}{page.faq?.length ? <section className="detail-section faq-section"><div className="section-kicker">QUICK CHECK</div><h2>FAQ</h2>{page.faq.map((item: any) => <div className="card faq-card" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section> : null}<Sources slug={slug} /><AdSlot id="detail-2" /><section className="detail-section related-section"><div className="section-kicker">KEEP EXPLORING</div><h2>Related guides</h2><div className="related-links">{(page.related_slugs || []).map((related: string) => { const item: any = (siteData.pages || []).find((candidate: any) => candidate.slug === related && candidate.page_status === "publish" && candidate.index_status === "index"); return item ? <Link key={related} href={routeHref(related)} data-analytics-event="internal_recommendation_click" data-analytics-placement="related_guides">{item.keyword} ↗</Link> : null; })}</div></section></article><EvidenceRail slug={slug} /></div></section><Footer /></main>;
}
