import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AugsburgPhotographyPricing = () => {
  const packages = [
    {
      name: "Basis-Paket",
      price: "149€",
      description: "Perfekt für kleinere Objekte",
      features: [
        "Bis zu 15 Innenaufnahmen ODER",
        "Bis zu 10 Außenaufnahmen",
        "Professionelle Bildbearbeitung",
        "HDR-Fotografie",
        "Perspektivkorrektur",
        "24h Lieferung",
        "Hochauflösende Dateien",
        "Keine Anfahrtskosten in Augsburg",
      ],
      cta: "Basis-Paket buchen",
      popular: false,
    },
    {
      name: "Standard-Paket",
      price: "249€",
      description: "Beliebteste Wahl",
      features: [
        "Bis zu 15 Innenaufnahmen UND",
        "Bis zu 10 Außenaufnahmen",
        "Alle Basis-Features",
        "Himmelsaustausch",
        "Objektentfernung",
        "Rasenbearbeitung",
        "Virtuelle Möblierung 1 Raum (+35€)",
        "Spare 50€ gegenüber Einzelbuchung",
      ],
      cta: "Standard-Paket wählen",
      popular: true,
      savings: "Spare 50€",
    },
    {
      name: "Premium-Paket",
      price: "399€",
      description: "Beste Value für Einfamilienhäuser",
      features: [
        "Bis zu 20 Innenaufnahmen",
        "Bis zu 15 Außenaufnahmen",
        "Drohnenaufnahmen (bis 10 Fotos)",
        "Alle Standard-Features",
        "2D-Grundriss inklusive",
        "Priority-Bearbeitung",
        "Persönlicher Ansprechpartner",
        "Spare 150€ – Beste Wahl",
      ],
      cta: "Premium-Paket buchen",
      popular: false,
      savings: "Spare 150€",
    },
    {
      name: "Komplett-Paket",
      price: "599€",
      description: "Für Luxusimmobilien",
      features: [
        "Unbegrenzte Aufnahmen (ca. 30-40)",
        "Innen + Außen + Drohne",
        "Dämmerungsaufnahmen (Twilight)",
        "360° Virtueller Rundgang",
        "2D + 3D Grundriss",
        "Alle Premium-Features",
        "Gleicher Tag Express möglich",
        "Perfekt für Luxusimmobilien",
      ],
      cta: "Komplett-Paket anfragen",
      popular: false,
    },
  ];

  const addons = [
    { name: "Drohnenaufnahmen einzeln", price: "+199€" },
    { name: "Twilight/Dämmerung", price: "+149€" },
    { name: "Virtual Staging pro Raum", price: "+35€" },
    { name: "360° Virtual Tour", price: "+299€" },
    { name: "Express (12h)", price: "+100€" },
    { name: "Wochenend-Zuschlag", price: "+50€" },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transparente Paketpreise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professionelle Immobilienfotografie mit Komplettservice – 
            Fotografie + Bearbeitung inklusive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`relative ${
                pkg.popular ? "border-accent border-2 shadow-lg scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                  Beliebteste Wahl
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-accent">
                    {pkg.price}
                  </span>
                </div>
                {pkg.savings && (
                  <Badge variant="secondary" className="mt-2 w-fit">
                    {pkg.savings}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
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
                  variant={pkg.popular ? "default" : "outline"}
                >
                  {pkg.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-background rounded-lg p-8 mb-8 border border-border">
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
          <p className="font-semibold">Mengenrabatte für Makler</p>
          <p className="mt-2">
            Ab 5 Objekten/Monat bieten wir 15% Rabatt. Kontaktieren Sie uns für individuelle Angebote.
          </p>
        </div>
      </div>
    </section>
  );
};
