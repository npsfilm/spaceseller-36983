import { useState, useEffect } from 'react';
import { photographerService, type Photographer, type User } from '@/lib/services/PhotographerService';
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook for managing photographer data and operations
 */
export const usePhotographerManagement = () => {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchPhotographers(),
      fetchAllUsers()
    ]);
  };

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      const data = await photographerService.fetchPhotographers();
      setPhotographers(data);
    } catch (error) {
      console.error('Error fetching photographers:', error);
      toast({
        title: 'Fehler',
        description: 'Fotografen konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await photographerService.fetchNonPhotographerUsers();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  return {
    photographers,
    allUsers,
    loading,
    refreshData,
    fetchPhotographers,
    fetchAllUsers
  };
};
