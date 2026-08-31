import { useId, useState } from "react"
import { CaretDown, Kanban, List, X } from "@phosphor-icons/react"

import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"

const navigation = [
  { href: "#features", label: "Features" },
  { href: "#solutions", label: "Solutions" },
  { href: "#pricing", label: "Pricing" },
  { href: "#resources", label: "Resources" },
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
          <a
            href="/"
            className="flex items-center gap-3 text-[1.07rem] font-semibold tracking-tight text-[var(--foreground)]"
          >
            <BrandMark />
            <span>TrackFlow</span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3 py-2 text-[16px] leading-[20px] tracking-[-0.2px] font-semibold text-[var(--foreground)] transition-colors hover:bg-white hover:text-[var(--primary)]"
              >
                {item.label}

              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button className="min-w-24" variant="outline" size="sm" type="button">
              Login
            </Button>
            <Button className="min-w-28 shadow-[0_18px_36px_-24px_rgba(23,63,43,0.4)]" size="sm" type="button">
              Register
            </Button>
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
                  className="rounded-[var(--radius-card)] px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2">
              <Button size="sm" type="button" variant="outline">
                Login
              </Button>
              <Button size="sm" type="button">
                Register
              </Button>
            </div>
          </div>
        ) : null}
      </header>
    </Container>
  )
}
