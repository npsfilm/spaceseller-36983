import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const MunichPhotographyPricing = () => {
  const packages = [
    {
      name: "Basis-Paket",
      price: "149€",
      popular: false,
      features: [
        "Bis zu 15 Innenaufnahmen ODER",
        "Bis zu 10 Außenaufnahmen",
        "Professionelle Bildbearbeitung",
        "HDR-Fotografie",
        "Perspektivkorrektur",
        "24h Lieferung",
        "Hochauflösende Dateien",
        "Keine Anfahrtskosten in München",
      ],
    },
    {
      name: "Standard-Paket",
      price: "249€",
      popular: true,
      savings: "Spare 50€",
      features: [
        "Bis zu 15 Innenaufnahmen UND",
        "Bis zu 10 Außenaufnahmen",
        "Alle Basis-Features",
        "Himmelsaustausch",
        "Objektentfernung",
        "Rasenbearbeitung",
        "Virtuelle Möblierung 1 Raum (+35€)",
        "Beste Wahl für Apartments",
      ],
    },
    {
      name: "Premium-Paket",
      price: "399€",
      popular: false,
      savings: "Spare 150€",
      badge: "Beste Value",
      features: [
        "Bis zu 20 Innenaufnahmen",
        "Bis zu 15 Außenaufnahmen",
        "Drohnenaufnahmen (bis 10 Fotos)",
        "Alle Standard-Features",
        "2D-Grundriss inklusive",
        "Priority-Bearbeitung",
        "Persönlicher Ansprechpartner",
        "Perfekt für Einfamilienhäuser",
      ],
    },
    {
      name: "Komplett-Paket",
      price: "599€",
      popular: false,
      badge: "Luxus",
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
    },
  ];

  const addOns = [
    { name: "Drohnenaufnahmen einzeln", price: "+199€" },
    { name: "Twilight/Dämmerung", price: "+149€" },
    { name: "Virtual Staging pro Raum", price: "+35€" },
    { name: "360° Virtual Tour", price: "+299€" },
    { name: "Express (12h)", price: "+100€" },
    { name: "Wochenend-Zuschlag", price: "+50€" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Transparente Preise</h2>
          <p className="text-xl text-muted-foreground">
            Professionelle Immobilienfotografie zu fairen Preisen in München
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative ${pkg.popular ? 'border-accent border-2 shadow-xl' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold">
                  Beliebteste Wahl
                </div>
              )}
              {pkg.badge && !pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                  {pkg.badge}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-accent">{pkg.price}</span>
                  {pkg.savings && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                      {pkg.savings}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6" 
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => {
                    const bookingSection = document.getElementById('booking');
                    bookingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Jetzt buchen
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Zusätzliche Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {addOns.map((addon, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{addon.name}</span>
                    <span className="text-accent font-bold">{addon.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 text-center">
                💼 Mengenrabatte für Makler ab 5 Objekten/Monat verfügbar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
