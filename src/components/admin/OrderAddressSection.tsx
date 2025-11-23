import type { OrderAddress } from '@/lib/services/OrderDetailService';

interface OrderAddressSectionProps {
  addresses: OrderAddress[];
}

export const OrderAddressSection = ({ addresses }: OrderAddressSectionProps) => {
  if (addresses.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-3">Objektadresse</h3>
      {addresses.map((addr) => (
        <div key={addr.id} className="text-sm space-y-1">
          <p>{addr.strasse} {addr.hausnummer}</p>
          <p>{addr.plz} {addr.stadt}</p>
          <p>{addr.land}</p>
          {addr.additional_info && <p className="text-muted-foreground mt-2">{addr.additional_info}</p>}
        </div>
      ))}
    </div>
  );
};
