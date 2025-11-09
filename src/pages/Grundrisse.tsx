import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { TrustBadges } from "@/components/TrustBadges";
import { FloorPlanTypes } from "@/components/FloorPlanTypes";
import { FloorPlanProcess } from "@/components/FloorPlanProcess";
import { FloorPlanGallery } from "@/components/FloorPlanGallery";
import { FloorPlanPricing } from "@/components/FloorPlanPricing";
import { FloorPlanFAQ } from "@/components/FloorPlanFAQ";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { Link } from "react-router-dom";
import { TrendingUp, Clock, FileText, Award, ArrowRight } from "lucide-react";
import floorPlanSketch from "@/assets/floor-plan-sketch.jpg";
import floorPlan2D from "@/assets/floor-plan-2d-professional.jpg";

const Grundrisse = () => {
  return (
    <Layout className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Professionelle 2D & 3D Grundrisse
                <span className="block text-primary mt-2">in 48 Stunden</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Aus Ihren Skizzen oder Fotos erstellen wir perfekte Grundrisse – ab nur 45€
              </p>
              
              <TrustBadges />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="xl" variant="cta">
                  <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">
                    Jetzt Grundriss erstellen lassen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link to="#preise">Preise ansehen</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-xl transform -rotate-2">
                    <img
                      src={floorPlanSketch}
                      alt="Handgezeichnete Skizze"
                      className="w-full h-auto"
                    />
                    <div className="bg-muted p-3">
                      <p className="text-sm font-semibold">Vorher: Ihre Skizze</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-lg overflow-hidden shadow-xl transform rotate-2">
                    <img
                      src={floorPlan2D}
                      alt="Professioneller Grundriss"
                      className="w-full h-auto"
                    />
                    <div className="bg-primary p-3">
                      <p className="text-sm font-semibold text-primary-foreground">Nachher: Professionell</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground rounded-full p-4 shadow-lg">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">73%</div>
              <p className="text-muted-foreground">der Käufer betrachten Grundrisse als wichtigste Information</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2x</div>
              <p className="text-muted-foreground">mehr Anfragen bei Inseraten mit professionellen Grundrissen</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">48h</div>
              <p className="text-muted-foreground">Durchschnittliche Lieferzeit für perfekte Grundrisse</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Pflicht in vielen Bundesländern",
                description: "In mehreren Bundesländern sind Grundrisse bei Immobilienverkauf Pflicht",
              },
              {
                icon: TrendingUp,
                title: "Bessere Vermarktung",
                description: "Grundrisse erhöhen die Wahrscheinlichkeit von Besichtigungen um 52%",
              },
              {
                icon: Clock,
                title: "Zeitersparnis",
                description: "Weniger Rückfragen zur Raumaufteilung – mehr qualifizierte Interessenten",
              },
              {
                icon: Award,
                title: "Professioneller Auftritt",
                description: "Zeigen Sie Kompetenz und Seriosität mit perfekten Unterlagen",
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-background rounded-lg p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Plan Types */}
      <FloorPlanTypes />

      {/* Process */}
      <FloorPlanProcess />

      {/* Gallery */}
      <FloorPlanGallery />

      {/* What You Need Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Was Sie benötigen
            </h2>
            <p className="text-lg text-muted-foreground">
              Keine Sorge über die Qualität – wir arbeiten mit jedem Material!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              "✓ Handgezeichnete Skizzen",
              "✓ Fotos aus jeder Perspektive",
              "✓ Alte Baupläne oder Grundrisse",
              "✓ PDF-Scans von Dokumenten",
              "✓ Screenshots aus Immobilienportalen",
              "✓ Selbst erstellte Zeichnungen",
            ].map((item, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4 text-center">
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              <strong>Tipp:</strong> Je mehr Informationen Sie uns geben, desto genauer wird das Ergebnis. 
              Aber auch mit minimalen Unterlagen erstellen wir professionelle Grundrisse!
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <div id="preise">
        <FloorPlanPricing />
      </div>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfekt für jeden Anwendungsfall
            </h2>
            <p className="text-lg text-muted-foreground">
              Professionelle Grundrisse für verschiedenste Zwecke
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Immobilienverkauf",
                description: "Pflicht in vielen Bundesländern, erhöht Kaufinteresse deutlich",
              },
              {
                title: "Vermietung",
                description: "Reduziert Besichtigungen durch klare Vorabinformation",
              },
              {
                title: "Renovierung & Umbau",
                description: "Planungsgrundlage für Umbauten und Sanierungen",
              },
              {
                title: "Architektur-Dokumentation",
                description: "Bestandsaufnahme für Neubauten und Erweiterungen",
              },
              {
                title: "Immobilienexposés",
                description: "Professionelle Unterlagen für Print & Online-Marketing",
              },
              {
                title: "Behördliche Unterlagen",
                description: "DIN-gerechte Grundrisse für offizielle Zwecke",
              },
            ].map((useCase, index) => (
              <div key={index} className="bg-background rounded-lg p-6 space-y-2">
                <h3 className="text-xl font-semibold">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FloorPlanFAQ />

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Das sagen unsere Kunden
            </h2>
            <p className="text-lg text-muted-foreground">
              Über 500 zufriedene Makler und Immobilienbesitzer
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für professionelle Grundrisse?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Laden Sie Ihre Unterlagen hoch und erhalten Sie in 48h perfekte Grundrisse
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="xl" variant="cta">
              <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">
                Jetzt Grundriss beauftragen
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="mailto:info@example.com">Kostenlose Beratung</a>
            </Button>
          </div>

          <div className="mt-8">
            <TrustBadges />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Grundrisse;
