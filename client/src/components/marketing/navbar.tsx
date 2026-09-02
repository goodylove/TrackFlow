import { useId, useState } from "react"
import { ArrowUpRight, GithubLogo, Kanban, List, X } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "#benefits", label: "About" },
  { href: "#features", label: "Use cases" },
  { href: "#plans", label: "Plans" },
  { href: "https://github.com/goodylove/TrackFlow", label: "GitHub" },
]

function BrandMark() {
  return (
    <div className="flex size-7 items-center justify-center rounded-[0.55rem] bg-[var(--marketing-action)] shadow-[0_10px_24px_-16px_rgba(47,55,244,0.75)]">
      <Kanban className="size-4 text-white" weight="fill" />
    </div>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  return (
    <Container className="pt-4">
      <header>
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-[0.98rem] font-bold tracking-tight text-[var(--marketing-action)]"
          >
            <BrandMark />
            <span>TrackFlow</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                rel={item.href.startsWith("https://") ? "noreferrer" : undefined}
                target={item.href.startsWith("https://") ? "_blank" : undefined}
                className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-2 text-[0.78rem] font-semibold leading-none text-[#282837] transition-colors hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)]"
              >
                {item.label}
                {item.href.startsWith("https://") ? <ArrowUpRight className="size-3" /> : null}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-[var(--radius-pill)] px-3 py-2 text-[0.78rem] font-semibold text-[#282837] transition-colors hover:text-[var(--marketing-action)]" to="/login">
              Sign in
            </Link>
            <Link className={cn(buttonVariants({ size: "sm" }), "h-9 rounded-[var(--radius-pill)] bg-[var(--marketing-action)] px-5 text-[0.78rem] hover:bg-[var(--marketing-action-strong)]")} to="/signup">
              Sign up
            </Link>
            <a
              aria-label="TrackFlow GitHub repository"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-9 rounded-full text-[#282837]")}
              href="https://github.com/goodylove/TrackFlow"
              rel="noreferrer"
              target="_blank"
            >
              <GithubLogo className="size-5" />
            </a>
          </div>

          <Button
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="size-9 rounded-full md:hidden lg:hidden"
            size="icon"
            type="button"
            variant="outline"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="size-5" /> : <List className="size-5" />}
          </Button>
        </div>

        {isOpen ? (
          <div
            className="mt-4 rounded-[1rem] border border-[var(--marketing-border)] bg-white p-3 shadow-[0_18px_50px_-38px_rgba(17,16,28,0.4)] lg:hidden"
            id={menuId}
          >
            <nav aria-label="Mobile primary" className="flex flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  rel={item.href.startsWith("https://") ? "noreferrer" : undefined}
                  target={item.href.startsWith("https://") ? "_blank" : undefined}
                  className="rounded-[0.8rem] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--marketing-action-soft)]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2">
              <Link className={buttonVariants({ variant: "outline", size: "sm" })} to="/login">
                Sign in
              </Link>
              <Link className={cn(buttonVariants({ size: "sm" }), "bg-[var(--marketing-action)] hover:bg-[var(--marketing-action-strong)]")} to="/signup">
                Sign up
              </Link>
            </div>
          </div>
        ) : null}
      </header>
    </Container>
  )
}
