import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/munich-aerial-skyline.jpg";

export const NationwideHero = () => {
  const handleCTA = () => {
    window.open('https://app.spaceseller.de', '_blank');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professionelle Immobilienfotografie deutschlandweit"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Über 500 Fotografen in ganz Deutschland</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Immobilienfotografie,
            <span className="block text-accent">die verkauft – deutschlandweit.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Ein Ansprechpartner. Einheitliche Qualität. Professionelle Bearbeitung inklusive.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="xl" variant="cta" onClick={handleCTA}>
              Fotograf anfragen
            </Button>
            <Button size="xl" variant="outline" onClick={handleCTA}>
              Bilder hochladen & sparen
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            {[
              { icon: CheckCircle2, text: "48h Lieferung garantiert" },
              { icon: CheckCircle2, text: "Professionelle Bearbeitung inkl." },
              { icon: CheckCircle2, text: "Einheitlicher Qualitätsstandard" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-sm">
                <item.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
