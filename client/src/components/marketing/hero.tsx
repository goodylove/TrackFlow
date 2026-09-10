import { ArrowDown, ArrowRight, Check, Kanban } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ProductPreview } from "./product-preview"
import { LoadReveal, ScrollLift, WordReveal } from "./landing/motion"

export function Hero() {
  const capabilities = ["Workspace boards", "Clear ownership", "Issue comments"]

  return (
    <section className="landing-hero relative overflow-hidden border-b border-[var(--marketing-border)] pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <Container>
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <div className="max-w-[35rem]">
            <LoadReveal distance={24}>
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--marketing-action-soft)] px-3 py-1.5 text-[0.76rem] font-semibold text-[var(--marketing-action)]">
                <Kanban className="size-3.5 text-[var(--marketing-action)]" weight="fill" />
                Issue tracking for small teams
              </div>
            </LoadReveal>

            <WordReveal
              className="mt-6 max-w-[34rem] text-[clamp(2.75rem,7vw,4.5rem)] font-black leading-[0.98] tracking-[-0.045em] text-[var(--marketing-foreground)]"
              text="Give every issue a clear next step."
            />

            <LoadReveal delay={180} distance={32}>
              <p className="mt-6 max-w-[30rem] text-base leading-7 text-[var(--marketing-muted-foreground)] sm:text-[1.0625rem] sm:leading-8">
                Bring bugs, tasks, and follow-ups into one workspace. Assign an
                owner, set a priority, and see what still needs attention.
              </p>
            </LoadReveal>

            <LoadReveal delay={270} distance={32}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 rounded-[var(--radius-pill)] bg-[var(--marketing-action)] px-6 text-[0.82rem] hover:bg-[var(--marketing-action-strong)]"
                  )}
                  to="/signup"
                >
                  Create an account
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 rounded-[var(--radius-pill)] border-[var(--marketing-border-strong)] bg-white px-5 text-[0.82rem] shadow-none hover:bg-[var(--landing-surface)]"
                  )}
                  to="#benefits"
                >
                  <ArrowDown className="size-4 text-[var(--marketing-action)]" />
                  Explore the workflow
                </Link>
              </div>
            </LoadReveal>

            <LoadReveal delay={340} distance={24}>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-[var(--marketing-border)] pt-5" aria-label="Core TrackFlow capabilities">
                {capabilities.map((capability) => (
                  <li className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-[var(--marketing-muted-foreground)]" key={capability}>
                    <span className="grid size-5 place-items-center rounded-full bg-[var(--marketing-action-soft)] text-[var(--marketing-action)]">
                      <Check className="size-3" weight="bold" />
                    </span>
                    {capability}
                  </li>
                ))}
              </ul>
            </LoadReveal>
          </div>

          <LoadReveal className="min-w-0 overflow-hidden py-2 lg:overflow-visible" delay={180} direction="right" distance={36}>
            <ScrollLift className="relative rounded-[1.35rem] border border-[var(--marketing-border)] bg-[var(--landing-surface)] p-3 sm:p-5 lg:-mr-20 lg:p-6">
              <div aria-hidden="true" className="absolute -left-3 top-12 hidden h-24 w-1 rounded-full bg-[var(--marketing-action)] lg:block" />
              <div className="mb-3 flex items-center justify-between px-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--marketing-muted-foreground)] sm:mb-4">
                <span>TrackFlow workspace</span>
                <span className="inline-flex items-center gap-2 normal-case tracking-normal">
                  <span className="size-1.5 rounded-full bg-[var(--landing-success)]" />
                  Product preview
                </span>
              </div>
              <ProductPreview />
            </ScrollLift>
          </LoadReveal>
        </div>

      </Container>
    </section>
  )
}
