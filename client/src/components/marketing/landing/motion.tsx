import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"

type EntranceDirection = "left" | "right" | "up" | "down"

type EntranceProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: EntranceDirection
  distance?: number
}

const transition = {
  duration: 0.72,
  ease: [0.22, 1, 0.36, 1] as const,
}

function hiddenState(direction: EntranceDirection, distance: number) {
  if (direction === "left") return { opacity: 0, x: -distance }
  if (direction === "right") return { opacity: 0, x: distance }
  if (direction === "down") return { opacity: 0, y: -distance }

  return { opacity: 0, y: distance }
}

function MotionEntrance({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 32,
  ...props
}: EntranceProps & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion()
  const initial = hiddenState(direction, distance)

  return (
    <motion.div
      {...props}
      className={className}
      initial={shouldReduceMotion ? false : initial}
      transition={{ ...transition, delay: delay / 2000 }}
    >
      {children}
    </motion.div>
  )
}

export function LoadReveal(props: EntranceProps) {
  return <MotionEntrance {...props} animate={{ opacity: 1, x: 0, y: 0 }} />
}

export function ScrollReveal(props: EntranceProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <MotionEntrance
      {...props}
      viewport={{ once: true, amount: 0.18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
    />
  )
}
