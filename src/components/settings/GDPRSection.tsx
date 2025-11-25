import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
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

export const GDPRSection = () => {
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
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
