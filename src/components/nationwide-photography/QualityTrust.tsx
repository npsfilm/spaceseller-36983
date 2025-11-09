import { Shield, Clock, Lock, CheckCircle2, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const QualityTrust = () => {
  const badges = [
    {
      icon: Clock,
      title: "48h Lieferung garantiert",
      description: "Oder Sie erhalten Ihr Geld zurück",
    },
    {
      icon: Award,
      title: "4.9⭐ Kundenzufriedenheit",
      description: "Über 2.000 zufriedene Kunden",
    },
    {
      icon: Lock,
      title: "100% DSGVO-konform",
      description: "Sichere Verarbeitung aller Daten",
    },
    {
      icon: CheckCircle2,
      title: "Einheitlicher Qualitätsstandard",
      description: "Zentrale Qualitätssicherung",
    },
    {
      icon: Shield,
      title: "Geld-zurück-Garantie",
      description: "Nicht zufrieden? Geld zurück",
    },
    {
      icon: TrendingUp,
      title: "Über 500 Partner-Fotografen",
      description: "Stetig wachsendes Netzwerk",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Warum über 500 Makler und Bauträger
            <span className="block text-accent">mit uns arbeiten</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Vertrauen Sie auf Qualität, Zuverlässigkeit und professionellen Service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {badges.map((badge, index) => (
            <Card key={index} className="border-border/50 hover:border-accent/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <badge.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partner Logos Placeholder */}
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Vertraut von führenden Immobilienunternehmen
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            {["RE/MAX", "Engel & Völkers", "Century 21", "LBS"].map((name, index) => (
              <div key={index} className="text-2xl font-bold text-muted-foreground">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
