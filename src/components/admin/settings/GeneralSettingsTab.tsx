import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Globe, Mail, Phone, MapPin, Share2 } from 'lucide-react';
import type { SiteSettings, SocialLinks, AddressInfo } from '@/types/siteSettings';

interface GeneralSettingsTabProps {
  settings: SiteSettings | null;
  saving: boolean;
  onUpdate: (updates: Partial<SiteSettings>) => Promise<boolean>;
}

export function GeneralSettingsTab({ settings, saving, onUpdate }: GeneralSettingsTabProps) {
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
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Grundeinstellungen
          </CardTitle>
          <CardDescription>
            Name, Beschreibung und Branding Ihrer Website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="site_name">Website-Name</Label>
              <Input
                id="site_name"
                value={formData.site_name}
                onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                placeholder="SpaceSeller"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Kurzbeschreibung</Label>
              <Input
                id="site_description"
                value={formData.site_description}
                onChange={(e) => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
                placeholder="Professionelle Immobilienfotografie"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                placeholder="/spaceseller-logo.png"
              />
              {formData.logo_url && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <img 
                    src={formData.logo_url} 
                    alt="Logo Preview" 
                    className="max-h-12 object-contain"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon_url">Favicon URL</Label>
              <Input
                id="favicon_url"
                value={formData.favicon_url}
                onChange={(e) => setFormData(prev => ({ ...prev, favicon_url: e.target.value }))}
                placeholder="/favicon.ico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Kontaktdaten
          </CardTitle>
          <CardDescription>
            E-Mail, Telefon und Adresse für Impressum und Kontaktseite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email">E-Mail</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="info@spaceseller.de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefon</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="+49 123 456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Adresse</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formData.address_street}
                onChange={(e) => setFormData(prev => ({ ...prev, address_street: e.target.value }))}
                placeholder="Straße und Hausnummer"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={formData.address_postal_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_postal_code: e.target.value }))}
                  placeholder="PLZ"
                />
                <Input
                  value={formData.address_city}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
                  placeholder="Stadt"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media
          </CardTitle>
          <CardDescription>
            Links zu Ihren Social-Media-Profilen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="social_facebook">Facebook</Label>
              <Input
                id="social_facebook"
                value={formData.social_facebook}
                onChange={(e) => setFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
                placeholder="https://facebook.com/spaceseller"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_instagram">Instagram</Label>
              <Input
                id="social_instagram"
                value={formData.social_instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                placeholder="https://instagram.com/spaceseller"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_linkedin">LinkedIn</Label>
              <Input
                id="social_linkedin"
                value={formData.social_linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, social_linkedin: e.target.value }))}
                placeholder="https://linkedin.com/company/spaceseller"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_youtube">YouTube</Label>
              <Input
                id="social_youtube"
                value={formData.social_youtube}
                onChange={(e) => setFormData(prev => ({ ...prev, social_youtube: e.target.value }))}
                placeholder="https://youtube.com/@spaceseller"
              />
            </div>
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
