import { ProductCard } from './ProductCard';
import type { Service } from '../OrderWizard';

interface PhotoProductListProps {
  services: Service[];
  selectedAreaRange: string | null;
  selectedProducts: {
    [serviceId: string]: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }
  };
  onProductToggle: (serviceId: string, quantity: number, unitPrice: number) => void;
}

export const PhotoProductList = ({
  services,
  selectedAreaRange,
  selectedProducts,
  onProductToggle
}: PhotoProductListProps) => {
  // Mock photo products based on area range
  const photoProducts = [
    { id: 'photo-10', name: '10 Fotos', description: 'Hochwertige Immobilienfotos', price: 149 },
    { id: 'photo-10-ext', name: '10 Außenaufnahmen', description: 'Außenansichten der Immobilie', price: 149 },
    { id: 'photo-15', name: '15 Fotos', description: 'Erweiterte Fotoauswahl', price: 199 },
    { id: 'photo-20', name: '20 Fotos', description: 'Umfassende Dokumentation', price: 249 },
    { id: 'drone-4', name: '4 Drohnenfotos', description: 'Luftaufnahmen der Immobilie', price: 99 },
    { id: 'drone-10', name: '10 Drohnenfotos', description: 'Umfassende Luftbilddokumentation', price: 199 },
    { id: 'photo-40', name: '40 Fotos', description: 'Vollständige Dokumentation', price: 399 },
    { id: 'photo-60', name: '60 Fotos', description: 'Premium Fotodokumentation', price: 549 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          Foto {selectedAreaRange ? `(${selectedAreaRange} m²)` : ''}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photoProducts.map((product) => {
          const isSelected = !!selectedProducts[product.id];
          
          return (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              isSelected={isSelected}
              onToggle={() => {
                if (isSelected) {
                  onProductToggle(product.id, 0, product.price);
                } else {
                  onProductToggle(product.id, 1, product.price);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
