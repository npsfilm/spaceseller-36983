import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  variant?: 'default' | 'dashboard' | 'form' | 'admin';
}

export const PageSkeleton = ({ variant = 'default' }: PageSkeletonProps) => {
  if (variant === 'dashboard') {
    return (
      <div className="min-h-screen bg-background p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (variant === 'admin') {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar skeleton */}
        <div className="w-64 border-r p-4 space-y-4 hidden lg:block">
          <Skeleton className="h-10 w-32" />
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        {/* Main content skeleton */}
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="min-h-screen bg-background p-8 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-32" />
      </div>
    );
  }

  // Default spinner
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
};

export default PageSkeleton;
