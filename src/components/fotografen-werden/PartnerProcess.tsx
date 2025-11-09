import { Button } from "@/components/ui/button";
import { FileCheck, Camera, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: FileCheck,
    title: "Bewerben",
    description: "Reiche dein Portfolio ein und erzähle uns von deiner Erfahrung.",
    detail: "Wir prüfen deine Bewerbung innerhalb von 48 Stunden.",
    time: "2 Minuten",
  },
  {
    icon: Camera,
    title: "Testshooting absolvieren",
    description: "Fotografiere einen Testauftrag nach unseren Guidelines.",
    detail: "Du erhältst detailliertes Feedback von unserem Team.",
    time: "1-2 Stunden",
  },
  {
    icon: TrendingUp,
    title: "Aufträge erhalten",
    description: "Starte als offizieller Partner und erhalte regelmäßige Aufträge.",
    detail: "Flexible Planung über unser Buchungssystem.",
    time: "Unbegrenzt",
  },
];

export const PartnerProcess = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            In drei Schritten zum offiziellen spaceseller Partner.
          </h2>
          <p className="text-xl text-muted-foreground">
            Ein einfacher, transparenter Prozess – von der Bewerbung bis zum ersten bezahlten Auftrag.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-border -z-10">
            <div className="h-full bg-gradient-to-r from-accent via-accent to-border" style={{ width: '66%' }}></div>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>

              <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-accent" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {step.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm text-foreground font-medium">
                    {step.detail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ⏱️ Dauer: {step.time}
                  </p>
                </div>

                {index === 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-6"
                    onClick={scrollToForm}
                  >
                    Bewerbung starten
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ⚡ Express-Option verfügbar: Nach bestandenem Testshooting kannst du sofort starten.
          </p>
        </div>
      </div>
    </section>
  );
};
