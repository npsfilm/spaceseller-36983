import { StatsCounter } from "@/components/StatsCounter";
import { Star, Users, Image, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ResultsStats = () => {
  const stats = [
    {
      icon: Star,
      value: 4.9,
      suffix: "/5",
      label: "Kundenbewertung",
      prefix: "",
    },
    {
      icon: Users,
      value: 500,
      suffix: "+",
      label: "Zufriedene Makler",
      prefix: "",
    },
    {
      icon: Image,
      value: 10000,
      suffix: "+",
      label: "Bearbeitete Bilder",
      prefix: "",
    },
    {
      icon: TrendingUp,
      value: 83,
      suffix: "%",
      label: "Mehr Klicks",
      prefix: "+",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            So verkaufen Makler mit spaceseller im Schnitt 12 Tage schneller
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Vertrauen Sie auf bewährte Ergebnisse
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                <StatsCounter
                  end={stat.value}
                  duration={2000}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Testimonial */}
        <Card className="p-8 md:p-10 max-w-3xl mx-auto bg-card/50 backdrop-blur">
          <div className="flex gap-1 mb-4 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>
          <blockquote className="text-lg md:text-xl text-center mb-6 leading-relaxed">
            "Ich lade die Bilder hoch und bekomme sie zwei Tage später perfekt zurück – 
            besser als Inhouse! Die Qualität ist konstant hoch und ich spare mir Stunden an Arbeit."
          </blockquote>
          <div className="text-center">
            <p className="font-semibold">Julia M.</p>
            <p className="text-sm text-muted-foreground">Immobilienmaklerin, München</p>
          </div>
        </Card>
      </div>
    </section>
  );
};
