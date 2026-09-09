import { motion, useAnimationControls, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion"
import { useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type EntranceDirection = "left" | "right" | "up" | "down"

type EntranceProps = {
  children: ReactNode
  className?: string
  delay?: number
  direction?: EntranceDirection
  distance?: number
}

type HiddenState = {
  opacity: number
  x?: number
  y?: number
  filter: string
}

const transition = {
  duration: 0.78,
  ease: [0.22, 1, 0.36, 1] as const,
}

function hiddenState(direction: EntranceDirection, distance: number): HiddenState {
  if (direction === "left") return { opacity: 0, x: -distance * 0.45, y: distance * 0.2, filter: "blur(6px)" }
  if (direction === "right") return { opacity: 0, x: distance * 0.45, y: distance * 0.2, filter: "blur(6px)" }
  if (direction === "down") return { opacity: 0, y: -distance * 0.65, filter: "blur(6px)" }

  return { opacity: 0, y: distance * 0.65, filter: "blur(6px)" }
}

function directionalHiddenState(direction: EntranceDirection, distance: number, scrollDirection: 1 | -1) {
  const state = hiddenState(direction, distance)
  if (scrollDirection === 1) return state

  return {
    ...state,
    x: typeof state.x === "number" ? -state.x : state.x,
    y: typeof state.y === "number" ? -state.y : state.y,
  }
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
      transition={{ ...transition, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  )
}

export function LoadReveal(props: EntranceProps) {
  return <MotionEntrance {...props} animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }} />
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 32,
}: EntranceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const previousScroll = useRef(0)
  const scrollDirection = useRef<1 | -1>(1)
  const controls = useAnimationControls()
  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { amount: 0.18 })
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextDirection = latest >= previousScroll.current ? 1 : -1
    previousScroll.current = latest

    if (nextDirection !== scrollDirection.current) {
      scrollDirection.current = nextDirection
      if (!isInView && !shouldReduceMotion) {
        controls.set(directionalHiddenState(direction, distance, nextDirection))
      }
    }
  })

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.set({ opacity: 1, x: 0, y: 0, filter: "blur(0px)" })
      return
    }

    if (isInView) {
      void controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
        transition: { ...transition, delay: delay / 1000 },
      })
    } else {
      controls.set(directionalHiddenState(direction, distance, scrollDirection.current))
    }
  }, [controls, delay, direction, distance, isInView, shouldReduceMotion])

  return (
    <motion.div
      animate={controls}
      className={className}
      initial={shouldReduceMotion ? false : hiddenState(direction, distance)}
      ref={ref}
    >
      {children}
    </motion.div>
  )
}

export function StickyStackCard({
  children,
  className,
  index,
}: {
  children: ReactNode
  className?: string
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [0.94, 1, 1, 0.965])
  const y = useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [42, 0, 0, -18])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.86, 1], [0.72, 1, 1, 0.9])

  return (
    <div className="landing-stack-stage" ref={ref}>
      <motion.div
        className={cn("landing-stack-card", className)}
        style={{
          opacity: shouldReduceMotion ? 1 : opacity,
          scale: shouldReduceMotion ? 1 : scale,
          top: `${88 + index * 12}px`,
          y: shouldReduceMotion ? 0 : y,
          zIndex: index + 1,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function WordReveal({
  className,
  delay = 0.08,
  text,
}: {
  className?: string
  delay?: number
  text: string
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split(" ").map((word, index) => (
        <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom" key={`${word}-${index}`}>
          <motion.span
            className="mr-[0.22em] inline-block"
            variants={{
              hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: "105%" },
              visible: {
                opacity: 1,
                y: 0,
                transition: { ...transition, delay: 0.12 + index * delay },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

export function ScrollLift({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [14, -14])

  return <motion.div className={className} ref={ref} style={{ y: shouldReduceMotion ? 0 : y }}>{children}</motion.div>
}
