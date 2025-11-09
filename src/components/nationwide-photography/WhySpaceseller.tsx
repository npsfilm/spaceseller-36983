import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, ImageIcon, Euro, Shield } from "lucide-react";

export const WhySpaceseller = () => {
  const usps = [
    {
      icon: MapPin,
      title: "Bundesweit vor Ort",
      description: "Über 500 geprüfte Fotografen in allen deutschen Städten und Regionen",
    },
    {
      icon: Clock,
      title: "48h Lieferung garantiert",
      description: "Bearbeitete Bilder innerhalb von 48 Stunden nach dem Shooting",
    },
    {
      icon: ImageIcon,
      title: "Inklusive Bearbeitung",
      description: "Professionelle Nachbearbeitung, Farbkorrektur und Optimierung inklusive",
    },
    {
      icon: Euro,
      title: "Faire Paketpreise",
      description: "Transparente Preise ohne versteckte Kosten. Mengenrabatte verfügbar",
    },
    {
      icon: Shield,
      title: "Zentrale Qualitätssicherung",
      description: "Einheitliche Standards durch unser Qualitätssicherungsteam",
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
            Ein Ansprechpartner. Einheitliche Qualität.
            <span className="block text-accent">Deutschlandweit verfügbar.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Spaceseller koordiniert für Sie ein bundesweites Netzwerk geprüfter Immobilienfotografen – 
            zentral organisiert, lokal umgesetzt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {usps.map((usp, index) => (
            <Card key={index} className="border-border/50 hover:border-accent/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <usp.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{usp.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{usp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="xl" variant="cta" onClick={handleCTA}>
            Jetzt regionalen Fotografen buchen
          </Button>
        </div>
      </div>
    </section>
  );
};
