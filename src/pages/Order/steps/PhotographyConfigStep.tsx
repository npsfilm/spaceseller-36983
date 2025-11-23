import { useState } from 'react';
import { Camera, Plus, Check, Plane } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PackageType, PackageTier, AddOn } from '@/types/photography';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';
import { filterPackagesByType, calculateAddOnsTotal, calculateTotalPrice } from '@/lib/photographyPricing';

interface PhotographyConfigStepProps {
  selectedPackage: string | null;
  travelCost: number;
  onPackageSelect: (packageId: string | null) => void;
}


export const PhotographyConfigStep = ({
  selectedPackage,
  travelCost,
  onPackageSelect
}: PhotographyConfigStepProps) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [packageType, setPackageType] = useState<PackageType>('photo');
  const [photoCount, setPhotoCount] = useState<number>(10);

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

  const filteredPackages = filterPackagesByType(PACKAGE_TIERS, packageType);
  const selectedPackageData = filteredPackages.find(p => p.id === selectedPackage);
  
  const addOnsTotal = calculateAddOnsTotal(selectedAddOns, ADD_ONS);
  const totalPrice = calculateTotalPrice(selectedPackageData?.price || 0, addOnsTotal, travelCost);

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

      {/* Photo Count Slider - Only for photo packages */}
      {packageType === 'photo' && (
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-full h-12 w-12 text-lg">
              {photoCount}
            </span>
          </div>
          <Slider
            value={[photoCount]}
            onValueChange={(value) => setPhotoCount(value[0])}
            min={6}
            max={50}
            step={1}
            className="flex-1"
          />
        </div>
      )}

      {/* Package Cards Carousel */}
      <div className="max-w-6xl mx-auto px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {filteredPackages.map((pkg) => (
              <CarouselItem key={pkg.id} className="md:basis-1/3">
                <Card 
                  className={`relative cursor-pointer transition-all hover:shadow-lg h-full ${
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
                      {pkg.photoCount} {pkg.breakdown ? `(${pkg.breakdown})` : 'Fotos'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-primary">
                        {pkg.price}€
                      </div>
                      <p className="text-sm text-muted-foreground">
                        einmalig • {(pkg.price / pkg.photoCount).toFixed(2)}€/Foto
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
              <span>Paket: {selectedPackageData?.name} ({selectedPackageData.photoCount} Fotos)</span>
              <span className="font-semibold">{selectedPackageData.price}€</span>
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
