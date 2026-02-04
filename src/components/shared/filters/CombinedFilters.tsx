import { Card, CardContent } from '@/components/ui/card';
import { SearchFilter, SearchFilterProps } from './SearchFilter';
import { StatusFilter, StatusFilterProps } from './StatusFilter';
import { cn } from '@/lib/utils';

export interface CombinedFiltersProps {
  search: Omit<SearchFilterProps, 'className'>;
  status: Omit<StatusFilterProps, 'className'>;
  className?: string;
  layout?: 'card' | 'inline';
}

export const CombinedFilters = ({
  search,
  status,
  className,
  layout = 'card'
}: CombinedFiltersProps) => {
  const content = (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <SearchFilter {...search} />
      </div>
      <StatusFilter {...status} />
    </div>
  );

  if (layout === 'inline') {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={cn("mb-6", className)}>
      <CardContent className="pt-6">
        {content}
      </CardContent>
    </Card>
  );
};
