import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Globe, Mail, Phone, MapPin, Share2, Loader2 } from 'lucide-react';
import type { SiteSettings, AddressInfo, SocialLinks } from '@/types/siteSettings';
import { AssetUploadZone } from './AssetUploadZone';

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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Logo</Label>
              <AssetUploadZone
                label="Logo hochladen"
                currentUrl={formData.logo_url}
                folder="branding"
                maxSizeMB={2}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] }}
                hint="PNG, JPG, SVG oder WebP bis 2MB"
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Favicon</Label>
              <AssetUploadZone
                label="Favicon hochladen"
                currentUrl={formData.favicon_url}
                folder="branding"
                maxSizeMB={1}
                accept={{ 'image/*': ['.png', '.ico', '.svg'] }}
                hint="PNG, ICO oder SVG bis 1MB (empfohlen: 32x32px)"
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
            Kontaktdaten
          </CardTitle>
          <CardDescription>
            E-Mail, Telefon und Adresse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                placeholder="kontakt@spaceseller.de"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon
              </Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                placeholder="+49 123 456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formData.address_street}
                onChange={(e) => setFormData(prev => ({ ...prev, address_street: e.target.value }))}
                placeholder="Straße und Hausnummer"
              />
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
              <Input
                value={formData.address_country}
                onChange={(e) => setFormData(prev => ({ ...prev, address_country: e.target.value }))}
                placeholder="Land"
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
            Social Media
          </CardTitle>
          <CardDescription>
            Links zu Ihren Social-Media-Profilen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="social_facebook">Facebook</Label>
              <Input
                id="social_facebook"
                value={formData.social_facebook}
                onChange={(e) => setFormData(prev => ({ ...prev, social_facebook: e.target.value }))}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_instagram">Instagram</Label>
              <Input
                id="social_instagram"
                value={formData.social_instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, social_instagram: e.target.value }))}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_linkedin">LinkedIn</Label>
              <Input
                id="social_linkedin"
                value={formData.social_linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, social_linkedin: e.target.value }))}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_youtube">YouTube</Label>
              <Input
                id="social_youtube"
                value={formData.social_youtube}
                onChange={(e) => setFormData(prev => ({ ...prev, social_youtube: e.target.value }))}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speichern Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Einstellungen speichern
        </Button>
      </div>
    </div>
  );
};
