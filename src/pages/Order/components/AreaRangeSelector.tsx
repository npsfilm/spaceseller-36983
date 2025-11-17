import { Button } from '@/components/ui/button';

interface AreaRangeSelectorProps {
  selectedRange: string | null;
  onRangeChange: (range: string) => void;
}

const AREA_RANGES = [
  { value: '0-99', label: '0-99 m²' },
  { value: '100-199', label: '100-199 m²' },
  { value: '200-299', label: '200-299 m²' },
  { value: '300-399', label: '300-399 m²' },
  { value: '400+', label: '400+ m²' }
];

export const AreaRangeSelector = ({ selectedRange, onRangeChange }: AreaRangeSelectorProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Wohnfläche</h3>
      <div className="grid grid-cols-1 gap-2">
        {AREA_RANGES.map((range) => (
          <Button
            key={range.value}
            variant={selectedRange === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onRangeChange(range.value)}
            className="w-full justify-start"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
