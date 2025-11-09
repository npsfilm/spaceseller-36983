import { MapPin, CheckCircle } from "lucide-react";

export const ServiceAreaList = () => {
  const stadtteile = [
    "Altstadt-Lehel",
    "Maxvorstadt",
    "Schwabing-West & Freimann",
    "Bogenhausen",
    "Haidhausen & Au",
    "Sendling-Westpark",
    "Neuhausen-Nymphenburg",
    "Pasing-Obermenzing",
    "Giesing",
    "Trudering-Riem",
  ];

  const umgebung = [
    "Grünwald",
    "Starnberg",
    "Pullach",
    "Unterschleißheim",
    "Ismaning",
    "Unterföhring",
    "Gräfelfing",
    "Planegg",
    "Garching",
    "Ottobrunn",
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            Unser Servicegebiet
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Ihr lokaler Immobilienfotograf in München
          </h2>
          <p className="text-xl text-muted-foreground">
            Wir bieten professionelle Immobilienfotografie in ganz München und Umgebung. 
            Schnelle Anfahrt, lokale Expertise, persönlicher Service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-8 border shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent" />
              München Stadtteile
            </h3>
            <div className="grid gap-3">
              {stadtteile.map((stadtteil, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{stadtteil}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-8 border shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent" />
              Umgebung (bis 30km)
            </h3>
            <div className="grid gap-3">
              {umgebung.map((ort, index) => (
                <div key={index} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{ort}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            <span className="font-semibold text-accent">Keine Anfahrtskosten</span> innerhalb von München und Umgebung bis 30km
          </p>
        </div>
      </div>
    </section>
  );
};
