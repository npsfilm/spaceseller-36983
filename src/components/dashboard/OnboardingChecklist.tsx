import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Package, User, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  link: string;
}

export default function OnboardingChecklist() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user
  });

  const { data: orders } = useQuery({
    queryKey: ['user-orders-count', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('orders')
        .select('id, status')
        .eq('user_id', user.id)
        .neq('status', 'draft');
      return data || [];
    },
    enabled: !!user
  });

  const hasCompletedProfile = profile && profile.vorname && profile.nachname && profile.telefon;
  const hasCreatedOrder = orders && orders.length > 0;

  const checklist: ChecklistItem[] = [
    {
      id: "profile",
      title: "Profil vervollständigen",
      description: "Fügen Sie Ihre persönlichen Informationen hinzu",
      completed: !!hasCompletedProfile,
      icon: User,
      action: "Profil bearbeiten",
      link: "/settings"
    },
    {
      id: "order",
      title: "Erste Bestellung erstellen",
      description: "Wählen Sie einen Service und erstellen Sie Ihre erste Bestellung",
      completed: hasCreatedOrder,
      icon: Package,
      action: "Bestellung erstellen",
      link: "/order"
    },
    {
      id: "upload",
      title: "Dateien hochladen",
      description: "Laden Sie Ihre Fotos oder Pläne für die Bearbeitung hoch",
      completed: false,
      icon: Upload,
      action: "Dateien hochladen",
      link: "/order"
    }
  ];

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Willkommen! Lassen Sie uns beginnen
          </h2>
          <p className="text-sm text-muted-foreground">
            Vervollständigen Sie diese Schritte, um das Beste aus Ihrem Konto herauszuholen
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {completedCount} von {totalCount} abgeschlossen
            </span>
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-glow"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {checklist.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`
                  flex items-center gap-4 p-4 rounded-lg border transition-colors
                  ${item.completed 
                    ? 'bg-success/10 border-success/20' 
                    : 'bg-muted/50 border-border hover:bg-muted'
                  }
                `}>
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`
                      p-2 rounded-lg
                      ${item.completed ? 'bg-success/20' : 'bg-accent/20'}
                    `}>
                      <Icon className={`
                        w-5 h-5
                        ${item.completed ? 'text-success' : 'text-accent'}
                      `} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`
                      font-medium mb-1
                      ${item.completed ? 'text-success' : 'text-foreground'}
                    `}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {!item.completed && (
                    <Link to={item.link}>
                      <Button size="sm" variant="outline">
                        {item.action}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
