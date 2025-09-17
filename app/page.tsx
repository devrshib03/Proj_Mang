import BenefitsSection from "components/BenefitsSection";
import CTASection from "components/CTASection";
import DemoSection from "components/DemoSection";
import Features from "components/Features";
import Footer from "components/Footer";
import Header from "components/Header";
import Hero from "components/Hero";
import HowItWorks from "components/HowItWorks";
import PricingSection from "components/PricingSection";
import TestimonialsSection from "components/TestimonialsSection";


export default function Home() {
  return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <Hero />
            <Features />
            <HowItWorks />
            <DemoSection />
            <BenefitsSection />
            <PricingSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
          </main>
  );
}
