import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import backgroundImage from "@/assets/re-living-after.jpg";

export const FinalCTA = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full text-background border border-accent/30">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Limitiertes Angebot</span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
          Ihre Immobilien verdienen den besten ersten Eindruck
        </h2>

        <p className="text-xl md:text-2xl text-background/90 max-w-2xl mx-auto">
          Sichern Sie sich jetzt <span className="font-bold text-accent">20% Rabatt</span> auf 
          Ihren ersten Auftrag und erleben Sie den Unterschied
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="xl" 
            variant="cta"
            className="min-h-[56px] text-lg bg-accent hover:bg-accent-glow text-accent-foreground shadow-lg"
            asChild
          >
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">
              Bilder jetzt bearbeiten lassen
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button 
            size="xl" 
            variant="outline"
            className="min-h-[56px] text-lg bg-background/10 backdrop-blur-sm text-background border-background/30 hover:bg-background/20"
            onClick={scrollToTop}
          >
            Zurück zu Beispielen
          </Button>
        </div>

        <div className="pt-8 space-y-3 text-background/80">
          <p className="text-sm">
            ✓ Lieferung in 24-48 Stunden • ✓ Geld-zurück-Garantie • ✓ Unbegrenzte Revisionen
          </p>
          <p className="text-xs">
            *20% Rabatt gilt für Erstaufträge bis 31.12.2025
          </p>
        </div>
      </div>
    </section>
  );
};
