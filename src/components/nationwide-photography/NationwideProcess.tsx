import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Camera, CheckCircle2 } from "lucide-react";

export const NationwideProcess = () => {
  const steps = [
    {
      number: "01",
      icon: Send,
      title: "Anfrage senden",
      description: "Teilen Sie uns Details zu Ihrer Immobilie und Ihrem Wunschtermin mit. Wir finden den passenden Fotografen in Ihrer Region.",
    },
    {
      number: "02",
      icon: Camera,
      title: "Fotograf kommt vorbei",
      description: "Unser geprüfter Fotograf kommt zum vereinbarten Termin. Professionelles Equipment und Erfahrung garantiert.",
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: "Bearbeitung & Lieferung",
      description: "Innerhalb von 48 Stunden erhalten Sie die professionell bearbeiteten Bilder zum Download – fertig für Ihr Exposé.",
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
            So einfach geht's:
            <span className="block text-accent">In 3 Schritten zu perfekten Bildern</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Von der Anfrage bis zur Lieferung – transparent und unkompliziert
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-accent opacity-20" 
                 style={{ left: '16.67%', right: '16.67%' }} />
            
            {steps.map((step, index) => (
              <Card key={index} className="relative border-border/50 hover:border-accent/50 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button size="xl" variant="cta" onClick={handleCTA}>
            Jetzt Termin vereinbaren
          </Button>
        </div>
      </div>
    </section>
  );
};
