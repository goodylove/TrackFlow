import { ArrowRight, ChartBar, ChatsCircle, Kanban } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"

const processCards = [
  { title: "Organize issues into workspaces", description: "Group related work so every team can focus on the issues that belong to them.", icon: Kanban },
  { title: "Smarter team collaboration", description: "Assign owners, discuss details, and keep decisions attached to the issue.", icon: ChatsCircle },
  { title: "Track and optimize", description: "Use status, priority, due dates, and dashboard signals to keep work moving.", icon: ChartBar },
]

export function BenefitsSection() {
  return <section className="mt-12 bg-[#f4f4f7] py-16 sm:py-20" id="benefits">
    <Container>
      <Reveal direction="left">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading centered={false} title="Streamline your issue process" description="Managing project work should feel like a habit. TrackFlow helps your team work smarter, not harder." />
          <Link className={cn(buttonVariants({ size: "lg" }), "w-fit rounded-[var(--radius-pill)] bg-[var(--marketing-action)]/95 px-6 text-[0.82rem] hover:bg-[var(--marketing-action-strong)]")} to="/signup">Join us now<ArrowRight className="size-4" /></Link>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {processCards.map((card, index) => {
          const Icon = card.icon
          return <Reveal key={card.title} delay={index * 90} direction="left"><article className="landing-card rounded-[0.9rem] bg-white p-6 shadow-[0_22px_54px_-44px_rgba(17,16,28,0.42)]"><span className="flex size-8 items-center justify-center rounded-[0.55rem] bg-[linear-gradient(135deg,#17152f,#2f37f4)] text-white shadow-[0_12px_24px_-16px_rgba(47,55,244,0.7)]"><Icon className="size-4" weight="fill" /></span><h3 className="mt-7 text-base font-black text-[#171722]">{card.title}</h3><p className="mt-3 text-[0.82rem] leading-6 text-[var(--marketing-muted-foreground)]">{card.description}</p></article></Reveal>
        })}
      </div>
    </Container>
  </section>
}
