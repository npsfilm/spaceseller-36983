import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageGalleryProps {
  uploads: any[];
  onRemove: (uploadId: string, filePath: string) => void;
}

export const ImageGallery = ({ uploads, onRemove }: ImageGalleryProps) => {
  const { toast } = useToast();

  const handleRemove = async (upload: any) => {
    try {
      await supabase.storage.from('order-uploads').remove([upload.file_path]);
      await supabase.from('order_uploads').delete().eq('id', upload.id);
      onRemove(upload.id, upload.file_path);
      
      toast({
        title: 'Datei gelöscht',
        description: 'Die Datei wurde erfolgreich entfernt'
      });
    } catch (error) {
      toast({
        title: 'Fehler beim Löschen',
        variant: 'destructive'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          Hochgeladene Bilder ({uploads.length})
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploads.map((upload, index) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <div className="aspect-square bg-muted rounded-xl overflow-hidden border-2 border-border group-hover:border-accent/50 transition-all">
              {/* Image Preview Placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(upload)}
                  className="shadow-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* File Info */}
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium truncate" title={upload.file_name}>
                {upload.file_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(upload.file_size)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
