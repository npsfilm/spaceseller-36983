import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const RealEstatePhotographerPricing = () => {
  const tiers = [
    {
      name: "Einzelauftrag",
      price: "10€",
      priceDetail: "pro Bild",
      description: "Keine Mindestabnahme",
      features: [
        "Alle Standard-Bearbeitungen",
        "48h Lieferung",
        "1 Revisionsrunde",
        "White-Label",
        "Rechnung mit MwSt.",
      ],
      cta: "Testbearbeitung anfordern",
      popular: false,
    },
    {
      name: "Starter",
      price: "8€",
      priceDetail: "pro Bild",
      description: "50 Bilder/Monat",
      discount: "Spare 20%",
      features: [
        "Alle Standard-Bearbeitungen",
        "48h Lieferung",
        "2 Revisionsrunden",
        "White-Label",
        "Rechnung mit MwSt.",
        "Email Support",
      ],
      cta: "Jetzt starten",
      popular: false,
    },
    {
      name: "Professional",
      price: "6€",
      priceDetail: "pro Bild",
      description: "200 Bilder/Monat",
      discount: "Spare 40%",
      features: [
        "Alle Standard-Bearbeitungen",
        "24h Express-Lieferung Standard",
        "Unlimited Revisionen",
        "Priority Support",
        "Dedicated Account Manager",
        "FTP-Zugang",
        "Rechnung mit MwSt.",
      ],
      cta: "Professional wählen",
      popular: true,
    },
    {
      name: "Agentur",
      price: "5€",
      priceDetail: "pro Bild",
      description: "500+ Bilder/Monat",
      discount: "Spare 50%",
      features: [
        "Alle Professional Features",
        "12h Rush-Lieferung",
        "API-Integration",
        "Persönlicher Ansprechpartner",
        "Quarterly Reviews",
        "Rechnung mit MwSt.",
      ],
      cta: "Agentur-Paket anfragen",
      popular: false,
    },
  ];

  const addons = [
    { name: "Sky Replacement", price: "+3€ pro Bild" },
    { name: "Objektentfernung", price: "5€ pro Bild" },
    { name: "Rasen/Vegetation", price: "8€ pro Bild" },
    { name: "HDR/Exposure Blending", price: "+2€ pro Bild" },
    { name: "Day-to-Dusk", price: "+10€ pro Bild" },
    { name: "Virtual Staging", price: "+25€ pro Raum" },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transparente Mengenpreise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Je mehr Sie bearbeiten lassen, desto günstiger wird es
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative ${
                tier.popular ? "border-accent border-2 shadow-lg scale-105" : ""
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                  Beliebteste Wahl
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-accent">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {tier.priceDetail}
                  </span>
                </div>
                {tier.discount && (
                  <Badge variant="secondary" className="mt-2 w-fit">
                    {tier.discount}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-background rounded-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Service Add-Ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <span className="font-medium">{addon.name}</span>
                <span className="text-accent font-semibold">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Alle Preise zzgl. MwSt.</p>
          <p className="mt-2">
            Sie erhalten ordnungsgemäße Rechnungen mit ausgewiesener Mehrwertsteuer
          </p>
        </div>
      </div>
    </section>
  );
};
