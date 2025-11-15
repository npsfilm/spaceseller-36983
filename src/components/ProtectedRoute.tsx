import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useIsPhotographer } from '@/hooks/useIsPhotographer';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireAdmin?: boolean;
  requirePhotographer?: boolean;
  requireClient?: boolean;
}

export const ProtectedRoute = ({ children, requireOnboarding = false, requireAdmin = false, requirePhotographer = false, requireClient = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { isPhotographer, loading: photographerLoading } = useIsPhotographer();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && requireOnboarding) {
      const checkOnboarding = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        
        setOnboardingComplete(data?.onboarding_completed ?? false);
        
        if (data && !data.onboarding_completed) {
          navigate('/onboarding');
        }
      };
      
      checkOnboarding();
    }
  }, [user, requireOnboarding, navigate]);

  useEffect(() => {
    if (requireAdmin && !adminLoading && !isAdmin && user) {
      navigate('/');
    }
  }, [requireAdmin, adminLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (requirePhotographer && !photographerLoading && !isPhotographer && user && !isAdmin) {
      navigate('/');
    }
  }, [requirePhotographer, photographerLoading, isPhotographer, isAdmin, user, navigate]);

  useEffect(() => {
    if (requireClient && !adminLoading && !photographerLoading && user) {
      if (isPhotographer && !isAdmin) {
        navigate('/freelancer-dashboard');
      }
    }
  }, [requireClient, adminLoading, photographerLoading, isAdmin, isPhotographer, user, navigate]);

  if (loading || (requireOnboarding && onboardingComplete === null) || (requireAdmin && adminLoading) || (requirePhotographer && photographerLoading) || (requireClient && (adminLoading || photographerLoading))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requirePhotographer && !isPhotographer && !isAdmin) {
    return null;
  }

  if (requireClient && isPhotographer && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
