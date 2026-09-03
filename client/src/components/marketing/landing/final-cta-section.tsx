import { Link } from "react-router-dom";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CornerGrid } from "./corner-grid";
import { Reveal } from "./reveal";

export function FinalCtaSection() {
  return (
    <section className="bg-white py-16 sm:py-20" id="final-cta">
      <Container>
        <Reveal direction="left">
          <div className="relative overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,#232044_0%,#2020b8_58%,#322dff_100%)] px-6 py-12 text-center text-white shadow-[0_28px_70px_-42px_rgba(47,55,244,0.75)] sm:px-10">
            <CornerGrid className="-left-6 top-6 opacity-25" />
            <CornerGrid className="-right-6 bottom-6 opacity-25" />
            <h2 className="relative mx-auto max-w-[34rem] text-[2rem] font-black leading-tight sm:text-[2.65rem]">
              Give your team a clearer way to move issues forward
            </h2>
            <p className="relative mx-auto mt-3 max-w-[30rem] text-[0.9rem] leading-7 text-white/72">
              Create a workspace, organize incoming work, and keep every owner,
              date, status, and comment in one place.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-[var(--radius-pill)] bg-white px-6 text-[0.82rem] text-[var(--marketing-action)] hover:bg-white/90",
                )}
                to="/signup"
              >
                Get started
              </Link>

            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
