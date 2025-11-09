import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, Upload, Settings } from "lucide-react";
import { motion } from "framer-motion";

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
    label: "Einstellungen",
    icon: Settings,
    href: "/settings",
    gradient: "from-chart-3 to-chart-4"
  }
];

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Link to={action.href}>
            <Button 
              size="lg" 
              className={`bg-gradient-to-r ${action.gradient} text-white hover:opacity-90 transition-opacity`}
            >
              <action.icon className="w-5 h-5 mr-2" />
              {action.label}
            </Button>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
