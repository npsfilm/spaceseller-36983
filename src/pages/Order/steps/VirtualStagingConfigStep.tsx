import { useState } from 'react';
import { Home, Upload, Palette, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// VirtualStagingConfigStep doesn't need external props currently
// All state is managed internally

interface StagingStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const STAGING_STYLES: StagingStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Klare Linien, minimalistisch, zeitgenössisch',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'classic',
    name: 'Klassisch',
    description: 'Zeitlose Eleganz, traditionelle Möbel',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'scandinavian',
    name: 'Skandinavisch',
    description: 'Hell, funktional, natürliche Materialien',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Gemütlich, eklektisch, farbenfroh',
    imageUrl: '/placeholder.svg'
  }
];

const ROOM_TYPES = [
  { value: 'living', label: 'Wohnzimmer' },
  { value: 'bedroom', label: 'Schlafzimmer' },
  { value: 'kitchen', label: 'Küche' },
  { value: 'dining', label: 'Esszimmer' },
  { value: 'office', label: 'Arbeitszimmer' },
  { value: 'bathroom', label: 'Badezimmer' }
];

export const VirtualStagingConfigStep = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'style' | 'details'>('upload');
  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>('');
  const [variations, setVariations] = useState(1);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileUpload = (files: FileList) => {
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

  const pricePerImage = 49;
  const pricePerVariation = 25;
  const baseTotal = uploadedImageCount * pricePerImage;
  const variationsTotal = uploadedImageCount * (variations - 1) * pricePerVariation;
  const totalPrice = baseTotal + variationsTotal;

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Home className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold">Verwandeln Sie leere Räume</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Virtuelles Home Staging für aussagekräftige Immobilienpräsentation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
        {['upload', 'style', 'details'].map((step, idx) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              currentStep === step 
                ? 'bg-primary text-primary-foreground' 
                : uploadedImageCount > 0 && idx === 0 || selectedStyle && idx === 1
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}>
              {idx + 1}. {step === 'upload' ? 'Upload' : step === 'style' ? 'Stil' : 'Details'}
            </div>
            {idx < 2 && (
              <div className="w-8 h-0.5 bg-border mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {currentStep === 'upload' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Schritt 1: Leere Räume hochladen
            </CardTitle>
            <CardDescription>
              Laden Sie Fotos Ihrer leeren oder ungünstig eingerichteten Räume hoch
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      input.accept = 'image/jpeg,image/png';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) handleFileUpload(files);
                      };
                      input.click();
                    }}
                  >
                    Dateien auswählen
                  </Button>
                </>
              ) : (
                <>
                  <Check className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">
                    {uploadedImageCount} Bilder hochgeladen
                  </h3>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'image/jpeg,image/png';
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) handleFileUpload(files);
                        };
                        input.click();
                      }}
                    >
                      Weitere hinzufügen
                    </Button>
                    <Button onClick={() => setCurrentStep('style')}>
                      Weiter zum Stil
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Style Selection */}
      {currentStep === 'style' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold flex items-center justify-center gap-2">
              <Palette className="w-6 h-6" />
              Schritt 2: Wählen Sie Ihren Einrichtungsstil
            </h3>
            <p className="text-muted-foreground">
              Wählen Sie den Stil, der am besten zu Ihrer Immobilie passt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGING_STYLES.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStyle === style.id
                    ? 'border-primary border-2'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl">{style.id === 'modern' ? '🏢' : style.id === 'classic' ? '🏛️' : style.id === 'scandinavian' ? '🌲' : '🌺'}</div>
                  {selectedStyle === style.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {style.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => setCurrentStep('upload')}>
              Zurück
            </Button>
            <Button onClick={() => setCurrentStep('details')} disabled={!selectedStyle}>
              Weiter zu Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {currentStep === 'details' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">
              Schritt 3: Details festlegen
            </h3>
            <p className="text-muted-foreground">
              Spezifizieren Sie Raumtyp und gewünschte Variationen
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Raumtyp</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie einen Raumtyp" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map(room => (
                      <SelectItem key={room.value} value={room.value}>
                        {room.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Anzahl Variationen pro Raum</label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(num => (
                    <Button
                      key={num}
                      variant={variations === num ? 'default' : 'outline'}
                      onClick={() => setVariations(num)}
                      className="flex-1"
                    >
                      {num} {num === 1 ? 'Variation' : 'Variationen'}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Zusätzliche Variationen: +{pricePerVariation}€ pro Bild
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => setCurrentStep('style')}>
              Zurück
            </Button>
          </div>
        </div>
      )}

      {/* Summary Card */}
      {uploadedImageCount > 0 && selectedStyle && roomType && (
        <Card className="max-w-md mx-auto sticky bottom-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Zusammenfassung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Anzahl Räume</span>
              <span className="font-semibold">{uploadedImageCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Stil</span>
              <span className="font-semibold capitalize">{STAGING_STYLES.find(s => s.id === selectedStyle)?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Raumtyp</span>
              <span className="font-semibold">{ROOM_TYPES.find(r => r.value === roomType)?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Variationen</span>
              <span className="font-semibold">{variations} pro Raum</span>
            </div>

            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Basis ({uploadedImageCount} × {pricePerImage}€)</span>
                <span className="font-semibold">{baseTotal}€</span>
              </div>
              {variations > 1 && (
                <div className="flex justify-between text-sm">
                  <span>Zusatzvariationen</span>
                  <span className="font-semibold">+{variationsTotal}€</span>
                </div>
              )}
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
