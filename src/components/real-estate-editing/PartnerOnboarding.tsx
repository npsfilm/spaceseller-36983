import { Upload, MessageSquare, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PartnerOnboarding = () => {
  const steps = [
    {
      icon: Upload,
      title: "Gratis-Test starten",
      description: "3 Bilder kostenlos hochladen",
    },
    {
      icon: MessageSquare,
      title: "Feedback erhalten",
      description: "Professionell bearbeitete Bilder in 48h",
    },
    {
      icon: Repeat,
      title: "Regelmäßige Aufträge",
      description: "Skaliere dein Business ohne Aufwand",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit, dein Editing auszulagern?
          </h2>
          <p className="text-xl text-muted-foreground">
            Teste uns kostenlos und wachse ohne Mehraufwand
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-center flex-1">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-accent">
                  <step.icon className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block text-accent text-3xl font-bold">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="text-lg px-12">
            Jetzt 3 Bilder kostenlos bearbeiten lassen
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Keine Kreditkarte erforderlich • Keine Verpflichtung
          </p>
        </div>
      </div>
    </section>
  );
};
