import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export const FloorPlanPricing = () => {
  const pricingPlans = [
    {
      title: "2D Grundriss",
      price: "45€",
      unit: "pro Geschoss",
      features: [
        "Maßstabsgetreu",
        "Mit allen Maßen",
        "PDF + PNG Format",
        "48h Lieferung",
        "Unlimited Revisionen",
        "Wohnfläche berechnet",
      ],
    },
    {
      title: "3D Grundriss",
      price: "75€",
      unit: "pro Geschoss",
      popular: true,
      features: [
        "Isometrische Ansicht",
        "Inkl. 2D-Grundriss",
        "PDF + PNG Format",
        "48h Lieferung",
        "Unlimited Revisionen",
        "Mehrere Perspektiven",
      ],
    },
    {
      title: "Möbliert",
      price: "65€",
      unit: "pro Geschoss",
      features: [
        "2D oder 3D möglich",
        "Verschiedene Stile",
        "Realistische Möbel",
        "PDF + PNG Format",
        "48h Lieferung",
        "Unlimited Revisionen",
      ],
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transparente Preise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Faire Preise ohne versteckte Kosten – Sie zahlen nur für das, was Sie brauchen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-accent border-2 shadow-xl' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Beliebteste Wahl
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <CardDescription className="text-sm">{plan.unit}</CardDescription>
                <div className="flex items-baseline gap-2 pt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  variant={plan.popular ? "cta" : "outline"} 
                  className="w-full"
                >
                  <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Jetzt beauftragen</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-8 space-y-4">
          <h3 className="text-xl font-semibold text-center mb-4">Zusätzliche Informationen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>Mehrere Ebenen? 2. Ebene nur <strong>+30€</strong>, 3. Ebene <strong>+25€</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>Express-Lieferung in 24h: <strong>+50% Aufpreis</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>Große Objekte (&gt;200m²)? Fragen Sie nach <strong>individuellen Paketpreisen</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>Alle Formate: <strong>PDF, PNG, JPG, DWG</strong> verfügbar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
