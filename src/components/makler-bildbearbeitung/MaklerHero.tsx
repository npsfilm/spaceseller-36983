import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ArrowDown } from "lucide-react";
import heroBeforeImage from "@/assets/re-exterior-before.jpg";
import heroAfterImage from "@/assets/re-exterior-after.jpg";

export const MaklerHero = () => {
  const scrollToGallery = () => {
    const gallery = document.getElementById("gallery");
    gallery?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Ihre Fotos verkaufen nicht so, wie sie sollten?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Professionelle Bildbearbeitung ab <span className="text-accent font-semibold">8€ pro Bild</span> – 
              Lieferung in <span className="text-accent font-semibold">48 Stunden</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="xl" 
                variant="cta"
                className="min-h-[56px] text-lg"
                asChild
              >
                <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Bilder jetzt verbessern</a>
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="min-h-[56px] text-lg"
                onClick={scrollToGallery}
              >
                <ArrowDown className="mr-2 h-5 w-5" />
                Beispiele ansehen
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              ✓ Keine Verpflichtung • ✓ 20% Rabatt auf ersten Auftrag • ✓ 100% DSGVO-konform
            </p>
          </div>

          {/* Before/After Slider */}
          <div className="w-full">
            <BeforeAfterSlider
              beforeImage={heroBeforeImage}
              afterImage={heroAfterImage}
              beforeAlt="Unbearbeitetes Immobilienfoto"
              afterAlt="Professionell bearbeitetes Immobilienfoto"
              className="h-[300px] md:h-[400px] lg:h-[500px] rounded-xl shadow-elegant"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
