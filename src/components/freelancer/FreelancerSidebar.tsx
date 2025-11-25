import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Settings, 
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePhotographerAssignments, useAssignmentStats } from '@/lib/hooks/useAssignments';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  to: string;
  icon: any;
  label: string;
  badge?: number;
}

export const FreelancerSidebar = () => {
  const { data: assignments = [] } = usePhotographerAssignments();
  const stats = useAssignmentStats(assignments);

  const mainNavItems: NavItem[] = [
    {
      to: '/freelancer-dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/settings',
      icon: Settings,
      label: 'Einstellungen',
    },
  ];

  const statsItems = [
    {
      icon: Clock,
      label: 'Ausstehend',
      value: stats.pending,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: CheckCircle2,
      label: 'Angenommen',
      value: stats.accepted,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Calendar,
      label: 'Abgeschlossen',
      value: stats.completed,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: XCircle,
      label: 'Abgelehnt',
      value: stats.declined,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <aside 
      className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0"
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold">Fotograf Portal</h2>
        <p className="text-sm text-muted-foreground">Ihre Aufträge</p>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-3">
            AUFTRAGS-ÜBERSICHT
          </h3>
          <div className="space-y-2">
            {statsItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${item.bgColor}`}
                >
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm flex-1">{item.label}</span>
                  <Badge
                    variant="outline"
                    className={`${item.color} border-current`}
                  >
                    {item.value}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="p-4">
          <div className="px-3 py-2 bg-muted/50 rounded-lg">
            <p className="text-xs font-semibold mb-1">Gesamt-Statistik</p>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gesamt:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quote:</span>
                <span className="font-medium">
                  {stats.total > 0 
                    ? Math.round((stats.accepted / (stats.accepted + stats.declined)) * 100) || 0
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
