import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StatusOption {
  value: string;
  label: string;
  count?: number;
}

export interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  variant?: 'select' | 'tabs';
  placeholder?: string;
  className?: string;
}

export const StatusFilter = ({
  value,
  onChange,
  options,
  variant = 'select',
  placeholder = 'Status filtern',
  className
}: StatusFilterProps) => {
  if (variant === 'tabs') {
    return (
      <Tabs value={value} onValueChange={onChange} className={className}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          {options.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="gap-2">
              {option.label}
              {option.count !== undefined && (
                <Badge variant="secondary" className="ml-1">{option.count}</Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full md:w-[200px]", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
