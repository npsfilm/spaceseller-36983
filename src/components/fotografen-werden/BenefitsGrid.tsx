import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const leftBenefits = [
  "24h Support durch das spaceseller Team",
  "Stetiger Auftragsfluss (Makler, Bauträger, Eigentümer)",
  "Kein Kundenkontakt, keine Rechnungsstellung",
  "Zugriff auf interne Ressourcen & Tutorials",
];

const rightBenefits = [
  "Kostenlose Nutzung unserer Editing-Plattform",
  "Regionale Exklusivität möglich",
  "Modernes Branding & Marketingmaterialien",
  "Faire Vergütung pro Auftrag",
];

export const BenefitsGrid = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Mehr Freiheit. Mehr Struktur. Mehr Umsatz.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Als spaceseller Partner erhältst du alle Vorteile eines professionellen Netzwerks – ohne die üblichen Nachteile von Selbstständigkeit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Support & Organisation
            </h3>
            <ul className="space-y-4">
              {leftBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Tools & Wachstum
            </h3>
            <ul className="space-y-4">
              {rightBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Highlight Box */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-8 text-center">
          <p className="text-lg text-foreground mb-6">
            <strong>Bonus:</strong> Partner mit mindestens 10 Aufträgen pro Monat erhalten Zugang zu exklusiven Workshops und Premium-Equipment-Rabatten.
          </p>
          <Button 
            size="xl" 
            variant="cta"
            onClick={scrollToForm}
          >
            Jetzt unverbindlich bewerben
          </Button>
        </div>
      </div>
    </section>
  );
};
