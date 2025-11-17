import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const ProductCard = ({
  name,
  description,
  price,
  isSelected,
  onToggle
}: ProductCardProps) => {
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
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">{name}</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <p className="text-lg font-bold text-primary">{price.toFixed(2)} €</p>
        </div>
      </div>
    </Card>
  );
};
