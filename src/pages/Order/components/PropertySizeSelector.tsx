import { Home, Building, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PropertySize } from '@/types/photography';

interface PropertySizeSelectorProps {
  selectedSize: PropertySize | null;
  onSizeChange: (size: PropertySize) => void;
}

export const PropertySizeSelector = ({ selectedSize, onSizeChange }: PropertySizeSelectorProps) => {
  const sizes = [
    {
      id: 'klein' as PropertySize,
      label: 'Klein',
      icon: Home,
      description: 'bis 80m²',
      range: '6-15 Fotos'
    },
    {
      id: 'mittel' as PropertySize,
      label: 'Mittel',
      icon: Building,
      description: '80-150m²',
      range: '10-25 Fotos'
    },
    {
      id: 'gross' as PropertySize,
      label: 'Groß',
      icon: Building2,
      description: '150m²+',
      range: '20-50 Fotos'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Wie groß ist Ihre Immobilie?</h3>
        <p className="text-sm text-muted-foreground">Wir empfehlen passende Pakete für Ihre Objektgröße</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sizes.map((size) => {
          const Icon = size.icon;
          const isSelected = selectedSize === size.id;
          
          return (
            <Card
              key={size.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onSizeChange(size.id)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-full ${
                  isSelected ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                </div>
                
                <div>
                  <h4 className={`font-semibold text-lg mb-1 ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {size.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">{size.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{size.range}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
