import { Upload, CheckSquare, PenTool, Download } from "lucide-react";

export const FloorPlanProcess = () => {
  const steps = [
    {
      icon: Upload,
      title: "Unterlagen hochladen",
      description: "Laden Sie Ihre Skizze, Bauplan oder Fotos hoch",
      detail: "Auch einfache Handskizzen sind ausreichend",
    },
    {
      icon: CheckSquare,
      title: "Anforderungen angeben",
      description: "Wählen Sie: 2D, 3D, möbliert oder unmöbliert",
      detail: "Geben Sie besondere Wünsche an",
    },
    {
      icon: PenTool,
      title: "Wir erstellen professionell",
      description: "Unser Architektur-Team erstellt Ihre Grundrisse",
      detail: "CAD-Software für höchste Präzision",
    },
    {
      icon: Download,
      title: "Fertig in 48h",
      description: "Erhalten Sie Ihre Grundrisse als PDF, PNG, JPG",
      detail: "Kostenlose Revisionen inklusive",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            So einfach geht's
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In nur 4 Schritten zu professionellen Grundrissen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent to-accent/20" />
              )}
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon className="w-10 h-10 text-accent-foreground" />
                </div>
                
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground mb-1">{step.description}</p>
                <p className="text-sm text-muted-foreground/80">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
