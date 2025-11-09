import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import beforeExterior from "@/assets/re-exterior-before.jpg";
import afterExterior from "@/assets/re-exterior-after.jpg";
import beforeLiving from "@/assets/re-living-before.jpg";
import afterLiving from "@/assets/re-living-after.jpg";
import beforeKitchen from "@/assets/re-kitchen-before.jpg";
import afterKitchen from "@/assets/re-kitchen-after.jpg";
import beforeBedroom from "@/assets/re-bedroom-before.jpg";
import afterBedroom from "@/assets/re-bedroom-after.jpg";

export const NationwideGallery = () => {
  const examples = [
    {
      before: beforeExterior,
      after: afterExterior,
      title: "Außenaufnahmen",
      description: "Professionelle Fassadenfotografie mit optimaler Beleuchtung",
    },
    {
      before: beforeLiving,
      after: afterLiving,
      title: "Wohnräume",
      description: "Einladende Innenaufnahmen mit perfekter Perspektive",
    },
    {
      before: beforeKitchen,
      after: afterKitchen,
      title: "Küchen",
      description: "Moderne Kücheninszenierung mit Liebe zum Detail",
    },
    {
      before: beforeBedroom,
      after: afterBedroom,
      title: "Schlafzimmer",
      description: "Gemütliche Atmosphäre professionell eingefangen",
    },
  ];

  const handleCTA = () => {
    window.open('https://app.spaceseller.de', '_blank');
  };

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vorher/Nachher:
            <span className="block text-accent">Der Unterschied ist sichtbar</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Professionelle Bearbeitung macht den Unterschied – ziehen Sie den Regler, um den Effekt zu sehen
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {examples.map((example, index) => (
            <div key={index} className="space-y-4">
              <BeforeAfterSlider
                beforeImage={example.before}
                afterImage={example.after}
                beforeAlt={`${example.title} - Vorher`}
                afterAlt={`${example.title} - Nachher`}
              />
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">{example.title}</h3>
                <p className="text-muted-foreground">{example.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="xl" variant="cta" onClick={handleCTA}>
            Jetzt Fotograf buchen
          </Button>
        </div>
      </div>
    </section>
  );
};
