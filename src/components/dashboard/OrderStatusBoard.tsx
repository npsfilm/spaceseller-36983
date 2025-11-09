import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, Truck, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const statusConfig = {
  draft: { label: "Entwurf", color: "bg-muted", icon: FileText },
  submitted: { label: "Eingereicht", color: "bg-chart-1", icon: Clock },
  in_progress: { label: "In Bearbeitung", color: "bg-chart-3", icon: Package },
  completed: { label: "Abgeschlossen", color: "bg-success", icon: CheckCircle },
  delivered: { label: "Geliefert", color: "bg-chart-5", icon: Truck }
};

export default function OrderStatusBoard() {
  const { user } = useAuth();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['order-status-board', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at, total_amount')
        .eq('user_id', user.id)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  const ordersByStatus = Object.keys(statusConfig).reduce((acc, status) => {
    if (status === 'draft') return acc;
    acc[status] = orders?.filter(o => o.status === status) || [];
    return acc;
  }, {} as Record<string, any[]>);

  if (isLoading) {
    return <Card className="p-6 h-96 animate-pulse bg-muted" />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Bestellstatus Übersicht</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(ordersByStatus).map(([status, statusOrders]) => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded ${config.color}/20`}>
                  <Icon className={`w-4 h-4 text-${config.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">{config.label}</h3>
                  <p className="text-xs text-muted-foreground">{statusOrders.length} Bestellungen</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {statusOrders.slice(0, 3).map((order) => (
                  <Link key={order.id} to="/my-orders">
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium text-foreground mb-1">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        €{Number(order.total_amount).toFixed(2)}
                      </p>
                    </motion.div>
                  </Link>
                ))}
                {statusOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Keine Bestellungen
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
