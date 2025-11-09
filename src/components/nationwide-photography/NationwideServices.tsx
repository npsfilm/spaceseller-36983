import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Building, Plane, Sunset, Wand2 } from "lucide-react";

export const NationwideServices = () => {
  const services = [
    {
      icon: Home,
      title: "Innenaufnahmen",
      description: "Professionelle Aufnahmen aller Räume mit optimaler Beleuchtung und Perspektive",
    },
    {
      icon: Building,
      title: "Außenaufnahmen",
      description: "Fassaden, Eingangsbereiche und Außenanlagen perfekt in Szene gesetzt",
    },
    {
      icon: Plane,
      title: "Drohnenfotografie",
      description: "Beeindruckende Luftaufnahmen für Grundstücke und Gebäudekomplexe",
    },
    {
      icon: Sunset,
      title: "Dämmerungsaufnahmen",
      description: "Stimmungsvolle Aufnahmen zur besten Tageszeit für maximale Wirkung",
    },
    {
      icon: Wand2,
      title: "Professionelle Nachbearbeitung",
      description: "Farbkorrektur, HDR-Bearbeitung, Himmel-Austausch und Objekt-Retusche",
    },
  ];

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Umfassende Services für
            <span className="block text-accent">perfekte Immobilienpräsentation</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Von der Aufnahme bis zur fertigen Bildbearbeitung – alles aus einer Hand
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="xl" variant="outline" onClick={scrollToGallery}>
            Beispiele ansehen
          </Button>
        </div>
      </div>
    </section>
  );
};
