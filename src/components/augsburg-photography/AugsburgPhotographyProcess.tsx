import { Calendar, Clipboard, Camera, Edit, Download } from "lucide-react";

export const AugsburgPhotographyProcess = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Termin vereinbaren",
      description: "Online-Buchung oder Anruf",
      detail: "Flexible Terminplanung auch am Wochenende",
    },
    {
      icon: Clipboard,
      title: "Vorbereitung",
      description: "Wir beraten Sie zur Vorbereitung der Immobilie",
      detail: "Checkliste: Aufräumen, Licht, Inszenierung",
    },
    {
      icon: Camera,
      title: "Fotoshooting vor Ort",
      description: "1-2 Stunden vor Ort in Augsburg",
      detail: "Professionelle Ausrüstung & Erfahrung",
    },
    {
      icon: Edit,
      title: "Professionelle Bearbeitung",
      description: "HDR-Bearbeitung, Farbkorrektur, Perspektivkorrektur",
      detail: "Objektentfernung, Himmelsaustausch",
    },
    {
      icon: Download,
      title: "Lieferung in 24h",
      description: "Hochauflösende Dateien per Download-Link",
      detail: "Sofort verwendbar für Exposés & Online-Portale",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            So einfach funktioniert's
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von der Buchung bis zur Lieferung – transparent und unkompliziert
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-4 border-4 border-background shadow-lg">
                    <step.icon className="w-10 h-10 text-accent" />
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm z-20">
                    {index + 1}
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
