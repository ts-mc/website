import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllFarms } from "@/lib/farms";
import { FarmGrid } from "@/components/FarmGrid";

export const revalidate = 0;

export default async function HomePage() {
  const farms = await getAllFarms();
  return (
    <div className="reference-home">
      <section className="signal-opening" aria-labelledby="page-title">
        <div className="signal-opening-bg" aria-hidden="true" />
        <div className="signal-vignette" aria-hidden="true" />
        <div className="signal-mark" aria-hidden="true">
          <img src="/brand/ts-glow.png" alt="" />
        </div>
        <div className="signal-wordmark">
          <h1 id="page-title">THEYSIX</h1>
          <p>WELCOME TO OUR COMMUNITY</p>
        </div>
        <Link href="#farms" className="signal-enter"><span><ArrowRight size={18} /></span> ENTER</Link>
      </section>

      <section id="collection" className="reference-chapter" aria-labelledby="collection-title">
        <p className="reference-index">01 / THE COLLECTION</p>
        <h2 id="collection-title">Everything you need<br /><em>to build better.</em></h2>
        <p className="reference-lede">Browse the TheySix archive of Minecraft farms, schematics, worlds, tutorials, and build notes. Each entry keeps its edition, resources, and source details visible.</p>
      </section>

      <section id="farms" className="reference-archive" aria-labelledby="archive-title">
        <div className="reference-archive-heading"><div><p className="reference-index">02 / ARCHIVE</p><h2 id="archive-title">Find your next build.</h2></div><p>{farms.length} indexed entries across Java, Bedrock, and builds.</p></div>
        <Suspense fallback={<div className="reference-loading">Loading archive...</div>}><FarmGrid initialFarms={farms} /></Suspense>
      </section>
    </div>
  );
}
