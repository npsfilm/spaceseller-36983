import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageTier, AddOn } from '@/types/photography';

interface PhotographySummaryCardProps {
  selectedPackage: PackageTier;
  selectedAddOns: AddOn[];
  travelCost: number;
  totalPrice: number;
}

export const PhotographySummaryCard = ({ 
  selectedPackage, 
  selectedAddOns, 
  travelCost, 
  totalPrice 
}: PhotographySummaryCardProps) => {
  return (
    <Card className="max-w-md mx-auto sticky bottom-4 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Zusammenfassung</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Paket: {selectedPackage.name} ({selectedPackage.photoCount} Fotos)</span>
          <span className="font-semibold">{selectedPackage.price}€</span>
        </div>
        
        {selectedAddOns.length > 0 && (
          <>
            {selectedAddOns.map(addOn => (
              <div key={addOn.id} className="flex justify-between text-sm">
                <span>{addOn.name}</span>
                <span className="font-semibold">+{addOn.price}€</span>
              </div>
            ))}
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
  );
};
