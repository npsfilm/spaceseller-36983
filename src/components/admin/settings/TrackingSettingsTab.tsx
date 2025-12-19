import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, BarChart, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { SeaSettings, ConversionEvents } from '@/types/siteSettings';

interface TrackingSettingsTabProps {
  settings: SeaSettings | null;
  saving: boolean;
  onUpdate: (updates: Partial<SeaSettings>) => Promise<boolean>;
}

export function TrackingSettingsTab({ settings, saving, onUpdate }: TrackingSettingsTabProps) {
  const [formData, setFormData] = useState({
    enabled: false,
    cookie_consent_required: true,
    google_analytics_id: '',
    google_tag_manager_id: '',
    google_ads_id: '',
    google_ads_conversion_label: '',
    facebook_pixel_id: '',
    linkedin_insight_tag: '',
    hotjar_id: '',
    conversion_order: true,
    conversion_signup: true,
    conversion_contact: true
  });

  useEffect(() => {
    if (settings) {
      const events = settings.conversion_events || {} as ConversionEvents;
      
      setFormData({
        enabled: settings.enabled,
        cookie_consent_required: settings.cookie_consent_required,
        google_analytics_id: settings.google_analytics_id || '',
        google_tag_manager_id: settings.google_tag_manager_id || '',
        google_ads_id: settings.google_ads_id || '',
        google_ads_conversion_label: settings.google_ads_conversion_label || '',
        facebook_pixel_id: settings.facebook_pixel_id || '',
        linkedin_insight_tag: settings.linkedin_insight_tag || '',
        hotjar_id: settings.hotjar_id || '',
        conversion_order: events.order_completed ?? true,
        conversion_signup: events.signup_completed ?? true,
        conversion_contact: events.contact_form_submitted ?? true
      });
    }
  }, [settings]);

  const handleSave = async () => {
    await onUpdate({
      enabled: formData.enabled,
      cookie_consent_required: formData.cookie_consent_required,
      google_analytics_id: formData.google_analytics_id || null,
      google_tag_manager_id: formData.google_tag_manager_id || null,
      google_ads_id: formData.google_ads_id || null,
      google_ads_conversion_label: formData.google_ads_conversion_label || null,
      facebook_pixel_id: formData.facebook_pixel_id || null,
      linkedin_insight_tag: formData.linkedin_insight_tag || null,
      hotjar_id: formData.hotjar_id || null,
      conversion_events: {
        order_completed: formData.conversion_order,
        signup_completed: formData.conversion_signup,
        contact_form_submitted: formData.conversion_contact
      }
    });
  };

  const hasAnyTracking = !!(
    formData.google_analytics_id ||
    formData.google_tag_manager_id ||
    formData.google_ads_id ||
    formData.facebook_pixel_id ||
    formData.linkedin_insight_tag ||
    formData.hotjar_id
  );

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Tracking aktivieren
          </CardTitle>
          <CardDescription>
            Tracking-Scripte auf Ihrer Website ein- oder ausschalten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Tracking aktiviert</Label>
              <p className="text-sm text-muted-foreground">
                Alle konfigurierten Tracking-Dienste werden {formData.enabled ? 'geladen' : 'nicht geladen'}
              </p>
            </div>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Cookie-Einwilligung erforderlich</Label>
              <p className="text-sm text-muted-foreground">
                Tracking erst nach Cookie-Zustimmung laden (DSGVO)
              </p>
            </div>
            <Switch
              checked={formData.cookie_consent_required}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, cookie_consent_required: checked }))}
            />
          </div>

          {!formData.cookie_consent_required && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Achtung: Tracking ohne Cookie-Einwilligung kann gegen DSGVO verstoßen!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 flex-wrap">
            {formData.enabled ? (
              <Badge className="bg-green-100 text-green-800">Tracking aktiv</Badge>
            ) : (
              <Badge variant="secondary">Tracking deaktiviert</Badge>
            )}
            {hasAnyTracking && (
              <Badge variant="outline">{
                [
                  formData.google_analytics_id && 'GA4',
                  formData.google_tag_manager_id && 'GTM',
                  formData.google_ads_id && 'Ads',
                  formData.facebook_pixel_id && 'FB',
                  formData.linkedin_insight_tag && 'LI',
                  formData.hotjar_id && 'Hotjar'
                ].filter(Boolean).join(', ')
              }</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Google Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics 4</CardTitle>
          <CardDescription>
            Website-Analyse und Besucherstatistiken
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_analytics_id">Mess-ID (GA4)</Label>
            <Input
              id="google_analytics_id"
              value={formData.google_analytics_id}
              onChange={(e) => setFormData(prev => ({ ...prev, google_analytics_id: e.target.value }))}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Google Tag Manager */}
      <Card>
        <CardHeader>
          <CardTitle>Google Tag Manager</CardTitle>
          <CardDescription>
            Zentrales Tag-Management für alle Marketing-Tags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_tag_manager_id">Container-ID</Label>
            <Input
              id="google_tag_manager_id"
              value={formData.google_tag_manager_id}
              onChange={(e) => setFormData(prev => ({ ...prev, google_tag_manager_id: e.target.value }))}
              placeholder="GTM-XXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Google Ads */}
      <Card>
        <CardHeader>
          <CardTitle>Google Ads Conversion Tracking</CardTitle>
          <CardDescription>
            Conversion-Tracking für Google Ads Kampagnen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="google_ads_id">Conversion-ID</Label>
              <Input
                id="google_ads_id"
                value={formData.google_ads_id}
                onChange={(e) => setFormData(prev => ({ ...prev, google_ads_id: e.target.value }))}
                placeholder="AW-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_ads_conversion_label">Conversion-Label</Label>
              <Input
                id="google_ads_conversion_label"
                value={formData.google_ads_conversion_label}
                onChange={(e) => setFormData(prev => ({ ...prev, google_ads_conversion_label: e.target.value }))}
                placeholder="xxxxxxxxx"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facebook Pixel */}
      <Card>
        <CardHeader>
          <CardTitle>Facebook/Meta Pixel</CardTitle>
          <CardDescription>
            Tracking für Facebook und Instagram Ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="facebook_pixel_id">Pixel-ID</Label>
            <Input
              id="facebook_pixel_id"
              value={formData.facebook_pixel_id}
              onChange={(e) => setFormData(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
              placeholder="XXXXXXXXXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn & Hotjar */}
      <Card>
        <CardHeader>
          <CardTitle>Weitere Tracking-Dienste</CardTitle>
          <CardDescription>
            LinkedIn Insight Tag und Hotjar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin_insight_tag">LinkedIn Insight Tag</Label>
              <Input
                id="linkedin_insight_tag"
                value={formData.linkedin_insight_tag}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_insight_tag: e.target.value }))}
                placeholder="Partner-ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotjar_id">Hotjar ID</Label>
              <Input
                id="hotjar_id"
                value={formData.hotjar_id}
                onChange={(e) => setFormData(prev => ({ ...prev, hotjar_id: e.target.value }))}
                placeholder="XXXXXXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Events */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Events</CardTitle>
          <CardDescription>
            Welche Events sollen als Conversions getrackt werden?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Bestellung abgeschlossen</Label>
            <Switch
              checked={formData.conversion_order}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, conversion_order: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Registrierung abgeschlossen</Label>
            <Switch
              checked={formData.conversion_signup}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, conversion_signup: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Kontaktformular gesendet</Label>
            <Switch
              checked={formData.conversion_contact}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, conversion_contact: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Speichern...' : 'Änderungen speichern'}
        </Button>
      </div>
    </div>
  );
}
