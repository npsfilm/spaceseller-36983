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
      setIsPhotographer(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any).rpc('is_photographer', {
        _user_id: user.id
      });

      if (error) {
        setIsPhotographer(false);
      } else {
        setIsPhotographer(data === true);
      }
    } catch (error) {
      setIsPhotographer(false);
    }
    
    setLoading(false);
  };

  return { isPhotographer, loading };
};
