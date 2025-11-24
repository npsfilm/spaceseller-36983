import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileCheck, Loader2 } from 'lucide-react';
import { orderFileService } from '@/lib/services/OrderFileService';
import { useToast } from '@/hooks/use-toast';

interface DeliverableDownloadProps {
  deliverables: Array<{
    id: string;
    file_name: string;
    file_path: string;
    delivered_at: string | null;
  }>;
  orderId: string;
}

export const DeliverableDownload = ({ deliverables, orderId }: DeliverableDownloadProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      await orderFileService.downloadAllDeliverables(orderId);
      toast({
        title: 'Download gestartet',
        description: `${deliverables.length} Dateien werden heruntergeladen`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download fehlgeschlagen',
        description: 'Die Dateien konnten nicht heruntergeladen werden',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSingle = async (filePath: string, fileName: string) => {
    try {
      await orderFileService.downloadFile(filePath, fileName);
      toast({
        title: 'Download gestartet',
        description: fileName,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: 'Download fehlgeschlagen',
        description: 'Die Datei konnte nicht heruntergeladen werden',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {deliverables.length} {deliverables.length === 1 ? 'Datei' : 'Dateien'} verfügbar
              </p>
              <p className="text-sm text-muted-foreground">
                Geliefert am {deliverables[0]?.delivered_at && new Date(deliverables[0].delivered_at).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
          <Button
            onClick={handleDownloadAll}
            disabled={downloading}
            size="lg"
            className="font-semibold"
          >
            {downloading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Wird heruntergeladen...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Alle herunterladen
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* File List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {deliverables.map((deliverable) => (
          <Card key={deliverable.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-medium truncate" title={deliverable.file_name}>
                  {deliverable.file_name}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadSingle(deliverable.file_path, deliverable.file_name)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
