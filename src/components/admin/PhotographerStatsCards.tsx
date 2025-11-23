import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, TrendingUp, CheckCircle } from 'lucide-react';
import { type Photographer } from '@/lib/services/PhotographerService';

interface PhotographerStatsCardsProps {
  photographers: Photographer[];
}

export const PhotographerStatsCards = ({ photographers }: PhotographerStatsCardsProps) => {
  const totalAssignments = photographers.reduce((sum, p) => sum + p.total_assignments, 0);
  const totalCompleted = photographers.reduce((sum, p) => sum + p.completed, 0);
  const avgAcceptanceRate = photographers.length > 0
    ? Math.round(photographers.reduce((sum, p) => sum + p.acceptance_rate, 0) / photographers.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktive Fotografen</CardTitle>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{photographers.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gesamt Aufträge</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssignments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompleted}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ø Annahmequote</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgAcceptanceRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
};
