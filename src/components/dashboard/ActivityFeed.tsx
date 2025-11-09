import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, Upload, Download, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { useEffect } from "react";

const activityIcons = {
  order_created: Package,
  status_changed: Clock,
  file_uploaded: Upload,
  deliverable_ready: Download,
  order_completed: CheckCircle
};

const activityColors = {
  order_created: "text-chart-1",
  status_changed: "text-chart-3",
  file_uploaded: "text-chart-2",
  deliverable_ready: "text-success",
  order_completed: "text-chart-5"
};

export default function ActivityFeed() {
  const { user } = useAuth();

  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ['activity-feed', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get recent orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at, updated_at')
        .eq('user_id', user.id)
        .neq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;

      // Get recent uploads
      const { data: uploads, error: uploadsError } = await supabase
        .from('order_uploads')
        .select('id, file_name, uploaded_at, order_id')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false })
        .limit(5);

      if (uploadsError) throw uploadsError;

      // Get recent deliverables
      const { data: deliverables, error: deliverablesError } = await supabase
        .from('order_deliverables')
        .select('id, file_name, delivered_at, order_id, orders!inner(user_id)')
        .eq('orders.user_id', user.id)
        .order('delivered_at', { ascending: false })
        .limit(5);

      if (deliverablesError) throw deliverablesError;

      const activities: any[] = [];

      orders?.forEach(order => {
        activities.push({
          id: `order-${order.id}`,
          type: 'order_created',
          title: `Bestellung ${order.order_number} erstellt`,
          timestamp: order.created_at,
          orderId: order.id
        });

        if (order.status === 'completed') {
          activities.push({
            id: `completed-${order.id}`,
            type: 'order_completed',
            title: `Bestellung ${order.order_number} abgeschlossen`,
            timestamp: order.updated_at,
            orderId: order.id
          });
        } else if (order.updated_at !== order.created_at) {
          activities.push({
            id: `status-${order.id}`,
            type: 'status_changed',
            title: `Status von ${order.order_number} geändert`,
            timestamp: order.updated_at,
            orderId: order.id
          });
        }
      });

      uploads?.forEach(upload => {
        activities.push({
          id: `upload-${upload.id}`,
          type: 'file_uploaded',
          title: `Datei hochgeladen: ${upload.file_name}`,
          timestamp: upload.uploaded_at,
          orderId: upload.order_id
        });
      });

      deliverables?.forEach(deliverable => {
        activities.push({
          id: `deliverable-${deliverable.id}`,
          type: 'deliverable_ready',
          title: `Lieferung bereit: ${deliverable.file_name}`,
          timestamp: deliverable.delivered_at,
          orderId: deliverable.order_id
        });
      });

      return activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 15);
    },
    enabled: !!user
  });

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('activity-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => refetch()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_uploads',
          filter: `user_id=eq.${user.id}`
        },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  if (isLoading) {
    return <Card className="p-6 h-96 animate-pulse bg-muted" />;
  }

  return (
    <Card className="p-6 h-[500px] flex flex-col">
      <h2 className="text-xl font-semibold text-foreground mb-4">Aktivitäten</h2>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {activities?.map((activity, index) => {
            const Icon = activityIcons[activity.type as keyof typeof activityIcons] || FileText;
            const color = activityColors[activity.type as keyof typeof activityColors];
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div className={`p-2 rounded-lg bg-muted ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { 
                      addSuffix: true,
                      locale: de 
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })}
          {(!activities || activities.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Noch keine Aktivitäten
            </p>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
