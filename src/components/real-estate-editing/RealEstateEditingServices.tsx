import { Card } from "@/components/ui/card";
import { Cloud, Trash2, Sparkles, Sun, Grid3x3, Palette } from "lucide-react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import exteriorBefore from "@/assets/re-exterior-before.jpg";
import exteriorAfter from "@/assets/re-exterior-after.jpg";
import buildingBefore from "@/assets/re-building-before.jpg";
import buildingAfter from "@/assets/re-building-after.jpg";
import gardenBefore from "@/assets/re-garden-before.jpg";
import gardenAfter from "@/assets/re-garden-after.jpg";
import livingBefore from "@/assets/re-living-before.jpg";
import livingAfter from "@/assets/re-living-after.jpg";
import bedroomBefore from "@/assets/re-bedroom-before.jpg";
import bedroomAfter from "@/assets/re-bedroom-after.jpg";
import entranceBefore from "@/assets/re-entrance-before.jpg";
import entranceAfter from "@/assets/re-entrance-after.jpg";

export const RealEstateEditingServices = () => {
  const services = [
    {
      icon: Cloud,
      title: "Himmelsaustausch",
      description: "Graue Himmel in strahlend blaues Wetter",
      technical: "Natürliche Lichtanpassung, realistische Reflexionen",
      price: "+3€ pro Bild",
      beforeImage: exteriorBefore,
      afterImage: exteriorAfter,
    },
    {
      icon: Trash2,
      title: "Objektentfernung",
      description: "Störende Objekte nahtlos entfernen",
      technical: "Mülltonnen, Laternen, Schilder, Kabel",
      price: "5€ pro Bild",
      beforeImage: buildingBefore,
      afterImage: buildingAfter,
    },
    {
      icon: Sparkles,
      title: "Rasen & Vegetation",
      description: "Braune Rasenflächen in saftige grüne Wiesen",
      technical: "Natürliche Sättigung ohne Übertreibung",
      price: "8€ pro Bild",
      beforeImage: gardenBefore,
      afterImage: gardenAfter,
    },
    {
      icon: Sun,
      title: "HDR & Belichtungskorrektur",
      description: "Perfekte Belichtung in allen Bildbereichen",
      technical: "HDR-Merging, Window Pull, Exposure Blending",
      price: "+2€ pro Bild",
      beforeImage: livingBefore,
      afterImage: livingAfter,
    },
    {
      icon: Grid3x3,
      title: "Perspektivkorrektur",
      description: "Stürzende Linien korrigieren",
      technical: "Vertikale/horizontale Ausrichtung",
      price: "Im Basispreis enthalten",
      beforeImage: bedroomBefore,
      afterImage: bedroomAfter,
    },
    {
      icon: Palette,
      title: "Farbkorrektur & Color Grading",
      description: "Perfekte Farbbalance und Weißabgleich",
      technical: "Professionelles Color Grading",
      price: "Im Basispreis enthalten",
      beforeImage: entranceBefore,
      afterImage: entranceAfter,
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professionelle Bildbearbeitung für Immobilien
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Spezialisierte Services für Immobilienfotografen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="aspect-video overflow-hidden">
                <BeforeAfterSlider
                  beforeImage={service.beforeImage}
                  afterImage={service.afterImage}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-foreground mb-2">{service.description}</p>
                <p className="text-sm text-muted-foreground mb-3">
                  {service.technical}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Preis:</span>
                  <span className="text-lg font-semibold text-accent">
                    {service.price}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
