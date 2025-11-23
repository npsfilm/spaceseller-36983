import { PlusCircle, Package, Upload, MessageCircle } from "lucide-react";
import { QuickActionCard } from "./QuickActionCard";

const actions = [
  {
    label: "Neue Bestellung",
    icon: PlusCircle,
    href: "/order",
    gradient: "from-accent to-accent-glow"
  },
  {
    label: "Meine Bestellungen",
    icon: Package,
    href: "/my-orders",
    gradient: "from-chart-1 to-chart-2"
  },
  {
    label: "Dateien hochladen",
    icon: Upload,
    href: "/order",
    gradient: "from-chart-3 to-chart-4"
  },
  {
    label: "Support kontaktieren",
    icon: MessageCircle,
    href: "mailto:support@beispiel.de",
    gradient: "from-chart-4 to-chart-5"
  }
];

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-4">
      {actions.map((action, index) => (
        <QuickActionCard
          key={action.label}
          label={action.label}
          icon={action.icon}
          href={action.href}
          gradient={action.gradient}
          index={index}
        />
      ))}
    </div>
  );
}
