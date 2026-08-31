import { Hero } from "@/components/marketing/hero"
import { Navbar } from "@/components/marketing/navbar"

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--marketing-page)] text-[var(--foreground)]">
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_var(--marketing-glow)_0,_transparent_62%)]" /> */}

      <Navbar />

      <main>
        <Hero />
      </main>
    </div>
  )
}

export default App
