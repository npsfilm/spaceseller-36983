import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: Feature[];
  ctaLabel: string;
  ctaLink: string;
  ctaIcon?: LucideIcon;
  footerText?: string;
  className?: string;
}

export const EmptyStateCard = ({
  icon: MainIcon,
  title,
  description,
  features,
  ctaLabel,
  ctaLink,
  ctaIcon: CtaIcon,
  footerText,
  className
}: EmptyStateCardProps) => {
  return (
    <Card className={cn("p-8 lg:p-12", className)}>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-glow rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-6 rounded-full bg-gradient-to-r from-accent to-accent-glow">
              <MainIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Link to={ctaLink}>
            <Button size="lg" className="bg-gradient-to-r from-accent to-accent-glow text-white px-8">
              {CtaIcon && <CtaIcon className="w-5 h-5 mr-2" />}
              {ctaLabel}
            </Button>
          </Link>
          {footerText && (
            <p className="text-sm text-muted-foreground">
              {footerText}
            </p>
          )}
        </motion.div>
      </div>
    </Card>
  );
};
