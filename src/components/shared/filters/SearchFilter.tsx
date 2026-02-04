import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showIcon?: boolean;
}

export const SearchFilter = ({
  value,
  onChange,
  placeholder = 'Suche...',
  className,
  showIcon = false
}: SearchFilterProps) => {
  return (
    <div className={cn("relative", className)}>
      {showIcon && (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(showIcon && "pl-10")}
      />
    </div>
  );
};
