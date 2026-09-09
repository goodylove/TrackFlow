import { Link } from "react-router-dom";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CornerGrid } from "./corner-grid";
import { Reveal } from "./reveal";

export function FinalCtaSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28" id="final-cta">
      <Container>
        <Reveal direction="left">
          <div className="relative overflow-hidden rounded-[1rem] bg-[var(--marketing-action)] px-6 py-14 text-center text-white sm:px-10 sm:py-16 lg:py-20">
            <CornerGrid className="-left-6 top-6 opacity-25" />
            <CornerGrid className="-right-6 bottom-6 opacity-25" />
            <h2 className="relative mx-auto max-w-[38rem] text-[2.25rem] font-black leading-[1.04] tracking-[-0.035em] sm:text-[3rem]">
              Start with the work on your plate.
            </h2>
            <p className="relative mx-auto mt-4 max-w-[32rem] text-base leading-7 text-white/90 sm:text-[1.0625rem] sm:leading-8">
              Create your account, set up a workspace, and add your first issue.
              Give your team a shared place to pick up the next step.
            </p>
            <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-[var(--radius-pill)] bg-white px-6 text-[0.82rem] text-[var(--marketing-action)] hover:bg-[var(--marketing-action-soft)] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--marketing-action)]",
                )}
                to="/signup"
              >
                Create an account
              </Link>

            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
