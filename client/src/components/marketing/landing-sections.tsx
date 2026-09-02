import { BenefitsSection } from "./landing/benefits-section"
import { FeaturesSection } from "./landing/features-section"
import { FinalCtaSection } from "./landing/final-cta-section"
import { LandingFooter } from "./landing/landing-footer"

export function LandingSections() {
  return (
    <>
      <BenefitsSection />
      <FeaturesSection />
      <FinalCtaSection />
      <LandingFooter />
    </>
  )
}
