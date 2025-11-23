import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AddOn } from '@/types/photography';

interface AddOnCardProps {
  addOn: AddOn;
  isSelected: boolean;
  onToggle: () => void;
}

export const AddOnCard = ({ addOn, isSelected, onToggle }: AddOnCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/30'
      }`}
      onClick={onToggle}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={onToggle}
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
  );
};
