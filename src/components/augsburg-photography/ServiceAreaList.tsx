import { MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ServiceAreaList = () => {
  const stadtteile = [
    "Innenstadt",
    "Göggingen",
    "Hochzoll",
    "Pfersee",
    "Haunstetten",
    "Oberhausen",
    "Lechhausen",
  ];

  const umgebung = [
    "Friedberg",
    "Königsbrunn",
    "Stadtbergen",
    "Neusäß",
    "Gersthofen",
    "Bobingen",
    "Schwabmünchen",
    "Meitingen",
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">Servicebereich</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ihr lokaler Immobilienfotograf in Augsburg
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Schnelle Anfahrt, lokale Expertise, persönlicher Service. 
            Keine Anfahrtskosten in Augsburg und Umgebung (bis 25km).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Augsburg Stadtteile
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {stadtteile.map((stadtteil, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{stadtteil}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Umgebung (bis 25km)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {umgebung.map((ort, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{ort}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Weitere Orte auf Anfrage möglich
          </p>
        </div>
      </div>
    </section>
  );
};
