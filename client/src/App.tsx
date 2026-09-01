import { Navigate, Route, Routes } from "react-router-dom"

import { AuthPage } from "@/components/auth/auth-page"
import { Hero } from "@/components/marketing/hero"
import { LandingSections } from "@/components/marketing/landing-sections"
import { Navbar } from "@/components/marketing/navbar"

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--marketing-page)] text-[var(--foreground)]">
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_var(--marketing-glow)_0,_transparent_62%)]" /> */}

      <Navbar />

      <main>
        <Hero />
        <LandingSections />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage key="login" mode="login" />} />
      <Route path="/signup" element={<AuthPage key="signup" mode="signup" />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
