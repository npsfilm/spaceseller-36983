import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import heroImage from "@/assets/augsburg-hero.jpg";

export const FotografenHero = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Immobilienfotograf bei der Arbeit" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-8 h-8 text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Partner-Programm
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Werde Teil von spaceseller – Fotografiere Immobilien, wir übernehmen den Rest.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Mehr Aufträge. Kein Marketing. Keine Nachbearbeitung. Werde offizieller spaceseller Partner-Fotograf in deiner Region.
          </p>

          {/* Map Overlay Highlight */}
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 mb-8 inline-block">
            <p className="text-sm text-muted-foreground mb-2">Wir expandieren in:</p>
            <div className="flex flex-wrap gap-3">
              {["München", "Augsburg", "Stuttgart", "Wien", "Zürich", "Frankfurt", "Hamburg", "Berlin"].map((city) => (
                <span key={city} className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="xl" 
              variant="cta"
              onClick={scrollToForm}
              className="text-lg"
            >
              Jetzt Partner werden
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              className="text-lg"
            >
              3 Testaufträge ansehen
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              ✓ 100+ Partner im Aufbau
            </span>
            <span className="flex items-center gap-2">
              ✓ Faire Bezahlung
            </span>
            <span className="flex items-center gap-2">
              ✓ Volle Flexibilität
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
