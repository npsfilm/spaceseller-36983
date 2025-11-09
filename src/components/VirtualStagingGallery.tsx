import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import livingBefore from "@/assets/vs-living-before.jpg";
import livingAfter from "@/assets/vs-living-after.jpg";
import bedroomBefore from "@/assets/vs-bedroom-before.jpg";
import bedroomAfter from "@/assets/vs-bedroom-after.jpg";
import kitchenBefore from "@/assets/vs-kitchen-before.jpg";
import kitchenAfter from "@/assets/vs-kitchen-after.jpg";

export const VirtualStagingGallery = () => {
  const examples = [
    {
      before: livingBefore,
      after: livingAfter,
      title: "Wohnzimmer - Modern",
      description: "85m² Wohnung, moderner Stil",
    },
    {
      before: bedroomBefore,
      after: bedroomAfter,
      title: "Schlafzimmer - Scandinavian",
      description: "Helle, einladende Atmosphäre",
    },
    {
      before: kitchenBefore,
      after: kitchenAfter,
      title: "Küche - Contemporary",
      description: "Funktional und stilvoll",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Von leer zu 'Wow!' in 48 Stunden</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sehen Sie die Transformation – ziehen Sie den Slider, um den Unterschied zu erleben
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {examples.map((example, index) => (
            <div key={index} className="space-y-4">
              <BeforeAfterSlider
                beforeImage={example.before}
                afterImage={example.after}
                className="rounded-lg overflow-hidden shadow-xl"
              />
              <div className="text-center">
                <h3 className="font-bold text-lg">{example.title}</h3>
                <p className="text-muted-foreground">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
