import { ArrowRight, ChartBar, ChatsCircle, Kanban } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Reveal } from "./reveal"
import { SectionHeading } from "./section-heading"

const processCards = [
  { step: "01", label: "Capture", title: "Create a home for the work", description: "Set up a workspace, add your teammates, and capture the issues you need to tackle together.", icon: Kanban },
  { step: "02", label: "Assign", title: "Make the next step clear", description: "Choose an owner, set a priority and due date, and keep questions in the issue comments.", icon: ChatsCircle },
  { step: "03", label: "Resolve", title: "Follow it through to done", description: "Move issues from Todo to In Progress to Done. Check the dashboard for overdue and unassigned work.", icon: ChartBar },
]

export function BenefitsSection() {
  return <section className="bg-[var(--landing-surface)] py-20 sm:py-24 lg:py-28" id="benefits">
    <Container>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Reveal direction="up"><p className="mb-4 text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--marketing-action)]">How it works</p></Reveal>
          <SectionHeading centered={false} title="From first report to done" description="A shared workflow for the everyday work: what needs doing, who owns it, and where it stands." />
        </div>
        <Reveal delay={160} direction="up">
          <Link className={cn(buttonVariants({ size: "lg" }), "w-fit rounded-[var(--radius-pill)] bg-[var(--marketing-action)] px-6 text-[0.82rem] hover:bg-[var(--marketing-action-strong)]")} to="/signup">Create an account<ArrowRight className="size-4" /></Link>
        </Reveal>
      </div>
      <div className="landing-process-grid relative mt-14 grid gap-5 sm:mt-16 lg:grid-cols-3 lg:gap-7">
        {processCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Reveal key={card.title} delay={index * 90} direction="left">
              <article className="landing-card relative h-full overflow-hidden rounded-[0.9rem] border border-[var(--marketing-border)] bg-white p-6 shadow-[var(--landing-card-shadow)] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex size-10 items-center justify-center rounded-[0.65rem] bg-[var(--marketing-action)] text-white"><Icon className="size-5" weight="fill" /></span>
                  <span className="font-mono text-[2rem] font-bold leading-none tracking-[-0.08em] text-[var(--marketing-border-strong)]">{card.step}</span>
                </div>
                <p className="mt-8 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--marketing-action)]">{card.label}</p>
                <h3 className="mt-3 text-[1.125rem] font-black leading-6 tracking-[-0.015em] text-[var(--marketing-foreground)]">{card.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-7 text-[var(--marketing-muted-foreground)]">{card.description}</p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Container>
  </section>
}
