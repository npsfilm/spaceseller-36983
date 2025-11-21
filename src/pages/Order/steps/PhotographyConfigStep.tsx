import { useState } from 'react';
import { Camera, Plus, Check, Plane } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PhotographyConfigStepProps {
  selectedPackage: string | null;
  travelCost: number;
  onPackageSelect: (packageId: string | null) => void;
}

type PackageType = 'photo' | 'drone' | 'photo_drone';

interface PackageTier {
  id: string;
  name: string;
  type: PackageType;
  pricePerPhoto: number;
  features: string[];
  popular?: boolean;
}

const PACKAGE_TIERS: PackageTier[] = [
  {
    id: 'basic',
    name: 'Basis',
    type: 'photo',
    pricePerPhoto: 8.5,
    features: [
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    type: 'photo',
    pricePerPhoto: 7.2,
    popular: true,
    features: [
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    type: 'photo',
    pricePerPhoto: 6.5,
    features: [
      'Professionelle Bildbearbeitung',
      'Express-Lieferung 24h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive',
      'Twilight-Aufnahmen (2 Bilder)'
    ]
  },
  {
    id: 'drone_basic',
    name: 'Basis',
    type: 'drone',
    pricePerPhoto: 12.0,
    features: [
      'Luftaufnahmen in 4K',
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie'
    ]
  },
  {
    id: 'drone_standard',
    name: 'Standard',
    type: 'drone',
    pricePerPhoto: 10.5,
    popular: true,
    features: [
      'Luftaufnahmen in 4K',
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive'
    ]
  },
  {
    id: 'drone_premium',
    name: 'Premium',
    type: 'drone',
    pricePerPhoto: 9.0,
    features: [
      'Luftaufnahmen in 4K',
      'Professionelle Bildbearbeitung',
      'Express-Lieferung 24h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive',
      '360° Panorama'
    ]
  },
  {
    id: 'combo_basic',
    name: 'Basis',
    type: 'photo_drone',
    pricePerPhoto: 9.5,
    features: [
      'Foto & Drohne kombiniert',
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie'
    ]
  },
  {
    id: 'combo_standard',
    name: 'Standard',
    type: 'photo_drone',
    pricePerPhoto: 8.2,
    popular: true,
    features: [
      'Foto & Drohne kombiniert',
      'Professionelle Bildbearbeitung',
      'Lieferung innerhalb 48h',
      'Online-Galerie',
      'HDR-Bearbeitung inklusive'
    ]
  },
  {
    id: 'combo_premium',
    name: 'Premium',
    type: 'photo_drone',
    pricePerPhoto: 7.5,
    features: [
      'Foto & Drohne kombiniert',
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
  const [photoCount, setPhotoCount] = useState<number>(20);
  const [packageType, setPackageType] = useState<PackageType>('photo');

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

  const filteredPackages = PACKAGE_TIERS.filter(p => p.type === packageType);
  const selectedPackageData = filteredPackages.find(p => p.id === selectedPackage);
  
  const calculatePrice = (pricePerPhoto: number) => Math.round(pricePerPhoto * photoCount);
  
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addOn = ADD_ONS.find(a => a.id === id);
    return sum + (addOn?.price || 0);
  }, 0);
  const totalPrice = (selectedPackageData ? calculatePrice(selectedPackageData.pricePerPhoto) : 0) + addOnsTotal + travelCost;

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

      {/* Package Type Filter */}
      <div className="max-w-2xl mx-auto">
        <Tabs value={packageType} onValueChange={(value) => {
          setPackageType(value as PackageType);
          onPackageSelect(null); // Reset selection when changing type
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photo" className="gap-2">
              <Camera className="w-4 h-4" />
              Foto
            </TabsTrigger>
            <TabsTrigger value="drone" className="gap-2">
              <Plane className="w-4 h-4" />
              Drohne
            </TabsTrigger>
            <TabsTrigger value="photo_drone" className="gap-2">
              <Camera className="w-4 h-4" />
              <Plus className="w-3 h-3" />
              <Plane className="w-4 h-4" />
              Foto + Drohne
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Photo Count Slider */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Anzahl der Fotos</label>
            <span className="text-2xl font-bold text-primary">{photoCount} Fotos</span>
          </div>
          <Slider
            value={[photoCount]}
            onValueChange={(values) => setPhotoCount(values[0])}
            min={5}
            max={50}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 Fotos</span>
            <span>50 Fotos</span>
          </div>
        </div>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredPackages.map((pkg) => {
          const packagePrice = calculatePrice(pkg.pricePerPhoto);
          return (
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
                {photoCount} Fotos • {pkg.pricePerPhoto.toFixed(2)}€ pro Foto
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-4xl font-bold text-primary">
                  {packagePrice}€
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
          );
        })}
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
              <span>Paket: {selectedPackageData?.name} ({photoCount} Fotos)</span>
              <span className="font-semibold">{calculatePrice(selectedPackageData.pricePerPhoto)}€</span>
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
