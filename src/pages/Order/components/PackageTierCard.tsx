import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface PackageTierCardProps {
  units: number;
  currentPrice: number;
  originalPrice: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const PackageTierCard = ({
  units,
  currentPrice,
  originalPrice,
  isSelected,
  onToggle
}: PackageTierCardProps) => {
  const savingsPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-foreground">
            {units} Wohnungen - 10 Fotos pro Wohnung
          </h4>
          
          <div className="flex items-baseline gap-3">
            <p className="text-xl font-bold text-primary">
              {currentPrice.toFixed(2)} €
            </p>
            <p className="text-sm text-muted-foreground line-through">
              {originalPrice.toFixed(2)} €
            </p>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {savingsPercent}% Ersparnis
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
