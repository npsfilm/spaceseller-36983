import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('[useIsAdmin] No user, setting isAdmin to false');
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    console.log('[useIsAdmin] Checking admin status for user:', user.id);

    try {
      // Call the security definer function
      const { data, error } = await supabase.rpc('is_admin', {
        _user_id: user.id
      });

      console.log('[useIsAdmin] RPC result:', { data, error });

      if (error) {
        console.error('[useIsAdmin] RPC error:', error);
        setIsAdmin(false);
      } else if (data === true) {
        console.log('[useIsAdmin] User IS admin');
        setIsAdmin(true);
      } else {
        console.log('[useIsAdmin] User is NOT admin');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('[useIsAdmin] Exception checking admin status:', error);
      setIsAdmin(false);
    }
    
    setLoading(false);
  };

  return { isAdmin, loading };
};
