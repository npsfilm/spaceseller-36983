import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { OrderUpload } from '@/lib/services/OrderDetailService';

interface OrderUploadsSectionProps {
  uploads: OrderUpload[];
  onDownload: (filePath: string, fileName: string) => void;
}

export const OrderUploadsSection = ({ uploads, onDownload }: OrderUploadsSectionProps) => {
  if (uploads.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-3">Hochgeladene Dateien ({uploads.length})</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {uploads.map((upload) => (
          <div key={upload.id} className="flex justify-between items-center p-2 bg-muted rounded">
            <span className="text-sm truncate">{upload.file_name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(upload.file_path, upload.file_name)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
