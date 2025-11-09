import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusConfig = {
  draft: { label: "Entwurf", variant: "secondary" as const },
  submitted: { label: "Eingereicht", variant: "default" as const },
  in_progress: { label: "In Bearbeitung", variant: "default" as const },
  completed: { label: "Abgeschlossen", variant: "default" as const },
  delivered: { label: "Geliefert", variant: "default" as const }
};

export default function RecentOrdersTable() {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['recent-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          created_at,
          total_amount,
          order_items(
            id,
            services(name)
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return <Card className="p-6 h-96 animate-pulse bg-muted" />;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Letzte Bestellungen</h2>
        <Link to="/my-orders">
          <Button variant="ghost" size="sm">
            Alle anzeigen
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {orders && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bestellnummer</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), 'dd. MMM yyyy', { locale: de })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.order_items?.slice(0, 2).map((item: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item.services.name}
                        </Badge>
                      ))}
                      {order.order_items?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{order.order_items.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[order.status as keyof typeof statusConfig]?.variant}>
                      {statusConfig[order.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    €{Number(order.total_amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Noch keine Bestellungen</p>
          <Link to="/order">
            <Button variant="cta">
              Erste Bestellung erstellen
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
