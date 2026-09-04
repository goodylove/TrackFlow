import { ArrowRight, PlayCircle, Sparkle } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ProductPreview } from "./product-preview"
import { LoadReveal } from "./landing/motion"

export function Hero() {
  return (
    <section className="pt-12 sm:pt-16 lg:pt-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-[29rem]">
            <LoadReveal distance={24}>
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[#f5f5f9] px-3 py-1.5 text-[0.76rem] font-semibold text-[#55586a]">
                <Sparkle className="size-3.5 text-[var(--marketing-action)]" weight="fill" />
                Issue tracking for focused teams
              </div>
            </LoadReveal>

            <LoadReveal delay={90} distance={32}>
              <h1 className="mt-5 max-w-[27rem] text-[2.65rem] font-black leading-[1.02] tracking-normal text-[#171722] sm:text-[3.45rem] lg:text-[3.8rem]">
                Keep every issue moving forward
              </h1>
            </LoadReveal>

            <LoadReveal delay={180} distance={32}>
              <p className="mt-5 max-w-[26rem] text-[0.98rem] leading-7 text-[var(--marketing-muted-foreground)]">
                TrackFlow gives your team one place to organize incoming work, assign clear
                ownership, discuss updates, and resolve issues without losing momentum.
              </p>
            </LoadReveal>

            <LoadReveal delay={270} distance={32}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-[var(--radius-pill)] bg-[var(--marketing-action)] px-6 text-[0.82rem] hover:bg-[var(--marketing-action-strong)]"
                )}
                to="/signup"
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>

              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-[var(--radius-pill)] border-transparent bg-white px-5 text-[0.82rem] shadow-[0_12px_30px_-24px_rgba(17,16,28,0.45)]"
                )}
                to="#how-it-works"
              >
                <PlayCircle className="size-4 text-[var(--marketing-action)]" weight="fill" />
                See workflow
              </Link>
              </div>
            </LoadReveal>
          </div>

          <LoadReveal className="min-w-0 overflow-hidden py-2 lg:overflow-visible" delay={180} direction="right" distance={36}>
            <ProductPreview />
          </LoadReveal>
        </div>

        {/* <div className="mt-14 border-t border-[var(--marketing-border)] pt-6">
          <p className="text-center text-[0.72rem] font-bold text-[#55586a]">
            Built around the work teams repeat every day
          </p>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            {featureTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center justify-center gap-2 text-center text-[0.82rem] font-bold text-[#9a9daa]"
              >
                <span className="size-2 rounded-full bg-[var(--marketing-action)]" />
                {tag}
              </div>
            ))}
          </div>
        </div> */}
      </Container>
    </section>
  )
}
