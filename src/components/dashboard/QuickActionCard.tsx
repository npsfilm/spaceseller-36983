import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface QuickActionCardProps {
  label: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  index?: number;
}

export const QuickActionCard = ({ 
  label, 
  icon: Icon, 
  href, 
  gradient, 
  index = 0 
}: QuickActionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Link to={href}>
        <Button 
          size="lg" 
          className={`bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity`}
        >
          <Icon className="w-5 h-5 mr-2" />
          {label}
        </Button>
      </Link>
    </motion.div>
  );
};
