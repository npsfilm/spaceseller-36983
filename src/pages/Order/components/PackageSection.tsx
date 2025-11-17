import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PackageSectionProps {
  selectedPackage: string | null;
  onPackageClick: () => void;
}

export const PackageSection = ({ selectedPackage, onPackageClick }: PackageSectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Pakete</h3>
      <p className="text-xs text-muted-foreground">
        Entscheiden Sie sich für eine Auswahl an vergünstigten Produktkombinationen
      </p>
      
      <Button
        variant={selectedPackage ? 'default' : 'outline'}
        size="sm"
        onClick={onPackageClick}
        className="w-full justify-between"
      >
        <span className="text-xs">Foto - Mehrere Wohnungen an einer Adresse</span>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
