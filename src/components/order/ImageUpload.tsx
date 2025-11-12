import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  orderId: string;
  onUploadComplete: (uploads: any[]) => void;
}

export const ImageUpload = ({ orderId, onUploadComplete }: ImageUploadProps) => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;

    setUploading(true);
    const newUploads = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      setProgress(((i + 1) / acceptedFiles.length) * 100);

      try {
        // SERVER-SIDE VALIDATION FIRST
        const { data: validationResult, error: validationError } = await supabase.functions.invoke(
          'validate-file-upload',
          {
            body: {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type
            }
          }
        );

        if (validationError || !validationResult?.valid) {
          toast({
            title: 'Datei abgelehnt',
            description: validationResult?.errors?.join(', ') || 'Datei entspricht nicht den Sicherheitsanforderungen',
            variant: 'destructive'
          });
          continue;
        }

        // Proceed with upload only if validation passed
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${orderId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('order-uploads')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: insertData, error: insertError } = await supabase
          .from('order_uploads')
          .insert({
            order_id: orderId,
            user_id: user.id,
            file_path: fileName,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const { data: { publicUrl } } = supabase.storage
          .from('order-uploads')
          .getPublicUrl(fileName);

        newUploads.push({ ...insertData, publicUrl });
      } catch (error: any) {
        toast({
          title: 'Upload fehlgeschlagen',
          description: `Fehler beim Hochladen von ${file.name}`,
          variant: 'destructive'
        });
      }
    }

    setUploads(prev => [...prev, ...newUploads]);
    onUploadComplete([...uploads, ...newUploads]);
    setUploading(false);
    setProgress(0);
  }, [user, orderId, uploads, toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif']
    },
    maxSize: 52428800 // 50MB
  });

  const removeUpload = async (uploadId: string, filePath: string) => {
    try {
      await supabase.storage.from('order-uploads').remove([filePath]);
      await supabase.from('order_uploads').delete().eq('id', uploadId);
      
      const updated = uploads.filter(u => u.id !== uploadId);
      setUploads(updated);
      onUploadComplete(updated);
    } catch (error) {
      toast({
        title: 'Fehler beim Löschen',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-semibold mb-2">
          {isDragActive ? 'Dateien hier ablegen...' : 'Bilder hochladen'}
        </p>
        <p className="text-sm text-muted-foreground">
          Ziehen Sie Dateien hierher oder klicken Sie zum Durchsuchen<br />
          JPG, PNG, TIFF bis zu 50MB
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Wird hochgeladen...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {uploads.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <ImageIcon className="w-full h-full p-8 text-muted-foreground" />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeUpload(upload.id, upload.file_path)}
              >
                <X className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {upload.file_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
