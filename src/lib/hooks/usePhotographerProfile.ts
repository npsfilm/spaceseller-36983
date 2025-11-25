import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { ProfileCompletenessService, ProfileCompletenessResult } from '@/lib/services/ProfileCompletenessService';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface UsePhotographerProfileResult extends ProfileCompletenessResult {
  profile: Profile | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching photographer profile and checking completeness
 */
export const usePhotographerProfile = (): UsePhotographerProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completeness, setCompleteness] = useState<ProfileCompletenessResult>({
    isComplete: false,
    missingFields: [],
    completionPercentage: 0,
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        setCompleteness(ProfileCompletenessService.checkProfile(null));
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setCompleteness(ProfileCompletenessService.checkProfile(data));
    } catch (error) {
      console.error('Error fetching photographer profile:', error);
      setProfile(null);
      setCompleteness(ProfileCompletenessService.checkProfile(null));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Set up realtime subscription for profile updates
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          const updatedProfile = payload.new as Profile;
          setProfile(updatedProfile);
          setCompleteness(ProfileCompletenessService.checkProfile(updatedProfile));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    profile,
    isLoading,
    isComplete: completeness.isComplete,
    missingFields: completeness.missingFields,
    completionPercentage: completeness.completionPercentage,
    refresh: fetchProfile,
  };
};
