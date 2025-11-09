import { Button } from "@/components/ui/button";
import { MapPin, Clock, Camera, Award, Shield } from "lucide-react";
import augsburgHero from "@/assets/augsburg-hero.jpg";

export const AugsburgHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={augsburgHero}
          alt="Professionelle Immobilienfotografie Augsburg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Ihr lokaler Immobilienfotograf in Augsburg</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Professionelle Immobilienfotografie in{" "}
            <span className="text-accent">Augsburg</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Verkaufen Sie Ihre Immobilien schneller mit hochwertigen Fotos. 
            Ihr lokaler Partner für Immobilienfotografie in Augsburg und Umgebung.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border">
            <div className="flex flex-col items-center text-center">
              <MapPin className="w-6 h-6 text-accent mb-2" />
              <span className="text-xs text-muted-foreground">Lokaler Service</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-6 h-6 text-accent mb-2" />
              <span className="text-xs text-muted-foreground">24h Lieferung</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Camera className="w-6 h-6 text-accent mb-2" />
              <span className="text-xs text-muted-foreground">Inkl. Bearbeitung</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="w-6 h-6 text-accent mb-2" />
              <span className="text-xs text-muted-foreground">200+ Objekte</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-6 h-6 text-accent mb-2" />
              <span className="text-xs text-muted-foreground">Drohne verfügbar</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg">
              Jetzt Termin vereinbaren
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Portfolio ansehen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
