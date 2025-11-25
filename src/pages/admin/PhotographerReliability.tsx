import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  photographerReliabilityService, 
  type PhotographerReliabilityMetrics 
} from '@/lib/services/PhotographerReliabilityService';

export default function PhotographerReliability() {
  const [metrics, setMetrics] = useState<PhotographerReliabilityMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await photographerReliabilityService.fetchReliabilityMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching reliability metrics:', error);
      toast({
        title: 'Fehler',
        description: 'Zuverlässigkeitsmetriken konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const problematicPhotographers = metrics.filter(m => m.reliability_score < 60);
  const averageReliability = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.reliability_score, 0) / metrics.length
    : 0;

  return (
    <AdminLayout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Fotografen-Zuverlässigkeitsbericht - spaceseller</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Fotografen-Zuverlässigkeitsbericht</h1>
            <p className="text-muted-foreground mt-2">
              Überwachen Sie Akzeptanz-, Timeout- und Abschlussraten
            </p>
          </div>
          <Button onClick={fetchMetrics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durchschnittliche Zuverlässigkeit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageReliability.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Über alle Fotografen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problematische Fotografen</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{problematicPhotographers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Zuverlässigkeit {'<'} 60%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Fotografen</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mit Auftragsverlauf
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Warning for problematic photographers */}
        {problematicPhotographers.length > 0 && (
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Achtung: Unzuverlässige Fotografen erkannt
              </CardTitle>
              <CardDescription className="text-orange-700 dark:text-orange-500">
                {problematicPhotographers.length} Fotograf(en) haben eine Zuverlässigkeitsbewertung unter 60%.
                Erwägen Sie, diese Fotografen zu überprüfen oder alternative Fotografen für kritische Aufträge zu bevorzugen.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detaillierte Zuverlässigkeitsmetriken</CardTitle>
            <CardDescription>
              Sortiert nach Zuverlässigkeitsbewertung (niedrigste zuerst)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fotograf</TableHead>
                    <TableHead className="text-center">Gesamt</TableHead>
                    <TableHead className="text-center">Angenommen</TableHead>
                    <TableHead className="text-center">Abgelehnt (manuell)</TableHead>
                    <TableHead className="text-center">Auto-Ablehnung (Timeout)</TableHead>
                    <TableHead className="text-center">Abgeschlossen</TableHead>
                    <TableHead className="text-center">Akzeptanzrate</TableHead>
                    <TableHead className="text-center">Timeout-Rate</TableHead>
                    <TableHead className="text-center">Abschlussrate</TableHead>
                    <TableHead className="text-center">Zuverlässigkeit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        Keine Daten verfügbar
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.map((metric) => (
                      <TableRow 
                        key={metric.photographer_id}
                        className={metric.reliability_score < 40 ? 'bg-red-50/50 dark:bg-red-950/10' : ''}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{metric.photographer_name}</div>
                            <div className="text-sm text-muted-foreground">{metric.photographer_email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">{metric.total_assignments}</TableCell>
                        <TableCell className="text-center">{metric.accepted}</TableCell>
                        <TableCell className="text-center">{metric.manually_declined}</TableCell>
                        <TableCell className="text-center">
                          {metric.auto_declined > 0 ? (
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {metric.auto_declined}
                            </span>
                          ) : (
                            metric.auto_declined
                          )}
                        </TableCell>
                        <TableCell className="text-center">{metric.completed}</TableCell>
                        <TableCell className="text-center">
                          <span className={metric.acceptance_rate < 60 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                            {metric.acceptance_rate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={metric.timeout_rate > 20 ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}>
                            {metric.timeout_rate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={metric.completion_rate < 80 ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}>
                            {metric.completion_rate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={photographerReliabilityService.getReliabilityBadgeVariant(metric.reliability_score)}
                            className="font-semibold"
                          >
                            {metric.reliability_score.toFixed(0)}%
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {photographerReliabilityService.getReliabilityLabel(metric.reliability_score)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Methodology Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Berechnungsmethodik</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Zuverlässigkeitsbewertung</strong> wird berechnet als gewichteter Durchschnitt:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>40% Akzeptanzrate (Angenommen / Gesamt)</li>
              <li>40% Abschlussrate (Abgeschlossen / Angenommen)</li>
              <li>20% Inverse Timeout-Rate (100% - Timeout-Rate)</li>
            </ul>
            <p className="pt-2">
              <strong>Kategorien:</strong> Sehr zuverlässig (≥80%), Zuverlässig (≥60%), Mäßig zuverlässig (≥40%), Unzuverlässig ({'<'}40%)
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
