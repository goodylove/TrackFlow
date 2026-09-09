import { Container } from "@/components/shared/container"

import { CoordinationMockup, ProjectListMockup, VisibilityMockup } from "./feature-mockups"
import { SectionHeading } from "./section-heading"
import { StickyStackCard } from "./motion"

const featureCopy = [
  {
    step: "01 / 03",
    eyebrow: "Board",
    title: "A board with a clear next step",
    description: "See what is waiting, what is in progress, and what is done. Update the board as the work changes.",
  },
  {
    step: "02 / 03",
    eyebrow: "Focus",
    title: "Find the issue that needs you",
    description: "Search your workspace issues and review their owners and priorities before deciding what to pick up next.",
  },
  {
    step: "03 / 03",
    eyebrow: "Ownership",
    title: "Know who is taking it forward",
    description: "Assign work to a teammate and keep the discussion in issue comments. The next person can pick up the context without starting over.",
  },
]

function FeatureText({ description, eyebrow, step, title }: (typeof featureCopy)[number]) {
  return (
    <div className="max-w-[28rem] text-left">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.7rem] font-black uppercase tracking-[0.17em] text-[var(--marketing-action)]">{eyebrow}</p>
        <p className="font-mono text-[0.68rem] font-bold text-[var(--marketing-muted-foreground)]">{step}</p>
      </div>
      <h3 className="mt-4 text-[1.8rem] font-black leading-[1.08] tracking-[-0.035em] text-[var(--marketing-foreground)] sm:text-[2.3rem]">{title}</h3>
      <p className="mt-4 text-base leading-8 text-[var(--marketing-muted-foreground)]">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="relative bg-white pb-20 pt-20 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28" id="features">
      <Container>
        <SectionHeading title="See the details behind the work" description="Owners, priorities, due dates, and comments stay close to the issue, so your team has the context to act." />

        <div className="mt-14 sm:mt-16 lg:mt-20">
          <StickyStackCard index={0}>
            <article className="grid min-h-[34rem] items-center gap-9 overflow-hidden rounded-[1.25rem] border border-[var(--marketing-border)] bg-[var(--landing-surface)] p-5 shadow-[var(--landing-preview-shadow)] sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
              <FeatureText {...featureCopy[0]} />
              <CoordinationMockup />
            </article>
          </StickyStackCard>

          <StickyStackCard index={1}>
            <article className="grid min-h-[34rem] items-center gap-9 overflow-hidden rounded-[1.25rem] border border-[var(--marketing-border)] bg-white p-5 shadow-[var(--landing-preview-shadow)] sm:p-8 lg:grid-cols-[1.28fr_0.72fr] lg:p-10">
              <div className="lg:order-2"><FeatureText {...featureCopy[1]} /></div>
              <div className="lg:order-1"><ProjectListMockup /></div>
            </article>
          </StickyStackCard>

          <StickyStackCard index={2}>
            <article className="grid min-h-[34rem] items-center gap-9 overflow-hidden rounded-[1.25rem] border border-[var(--marketing-border)] bg-[var(--landing-ink)] p-5 text-white shadow-[var(--landing-preview-shadow)] sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
              <div className="[&_h3]:text-white [&_p]:text-white/72"><FeatureText {...featureCopy[2]} /></div>
              <VisibilityMockup />
            </article>
          </StickyStackCard>
        </div>
      </Container>
    </section>
  )
}
