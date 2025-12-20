import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Globe, Mail, Phone, MapPin, Share2, Loader2 } from 'lucide-react';
import type { SiteSettings, AddressInfo, SocialLinks } from '@/types/siteSettings';
import { AssetUploadZone } from './AssetUploadZone';
import { adminSettingsContent } from '@/config/content/adminSettingsContent';

const content = adminSettingsContent.general;

interface GeneralSettingsTabProps {
  settings: SiteSettings | null;
  saving: boolean;
  onUpdate: (updates: Partial<SiteSettings>) => Promise<boolean>;
}

export const GeneralSettingsTab = ({ settings, saving, onUpdate }: GeneralSettingsTabProps) => {
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    logo_url: '',
    favicon_url: '',
    contact_email: '',
    contact_phone: '',
    address_street: '',
    address_city: '',
    address_postal_code: '',
    address_country: 'Deutschland',
    social_facebook: '',
    social_instagram: '',
    social_linkedin: '',
    social_twitter: '',
    social_youtube: ''
  });

  useEffect(() => {
    if (settings) {
      const address = settings.address || {} as AddressInfo;
      const social = settings.social_links || {} as SocialLinks;
      
      setFormData({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address_street: address.street || '',
        address_city: address.city || '',
        address_postal_code: address.postal_code || '',
        address_country: address.country || 'Deutschland',
        social_facebook: social.facebook || '',
        social_instagram: social.instagram || '',
        social_linkedin: social.linkedin || '',
        social_twitter: social.twitter || '',
        social_youtube: social.youtube || ''
      });
    }
  }, [settings]);

  const handleSave = async () => {
    const address: AddressInfo = {
      street: formData.address_street,
      city: formData.address_city,
      postal_code: formData.address_postal_code,
      country: formData.address_country
    };

    const social_links: SocialLinks = {
      facebook: formData.social_facebook || undefined,
      instagram: formData.social_instagram || undefined,
      linkedin: formData.social_linkedin || undefined,
      twitter: formData.social_twitter || undefined,
      youtube: formData.social_youtube || undefined
    };

    await onUpdate({
      site_name: formData.site_name,
      site_description: formData.site_description,
      logo_url: formData.logo_url || null,
      favicon_url: formData.favicon_url || null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      address,
      social_links
    });
  };

  return (
    <div className="space-y-6">
      {/* Grundeinstellungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {content.sections.basic.title}
          </CardTitle>
          <CardDescription>
            {content.sections.basic.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="site_name">{content.fields.siteName.label}</Label>
              <Input
                id="site_name"
                value={formData.site_name}
                onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                placeholder={content.fields.siteName.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">{content.fields.siteDescription.label}</Label>
              <Input
                id="site_description"
                value={formData.site_description}
                onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
                placeholder={content.fields.siteDescription.placeholder}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{content.fields.logo.label}</Label>
              <AssetUploadZone
                label={content.fields.logo.uploadLabel}
                currentUrl={formData.logo_url}
                folder="branding"
                maxSizeMB={2}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] }}
                hint={content.fields.logo.hint}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{content.fields.favicon.label}</Label>
              <AssetUploadZone
                label={content.fields.favicon.uploadLabel}
                currentUrl={formData.favicon_url}
                folder="branding"
                maxSizeMB={1}
                accept={{ 'image/*': ['.png', '.ico', '.svg'] }}
                hint={content.fields.favicon.hint}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, favicon_url: url }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kontaktdaten */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {content.sections.contact.title}
          </CardTitle>
          <CardDescription>
            {content.sections.contact.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {content.fields.email.label}
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder={content.fields.email.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {content.fields.phone.label}
              </Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder={content.fields.phone.placeholder}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {content.fields.address.label}
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formData.address_street}
                onChange={(e) => setFormData(prev => ({ ...prev, address_street: e.target.value }))}
                placeholder={content.fields.address.streetPlaceholder}
              />
              <Input
                value={formData.address_postal_code}
                onChange={(e) => setFormData(prev => ({ ...prev, address_postal_code: e.target.value }))}
                placeholder={content.fields.address.postalCodePlaceholder}
              />
              <Input
                value={formData.address_city}
                onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
                placeholder={content.fields.address.cityPlaceholder}
              />
              <Input
                value={formData.address_country}
                onChange={(e) => setFormData(prev => ({ ...prev, address_country: e.target.value }))}
                placeholder={content.fields.address.countryPlaceholder}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {content.sections.social.title}
          </CardTitle>
          <CardDescription>
            {content.sections.social.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="social_facebook">{content.fields.facebook.label}</Label>
              <Input
                id="social_facebook"
                value={formData.social_facebook}
                onChange={(e) => setFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
                placeholder={content.fields.facebook.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_instagram">{content.fields.instagram.label}</Label>
              <Input
                id="social_instagram"
                value={formData.social_instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                placeholder={content.fields.instagram.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_linkedin">{content.fields.linkedin.label}</Label>
              <Input
                id="social_linkedin"
                value={formData.social_linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, social_linkedin: e.target.value }))}
                placeholder={content.fields.linkedin.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_youtube">{content.fields.youtube.label}</Label>
              <Input
                id="social_youtube"
                value={formData.social_youtube}
                onChange={(e) => setFormData(prev => ({ ...prev, social_youtube: e.target.value }))}
                placeholder={content.fields.youtube.placeholder}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speichern Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {content.actions.save}
        </Button>
      </div>
    </div>
  );
};
