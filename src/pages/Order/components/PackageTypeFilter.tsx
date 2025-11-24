import { Camera, Plus, Plane } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PackageType } from '@/types/photography';
import { cn } from '@/lib/utils';

interface PackageTypeFilterProps {
  packageType: PackageType;
  onPackageTypeChange: (type: PackageType) => void;
}

export const PackageTypeFilter = ({ packageType, onPackageTypeChange }: PackageTypeFilterProps) => {
  const options = [
    {
      value: 'photo' as PackageType,
      label: 'Foto',
      icon: Camera,
      description: 'Innenaufnahmen',
    },
    {
      value: 'drone' as PackageType,
      label: 'Drohne',
      icon: Plane,
      description: 'Luftaufnahmen',
    },
    {
      value: 'photo_drone' as PackageType,
      label: 'Foto + Drohne',
      icon: null,
      description: 'Kombination',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = packageType === option.value;
          
          return (
            <Card
              key={option.value}
              onClick={() => onPackageTypeChange(option.value)}
              className={cn(
                "relative cursor-pointer transition-all hover:shadow-lg p-6 text-center",
                isSelected 
                  ? "border-primary border-2 shadow-md bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex flex-col items-center gap-3">
                {option.value === 'photo_drone' ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Camera className="w-6 h-6" />
                    <Plus className="w-4 h-4" />
                    <Plane className="w-6 h-6" />
                  </div>
                ) : Icon && (
                  <Icon className={cn("w-8 h-8", isSelected ? "text-primary" : "text-muted-foreground")} />
                )}
                
                <div>
                  <h4 className={cn("font-semibold text-lg", isSelected && "text-primary")}>
                    {option.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
