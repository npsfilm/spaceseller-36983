import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import ctaImage from "@/assets/munich-penthouse-terrace.jpg";

export const NationwideFinalCTA = () => {
  const handleCTA = () => {
    window.open('https://app.spaceseller.de', '_blank');
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={ctaImage}
                alt="Professionelle Immobilienfotografie"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-12 md:p-16 lg:p-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Immobilienfotografie, die verkauft –
                  <span className="block text-accent">egal wo Sie sind.</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  Deutschlandweites Netzwerk, zentrale Koordination, einheitliche Qualität. 
                  Starten Sie jetzt mit professionellen Immobilienfotos.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="xl" variant="cta" onClick={handleCTA} className="gap-2">
                    <Camera className="w-5 h-5" />
                    Fotograf anfragen
                  </Button>
                  <Button size="xl" variant="outline" onClick={handleCTA} className="gap-2">
                    <Upload className="w-5 h-5" />
                    Bilder hochladen
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>48h Lieferung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Bearbeitung inklusive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span>Geld-zurück-Garantie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
