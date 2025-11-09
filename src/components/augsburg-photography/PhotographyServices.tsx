import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Building, Plane, Moon, Orbit, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PhotographyServices = () => {
  const services = [
    {
      icon: Home,
      title: "Innenaufnahmen",
      subtitle: "Interior Photography",
      description: "Professionelle Innenraumfotografie mit perfekter Belichtung",
      details: "HDR-Fotografie, Weitwinkel, perfekte Perspektiven",
      included: "Professionelle Bildbearbeitung inklusive",
      price: "ab 149€",
      priceDetail: "bis 15 Aufnahmen",
    },
    {
      icon: Building,
      title: "Außenaufnahmen",
      subtitle: "Exterior Photography",
      description: "Fassaden, Gärten und Außenbereiche optimal in Szene gesetzt",
      details: "Optimale Tageszeit, beste Lichtverhältnisse",
      included: "Himmelsaustausch & Objektentfernung inklusive",
      price: "ab 99€",
      priceDetail: "bis 10 Aufnahmen",
    },
    {
      icon: Plane,
      title: "Drohnenaufnahmen",
      subtitle: "Aerial Photography",
      description: "Beeindruckende Luftaufnahmen für Ihre Immobilie",
      details: "4K-Drohne, lizenzierter Pilot, alle Genehmigungen",
      included: "Video-Clips optional",
      price: "ab 199€",
      priceDetail: "bis 10 Luftaufnahmen",
    },
    {
      icon: Moon,
      title: "Dämmerungsaufnahmen",
      subtitle: "Twilight Photography",
      description: "Stimmungsvolle Aufnahmen zur blauen Stunde",
      details: "Premium-Look, emotionale Wirkung",
      included: "Innenbeleuchtung perfekt eingefangen",
      price: "ab 149€",
      priceDetail: "bis 5 Aufnahmen",
    },
    {
      icon: Orbit,
      title: "Virtuelle Rundgänge",
      subtitle: "Virtual Tours",
      description: "360° virtuelle Besichtigungen für Online-Präsentation",
      details: "Matterport oder ähnliche Technologie",
      included: "Interaktive Grundrisse",
      price: "ab 299€",
      priceDetail: "bis 100m²",
    },
    {
      icon: Package,
      title: "Komplett-Paket",
      subtitle: "Complete Package",
      description: "Alles in einem: Innen, Außen, Drohne, Grundriss",
      details: "Perfekt für größere Objekte",
      included: "20-30 Aufnahmen, professionell bearbeitet",
      price: "ab 399€",
      priceDetail: "Spare 20%",
      popular: true,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unsere Fotografie-Leistungen
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von Innenaufnahmen bis Drohnenfotos – alles für perfekte Immobilienpräsentation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative hover:shadow-lg transition-all ${
                service.popular ? "border-accent border-2" : ""
              }`}
            >
              {service.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                  Beliebteste Wahl
                </Badge>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wide">
                  {service.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">{service.description}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium">✓ {service.details}</p>
                  <p className="font-medium">✓ {service.included}</p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-accent">
                      {service.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {service.priceDetail}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
