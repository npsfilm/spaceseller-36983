import { Cloud, Trash2, Sparkles, Grid3x3, Sun, Wand2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EditingFeaturesList = () => {
  const features = [
    {
      icon: Cloud,
      title: "Himmelsaustausch & Farboptimierung",
      description: "Graue Tage werden zu strahlend blauen Traumhimmeln",
    },
    {
      icon: Sparkles,
      title: "Rasen- & Pflanzenkorrektur",
      description: "Braune Flächen in sattes, natürliches Grün verwandeln",
    },
    {
      icon: Trash2,
      title: "Objektentfernung",
      description: "Mülltonnen, Autos, Personen und störende Elemente entfernen",
    },
    {
      icon: Grid3x3,
      title: "Perspektiv- & Linienkorrektur",
      description: "Stürzende Linien korrigieren, professionelle Geometrie",
    },
    {
      icon: Sun,
      title: "Fensteransicht & Belichtungsbalance",
      description: "HDR-Merging für perfekt ausbalancierte Innen- und Außenansichten",
    },
    {
      icon: Wand2,
      title: "Premium-Retusche auf Wunsch",
      description: "Individuelle Anpassungen nach deinen speziellen Anforderungen",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professionelle Bearbeitung für jede Situation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Alle Standard-Bearbeitungen, die Immobilienfotografen benötigen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="text-lg px-8">
            Beispielarbeiten ansehen
          </Button>
        </div>
      </div>
    </section>
  );
};
