import { Plus, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

interface ProductCategoryCollapsibleProps {
  activeCategory: string | null;
  selectedProducts: {
    [serviceId: string]: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }
  };
  onCategoryClick: (category: string) => void;
}

const CATEGORIES = [
  { id: 'floor_plan', label: 'Grundriss & Aufmaß' },
  { id: 'photo', label: 'Foto' },
  { id: 'video', label: 'Video' },
  { id: 'virtual_tour', label: 'Virtuelle Tour' }
];

export const ProductCategoryCollapsible = ({
  activeCategory,
  selectedProducts,
  onCategoryClick
}: ProductCategoryCollapsibleProps) => {
  const [openCategories, setOpenCategories] = useState<string[]>(['photo']);

  const hasSelectedProducts = (categoryId: string) => {
    return Object.keys(selectedProducts).some(key => key.includes(categoryId));
  };

  const toggleCategory = (categoryId: string) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-semibold text-foreground mb-3">Kategorien</h3>
      {CATEGORIES.map((category) => {
        const isOpen = openCategories.includes(category.id);
        const isActive = activeCategory === category.id;
        const hasSelected = hasSelectedProducts(category.id);

        return (
          <Collapsible
            key={category.id}
            open={isOpen}
            onOpenChange={() => toggleCategory(category.id)}
          >
            <CollapsibleTrigger asChild>
              <button
                onClick={() => onCategoryClick(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <span className="text-sm font-medium">{category.label}</span>
                <div className="flex items-center gap-2">
                  {hasSelected && (
                    <Trash2 className="w-4 h-4 text-destructive" />
                  )}
                  <Plus className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 pl-4">
              <p className="text-xs text-muted-foreground">
                Klicken Sie auf die Kategorie, um Produkte anzuzeigen
              </p>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
