import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", description: "Privacy information for this independent game guide.", alternates: { canonical: "/privacy" }, robots: "noindex,follow" };

export default function Privacy() { return <main className="section"><div className="container prose"><h1>Privacy Policy</h1><p>This fan-made site uses basic analytics and advertising placeholders only when configured.</p><Link href="/">Back home</Link></div></main>; }
