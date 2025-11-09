import { Shield, CreditCard, Zap } from "lucide-react";

export const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      text: "SSL-verschlüsselt",
    },
    {
      icon: CreditCard,
      text: "Keine Vorauszahlung",
    },
    {
      icon: Zap,
      text: "24h Express-Lieferung",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          <badge.icon className="w-4 h-4 text-accent" />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
};
