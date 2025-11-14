import { useIsAdmin } from './useIsAdmin';
import { useIsPhotographer } from './useIsPhotographer';

export type UserRole = 'admin' | 'photographer' | 'client' | null;

export const useUserRole = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { isPhotographer, loading: photographerLoading } = useIsPhotographer();

  const loading = adminLoading || photographerLoading;

  const role: UserRole = loading 
    ? null 
    : isAdmin 
      ? 'admin' 
      : isPhotographer 
        ? 'photographer' 
        : 'client';

  return { role, loading };
};
