import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetUploadZoneProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  label: string;
  hint?: string;
  folder?: string;
}

export const AssetUploadZone = ({
  onUploadComplete,
  currentUrl,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
  maxSizeMB = 2,
  label,
  hint,
  folder = 'general'
}: AssetUploadZoneProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      onUploadComplete(publicUrl);
      setPreview(publicUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload fehlgeschlagen';
      setError(message);
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
    }
  }, [folder, onUploadComplete, currentUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setError(`Datei zu groß. Maximum: ${maxSizeMB}MB`);
      } else {
        setError('Ungültiger Dateityp');
      }
    }
  });

  const handleRemove = async () => {
    if (preview && preview.includes('site-assets')) {
      try {
        // Extract file path from URL
        const url = new URL(preview);
        const pathParts = url.pathname.split('/site-assets/');
        if (pathParts[1]) {
          await supabase.storage
            .from('site-assets')
            .remove([decodeURIComponent(pathParts[1])]);
        }
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    setPreview(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block">
          <div className="border border-border rounded-lg p-2 bg-muted">
            <img
              src={preview}
              alt="Preview"
              className="max-h-20 max-w-48 object-contain"
              onError={() => setPreview(null)}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            error && "border-destructive"
          )}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Wird hochgeladen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {isDragActive ? 'Datei hier ablegen' : 'Klicken oder Datei hierher ziehen'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
