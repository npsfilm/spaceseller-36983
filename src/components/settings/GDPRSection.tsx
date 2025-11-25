import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, Mail, AlertTriangle } from 'lucide-react';

export const GDPRSection = () => {
  const [loading, setLoading] = useState(false);
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

  const handleRequestAccountDeletion = () => {
    const subject = encodeURIComponent('Kündigung der Zusammenarbeit');
    const body = encodeURIComponent(
      `Sehr geehrtes SpaceSeller Team,\n\n` +
      `hiermit möchte ich meine Zusammenarbeit mit SpaceSeller beenden und bitte um die Löschung meines Kontos.\n\n` +
      `Meine E-Mail-Adresse: ${user?.email || ''}\n\n` +
      `Mit freundlichen Grüßen`
    );
    
    window.location.href = `mailto:partner@spaceseller.de?subject=${subject}&body=${body}`;
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
          <Button 
            variant="destructive" 
            onClick={handleRequestAccountDeletion}
            disabled={loading}
          >
            <Mail className="h-4 w-4 mr-2" />
            Zusammenarbeit beenden
          </Button>
          <p className="text-sm text-muted-foreground">
            Sie werden zu Ihrem E-Mail-Client weitergeleitet, um eine Kündigungsanfrage an partner@spaceseller.de zu senden.
          </p>
        </div>
      </div>
    </div>
  );
};
