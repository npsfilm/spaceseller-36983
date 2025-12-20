import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Palette, Type, RefreshCw } from 'lucide-react';
import type { SiteSettings, ColorSettings, TypographySettings } from '@/types/siteSettings';
import { adminSettingsContent } from '@/config/content/adminSettingsContent';

const content = adminSettingsContent.design;

interface DesignSettingsTabProps {
  settings: SiteSettings | null;
  saving: boolean;
  onUpdate: (updates: Partial<SiteSettings>) => Promise<boolean>;
}

const DEFAULT_COLORS: ColorSettings = {
  primary: "140 30% 30%",
  secondary: "40 20% 94%",
  accent: "150 29% 19%",
  background: "40 30% 98%",
  foreground: "0 0% 10%",
  muted: "40 10% 90%",
  destructive: "0 84% 60%"
};

export function DesignSettingsTab({ settings, saving, onUpdate }: DesignSettingsTabProps) {
  const [colors, setColors] = useState<ColorSettings>(DEFAULT_COLORS);
  const [typography, setTypography] = useState<TypographySettings>({
    font_family: 'Gilroy',
    font_size_base: '16px',
    line_height: '1.5'
  });

  useEffect(() => {
    if (settings) {
      setColors(settings.colors || DEFAULT_COLORS);
      setTypography(settings.typography || {
        font_family: 'Gilroy',
        font_size_base: '16px',
        line_height: '1.5'
      });
    }
  }, [settings]);

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    // Apply live preview
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const handleResetColors = () => {
    setColors(DEFAULT_COLORS);
    Object.entries(DEFAULT_COLORS).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  const handleSave = async () => {
    await onUpdate({
      colors,
      typography
    });
  };

  // Convert HSL string to a rough hex for the color picker preview
  const hslToPreviewColor = (hsl: string): string => {
    try {
      const parts = hsl.split(' ');
      if (parts.length >= 3) {
        const h = parseInt(parts[0]);
        const s = parseInt(parts[1]);
        const l = parseInt(parts[2]);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
    } catch {
      // ignore
    }
    return '#000000';
  };

  return (
    <div className="space-y-6">
      {/* Color Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {content.sections.colors.title}
              </CardTitle>
              <CardDescription>
                {content.sections.colors.description}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetColors}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {content.actions.reset}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`color-${key}`} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: hslToPreviewColor(value) }}
                  />
                  {content.colorLabels[key as keyof typeof content.colorLabels] || key}
                </Label>
                <Input
                  id={`color-${key}`}
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  placeholder="202 100% 50%"
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>

          {/* Live Preview */}
          <div className="mt-6 p-4 rounded-lg border bg-background">
            <h4 className="font-medium mb-4">{content.preview.livePreview}</h4>
            <div className="flex flex-wrap gap-4">
              <Button>{content.buttons.primary}</Button>
              <Button variant="secondary">{content.buttons.secondary}</Button>
              <Button variant="outline">{content.buttons.outline}</Button>
              <Button variant="destructive">{content.buttons.destructive}</Button>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-muted-foreground text-sm">
                {content.preview.mutedText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            {content.sections.typography.title}
          </CardTitle>
          <CardDescription>
            {content.sections.typography.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="font_family">{content.fields.fontFamily.label}</Label>
              <Input
                id="font_family"
                value={typography.font_family}
                onChange={(e) => setTypography(prev => ({ ...prev, font_family: e.target.value }))}
                placeholder={content.fields.fontFamily.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="font_size_base">{content.fields.fontSize.label}</Label>
              <Input
                id="font_size_base"
                value={typography.font_size_base}
                onChange={(e) => setTypography(prev => ({ ...prev, font_size_base: e.target.value }))}
                placeholder={content.fields.fontSize.placeholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line_height">{content.fields.lineHeight.label}</Label>
              <Input
                id="line_height"
                value={typography.line_height}
                onChange={(e) => setTypography(prev => ({ ...prev, line_height: e.target.value }))}
                placeholder={content.fields.lineHeight.placeholder}
              />
            </div>
          </div>

          {/* Typography Preview */}
          <div className="mt-6 p-4 rounded-lg border">
            <h4 className="font-medium mb-3">{content.preview.typographyPreview}</h4>
            <div className="space-y-2" style={{ fontFamily: typography.font_family }}>
              <h1 className="text-3xl font-bold">{content.preview.heading1}</h1>
              <h2 className="text-2xl font-semibold">{content.preview.heading2}</h2>
              <h3 className="text-xl font-medium">{content.preview.heading3}</h3>
              <p className="text-base">
                {content.preview.bodyText}
              </p>
              <p className="text-sm text-muted-foreground">
                {content.preview.smallText}
              </p>
            </div>
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
