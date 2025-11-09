import { Calendar, Clipboard, Camera, Edit, Download } from "lucide-react";

export const MunichPhotographyProcess = () => {
  const steps = [
    {
      icon: Calendar,
      title: "1. Termin buchen",
      description: "Wählen Sie online Ihr Paket & Wunschtermin",
      detail: "Online-Buchung in 2 Minuten • Flexible Zeiten",
      time: "2 Min.",
    },
    {
      icon: Camera,
      title: "2. Shooting vor Ort",
      description: "Wir kommen pünktlich und setzen Ihre Immobilie perfekt in Szene",
      detail: "Professionelle Ausrüstung • Erfahrenes Team",
      time: "30-90 Min.",
    },
    {
      icon: Download,
      title: "3. Lieferung in 24h",
      description: "Sie erhalten Ihre bearbeiteten Bilder und Videos per Download-Link",
      detail: "Noch heute online vermarkten • Express 12h verfügbar",
      time: "24 Std.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">So einfach geht's</h2>
          <p className="text-xl text-muted-foreground">
            In 3 einfachen Schritten zu professionellen Immobilienfotos
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative flex gap-6 items-start group"
              >
                {/* Step number and line */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-full bg-border my-2 min-h-[60px]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-card rounded-xl p-6 border shadow-sm group-hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <step.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{step.description}</p>
                      <p className="text-sm text-accent font-medium">{step.detail}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-6 py-3 rounded-full font-medium">
            ⚡ Express-Service in 12h gegen Aufpreis verfügbar
          </div>
        </div>
      </div>
    </section>
  );
};
