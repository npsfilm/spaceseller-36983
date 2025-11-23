import { Label } from '@/components/ui/label';

interface CustomerInfoSectionProps {
  customer: {
    vorname?: string;
    nachname?: string;
    email?: string;
    telefon?: string;
    firma?: string;
  };
}

export const CustomerInfoSection = ({ customer }: CustomerInfoSectionProps) => {
  return (
    <div>
      <h3 className="font-semibold mb-3">Kundeninformationen</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-muted-foreground">Name</Label>
          <p>{customer.vorname} {customer.nachname}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Email</Label>
          <p>{customer.email}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Telefon</Label>
          <p>{customer.telefon || '-'}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Firma</Label>
          <p>{customer.firma || '-'}</p>
        </div>
      </div>
    </div>
  );
};
