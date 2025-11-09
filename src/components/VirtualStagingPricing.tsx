import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export const VirtualStagingPricing = () => {
  const pricingTiers = [
    {
      name: "Basic",
      price: "35€",
      subtitle: "pro Raum",
      features: [
        "1 Raum professionell möbliert",
        "1 Einrichtungsstil Ihrer Wahl",
        "Hochauflösende Dateien (4K)",
        "1 Revisionsrunde inklusive",
        "48h Lieferung",
        "Kommerzielle Nutzung",
      ],
      cta: "Jetzt starten",
    },
    {
      name: "Standard",
      price: "90€",
      subtitle: "3 Räume",
      popular: true,
      savings: "Spare 15€",
      pricePerRoom: "30€ pro Raum",
      features: [
        "3 Räume professionell möbliert",
        "Verschiedene Stile möglich",
        "Hochauflösende Dateien (4K)",
        "2 Revisionsrunden inklusive",
        "48h Lieferung",
        "Priority Support",
      ],
      cta: "Beliebteste Option",
    },
    {
      name: "Premium",
      price: "250€",
      subtitle: "gesamte Immobilie",
      badge: "Beste Value",
      pricePerRoom: "25€ pro Raum",
      features: [
        "Bis zu 10 Räume",
        "Unbegrenzte Stile",
        "Hochauflösende Dateien (4K)",
        "Unlimited Revisionen",
        "24h Express-Lieferung",
        "Dedicated Designer",
        "Virtueller Rundgang (optional)",
      ],
      cta: "Premium wählen",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Transparente Preise</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Wählen Sie das Paket, das zu Ihrem Projekt passt
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`p-8 relative ${
                tier.popular ? 'border-primary border-2 shadow-xl scale-105' : ''
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent">
                  Am beliebtesten
                </Badge>
              )}
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  {tier.badge}
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-primary">{tier.price}</span>
                </div>
                <p className="text-muted-foreground mb-2">{tier.subtitle}</p>
                {tier.savings && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                    {tier.savings}
                  </Badge>
                )}
                {tier.pricePerRoom && (
                  <p className="text-sm text-muted-foreground mt-2">{tier.pricePerRoom}</p>
                )}
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                asChild
                className="w-full"
                variant={tier.popular ? "default" : "outline"}
              >
                <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer">{tier.cta}</a>
              </Button>
            </Card>
          ))}
        </div>
        
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Zusätzliche Optionen</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div>Express 24h: <span className="font-semibold text-foreground">+50% Aufpreis</span></div>
            <div>Outdoor/Terrassen: <span className="font-semibold text-foreground">+10€ pro Raum</span></div>
            <div>Luxus-Möblierung: <span className="font-semibold text-foreground">+15€ pro Raum</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
