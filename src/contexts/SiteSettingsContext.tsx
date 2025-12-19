import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  SiteSettings, 
  SeoSettings, 
  SeaSettings, 
  PageSeo,
  ColorSettings 
} from '@/types/siteSettings';

interface SiteSettingsContextType {
  siteSettings: SiteSettings | null;
  seoSettings: SeoSettings | null;
  seaSettings: SeaSettings | null;
  pageSeoList: PageSeo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getPageSeo: (path: string) => PageSeo | undefined;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const DEFAULT_COLORS: ColorSettings = {
  primary: "202 100% 50%",
  secondary: "160 84% 39%",
  accent: "38 92% 50%",
  background: "0 0% 100%",
  foreground: "222 47% 11%",
  muted: "210 40% 96%",
  destructive: "0 84% 60%"
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);
  const [seaSettings, setSeaSettings] = useState<SeaSettings | null>(null);
  const [pageSeoList, setPageSeoList] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyColorSettings = (colors: ColorSettings) => {
    const root = document.documentElement;
    
    // Apply each color as a CSS variable
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--${key}`, value);
      }
    });
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all settings in parallel
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

      // Type cast the data
      const siteData = siteRes.data as unknown as SiteSettings | null;
      const seoData = seoRes.data as unknown as SeoSettings | null;
      const seaData = seaRes.data as unknown as SeaSettings | null;
      const pageData = (pageRes.data || []) as unknown as PageSeo[];

      setSiteSettings(siteData);
      setSeoSettings(seoData);
      setSeaSettings(seaData);
      setPageSeoList(pageData);

      // Apply colors if available
      if (siteData?.colors) {
        applyColorSettings(siteData.colors);
      }

    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const getPageSeo = (path: string): PageSeo | undefined => {
    return pageSeoList.find(p => p.page_path === path);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        siteSettings,
        seoSettings,
        seaSettings,
        pageSeoList,
        loading,
        error,
        refetch: fetchSettings,
        getPageSeo
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
