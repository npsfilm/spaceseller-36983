import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroProperty from "@/assets/hero-property.jpg";

export const FinalCTA = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroProperty}
          alt="Luxury Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            Bereit, Ihre Immobilien schneller zu verkaufen?
          </h2>

          {/* Description */}
          <p className="text-xl text-primary-foreground/90 leading-relaxed">
            Starten Sie noch heute mit 20% Rabatt – egal ob Sie unseren Express-Bearbeitungsservice nutzen oder ein komplettes Shooting buchen.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button variant="cta" size="xl" className="group">
              Fotograf anfragen
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
            >
              Bilder hochladen & 20% sparen
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 justify-center text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Zufriedenheitsgarantie</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Regionale Fotografen</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>24h Express-Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl"></div>
    </section>
  );
};
