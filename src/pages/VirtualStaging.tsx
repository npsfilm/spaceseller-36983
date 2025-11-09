import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Euro, Palette, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { VirtualStagingRooms } from "@/components/VirtualStagingRooms";
import { VirtualStagingStyles } from "@/components/VirtualStagingStyles";
import { VirtualStagingGallery } from "@/components/VirtualStagingGallery";
import { VirtualStagingProcess } from "@/components/VirtualStagingProcess";
import { VirtualStagingPricing } from "@/components/VirtualStagingPricing";
import { VirtualStagingFAQ } from "@/components/VirtualStagingFAQ";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TrustBadges } from "@/components/TrustBadges";
import livingBefore from "@/assets/vs-living-before.jpg";
import livingAfter from "@/assets/vs-living-after.jpg";

const VirtualStaging = () => {
  return (
    <Layout>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Verkaufen Sie leere Immobilien{" "}
                  <span className="text-primary">40% schneller</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Professionelle Virtual Staging – Räume digital möblieren ab nur 35€
                </p>
              </div>
              
              <TrustBadges />
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="text-lg">
                  <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">
                    Jetzt Raum möblieren lassen
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg">
                  <a href="#gallery">Beispiele ansehen</a>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <BeforeAfterSlider
                beforeImage={livingBefore}
                afterImage={livingAfter}
                className="rounded-2xl overflow-hidden shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is Virtual Staging */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Was ist Virtual Staging?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Virtual Staging ist die digitale Möblierung leerer Räume. Wir verwandeln kahle Wände 
              in einladende, wohnliche Räume – für einen Bruchteil der Kosten echter Möblierung.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-lg border bg-card">
              <h3 className="font-bold text-xl mb-2">Echte Möblierung</h3>
              <p className="text-3xl font-bold text-muted-foreground mb-2">3.000€ - 10.000€</p>
              <p className="text-sm text-muted-foreground mb-4">Wochen Vorlaufzeit</p>
              <p className="text-sm">Nur 1 Stil möglich</p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <h3 className="font-bold text-xl mb-2">Leer lassen</h3>
              <p className="text-3xl font-bold text-muted-foreground mb-2">0€</p>
              <p className="text-sm text-muted-foreground mb-4">Sofort verfügbar</p>
              <p className="text-sm">Wenig emotional</p>
            </div>
            
            <div className="text-center p-6 rounded-lg border-2 border-primary bg-primary/5">
              <h3 className="font-bold text-xl mb-2 text-primary">Virtual Staging ✓</h3>
              <p className="text-3xl font-bold text-primary mb-2">35€ - 250€</p>
              <p className="text-sm text-muted-foreground mb-4">48h Lieferung</p>
              <p className="text-sm font-semibold">Unbegrenzte Stile</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types */}
      <VirtualStagingRooms />

      {/* Style Options */}
      <VirtualStagingStyles />

      {/* Benefits */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">Warum Virtual Staging?</h2>
            
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <div>
                <p className="text-5xl font-bold text-primary mb-2">40%</p>
                <p className="text-muted-foreground">schnellere Verkaufszeit</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-primary mb-2">15%</p>
                <p className="text-muted-foreground">höhere Verkaufspreise</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-primary mb-2">300x</p>
                <p className="text-muted-foreground">günstiger als echte Möblierung</p>
              </div>
            </div>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Emotionale Verbindung",
                description: "Käufer können sich das Leben im Raum vorstellen",
              },
              {
                icon: Euro,
                title: "Kosteneffizient",
                description: "35€ statt 3.000-10.000€ für echte Möblierung",
              },
              {
                icon: Palette,
                title: "Flexibilität",
                description: "Verschiedene Stile für verschiedene Zielgruppen",
              },
              {
                icon: Monitor,
                title: "Online-Wirkung",
                description: "83% mehr Klicks auf Immobilienportalen",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-background rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <div id="gallery">
        <VirtualStagingGallery />
      </div>

      {/* Process */}
      <VirtualStagingProcess />

      {/* Pricing */}
      <VirtualStagingPricing />

      {/* FAQ */}
      <VirtualStagingFAQ />

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Was unsere Kunden sagen</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Bereit für Virtual Staging?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Verwandeln Sie leere Räume in traumhafte Wohnwelten
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button asChild size="lg" className="text-lg">
              <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">
                Jetzt Raum möblieren lassen
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">Kostenloses Musterbeispiel anfordern</a>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span> 500+ möblierte Räume
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span> 4.9/5 Bewertung
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span> Geld-zurück-Garantie
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VirtualStaging;
