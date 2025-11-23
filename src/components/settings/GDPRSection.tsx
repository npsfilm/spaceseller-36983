import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2, Shield, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface Consent {
  consent_type: 'marketing' | 'analytics' | 'third_party';
  granted: boolean;
}

export const GDPRSection = () => {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadConsents();
  }, [user]);

  const loadConsents = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_consents')
      .select('consent_type, granted')
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Fehler',
        description: 'Einwilligungen konnten nicht geladen werden',
        variant: 'destructive'
      });
      return;
    }

    setConsents((data as Consent[]) || []);
  };

  const handleConsentChange = async (consentType: string, granted: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_consents')
        .upsert({
          user_id: user.id,
          consent_type: consentType,
          granted,
          granted_at: granted ? new Date().toISOString() : null,
          revoked_at: !granted ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,consent_type'
        });

      if (error) throw error;

      setConsents(prev => {
        const existing = prev.find(c => c.consent_type === consentType);
        if (existing) {
          return prev.map(c => 
            c.consent_type === consentType ? { ...c, granted } : c
          );
        }
        return [...prev, { consent_type: consentType as any, granted }];
      });

      toast({
        title: 'Einwilligung aktualisiert',
        description: 'Ihre Einstellungen wurden gespeichert'
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Einwilligung konnte nicht aktualisiert werden',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { userId: user.id }
      });

      if (error) throw error;

      // Download as JSON file
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spaceseller-daten-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Daten exportiert',
        description: 'Ihre Daten wurden erfolgreich heruntergeladen'
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Daten konnten nicht exportiert werden',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== 'DELETE') return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { 
          userId: user.id,
          confirmation: 'DELETE'
        }
      });

      if (error) throw error;

      toast({
        title: 'Konto gelöscht',
        description: 'Ihr Konto wurde unwiderruflich gelöscht'
      });

      // Sign out and redirect
      await supabase.auth.signOut();
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Konto konnte nicht gelöscht werden',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getConsentValue = (type: string) => {
    return consents.find(c => c.consent_type === type)?.granted || false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Datenschutz & Einwilligungen
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="marketing" className="font-medium">Marketing-Kommunikation</Label>
              <p className="text-sm text-muted-foreground">
                Erhalten Sie Updates über neue Dienstleistungen und Angebote
              </p>
            </div>
            <Switch
              id="marketing"
              checked={getConsentValue('marketing')}
              onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="analytics" className="font-medium">Analyse & Statistiken</Label>
              <p className="text-sm text-muted-foreground">
                Helfen Sie uns, unsere Dienstleistungen zu verbessern
              </p>
            </div>
            <Switch
              id="analytics"
              checked={getConsentValue('analytics')}
              onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="third_party" className="font-medium">Drittanbieter-Integration</Label>
              <p className="text-sm text-muted-foreground">
                Erlauben Sie die Integration mit externen Diensten
              </p>
            </div>
            <Switch
              id="third_party"
              checked={getConsentValue('third_party')}
              onCheckedChange={(checked) => handleConsentChange('third_party', checked)}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Ihre Daten</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Daten exportieren (DSGVO)
          </Button>
          <p className="text-sm text-muted-foreground">
            Laden Sie alle Ihre gespeicherten Daten als JSON-Datei herunter
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Gefahrenzone
        </h3>
        <div className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Konto dauerhaft löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Diese Aktion kann nicht rückgängig gemacht werden. Dies wird Ihr Konto 
                    dauerhaft löschen und alle Ihre Daten von unseren Servern entfernen.
                  </p>
                  <p className="font-medium">
                    Bitte geben Sie <span className="text-destructive font-bold">DELETE</span> ein, um zu bestätigen:
                  </p>
                  <Input
                    placeholder="DELETE"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="font-mono"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                  Abbrechen
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== 'DELETE' || loading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Konto unwiderruflich löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-sm text-muted-foreground">
            Nach der Löschung werden Ihre persönlichen Daten anonymisiert, 
            aber Bestellhistorien bleiben für rechtliche Zwecke (7 Jahre) erhalten.
          </p>
        </div>
      </div>
    </div>
  );
};
