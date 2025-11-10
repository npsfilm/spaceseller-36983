import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload as UploadIcon } from 'lucide-react';
import { FileUploadZone } from '../components/FileUploadZone';
import { ImageGallery } from '../components/ImageGallery';

interface FileUploadStepProps {
  orderId: string;
  uploads: any[];
  onUpdateUploads: (uploads: any[]) => void;
  onNext: () => void;
  onBack: () => void;
  hasEditingServices: boolean;
}

export const FileUploadStep = ({
  orderId,
  uploads,
  onUpdateUploads,
  onNext,
  onBack,
  hasEditingServices
}: FileUploadStepProps) => {
  const canProceed = !hasEditingServices || uploads.length > 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
          <UploadIcon className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Bilder hochladen</h1>
        <p className="text-lg text-muted-foreground">
          {hasEditingServices 
            ? 'Laden Sie Ihre Bilder für die Bearbeitung hoch' 
            : 'Upload ist optional für reine Fotografie-Services'}
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FileUploadZone
          orderId={orderId}
          uploads={uploads}
          onUploadComplete={onUpdateUploads}
        />
      </motion.div>

      {/* Image Gallery */}
      {uploads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ImageGallery
            uploads={uploads}
            onRemove={(uploadId, filePath) => {
              const updated = uploads.filter(u => u.id !== uploadId);
              onUpdateUploads(updated);
            }}
          />
        </motion.div>
      )}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-accent/10 border border-accent/20 rounded-xl p-6"
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-accent">💡</span>
          Tipps für beste Ergebnisse
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Hohe Auflösung für bessere Bearbeitungsqualität</li>
          <li>• Gute Beleuchtung erleichtert die Nachbearbeitung</li>
          <li>• Mehrere Perspektiven pro Raum empfohlen</li>
          <li>• RAW-Format wird unterstützt (TIFF, CR2, NEF, etc.)</li>
        </ul>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="gap-2"
        >
          Weiter zur Prüfung
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
