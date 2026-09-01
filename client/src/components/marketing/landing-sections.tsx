import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import {
  ArrowRight,
  CalendarBlank,
  ChartBar,
  ChatsCircle,
  CheckCircle,
  ClockCountdown,
  DotsThree,
  FunnelSimple,
  Kanban,
  ListChecks,
  MagnifyingGlass,
  UserCirclePlus,
  UsersThree,
} from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const benefits = [
  {
    title: "Organize workspaces",
    description:
      "Keep each team or project's issues separate and organized.",
    icon: Kanban,
  },
  {
    title: "Clarify ownership",
    description: "Assign issues, priorities, statuses, and due dates.",
    icon: UserCirclePlus,
  },
  {
    title: "Collaborate in context",
    description:
      "Discuss updates directly inside each issue through comments.",
    icon: ChatsCircle,
  },
  {
    title: "See project health",
    description:
      "Monitor open, completed, unassigned, and overdue issues.",
    icon: ChartBar,
  },
]

const steps = [
  {
    title: "Create a workspace",
    description:
      "Bring members and related work into one shared space.",
    icon: UsersThree,
  },
  {
    title: "Create and assign issues",
    description:
      "Add details, set priority, choose an assignee, and define a due date.",
    icon: ListChecks,
  },
  {
    title: "Track progress together",
    description:
      "Update statuses, add comments, and monitor dashboard statistics.",
    icon: ClockCountdown,
  },
]

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -48px", threshold: 0.12 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn("landing-reveal", isVisible && "landing-reveal-visible", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
}: {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        centered ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.02]">
        {title}
      </h2>

      {description ? (
        <p className="mt-5 text-base leading-7 text-[var(--marketing-muted-foreground)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function PreviewShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--marketing-preview-border)] bg-[var(--marketing-elevated)] shadow-[0_30px_90px_-48px_rgba(22,32,25,0.2)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[20%] top-0 h-24 rounded-full bg-[var(--marketing-side-glow-soft)] blur-3xl"
      />

      <div className="relative flex items-center justify-between border-b border-[var(--marketing-border)] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </div>

        <div className="rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-[var(--marketing-page)] px-4 py-1.5 text-[0.72rem] text-[var(--marketing-muted-foreground)]">
          {title}
        </div>

        <DotsThree
          className="size-4 text-[var(--marketing-muted-foreground)]"
          weight="bold"
        />
      </div>

      <div className="relative bg-white p-4 sm:p-5">{children}</div>
    </div>
  )
}

function FeatureCopy({
  title,
  description,
  points,
}: {
  title: string
  description: string
  points: string[]
}) {
  return (
    <div className="rounded-[1.75rem] border border-[var(--marketing-border)] bg-white/85 p-6 shadow-[0_24px_70px_-50px_rgba(22,32,25,0.24)] sm:p-8">
      <div className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-[var(--marketing-track)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
        Feature showcase
      </div>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[2rem]">
        {title}
      </h3>

      <p className="mt-4 text-base leading-7 text-[var(--marketing-muted-foreground)] sm:text-lg">
        {description}
      </p>

      <div className="mt-6 space-y-3">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-start gap-3 rounded-[1rem] border border-[var(--marketing-border)] bg-[var(--marketing-page)] px-4 py-3"
          >
            <CheckCircle
              className="mt-0.5 size-5 shrink-0 text-[var(--primary)]"
              weight="duotone"
            />
            <p className="text-sm leading-6 text-[var(--foreground)]">{point}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function IssueSearchPreview() {
  return (
    <PreviewShell title="Issue search">
      <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-[var(--marketing-preview-column)] p-4">
        <div className="flex flex-col gap-3 border-b border-[var(--marketing-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-white px-3 py-2 text-sm text-[var(--marketing-muted-foreground)]">
            <MagnifyingGlass className="size-4" />
            <span>Search issues</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {["All status", "Priority", "Assignee"].map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--marketing-border)] bg-white px-3 py-2 text-[var(--marketing-muted-foreground)]"
              >
                <FunnelSimple className="size-3.5" />
                {filter}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {[
            "Fix dashboard filtering for overdue issues",
            "Refine workspace member search results",
            "Resolve duplicate issue title validation",
          ].map((issue, index) => (
            <div
              key={issue}
              className="flex flex-col gap-3 rounded-[1rem] border border-[var(--marketing-border)] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{issue}</p>
                <p className="mt-1 text-xs text-[var(--marketing-muted-foreground)]">
                  Updated {index + 1}h ago
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-[var(--radius-pill)] bg-[var(--marketing-track)] px-2.5 py-1 text-[var(--foreground)]">
                  Page 1
                </span>
                <span className="rounded-[var(--radius-pill)] bg-[#fdf3d6] px-2.5 py-1 text-[#8f6200]">
                  In progress
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[1rem] border border-[var(--marketing-border)] bg-white px-4 py-3 text-sm text-[var(--marketing-muted-foreground)]">
          <span>Showing 1-10 of 24 issues</span>
          <div className="flex items-center gap-2">
            <span className="rounded-[0.85rem] border border-[var(--marketing-border)] px-3 py-1.5">
              Previous
            </span>
            <span className="rounded-[0.85rem] bg-[var(--primary)] px-3 py-1.5 text-white">
              1
            </span>
            <span className="rounded-[0.85rem] border border-[var(--marketing-border)] px-3 py-1.5">
              2
            </span>
            <span className="rounded-[0.85rem] border border-[var(--marketing-border)] px-3 py-1.5">
              Next
            </span>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

function AssignmentPreview() {
  return (
    <PreviewShell title="Assignment and status">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-[var(--marketing-preview-column)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--marketing-muted-foreground)]">
            Issue details
          </p>
          <h4 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
            Improve issue details sidebar
          </h4>

          <div className="mt-4 space-y-3">
            {[
              ["Assignee", "Amina Johnson"],
              ["Priority", "High"],
              ["Status", "In progress"],
              ["Due date", "Sep 12, 2026"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[1rem] border border-[var(--marketing-border)] bg-white px-4 py-3"
              >
                <span className="text-sm text-[var(--marketing-muted-foreground)]">{label}</span>
                <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--foreground)]">Workflow</p>
            <span className="rounded-[var(--radius-pill)] bg-[var(--marketing-track)] px-3 py-1 text-xs text-[var(--foreground)]">
              Team aligned
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Backlog", 12, "bg-slate-300"],
              ["In progress", 5, "bg-[#fdf3d6]"],
              ["Done", 18, "bg-[#dff1d8]"],
            ].map(([label, count, tone]) => (
              <div
                key={label as string}
                className="rounded-[1rem] border border-[var(--marketing-border)] bg-[var(--marketing-preview-column)] p-3"
              >
                <div className={`h-1 rounded-full ${tone as string}`} />
                <p className="mt-3 text-sm font-medium text-[var(--foreground)]">{label}</p>
                <p className="mt-1 text-xs text-[var(--marketing-muted-foreground)]">
                  {count} issues
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[1rem] border border-dashed border-[var(--marketing-border)] bg-[var(--marketing-page)] px-4 py-4">
            <div className="flex items-center gap-3">
              <CalendarBlank className="size-5 text-[var(--primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  Due this week
                </p>
                <p className="text-xs text-[var(--marketing-muted-foreground)]">
                  Keep deadlines visible as work is reassigned or updated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

function CommentsPreview() {
  return (
    <PreviewShell title="Issue comments">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-[var(--marketing-preview-column)] p-4">
          <div className="flex items-center justify-between border-b border-[var(--marketing-border)] pb-4">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Comment thread</p>
              <p className="mt-1 text-xs text-[var(--marketing-muted-foreground)]">
                Keep updates attached to the issue.
              </p>
            </div>

            <span className="rounded-[var(--radius-pill)] bg-white px-3 py-1.5 text-xs text-[var(--foreground)]">
              8 replies
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              {
                author: "Grace",
                message: "The pagination edge case is fixed. Waiting on review for the empty state copy.",
              },
              {
                author: "Tobi",
                message: "I picked this up and updated the status to in progress with a Friday due date.",
              },
              {
                author: "Maya",
                message: "Looks good. Once design approves the state labels we can ship it.",
              },
            ].map((comment, index) => (
              <div
                key={comment.author}
                className={cn(
                  "rounded-[1rem] border border-[var(--marketing-border)] px-4 py-3",
                  index === 1 ? "bg-white" : "bg-[#fafbf8]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[var(--marketing-track)] text-xs font-semibold text-[var(--foreground)]">
                    {comment.author.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{comment.author}</p>
                    <p className="text-xs text-[var(--marketing-muted-foreground)]">
                      Commented just now
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--marketing-muted-foreground)]">
              Context
            </p>
            <div className="mt-3 space-y-3">
              {[
                "Design review requested",
                "Assignee: Maya",
                "Priority: Medium",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[0.95rem] border border-[var(--marketing-border)] bg-[var(--marketing-page)] px-3 py-2.5 text-sm text-[var(--foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-dashed border-[var(--marketing-border)] bg-[var(--marketing-page)] p-4">
            <div className="flex items-center gap-3">
              <ChatsCircle className="size-5 text-[var(--primary)]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Conversation stays visible</p>
                <p className="mt-1 text-xs leading-5 text-[var(--marketing-muted-foreground)]">
                  New teammates can catch up without leaving the issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

function DashboardPreview() {
  return (
    <PreviewShell title="Workspace dashboard">
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Open issues", "24", "bg-[#f3f5f1]"],
            ["Completed", "18", "bg-[#e3f4de]"],
            ["Unassigned", "6", "bg-[#fff2d7]"],
            ["Overdue", "3", "bg-[#fde2df]"],
          ].map(([label, value, tone]) => (
            <div
              key={label as string}
              className={`rounded-[1.15rem] border border-[var(--marketing-border)] ${tone as string} p-4`}
            >
              <p className="text-sm text-[var(--marketing-muted-foreground)]">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-[var(--marketing-preview-column)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--foreground)]">Issue trend</p>
              <span className="text-xs text-[var(--marketing-muted-foreground)]">Last 30 days</span>
            </div>

            <div className="mt-5 flex h-44 items-end gap-3">
              {[36, 48, 42, 62, 55, 74, 68].map((height, index) => (
                <div key={height} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-full rounded-t-[0.9rem]",
                      index >= 4 ? "bg-[var(--primary)]" : "bg-[var(--marketing-accent)]"
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[0.72rem] text-[var(--marketing-muted-foreground)]">
                    W{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[var(--marketing-border)] bg-white p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Team attention needed</p>

            <div className="mt-4 space-y-3">
              {[
                ["3 overdue issues", "High priority work needs a next step."],
                ["6 unassigned issues", "Spread ownership before the next sprint."],
                ["18 completed issues", "Delivery is healthy this cycle."],
              ].map(([label, copy]) => (
                <div
                  key={label as string}
                  className="rounded-[1rem] border border-[var(--marketing-border)] bg-[var(--marketing-page)] px-4 py-3"
                >
                  <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--marketing-muted-foreground)]">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PreviewShell>
  )
}

const showcaseItems = [
  {
    title: "Issue search, filters, and pagination",
    description:
      "Stay on top of busy workspaces with quick search, filtering by status or priority, and tidy paginated issue lists.",
    points: [
      "Find issues by title without losing your place.",
      "Narrow views by state, ownership, or urgency.",
      "Move through longer backlogs with predictable pagination.",
    ],
    preview: <IssueSearchPreview />,
  },
  {
    title: "Assignment, priority, and status management",
    description:
      "Make responsibilities obvious with assignees, due dates, and statuses that keep everyone aligned on what needs attention next.",
    points: [
      "Set clear priorities at the issue level.",
      "Keep assignees and due dates visible.",
      "Update statuses as work moves forward.",
    ],
    preview: <AssignmentPreview />,
  },
  {
    title: "Comments and team collaboration",
    description:
      "Keep project discussion close to the work itself so questions, updates, and decisions stay attached to the right issue.",
    points: [
      "Add context without leaving the issue.",
      "Capture status updates in one thread.",
      "Reduce back-and-forth across scattered tools.",
    ],
    preview: <CommentsPreview />,
  },
  {
    title: "Dashboard insights",
    description:
      "Use lightweight reporting to understand what is complete, what is overdue, and where your team may need support.",
    points: [
      "Spot overdue or unassigned work quickly.",
      "Watch open versus completed issue counts.",
      "See the health of a workspace at a glance.",
    ],
    preview: <DashboardPreview />,
  },
]

export function LandingSections() {
  return (
    <>
      <section className="pb-20 sm:pb-24 lg:pb-28" id="benefits">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Core benefits"
              title="Everything your team needs to keep work moving"
            />
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon

              return (
                <Reveal
                  key={benefit.title}
                  delay={index * 85}
                  className="h-full"
                >
                  <article className="landing-card group relative h-full overflow-hidden rounded-[1.5rem] border border-[var(--marketing-border)] bg-white/88 p-6 shadow-[0_22px_70px_-52px_rgba(22,32,25,0.28)]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-6 top-0 h-16 rounded-full bg-[var(--marketing-side-glow-soft)] opacity-70 blur-3xl"
                    />
                    <div className="relative">
                      <div className="flex size-12 items-center justify-center rounded-[1rem] bg-[var(--marketing-track)] text-[var(--primary)]">
                        <Icon className="size-6" weight="duotone" />
                      </div>

                      <h3 className="mt-5 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                        {benefit.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-[var(--marketing-muted-foreground)] sm:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-28" id="how-it-works">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-[var(--marketing-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,248,244,0.92))] p-6 shadow-[0_28px_90px_-58px_rgba(22,32,25,0.25)] sm:p-8 lg:p-10">
            <SectionHeading
              eyebrow="How TrackFlow works"
              title="From reported issue to resolved work"
            />

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon

                return (
                  <Reveal
                    key={step.title}
                    delay={index * 100}
                  >
                    <article className="landing-card relative h-full rounded-[1.5rem] border border-[var(--marketing-border)] bg-white p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex size-12 items-center justify-center rounded-full bg-[var(--marketing-track)] text-sm font-semibold text-[var(--primary)]">
                          0{index + 1}
                        </div>
                        <div className="flex size-11 items-center justify-center rounded-[0.95rem] bg-[var(--marketing-page)] text-[var(--primary)]">
                          <Icon className="size-5" weight="duotone" />
                        </div>
                      </div>

                      <h3 className="mt-6 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                        {step.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-[var(--marketing-muted-foreground)] sm:text-base">
                        {step.description}
                      </p>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
          </Reveal>
        </Container>
      </section>

      {/* <section className="pb-20 sm:pb-24 lg:pb-28" id="features">
        <Container>
          <SectionHeading
            eyebrow="Feature showcase"
            title="A closer look at how teams use TrackFlow"
            description="These views go deeper than the highlight cards above and show how the product supports organized work from intake through resolution."
          />

          <div className="mt-12 space-y-6">
            {showcaseItems.map((item, index) => (
              <div
                key={item.title}
                className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center"
              >
                <div className={cn(index % 2 === 1 ? "lg:order-2" : "")}>
                  <FeatureCopy
                    title={item.title}
                    description={item.description}
                    points={item.points}
                  />
                </div>

                <div className={cn(index % 2 === 1 ? "lg:order-1" : "")}>
                  {item.preview}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section> */}

      <section className="pb-20 sm:pb-24 lg:pb-28" id="final-cta">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--marketing-border)] bg-[var(--marketing-hero-base)] px-6 py-10 shadow-[0_28px_90px_-56px_rgba(22,32,25,0.24)] sm:px-8 sm:py-14 lg:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[34%] bg-[radial-gradient(circle_at_22%_24%,var(--marketing-side-glow-soft)_0,transparent_42%),radial-gradient(circle_at_28%_78%,var(--marketing-side-glow-strong)_0,transparent_56%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-[34%] bg-[radial-gradient(circle_at_76%_22%,var(--marketing-side-glow-soft)_0,transparent_42%),radial-gradient(circle_at_70%_76%,var(--marketing-side-glow-strong)_0,transparent_56%)]"
            />

            <div className="relative mx-auto max-w-3xl text-center">
              <SectionHeading
                title="Give every issue a clear path forward"
                description="Create your workspace, organize incoming work, and help your team stay accountable from start to resolution."
              />

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "min-w-44 shadow-[0_18px_36px_-20px_rgba(23,63,43,0.38)]"
                  )}
                  to="/signup"
                >
                  Start tracking
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-w-36"
                  )}
                  to="/login"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
          </Reveal>
        </Container>
      </section>

      <footer className="border-t border-[var(--marketing-border)] pb-8 pt-6" id="footer">
        <Container>
          <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="/"
              className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
            >
              TrackFlow
            </a>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--marketing-muted-foreground)]">
              <a className="transition-colors hover:text-[var(--foreground)]" href="#features">
                Features
              </a>
              <a className="transition-colors hover:text-[var(--foreground)]" href="#how-it-works">
                How it works
              </a>
              <Link
                className="cursor-pointer transition-colors hover:text-[var(--foreground)]"
                to="/login"
              >
                Sign in
              </Link>
              <Link
                className="cursor-pointer transition-colors hover:text-[var(--foreground)]"
                to="/signup"
              >
                Register
              </Link>
              <a
                className="transition-colors hover:text-[var(--foreground)]"
                href="https://github.com/goodylove/TrackFlow"
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </div>
          </div>

          <p className="mt-5 text-sm text-[var(--marketing-muted-foreground)]">
            &copy; 2026 TrackFlow
          </p>
          </Reveal>
        </Container>
      </footer>
    </>
  )
}
