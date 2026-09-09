import { ArrowUpRight, Code, Database, GithubLogo, ShieldCheck } from "@phosphor-icons/react"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Reveal } from "./reveal"

const proofPoints = [
  {
    icon: Code,
    title: "Product-minded frontend",
    description: "A responsive React and TypeScript interface built around real workflows, clear states, and accessible controls.",
  },
  {
    icon: Database,
    title: "Full-stack ownership",
    description: "API-backed workspaces, issues, members, comments, and dashboard data connected through Express and MongoDB.",
  },
  {
    icon: ShieldCheck,
    title: "Security in the details",
    description: "Cookie-backed sessions, request validation, role-aware permissions, and resource ownership checks.",
  },
]

const stack = ["React", "TypeScript", "Node.js", "Express", "MongoDB"]

export function CreatorProofSection() {
  return (
    <section className="border-y border-[var(--marketing-border)] bg-[var(--landing-surface)] py-20 sm:py-24 lg:py-28" id="builder">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-20">
          <Reveal direction="left">
            <div className="lg:sticky lg:top-28">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--marketing-action)]">Behind the product</p>
              <h2 className="mt-5 max-w-[31rem] text-[2.4rem] font-black leading-[1.02] tracking-[-0.04em] text-[var(--marketing-foreground)] sm:text-[3.25rem]">
                Built end to end by Goodness.
              </h2>
              <p className="mt-5 max-w-[30rem] text-base leading-8 text-[var(--marketing-muted-foreground)]">
                TrackFlow is a working full-stack product shaped from interface decisions through API security. It shows how I turn a practical problem into software people can understand and use.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {stack.map((technology) => <span className="rounded-full border border-[var(--marketing-border)] bg-white px-3 py-1.5 text-[0.72rem] font-bold text-[var(--marketing-foreground)]" key={technology}>{technology}</span>)}
              </div>
              <a
                className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-[var(--radius-pill)] bg-[var(--marketing-action)] px-6 text-[0.82rem] hover:bg-[var(--marketing-action-strong)]")}
                href="https://github.com/goodylove/TrackFlow"
                rel="noreferrer"
                target="_blank"
              >
                <GithubLogo className="size-[1.125rem]" weight="fill" />
                Review the source
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <div className="divide-y divide-[var(--marketing-border)] border-y border-[var(--marketing-border)]">
            {proofPoints.map((point, index) => {
              const Icon = point.icon
              return (
                <Reveal delay={index * 90} direction="right" key={point.title}>
                  <article className="group grid gap-5 py-8 sm:grid-cols-[3.25rem_1fr] sm:py-10">
                    <span className="grid size-12 place-items-center rounded-xl border border-[var(--marketing-border)] bg-white text-[var(--marketing-action)] transition-colors duration-300 group-hover:border-[var(--marketing-action)] group-hover:bg-[var(--marketing-action)] group-hover:text-white">
                      <Icon className="size-5" weight="bold" />
                    </span>
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-xl font-black tracking-[-0.025em] text-[var(--marketing-foreground)]">{point.title}</h3>
                        <span className="font-mono text-xs font-bold text-[var(--marketing-border-strong)]">0{index + 1}</span>
                      </div>
                      <p className="mt-3 max-w-[36rem] text-[0.95rem] leading-7 text-[var(--marketing-muted-foreground)]">{point.description}</p>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
