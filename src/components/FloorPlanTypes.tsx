import { FileText, Box, Sofa } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import floorPlan2D from "@/assets/floor-plan-2d-professional.jpg";
import floorPlan3D from "@/assets/floor-plan-3d-isometric.jpg";
import floorPlanFurnished from "@/assets/floor-plan-furnished.jpg";

export const FloorPlanTypes = () => {
  const types = [
    {
      icon: FileText,
      title: "2D Grundrisse",
      description: "Maßstabsgetreue 2D-Grundrisse mit allen Maßen",
      image: floorPlan2D,
      features: [
        "Professionelle CAD-Zeichnung",
        "Alle Raummaße eingetragen",
        "Wandstärken berücksichtigt",
        "Türen & Fenster korrekt dargestellt",
        "Wohnfläche berechnet",
      ],
      price: "ab 45€",
      priceDetail: "pro Geschoss",
    },
    {
      icon: Box,
      title: "3D Grundrisse",
      description: "Perspektivische 3D-Ansichten für besseres Raumverständnis",
      image: floorPlan3D,
      features: [
        "Fotorealistische 3D-Darstellung",
        "Isometrische Ansicht",
        "Mehrere Perspektiven möglich",
        "Höhenunterschiede sichtbar",
        "Inkl. 2D-Grundriss",
      ],
      price: "ab 75€",
      priceDetail: "pro Geschoss",
      popular: true,
    },
    {
      icon: Sofa,
      title: "Möblierte Grundrisse",
      description: "Grundrisse mit professioneller Möblierung",
      image: floorPlanFurnished,
      features: [
        "Realistische Möbelplatzierung",
        "Verschiedene Einrichtungsstile",
        "Zeigt Raumnutzungsmöglichkeiten",
        "Ideal für Vermarktung",
        "2D oder 3D möglich",
      ],
      price: "ab 65€",
      priceDetail: "pro Geschoss",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unsere Grundriss-Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von klassischen 2D-Plänen bis zu fotorealistischen 3D-Visualisierungen – wählen Sie das passende Format für Ihre Immobilie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {types.map((type, index) => (
            <Card key={index} className={`relative overflow-hidden transition-all hover:shadow-xl ${type.popular ? 'border-accent border-2' : ''}`}>
              {type.popular && (
                <Badge className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground">
                  Beliebt
                </Badge>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <ul className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{type.price}</span>
                    <span className="text-sm text-muted-foreground">{type.priceDetail}</span>
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
