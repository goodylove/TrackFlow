import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export function SectionHeading({ title, description, centered = true }: { title: string; description?: string; centered?: boolean }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={cn("max-w-[40rem]", centered && "mx-auto text-center")}>
      <motion.h2
        aria-label={title}
        className="text-[2.25rem] font-black leading-[1.04] tracking-[-0.035em] text-[var(--marketing-foreground)] sm:text-[3rem]"
        initial="hidden"
        viewport={{ amount: 0.65, once: false }}
        whileInView="visible"
      >
        {title.split(" ").map((word, index) => (
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom" key={`${word}-${index}`}>
            <motion.span
              className="mr-[0.22em] inline-block"
              variants={{
                hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: "105%" },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.055, duration: 0.68, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      {description ? (
        <motion.p
          className="mt-4 text-base leading-7 text-[var(--marketing-muted-foreground)] sm:text-[1.0625rem] sm:leading-8"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          transition={{ delay: 0.16, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.7, once: false }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  )
}
