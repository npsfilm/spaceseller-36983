import { Button } from "@/components/ui/button";
import { TrustBadges } from "@/components/TrustBadges";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import heroBeforeImage from "@/assets/re-exterior-before.jpg";
import heroAfterImage from "@/assets/re-exterior-after.jpg";
import { MapPin, Phone } from "lucide-react";

export const MunichHero = () => {
  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    portfolioSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
              <MapPin className="w-4 h-4" />
              München & Umgebung (30km)
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              Münchens Immobilien
              <span className="block text-gradient">schneller verkaufen.</span>
              Mit Fotos, die begeistern.
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Professionelle HDR-Fotos, 4K-Drohnenvideos & 3D-Touren. Garantiert in 24 Stunden geliefert.
            </p>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border">
                ✓ Lokaler Service in München
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border">
                ✓ 24h Express-Lieferung
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border">
                ✓ Inkl. Bildbearbeitung
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border">
                ✓ Drohnenaufnahmen
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border">
                ✓ 300+ Objekte fotografiert
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border">
                ✓ English service available
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="xl" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="group">
                Pakete & Preise ansehen
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              <Button size="xl" variant="outline" onClick={scrollToBooking}>
                Jetzt Termin buchen
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Phone className="w-4 h-4 text-accent" />
              <a href="tel:+498911234567" className="text-lg font-semibold text-accent hover:underline">
                (089) 1123-4567
              </a>
              <span className="text-sm text-muted-foreground">• Kostenlos in München anrufen</span>
            </div>

            <div className="pt-4">
              <TrustBadges />
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <BeforeAfterSlider 
                beforeImage={heroBeforeImage}
                afterImage={heroAfterImage}
                beforeAlt="Vor der professionellen Bearbeitung"
                afterAlt="Nach der professionellen HDR-Bearbeitung"
              />
              <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg border">
                  <p className="text-sm font-medium">Der Unterschied: Smartphone vs. Profi-Fotografie</p>
                  <p className="text-xs text-muted-foreground mt-1">HDR-Bearbeitung • Perspektivkorrektur • Farboptimierung</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
