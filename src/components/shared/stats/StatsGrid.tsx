import { cn } from "@/lib/utils";
import { UnifiedStatCard } from "./StatCard";
import type { StatsGridProps } from "./types";

export const StatsGrid = ({ 
  stats, 
  columns = { default: 1, sm: 2, md: 2, lg: 4 },
  variant = 'static',
  gap = 6,
  className 
}: StatsGridProps) => {
  const gridCols = cn(
    "grid",
    columns.default === 1 && "grid-cols-1",
    columns.default === 2 && "grid-cols-2",
    columns.default === 3 && "grid-cols-3",
    columns.default === 4 && "grid-cols-4",
    columns.sm === 2 && "sm:grid-cols-2",
    columns.sm === 3 && "sm:grid-cols-3",
    columns.sm === 4 && "sm:grid-cols-4",
    columns.md === 2 && "md:grid-cols-2",
    columns.md === 3 && "md:grid-cols-3",
    columns.md === 4 && "md:grid-cols-4",
    columns.lg === 2 && "lg:grid-cols-2",
    columns.lg === 3 && "lg:grid-cols-3",
    columns.lg === 4 && "lg:grid-cols-4",
    gap === 4 && "gap-4",
    gap === 6 && "gap-6",
    gap === 8 && "gap-8",
    className
  );

  return (
    <div className={gridCols}>
      {stats.map((stat, index) => (
        <UnifiedStatCard
          key={stat.title + index}
          {...stat}
          variant={stat.variant || variant}
        />
      ))}
    </div>
  );
};
