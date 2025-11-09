import { Palette, Cloud, Ruler, Zap, Shield, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export const SolutionFeatures = () => {
  const features = [
    {
      icon: Palette,
      title: "Farb- & Belichtungskorrektur",
      description: "Professionelle Farbbalance und perfekte Belichtung für jedes Bild",
    },
    {
      icon: Cloud,
      title: "Himmelsaustausch & Objektentfernung",
      description: "Grauer Himmel wird blau, störende Objekte verschwinden",
    },
    {
      icon: Ruler,
      title: "Perspektiv- & Linienkorrektur",
      description: "Stürzende Linien werden korrigiert, Räume wirken größer",
    },
    {
      icon: Zap,
      title: "24-48h Lieferung garantiert",
      description: "Express-Option verfügbar für dringende Exposés",
    },
    {
      icon: Shield,
      title: "100% DSGVO-konform",
      description: "Ihre Daten und Bilder sind bei uns sicher",
    },
    {
      icon: Wand2,
      title: "Premium-Retusche auf Wunsch",
      description: "Individuelle Anpassungen nach Ihren speziellen Anforderungen",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Wir verwandeln Ihre Fotos in verkaufsstarke Exposés
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Alle Bearbeitungen, die Immobilienmakler wirklich brauchen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-elegant transition-all hover:scale-105 duration-200"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
