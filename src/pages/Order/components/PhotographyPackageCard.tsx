import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageTier } from '@/types/photography';

interface PhotographyPackageCardProps {
  packageData: PackageTier;
  isSelected: boolean;
  isExactMatch?: boolean;
  onSelect: () => void;
}

export const PhotographyPackageCard = ({ packageData: pkg, isSelected, isExactMatch, onSelect }: PhotographyPackageCardProps) => {
  return (
    <Card 
      className={`relative cursor-pointer transition-all hover:shadow-lg h-full ${
        isSelected 
          ? 'border-primary border-2 shadow-md' 
          : isExactMatch
          ? 'border-primary/60 border-2 shadow-md ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-10">
          Beliebt
        </div>
      )}
      
      {isExactMatch && !isSelected && (
        <div className="absolute -top-3 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold z-10">
          Passt zu Ihrer Auswahl
        </div>
      )}
      
      {isSelected && (
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
  );
};
