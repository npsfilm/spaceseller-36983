import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Palette, Sparkles, Shield } from "lucide-react";

export const EditingForOwners = () => {
  const features = [
    {
      icon: Palette,
      title: "Professionelle Farbkorrektur",
      description: "Optimale Belichtung und natürliche Farben",
    },
    {
      icon: Sparkles,
      title: "Himmel-Austausch & Retusche",
      description: "Störende Objekte entfernen, Himmel verbessern",
    },
    {
      icon: Shield,
      title: "100% DSGVO-konform",
      description: "Sichere Verarbeitung Ihrer Bilddaten",
    },
  ];

  const handleCTA = () => {
    window.open('https://app.spaceseller.de', '_blank');
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                    <Upload className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">Für Eigentümer & Makler</span>
                  </div>
                  
                  <h2 className="text-4xl font-bold mb-6">
                    Eigene Fotos?
                    <span className="block text-accent">Wir bearbeiten sie für Sie.</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground mb-8">
                    Laden Sie Ihre Immobilienfotos hoch und erhalten Sie professionell 
                    bearbeitete Bilder innerhalb von 48 Stunden – ohne Fotograf-Termin, 
                    100% online.
                  </p>

                  <Button size="xl" variant="cta" onClick={handleCTA}>
                    Bilder hochladen & 20% sparen
                  </Button>
                </div>

                {/* Right Features */}
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
