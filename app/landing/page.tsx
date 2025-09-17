"use client";
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import Footer from '../../components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
