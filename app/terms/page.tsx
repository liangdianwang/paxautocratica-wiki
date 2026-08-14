import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms for using this independent game guide.", alternates: { canonical: "/terms" }, robots: "noindex,follow" };

export default function Terms() { return <main className="section"><div className="container prose"><h1>Terms of Service</h1><p>This independent guide site is provided for informational purposes.</p><Link href="/">Back home</Link></div></main>; }
