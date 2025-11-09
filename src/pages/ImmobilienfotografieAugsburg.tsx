import { Layout } from "@/components/Layout";
import { AugsburgHero } from "@/components/augsburg-photography/AugsburgHero";
import { ServiceAreaList } from "@/components/augsburg-photography/ServiceAreaList";
import { PhotographyServices } from "@/components/augsburg-photography/PhotographyServices";
import { AugsburgPhotographyProcess } from "@/components/augsburg-photography/AugsburgPhotographyProcess";
import { AugsburgPortfolio } from "@/components/augsburg-photography/AugsburgPortfolio";
import { AugsburgPhotographyPricing } from "@/components/augsburg-photography/AugsburgPhotographyPricing";
import { AugsburgTestimonials } from "@/components/augsburg-photography/AugsburgTestimonials";
import { AugsburgPhotographyFAQ } from "@/components/augsburg-photography/AugsburgPhotographyFAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { MapPin, Clock, Award, Camera, CheckCircle, Euro } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ImmobilienfotografieAugsburg = () => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <AugsburgHero />
        <ServiceAreaList />
        <PhotographyServices />
        <AugsburgPhotographyProcess />
        <AugsburgPortfolio />
        
        {/* Why Choose Us Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Warum Immobilienfotografie Augsburg?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ihr lokaler Partner für professionelle Immobilienfotografie
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Lokaler Service</h3>
                  <p className="text-muted-foreground">
                    Schnelle Anfahrt, keine Anfahrtskosten in Augsburg. 
                    Lokale Kenntnis der besten Locations & Perspektiven.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Erfahrung in Augsburg</h3>
                  <p className="text-muted-foreground">
                    200+ Objekte in Augsburg fotografiert. Kennen den lokalen 
                    Immobilienmarkt und wissen, was funktioniert.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Komplettservice</h3>
                  <p className="text-muted-foreground">
                    Fotografie + professionelle Bildbearbeitung inklusive. 
                    Alles aus einer Hand.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">24h Express-Lieferung</h3>
                  <p className="text-muted-foreground">
                    Fotos innerhalb von 24 Stunden. Perfekt für dringende 
                    Vermarktungen oder kurzfristige Verkäufe.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Professionelle Ausrüstung</h3>
                  <p className="text-muted-foreground">
                    Vollformat-Kameras, Weitwinkel-Objektive, 4K-Drohne, 
                    lizenzierter Pilot.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Euro className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">Faire Preise</h3>
                  <p className="text-muted-foreground">
                    Transparente Paketpreise, keine versteckten Kosten. 
                    Mengenrabatt für Makler verfügbar.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <AugsburgPhotographyPricing />
        <AugsburgTestimonials />
      <AugsburgPhotographyFAQ />
      <FinalCTA />
    </Layout>
  );
};

export default ImmobilienfotografieAugsburg;
