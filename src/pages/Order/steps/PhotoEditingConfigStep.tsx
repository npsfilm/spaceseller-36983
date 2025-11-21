import { useState } from 'react';
import { Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// PhotoEditingConfigStep doesn't need external props currently
// All state is managed internally

interface EditingOption {
  id: string;
  name: string;
  description: string;
  pricePerImage: number;
  icon: string;
}

const EDITING_OPTIONS: EditingOption[] = [
  {
    id: 'retouching',
    name: 'Bildretusche',
    description: 'Professionelle Optimierung von Helligkeit, Kontrast und Farben',
    pricePerImage: 3,
    icon: '✨'
  },
  {
    id: 'object_removal',
    name: 'Objektentfernung',
    description: 'Entfernung störender Objekte aus Ihren Bildern',
    pricePerImage: 8,
    icon: '🎯'
  },
  {
    id: 'sky_replacement',
    name: 'Himmel-Austausch',
    description: 'Ersetzen des Himmels für perfekte Außenaufnahmen',
    pricePerImage: 5,
    icon: '☀️'
  },
  {
    id: 'hdr_merge',
    name: 'HDR-Verschmelzung',
    description: 'Zusammenführung mehrerer Belichtungen für optimale Details',
    pricePerImage: 6,
    icon: '🌈'
  },
  {
    id: 'color_correction',
    name: 'Farbkorrektur',
    description: 'Professionelle Farbanpassung und Weißabgleich',
    pricePerImage: 4,
    icon: '🎨'
  },
  {
    id: 'perspective',
    name: 'Perspektivkorrektur',
    description: 'Korrektur verzerrter Linien und Perspektiven',
    pricePerImage: 5,
    icon: '📐'
  }
];

export const PhotoEditingConfigStep = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleFileUpload = (files: FileList) => {
    // Simulate file upload - in real implementation, this would upload to Supabase
    setUploadedImageCount(prev => prev + files.length);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const totalPerImage = selectedOptions.reduce((sum, id) => {
    const option = EDITING_OPTIONS.find(o => o.id === id);
    return sum + (option?.pricePerImage || 0);
  }, 0);

  const totalPrice = totalPerImage * uploadedImageCount;

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold">Laden Sie Ihre Bilder hoch</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Wählen Sie die gewünschten Bearbeitungen für Ihre Immobilienfotos
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedImageCount === 0 ? (
              <>
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Bilder hochladen
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ziehen Sie Ihre Bilder hierher oder klicken Sie zum Auswählen
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/jpeg,image/png,image/raw,image/tiff';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFileUpload(files);
                    };
                    input.click();
                  }}
                >
                  Dateien auswählen
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  JPG, PNG, RAW, TIFF – max. 50MB pro Datei
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">
                  {uploadedImageCount} Bilder hochgeladen
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/jpeg,image/png,image/raw,image/tiff';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFileUpload(files);
                    };
                    input.click();
                  }}
                  className="mt-4"
                >
                  Weitere Bilder hinzufügen
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Editing Options */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Bearbeitungsoptionen wählen</h3>
          <p className="text-muted-foreground">
            Wählen Sie die gewünschten Bearbeitungen für Ihre Bilder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDITING_OPTIONS.map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedOptions.includes(option.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => handleOptionToggle(option.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{option.icon}</span>
                      <h4 className="font-semibold">{option.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {option.pricePerImage}€ pro Bild
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      {uploadedImageCount > 0 && selectedOptions.length > 0 && (
        <Card className="max-w-md mx-auto sticky bottom-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Zusammenfassung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Anzahl Bilder</span>
              <span className="font-semibold">{uploadedImageCount}</span>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium">Gewählte Bearbeitungen:</p>
              {selectedOptions.map(id => {
                const option = EDITING_OPTIONS.find(o => o.id === id);
                return (
                  <div key={id} className="flex justify-between text-sm pl-2">
                    <span>{option?.name}</span>
                    <span className="text-muted-foreground">{option?.pricePerImage}€/Bild</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-sm pt-2 border-t">
              <span>Pro Bild</span>
              <span className="font-semibold">{totalPerImage}€</span>
            </div>

            <div className="pt-3 border-t flex justify-between font-bold text-lg">
              <span>Gesamt</span>
              <span className="text-primary">{totalPrice}€</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
