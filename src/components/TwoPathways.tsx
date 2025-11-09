import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Check } from "lucide-react";
import { Link } from "react-router-dom";

export const TwoPathways = () => {
  const pathways = [
    {
      icon: Camera,
      title: "Fotograf vor Ort buchen",
      tagline: "Das Sorglos-Paket",
      description:
        "Wir schicken einen geprüften Immobilienfotografen zu Ihrem Objekt. Sie erhalten ein komplettes, verkaufsfertiges Foto-Paket inklusive High-End-Bearbeitung und optionalen Drohnenaufnahmen.",
      features: [
        "Professioneller Fotograf in Ihrer Region",
        "Komplette Aufnahme (Innen, Außen, Details)",
        "Inklusive aller Nachbearbeitungen",
        "Lieferung in 48h",
      ],
      priceInfo: "Pakete ab 199 €",
      cta: "Verfügbarkeit & Preise prüfen",
      link: "/immobilienfotografie-muenchen",
      gradient: "from-primary/10 to-primary/5",
    },
    {
      icon: Upload,
      title: "Selbst fotografieren & hochladen",
      tagline: "Der Express-Service",
      description:
        "Sie machen die Fotos – wir holen das Beste raus. Laden Sie Ihre Bilder hoch und erhalten Sie in 24h perfekt bearbeitete Fotos, virtuelle Möblierungen oder professionelle Grundrisse.",
      features: [
        "24h Express-Lieferung",
        "Bildbearbeitung ab nur 8 €",
        "Virtual Staging & Grundrisse",
        "KI-unterstützt + manuelle Qualitätskontrolle",
      ],
      priceInfo: "Bildbearbeitung ab 8€",
      cta: "Jetzt Bilder hochladen",
      link: "/order",
      gradient: "from-accent/10 to-accent/5",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Sie haben die Wahl: <span className="bg-gradient-hero bg-clip-text text-transparent">Full-Service</span> oder{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">Express-Bearbeitung</span>
          </h2>
        </div>

        {/* Pathway Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {pathways.map((pathway, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pathway.gradient} opacity-50`} />

              <CardHeader className="relative">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-background border-2 border-border rounded-xl mb-4 shadow-sm">
                  <pathway.icon className="w-7 h-7 text-accent" />
                </div>

                {/* Tagline */}
                <div className="inline-block mb-2">
                  <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {pathway.tagline}
                  </span>
                </div>

                <CardTitle className="text-2xl">{pathway.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {pathway.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {pathway.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-foreground mb-4">
                    {pathway.priceInfo}
                  </p>

                  {/* CTA Button */}
                  <Link to={pathway.link}>
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300"
                    >
                      {pathway.cta}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
