import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import exteriorBefore from "@/assets/re-exterior-before.jpg";
import exteriorAfter from "@/assets/re-exterior-after.jpg";
import buildingBefore from "@/assets/re-building-before.jpg";
import buildingAfter from "@/assets/re-building-after.jpg";
import entranceBefore from "@/assets/re-entrance-before.jpg";
import entranceAfter from "@/assets/re-entrance-after.jpg";
import gardenBefore from "@/assets/re-garden-before.jpg";
import gardenAfter from "@/assets/re-garden-after.jpg";
import livingBefore from "@/assets/re-living-before.jpg";
import livingAfter from "@/assets/re-living-after.jpg";
import kitchenBefore from "@/assets/re-kitchen-before.jpg";
import kitchenAfter from "@/assets/re-kitchen-after.jpg";
import bedroomBefore from "@/assets/re-bedroom-before.jpg";
import bedroomAfter from "@/assets/re-bedroom-after.jpg";
import dayBefore from "@/assets/re-day-before.jpg";
import dayAfter from "@/assets/re-day-after.jpg";
import emptyBefore from "@/assets/re-empty-before.jpg";
import emptyAfter from "@/assets/re-empty-after.jpg";

export const RealEstateEditingGallery = () => {
  const examples = [
    {
      before: exteriorBefore,
      after: exteriorAfter,
      title: "Komplette Transformation",
      caption: "Sky + Objektentfernung + Rasen",
      category: "Exterior",
    },
    {
      before: buildingBefore,
      after: buildingAfter,
      title: "Objektentfernung",
      caption: "Laternen, Kabel & Schilder entfernt",
      category: "Exterior",
    },
    {
      before: entranceBefore,
      after: entranceAfter,
      title: "Farbkorrektur",
      caption: "Professionelles Color Grading",
      category: "Exterior",
    },
    {
      before: gardenBefore,
      after: gardenAfter,
      title: "Rasenbearbeitung",
      caption: "Braun zu sattem Grün",
      category: "Exterior",
    },
    {
      before: livingBefore,
      after: livingAfter,
      title: "HDR Innenraum",
      caption: "Perfekt ausbalancierte Belichtung",
      category: "Interior",
    },
    {
      before: kitchenBefore,
      after: kitchenAfter,
      title: "Küche Farbkorrektur",
      caption: "Warme einladende Atmosphäre",
      category: "Interior",
    },
    {
      before: bedroomBefore,
      after: bedroomAfter,
      title: "Perspektivkorrektur",
      caption: "Gerade Wände & professionelle Geometrie",
      category: "Interior",
    },
    {
      before: dayBefore,
      after: dayAfter,
      title: "Day-to-Dusk",
      caption: "Premium Dämmerungsumwandlung",
      category: "Special",
    },
    {
      before: emptyBefore,
      after: emptyAfter,
      title: "Virtual Staging",
      caption: "Leerer Raum zu möbliertem Traumzimmer",
      category: "Special",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unsere Ergebnisse sprechen für sich
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jedes Bild bearbeitet von Immobilien-Spezialisten
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div key={index} className="space-y-4">
              <BeforeAfterSlider
                beforeImage={example.before}
                afterImage={example.after}
              />
              <div className="text-center">
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-2">
                  {example.category}
                </div>
                <h3 className="font-semibold mb-1">{example.title}</h3>
                <p className="text-sm text-muted-foreground">{example.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
