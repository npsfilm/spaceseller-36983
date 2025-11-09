import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import reLivingBefore from "@/assets/re-living-before.jpg";
import reLivingAfter from "@/assets/re-living-after.jpg";
import reKitchenBefore from "@/assets/re-kitchen-before.jpg";
import reKitchenAfter from "@/assets/re-kitchen-after.jpg";
import reBedroomBefore from "@/assets/re-bedroom-before.jpg";
import reBedroomAfter from "@/assets/re-bedroom-after.jpg";
import reExteriorBefore from "@/assets/re-exterior-before.jpg";
import reExteriorAfter from "@/assets/re-exterior-after.jpg";
import reGardenBefore from "@/assets/re-garden-before.jpg";
import reGardenAfter from "@/assets/re-garden-after.jpg";

export const BeforeAfterShowcase = () => {
  const examples = [
    {
      before: reLivingBefore,
      after: reLivingAfter,
      title: "3-Zimmer Wohnung, Schwabing",
      result: "Verkauft in 5 Tagen • 8% über Angebotspreis",
    },
    {
      before: reKitchenBefore,
      after: reKitchenAfter,
      title: "Luxus-Apartment, Bogenhausen",
      result: "12 Tage schneller verkauft als Durchschnitt",
    },
    {
      before: reBedroomBefore,
      after: reBedroomAfter,
      title: "Premium-Penthouse, Maxvorstadt",
      result: "3x mehr Anfragen nach Fotoupdate",
    },
    {
      before: reExteriorBefore,
      after: reExteriorAfter,
      title: "Villa, Grünwald",
      result: "15% höherer Verkaufspreis erzielt",
    },
    {
      before: reGardenBefore,
      after: reGardenAfter,
      title: "Einfamilienhaus, Starnberg",
      result: "Verkauft in unter 2 Wochen",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Der Beweis: Vorher vs. Nachher
          </h2>
          <p className="text-xl text-muted-foreground">
            Sehen Sie den Unterschied, den professionelle Fotografie macht. 
            Jedes Foto erzählt eine Erfolgsgeschichte.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {examples.map((example, index) => (
            <div key={index} className="space-y-4 group">
              <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-border group-hover:border-accent transition-colors">
                <BeforeAfterSlider
                  beforeImage={example.before}
                  afterImage={example.after}
                  beforeAlt={`${example.title} - Vorher`}
                  afterAlt={`${example.title} - Nachher`}
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-lg">{example.title}</h3>
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ {example.result}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg font-semibold text-accent">
            Durchschnittlich 12 Tage schnellerer Verkauf mit professionellen Fotos
          </p>
        </div>
      </div>
    </section>
  );
};
