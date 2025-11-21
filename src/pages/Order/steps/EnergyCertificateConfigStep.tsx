import { useState } from 'react';
import { FileCheck, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// EnergyCertificateConfigStep doesn't need external props currently
// All state is managed internally

const HEATING_TYPES = [
  { value: 'gas', label: 'Gasheizung' },
  { value: 'oil', label: 'Ölheizung' },
  { value: 'district', label: 'Fernwärme' },
  { value: 'electric', label: 'Elektroheizung' },
  { value: 'heat_pump', label: 'Wärmepumpe' },
  { value: 'other', label: 'Sonstiges' }
];

export const EnergyCertificateConfigStep = () => {
  const [certificateType, setCertificateType] = useState<'verbrauch' | 'bedarf'>('verbrauch');
  const [buildingYear, setBuildingYear] = useState('');
  const [livingArea, setLivingArea] = useState('');
  const [units, setUnits] = useState('');
  const [heatingType, setHeatingType] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState(0);

  const handleFileUpload = (files: FileList) => {
    setUploadedDocs(prev => prev + files.length);
  };

  const price = certificateType === 'verbrauch' ? 99 : 149;
  const deliveryTime = certificateType === 'verbrauch' ? '3-5 Werktage' : '5-7 Werktage';

  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <FileCheck className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold">Energieausweis bestellen</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Gesetzlich vorgeschriebener Energieausweis für Ihre Immobilie
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Certificate Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Ausweistyp wählen</CardTitle>
              <CardDescription>
                Wählen Sie den passenden Energieausweis für Ihre Immobilie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={certificateType} onValueChange={(value: 'verbrauch' | 'bedarf') => setCertificateType(value)}>
                <div className="space-y-3">
                  <div className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    certificateType === 'verbrauch' ? 'border-primary bg-primary/5' : 'border-border'
                  }`} onClick={() => setCertificateType('verbrauch')}>
                    <RadioGroupItem value="verbrauch" id="verbrauch" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="verbrauch" className="font-semibold cursor-pointer">
                        Verbrauchsausweis
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Basiert auf dem tatsächlichen Energieverbrauch der letzten 3 Jahre. 
                        Günstiger und schneller verfügbar.
                      </p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-sm font-semibold text-primary">99€</span>
                        <span className="text-sm text-muted-foreground">• 3-5 Werktage</span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    certificateType === 'bedarf' ? 'border-primary bg-primary/5' : 'border-border'
                  }`} onClick={() => setCertificateType('bedarf')}>
                    <RadioGroupItem value="bedarf" id="bedarf" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="bedarf" className="font-semibold cursor-pointer">
                        Bedarfsausweis
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Basiert auf der baulichen Beschaffenheit und technischen Ausstattung. 
                        Präziser, aber aufwendiger in der Erstellung.
                      </p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-sm font-semibold text-primary">149€</span>
                        <span className="text-sm text-muted-foreground">• 5-7 Werktage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Building Information */}
          <Card>
            <CardHeader>
              <CardTitle>Gebäudeinformationen</CardTitle>
              <CardDescription>
                Geben Sie die wichtigsten Daten zu Ihrer Immobilie an
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingYear">Baujahr</Label>
                  <Input
                    id="buildingYear"
                    type="number"
                    placeholder="z.B. 1985"
                    value={buildingYear}
                    onChange={(e) => setBuildingYear(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livingArea">Wohnfläche (m²)</Label>
                  <Input
                    id="livingArea"
                    type="number"
                    placeholder="z.B. 120"
                    value={livingArea}
                    onChange={(e) => setLivingArea(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Anzahl Wohneinheiten</Label>
                  <Input
                    id="units"
                    type="number"
                    placeholder="z.B. 1"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heatingType">Heizungsart</Label>
                  <Select value={heatingType} onValueChange={setHeatingType}>
                    <SelectTrigger id="heatingType">
                      <SelectValue placeholder="Wählen Sie..." />
                    </SelectTrigger>
                    <SelectContent>
                      {HEATING_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload (Optional) */}
          <Card>
            <CardHeader>
              <CardTitle>Dokumente hochladen (optional)</CardTitle>
              <CardDescription>
                Laden Sie vorhandene Dokumente hoch (Grundrisse, Heizkostenabrechnungen, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all">
                {uploadedDocs === 0 ? (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Dokumente hochladen
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'application/pdf,image/jpeg,image/png';
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
                    <FileCheck className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <p className="text-sm font-semibold mb-3">
                      {uploadedDocs} Dokument{uploadedDocs > 1 ? 'e' : ''} hochgeladen
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.accept = 'application/pdf,image/jpeg,image/png';
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) handleFileUpload(files);
                        };
                        input.click();
                      }}
                    >
                      Weitere hinzufügen
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Zusammenfassung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ausweistyp</span>
                  <span className="font-semibold capitalize">{certificateType === 'verbrauch' ? 'Verbrauch' : 'Bedarf'}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lieferzeit</span>
                  <span className="font-semibold">{deliveryTime}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Preis</span>
                    <span className="text-2xl font-bold text-primary">{price}€</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <FileCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Erfüllt alle gesetzlichen Anforderungen nach EnEV</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <FileCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Gültig für 10 Jahre ab Ausstellungsdatum</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <FileCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Digitale Zustellung per E-Mail</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
