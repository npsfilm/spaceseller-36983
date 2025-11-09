import { Upload, Sparkles, Download } from "lucide-react";

export const ProcessSteps = () => {
  const steps = [
    {
      icon: Upload,
      title: "Bilder hochladen",
      description: "Service auswählen & Details angeben",
    },
    {
      icon: Sparkles,
      title: "Experten-Bearbeitung",
      description: "KI-Unterstützung + menschliche Qualitätskontrolle",
    },
    {
      icon: Download,
      title: "Download & Nutzen",
      description: "Kostenlose Nachbesserung falls nötig",
    },
  ];

  return (
    <div className="py-16 bg-muted/30 rounded-2xl animate-fade-in-up">
      <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
        In 3 Schritten zu perfekten Immobilienfotos
      </h3>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative text-center group"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border -z-10">
                <div className="h-full bg-accent origin-left transition-transform duration-1000 scale-x-0 group-hover:scale-x-100" />
              </div>
            )}
            
            {/* Step Number */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm z-10">
              {index + 1}
            </div>

            {/* Icon Circle */}
            <div className="mx-auto w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <step.icon className="w-12 h-12 text-primary-foreground" />
            </div>

            {/* Content */}
            <h4 className="text-xl font-semibold text-foreground mb-2">
              {step.title}
            </h4>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
