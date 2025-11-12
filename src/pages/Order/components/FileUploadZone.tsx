import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Upload, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadZoneProps {
  orderId: string;
  uploads: any[];
  onUploadComplete: (uploads: any[]) => void;
}

export const FileUploadZone = ({ orderId, uploads, onUploadComplete }: FileUploadZoneProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return;

    setUploading(true);
    const newUploads = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      setCurrentFile(file.name);
      setProgress(((i) / acceptedFiles.length) * 100);

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

    setProgress(100);
    setTimeout(() => {
      onUploadComplete([...uploads, ...newUploads]);
      setUploading(false);
      setProgress(0);
      setCurrentFile('');
      
      if (newUploads.length > 0) {
        toast({
          title: 'Upload erfolgreich',
          description: `${newUploads.length} ${newUploads.length === 1 ? 'Datei' : 'Dateien'} hochgeladen`
        });
      }
    }, 500);
  }, [user, orderId, uploads, toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif'],
      'image/x-canon-cr2': ['.cr2'],
      'image/x-nikon-nef': ['.nef']
    },
    maxSize: 52428800, // 50MB
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-accent bg-accent/10 scale-105' 
            : 'border-border hover:border-accent/50 hover:bg-accent/5'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-2">
            <Upload className="h-10 w-10 text-accent" />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <p className="text-2xl font-bold">
              {isDragActive ? 'Dateien hier ablegen...' : 'Bilder hochladen'}
            </p>
            <p className="text-muted-foreground">
              Ziehen Sie Dateien hierher oder klicken Sie zum Durchsuchen
            </p>
            <p className="text-sm text-muted-foreground">
              JPG, PNG, TIFF, RAW bis zu 50MB pro Datei
            </p>
          </div>

          {/* Upload Methods */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>Einzelbilder</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FolderOpen className="h-4 w-4" />
              <span>Ganzer Ordner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Wird hochgeladen...</p>
                <p className="text-sm text-muted-foreground truncate max-w-md">
                  {currentFile}
                </p>
              </div>
              <span className="text-2xl font-bold text-accent">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
