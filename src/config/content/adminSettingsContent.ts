/**
 * Admin Settings Content Module
 * 
 * This module contains all UI text strings for the admin website settings page.
 * Centralizing content here enables:
 * - Easy text updates without touching component logic
 * - Future internationalization (i18n) readiness
 * - Consistent terminology across all tabs
 * 
 * Structure follows the tab organization:
 * - page: Page-level content (header, meta)
 * - tabs: Tab navigation labels
 * - general: GeneralSettingsTab content
 * - design: DesignSettingsTab content
 * - seo: SeoSettingsTab content
 * - pages: PageSeoTab content
 * - tracking: TrackingSettingsTab content
 */

export const adminSettingsContent = {
  // Page-level content
  page: {
    title: 'Website-Einstellungen - Admin',
    heading: 'Website-Einstellungen',
    description: 'Verwalten Sie Design, SEO, Tracking und allgemeine Website-Einstellungen'
  },

  // Tab navigation
  tabs: {
    general: 'Allgemein',
    design: 'Design',
    seo: 'SEO',
    pages: 'Seiten',
    tracking: 'Tracking'
  },

  // GeneralSettingsTab content
  general: {
    sections: {
      basic: {
        title: 'Grundeinstellungen',
        description: 'Name, Beschreibung und Branding Ihrer Website'
      },
      contact: {
        title: 'Kontaktdaten',
        description: 'E-Mail, Telefon und Adresse'
      },
      social: {
        title: 'Social Media',
        description: 'Links zu Ihren Social-Media-Profilen'
      }
    },
    fields: {
      siteName: {
        label: 'Website-Name',
        placeholder: 'SpaceSeller'
      },
      siteDescription: {
        label: 'Kurzbeschreibung',
        placeholder: 'Professionelle Immobilienfotografie'
      },
      logo: {
        label: 'Logo',
        uploadLabel: 'Logo hochladen',
        hint: 'PNG, JPG, SVG oder WebP bis 2MB'
      },
      favicon: {
        label: 'Favicon',
        uploadLabel: 'Favicon hochladen',
        hint: 'PNG, ICO oder SVG bis 1MB (empfohlen: 32x32px)'
      },
      email: {
        label: 'E-Mail',
        placeholder: 'kontakt@spaceseller.de'
      },
      phone: {
        label: 'Telefon',
        placeholder: '+49 123 456789'
      },
      address: {
        label: 'Adresse',
        streetPlaceholder: 'Straße und Hausnummer',
        postalCodePlaceholder: 'PLZ',
        cityPlaceholder: 'Stadt',
        countryPlaceholder: 'Land'
      },
      facebook: {
        label: 'Facebook',
        placeholder: 'https://facebook.com/...'
      },
      instagram: {
        label: 'Instagram',
        placeholder: 'https://instagram.com/...'
      },
      linkedin: {
        label: 'LinkedIn',
        placeholder: 'https://linkedin.com/...'
      },
      youtube: {
        label: 'YouTube',
        placeholder: 'https://youtube.com/...'
      }
    },
    actions: {
      save: 'Einstellungen speichern'
    }
  },

  // DesignSettingsTab content
  design: {
    sections: {
      colors: {
        title: 'Farbschema',
        description: 'Passen Sie die Farben Ihrer Website an (HSL-Format: H S% L%)'
      },
      typography: {
        title: 'Typografie',
        description: 'Schriftart und Texteinstellungen'
      }
    },
    colorLabels: {
      primary: 'Primärfarbe',
      secondary: 'Sekundärfarbe',
      accent: 'Akzentfarbe',
      background: 'Hintergrund',
      foreground: 'Vordergrund/Text',
      muted: 'Gedämpft',
      destructive: 'Fehler/Warnung'
    },
    fields: {
      fontFamily: {
        label: 'Schriftfamilie',
        placeholder: 'Gilroy'
      },
      fontSize: {
        label: 'Basisschriftgröße',
        placeholder: '16px'
      },
      lineHeight: {
        label: 'Zeilenhöhe',
        placeholder: '1.5'
      }
    },
    preview: {
      livePreview: 'Live-Vorschau',
      typographyPreview: 'Typografie-Vorschau',
      mutedText: 'Dies ist gedämpfter Text auf gedämpftem Hintergrund.',
      bodyText: 'Dies ist normaler Fließtext mit der konfigurierten Schriftart.',
      smallText: 'Kleinerer Text für Beschreibungen und Hinweise.',
      heading1: 'Überschrift 1',
      heading2: 'Überschrift 2',
      heading3: 'Überschrift 3'
    },
    actions: {
      reset: 'Zurücksetzen',
      save: 'Änderungen speichern',
      saving: 'Speichern...'
    },
    buttons: {
      primary: 'Primary Button',
      secondary: 'Secondary',
      outline: 'Outline',
      destructive: 'Destructive'
    }
  },

  // SeoSettingsTab content
  seo: {
    sections: {
      basic: {
        title: 'Standard SEO-Einstellungen',
        description: 'Standard Meta-Tags für alle Seiten ohne individuelle Einstellungen'
      },
      openGraph: {
        title: 'Open Graph (Social Media)',
        description: 'Wie Ihre Seite auf Facebook, LinkedIn etc. angezeigt wird'
      },
      robots: {
        title: 'robots.txt',
        description: 'Anweisungen für Suchmaschinen-Crawler'
      },
      structuredData: {
        title: 'Strukturierte Daten (JSON-LD)',
        description: 'Schema.org Markup für erweiterte Suchergebnisse'
      }
    },
    fields: {
      title: {
        label: 'Standard Title',
        placeholder: 'SpaceSeller - Immobilienfotografie & Visualisierung',
        charCount: 'Zeichen'
      },
      description: {
        label: 'Standard Meta Description',
        placeholder: 'Professionelle Immobilienfotografie...',
        charCount: 'Zeichen'
      },
      titleSuffix: {
        label: 'Title Suffix',
        placeholder: ' | SpaceSeller'
      },
      canonicalDomain: {
        label: 'Kanonische Domain',
        placeholder: 'https://spaceseller.de'
      },
      keywords: {
        label: 'Standard Keywords',
        placeholder: 'Keyword hinzufügen...',
        addButton: 'Hinzufügen'
      },
      ogType: {
        label: 'OG Type',
        placeholder: 'website'
      },
      ogLocale: {
        label: 'OG Locale',
        placeholder: 'de_DE'
      },
      ogImage: {
        label: 'Standard OG Image URL',
        placeholder: 'https://spaceseller.de/og-image.jpg'
      },
      robotsTxt: {
        placeholder: `User-agent: *
Disallow: /admin-backend/
Allow: /`
      },
      structuredData: {
        placeholder: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "SpaceSeller"
}`
      }
    },
    preview: {
      title: 'Google Suchergebnis-Vorschau',
      titleFallback: 'Seitentitel',
      domainFallback: 'https://example.com',
      descriptionFallback: 'Meta-Beschreibung der Seite...'
    },
    errors: {
      invalidJson: 'Ungültiges JSON in Strukturierten Daten'
    },
    actions: {
      save: 'Änderungen speichern',
      saving: 'Speichern...'
    }
  },

  // PageSeoTab content
  pages: {
    sections: {
      main: {
        title: 'Seiten-spezifische SEO',
        description: 'Individuelle SEO-Einstellungen für jede Seite'
      }
    },
    table: {
      headers: {
        page: 'Seite',
        path: 'Pfad',
        title: 'Title',
        status: 'Status',
        actions: 'Aktionen'
      },
      status: {
        default: 'Standard',
        indexed: 'indexiert',
        noindex: 'noindex',
        nofollow: 'nofollow'
      }
    },
    dialogs: {
      create: {
        title: 'Neue Seite hinzufügen',
        description: 'SEO-Einstellungen für eine neue Seite konfigurieren'
      },
      edit: {
        titlePrefix: 'Seite bearbeiten:'
      }
    },
    fields: {
      path: {
        label: 'Pfad',
        placeholder: '/neue-seite'
      },
      pageName: {
        label: 'Seitenname',
        placeholder: 'Neue Seite'
      },
      title: {
        label: 'Title',
        placeholder: 'Seitentitel | SpaceSeller',
        charCount: 'Zeichen'
      },
      description: {
        label: 'Description',
        placeholder: 'Meta-Beschreibung...',
        charCount: 'Zeichen'
      },
      keywords: {
        label: 'Keywords',
        placeholder: 'Keyword hinzufügen...'
      },
      noIndex: {
        label: 'No Index'
      },
      noFollow: {
        label: 'No Follow'
      },
      priority: {
        label: 'Priorität (0.0 - 1.0)'
      },
      changeFrequency: {
        label: 'Änderungsfrequenz',
        placeholder: 'monthly'
      }
    },
    actions: {
      newPage: 'Neue Seite',
      cancel: 'Abbrechen',
      create: 'Erstellen',
      save: 'Speichern'
    }
  },

  // TrackingSettingsTab content
  tracking: {
    sections: {
      master: {
        title: 'Tracking aktivieren',
        description: 'Tracking-Scripte auf Ihrer Website ein- oder ausschalten'
      },
      googleAnalytics: {
        title: 'Google Analytics 4',
        description: 'Website-Analyse und Besucherstatistiken'
      },
      tagManager: {
        title: 'Google Tag Manager',
        description: 'Zentrales Tag-Management für alle Marketing-Tags'
      },
      googleAds: {
        title: 'Google Ads Conversion Tracking',
        description: 'Conversion-Tracking für Google Ads Kampagnen'
      },
      facebookPixel: {
        title: 'Facebook/Meta Pixel',
        description: 'Tracking für Facebook und Instagram Ads'
      },
      otherServices: {
        title: 'Weitere Tracking-Dienste',
        description: 'LinkedIn Insight Tag und Hotjar'
      },
      conversionEvents: {
        title: 'Conversion Events',
        description: 'Welche Events sollen als Conversions getrackt werden?'
      }
    },
    toggles: {
      enabled: {
        label: 'Tracking aktiviert',
        descriptionOn: 'Alle konfigurierten Tracking-Dienste werden geladen',
        descriptionOff: 'Alle konfigurierten Tracking-Dienste werden nicht geladen'
      },
      cookieConsent: {
        label: 'Cookie-Einwilligung erforderlich',
        description: 'Tracking erst nach Cookie-Zustimmung laden (DSGVO)'
      }
    },
    fields: {
      googleAnalyticsId: {
        label: 'Mess-ID (GA4)',
        placeholder: 'G-XXXXXXXXXX'
      },
      tagManagerId: {
        label: 'Container-ID',
        placeholder: 'GTM-XXXXXXX'
      },
      googleAdsId: {
        label: 'Conversion-ID',
        placeholder: 'AW-XXXXXXXXXX'
      },
      googleAdsLabel: {
        label: 'Conversion-Label',
        placeholder: 'xxxxxxxxx'
      },
      facebookPixelId: {
        label: 'Pixel-ID',
        placeholder: 'XXXXXXXXXXXXXXXX'
      },
      linkedinInsightTag: {
        label: 'LinkedIn Insight Tag',
        placeholder: 'Partner-ID'
      },
      hotjarId: {
        label: 'Hotjar ID',
        placeholder: 'XXXXXXX'
      }
    },
    events: {
      orderCompleted: 'Bestellung abgeschlossen',
      signupCompleted: 'Registrierung abgeschlossen',
      contactFormSubmitted: 'Kontaktformular gesendet'
    },
    badges: {
      active: 'Tracking aktiv',
      inactive: 'Tracking deaktiviert'
    },
    alerts: {
      gdprWarning: 'Achtung: Tracking ohne Cookie-Einwilligung kann gegen DSGVO verstoßen!'
    },
    actions: {
      save: 'Änderungen speichern',
      saving: 'Speichern...'
    }
  },

  // Common/shared content
  common: {
    loading: 'Laden...',
    saving: 'Speichern...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    reset: 'Zurücksetzen'
  }
} as const;

// Type exports for TypeScript support
export type AdminSettingsContent = typeof adminSettingsContent;
