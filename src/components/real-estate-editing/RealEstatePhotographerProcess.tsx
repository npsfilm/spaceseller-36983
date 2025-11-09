import { Upload, Edit, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RealEstatePhotographerProcess = () => {
  const steps = [
    {
      icon: Upload,
      title: "Bilder hochladen",
      description: "Du lädst deine RAW- oder JPG-Dateien bequem über unsere Plattform hoch",
    },
    {
      icon: Edit,
      title: "Bearbeitungswünsche angeben",
      description: "Wir passen Stil, Helligkeit, Farben und Perspektive an – exakt nach deinem Workflow",
    },
    {
      icon: Download,
      title: "Fertige Bilder erhalten",
      description: "Du erhältst perfekt bearbeitete Bilder in 24–48 h – ganz ohne Branding",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Einfach. Sicher. Skalierbar.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            So funktioniert unser White-Label-Service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <step.icon className="w-10 h-10 text-accent" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
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
