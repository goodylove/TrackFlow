import { useEffect, useId, useState } from "react"
import { ArrowUpRight, GithubLogo, List, X } from "@phosphor-icons/react"
import { Link, useLocation } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BrandMark } from "../shared/brandMark"

const navigation = [
  { href: "#benefits", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "#builder", label: "Builder" },
  { href: "https://github.com/goodylove/TrackFlow", label: "GitHub" },
]



export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.hash, location.pathname])

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isOpen])


  return (
    <Container className="sticky top-0 z-50 border-b border-[var(--marketing-border)] bg-white/88 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-white/78 sm:px-0! xl:px-0!">
      <header>
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-[0.98rem] font-bold tracking-tight text-[var(--marketing-action)]"
          >
            <BrandMark className="bg-[var(--marketing-action)] shadow-[var(--landing-card-shadow)]" />
            <span>TrackFlow</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {navigation.map((item) => {
              const className = "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-2 text-[0.78rem] font-semibold leading-none text-[var(--marketing-foreground)] transition-colors hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)]"

              if (item.href.startsWith("https://")) {
                return (
                  <a className={className} href={item.href} key={item.label} rel="noreferrer" target="_blank">
                    {item.label}
                    <ArrowUpRight className="size-3" />
                  </a>
                )
              }

              return <Link className={className} key={item.label} to={item.href}>{item.label}</Link>
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-[var(--radius-pill)] px-3 py-2 text-[0.78rem] font-semibold text-[var(--marketing-foreground)] transition-colors hover:text-[var(--marketing-action)]" to="/login">
              Sign in
            </Link>
            <Link className={cn(buttonVariants({ size: "sm" }), "h-9 rounded-[var(--radius-pill)] bg-[var(--marketing-action)] px-5 text-[0.78rem] hover:bg-[var(--marketing-action-strong)]")} to="/signup">
              Sign up
            </Link>

          </div>

          <Button
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="size-11 rounded-full bg-white hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)] md:hidden lg:hidden"
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
            className="mt-4 rounded-[1rem] border border-[var(--marketing-border)] bg-white p-3 shadow-[var(--landing-preview-shadow)] lg:hidden"
            id={menuId}
          >
            <nav aria-label="Mobile primary" className="flex flex-col gap-1">
              {navigation.map((item) => {
                const className = "rounded-[0.8rem] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--marketing-action-soft)]"

                if (item.href.startsWith("https://")) {
                  return <a className={className} href={item.href} key={item.label} onClick={() => setIsOpen(false)} rel="noreferrer" target="_blank">{item.label}</a>
                }

                return <Link className={className} key={item.label} onClick={() => setIsOpen(false)} to={item.href}>{item.label}</Link>
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-2">
              <Link className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-white hover:bg-[var(--marketing-action-soft)] hover:text-[var(--marketing-action)]")} to="/login">
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
