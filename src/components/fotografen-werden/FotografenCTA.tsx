import { Button } from "@/components/ui/button";
import { TrustBadges } from "@/components/TrustBadges";
import { Shield, Clock, Users, Euro } from "lucide-react";

const trustBadges = [
  {
    icon: Clock,
    text: "48h Lieferung garantiert",
  },
  {
    icon: Users,
    text: "100+ Partner im Aufbau",
  },
  {
    icon: Shield,
    text: "DSGVO-konforme Prozesse",
  },
  {
    icon: Euro,
    text: "Faire Bezahlung & transparente Kommunikation",
  },
];

export const FotografenCTA = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="application-form" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Starte jetzt deine Partnerschaft mit spaceseller.
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Weniger Organisation. Mehr kreative Freiheit. Gemeinsam heben wir Immobilienfotografie auf das nächste Level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="xl" 
              variant="cta"
              onClick={scrollToForm}
              className="text-lg"
            >
              Jetzt Partner werden
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              className="text-lg"
            >
              Unverbindlich informieren
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h3 className="text-center text-lg font-semibold text-foreground mb-6">
            Darauf kannst du dich verlassen:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-foreground">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form Placeholder */}
        <div className="bg-card border border-border rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Bewerbungsformular
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Das Bewerbungsformular wird in Kürze hier integriert. Für erste Anfragen kannst du uns direkt kontaktieren.
          </p>
          
          {/* Temporary Contact Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              variant="cta"
              onClick={() => window.location.href = 'mailto:partner@spaceseller.de?subject=Bewerbung als Partner-Fotograf'}
            >
              Per E-Mail bewerben
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              partner@spaceseller.de
            </p>
          </div>
        </div>

        {/* Final Trust Element */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ✓ Keine versteckten Kosten · ✓ Jederzeit kündbar · ✓ Unverbindliche Bewerbung
          </p>
          <TrustBadges />
        </div>
      </div>
    </section>
  );
};
