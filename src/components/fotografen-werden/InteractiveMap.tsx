import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";

const cities = [
  { name: "München", status: "active", x: "68%", y: "75%" },
  { name: "Augsburg", status: "active", x: "60%", y: "72%" },
  { name: "Stuttgart", status: "recruiting", x: "50%", y: "68%" },
  { name: "Frankfurt", status: "recruiting", x: "48%", y: "50%" },
  { name: "Hamburg", status: "recruiting", x: "52%", y: "20%" },
  { name: "Berlin", status: "recruiting", x: "68%", y: "32%" },
  { name: "Wien", status: "recruiting", x: "78%", y: "72%" },
  { name: "Zürich", status: "recruiting", x: "48%", y: "80%" },
];

export const InteractiveMap = () => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const scrollToForm = () => {
    const formSection = document.getElementById('application-form');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Wir wachsen im gesamten DACH-Raum – und suchen dich!
          </h2>
          <p className="text-xl text-muted-foreground">
            Sichere dir jetzt deine Partnerregion und werde Teil unseres expandierenden Netzwerks.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative bg-card border border-border rounded-xl p-8 mb-12">
          <div className="relative w-full h-[500px] bg-muted/30 rounded-lg overflow-hidden">
            {/* Simplified DACH Region Outline */}
            <svg 
              viewBox="0 0 800 600" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
            >
              {/* Germany */}
              <path 
                d="M 300 150 L 450 120 L 550 180 L 580 280 L 550 380 L 480 420 L 380 420 L 320 380 L 280 300 L 260 220 Z" 
                fill="hsl(var(--muted))" 
                stroke="hsl(var(--border))" 
                strokeWidth="2"
                opacity="0.6"
              />
              {/* Austria */}
              <path 
                d="M 480 420 L 550 430 L 620 450 L 640 400 L 600 380 L 550 380 Z" 
                fill="hsl(var(--muted))" 
                stroke="hsl(var(--border))" 
                strokeWidth="2"
                opacity="0.6"
              />
              {/* Switzerland */}
              <path 
                d="M 320 480 L 380 460 L 420 480 L 400 520 L 340 520 Z" 
                fill="hsl(var(--muted))" 
                stroke="hsl(var(--border))" 
                strokeWidth="2"
                opacity="0.6"
              />
            </svg>

            {/* City Markers */}
            {cities.map((city) => (
              <div
                key={city.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: city.x, top: city.y }}
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Marker Pin */}
                <div className={`relative transition-all duration-300 ${hoveredCity === city.name ? 'scale-125' : ''}`}>
                  <MapPin 
                    className={`w-8 h-8 ${
                      city.status === 'active' 
                        ? 'text-green-500 fill-green-500' 
                        : 'text-accent fill-accent'
                    }`}
                  />
                  
                  {/* Tooltip */}
                  {hoveredCity === city.name && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-10 animate-fade-in">
                      <p className="text-sm font-semibold text-foreground">{city.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {city.status === 'active' ? '✓ Aktiv' : '🔍 Gesucht'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500 fill-green-500" />
              <span className="text-foreground">Aktive Partner-Region</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent fill-accent" />
              <span className="text-foreground">Partner gesucht</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Deine Region ist noch nicht dabei? Kein Problem – wir expandieren kontinuierlich!
          </p>
          <Button 
            size="xl" 
            variant="cta"
            onClick={scrollToForm}
          >
            Jetzt Partnerregion sichern
          </Button>
        </div>
      </div>
    </section>
  );
};
