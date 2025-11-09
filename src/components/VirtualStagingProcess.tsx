import { Upload, Palette, Wand2, Download } from "lucide-react";

export const VirtualStagingProcess = () => {
  const steps = [
    {
      icon: Upload,
      title: "Fotos hochladen",
      description: "Laden Sie Fotos Ihrer leeren Räume hoch",
      detail: "Mindestens 1 Foto pro Raum ausreichend",
    },
    {
      icon: Palette,
      title: "Stil auswählen",
      description: "Wählen Sie Ihren bevorzugten Einrichtungsstil",
      detail: "Oder lassen Sie uns beraten",
    },
    {
      icon: Wand2,
      title: "Wir möblieren professionell",
      description: "Unser Design-Team erstellt fotorealistische Möblierung",
      detail: "Mit echter 3D-Rendering-Technologie",
    },
    {
      icon: Download,
      title: "Fertig in 48h",
      description: "Erhalten Sie Ihre möblierten Fotos hochauflösend",
      detail: "Unlimited Revisionen kostenlos",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">So einfach funktioniert's</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Von leeren Räumen zu traumhaften Wohnwelten in 4 einfachen Schritten
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 relative z-10">
                  <step.icon className="w-12 h-12 text-primary" />
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl z-20">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-2">{step.description}</p>
              <p className="text-sm text-muted-foreground italic">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
