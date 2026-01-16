import { Header, Hero, Features, HowItWorks, CTA, Footer } from '@/components/landing'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
