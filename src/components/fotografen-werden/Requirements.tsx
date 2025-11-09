import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

const requiredSkills = [
  "Erfahrung in Immobilien- oder Architekturfotografie",
  "Eigene Kameraausrüstung (Vollformat empfohlen)",
  "Zuverlässigkeit & Qualitätsbewusstsein",
  "Lust auf langfristige Zusammenarbeit",
];

const optionalSkills = [
  "Drohnenlizenz (A1/A3 oder A2)",
  "Erfahrung in Interieurfotografie",
  "Professionelles Weitwinkelobjektiv",
  "Erfahrung mit Bildbearbeitungssoftware",
];

export const Requirements = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Was du mitbringen solltest.
          </h2>
          <p className="text-xl text-muted-foreground">
            Keine Sorge – wenn du eine dieser Anforderungen noch nicht erfüllst, unterstützen wir dich gerne beim Einstieg.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Required Skills */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              Erforderlich
            </h3>
            <ul className="space-y-4">
              {requiredSkills.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Optional Skills */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
              Von Vorteil
            </h3>
            <ul className="space-y-4">
              {optionalSkills.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Encouragement Box */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-8 text-center">
          <p className="text-lg text-foreground mb-6">
            <strong>Noch unsicher?</strong> Wir bieten Onboarding-Workshops und Equipment-Beratung für neue Partner an. Du wirst nicht allein gelassen!
          </p>
          <Button 
            size="xl" 
            variant="cta"
            onClick={scrollToForm}
          >
            Bewerbung starten
          </Button>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Fragen zu den Anforderungen?
          </p>
          <Button variant="link" className="text-accent">
            Häufig gestellte Fragen ansehen →
          </Button>
        </div>
      </div>
    </section>
  );
};
