import { Plus } from 'lucide-react';
import { AddOn } from '@/types/photography';
import { AddOnCard } from './AddOnCard';

interface AddOnsListProps {
  addOns: AddOn[];
  selectedAddOnIds: string[];
  onAddOnToggle: (addOnId: string) => void;
}

export const AddOnsList = ({ addOns, selectedAddOnIds, onAddOnToggle }: AddOnsListProps) => {
  return (
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
        {addOns.map((addOn) => (
          <AddOnCard
            key={addOn.id}
            addOn={addOn}
            isSelected={selectedAddOnIds.includes(addOn.id)}
            onToggle={() => onAddOnToggle(addOn.id)}
          />
        ))}
      </div>
    </div>
  );
};
