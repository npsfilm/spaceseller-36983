import { Upload, Sparkles, Download } from "lucide-react";

export const Process = () => {
  const steps = [
    {
      icon: Upload,
      title: "Hochladen",
      description: "Sie laden Ihre Fotos per Drag & Drop hoch. Schnell und unkompliziert.",
      color: "text-accent",
    },
    {
      icon: Sparkles,
      title: "Bearbeiten",
      description: "Unsere Experten optimieren Licht, Farben, Himmel und entfernen Störendes.",
      color: "text-accent",
    },
    {
      icon: Download,
      title: "Empfangen",
      description: "Sie erhalten Ihre bearbeiteten Bilder binnen 24 Stunden zurück.",
      color: "text-accent",
    },
  ];

  return (
    <section id="prozess" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            In 3 Schritten zu <span className="bg-gradient-hero bg-clip-text text-transparent">perfekten Fotos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ein einfacher Prozess, professionelle Ergebnisse
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connection Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border"></div>
              )}

              {/* Step Card */}
              <div className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
