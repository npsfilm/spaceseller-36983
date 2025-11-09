import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, Euro, Calendar, Briefcase } from "lucide-react";

const uspCards = [
  {
    icon: Target,
    title: "Garantierte Aufträge",
    description: "Erhalte regelmäßige Immobilienaufträge in deiner Region von Maklern, Bauträgern und Eigentümern.",
  },
  {
    icon: Sparkles,
    title: "Keine Nachbearbeitung",
    description: "Unser professionelles Editing-Team übernimmt die komplette Bildbearbeitung für dich.",
  },
  {
    icon: Euro,
    title: "Faire Bezahlung",
    description: "Transparente Vergütung pro Auftrag. Pünktliche Auszahlung ohne versteckte Kosten.",
  },
  {
    icon: Calendar,
    title: "Volle Flexibilität",
    description: "Du entscheidest, wann und wie viel du arbeitest. Perfekt als Haupt- oder Nebenerwerb.",
  },
  {
    icon: Briefcase,
    title: "Professionelles Branding",
    description: "Profitiere von unserem etablierten Namen und Marketing. Du konzentrierst dich aufs Fotografieren.",
  },
];

export const WarumSpaceseller = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Wir bringen dich mit Auftraggebern zusammen – du fokussierst dich auf das, was du liebst: Fotografieren.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Als spaceseller Partner-Fotograf profitierst du von unserem Netzwerk, unserer Technologie und unserem Support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {uspCards.map((card, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {card.title}
              </h3>
              <p className="text-muted-foreground">
                {card.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="xl" 
            variant="cta"
            onClick={scrollToForm}
          >
            Jetzt Partner werden
          </Button>
        </div>
      </div>
    </section>
  );
};
