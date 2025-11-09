import { Sofa, Bed, ChefHat, UtensilsCrossed, Laptop, Bath, Sun, Baby } from "lucide-react";
import { Card } from "@/components/ui/card";

export const VirtualStagingRooms = () => {
  const rooms = [
    {
      icon: Sofa,
      name: "Wohnzimmer",
      price: "ab 35€",
      popular: true,
    },
    {
      icon: Bed,
      name: "Schlafzimmer",
      price: "ab 35€",
    },
    {
      icon: ChefHat,
      name: "Küche",
      price: "ab 40€",
    },
    {
      icon: UtensilsCrossed,
      name: "Esszimmer",
      price: "ab 35€",
    },
    {
      icon: Laptop,
      name: "Arbeitszimmer",
      price: "ab 35€",
    },
    {
      icon: Bath,
      name: "Badezimmer",
      price: "ab 40€",
    },
    {
      icon: Sun,
      name: "Terrasse/Balkon",
      price: "ab 45€",
    },
    {
      icon: Baby,
      name: "Kinderzimmer",
      price: "ab 35€",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Welche Räume möblieren wir?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Von Wohnzimmer bis Terrasse – wir möblieren jeden Raum fotorealistisch
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room, index) => (
            <Card 
              key={index}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group cursor-pointer"
            >
              {room.popular && (
                <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
                  Beliebt
                </span>
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <room.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
              <p className="text-accent font-bold text-xl">{room.price}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
