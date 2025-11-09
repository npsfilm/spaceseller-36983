import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const NationwidePricing = () => {
  const packages = [
    {
      name: "Basic",
      images: "6 Bilder",
      price: "239€",
      features: [
        "6 professionell bearbeitete Bilder",
        "Innen- und Außenaufnahmen",
        "48h Lieferung",
        "Reisekosten inklusive",
      ],
    },
    {
      name: "Standard",
      images: "8 Bilder",
      price: "299€",
      popular: true,
      features: [
        "8 professionell bearbeitete Bilder",
        "Innen- und Außenaufnahmen",
        "48h Lieferung",
        "Reisekosten inklusive",
        "Prioritäts-Support",
      ],
    },
    {
      name: "Premium",
      images: "10 Bilder",
      price: "369€",
      features: [
        "10 professionell bearbeitete Bilder",
        "Innen- und Außenaufnahmen",
        "Drohnenaufnahme optional (+50€)",
        "24h Express-Lieferung",
        "Reisekosten inklusive",
        "Dedizierter Support",
      ],
    },
    {
      name: "Plus",
      images: "15 Bilder",
      price: "449€",
      features: [
        "15 professionell bearbeitete Bilder",
        "Komplette Objektdokumentation",
        "1 Drohnenaufnahme inklusive",
        "24h Express-Lieferung",
        "Reisekosten inklusive",
        "Persönlicher Ansprechpartner",
      ],
    },
  ];

  const handleCTA = () => {
    window.open('https://app.spaceseller.de', '_blank');
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transparente Preise
            <span className="block text-accent">ohne versteckte Kosten</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Reisekosten deutschlandweit inklusive – Sie zahlen nur für die Bilder
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative border-border/50 hover:border-accent/50 transition-all duration-300 ${
                pkg.popular ? "border-accent ring-2 ring-accent/20 scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Beliebteste Wahl
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                <CardDescription className="text-sm">{pkg.images}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{pkg.price}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={pkg.popular ? "cta" : "outline"}
                  onClick={handleCTA}
                >
                  Paket wählen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Mengenrabatt für Makler</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Ab 5 Objekten im Monat erhalten Sie attraktive Rabatte. 
                Kontaktieren Sie uns für ein individuelles Angebot.
              </p>
              <Button size="lg" variant="cta" onClick={handleCTA}>
                Individuelle Konditionen anfragen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
