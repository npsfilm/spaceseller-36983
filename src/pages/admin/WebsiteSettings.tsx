import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteSettingsAdmin } from '@/lib/hooks/useSiteSettingsAdmin';
import { GeneralSettingsTab } from '@/components/admin/settings/GeneralSettingsTab';
import { DesignSettingsTab } from '@/components/admin/settings/DesignSettingsTab';
import { SeoSettingsTab } from '@/components/admin/settings/SeoSettingsTab';
import { PageSeoTab } from '@/components/admin/settings/PageSeoTab';
import { TrackingSettingsTab } from '@/components/admin/settings/TrackingSettingsTab';
import { Settings, Palette, Search, FileText, BarChart } from 'lucide-react';

export default function WebsiteSettings() {
  const {
    siteSettings,
    seoSettings,
    seaSettings,
    pageSeoList,
    loading,
    saving,
    updateSiteSettings,
    updateSeoSettings,
    updateSeaSettings,
    updatePageSeo,
    createPageSeo,
    deletePageSeo,
    refetch
  } = useSiteSettingsAdmin();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Website-Einstellungen - Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website-Einstellungen</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Design, SEO, Tracking und allgemeine Website-Einstellungen
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Allgemein</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Seiten</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettingsTab 
              settings={siteSettings}
              saving={saving}
              onUpdate={updateSiteSettings}
            />
          </TabsContent>

          <TabsContent value="design">
            <DesignSettingsTab 
              settings={siteSettings}
              saving={saving}
              onUpdate={updateSiteSettings}
            />
          </TabsContent>

          <TabsContent value="seo">
            <SeoSettingsTab 
              settings={seoSettings}
              saving={saving}
              onUpdate={updateSeoSettings}
            />
          </TabsContent>

          <TabsContent value="pages">
            <PageSeoTab 
              pages={pageSeoList}
              saving={saving}
              onUpdate={updatePageSeo}
              onCreate={createPageSeo}
              onDelete={deletePageSeo}
            />
          </TabsContent>

          <TabsContent value="tracking">
            <TrackingSettingsTab 
              settings={seaSettings}
              saving={saving}
              onUpdate={updateSeaSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
