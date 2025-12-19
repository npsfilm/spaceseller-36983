import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Search, Share2, Globe, FileText, X } from 'lucide-react';
import type { SeoSettings, OpenGraphSettings, TwitterCardSettings } from '@/types/siteSettings';

interface SeoSettingsTabProps {
  settings: SeoSettings | null;
  saving: boolean;
  onUpdate: (updates: Partial<SeoSettings>) => Promise<boolean>;
}

export function SeoSettingsTab({ settings, saving, onUpdate }: SeoSettingsTabProps) {
  const [formData, setFormData] = useState({
    default_title: '',
    default_description: '',
    title_suffix: '',
    canonical_domain: '',
    robots_txt: '',
    keywords: [] as string[],
    og_type: 'website',
    og_locale: 'de_DE',
    og_image: '',
    twitter_card: 'summary_large_image',
    twitter_site: '',
    structured_data: ''
  });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (settings) {
      const og = settings.open_graph || {} as OpenGraphSettings;
      const twitter = settings.twitter_card || {} as TwitterCardSettings;
      
      setFormData({
        default_title: settings.default_title || '',
        default_description: settings.default_description || '',
        title_suffix: settings.title_suffix || '',
        canonical_domain: settings.canonical_domain || '',
        robots_txt: settings.robots_txt || '',
        keywords: settings.default_keywords || [],
        og_type: og.type || 'website',
        og_locale: og.locale || 'de_DE',
        og_image: og.image || '',
        twitter_card: twitter.card || 'summary_large_image',
        twitter_site: twitter.site || '',
        structured_data: settings.structured_data 
          ? JSON.stringify(settings.structured_data, null, 2) 
          : ''
      });
    }
  }, [settings]);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleSave = async () => {
    let structuredData = null;
    try {
      if (formData.structured_data.trim()) {
        structuredData = JSON.parse(formData.structured_data);
      }
    } catch {
      alert('Ungültiges JSON in Strukturierten Daten');
      return;
    }

    await onUpdate({
      default_title: formData.default_title,
      default_description: formData.default_description,
      default_keywords: formData.keywords,
      title_suffix: formData.title_suffix,
      canonical_domain: formData.canonical_domain,
      robots_txt: formData.robots_txt,
      open_graph: {
        type: formData.og_type,
        locale: formData.og_locale,
        image: formData.og_image || undefined
      },
      twitter_card: {
        card: formData.twitter_card,
        site: formData.twitter_site || undefined
      },
      structured_data: structuredData
    });
  };

  const titleLength = formData.default_title.length;
  const descriptionLength = formData.default_description.length;

  return (
    <div className="space-y-6">
      {/* Basic SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Standard SEO-Einstellungen
          </CardTitle>
          <CardDescription>
            Standard Meta-Tags für alle Seiten ohne individuelle Einstellungen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default_title">
              Standard Title 
              <span className={`ml-2 text-xs ${titleLength > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                ({titleLength}/60 Zeichen)
              </span>
            </Label>
            <Input
              id="default_title"
              value={formData.default_title}
              onChange={(e) => setFormData(prev => ({ ...prev, default_title: e.target.value }))}
              placeholder="SpaceSeller - Immobilienfotografie & Visualisierung"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_description">
              Standard Meta Description
              <span className={`ml-2 text-xs ${descriptionLength > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
                ({descriptionLength}/160 Zeichen)
              </span>
            </Label>
            <Textarea
              id="default_description"
              value={formData.default_description}
              onChange={(e) => setFormData(prev => ({ ...prev, default_description: e.target.value }))}
              placeholder="Professionelle Immobilienfotografie..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title_suffix">Title Suffix</Label>
              <Input
                id="title_suffix"
                value={formData.title_suffix}
                onChange={(e) => setFormData(prev => ({ ...prev, title_suffix: e.target.value }))}
                placeholder=" | SpaceSeller"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonical_domain">Kanonische Domain</Label>
              <Input
                id="canonical_domain"
                value={formData.canonical_domain}
                onChange={(e) => setFormData(prev => ({ ...prev, canonical_domain: e.target.value }))}
                placeholder="https://spaceseller.de"
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Standard Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="Keyword hinzufügen..."
              />
              <Button type="button" variant="outline" onClick={handleAddKeyword}>
                Hinzufügen
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <button onClick={() => handleRemoveKeyword(keyword)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Google Preview */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Google Suchergebnis-Vorschau</h4>
            <div className="bg-background p-3 rounded border">
              <p className="text-primary text-lg leading-tight">
                {formData.default_title || 'Seitentitel'}
              </p>
              <p className="text-green-700 text-sm">
                {formData.canonical_domain || 'https://example.com'}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {formData.default_description || 'Meta-Beschreibung der Seite...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Open Graph (Social Media)
          </CardTitle>
          <CardDescription>
            Wie Ihre Seite auf Facebook, LinkedIn etc. angezeigt wird
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="og_type">OG Type</Label>
              <Input
                id="og_type"
                value={formData.og_type}
                onChange={(e) => setFormData(prev => ({ ...prev, og_type: e.target.value }))}
                placeholder="website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og_locale">OG Locale</Label>
              <Input
                id="og_locale"
                value={formData.og_locale}
                onChange={(e) => setFormData(prev => ({ ...prev, og_locale: e.target.value }))}
                placeholder="de_DE"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="og_image">Standard OG Image URL</Label>
            <Input
              id="og_image"
              value={formData.og_image}
              onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
              placeholder="https://spaceseller.de/og-image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* robots.txt */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            robots.txt
          </CardTitle>
          <CardDescription>
            Anweisungen für Suchmaschinen-Crawler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.robots_txt}
            onChange={(e) => setFormData(prev => ({ ...prev, robots_txt: e.target.value }))}
            rows={10}
            className="font-mono text-sm"
            placeholder="User-agent: *
Disallow: /admin-backend/
Allow: /"
          />
        </CardContent>
      </Card>

      {/* Structured Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Strukturierte Daten (JSON-LD)
          </CardTitle>
          <CardDescription>
            Schema.org Markup für erweiterte Suchergebnisse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.structured_data}
            onChange={(e) => setFormData(prev => ({ ...prev, structured_data: e.target.value }))}
            rows={10}
            className="font-mono text-sm"
            placeholder='{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SpaceSeller"
}'
          />
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
