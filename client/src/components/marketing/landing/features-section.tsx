import { Container } from "@/components/shared/container"

import { CornerGrid } from "./corner-grid"
import { CoordinationMockup, ProjectListMockup, VisibilityMockup } from "./feature-mockups"
import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"

export function FeaturesSection() {
  return <section className="relative overflow-hidden bg-white py-16 sm:py-20" id="features">
    <Container>
      <Reveal direction="right"><SectionHeading title="Optimize, organize, and resolve more" description="A calmer issue workflow with enough structure to keep every handoff visible." /></Reveal>
      <div className="relative mt-12 grid gap-5 lg:grid-cols-2 z-10">
        <CornerGrid className="-left-8 top-36" />
        <Reveal direction="left"><article className="relative overflow-hidden rounded-[1rem] bg-[#f7f7fa] p-4 sm:p-7 text-center"><h3 className="text-xl font-black text-[#171722]">Effortless project coordination</h3><p className="mx-auto mt-3 max-w-[20rem] text-[0.84rem] leading-6 text-[var(--marketing-muted-foreground)]">Keep your team aligned and your issue workflow structured from first report to resolution.</p><CoordinationMockup /></article></Reveal>
        <Reveal delay={90} direction="right"><article className="relative overflow-hidden rounded-[1rem] bg-[#f7f7fa] p-4 sm:p-7 text-center"><h3 className="text-xl font-black text-[#171722]">No more scattered issues</h3><p className="mx-auto mt-3 max-w-[20rem] text-[0.84rem] leading-6 text-[var(--marketing-muted-foreground)]">Keep every issue organized and direct your energy toward the work that matters.</p><ProjectListMockup /></article></Reveal>
        <CornerGrid className="-right-8 bottom-12" />
        <article className="grid gap-8 rounded-[1rem] bg-[#f7f7fa] p-4 sm:p-7 lg:col-span-2 lg:grid-cols-[0.95fr_1fr] lg:items-center"><Reveal delay={120} direction="left"><VisibilityMockup /></Reveal><Reveal delay={180} direction="right"><div><h3 className="text-xl font-black text-[#171722]">Seamless team visibility</h3><p className="mt-3 max-w-[24rem] text-[0.88rem] leading-7 text-[var(--marketing-muted-foreground)]">Stay updated on who is working on what, then keep collaboration close to the issue itself.</p></div></Reveal></article>
      </div>
    </Container>
  </section>
}
