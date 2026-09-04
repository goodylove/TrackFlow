import { Link } from "react-router-dom"

import { Container } from "@/components/shared/container"

import { Reveal } from "./reveal"

const footerGroups = [
  ["About", ["Why TrackFlow", "Workspaces", "Team issues"]],
  ["Use cases", ["Project tracking", "Bug triage", "Team handoffs"]],
  ["Product", ["Issue boards", "Comments", "Dashboard"]],
  ["Help", ["GitHub", "Sign in", "Register"]],
] as const

export function LandingFooter() {
  return <footer className="bg-white pb-12 pt-8" id="footer">
    <Container><Reveal direction="right"><div className="grid gap-10 border-b border-[var(--marketing-border)] pb-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]"><div><Link to="/" className="text-sm font-black text-[var(--marketing-action)]">TrackFlow</Link><p className="mt-4 max-w-[14rem] text-[0.82rem] leading-6 text-[var(--marketing-muted-foreground)]">Helping teams stay on track, collaborate seamlessly, and resolve issues effectively.</p></div>{footerGroups.map(([heading, links]) => <div key={heading}><h3 className="text-[0.78rem] font-black text-[#171722]">{heading}</h3><div className="mt-4 space-y-3">{links.map((label) => {
      const href = label === "GitHub" ? "https://github.com/goodylove/TrackFlow" : label === "Sign in" ? "/login" : label === "Register" ? "/signup" : "#features"
      const className = "block text-[0.76rem] font-medium text-[var(--marketing-muted-foreground)] transition-colors hover:text-[var(--marketing-action)]"
      if (href.startsWith("https://")) return <a key={label} className={className} href={href} rel="noreferrer" target="_blank">{label}</a>
      if (href.startsWith("#")) return <Link key={label} className={className} to={href}>{label}</Link>
      return <Link key={label} className={className} to={href}>{label}</Link>
    })}</div></div>)}</div><div className="flex flex-col gap-3 pt-6 text-[0.72rem] font-medium text-[var(--marketing-muted-foreground)] sm:flex-row sm:items-center sm:justify-between"><p>&copy; 2026 TrackFlow. All rights reserved.</p><div className="flex gap-5"><a href="https://github.com/goodylove/TrackFlow" className="hover:text-[var(--marketing-action)]" rel="noreferrer" target="_blank">GitHub</a><Link to="/login" className="hover:text-[var(--marketing-action)]">Sign in</Link></div></div></Reveal></Container>
  </footer>
}
