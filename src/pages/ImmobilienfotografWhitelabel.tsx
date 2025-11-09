import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { TrustBadges } from "@/components/TrustBadges";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { WhyWhiteLabel } from "@/components/real-estate-editing/WhyWhiteLabel";
import { RealEstatePhotographerProcess } from "@/components/real-estate-editing/RealEstatePhotographerProcess";
import { EditingFeaturesList } from "@/components/real-estate-editing/EditingFeaturesList";
import { RealEstateEditingGallery } from "@/components/real-estate-editing/RealEstateEditingGallery";
import { RealEstatePhotographerPricing } from "@/components/real-estate-editing/RealEstatePhotographerPricing";
import { TrustQuality } from "@/components/real-estate-editing/TrustQuality";
import { PartnerOnboarding } from "@/components/real-estate-editing/PartnerOnboarding";
import { RealEstatePhotographerFAQ } from "@/components/real-estate-editing/RealEstatePhotographerFAQ";
import { Shield, CreditCard, Zap, Award } from "lucide-react";
import exteriorBefore from "@/assets/re-exterior-before.jpg";
import exteriorAfter from "@/assets/re-exterior-after.jpg";

const ImmobilienfotografWhitelabel = () => {
  useEffect(() => {
    document.title = "White-Label Bildbearbeitung für Immobilienfotografen | spaceseller";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Professionelle, anonyme Immobilienbildbearbeitung ab 6 € pro Bild. 48 h Lieferung, 100 % White-Label, DSGVO-konform. Jetzt kostenlose Testbearbeitung starten!'
      );
    }
  }, []);

  return (
    <Layout className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                White-Label Bildbearbeitung für
                <span className="text-accent block">Immobilienfotografen</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Deine Marke. Unsere Expertise. Wir bearbeiten deine Immobilienfotos professionell, schnell und 100 % anonym.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm">48h Lieferung</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm">24h Express</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-sm">DSGVO-konform</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <span className="text-sm">MwSt. Rechnung</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="text-sm">100% White-Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-sm">Made in Germany</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Jetzt kostenlose Testbearbeitung starten
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Mengenpreise ansehen
                </Button>
              </div>

              <TrustBadges />
            </div>

            <div className="relative">
              <BeforeAfterSlider
                beforeImage={exteriorBefore}
                afterImage={exteriorAfter}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why White-Label Section */}
      <WhyWhiteLabel />

      {/* Process Section */}
      <RealEstatePhotographerProcess />

      {/* Editing Features List */}
      <EditingFeaturesList />

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Warum Fotografen lieber mit uns skalieren
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">Kriterium</th>
                  <th className="text-center p-4">Freelancer</th>
                  <th className="text-center p-4">Inhouse Editor</th>
                  <th className="text-center p-4 bg-accent/10">spaceseller White-Label</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Kosten/Monat", "2.000€+", "3.500€+", "ab 300€"],
                  ["Verfügbarkeit", "Schwankend", "Fix, teuer", "Garantiert"],
                  ["Branding", "Unterschiedlich", "Eigenes", "100% anonym"],
                  ["Datenschutz", "Unsicher", "Hoch", "DSGVO-konform"],
                  ["Lieferzeit", "Variabel", "1-3 Tage", "48h / 24h Express"],
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-4 font-medium">{row[0]}</td>
                    <td className="p-4 text-center text-muted-foreground">
                      {row[1]}
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      {row[2]}
                    </td>
                    <td className="p-4 text-center bg-accent/10 font-semibold">
                      {row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center mt-8 text-lg">
            Bei 200 Bildern / Monat sparst du über{" "}
            <span className="font-bold text-accent">2.000 €</span> gegenüber einem Inhouse-Editor
          </p>
          <div className="text-center mt-6">
            <Button size="lg">Jetzt starten</Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <RealEstateEditingGallery />

      {/* Pricing */}
      <RealEstatePhotographerPricing />

      {/* Trust & Quality */}
      <TrustQuality />

      {/* Partner Onboarding */}
      <PartnerOnboarding />

      {/* FAQ */}
      <RealEstatePhotographerFAQ />

      {/* Free Trial Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Überzeugen Sie sich selbst – Kostenlos
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            3 Bilder professionell bearbeitet. Keine Kreditkarte. Keine Verpflichtung.
          </p>
          <div className="bg-background rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-4xl mb-2">📤</div>
                <p className="font-semibold">Bilder hochladen</p>
              </div>
              <div>
                <div className="text-4xl mb-2">✏️</div>
                <p className="font-semibold">Editing-Wünsche angeben</p>
              </div>
              <div>
                <div className="text-4xl mb-2">✨</div>
                <p className="font-semibold">In 48h fertige Bilder</p>
              </div>
            </div>
            <Button size="lg" className="text-lg px-12">
              Jetzt 3 Bilder gratis bearbeiten lassen
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Nicht zufrieden? Kein Problem. Keine Fragen.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Wachse mit uns – ohne zusätzliche Mitarbeiter
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Teste unsere White-Label Bildbearbeitung jetzt kostenlos und sichere dir einen professionellen Partner an deiner Seite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-12">
              Kostenlos testen
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-12">
              Mehr über Partnerschaft erfahren
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ImmobilienfotografWhitelabel;
