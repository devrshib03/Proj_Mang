"use client";

import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import HowItWorks from "components/HowItWorks";
import DemoSection from "components/DemoSection";
import BenefitsSection from "components/BenefitsSection";
import PricingSection from "components/PricingSection";
import TestimonialsSection from "components/TestimonialsSection";
import CTASection from "components/CTASection";

export default function LandingPage() {
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
