interface OrderUpgrade {
  id: string;
  quantity: number;
  total_price: number;
  upgrades?: {
    name: string;
    description?: string;
  };
}

interface OrderUpgradesSectionProps {
  upgrades: OrderUpgrade[];
}

export const OrderUpgradesSection = ({ upgrades }: OrderUpgradesSectionProps) => {
  if (upgrades.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-3">Zusatzleistungen (Add-Ons)</h3>
      <div className="space-y-2">
        {upgrades.map((upgrade) => (
          <div key={upgrade.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border border-border/50">
            <div>
              <p className="font-medium">{upgrade.upgrades?.name}</p>
              {upgrade.upgrades?.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{upgrade.upgrades.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">Menge: {upgrade.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-primary">{upgrade.total_price.toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
