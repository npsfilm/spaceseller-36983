import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsPhotographer = () => {
  const [isPhotographer, setIsPhotographer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkPhotographerStatus();
  }, [user]);

  const checkPhotographerStatus = async () => {
    if (!user) {
      console.log('[useIsPhotographer] No user, setting isPhotographer to false');
      setIsPhotographer(false);
      setLoading(false);
      return;
    }

    console.log('[useIsPhotographer] Checking photographer status for user:', user.id);

    try {
      const { data, error } = await (supabase as any).rpc('is_photographer', {
        _user_id: user.id
      });

      console.log('[useIsPhotographer] RPC result:', { data, error });

      if (error) {
        console.error('[useIsPhotographer] RPC error:', error);
        setIsPhotographer(false);
      } else if (data === true) {
        console.log('[useIsPhotographer] User IS photographer');
        setIsPhotographer(true);
      } else {
        console.log('[useIsPhotographer] User is NOT photographer');
        setIsPhotographer(false);
      }
    } catch (error) {
      console.error('[useIsPhotographer] Exception checking photographer status:', error);
      setIsPhotographer(false);
    }
    
    setLoading(false);
  };

  return { isPhotographer, loading };
};
