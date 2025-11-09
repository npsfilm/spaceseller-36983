import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PricingTable = () => {
  const pricingTiers = [
    {
      name: "Basis-Retusche",
      price: "8",
      popular: false,
      features: [
        "Farb- & Kontrastkorrektur",
        "Belichtungsoptimierung",
        "Schärfung & Rauschreduzierung",
        "Himmelsaustausch",
        "48h Lieferung",
      ],
    },
    {
      name: "Premium-Retusche",
      price: "12",
      popular: true,
      features: [
        "Alle Basis-Features",
        "Objektentfernung",
        "Rasenoptimierung",
        "Perspektivkorrektur",
        "24h Express-Option",
      ],
    },
    {
      name: "Luxus-Retusche",
      price: "15",
      popular: false,
      features: [
        "Alle Premium-Features",
        "Fensteransicht bearbeiten",
        "Dunstentfernung",
        "Individuelle Anpassungen",
        "12h Super-Express",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Faire Preise. Klare Ergebnisse.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Wählen Sie das Paket, das zu Ihren Anforderungen passt
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`p-6 md:p-8 relative ${
                tier.popular 
                  ? "border-accent shadow-elegant scale-105 md:scale-110" 
                  : ""
              }`}
            >
              {tier.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Beliebteste
                </Badge>
              )}
              
              <div className="text-center space-y-4 mb-6">
                <h3 className="text-xl md:text-2xl font-bold">{tier.name}</h3>
                <div className="space-y-1">
                  <div className="text-4xl md:text-5xl font-bold text-primary">
                    {tier.price}€
                  </div>
                  <p className="text-sm text-muted-foreground">pro Bild</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={tier.popular ? "cta" : "outline"}
                className="w-full min-h-[48px]"
                asChild
              >
                <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Paket wählen</a>
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            <strong>Großaufträge?</strong> Ab 50 Bildern erhalten Sie automatisch Mengenrabatte
          </p>
          <Button size="lg" variant="outline" asChild>
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Bilder hochladen & Preis berechnen</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
