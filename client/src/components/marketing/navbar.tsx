import { useId, useState } from "react"
import { GithubLogo, Kanban, List, X } from "@phosphor-icons/react"
import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "https://github.com/goodylove/TrackFlow", label: "GitHub" },
]

function BrandMark() {
  return (
    <div className="flex size-10 items-center justify-center rounded-[27px] bg-[var(--foreground)] shadow-sm">
      <Kanban className="size-6 text-white" weight="fill" />
    </div>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  return (
    <Container className="pt-4 sm:pt-6">
      <header className=" border-[var(--marketing-border)] pb-2">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 text-[1.07rem] font-semibold tracking-tight text-[var(--foreground)]"
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
                className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-2 text-[16px] leading-[20px] tracking-[-0.2px] font-semibold text-[var(--foreground)] transition-colors hover:bg-white hover:text-[var(--primary)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link className={cn(buttonVariants({ variant: "outline", size: "sm" }), "min-w-24")} to="/login">
              Sign in
            </Link>
            <Link className={cn(buttonVariants({ size: "sm" }), "min-w-28 shadow-[0_18px_36px_-24px_rgba(23,63,43,0.4)]")} to="/signup">
              Register
            </Link>
            <a
              aria-label="TrackFlow GitHub repository"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
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
            className="md:hidden lg:hidden"
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
            className="mt-4 border-t border-[var(--marketing-border)] pt-4 lg:hidden"
            id={menuId}
          >
            <nav aria-label="Mobile primary" className="flex flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  rel={item.href.startsWith("https://") ? "noreferrer" : undefined}
                  target={item.href.startsWith("https://") ? "_blank" : undefined}
                  className="rounded-[var(--radius-card)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white"
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
              <Link className={buttonVariants({ size: "sm" })} to="/signup">
                Register
              </Link>
            </div>
          </div>
        ) : null}
      </header>
    </Container>
  )
}
