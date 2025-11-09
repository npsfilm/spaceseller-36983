import { Card, CardContent } from "@/components/ui/card";
import { Home, Building, Plane, Moon, Circle, Package } from "lucide-react";

export const MunichPhotographyServices = () => {
  const services = [
    {
      icon: Home,
      title: "Helle HDR-Immobilienfotos",
      description: "Räume, die online mehr Klicks erzeugen",
      details: "30% hellere Räume durch HDR-Technik • Weitwinkel für größere Wirkung",
      included: "Professionelle Bildbearbeitung inklusive",
      price: "ab 149€",
      priceDetail: "bis 15 Aufnahmen",
    },
    {
      icon: Plane,
      title: "Filmische 4K-Drohnenaufnahmen",
      description: "Luftaufnahmen, die Ihr Objekt von der Konkurrenz abheben",
      details: "Lizenzierter Pilot • Alle München-Genehmigungen • Cinematic Look",
      included: "Video-Clips optional verfügbar",
      price: "ab 199€",
      priceDetail: "bis 10 Luftaufnahmen",
    },
    {
      icon: Circle,
      title: "Matterport 3D-Rundgänge",
      description: "48% mehr Online-Anfragen mit virtuellen Besichtigungen",
      details: "Interaktive 360° Touren • Grundriss-Ansicht • Messungen",
      included: "Interaktive Grundrisse inklusive",
      price: "ab 299€",
      priceDetail: "bis 100m²",
    },
    {
      icon: Building,
      title: "Virtuelles Staging",
      description: "Leere Räume digital möblieren – für schnelleren Verkauf",
      details: "Photorealistisch • Mehrere Stiloptionen • 24h Lieferung",
      included: "Unbegrenzte Revisionen",
      price: "ab 35€",
      priceDetail: "pro Raum",
    },
    {
      icon: Moon,
      title: "Professionelle Grundrisse",
      description: "2D & 3D Grundrisse für vollständige Exposés",
      details: "Maßstabsgetreu • Möbliert oder leer • CAD-Qualität",
      included: "Alle Formate (PDF, JPG, DWG)",
      price: "ab 99€",
      priceDetail: "2D Grundriss",
    },
    {
      icon: Package,
      title: "Komplett-Paket",
      description: "Alles in einem: Innen, Außen, Drohne, Grundriss",
      details: "Perfekt für größere Objekte",
      included: "20-30 Aufnahmen, professionell bearbeitet",
      price: "ab 399€",
      priceDetail: "Spare 20%",
      popular: true,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ihr kompletter Immobilien-Medien-Partner</h2>
          <p className="text-xl text-muted-foreground">
            Alles aus einer Hand: Von der Fotografie bis zur fertigen Vermarktung
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                service.popular ? 'border-accent border-2' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Beliebteste Wahl
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <service.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{service.details}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ✓ {service.included}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-bold text-accent">{service.price}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{service.priceDetail}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Alle Preise inkl. professioneller Bildbearbeitung und 24h Lieferung
          </p>
        </div>
      </div>
    </section>
  );
};
