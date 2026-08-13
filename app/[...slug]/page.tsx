import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import siteData from "../../public/site-data.json";
import { AdSlot, EvidenceRail, Footer, Header, MediaGallery, Sources } from "../components";

export function generateStaticParams() {
  const detailParams = (siteData.pages || []).map((page: any) => ({ slug: page.slug.split("/") }));
  const categoryParams = (siteData.blueprint?.categories || []).map((category: any) => ({ slug: category.slug.split("/") }));
  const seen = new Set<string>();
  return [...categoryParams, ...detailParams].filter((item: any) => { const key = item.slug.join("/"); if (seen.has(key)) return false; seen.add(key); return true; });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const category: any = (siteData.blueprint?.categories || []).find((item: any) => item.slug === slug);
  const page: any = (siteData.pages || []).find((item: any) => item.slug === slug);
  const item: any = page || category;
  return {
    title: item?.seo?.title || item?.name || siteData.game?.name || "Game Wiki",
    description: item?.seo?.description || `Guides for ${item?.name || siteData.game?.name || "this game"}.`,
    alternates: { canonical: `/${slug}` },
    robots: page?.index_status === "noindex" ? "noindex,follow" : "index,follow"
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join("/");
  const route = `/${slug}`;
  const category: any = (siteData.blueprint?.categories || []).find((item: any) => item.slug === slug);
  const page: any = (siteData.pages || []).find((item: any) => item.slug === slug);
  if (category && !page) {
    const structuredData = JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: category.name, url: `${siteData.site?.base_url || "http://localhost:3000"}/${slug}`, mainEntity: { "@type": "ItemList", itemListElement: (category.pages || []).map((item: any, index: number) => ({ "@type": "ListItem", position: index + 1, name: item.keyword, url: `${siteData.site?.base_url || "http://localhost:3000"}/${item.slug}` })) } }).replace(/</g, "\\u003c");
    return <main className="shell"><Header /><section className="section category-page"><div className="container"><div className="section-kicker">GUIDE INDEX / FIELD FILES</div><h1>{category.name}</h1><p className="category-lede">Browse focused, source-backed guides in this category. Each route keeps its evidence boundary visible.</p><MediaGallery route={route} /><AdSlot id="aggregate-1" /><div className="cards category-cards">{(category.pages || []).map((item: any, index: number) => <Link className="card file-card" href={`/${item.slug}`} key={item.slug}><div className="file-card-top"><span>FILE {String(index + 1).padStart(2, "0")}</span><span className="file-arrow" aria-hidden="true">↗</span></div><strong>{item.keyword}</strong><p>Read the focused answer and supporting steps.</p><span className="file-card-link">OPEN DOSSIER</span></Link>)}</div><AdSlot id="aggregate-2" /></div></section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} /><Footer /></main>;
  }
  if (!page || page.page_status === "removed") notFound();
  const structuredData = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: page.keyword, description: page.seo?.description, dateModified: page.updated_at, mainEntityOfPage: `${siteData.site?.base_url || "http://localhost:3000"}/${slug}` }).replace(/</g, "\\u003c");
  const parent = (siteData.blueprint?.categories || []).find((item: any) => item.name === page.parent_category);
  return <main className="shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} /><Header /><section className="section detail-page"><div className="container detail-grid"><article className="prose"><div className="breadcrumbs"><Link href="/">Home</Link>{parent ? <> <span>/</span> <Link href={`/${parent.slug}`}>{parent.name}</Link></> : null}<span>/</span><span>{page.slug}</span></div><div className="detail-title-row"><div><div className="section-kicker">FIELD FILE / {page.time_sensitivity || "CURRENT"}</div><h1>{page.keyword}</h1></div><div className={`status-stamp ${page.page_status === "publish" && page.index_status === "index" ? "status-publish" : "status-draft"}`}>{page.page_status === "publish" && page.index_status === "index" ? "INDEXED FILE" : "DRAFT / NOINDEX"}</div></div><p className="direct-answer"><span className="answer-label">DIRECT ANSWER</span><strong>{page.direct_answer}</strong></p><MediaGallery route={route} /><AdSlot id="detail-1" />{page.sections.map((section: any, index: number) => <section className="detail-section" key={section.heading}><div className="section-kicker">NOTE {String(index + 1).padStart(2, "0")}</div><h2>{section.heading}</h2>{(section.paragraphs || []).map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}{section.steps?.length ? <ol>{section.steps.map((step: string) => <li key={step}>{step}</li>)}</ol> : null}</section>)}{page.ad_slot_count >= 3 ? <AdSlot id="detail-2" /> : null}{page.faq?.length ? <section className="detail-section faq-section"><div className="section-kicker">QUICK CHECK</div><h2>FAQ</h2>{page.faq.map((item: any) => <div className="card faq-card" key={item.question}><strong>{item.question}</strong><p>{item.answer}</p></div>)}</section> : null}<Sources slug={slug} /><AdSlot id={page.ad_slot_count >= 3 ? "detail-3" : "detail-2"} /><section className="detail-section related-section"><div className="section-kicker">CONTINUE THE FILE</div><h2>Related guides</h2><div className="related-links">{(page.related_slugs || []).map((related: string) => { const item: any = (siteData.pages || []).find((candidate: any) => candidate.slug === related); return item ? <Link key={related} href={`/${related}`}>{item.keyword} ↗</Link> : null; })}</div></section></article><EvidenceRail slug={slug} /></div></section><Footer /></main>;
}
