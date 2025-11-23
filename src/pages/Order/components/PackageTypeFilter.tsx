import { Camera, Plus, Plane } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageType } from '@/types/photography';

interface PackageTypeFilterProps {
  packageType: PackageType;
  onPackageTypeChange: (type: PackageType) => void;
}

export const PackageTypeFilter = ({ packageType, onPackageTypeChange }: PackageTypeFilterProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Tabs 
        value={packageType} 
        onValueChange={(value) => onPackageTypeChange(value as PackageType)}
      >
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
  );
};
