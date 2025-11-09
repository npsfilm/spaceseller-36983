import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Basis-Retusche",
      price: "8€",
      description: "Der Standard für 90% der Makler",
      popular: false,
      features: [
        "Himmelsaustausch",
        "Farb- & Lichtkorrektur",
        "Perspektivkorrektur",
        "Rasen/Pflanzen-Optimierung",
        "24h Lieferung",
      ],
    },
    {
      name: "Premium-Retusche",
      price: "12€",
      description: "Für anspruchsvolle Projekte",
      popular: true,
      features: [
        "Alle Basis-Features",
        "Objektentfernung",
        "Virtuelle Dämmerung",
        "Erweiterte Farbkorrektur",
        "Priority Support",
      ],
    },
    {
      name: "Virtual Staging",
      price: "ab 35€",
      description: "Leere Räume digital möblieren",
      popular: false,
      features: [
        "Professionelle Möblierung",
        "Verschiedene Stile",
        "Unlimited Revisionen",
        "3D-Rendering Qualität",
        "48h Lieferung",
      ],
    },
    {
      name: "2D/3D Grundrisse",
      price: "ab 45€",
      description: "Professionelle Grundrisse erstellen",
      popular: false,
      features: [
        "2D-Grundrisse mit Maßen",
        "3D-Visualisierungen",
        "Möblierte Grundrisse",
        "Aus Skizzen oder Fotos",
        "48h Lieferung",
      ],
    },
  ];

  return (
    <section id="preise" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Ein Preis, der sich <span className="bg-gradient-hero bg-clip-text text-transparent">rechnet</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Faire Preise ohne versteckte Kosten – Mit Zufriedenheitsgarantie
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 animate-fade-in ${
                plan.popular
                  ? "bg-gradient-hero shadow-lg border-2 border-primary-glow"
                  : "bg-card shadow-card hover:shadow-lg"
              } transition-all duration-300 hover:-translate-y-2`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Beliebteste Wahl
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  {!plan.price.startsWith("ab") && (
                    <span className={plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"}>
                      / Bild
                    </span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-primary-foreground" : "text-accent"}`} />
                    <span className={plan.popular ? "text-primary-foreground" : "text-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.popular ? "outline" : "default"}
                size="lg"
                className={`w-full ${
                  plan.popular
                    ? "bg-background text-foreground hover:bg-background/90 border-background"
                    : ""
                }`}
              >
                Jetzt starten
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Benötigen Sie mehr als 50 Bilder pro Monat?{" "}
            <Button variant="link" className="p-0 h-auto font-semibold">
              Kontaktieren Sie uns für Paketpreise
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
};
