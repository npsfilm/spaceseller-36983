import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  SiteSettings, 
  SeoSettings, 
  SeaSettings, 
  PageSeo 
} from '@/types/siteSettings';

export function useSiteSettingsAdmin() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [seaSettings, setSeaSettings] = useState<SeaSettings | null>(null);
  const [pageSeoList, setPageSeoList] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const [siteRes, seoRes, seaRes, pageRes] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('seo_settings').select('*').limit(1).maybeSingle(),
        supabase.from('sea_settings').select('*').limit(1).maybeSingle(),
        supabase.from('page_seo').select('*').order('page_path')
      ]);

      if (siteRes.error) throw siteRes.error;
      if (seoRes.error) throw seoRes.error;
      if (seaRes.error) throw seaRes.error;
      if (pageRes.error) throw pageRes.error;

      setSiteSettings(siteRes.data as unknown as SiteSettings | null);
      setSeoSettings(seoRes.data as unknown as SeoSettings | null);
      setSeaSettings(seaRes.data as unknown as SeaSettings | null);
      setPageSeoList((pageRes.data || []) as unknown as PageSeo[]);

    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    if (!siteSettings?.id) return false;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('site_settings')
        .update(updates as Record<string, unknown>)
        .eq('id', siteSettings.id);

      if (error) throw error;
      
      setSiteSettings(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateSeoSettings = async (updates: Partial<SeoSettings>) => {
    if (!seoSettings?.id) return false;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('seo_settings')
        .update(updates as Record<string, unknown>)
        .eq('id', seoSettings.id);

      if (error) throw error;
      
      setSeoSettings(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating SEO settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateSeaSettings = async (updates: Partial<SeaSettings>) => {
    if (!seaSettings?.id) return false;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('sea_settings')
        .update(updates as Record<string, unknown>)
        .eq('id', seaSettings.id);

      if (error) throw error;
      
      setSeaSettings(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      console.error('Error updating SEA settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updatePageSeo = async (pageId: string, updates: Partial<PageSeo>) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('page_seo')
        .update(updates as Record<string, unknown>)
        .eq('id', pageId);

      if (error) throw error;
      
      setPageSeoList(prev => 
        prev.map(p => p.id === pageId ? { ...p, ...updates } : p)
      );
      return true;
    } catch (err) {
      console.error('Error updating page SEO:', err);
      setError(err instanceof Error ? err.message : 'Failed to update');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const createPageSeo = async (data: Omit<PageSeo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      const { data: newPage, error } = await supabase
        .from('page_seo')
        .insert([data as Record<string, unknown>])
        .select()
        .single();

      if (error) throw error;
      
      setPageSeoList(prev => [...prev, newPage as unknown as PageSeo]);
      return true;
    } catch (err) {
      console.error('Error creating page SEO:', err);
      setError(err instanceof Error ? err.message : 'Failed to create');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deletePageSeo = async (pageId: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('page_seo')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      
      setPageSeoList(prev => prev.filter(p => p.id !== pageId));
      return true;
    } catch (err) {
      console.error('Error deleting page SEO:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    siteSettings,
    seoSettings,
    seaSettings,
    pageSeoList,
    loading,
    saving,
    error,
    refetch: fetchSettings,
    updateSiteSettings,
    updateSeoSettings,
    updateSeaSettings,
    updatePageSeo,
    createPageSeo,
    deletePageSeo
  };
}
