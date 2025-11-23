import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';
import { orderDetailService, type OrderDeliverable } from '@/lib/services/OrderDetailService';
import { useToast } from '@/hooks/use-toast';

interface DeliverableUploadSectionProps {
  orderId: string;
  orderNumber: string;
  deliverables: OrderDeliverable[];
  onUploadComplete: () => void;
  onDownload: (filePath: string, fileName: string) => void;
}

export const DeliverableUploadSection = ({
  orderId,
  orderNumber,
  deliverables,
  onUploadComplete,
  onDownload,
}: DeliverableUploadSectionProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);

    try {
      for (const file of acceptedFiles) {
        await orderDetailService.uploadDeliverable(file, orderId, orderNumber);
      }

      toast({
        title: 'Dateien hochgeladen',
        description: `${acceptedFiles.length} Datei(en) erfolgreich hochgeladen`,
      });

      onUploadComplete();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Fehler',
        description: 'Dateien konnten nicht hochgeladen werden',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div>
      <h3 className="font-semibold mb-3">Lieferdateien hochladen</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        {uploading ? (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-sm text-muted-foreground">Dateien hier ablegen...</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Dateien hierher ziehen oder klicken zum Auswählen
            </p>
            <p className="text-xs text-muted-foreground">
              Mehrere Dateien werden unterstützt
            </p>
          </div>
        )}
      </div>

      {deliverables.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2">Hochgeladene Lieferdateien</Label>
          <div className="space-y-2">
            {deliverables.map((deliverable) => (
              <div key={deliverable.id} className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="text-sm truncate">{deliverable.file_name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(deliverable.file_path, deliverable.file_name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
