import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export default function ServiceDistributionChart() {
  const { user } = useAuth();

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['service-distribution', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          total_price,
          services(name, category),
          orders!inner(user_id)
        `)
        .eq('orders.user_id', user.id)
        .neq('orders.status', 'draft');

      if (error) throw error;

      // Aggregate by service
      const serviceMap = new Map();
      
      data?.forEach((item: any) => {
        const serviceName = item.services.name;
        if (serviceMap.has(serviceName)) {
          const current = serviceMap.get(serviceName);
          current.count += item.quantity;
          current.revenue += Number(item.total_price);
        } else {
          serviceMap.set(serviceName, {
            name: serviceName,
            count: item.quantity,
            revenue: Number(item.total_price)
          });
        }
      });

      return Array.from(serviceMap.values()).sort((a, b) => b.count - a.count);
    },
    enabled: !!user
  });

  if (isLoading) {
    return <Card className="p-6 h-80 animate-pulse bg-muted" />;
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-6 h-80 flex items-center justify-center">
        <p className="text-muted-foreground">Noch keine Daten verfügbar</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Service Verteilung</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value: number, name: string) => [
              `${value} Bestellungen`,
              name === 'count' ? 'Anzahl' : name
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
