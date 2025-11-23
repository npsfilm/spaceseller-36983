import { useState, useMemo, useCallback } from 'react';
import { Sparkles, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ConfigurationHeader, PricingSummaryPanel, ConfigurationCard, type LineItem } from '../components/shared';
import { photoEditingPricingService } from '@/lib/services/CategoryPricingService';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EditingOption {
  id: string;
  name: string;
  description: string;
  pricePerPhoto: number;
  popular?: boolean;
}

const EDITING_OPTIONS: EditingOption[] = [
  {
    id: 'color-correction',
    name: 'Farbkorrektur',
    description: 'Professionelle Farbabstimmung und Belichtungsoptimierung',
    pricePerPhoto: 2.50,
    popular: true
  },
  {
    id: 'object-removal',
    name: 'Objektentfernung',
    description: 'Entfernung störender Elemente aus Ihren Fotos',
    pricePerPhoto: 5.00,
    popular: true
  },
  {
    id: 'sky-replacement',
    name: 'Himmel-Austausch',
    description: 'Bewölkten Himmel durch strahlend blauen Himmel ersetzen',
    pricePerPhoto: 3.50
  },
  {
    id: 'hdr-enhancement',
    name: 'HDR-Verbesserung',
    description: 'Dynamikbereich erweitern für optimale Details',
    pricePerPhoto: 3.00
  },
  {
    id: 'perspective-correction',
    name: 'Perspektivkorrektur',
    description: 'Stürzende Linien und Verzerrungen korrigieren',
    pricePerPhoto: 2.00
  },
  {
    id: 'lawn-enhancement',
    name: 'Rasen-Auffrischung',
    description: 'Grünflächen auffrischen und intensivieren',
    pricePerPhoto: 2.50
  }
];

interface PhotoEditingConfigStepProps {
  onImagesUpload?: (files: File[]) => void;
  onOptionsChange?: (options: string[]) => void;
}

export const PhotoEditingConfigStep = ({
  onImagesUpload,
  onOptionsChange
}: PhotoEditingConfigStepProps = {}) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedImages(prev => [...prev, ...acceptedFiles]);
    onImagesUpload?.(acceptedFiles);
  }, [onImagesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tif', '.tiff'],
      'image/x-canon-cr2': ['.cr2'],
      'image/x-nikon-nef': ['.nef']
    },
    maxSize: 52428800, // 50MB
    multiple: true
  });

  const handleRemoveImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleOptionToggle = useCallback((optionId: string) => {
    setSelectedOptions(prev => {
      const newOptions = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId];
      onOptionsChange?.(newOptions);
      return newOptions;
    });
  }, [onOptionsChange]);

  // Calculate pricing
  const photoCount = uploadedImages.length;
  const selectedOptionsData = EDITING_OPTIONS.filter(opt => 
    selectedOptions.includes(opt.id)
  );

  const pricingBreakdown = useMemo(() => {
    if (photoCount === 0 || selectedOptions.length === 0) return null;

    // Calculate total price per photo for all selected options
    const totalPricePerPhoto = selectedOptionsData.reduce(
      (sum, opt) => sum + opt.pricePerPhoto, 
      0
    );

    return photoEditingPricingService.calculateEditingCosts(
      photoCount,
      totalPricePerPhoto,
      []
    );
  }, [photoCount, selectedOptions, selectedOptionsData]);

  // Build line items for summary
  const summaryItems: LineItem[] = useMemo(() => {
    const items: LineItem[] = [];

    selectedOptionsData.forEach(opt => {
      items.push({
        id: opt.id,
        label: opt.name,
        price: opt.pricePerPhoto * photoCount,
        quantity: photoCount
      });
    });

    return items;
  }, [selectedOptionsData, photoCount]);

  const hasSelection = photoCount > 0 && selectedOptions.length > 0;

  return (
    <div className="space-y-8 py-8">
      <ConfigurationHeader
        icon={Sparkles}
        title="Professionelle Bildbearbeitung"
        description="Lassen Sie Ihre Fotos professionell aufwerten und optimieren"
      />

      {/* Image Upload Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Ihre Bilder hochladen</h3>
            <p className="text-sm text-muted-foreground">
              {photoCount > 0 
                ? `${photoCount} ${photoCount === 1 ? 'Bild' : 'Bilder'} hochgeladen`
                : 'Laden Sie die Bilder hoch, die bearbeitet werden sollen'
              }
            </p>
          </div>
          {photoCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {photoCount} {photoCount === 1 ? 'Foto' : 'Fotos'}
            </Badge>
          )}
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-primary bg-primary/10 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-2">
              <Upload className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-2">
              <p className="text-xl font-bold">
                {isDragActive ? 'Dateien hier ablegen...' : 'Bilder hochladen'}
              </p>
              <p className="text-muted-foreground text-sm">
                Ziehen Sie Dateien hierher oder klicken Sie zum Durchsuchen
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, TIFF, RAW bis zu 50MB pro Datei
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((file, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Bild entfernen"
                >
                  <X className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Editing Options Section */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Bearbeitungsoptionen wählen</h3>
          <p className="text-sm text-muted-foreground">
            Wählen Sie die gewünschten Bearbeitungen für Ihre Bilder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDITING_OPTIONS.map((option) => (
            <ConfigurationCard
              key={option.id}
              selected={selectedOptions.includes(option.id)}
              onClick={() => handleOptionToggle(option.id)}
              className="relative"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => handleOptionToggle(option.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor={option.id}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {option.name}
                    </Label>
                    {option.popular && (
                      <Badge variant="default" className="text-xs">
                        Beliebt
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-primary">
                      €{option.pricePerPhoto.toFixed(2)} pro Foto
                    </span>
                    {photoCount > 0 && selectedOptions.includes(option.id) && (
                      <span className="text-xs text-muted-foreground">
                        Gesamt: €{(option.pricePerPhoto * photoCount).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ConfigurationCard>
          ))}
        </div>
      </section>

      {/* Volume Discount Info */}
      {photoCount >= 10 && (
        <Card className="bg-primary/5 border-primary/20 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">
              Mengenrabatt aktiv! 
              {photoCount >= 50 && ' Sie sparen 30%'}
              {photoCount >= 25 && photoCount < 50 && ' Sie sparen 20%'}
              {photoCount >= 10 && photoCount < 25 && ' Sie sparen 10%'}
            </span>
          </div>
        </Card>
      )}

      {/* Pricing Summary */}
      {hasSelection && pricingBreakdown && (
        <PricingSummaryPanel
          items={summaryItems}
          subtotal={pricingBreakdown.subtotal}
          emptyMessage="Bitte laden Sie Bilder hoch und wählen Sie Bearbeitungsoptionen"
          className="max-w-md mx-auto"
        />
      )}

      {/* Empty State */}
      {!hasSelection && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {photoCount === 0 
              ? 'Bitte laden Sie zuerst Ihre Bilder hoch'
              : 'Bitte wählen Sie mindestens eine Bearbeitungsoption'
            }
          </p>
        </Card>
      )}
    </div>
  );
};
