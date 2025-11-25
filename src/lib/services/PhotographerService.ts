import { supabase } from '@/integrations/supabase/client';
import type { CreatePhotographerInput, EditPhotographerInput } from '@/lib/validation/photographerSchemas';

export interface Photographer {
  user_id: string;
  email: string;
  vorname: string;
  nachname: string;
  telefon: string;
  total_assignments: number;
  accepted: number;
  declined: number;
  completed: number;
  acceptance_rate: number;
  kleinunternehmer: boolean;
  berufshaftpflicht_bis: string | null;
  iban: string | null;
  bic: string | null;
  kontoinhaber: string | null;
}

export interface User {
  id: string;
  email: string;
  profiles?: {
    vorname: string;
    nachname: string;
  };
}

/**
 * Service for managing photographers and their roles
 */
export class PhotographerService {
  /**
   * Fetch all photographers with their assignment statistics
   */
  async fetchPhotographers(): Promise<Photographer[]> {
    // Get all users with photographer role
    const { data: photographerRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'photographer');

    if (rolesError) throw rolesError;

    if (!photographerRoles || photographerRoles.length === 0) {
      return [];
    }

    const photographerIds = photographerRoles.map(r => r.user_id);

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, vorname, nachname, telefon, kleinunternehmer, berufshaftpflicht_bis, iban, bic, kontoinhaber')
      .in('id', photographerIds);

    if (profilesError) throw profilesError;

    // Get assignment stats for each photographer
    const photographersWithStats = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: assignments } = await supabase
          .from('order_assignments')
          .select('status')
          .eq('photographer_id', profile.id);

        const total = assignments?.length || 0;
        const accepted = assignments?.filter(a => a.status === 'accepted' || a.status === 'completed').length || 0;
        const declined = assignments?.filter(a => a.status === 'declined').length || 0;
        const completed = assignments?.filter(a => a.status === 'completed').length || 0;
        const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;

        return {
          user_id: profile.id,
          email: profile.email,
          vorname: profile.vorname || '',
          nachname: profile.nachname || '',
          telefon: profile.telefon || '',
          total_assignments: total,
          accepted,
          declined,
          completed,
          acceptance_rate: Math.round(acceptanceRate),
          kleinunternehmer: profile.kleinunternehmer || false,
          berufshaftpflicht_bis: profile.berufshaftpflicht_bis,
          iban: profile.iban,
          bic: profile.bic,
          kontoinhaber: profile.kontoinhaber,
        };
      })
    );

    return photographersWithStats;
  }

  /**
   * Fetch all users who are NOT already photographers
   */
  async fetchNonPhotographerUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, vorname, nachname')
      .order('email');

    if (error) throw error;

    // Get existing photographer IDs
    const { data: photographerRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'photographer');

    const photographerIds = new Set(photographerRoles?.map(r => r.user_id) || []);

    // Filter out users who are already photographers
    const nonPhotographers = (data || []).filter(user => !photographerIds.has(user.id));

    return nonPhotographers.map(user => ({
      id: user.id,
      email: user.email,
      profiles: {
        vorname: user.vorname || '',
        nachname: user.nachname || ''
      }
    }));
  }

  /**
   * Create a new photographer account via edge function
   */
  async createPhotographer(data: CreatePhotographerInput): Promise<{ success: boolean; message: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const { data: result, error } = await supabase.functions.invoke('create-photographer', {
      body: data,
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    // Extract error message
    let errorMessage = '';
    if (error) {
      errorMessage = error.message || 'Unknown error';
    } else if (result?.error) {
      errorMessage = result.error;
    }

    // Check for duplicate email
    if (errorMessage && (errorMessage.includes("already been registered") || errorMessage.includes("email address has already"))) {
      throw new Error('EMAIL_EXISTS');
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    return {
      success: true,
      message: result?.message || 'Fotograf erfolgreich erstellt'
    };
  }

  /**
   * Assign photographer role to an existing user
   */
  async assignPhotographerRole(userId: string): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'photographer',
        created_by: userData?.user?.id
      });

    if (error) throw error;
  }

  /**
   * Remove photographer role from a user
   */
  async removePhotographerRole(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'photographer');

    if (error) throw error;
  }

  /**
   * Fetch full photographer details for editing
   */
  async fetchPhotographerDetails(userId: string): Promise<EditPhotographerInput & { user_id: string }> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('vorname, nachname, telefon, strasse, plz, stadt, land, service_radius_km')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      user_id: userId,
      vorname: profile.vorname || '',
      nachname: profile.nachname || '',
      telefon: profile.telefon || '',
      strasse: profile.strasse || '',
      plz: profile.plz || '',
      stadt: profile.stadt || '',
      land: profile.land || 'Deutschland',
      service_radius_km: profile.service_radius_km || 50
    };
  }

  /**
   * Update photographer information
   */
  async updatePhotographer(userId: string, data: EditPhotographerInput): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({
        vorname: data.vorname,
        nachname: data.nachname,
        telefon: data.telefon || null,
        strasse: data.strasse || null,
        plz: data.plz || null,
        stadt: data.stadt || null,
        land: data.land,
        service_radius_km: data.service_radius_km
      })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Resend password reset link to photographer via Zapier webhook
   */
  async resendPasswordReset(photographerId: string): Promise<{ success: boolean; message: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const { data: result, error } = await supabase.functions.invoke('resend-photographer-password-reset', {
      body: { photographer_id: photographerId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error || result?.error) {
      throw new Error(result?.error || error?.message || 'Failed to resend password reset');
    }

    return {
      success: true,
      message: result?.message || 'Passwort-Reset-Link erfolgreich versendet'
    };
  }
}

// Export singleton instance
export const photographerService = new PhotographerService();
