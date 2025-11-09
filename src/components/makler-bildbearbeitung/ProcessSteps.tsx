import { Upload, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProcessSteps = () => {
  const steps = [
    {
      icon: Upload,
      title: "Fotos hochladen",
      description: "RAW, JPG oder TIFF – alle gängigen Formate werden unterstützt",
      number: "01",
    },
    {
      icon: Edit,
      title: "Bearbeitungswünsche angeben",
      description: "Himmel austauschen, Farben optimieren, Objekte entfernen – Sie bestimmen",
      number: "02",
    },
    {
      icon: CheckCircle,
      title: "Fertige Bilder erhalten",
      description: "Nach 24-48h sind Ihre Bilder bereit für's Exposé",
      number: "03",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            In drei Schritten zu perfekten Immobilienbildern
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Einfacher war professionelle Bildbearbeitung noch nie
          </p>
        </div>

        <div className="relative">
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line - Hidden on mobile, shown on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-accent/30 z-0" />
                )}
                
                <div className="relative z-10 text-center space-y-4">
                  {/* Step Number */}
                  <div className="text-6xl font-bold text-accent/20 mb-2">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-card">
                    <step.icon className="w-10 h-10 text-accent" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2 px-4">
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="xl" variant="cta" className="min-h-[56px] text-lg" asChild>
              <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Jetzt starten</a>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Keine Anmeldung erforderlich • Bezahlung erst nach Zufriedenheit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
