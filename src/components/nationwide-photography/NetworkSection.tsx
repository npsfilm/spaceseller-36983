import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export const NetworkSection = () => {
  const cities = [
    { name: "Hamburg", top: "15%", left: "35%" },
    { name: "Berlin", top: "20%", left: "60%" },
    { name: "Köln", top: "45%", left: "25%" },
    { name: "Frankfurt", top: "50%", left: "35%" },
    { name: "Stuttgart", top: "65%", left: "35%" },
    { name: "München", top: "75%", left: "45%" },
    { name: "Dresden", top: "35%", left: "65%" },
    { name: "Hannover", top: "30%", left: "40%" },
    { name: "Düsseldorf", top: "42%", left: "28%" },
    { name: "Leipzig", top: "38%", left: "55%" },
  ];

  const handleCTA = () => {
    window.open('https://app.spaceseller.de', '_blank');
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Über 500 geprüfte Immobilienfotografen
            <span className="block text-accent">in ganz Deutschland</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Unser Netzwerk wächst stetig – professionelle Fotografen in Ihrer Region
          </p>
        </div>

        {/* Stylized Germany Map */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative aspect-[3/4] bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 border border-accent/20">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg viewBox="0 0 400 600" className="w-full h-full">
                <path
                  d="M200 50 L250 100 L280 150 L290 200 L300 280 L280 350 L250 420 L200 480 L150 420 L120 350 L110 280 L120 200 L140 150 L170 100 Z"
                  fill="currentColor"
                  className="text-accent"
                />
              </svg>
            </div>

            {/* City Markers */}
            {cities.map((city, index) => (
              <div
                key={index}
                className="absolute group cursor-pointer"
                style={{ top: city.top, left: city.left }}
              >
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <div className="bg-foreground text-background px-3 py-1 rounded-lg text-sm font-medium">
                      {city.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Von Metropolen bis zu kleineren Städten – wir finden den passenden Fotografen für Ihr Objekt
          </p>
          <Button size="xl" variant="cta" onClick={handleCTA}>
            Jetzt Fotograf anfragen
          </Button>
        </div>
      </div>
    </section>
  );
};
