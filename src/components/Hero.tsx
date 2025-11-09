import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Check, ArrowRight, Star, TrendingUp, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCounter } from "@/components/StatsCounter";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ClientLogos } from "@/components/ClientLogos";
import { ProcessSteps } from "@/components/ProcessSteps";
import { TrustBadges } from "@/components/TrustBadges";
import { useBannerContext } from "@/contexts/BannerContext";
import beforeExterior from "@/assets/hero-before.jpg";
import afterExterior from "@/assets/hero-after.jpg";

export const Hero = () => {
  const { isBannerVisible } = useBannerContext();
  
  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      {/* Main Hero Section */}
      <div className={`container max-w-7xl mx-auto px-4 pb-8 lg:pb-12 transition-all duration-300 ${isBannerVisible ? 'pt-20 lg:pt-16' : 'pt-8 lg:pt-4'}`}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start lg:items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
            {/* Pre-Headline */}
            <div className="inline-block">
              <span className="text-sm font-semibold text-accent bg-accent/10 px-4 py-2 rounded-full">
                Für Immobilienmakler & Fotografen
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight">
                Verkaufsstarke Immobilienfotos.{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Ob vor Ort fotografiert
                </span>{" "}
                oder Ihre Bilder veredelt.
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                Ihr All-in-One Partner für Immobilien-Marketing: Buchen Sie professionelle Fotografen in Ihrer Region oder nutzen Sie unseren 24h Express-Service für Bildbearbeitung, Virtual Staging & Grundrisse.
              </p>
            </div>

            {/* Social Proof Numbers */}
            <div className="flex flex-wrap items-center gap-3 text-sm py-4 border-y border-border">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="font-semibold text-foreground">⭐ 4.9/5 Sterne</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">500+ zufriedene Makler</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">10.000+ bearbeitete Bilder</span>
            </div>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/immobilienfotografie-muenchen">
                <Button 
                  variant="cta" 
                  size="xl" 
                  className="group"
                >
                  Fotograf buchen
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="xl"
                  className="group border-2"
                >
                  Bilder jetzt bearbeiten
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>

          </div>

          {/* Right Column - Before/After Slider with Floating Stats */}
          <div className="relative animate-scale-in space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <BeforeAfterSlider
                beforeImage={beforeExterior}
                afterImage={afterExterior}
                beforeAlt="Unbearbeitetes Immobilienfoto"
                afterAlt="Professionell bearbeitetes Immobilienfoto"
                className="aspect-[4/3] rounded-2xl"
              />
            </div>
            
            {/* Trust Badges below slider */}
            <div className="flex justify-center">
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>


      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};
