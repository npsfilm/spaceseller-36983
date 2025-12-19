// Type definitions for website settings

export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  destructive: string;
  [key: string]: string;
}

export interface TypographySettings {
  font_family: string;
  font_size_base: string;
  line_height: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface AddressInfo {
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  colors: ColorSettings;
  typography: TypographySettings;
  social_links: SocialLinks;
  contact_email: string | null;
  contact_phone: string | null;
  address: AddressInfo | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface OpenGraphSettings {
  type: string;
  locale: string;
  image?: string;
}

export interface TwitterCardSettings {
  card: string;
  site?: string;
  creator?: string;
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  name: string;
  [key: string]: unknown;
}

export interface SeoSettings {
  id: string;
  default_title: string;
  default_description: string | null;
  default_keywords: string[] | null;
  title_suffix: string | null;
  open_graph: OpenGraphSettings;
  twitter_card: TwitterCardSettings;
  robots_txt: string | null;
  canonical_domain: string | null;
  structured_data: StructuredData | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PageSeo {
  id: string;
  page_path: string;
  page_name: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  og_image: string | null;
  structured_data: StructuredData | null;
  no_index: boolean;
  no_follow: boolean;
  canonical_url: string | null;
  priority: number;
  change_frequency: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ConversionEvents {
  order_completed: boolean;
  signup_completed: boolean;
  contact_form_submitted: boolean;
  [key: string]: boolean;
}

export interface SeaSettings {
  id: string;
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
  google_ads_id: string | null;
  google_ads_conversion_label: string | null;
  facebook_pixel_id: string | null;
  linkedin_insight_tag: string | null;
  hotjar_id: string | null;
  conversion_events: ConversionEvents;
  cookie_consent_required: boolean;
  enabled: boolean;
  created_at: string | null;
  updated_at: string | null;
}
