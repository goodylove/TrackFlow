import type { ReactNode } from "react"

import { ScrollReveal } from "./motion"

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "left" | "right" | "up" | "down"
}) {
  return (
    <ScrollReveal className={className} delay={delay} direction={direction}>
      {children}
    </ScrollReveal>
  )
}
