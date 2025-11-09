import { Clock, AlertCircle, TrendingDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const PainPoints = () => {
  const painPoints = [
    {
      icon: Clock,
      title: "3 Sekunden Entscheidungszeit",
      description: "Online-Nutzer entscheiden blitzschnell. Graue Bilder = verpasste Chance.",
    },
    {
      icon: AlertCircle,
      title: "Unprofessioneller Eindruck",
      description: "Schlechte Fotos lassen selbst Premium-Objekte minderwertig wirken.",
    },
    {
      icon: TrendingDown,
      title: "Verlorene Anfragen",
      description: "Weniger Klicks bedeuten weniger Besichtigungen und längere Verkaufszeiten.",
    },
    {
      icon: Calendar,
      title: "Keine Zeit für Photoshop",
      description: "Sie verkaufen Immobilien – nicht Ihre Zeit für Bildbearbeitung.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Was gute Makler bremst, sind schlechte Bilder.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ihre Immobilien verdienen mehr als durchschnittliche Fotos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {painPoints.map((point, index) => (
            <Card key={index} className="p-6 hover:shadow-elegant transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <point.icon className="w-6 h-6 md:w-8 md:h-8 text-destructive" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-semibold">{point.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="cta" className="min-h-[48px]" asChild>
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Problem jetzt lösen</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
