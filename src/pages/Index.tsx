import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { TwoPathways } from "@/components/TwoPathways";
import { ClientLogos } from "@/components/ClientLogos";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { ProcessSteps } from "@/components/ProcessSteps";
import { PricingTabs } from "@/components/PricingTabs";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

const Index = () => {
  return (
    <Layout>
      <div className="pt-32">
        {/* Hero Section - Main value proposition */}
        <Hero />

        {/* Two Pathways - Dual service offering */}
        <TwoPathways />

        {/* Client Logos - Trust brands */}
        <div className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <ClientLogos />
          </div>
        </div>

        {/* Portfolio - Before/After examples */}
        <Portfolio />

        {/* Services - All services detail */}
        <Services />

        {/* Process - How it works */}
        <ProcessSteps />

        {/* Pricing - Tabbed pricing (Express vs Photography) */}
        <PricingTabs />

        {/* Social Proof - Testimonials */}
        <div className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Darum vertrauen uns <span className="bg-gradient-hero bg-clip-text text-transparent">über 500 Makler</span>
              </h2>
            </div>
            <TestimonialCarousel />
          </div>
        </div>

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <FinalCTA />
      </div>
    </Layout>
  );
};

export default Index;
