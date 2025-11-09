import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import modernStyle from "@/assets/style-modern.jpg";
import scandinavianStyle from "@/assets/style-scandinavian.jpg";
import industrialStyle from "@/assets/style-industrial.jpg";
import classicStyle from "@/assets/style-classic.jpg";
import minimalistStyle from "@/assets/style-minimalist.jpg";
import bohemianStyle from "@/assets/style-bohemian.jpg";

export const VirtualStagingStyles = () => {
  const styles = [
    {
      name: "Modern",
      image: modernStyle,
      description: "Klare Linien, neutrale Farben, minimalistisch",
      popular: true,
    },
    {
      name: "Scandinavian",
      image: scandinavianStyle,
      description: "Helles Holz, Weiß, gemütliche Textilien",
    },
    {
      name: "Industrial",
      image: industrialStyle,
      description: "Sichtziegel, Metall, urbanes Loft-Feeling",
    },
    {
      name: "Classic",
      image: classicStyle,
      description: "Elegant, zeitlos, sophisticated",
    },
    {
      name: "Minimalist",
      image: minimalistStyle,
      description: "Weniger ist mehr, clean, geräumig",
    },
    {
      name: "Bohemian",
      image: bohemianStyle,
      description: "Warm, texturiert, einladend",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Wählen Sie Ihren Stil</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Verschiedene Einrichtungsstile für verschiedene Zielgruppen
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {styles.map((style, index) => (
            <Card 
              key={index}
              className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                {style.popular && (
                  <Badge className="absolute top-4 left-4 z-10 bg-accent">
                    Am beliebtesten
                  </Badge>
                )}
                <img 
                  src={style.image} 
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{style.name}</h3>
                <p className="text-muted-foreground">{style.description}</p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            Nicht sicher welcher Stil passt? 
            <span className="text-primary font-semibold ml-2">
              Wir beraten Sie kostenlos!
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
