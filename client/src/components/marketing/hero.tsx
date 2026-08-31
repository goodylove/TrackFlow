import { ArrowRight } from "@phosphor-icons/react"

import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"

import { ProductPreview } from "./product-preview"

export function Hero() {
  return (
    <section className="pb-20 pt-4 sm:pb-24 sm:pt-6 lg:pb-28">
      <Container className="">
        <div className="bg-white px-1 py-1 border border-[var(--marketing-border)] rounded-[var(--radius-hero)]">
          <div className="relative overflow-hidden  rounded-[var(--radius-hero)] border  border-[var(--marketing-border)] bg-[var(--marketing-hero-base)] px-4 py-10 shadow-[0_28px_80px_-44px_rgba(22,32,25,0.16)] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[34%] bg-[radial-gradient(circle_at_18%_18%,var(--marketing-side-glow-soft)_0,transparent_42%),radial-gradient(circle_at_54%_38%,var(--marketing-side-glow-strong)_0,transparent_58%),radial-gradient(circle_at_22%_82%,var(--marketing-side-glow-soft)_0,transparent_38%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-[34%] bg-[radial-gradient(circle_at_82%_18%,var(--marketing-side-glow-soft)_0,transparent_42%),radial-gradient(circle_at_46%_38%,var(--marketing-side-glow-strong)_0,transparent_58%),radial-gradient(circle_at_78%_82%,var(--marketing-side-glow-soft)_0,transparent_38%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[18%] top-[3%] h-[39rem] rounded-[9999px] bg-white/90 blur-[74px] sm:inset-x-[22%] sm:h-[50rem]"
            />



            <div className=" mx-auto w-full flex justify-center items-center  relative z-10 flex-col ">


              <div className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-white/95 px-4 py-2 text-sm font-medium text-[var(--primary)] shadow-sm">
                Issue tracking for focused teams
              </div>
              <div className="mx-auto mt-4 flex max-w-4xl flex-col items-center text-center">
                <h1 className="text-4xl  font-semibold leading-[0.98] text-[#162019] sm:text-5xl lg:text-6xl">
                  Keep every issue
                  <span className="block">moving forward</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-[#68746c] sm:text-lg">
                  TrackFlow gives your team one place to organize incoming work, assign clear
                  ownership, discuss updates, and resolve issues without losing momentum.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <Button className="min-w-40 shadow-[0_18px_36px_-20px_rgba(23,63,43,0.38)]" size="lg" type="button">
                  Get started
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <ProductPreview />
          </div>
        </div>
      </Container>
    </section>
  )
}
