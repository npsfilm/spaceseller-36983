import { Clock, Award, DollarSign, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhyWhiteLabel = () => {
  const usps = [
    {
      icon: Clock,
      title: "48h Standardlieferung / 24h Express",
      description: "Professionell & planbar. Verlässliche Lieferzeiten für dein Business.",
    },
    {
      icon: Award,
      title: "Kein Branding",
      description: "Deine Kunden sehen nur dich. 100% White-Label, keine Wasserzeichen.",
    },
    {
      icon: DollarSign,
      title: "Faire Preise",
      description: "Ab 6 € pro Bild bei Mengenabnahme. Transparent und skalierbar.",
    },
    {
      icon: Shield,
      title: "Deutsche Qualitätsstandards",
      description: "DSGVO-konform, MwSt.-Rechnung, Nachbearbeitung inklusive.",
    },
    {
      icon: TrendingUp,
      title: "Skalierbarkeit ohne Personal",
      description: "Wachse, ohne neue Mitarbeiter einzustellen. Keine Personalkosten.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Wir bearbeiten. Du lieferst. 100 % unter deinem Namen.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="p-6 border border-border rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <usp.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{usp.title}</h3>
              <p className="text-muted-foreground">{usp.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="text-lg px-8">
            Jetzt Testbearbeitung starten
          </Button>
        </div>
      </div>
    </section>
  );
};
