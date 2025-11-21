import { useState } from 'react';
import { Camera, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface PhotographyConfigStepProps {
  selectedPackage: string | null;
  travelCost: number;
  onPackageSelect: (packageId: string | null) => void;
}

interface PackageTier {
  id: string;
  name: string;
  photoCount: number;
  price: number;
  features: string[];
  popular?: boolean;
}

const PHOTOGRAPHY_PACKAGES: PackageTier[] = [
  {
    id: 'basic',
    name: 'Basis',
    photoCount: 10,
    price: 129,
    features: [
      '10 hochwertige Fotos',
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    photoCount: 20,
    price: 199,
    popular: true,
    features: [
      '20 hochwertige Fotos',
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    photoCount: 35,
    price: 299,
    features: [
      '35 hochwertige Fotos',
      'Professionelle Bildbearbeitung',
      'Express-Lieferung 24h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive',
      'Twilight-Aufnahmen (2 Bilder)'
    ]
  }
];

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

const ADD_ONS: AddOn[] = [
  {
    id: 'drone',
    name: 'Drohnenaufnahmen',
    description: '5 Luftaufnahmen Ihrer Immobilie',
    price: 89,
    icon: '🚁'
  },
  {
    id: 'video',
    name: 'Video-Tour',
    description: '2-3 Minuten professionelles Immobilienvideo',
    price: 249,
    icon: '🎥'
  },
  {
    id: 'twilight',
    name: 'Twilight-Shooting',
    description: '5 zusätzliche Dämmerungsaufnahmen',
    price: 129,
    icon: '🌆'
  }
];

export const PhotographyConfigStep = ({
  selectedPackage,
  travelCost,
  onPackageSelect
}: PhotographyConfigStepProps) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handlePackageSelect = (packageId: string) => {
    onPackageSelect(packageId === selectedPackage ? null : packageId);
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const selectedPackageData = PHOTOGRAPHY_PACKAGES.find(p => p.id === selectedPackage);
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addOn = ADD_ONS.find(a => a.id === id);
    return sum + (addOn?.price || 0);
  }, 0);
  const totalPrice = (selectedPackageData?.price || 0) + addOnsTotal + travelCost;

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <Camera className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold">Wählen Sie Ihr Fotografie-Paket</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Professionelle Immobilienfotografie für aussagekräftige Exposés
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PHOTOGRAPHY_PACKAGES.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative cursor-pointer transition-all hover:shadow-lg ${
              selectedPackage === pkg.id 
                ? 'border-primary border-2 shadow-md' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handlePackageSelect(pkg.id)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Beliebt
              </div>
            )}
            
            {selectedPackage === pkg.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription className="text-sm">
                {pkg.photoCount} Fotos inklusive
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-4xl font-bold text-primary">
                  {pkg.price}€
                </div>
                <p className="text-sm text-muted-foreground">
                  einmalig
                </p>
              </div>

              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Optionale Zusatzleistungen
          </h3>
          <p className="text-muted-foreground">
            Erweitern Sie Ihr Paket mit professionellen Zusatzservices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADD_ONS.map((addOn) => (
            <Card 
              key={addOn.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedAddOns.includes(addOn.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => handleAddOnToggle(addOn.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={selectedAddOns.includes(addOn.id)}
                    onCheckedChange={() => handleAddOnToggle(addOn.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{addOn.icon}</span>
                      <h4 className="font-semibold">{addOn.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {addOn.description}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      +{addOn.price}€
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      {selectedPackage && (
        <Card className="max-w-md mx-auto sticky bottom-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Zusammenfassung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Paket: {selectedPackageData?.name}</span>
              <span className="font-semibold">{selectedPackageData?.price}€</span>
            </div>
            
            {selectedAddOns.length > 0 && (
              <>
                {selectedAddOns.map(id => {
                  const addOn = ADD_ONS.find(a => a.id === id);
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span>{addOn?.name}</span>
                      <span className="font-semibold">+{addOn?.price}€</span>
                    </div>
                  );
                })}
              </>
            )}

            {travelCost > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Anfahrt inkludiert</span>
                <span>inkl.</span>
              </div>
            )}

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
