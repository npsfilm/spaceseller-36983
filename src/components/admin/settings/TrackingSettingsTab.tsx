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
import { adminSettingsContent } from '@/config/content/adminSettingsContent';

const content = adminSettingsContent.tracking;

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
            {content.sections.master.title}
          </CardTitle>
          <CardDescription>
            {content.sections.master.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{content.toggles.enabled.label}</Label>
              <p className="text-sm text-muted-foreground">
                {formData.enabled ? content.toggles.enabled.descriptionOn : content.toggles.enabled.descriptionOff}
              </p>
            </div>
            <Switch
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{content.toggles.cookieConsent.label}</Label>
              <p className="text-sm text-muted-foreground">
                {content.toggles.cookieConsent.description}
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
                {content.alerts.gdprWarning}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 flex-wrap">
            {formData.enabled ? (
              <Badge className="bg-green-100 text-green-800">{content.badges.active}</Badge>
            ) : (
              <Badge variant="secondary">{content.badges.inactive}</Badge>
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
          <CardTitle>{content.sections.googleAnalytics.title}</CardTitle>
          <CardDescription>
            {content.sections.googleAnalytics.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_analytics_id">{content.fields.googleAnalyticsId.label}</Label>
            <Input
              id="google_analytics_id"
              value={formData.google_analytics_id}
              onChange={(e) => setFormData(prev => ({ ...prev, google_analytics_id: e.target.value }))}
              placeholder={content.fields.googleAnalyticsId.placeholder}
            />
          </div>
        </CardContent>
      </Card>

      {/* Google Tag Manager */}
      <Card>
        <CardHeader>
          <CardTitle>{content.sections.tagManager.title}</CardTitle>
          <CardDescription>
            {content.sections.tagManager.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google_tag_manager_id">{content.fields.tagManagerId.label}</Label>
            <Input
              id="google_tag_manager_id"
              value={formData.google_tag_manager_id}
              onChange={(e) => setFormData(prev => ({ ...prev, google_tag_manager_id: e.target.value }))}
              placeholder={content.fields.tagManagerId.placeholder}
            />
          </div>
        </CardContent>
      </Card>

      {/* Google Ads */}
      <Card>
        <CardHeader>
          <CardTitle>{content.sections.googleAds.title}</CardTitle>
          <CardDescription>
            {content.sections.googleAds.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="google_ads_id">{content.fields.googleAdsId.label}</Label>
              <Input
                id="google_ads_id"
                value={formData.google_ads_id}
                onChange={(e) => setFormData(prev => ({ ...prev, google_ads_id: e.target.value }))}
                placeholder={content.fields.googleAdsId.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google_ads_conversion_label">{content.fields.googleAdsLabel.label}</Label>
              <Input
                id="google_ads_conversion_label"
                value={formData.google_ads_conversion_label}
                onChange={(e) => setFormData(prev => ({ ...prev, google_ads_conversion_label: e.target.value }))}
                placeholder={content.fields.googleAdsLabel.placeholder}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facebook Pixel */}
      <Card>
        <CardHeader>
          <CardTitle>{content.sections.facebookPixel.title}</CardTitle>
          <CardDescription>
            {content.sections.facebookPixel.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="facebook_pixel_id">{content.fields.facebookPixelId.label}</Label>
            <Input
              id="facebook_pixel_id"
              value={formData.facebook_pixel_id}
              onChange={(e) => setFormData(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
              placeholder={content.fields.facebookPixelId.placeholder}
            />
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn & Hotjar */}
      <Card>
        <CardHeader>
          <CardTitle>{content.sections.otherServices.title}</CardTitle>
          <CardDescription>
            {content.sections.otherServices.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin_insight_tag">{content.fields.linkedinInsightTag.label}</Label>
              <Input
                id="linkedin_insight_tag"
                value={formData.linkedin_insight_tag}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_insight_tag: e.target.value }))}
                placeholder={content.fields.linkedinInsightTag.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotjar_id">{content.fields.hotjarId.label}</Label>
              <Input
                id="hotjar_id"
                value={formData.hotjar_id}
                onChange={(e) => setFormData(prev => ({ ...prev, hotjar_id: e.target.value }))}
                placeholder={content.fields.hotjarId.placeholder}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Events */}
      <Card>
        <CardHeader>
          <CardTitle>{content.sections.conversionEvents.title}</CardTitle>
          <CardDescription>
            {content.sections.conversionEvents.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{content.events.orderCompleted}</Label>
            <Switch
              checked={formData.conversion_order}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, conversion_order: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>{content.events.signupCompleted}</Label>
            <Switch
              checked={formData.conversion_signup}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, conversion_signup: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>{content.events.contactFormSubmitted}</Label>
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
          {saving ? content.actions.saving : content.actions.save}
        </Button>
      </div>
    </div>
  );
}
