import { Package, Sparkles, Zap, Shield } from "lucide-react";
import { EmptyStateCard } from "@/components/shared";

const features = [
  {
    icon: Zap,
    title: "Schnelle Bearbeitung",
    description: "Professionelle Ergebnisse in 24-48 Stunden"
  },
  {
    icon: Shield,
    title: "Beste Qualität",
    description: "Erfahrene Experten für Ihre Immobilien"
  },
  {
    icon: Sparkles,
    title: "Einfacher Prozess",
    description: "Hochladen, bestellen, herunterladen - fertig!"
  }
];

export default function EmptyState() {
  return (
    <EmptyStateCard
      icon={Package}
      title="Bereit für Ihre erste Bestellung?"
      description="Transformieren Sie Ihre Immobilienfotos mit professioneller Bildbearbeitung, virtueller Einrichtung und mehr"
      features={features}
      ctaLabel="Erste Bestellung erstellen"
      ctaLink="/order"
      ctaIcon={Package}
      footerText="Keine Kreditkarte erforderlich • Sofort starten"
    />
  );
}
