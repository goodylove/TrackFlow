import { BenefitsSection } from "./landing/benefits-section"
import { CreatorProofSection } from "./landing/creator-proof-section"
import { FeaturesSection } from "./landing/features-section"
import { FinalCtaSection } from "./landing/final-cta-section"
import { LandingFooter } from "./landing/landing-footer"

export function LandingSections() {
  return (
    <>
      <BenefitsSection />
      <FeaturesSection />
      {/* <CreatorProofSection /> */}
      <FinalCtaSection />
      <LandingFooter />
    </>
  )
}
