import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: "noindex,follow", alternates: { canonical: "/" } };

export default function NotFound() {
  return <main className="section"><meta name="robots" content="noindex,follow"/><link rel="canonical" href="/"/><div className="container prose"><h1>Page not found</h1><p>The guide you requested does not exist.</p><Link className="button" href="/">Back home</Link></div></main>;
}
