import { Image, Users, Clock, Award, Shield, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/StatsCounter";

export const TrustQuality = () => {
  const trustBadges = [
    {
      icon: Image,
      value: <StatsCounter end={30000} suffix="+" />,
      label: "Bearbeitete Immobilienfotos",
    },
    {
      icon: Users,
      value: <StatsCounter end={150} suffix="+" />,
      label: "Aktive Fotografen",
    },
    {
      icon: Clock,
      value: "48h",
      label: "Lieferzeit garantiert",
    },
    {
      icon: Award,
      value: "100%",
      label: "White-Label",
    },
    {
      icon: Shield,
      value: "DSGVO",
      label: "Konform",
    },
    {
      icon: DollarSign,
      value: "100%",
      label: "Geld-zurück-Garantie",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Warum 150+ Fotografen bereits mit uns arbeiten
          </h2>
          <p className="text-lg text-muted-foreground">
            Vertrauen durch Qualität und Verlässlichkeit
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="text-center p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <badge.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-accent mb-1">
                {typeof badge.value === "string" ? badge.value : badge.value}
              </div>
              <p className="text-sm text-muted-foreground">{badge.label}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="text-lg px-8">
            Jetzt unverbindlich testen
          </Button>
        </div>
      </div>
    </section>
  );
};
