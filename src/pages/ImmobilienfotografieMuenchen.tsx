import { Layout } from "@/components/Layout";
import { FinalCTA } from "@/components/FinalCTA";
import { MunichHero } from "@/components/munich-photography/MunichHero";
import { TrustedByLogos } from "@/components/munich-photography/TrustedByLogos";
import { BeforeAfterShowcase } from "@/components/munich-photography/BeforeAfterShowcase";
import { ServiceAreaList } from "@/components/munich-photography/ServiceAreaList";
import { MunichPhotographyServices } from "@/components/munich-photography/MunichPhotographyServices";
import { MunichPhotographyProcess } from "@/components/munich-photography/MunichPhotographyProcess";
import { MunichPortfolio } from "@/components/munich-photography/MunichPortfolio";
import { MunichPhotographyPricing } from "@/components/munich-photography/MunichPhotographyPricing";
import { MunichTestimonials } from "@/components/munich-photography/MunichTestimonials";
import { MunichPhotographyFAQ } from "@/components/munich-photography/MunichPhotographyFAQ";
import { StatsCounter } from "@/components/StatsCounter";
import { MapPin, Award, CheckCircle, Clock, Camera, Euro, Phone, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ImmobilienfotografieMuenchen = () => {
  return (
    <Layout className="min-h-screen bg-background">
      <MunichHero />
      <TrustedByLogos />
      <BeforeAfterShowcase />
      <MunichPhotographyServices />
      <MunichPhotographyProcess />
      <MunichPortfolio />
      
      {/* Stats and Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">
                <StatsCounter end={300} suffix="+" />
              </div>
              <p className="text-muted-foreground font-semibold">München Immobilien</p>
              <p className="text-xs text-muted-foreground mt-1">schneller verkauft</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">
                <StatsCounter end={150} suffix="+" />
              </div>
              <p className="text-muted-foreground font-semibold">Makler vertrauen uns</p>
              <p className="text-xs text-muted-foreground mt-1">wiederkehrende Kunden</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">24h</div>
              <p className="text-muted-foreground font-semibold">Lieferung garantiert</p>
              <p className="text-xs text-muted-foreground mt-1">noch heute online</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2">
                <StatsCounter end={12} />
                <span className="text-2xl"> Tage</span>
              </div>
              <p className="text-muted-foreground font-semibold">Schnellerer Verkauf</p>
              <p className="text-xs text-muted-foreground mt-1">im Durchschnitt</p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Warum Immobilienfotografie München?</h2>
            <p className="text-xl text-muted-foreground">
              Ihr lokaler Partner für professionelle Immobilienfotografie in München
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Lokaler München-Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Schnelle Anfahrt, keine Anfahrtskosten in München und Umgebung. 
                      Kennen den lokalen Immobilienmarkt perfekt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Premium-Markt Expertise</h3>
                    <p className="text-sm text-muted-foreground">
                      Spezialisiert auf High-End Immobilien in München, Grünwald und Starnberg. 
                      Erfahrung mit Luxus-Objekten.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <CheckCircle className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Komplettservice</h3>
                    <p className="text-sm text-muted-foreground">
                      Fotografie + professionelle Bildbearbeitung + 24h Lieferung. 
                      Alles aus einer Hand, keine versteckten Kosten.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">24h Lieferung - Noch heute online</h3>
                    <p className="text-sm text-muted-foreground">
                      24h Garantie-Lieferung. Express in 12h verfügbar. 
                      Shooting heute → Online-Vermarktung morgen. Perfekt für schnelle Verkäufe.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Camera className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Profi-Ausrüstung</h3>
                    <p className="text-sm text-muted-foreground">
                      Vollformat-Kameras, Weitwinkel-Objektive, 4K-Drohne mit lizenziertem Piloten. 
                      Premium Equipment für beste Ergebnisse.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Euro className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Faire Premium-Preise</h3>
                    <p className="text-sm text-muted-foreground">
                      Transparente Paketpreise ab 149€. Mengenrabatt für Makler. 
                      Beste Qualität zum fairen Preis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div id="pricing">
        <MunichPhotographyPricing />
      </div>
      <MunichTestimonials />
      <MunichPhotographyFAQ />

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gradient-to-br from-accent/5 via-background to-accent/5 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⚡ Nur noch 3 Termine diese Woche verfügbar
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Jetzt Buchen & Schneller Verkaufen
              </h2>
              <p className="text-xl text-muted-foreground">
                Kontaktieren Sie uns jetzt für Ihr unverbindliches Angebot
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-bold text-lg mb-3">📞 München Hotline</p>
                  <a 
                    href="tel:+498911234567" 
                    className="text-2xl font-bold text-accent hover:underline block mb-2"
                  >
                    (089) 1123-4567
                  </a>
                  <p className="text-xs text-muted-foreground">Mo-Fr 8-20 Uhr • Sa 9-18 Uhr</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-bold text-lg mb-3">✉️ Email</p>
                  <a 
                    href="mailto:muenchen@spaceseller.de" 
                    className="text-accent hover:underline block mb-2 font-semibold"
                  >
                    muenchen@spaceseller.de
                  </a>
                  <p className="text-xs text-muted-foreground">Antwort innerhalb 2h</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-2">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-bold text-lg mb-3">💬 WhatsApp</p>
                  <a 
                    href="https://wa.me/498911234567" 
                    className="text-accent hover:underline font-semibold block mb-2"
                  >
                    Jetzt chatten
                  </a>
                  <p className="text-xs text-muted-foreground">Schnellste Antwort</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-card border-2 border-accent/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Keine Verpflichtung</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Geld-zurück-Garantie</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Kostenlose Nachbesserung</span>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-6 text-sm">
              🚀 Wir melden uns innerhalb von 2 Stunden • 💬 Texten Sie uns für Sofort-Angebot
            </p>
          </div>
        </div>
      </section>

      <FinalCTA />
    </Layout>
  );
};

export default ImmobilienfotografieMuenchen;
