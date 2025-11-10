import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Package, Upload, Eye, Download, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

const statusProgress = {
  submitted: 25,
  in_progress: 60,
  completed: 90,
  delivered: 100
};

const statusLabels = {
  submitted: "Eingereicht",
  in_progress: "In Bearbeitung",
  completed: "Abgeschlossen",
  delivered: "Geliefert"
};

export default function ActiveOrdersSection() {
  const { user } = useAuth();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['active-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          created_at,
          delivery_deadline,
          total_amount,
          order_items (
            id,
            service_id,
            services (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['submitted', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('active-order-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
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

  if (isLoading) {
    return <Card className="p-6 h-96 animate-pulse bg-muted" />;
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Keine aktiven Bestellungen
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Starten Sie Ihre erste Bestellung und sehen Sie hier den Fortschritt
            </p>
          </div>
          <Link to="/order">
            <Button size="lg" className="bg-gradient-to-r from-accent to-accent-glow">
              <Package className="w-4 h-4 mr-2" />
              Neue Bestellung erstellen
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Aktive Bestellungen</h2>
        <Link to="/my-orders">
          <Button variant="ghost" size="sm">
            Alle anzeigen
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.map((order, index) => {
          const progress = statusProgress[order.status as keyof typeof statusProgress];
          const services = order.order_items?.map((item: any) => item.services?.name).filter(Boolean);
          const deliveryTime = order.delivery_deadline 
            ? formatDistanceToNow(new Date(order.delivery_deadline), { addSuffix: true, locale: de })
            : null;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {order.order_number}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {services?.slice(0, 2).join(", ")}
                        {services && services.length > 2 && ` +${services.length - 2} mehr`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        €{Number(order.total_amount).toFixed(2)}
                      </p>
                      {deliveryTime && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {deliveryTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link to="/my-orders" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Ansehen
                      </Button>
                    </Link>
                    <Link to="/order" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Hochladen
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
