import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Home, LayoutGrid, Check } from "lucide-react";
import { Link } from "react-router-dom";
import beforeExterior from "@/assets/before-exterior.jpg";
import afterInterior from "@/assets/after-interior.jpg";
import floorPlanExample from "@/assets/floor-plan-example.jpg";

export const Services = () => {
  const services = [
    {
      icon: Camera,
      title: "Immobilien-Fotografie",
      description: "Unsere spezialisierten Fotografen wissen, wie man Architektur und Ambiente einfängt, um Interesse zu wecken",
      features: [
        "Professionelle Aufnahmen (Innen & Außen)",
        "Drohnenaufnahmen optional",
        "Inklusive Bildbearbeitung",
        "Lieferung in 48h",
      ],
      price: "ab 199€",
      priceUnit: "/ Shooting",
      image: beforeExterior,
      link: "/immobilienfotografie-muenchen",
      gradient: "from-primary/20 to-primary/5",
      popular: false,
    },
    {
      icon: Camera,
      title: "Professionelle Bildbearbeitung",
      description: "Himmelsaustausch, Farbkorrektur, Perspektivkorrektur – Ihre Fotos in Perfektion",
      features: [
        "Himmelsaustausch & Farboptimierung",
        "Objektentfernung (Müll, Autos, etc.)",
        "Rasen & Pflanzen-Optimierung",
        "Perspektiv- & Linienkorrektur",
      ],
      price: "ab 8€",
      priceUnit: "/ Bild",
      image: beforeExterior,
      link: "/Immobilienmakler#preise",
      gradient: "from-accent/20 to-accent/5",
      popular: false,
    },
    {
      icon: Home,
      title: "Virtual Staging",
      description: "Leere Räume digital möblieren und emotional verkaufen",
      features: [
        "Professionelle 3D-Möblierung",
        "Verschiedene Einrichtungsstile",
        "Fotorealistische Qualität",
        "Unlimited Revisionen",
      ],
      price: "ab 35€",
      priceUnit: "/ Raum",
      image: afterInterior,
      link: "/virtual-staging",
      gradient: "from-primary/20 to-primary/5",
    },
    {
      icon: LayoutGrid,
      title: "2D/3D Grundrisse",
      description: "Professionelle Grundrisse aus Ihren Skizzen oder Fotos",
      features: [
        "2D-Grundrisse mit Maßen",
        "3D-Visualisierungen",
        "Möblierte Grundrisse",
        "Schnelle Bearbeitung in 48h",
      ],
      price: "ab 45€",
      priceUnit: "/ Grundriss",
      image: floorPlanExample,
      link: "/grundrisse",
      gradient: "from-secondary/20 to-secondary/5",
    },
  ];

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Ihr Baukasten für <span className="bg-gradient-hero bg-clip-text text-transparent">digitales Immobilien-Marketing</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="relative pt-4 h-full">
              {service.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium z-10">
                  Unser Bestseller
                </div>
              )}
              <Card
                className={`flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-border ${
                  service.popular ? "ring-2 ring-primary" : ""
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >

              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`} />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>

              <CardHeader className="relative">
                <div className="absolute -top-8 left-6 p-3 rounded-xl bg-card border-2 border-border shadow-lg">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-2xl mt-4">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-6">
                {/* Features List */}
                <div className="flex-1">
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {service.price}
                    </span>
                    <span className="text-muted-foreground">{service.priceUnit}</span>
                  </div>

                  {/* CTA Button */}
                  <Link to={service.link}>
                    <Button
                      variant={service.popular ? "default" : "outline"}
                      size="lg"
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300"
                    >
                      Mehr erfahren
                    </Button>
                  </Link>
                </div>
              </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
