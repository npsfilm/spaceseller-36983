import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { de } from "date-fns/locale";

export default function OrdersOverTimeChart() {
  const { user } = useAuth();

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['orders-over-time', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: orders, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .eq('user_id', user.id)
        .neq('status', 'draft')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by month
      const monthlyData = new Map();
      
      // Initialize last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthKey = format(startOfMonth(date), 'yyyy-MM');
        monthlyData.set(monthKey, {
          month: format(date, 'MMM yyyy', { locale: de }),
          orders: 0,
          revenue: 0
        });
      }

      // Aggregate orders
      orders?.forEach(order => {
        const monthKey = format(new Date(order.created_at), 'yyyy-MM');
        if (monthlyData.has(monthKey)) {
          const current = monthlyData.get(monthKey);
          current.orders += 1;
          current.revenue += Number(order.total_amount);
        }
      });

      return Array.from(monthlyData.values());
    },
    enabled: !!user
  });

  if (isLoading) {
    return <Card className="p-6 h-80 animate-pulse bg-muted" />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Bestellungen im Zeitverlauf</h2>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number) => [`${value} Bestellungen`, 'Anzahl']}
          />
          <Area 
            type="monotone" 
            dataKey="orders" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorOrders)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
