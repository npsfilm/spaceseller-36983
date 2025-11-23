import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity, Download, Trash2, Key, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface SecurityEvent {
  id: string;
  event_type: string;
  created_at: string;
  user_id: string | null;
  ip_address: string | null;
  metadata?: Record<string, unknown>;
}

interface RateLimitEvent {
  id: string;
  ip_address: string;
  endpoint: string;
  request_count: number;
  created_at: string;
}

interface PasswordResetEvent {
  id: string;
  user_id: string;
  created_at: string;
  used: boolean;
  expires_at: string;
}

export default function SecurityMonitor() {
  const [rateLimitEvents, setRateLimitEvents] = useState<RateLimitEvent[]>([]);
  const [passwordResets, setPasswordResets] = useState<PasswordResetEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRateLimits: 0,
    activeResetTokens: 0,
    todayExports: 0,
    todayDeletions: 0,
  });

  useEffect(() => {
    fetchSecurityData();
    
    // Set up real-time subscription for rate limits
    const rateLimitChannel = supabase
      .channel('rate_limit_logs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rate_limit_logs' }, () => {
        fetchSecurityData();
      })
      .subscribe();

    return () => {
      rateLimitChannel.unsubscribe();
    };
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);

      // Fetch rate limit violations (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: rateLimits, error: rateLimitError } = await supabase
        .from('rate_limit_logs')
        .select('*')
        .gte('created_at', oneDayAgo)
        .order('created_at', { ascending: false })
        .limit(50);

      if (rateLimitError) throw rateLimitError;

      // Fetch password reset tokens (last 24 hours)
      const { data: resets, error: resetsError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .gte('created_at', oneDayAgo)
        .order('created_at', { ascending: false })
        .limit(50);

      if (resetsError) throw resetsError;

      setRateLimitEvents(rateLimits || []);
      setPasswordResets(resets || []);

      // Calculate stats
      setStats({
        totalRateLimits: rateLimits?.length || 0,
        activeResetTokens: resets?.filter(r => !r.used && new Date(r.expires_at) > new Date()).length || 0,
        todayExports: 0, // Would need to query edge function logs
        todayDeletions: 0, // Would need to query edge function logs
      });
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'rate_limit':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'password_reset':
        return <Key className="h-5 w-5 text-warning" />;
      case 'data_export':
        return <Download className="h-5 w-5 text-primary" />;
      case 'account_deletion':
        return <Trash2 className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss', { locale: de });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Sicherheitsüberwachung
          </h1>
          <p className="text-muted-foreground mt-2">
            Überwachen Sie Sicherheitsereignisse und potenzielle Bedrohungen
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit Ereignisse</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalRateLimits}</div>
                <p className="text-xs text-muted-foreground">Letzte 24 Stunden</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Reset-Tokens</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeResetTokens}</div>
                <p className="text-xs text-muted-foreground">Nicht verwendet</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Datenexporte</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.todayExports}</div>
                <p className="text-xs text-muted-foreground">Heute</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konto-Löschungen</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.todayDeletions}</div>
                <p className="text-xs text-muted-foreground">Heute</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Events Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rate Limit Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Rate Limit Ereignisse
            </CardTitle>
            <CardDescription>
              Verdächtige Anfragen und blockierte IPs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : rateLimitEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Keine Rate Limit Ereignisse in den letzten 24 Stunden</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rateLimitEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive">Rate Limit</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(event.created_at)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p><strong>IP:</strong> {event.ip_address}</p>
                        <p><strong>Endpoint:</strong> {event.endpoint}</p>
                        <p><strong>Anfragen:</strong> {event.request_count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Password Reset Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-warning" />
              Passwort-Zurücksetzungen
            </CardTitle>
            <CardDescription>
              Aktive und verwendete Reset-Tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : passwordResets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Keine Passwort-Zurücksetzungen in den letzten 24 Stunden</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {passwordResets.map((reset) => {
                    const isExpired = new Date(reset.expires_at) < new Date();
                    const isActive = !reset.used && !isExpired;

                    return (
                      <div key={reset.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={isActive ? 'default' : reset.used ? 'secondary' : 'destructive'}>
                            {isActive ? 'Aktiv' : reset.used ? 'Verwendet' : 'Abgelaufen'}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(reset.created_at)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <p><strong>User ID:</strong> {reset.user_id.slice(0, 8)}...</p>
                          <p><strong>Läuft ab:</strong> {formatTimestamp(reset.expires_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
